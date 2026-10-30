import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  POST_TEST_SCENARIOS,
  DEFAULT_FAMILY_MEMBERS
} from "../data/modusData"

export default function ChallengePage() {
  const router = useRouter()

  // Stages: 'intro' -> 'test'
  const [stage, setStage] = useState("intro")
  const [participantName, setParticipantName] = useState("Nasabah")
  const [participantAge, setParticipantAge] = useState(25)

  // Step indices
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState([])

  // 2-Minute Timer State (120 seconds)
  const [timeLeft, setTimeLeft] = useState(120)
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
      handleFinishTest()
    }
    return () => clearInterval(timerRef.current)
  }, [timerActive, timeLeft])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Mulai Test Langsung
  const handleStartTest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_participant_name", participantName || "Nasabah")
      localStorage.setItem("kenali_participant_age", String(participantAge || 25))
    }
    setStage("test")
    setCurrentStep(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setAnswers([])
    setTimeLeft(120)
    setTimerActive(true)
  }

  const activeScenario = POST_TEST_SCENARIOS[currentStep] || POST_TEST_SCENARIOS[0]

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
        modusType: activeScenario.modusType,
        title: activeScenario.title,
        optionId: option.id,
        isCorrect: option.isCorrect,
        isRisky: !!option.isRisky,
        scoreImpact: option.scoreImpact,
        chosenText: option.text,
        reason: option.feedbackReason,
        goldenRule: activeScenario.goldenRule
      }
    ]
    setAnswers(updated)
  }

  // Lanjut ke Soal Berikutnya atau Selesai
  const handleNextStep = () => {
    if (currentStep < POST_TEST_SCENARIOS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      handleFinishTest()
    }
  }

  const handleFinishTest = () => {
    setTimerActive(false)
    const total = POST_TEST_SCENARIOS.length
    const correctCount = answers.filter((a) => a.isCorrect).length
    const calculatedScore = Math.round((correctCount / total) * 100)

    if (typeof window !== "undefined") {
      const completedAt = new Date().toISOString()
      localStorage.setItem("kenali_modus_result", JSON.stringify({
        score: calculatedScore,
        totalQuestions: total,
        correctCount,
        player: "saya",
        participantAge: Number(participantAge) || 25,
        answers,
        completedAt
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
    }

    router.push("/profil")
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold text-[#003882] bg-blue-50 border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-[#0292fc]" />
                    Simulasi Refleks Finansial
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#002554] tracking-tight mt-3">
                    2-Minute Scam Challenge
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Uji ketajaman dan refleks Anda dalam menghadapi skenario penipuan digital nyata: manipulasi customer service palsu, file APK berbahaya, phishing perbankan, dan QRIS manipulatif.
                  </p>
                </div>

                {/* 3 Parameter Metrik */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 text-center">
                    <div className="text-base sm:text-lg font-black text-[#003882]">
                      {POST_TEST_SCENARIOS.length}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-0.5">Skenario</div>
                    <div className="text-[10px] text-slate-400">Kasus Riil</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 text-center">
                    <div className="text-base sm:text-lg font-black text-[#0292fc]">
                      120s
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-0.5">Durasi</div>
                    <div className="text-[10px] text-slate-400">Batas Waktu</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 text-center">
                    <div className="text-base sm:text-lg font-black text-emerald-600">
                      Instan
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-0.5">Feedback</div>
                    <div className="text-[10px] text-slate-400">Analisis Langsung</div>
                  </div>
                </div>

                {/* Panduan Singkat */}
                <div className="rounded-2xl bg-blue-50/50 border border-blue-100/80 p-4 space-y-2">
                  <div className="text-xs font-bold text-[#003882] tracking-wider uppercase">
                    Petunjuk Pelaksanaan
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
                    <li>Baca dengan cermat setiap kasus komunikasi yang ditampilkan di layar.</li>
                    <li>Pilih opsi respons paling aman sebelum batas waktu berakhir.</li>
                    <li>Penjelasan detail dan Golden Rule keamanan perbankan akan langsung diberikan setelah Anda memilih jawaban.</li>
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
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      Skenario {currentStep + 1} dari {POST_TEST_SCENARIOS.length}
                    </span>

                    {/* Timer Pill */}
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-black border transition ${
                      timeLeft < 30
                        ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
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
                      {Math.round(((currentStep + (showFeedback ? 1 : 0)) / POST_TEST_SCENARIOS.length) * 100)}% Selesai
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                      style={{ width: `${((currentStep + (showFeedback ? 1 : 0)) / POST_TEST_SCENARIOS.length) * 100}%` }}
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
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
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
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                              showFeedback && opt.isCorrect
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
                      className={`mt-5 rounded-2xl p-4 border transition-all animate-fade-in ${
                        selectedOption.isCorrect
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                          : "bg-red-50/80 border-red-200 text-red-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black text-sm">
                        <Icon
                          name={selectedOption.isCorrect ? "CheckCircle2" : "AlertTriangle"}
                          size={18}
                          className={selectedOption.isCorrect ? "text-emerald-600" : "text-red-600"}
                        />
                        <span>
                          {selectedOption.isCorrect
                            ? "Tindakan Aman & Tepat (+20 Poin)"
                            : "Tindakan Berisiko (-20 Poin)"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed font-medium">
                        {selectedOption.feedbackReason}
                      </p>

                      {activeScenario.goldenRule && (
                        <div className="mt-3 rounded-xl bg-white/80 p-2.5 border border-slate-200/60 text-[11px] text-slate-600">
                          <strong>Aturan Keamanan:</strong> {activeScenario.goldenRule}
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center gap-2 rounded-2xl bg-[#102a54] hover:bg-[#1a3e75] px-5 py-2.5 text-xs font-black text-white transition cursor-pointer"
                        >
                          {currentStep < POST_TEST_SCENARIOS.length - 1 ? (
                            <>
                              <span>Skenario Berikutnya</span>
                              <Icon name="ArrowRight" size={15} />
                            </>
                          ) : (
                            <>
                              <span>Lihat Hasil Safe Score</span>
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
          </div>
        </main>
      </div>

      <BottomNav />
      <BottomSpace />
    </div>
  )
}
