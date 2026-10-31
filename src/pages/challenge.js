import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  ALL_SCENARIOS_POOL,
  POST_TEST_SCENARIOS,
  PRE_TEST_SCENARIOS,
  DEFAULT_FAMILY_MEMBERS
} from "../data/modusData"

// Algoritma Adaptive Selection:
// 1. Ambil riwayat soal yang pernah muncul & salah dari localStorage
// 2. Prioritaskan soal yang pernah salah (re-test failed scenarios)
// 3. Sertakan soal tricky/high-stakes (difficulty Sulit / trap options) agar user tertantang
// 4. Acak dan hindari soal yang baru saja dijawab benar pada sesi sebelumnya
function pickAdaptiveScenarios(pool, count = 5) {
  let answeredMap = {}
  let failedSet = new Set()

  if (typeof window !== "undefined") {
    try {
      const storedHistory = localStorage.getItem("kenali_challenge_question_history")
      if (storedHistory) {
        answeredMap = JSON.parse(storedHistory) || {}
      }
      const storedFailed = localStorage.getItem("kenali_challenge_failed_scenarios")
      if (storedFailed) {
        failedSet = new Set(JSON.parse(storedFailed) || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Gabungkan semua kumpulan soal valid dan pastikan options terisi
  const validPool = (pool || []).filter((s) => s && s.question && Array.isArray(s.options) && s.options.length >= 2)
  if (validPool.length <= count) {
    return [...validPool].sort(() => Math.random() - 0.5)
  }

  // Pisahkan soal:
  // a. Soal yang pernah dijawab salah sebelumnya (PRIORITAS TINGGI untuk remedial)
  const failedScenarios = validPool.filter((s) => failedSet.has(s.id))

  // b. Soal yang belum pernah dijawab
  const unattempted = validPool.filter((s) => !answeredMap[s.id] && !failedSet.has(s.id))

  // c. Soal tricky (difficulty "Sulit" atau "Sedang")
  const trickyScenarios = validPool.filter(
    (s) => s.difficulty === "Sulit" || s.difficulty === "Tinggi" || s.category === "Quishing (QRIS)" || s.category === "Account Takeover"
  )

  // d. Soal sisa lainnya
  const others = validPool.filter((s) => !failedSet.has(s.id))

  const selected = []
  const selectedIds = new Set()

  const addScenario = (item) => {
    if (item && !selectedIds.has(item.id)) {
      selected.push(item)
      selectedIds.add(item.id)
    }
  }

  // 1. Ambil 1-2 soal yang pernah gagal sebelumnya jika ada
  const shuffledFailed = [...failedScenarios].sort(() => Math.random() - 0.5)
  shuffledFailed.slice(0, 2).forEach(addScenario)

  // 2. Ambil minimal 1-2 soal tricky/sulit (mind-trap) agar tidak mudah dapat 100
  const shuffledTricky = [...trickyScenarios].sort(() => Math.random() - 0.5)
  shuffledTricky.forEach((item) => {
    if (selected.length < count - 1) addScenario(item)
  })

  // 3. Masukkan soal unattempted baru
  const shuffledUnattempted = [...unattempted].sort(() => Math.random() - 0.5)
  shuffledUnattempted.forEach((item) => {
    if (selected.length < count) addScenario(item)
  })

  // 4. Jika masih kurang dari count, ambil dari sisa pool (diurutkan berdasarkan yang paling lama/jarang dijawab)
  const sortedOthers = [...others].sort((a, b) => {
    const timeA = answeredMap[a.id] || 0
    const timeB = answeredMap[b.id] || 0
    return timeA - timeB + (Math.random() - 0.5) * 50
  })

  sortedOthers.forEach((item) => {
    if (selected.length < count) addScenario(item)
  })

  // Acak urutan tampilan soal agar posisi nomor soal selalu bervariasi
  return selected.sort(() => Math.random() - 0.5).slice(0, count)
}

export default function ChallengePage() {
  const router = useRouter()
  const { data: session } = useSession()

  // Stages: 'intro' -> 'test' -> 'result'
  const [stage, setStage] = useState("intro")
  const [participantName, setParticipantName] = useState("Nasabah")
  const [participantAge, setParticipantAge] = useState(25)

  // Master Pool dari gabungan ALL_SCENARIOS_POOL, POST_TEST_SCENARIOS, PRE_TEST_SCENARIOS & Custom DB
  const [masterPool, setMasterPool] = useState(() => {
    return [...ALL_SCENARIOS_POOL, ...POST_TEST_SCENARIOS, ...PRE_TEST_SCENARIOS]
  })

  // Skenario yang dipilih khusus untuk sesi challenge saat ini (adaptive 5 soal)
  const [scenariosList, setScenariosList] = useState([])

  // Step indices
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finalResult, setFinalResult] = useState(null)

  // 2-Minute Timer State (120 seconds)
  const [timeLeft, setTimeLeft] = useState(120)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef = useRef(null)

  // Initialize session & load user + fetch custom scenarios from database
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingName = localStorage.getItem("kenali_participant_name") || "Nasabah"
      const existingAge = localStorage.getItem("kenali_participant_age")
      setParticipantName(existingName)
      if (existingAge) {
        setParticipantAge(Number(existingAge) || 25)
      }
    }

    // Ambil soal skenario dinamis (yang di-input/diedit admin atau dikonversi dari Case Registry)
    fetch("/api/admin/manage?type=scenario")
      .then((res) => res.json())
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: `db-${item.id}`,
            category: item.modus_type || "Social Engineering",
            modusType: item.modus_type || "Umum",
            title: item.title,
            difficulty: "Sulit",
            context: item.context || item.message,
            mockType: "whatsapp",
            sender: item.sender || "Indikasi Scammer",
            message: item.message,
            question: item.question,
            options: item.options || [],
            goldenRule: "Selalu konfirmasi transaksi dan aduan melalui Halo BCA 1500888 atau aplikasi haloBCA resmi."
          }))
          setMasterPool((prev) => {
            const existingIds = new Set(prev.map((s) => s.id))
            const newOnes = mapped.filter((m) => !existingIds.has(m.id))
            return [...prev, ...newOnes]
          })
        }
      })
      .catch((err) => {
        console.error("Using default scenarios fallback:", err)
      })
  }, [])

  // Timer Tick
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft <= 0 && timerActive) {
      clearInterval(timerRef.current)
      handleFinishTest()
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, timeLeft])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Mulai Test Langsung dengan Adaptive Sampling
  const handleStartTest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_participant_name", participantName || "Nasabah")
      localStorage.setItem("kenali_participant_age", String(participantAge || 25))
    }

    const picked = pickAdaptiveScenarios(masterPool, 5)
    setScenariosList(picked)
    setStage("test")
    setCurrentStep(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setAnswers([])
    setFinalResult(null)
    setTimeLeft(120)
    setTimerActive(true)
  }

  const activeScenario = scenariosList[currentStep] || scenariosList[0] || POST_TEST_SCENARIOS[0]

  // Pilih Jawaban & Munculkan Feedback Seketika
  const handleSelectOption = (option) => {
    if (showFeedback || !activeScenario) return
    setSelectedOption(option)
    setShowFeedback(true)

    const updated = [
      ...answers,
      {
        scenarioId: activeScenario.id,
        category: activeScenario.category,
        modusType: activeScenario.modusType || activeScenario.category,
        title: activeScenario.title,
        difficulty: activeScenario.difficulty || "Sedang",
        question: activeScenario.question,
        context: activeScenario.context,
        optionId: option.id,
        isCorrect: option.isCorrect,
        isRisky: !!option.isRisky,
        scoreImpact: option.scoreImpact,
        chosenText: option.text,
        correctText: (activeScenario.options.find((o) => o.isCorrect) || {}).text,
        reason: option.feedbackReason,
        goldenRule: activeScenario.goldenRule
      }
    ]
    setAnswers(updated)
  }

  // Lanjut ke Soal Berikutnya atau Selesai
  const handleNextStep = () => {
    if (currentStep < scenariosList.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      handleFinishTest()
    }
  }

  const handleFinishTest = () => {
    setTimerActive(false)
    const total = scenariosList.length || 5
    const correctCount = answers.filter((a) => a.isCorrect).length
    const calculatedScore = Math.round((correctCount / total) * 100)

    // Analisis area kelemahan
    const failedAnswers = answers.filter((a) => !a.isCorrect)
    const failedCategories = [...new Set(failedAnswers.map((a) => a.category || "Social Engineering"))]

    // Evaluasi & Rekomendasi
    let evaluationLevel = "Kritis"
    let evaluationHeadline = "Refleks Keamanan Perlu Ditingkatkan"
    let appreciationMessage = "Usaha yang bagus! Anda sudah melangkah untuk mengenali pola penipuan, namun jebakan manipulator masih dapat mengecoh Anda. Jangan menyerah!"
    let improvementFocus = "Pelajari lebih teliti tanda-tanda manipulasi psikologis, desakan palsu, dan verifikasi nomor rekening serta identitas sebelum mengambil tindakan apapun."

    if (calculatedScore >= 100) {
      evaluationLevel = "Sempurna"
      evaluationHeadline = "Luar Biasa! Refleks Proteksi Tertinggi"
      appreciationMessage = "Penghormatan tertinggi! Anda berhasil membaca seluruh trik manipulatif tanpa celah satupun. Ketelitian Anda adalah benteng pertahanan terbaik!"
      improvementFocus = "Pertahankan kebiasaan kritis ini dan sebarkan edukasi ini kepada keluarga atau kerabat agar mereka terlindungi dari modus serupa."
    } else if (calculatedScore >= 80) {
      evaluationLevel = "Tinggi"
      evaluationHeadline = "Sangat Waspada & Teliti"
      appreciationMessage = "Kerja bagus! Refleks pertahanan digital Anda sudah sangat tangguh. Sebagian besar taktik scammer berhasil Anda tangkal dengan tepat."
      improvementFocus = failedCategories.length > 0
        ? `Perdalam kewaspadaan Anda terutama pada modus: ${failedCategories.join(", ")}. Modus ini menggunakan taktik manipulasi yang sangat halus.`
        : "Tetap konsisten dan waspada terhadap skenario mendesak atau permintaan akses verifikasi OTP."
    } else if (calculatedScore >= 60) {
      evaluationLevel = "Cukup Waspada"
      evaluationHeadline = "Cukup Baik, Namun Celah Masih Ada"
      appreciationMessage = "Apresiasi atas kewaspadaan Anda! Anda sudah memahami dasar perlindungan akun, namun skenario yang dirancang menuntut ketelitian ganda berhasil mengecoh Anda."
      improvementFocus = `Fokus utama Anda saat ini adalah mempelajari: ${failedCategories.join(", ")}. Selalu terapkan aturan berhenti 3 detik sebelum merespons.`
    } else {
      evaluationLevel = "Rentan"
      evaluationHeadline = "Peringatan: Risiko Finansial Tinggi"
      appreciationMessage = "Terima kasih telah berani menguji diri! Jangan berkecil hati, penipu masa kini memang merekayasa tipuan agar terlihat sangat resmi dan meyakinkan."
      improvementFocus = `Wajib memperdalam pemahaman tentang: ${failedCategories.join(", ")}. Ingat prinsip emas: Halo BCA TIDAK PERNAH meminta OTP, CVV, atau klik link konfirmasi di luar kanal resmi.`
    }

    const summaryResult = {
      score: calculatedScore,
      totalQuestions: total,
      correctCount,
      failedCount: total - correctCount,
      evaluationLevel,
      evaluationHeadline,
      appreciationMessage,
      improvementFocus,
      failedCategories,
      answers,
      completedAt: new Date().toISOString()
    }

    setFinalResult(summaryResult)
    setStage("result")

    if (typeof window !== "undefined") {
      // 1. Simpan history pengerjaan soal (timestamp) agar tidak muncul terus-menerus
      try {
        const storedHistory = localStorage.getItem("kenali_challenge_question_history")
        const historyMap = storedHistory ? JSON.parse(storedHistory) : {}
        answers.forEach((ans) => {
          historyMap[ans.scenarioId] = Date.now()
        })
        localStorage.setItem("kenali_challenge_question_history", JSON.stringify(historyMap))

        // 2. Simpan daftar soal gagal agar PASTI/PRIORITAS muncul kembali di challenge berikutnya
        const storedFailed = localStorage.getItem("kenali_challenge_failed_scenarios")
        let failedList = storedFailed ? JSON.parse(storedFailed) : []
        const currentFailedIds = failedAnswers.map((a) => a.scenarioId)
        const currentPassedIds = new Set(answers.filter((a) => a.isCorrect).map((a) => a.scenarioId))

        // Hapus yang sudah berhasil diperbaiki, dan masukkan yang baru gagal
        failedList = failedList.filter((id) => !currentPassedIds.has(id))
        failedList = [...new Set([...failedList, ...currentFailedIds])]
        localStorage.setItem("kenali_challenge_failed_scenarios", JSON.stringify(failedList))
      } catch (e) {
        console.error(e)
      }

      // 3. Simpan ringkasan hasil profil
      localStorage.setItem("kenali_modus_result", JSON.stringify({
        score: calculatedScore,
        totalQuestions: total,
        correctCount,
        player: "saya",
        participantAge: Number(participantAge) || 25,
        answers,
        completedAt: summaryResult.completedAt
      }))

      // Update Family Group Storage jika ada
      const storedGroup = localStorage.getItem("kenali_family_group")
      let currentMembers = DEFAULT_FAMILY_MEMBERS
      let currentGroupName = "Keluarga Sejahtera"

      if (storedGroup) {
        try {
          const parsed = JSON.parse(storedGroup)
          if (parsed.members) currentMembers = parsed.members
          if (parsed.groupName) currentGroupName = parsed.groupName
        } catch (e) {
          console.error(e)
        }
      }

      const updatedMembers = currentMembers.map((m) =>
        m.id === "saya"
          ? {
            ...m,
            score: calculatedScore,
            status:
              calculatedScore >= 80
                ? "Tinggi (Waspada)"
                : calculatedScore >= 60
                  ? "Cukup Waspada"
                  : "Rentan",
            lastActive: "Baru saja",
            completedChallenges: (m.completedChallenges || 0) + 1
          }
          : m
      )

      localStorage.setItem("kenali_family_group", JSON.stringify({
        groupName: currentGroupName,
        members: updatedMembers
      }))

      // Tambahkan poin reward ke storage lokal
      const storedPoints = localStorage.getItem("kenali_points_data")
      let currentTotalPoints = 1250
      let currentStreak = 3
      let historyLog = []

      if (storedPoints) {
        try {
          const parsed = JSON.parse(storedPoints)
          if (parsed.totalPoints !== undefined) currentTotalPoints = parsed.totalPoints
          if (parsed.streakCount !== undefined) currentStreak = parsed.streakCount
          if (parsed.historyLog) historyLog = parsed.historyLog
        } catch (e) {
          console.error(e)
        }
      }

      const pointsEarned = calculatedScore >= 80 ? 30 : 20
      const newPoints = currentTotalPoints + pointsEarned
      const newLog = [
        {
          id: `log-${Date.now()}`,
          title: "Menyelesaikan 2-Minute Challenge",
          date: "Hari ini",
          pts: `+${pointsEarned} Poin`,
          type: "earn"
        },
        ...historyLog
      ]

      localStorage.setItem("kenali_points_data", JSON.stringify({
        totalPoints: newPoints,
        streakCount: currentStreak + 1,
        redeemed: [],
        historyLog: newLog
      }))

      // 4. Sinkronisasi Sesi Challenge & Poin LANGSUNG KE DATABASE
      fetch("/api/challenge/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || null,
          participantName: session?.user?.name || participantName || "Nasabah",
          score: calculatedScore,
          totalQuestions: total,
          correctCount,
          failedCount: total - correctCount,
          evaluationHeadline: summaryResult.evaluationHeadline,
          details: answers,
          pointsEarned
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.avgScore) {
            // Update skor profil di localStorage agar selaras dengan database
            localStorage.setItem("kenali_average_safe_score", String(data.avgScore))
          }
        })
        .catch((err) => console.error("Sync challenge history error:", err))
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      {/* Frame Container */}
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        <AppHeader title="Kenali Trik Penipuan" subtitle="Simulasi Safe Score Digital" />

        {/* BOTTOM SHEET */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-5">

            {/* Stage 0: Challenge Intro */}
            {stage === "intro" && (
              <section className="glass-card rounded-[28px] p-6 sm:p-8 border border-white bg-white/95 shadow-sm space-y-6">
                <div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#002554] tracking-tight">
                    2-Minute Scam Challenge
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Uji apakah Anda mudah tertipu oleh berbagai modus penipuan digital.
                  </p>
                </div>

                {/* 3 Parameter Metrik */}
                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 text-center">
                    <div className="text-base sm:text-lg font-black text-[#0292fc]">
                      120s
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-0.5">Durasi</div>

                  </div>
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 text-center">
                    <div className="text-base sm:text-lg font-black text-emerald-600">
                      Instan
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-0.5">Feedback</div>

                  </div>
                </div>

                {/* Panduan Singkat */}
                <div className="rounded-2xl bg-blue-50/50 border border-blue-100/80 p-4 space-y-2">
                  <div className="text-xs font-bold text-[#003882] tracking-wider uppercase">
                    Petunjuk Pelaksanaan
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
                    <li>Baca setiap kasus dengan cermat.</li>
                    <li>Pilih respons paling aman sebelum waktu habis.</li>
                    <li>Dapatkan penjelasan dan tips keamanan setelah menjawab.</li>
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleStartTest}
                    className="w-full rounded-2xl bg-[#0292fc] hover:bg-[#007ad6] py-3.5 px-6 text-sm font-bold text-white shadow-md transition active:scale-[0.99] cursor-pointer"
                  >
                    Mulai Challenge
                  </button>
                </div>
              </section>
            )}

            {/* Stage: Test dengan Instant Feedback */}
            {stage === "test" && activeScenario && (
              <div className="space-y-3">
                <div className="glass-card rounded-[28px] p-5 border border-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#003882] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Skenario {currentStep + 1} dari {scenariosList.length}
                    </span>

                    {/* Timer Pill */}
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-black border transition ${timeLeft < 30
                      ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                      : "bg-blue-50 text-[#003882] border-blue-100"
                      }`}>
                      <Icon name="Clock3" size={13} />
                      <span>{formatTimer(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-black text-[#002554]">
                      {activeScenario.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {Math.round(((currentStep + (showFeedback ? 1 : 0)) / (scenariosList.length || 1)) * 100)}% Selesai
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-[#0292fc] transition-all duration-300 rounded-full"
                      style={{ width: `${((currentStep + (showFeedback ? 1 : 0)) / (scenariosList.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Scenario Card */}
                <div className="mt-4 rounded-3xl bg-white p-6 shadow-soft md:p-8">
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    {activeScenario.context}
                  </div>

                  {/* Chat / Mock Interface */}
                  <div className="my-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-[#003882]">
                        <Icon
                          name={
                            activeScenario.mockType === "sms"
                              ? "MessageSquare"
                              : activeScenario.mockType === "qris"
                                ? "QrCode"
                                : "PhoneCall"
                          }
                          size={14}
                        />
                      </div>
                      <span className="text-xs font-black text-[#102a54]">
                        {activeScenario.sender}
                      </span>
                    </div>

                    <div className="mt-3 text-xs leading-relaxed text-slate-700 bg-white p-3 rounded-xl border border-slate-100 font-medium">
                      {activeScenario.message}
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-sm font-black text-[#102a54] mb-3">
                    {activeScenario.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {activeScenario.options.map((opt, idx) => {
                      const isSelected = selectedOption?.id === opt.id
                      const labelText = opt.label || opt.id || String.fromCharCode(65 + idx)
                      let btnStyle = "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"

                      if (showFeedback) {
                        if (opt.isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                        } else if (isSelected && !opt.isCorrect) {
                          btnStyle = "border-red-400 bg-red-50 text-red-800 shadow-sm"
                        } else {
                          btnStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                        }
                      }

                      return (
                        <button
                          key={opt.id || idx}
                          type="button"
                          disabled={showFeedback}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full text-left rounded-2xl border p-4 text-xs font-bold transition-all duration-150 flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${showFeedback && opt.isCorrect
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "border-slate-300"
                              }`}
                          >
                            {String(labelText).toUpperCase()}
                          </span>
                          <span className="flex-1 leading-snug">{opt.text}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Instant Feedback Panel */}
                  {showFeedback && selectedOption && (
                    <div
                      className={`mt-5 rounded-2xl p-4 border transition-all animate-fade-in ${selectedOption.isCorrect
                        ? "bg-blue-50/70 border-blue-200 text-slate-900"
                        : "bg-red-50/70 border-red-200 text-slate-900"
                        }`}
                    >
                      <div className="flex items-center gap-2 font-black text-sm">

                        <span className={selectedOption.isCorrect ? "text-[#003882]" : "text-red-700"}>
                          {selectedOption.isCorrect
                            ? "Tindakan Aman & Tepat (+20 Poin)"
                            : "Tindakan Berisiko (-20 Poin)"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed font-medium text-slate-700">
                        {selectedOption.feedbackReason}
                      </p>

                      {activeScenario.goldenRule && (
                        <div className="mt-3 rounded-xl bg-white/90 p-2.5 border border-slate-200/60 text-[11px] text-slate-600">
                          <strong className="text-[#002554]">Aturan Keamanan:</strong> {activeScenario.goldenRule}
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-2 rounded-2xl bg-[#003882] hover:bg-[#002554] px-5 py-2.5 text-xs font-black text-white transition cursor-pointer"
                        >
                          {currentStep < scenariosList.length - 1 ? (
                            <>
                              <span>Skenario Berikutnya</span>

                            </>
                          ) : (
                            <>
                              <span>Lihat Evaluasi Lengkap</span>

                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stage: Result & Detailed Review */}
            {stage === "result" && finalResult && (
              <div className="space-y-5 animate-fade-in">
                {/* Result Hero Header */}
                <section className="glass-card rounded-[28px] p-6 sm:p-8 border border-white bg-white/95 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold text-[#003882] bg-blue-50 border border-blue-100">
                        <span>Hasil Challenge</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#002554] tracking-tight mt-2">
                        {finalResult.evaluationHeadline}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
                        {finalResult.appreciationMessage}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shrink-0">
                      <div className="text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Skor Refleks
                        </div>
                        <div className="text-4xl font-black text-[#003882] mt-0.5">
                          {finalResult.score}
                          <span className="text-xs text-slate-400 font-bold">/100</span>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-slate-200" />
                      <div className="text-xs text-slate-600 space-y-1">
                        <div>
                          Benar: <strong className="text-emerald-700 font-black">{finalResult.correctCount}</strong>
                        </div>
                        <div>
                          Salah: <strong className="text-rose-600 font-black">{finalResult.failedCount}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Analisis & Evaluasi Apresiasi */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">


                    <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#002554]">

                        <span>Area yang Perlu Diperdalam</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                        {finalResult.improvementFocus}
                      </p>
                    </div>
                  </div>

                  {/* Prompt Ajakan Simpan Hasil ke Akun Jika Belum Login */}
                  {!session && (
                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200/80 p-4.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">

                        <div>
                          <h4 className="text-sm font-black text-[#002554] tracking-tight">
                            Simpan Skor & Poin Hasil Challenge Ini?
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            Skor Safe Score <strong>{finalResult.score}/100</strong> dan reward poin Anda saat ini belum tersimpan ke akun cloud. Masuk akun sekarang untuk mengamankan riwayat Anda.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                        <Link
                          href={`/auth/login?redirect=/profil`}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0292fc] hover:bg-[#007ad6] px-5 py-2.5 text-xs font-black text-white shadow-md transition active:scale-95 cursor-pointer"
                        >
                          <Icon name="UserRound" size={15} />
                          <span>Simpan</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleStartTest}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#0292fc] hover:bg-[#007ad6] px-5 py-3 text-xs font-black text-white shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Icon name="RotateCcw" size={15} />
                      <span>Coba Challenge Lagi</span>
                    </button>
                    <Link
                      href="/profil"
                      className="inline-flex items-center gap-2 rounded-2xl bg-[#003882] hover:bg-[#002554] px-5 py-3 text-xs font-black text-white shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <Icon name="UserRound" size={15} />
                      <span>Lihat Profil</span>
                    </Link>
                    <Link
                      href="/modus"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition active:scale-95"
                    >
                      <Icon name="BookOpen" size={15} />
                      <span>Pelajari Modus</span>
                    </Link>
                  </div>
                </section>

                {/* Histori Tiap Soal */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-black text-[#002554] uppercase tracking-wider">
                      Histori Pengerjaan Soal ({finalResult.answers.length} Kasus)
                    </h3>

                  </div>

                  <div className="space-y-3">
                    {finalResult.answers.map((item, idx) => (
                      <div
                        key={item.scenarioId || idx}
                        className={`rounded-2xl border p-4.5 bg-white transition shadow-2xs ${item.isCorrect
                          ? "border-emerald-200/80 bg-white"
                          : "border-rose-200 bg-rose-50/20"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-black ${item.isCorrect
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-700"
                                }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-xs font-black text-[#002554]">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          </div>

                          <span
                            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${item.isCorrect
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                          >
                            {item.isCorrect ? "Tepat (+20)" : "Kurang Tepat (0)"}
                          </span>
                        </div>

                        {item.context && (
                          <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <strong>Konteks:</strong> {item.context}
                          </p>
                        )}

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div
                            className={`p-2.5 rounded-xl border ${item.isCorrect
                              ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                              : "bg-rose-50/50 border-rose-100 text-rose-900"
                              }`}
                          >
                            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                              Jawaban Anda:
                            </div>
                            <div className="font-semibold mt-0.5">{item.chosenText}</div>
                          </div>

                          {!item.isCorrect && item.correctText && (
                            <div className="p-2.5 rounded-xl border bg-emerald-50/50 border-emerald-100 text-emerald-900">
                              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                                Jawaban yang Tepat:
                              </div>
                              <div className="font-semibold mt-0.5">{item.correctText}</div>
                            </div>
                          )}
                        </div>

                        {item.reason && (
                          <div className="mt-2.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <strong>Penjelasan:</strong> {item.reason}
                          </div>
                        )}

                        {item.goldenRule && (
                          <div className="mt-2 text-[11px] text-[#003882] bg-blue-50/60 p-2 rounded-xl border border-blue-100">
                            <strong>Golden Rule:</strong> {item.goldenRule}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <BottomSpace />
          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
