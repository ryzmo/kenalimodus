import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  PRE_TEST_SCENARIOS,
  POST_TEST_SCENARIOS,
  ARI_SURVEY_QUESTIONS,
  calculateRiskyActionRate,
  calculateBehavioralImpact,
  calculateRelativeReduction,
  calculatePotentialLossAvoided1k,
  DEFAULT_FAMILY_MEMBERS
} from "../data/modusData"

export default function ChallengePage() {
  const router = useRouter()

  // Stages: 'intro' -> 'pre_test' -> 'intervention' -> 'post_test' -> 'ari_survey'
  const [stage, setStage] = useState("intro")
  const [participantName, setParticipantName] = useState("Nasabah")
  const [participantAge, setParticipantAge] = useState(25)
  const [sessionId, setSessionId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step indices
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // Answers State
  const [preAnswers, setPreAnswers] = useState([])
  const [postAnswers, setPostAnswers] = useState([])

  // Attention, Repetition, Intention (ARI) Answers (Default 5)
  const [ariAnswers, setAriAnswers] = useState({
    ari_attention: 5,
    ari_repetition: 5,
    ari_intention: 5
  })
  const [currentAriStep, setCurrentAriStep] = useState(0)

  // 1.5-Minute Timer State (90 seconds)
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef = useRef(null)

  // Initialize session & load user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingName = localStorage.getItem("kenali_participant_name") || "Nasabah"
      const existingAge = localStorage.getItem("kenali_participant_age")
      setParticipantName(existingName)
      if (existingAge) {
        setParticipantAge(Number(existingAge) || 25)
      }
      setSessionId(`km_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`)
    }
  }, [])

  // Timer Tick
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft <= 0 && timerActive) {
      clearInterval(timerRef.current)
      if (stage === "pre_test") {
        setTimerActive(false)
        setStage("intervention")
      } else if (stage === "post_test") {
        setTimerActive(false)
        setStage("ari_survey")
        setCurrentAriStep(0)
      }
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, timeLeft, stage])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start Pre-Test (Phase 1)
  const handleStartPreTest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_participant_name", participantName || "Nasabah")
      localStorage.setItem("kenali_participant_age", String(participantAge || 25))
    }
    setStage("pre_test")
    setCurrentStep(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setPreAnswers([])
    setTimeLeft(90)
    setTimerActive(true)
  }

  // Pre-Test handling
  const activePreScenario = PRE_TEST_SCENARIOS[currentStep] || PRE_TEST_SCENARIOS[0]

  const handleSelectPreOption = (option) => {
    if (selectedOption) return
    setSelectedOption(option)

    const updated = [
      ...preAnswers,
      {
        scenarioId: activePreScenario.id,
        category: activePreScenario.category,
        modusType: activePreScenario.modusType,
        title: activePreScenario.title,
        optionId: option.id,
        isCorrect: option.isCorrect,
        isRisky: !!option.isRisky,
        scoreImpact: option.scoreImpact,
        chosenText: option.text,
        reason: option.feedbackReason,
        goldenRule: activePreScenario.goldenRule
      }
    ]
    setPreAnswers(updated)

    setTimeout(() => {
      if (currentStep < PRE_TEST_SCENARIOS.length - 1) {
        setCurrentStep((prev) => prev + 1)
        setSelectedOption(null)
      } else {
        setTimerActive(false)
        setStage("intervention")
      }
    }, 400)
  }

  // Calculate Pre-Test stats
  const preTotal = PRE_TEST_SCENARIOS.length
  const preRiskyCount = preAnswers.filter((a) => a.isRisky).length
  const preRiskyRate = calculateRiskyActionRate(preRiskyCount, preTotal)
  const preCorrectCount = preAnswers.filter((a) => a.isCorrect).length
  const preScore = Math.round((preCorrectCount / preTotal) * 100)

  // Start Post-Test (Phase 2)
  const handleStartPostTest = () => {
    setStage("post_test")
    setCurrentStep(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setPostAnswers([])
    setTimeLeft(90)
    setTimerActive(true)
  }

  // Post-Test handling with Instant Feedback
  const activePostScenario = POST_TEST_SCENARIOS[currentStep] || POST_TEST_SCENARIOS[0]

  const handleSelectPostOption = (option) => {
    if (showFeedback || !activePostScenario) return
    setSelectedOption(option)
    setShowFeedback(true)

    const updated = [
      ...postAnswers,
      {
        scenarioId: activePostScenario.id,
        category: activePostScenario.category,
        modusType: activePostScenario.modusType,
        title: activePostScenario.title,
        optionId: option.id,
        isCorrect: option.isCorrect,
        isRisky: !!option.isRisky,
        scoreImpact: option.scoreImpact,
        chosenText: option.text,
        reason: option.feedbackReason,
        goldenRule: activePostScenario.goldenRule
      }
    ]
    setPostAnswers(updated)
  }

  const handleNextPostStep = () => {
    if (currentStep < POST_TEST_SCENARIOS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      // Selesai Post-Test -> Lanjut ke Pertanyaan Attention, Repetition, Intention
      setTimerActive(false)
      setStage("ari_survey")
      setCurrentAriStep(0)
    }
  }

  // Handle ARI option select
  const activeAriQuestion = ARI_SURVEY_QUESTIONS[currentAriStep] || ARI_SURVEY_QUESTIONS[0]

  const handleSelectAriScore = (scoreVal) => {
    const updatedAri = {
      ...ariAnswers,
      [activeAriQuestion.id]: scoreVal
    }
    setAriAnswers(updatedAri)

    if (currentAriStep < ARI_SURVEY_QUESTIONS.length - 1) {
      setCurrentAriStep((prev) => prev + 1)
    } else {
      // Selesai semua tahap -> Submit final data
      handleFinalSubmission(updatedAri)
    }
  }

  const handleFinalSubmission = async (finalAri) => {
    setIsSubmitting(true)

    const postTotal = POST_TEST_SCENARIOS.length
    const postRiskyCount = postAnswers.filter((a) => a.isRisky).length
    const postRiskyRate = calculateRiskyActionRate(postRiskyCount, postTotal)
    const postCorrectCount = postAnswers.filter((a) => a.isCorrect).length
    const calculatedPostScore = Math.round((postCorrectCount / postTotal) * 100)

    const behavioralImpact = calculateBehavioralImpact(preRiskyRate, postRiskyRate)
    const relativeReduction = calculateRelativeReduction(preRiskyRate, postRiskyRate)
    const potentialLossAvoided1k = calculatePotentialLossAvoided1k(relativeReduction)

    const att = finalAri.ari_attention || 5
    const rep = finalAri.ari_repetition || 5
    const intn = finalAri.ari_intention || 5
    const ariAvg = Number(((att + rep + intn) / 3).toFixed(2))

    const payload = {
      sessionId,
      participantName: participantName || "Nasabah",
      participantAge: Number(participantAge) || 25,
      preTotalQuestions: preTotal,
      preRiskyCount,
      preRiskyRate,
      postTotalQuestions: postTotal,
      postRiskyCount,
      postRiskyRate,
      behavioralImpact,
      relativeReduction,
      potentialLossAvoided1k,
      preScore,
      postScore: calculatedPostScore,
      attentionScore: att,
      repetitionScore: rep,
      intentionScore: intn,
      ariAverage: ariAvg,
      preAnswers,
      postAnswers,
      completedAt: new Date().toISOString()
    }

    // 1. Simpan ke LocalStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_impact_result", JSON.stringify(payload))
      localStorage.setItem("kenali_modus_result", JSON.stringify({
        score: calculatedPostScore,
        totalQuestions: postTotal,
        correctCount: postCorrectCount,
        player: "saya",
        participantAge: Number(participantAge) || 25,
        answers: postAnswers,
        completedAt: payload.completedAt
      }))

      // Update Family Group Storage
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
            score: calculatedPostScore,
            status:
              calculatedPostScore >= 80
                ? "Tinggi (Waspada)"
                : calculatedPostScore >= 60
                  ? "Cukup Waspada"
                  : "Rentan",
            lastActive: "Baru saja",
            completedChallenges: (m.completedChallenges || 0) + 1
          }
          : m
      )

      localStorage.setItem(
        "kenali_family_group",
        JSON.stringify({ groupName: currentGroupName, members: updatedMembers })
      )
    }

    // 2. Kirim ke API NeonDB
    try {
      await fetch("/api/impact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    } catch (err) {
      console.error("Gagal mengirim ke server:", err)
    }

    setIsSubmitting(false)
    router.push("/hasil")
  }

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* ====================================================
            STAGE 0: CHALLENGE INTRO
        ==================================================== */}
        {stage === "intro" && (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-soft md:p-9">

            <h1 className="text-2xl font-black leading-tight text-[#102a54] md:text-3xl">
              1.5-Minute Scam Challenge
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Uji ketajaman refleks Anda menghadapi modus penipuan perbankan digital terbaru seperti CS Palsu via WhatsApp,
              file APK berbahaya, link phishing login, tawaran deposit modal, dan QRIS palsu.
            </p>

            {/* Input Data Profil Peserta (Nama & Umur) */}
            <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-slate-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0876c9] mb-3">
                <Icon name="User" size={15} />
                Profil Peserta Challenge
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap / Panggilan
                  </label>
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-[#0876c9] focus:outline-none shadow-sm transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Umur (Tahun)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={participantAge}
                      onChange={(e) => setParticipantAge(e.target.value ? parseInt(e.target.value, 10) : "")}
                      placeholder="Contoh: 25"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-14 text-xs text-slate-800 font-semibold focus:border-[#0876c9] focus:outline-none shadow-sm transition"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Tahun
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Data profil digunakan untuk analisis demografi & rekap evaluasi keamanan.
              </p>
            </div>

            {/* Steps Info Cards */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-black text-[#102a54]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#102a54] text-white text-[11px]">
                    1
                  </span>
                  Refleks Awal (1,5 Menit)
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Selesaikan 5 skenario nyata secara cepat dan spontan untuk mengetahui Safe Score awal Anda.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-black text-[#0876c9]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#0876c9] text-white text-[11px]">
                    2
                  </span>
                  Kunci Pengamanan
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Pelajari pola jebakan manipulasi psikologis dan 5 aturan penting perlindungan akun.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white text-[11px]">
                    3
                  </span>
                  Tantangan Akhir (1,5 Menit)
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  Terapkan refleks keamanan Anda pada skenario baru dan peroleh Safe Score tertinggi.
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <button
                type="button"
                onClick={handleStartPreTest}
                className="flex items-center gap-2 rounded-2xl bg-[#0876c9] px-6 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-[#075da8]"
              >
                Mulai Challenge Sekarang
                <Icon name="ArrowRight" size={17} />
              </button>
            </div>
          </section>
        )}

        {/* ====================================================
            STAGE 1: PRE-TEST (1.5 MINUTES TIMER)
        ==================================================== */}
        {stage === "pre_test" && activePreScenario && (
          <div className="mt-6">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    Tantangan Bagian 1
                  </span>
                  <h2 className="mt-1 text-base font-black text-[#102a54]">
                    Skenario {currentStep + 1} dari {PRE_TEST_SCENARIOS.length}: {activePreScenario.category}
                  </h2>
                </div>

                {/* 1.5-Minute Timer Display */}
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 font-mono text-xs font-black text-[#102a54]">
                  <Icon name="Clock" size={15} className={timeLeft < 30 ? "text-red-500 animate-pulse" : "text-[#0876c9]"} />
                  <span className={timeLeft < 30 ? "text-red-600" : "text-[#102a54]"}>
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-[#0876c9] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / PRE_TEST_SCENARIOS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Card */}
            <div className="mt-4 rounded-3xl bg-white p-6 shadow-soft md:p-8">
              <div className="text-xs font-bold text-slate-500 mb-2">
                {activePreScenario.context}
              </div>

              {/* Chat / Mock Interface */}
              <div className="my-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-[#0876c9]">
                    <Icon name={activePreScenario.mockType === "sms" ? "MessageSquare" : activePreScenario.mockType === "qris" ? "QrCode" : "PhoneCall"} size={14} />
                  </div>
                  <span className="text-xs font-black text-[#102a54]">
                    {activePreScenario.sender}
                  </span>
                </div>

                <div className="mt-3 text-xs leading-relaxed text-slate-700 bg-white p-3 rounded-xl border border-slate-100 font-medium">
                  {activePreScenario.message}
                </div>
              </div>

              {/* Question */}
              <h3 className="text-sm font-black text-[#102a54] mb-3">
                {activePreScenario.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {activePreScenario.options.map((opt) => {
                  const isSelected = selectedOption?.id === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectPreOption(opt)}
                      className={`w-full text-left rounded-2xl border p-4 text-xs font-bold transition-all duration-150 flex items-start gap-3 ${isSelected
                        ? "border-[#0876c9] bg-blue-50 text-[#0876c9] shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${isSelected ? "bg-[#0876c9] text-white border-[#0876c9]" : "border-slate-300"
                        }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            STAGE 2: INTERVENTION / 5 GOLDEN RULES
        ==================================================== */}
        {stage === "intervention" && (
          <div className="mt-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft md:p-8">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Kunci Pengamanan Akun
              </span>

              <h2 className="mt-3 text-xl font-black text-[#102a54] md:text-2xl">
                5 Golden Rules Keamanan Finansial Digital
              </h2>

              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Anda telah menyelesaikan 5 skenario pertama. Sebelum lanjut ke tantangan penentu berikutnya, perhatikan 5 prinsip keamanan mutlak berikut:
              </p>

              {/* 5 Core Rules */}
              <div className="mt-5 space-y-3 text-xs">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#102a54] text-white text-[10px] font-black">
                    1
                  </div>
                  <div>
                    <strong className="text-[#102a54]">Kerahasiaan Data:</strong> Jangan pernah membagikan OTP, PIN, CVV, atau password kepada siapa pun termasuk pihak bank.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#102a54] text-white text-[10px] font-black">
                    2
                  </div>
                  <div>
                    <strong className="text-[#102a54]">Waspada File .APK:</strong> Jangan pernah membuka atau menginstal file berakhiran <code>.apk</code> dari WhatsApp atau Telegram.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#102a54] text-white text-[10px] font-black">
                    3
                  </div>
                  <div>
                    <strong className="text-[#102a54]">Periksa Domain URL:</strong> Jangan klik link SMS. Ketik manual alamat portal resmi bank di browser Anda.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-[#102a54] text-white text-[10px] font-black">
                    4
                  </div>
                  <div>
                    <strong className="text-[#102a54]">Tolak Syarat Deposit:</strong> Tawaran kerja paruh waktu yang meminta deposit uang terlebih dahulu adalah penipuan.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-[#102a54] text-white text-[10px] font-black">
                    5
                  </div>
                  <div>
                    <strong className="text-[#102a54]">Verifikasi Nama QRIS:</strong> Selalu periksa kesesuaian nama merchant di layar m-banking sebelum menginput PIN transaksi.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleStartPostTest}
                  className="flex items-center gap-2 rounded-2xl bg-[#0876c9] px-6 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-[#075da8]"
                >
                  Mulai Tantangan Bagian 2 (1,5 Menit)
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            STAGE 3: POST-TEST (1.5 MINUTES TIMER + FEEDBACK)
        ==================================================== */}
        {stage === "post_test" && activePostScenario && (
          <div className="mt-6">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Tantangan Bagian 2
                  </span>
                  <h2 className="mt-1 text-base font-black text-[#102a54]">
                    Skenario {currentStep + 1} dari {POST_TEST_SCENARIOS.length}: {activePostScenario.category}
                  </h2>
                </div>

                {/* 1.5-Minute Timer Display */}
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 font-mono text-xs font-black text-emerald-800">
                  <Icon name="Clock" size={15} className={timeLeft < 30 ? "text-red-500 animate-pulse" : "text-emerald-600"} />
                  <span className={timeLeft < 30 ? "text-red-600" : "text-emerald-800"}>
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentStep + (showFeedback ? 1 : 0)) / POST_TEST_SCENARIOS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Scenario Card */}
            <div className="mt-4 rounded-3xl bg-white p-6 shadow-soft md:p-8">
              <div className="text-xs font-bold text-slate-500 mb-2">
                {activePostScenario.context}
              </div>

              {/* Chat / Mock Interface */}
              <div className="my-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Icon name={activePostScenario.mockType === "sms" ? "MessageSquare" : activePostScenario.mockType === "qris" ? "QrCode" : "PhoneCall"} size={14} />
                  </div>
                  <span className="text-xs font-black text-[#102a54]">
                    {activePostScenario.sender}
                  </span>
                </div>

                <div className="mt-3 text-xs leading-relaxed text-slate-700 bg-white p-3 rounded-xl border border-slate-100 font-medium">
                  {activePostScenario.message}
                </div>
              </div>

              {/* Question */}
              <h3 className="text-sm font-black text-[#102a54] mb-3">
                {activePostScenario.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {activePostScenario.options.map((opt) => {
                  const isSelected = selectedOption?.id === opt.id
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
                      key={opt.id}
                      type="button"
                      disabled={showFeedback}
                      onClick={() => handleSelectPostOption(opt)}
                      className={`w-full text-left rounded-2xl border p-4 text-xs font-bold transition-all duration-150 flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${showFeedback && opt.isCorrect ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-300"
                        }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                    </button>
                  )
                })}
              </div>

              {/* Instant Feedback Panel */}
              {showFeedback && selectedOption && (
                <div className={`mt-5 rounded-2xl p-4 border transition-all ${selectedOption.isCorrect ? "bg-emerald-50/80 border-emerald-200" : "bg-red-50/80 border-red-200"
                  }`}>
                  <div className="flex items-center gap-2">
                    <Icon
                      name={selectedOption.isCorrect ? "CheckCircle2" : "AlertTriangle"}
                      size={18}
                      className={selectedOption.isCorrect ? "text-emerald-600" : "text-red-600"}
                    />
                    <span className={`text-xs font-black ${selectedOption.isCorrect ? "text-emerald-800" : "text-red-800"}`}>
                      {selectedOption.isCorrect ? "Tindakan Aman & Tepat (+20 Poin)" : "Tindakan Berisiko (-20 Poin)"}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedOption.feedbackReason}
                  </p>

                  <div className="mt-3 rounded-xl bg-white/80 p-2.5 border border-slate-200/60 text-[11px] text-slate-600">
                    <strong>Aturan Keamanan:</strong> {activePostScenario.goldenRule}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextPostStep}
                      className="flex items-center gap-2 rounded-2xl bg-[#102a54] px-5 py-2.5 text-xs font-black text-white transition hover:bg-[#1a3e75]"
                    >
                      {currentStep < POST_TEST_SCENARIOS.length - 1 ? (
                        <>
                          Skenario Berikutnya
                          <Icon name="ArrowRight" size={15} />
                        </>
                      ) : (
                        <>
                          Lanjut ke Evaluasi Refleks
                          <Icon name="ArrowRight" size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            STAGE 4: ATTENTION, REPETITION, INTENTION (ARI)
        ==================================================== */}
        {stage === "ari_survey" && activeAriQuestion && (
          <div className="mt-6">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0876c9] bg-blue-50 px-2.5 py-1 rounded-full">
                    Evaluasi Refleks & Kebiasaan
                  </span>
                  <h2 className="mt-1 text-base font-black text-[#102a54]">
                    {activeAriQuestion.title} ({currentAriStep + 1} dari {ARI_SURVEY_QUESTIONS.length})
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Pilar: {activeAriQuestion.pillar}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-[#0876c9] transition-all duration-300"
                  style={{ width: `${((currentAriStep + 1) / ARI_SURVEY_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="mt-4 rounded-3xl bg-white p-6 shadow-soft md:p-8">
              <h3 className="text-sm font-bold leading-relaxed text-[#102a54] mb-4">
                {activeAriQuestion.question}
              </h3>

              {/* Option Likert Cards */}
              <div className="space-y-2.5">
                {activeAriQuestion.options.map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectAriScore(opt.score)}
                    className="w-full text-left rounded-2xl border border-slate-200 bg-white p-4 text-xs font-bold transition-all hover:border-[#0876c9] hover:bg-blue-50/50 flex items-start gap-3"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-[#102a54] text-xs font-bold">
                      {opt.score}
                    </span>
                    <div className="flex-1">
                      <div className="text-slate-900 font-bold">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {isSubmitting && (
                <div className="mt-4 text-center text-xs font-bold text-[#0876c9] animate-pulse">
                  Menyimpan hasil evaluasi ke database...
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomSpace />
      <BottomNav />
    </div>
  )
}
