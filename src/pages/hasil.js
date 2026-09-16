import { useState, useEffect } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  BADGES_DATA,
  IMPACT_BENCHMARK_OJK,
  formatRupiah,
  calculateROI
} from "../data/modusData"

export default function HasilPage() {
  const [resultData, setResultData] = useState({
    score: 80,
    totalQuestions: 5,
    correctCount: 4,
    answers: [],
    completedAt: new Date().toISOString()
  })

  const [impactData, setImpactData] = useState({
    preRiskyRate: 60,
    postRiskyRate: 0,
    behavioralImpact: 60,
    relativeReduction: 100,
    potentialLossAvoided1k: 21890000000,
    preScore: 40,
    postScore: 100
  })

  const [globalStats, setGlobalStats] = useState(null)
  const [implementationCost, setImplementationCost] = useState(250000000) // Default Rp 250 Juta
  const [scenarioReportCount, setScenarioReportCount] = useState(1000) // Default per 1.000 Laporan
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)

      // Ambil hasil challenge umum
      const storedResult = localStorage.getItem("kenali_modus_result")
      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult)
          if (parsed.score !== undefined) {
            setResultData(parsed)
          }
        } catch (e) {
          console.error(e)
        }
      }

      // Ambil hasil eksperimen Pre-Test & Post-Test
      const storedImpact = localStorage.getItem("kenali_impact_result")
      if (storedImpact) {
        try {
          const parsed = JSON.parse(storedImpact)
          setImpactData(parsed)
        } catch (e) {
          console.error(e)
        }
      }

      // Fetch ringkasan statistik agregat dari NeonDB
      fetch("/api/impact/submit")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.stats) {
            setGlobalStats(data.stats)
          }
        })
        .catch((err) => console.log("Aggregate fetch error:", err))
    }
  }, [])

  const score = resultData ? resultData.score : 80
  const relativeReduction = impactData ? impactData.relativeReduction : 100
  const behavioralImpact = impactData ? impactData.behavioralImpact : 60
  const preRiskyRate = impactData ? impactData.preRiskyRate : 60
  const postRiskyRate = impactData ? impactData.postRiskyRate : 0

  // Perhitungan Keuangan (Subbab 4.3.2 & 4.3.3)
  // Potential Loss Avoided = Jumlah Laporan * X% * Rp 21,89 Juta
  const avgLoss = IMPACT_BENCHMARK_OJK.averageLossPerReport // Rp 21.894.880
  const calculatedBenefit = Math.round(
    scenarioReportCount * (relativeReduction / 100) * avgLoss
  )
  const roiCalculations = calculateROI(calculatedBenefit, implementationCost)

  let scoreLevel = "Tinggi (Sangat Waspada)"
  let scoreColor = "text-emerald-600"
  let scoreDesc =
    "Pemahamanmu terhadap modus penipuan digital sudah sangat baik. Terus pertahankan refleks dan bantu lindungi orang di sekitarmu!"

  if (score < 60) {
    scoreLevel = "Perlu Ditingkatkan"
    scoreColor = "text-red-600"
    scoreDesc =
      "Kamu masih rentan terhadap beberapa manipulasi psikologis dan jebakan digital. Pelajari modul rekomendasi di bawah untuk meningkatkan refleks keamananmu."
  } else if (score < 80) {
    scoreLevel = "Cukup Waspada"
    scoreColor = "text-amber-600"
    scoreDesc =
      "Refleks dasarmu sudah baik, namun masih ada celah pada skenario penipuan tertentu seperti APK berbahaya atau QRIS."
  }

  const shareText = `Saya baru saja menyelesaikan evaluasi KENALI MODUS dengan Safe Score ${score}/100 dan Relative Reduction risiko penipuan ${relativeReduction}%! Uji seberapa aman refleks kamu di sini: ${originUrl}/challenge`

  const handleCopyLink = () => {
    const url = `${originUrl}/challenge`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "KENALI MODUS - Impact & Safe Score",
          text: shareText,
          url: `${originUrl}/challenge`
        })
      } catch (err) {
        console.log(err)
      }
    } else {
      setShowShareModal(true)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* ====================================================
            HERO SCORE SECTION
        ==================================================== */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
              Profil Keamanan Pribadi & Safe Score
            </span>

            <h1 className="mt-3 text-2xl font-black text-[#102a54] md:text-3xl">
              Safe Score & Hasil Evaluasi
            </h1>

            {/* Score Ring / Number */}
            <div className="mt-6 flex flex-col items-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-slate-50 border-4 border-blue-50 shadow-inner">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-[#102a54]">
                    {score}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    / 100
                  </span>
                </div>
              </div>

              <div className={`mt-4 text-sm font-black ${scoreColor}`}>
                Tingkat Refleks: {scoreLevel}
              </div>

              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
                {scoreDesc}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
              <Link
                href="/keluarga"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#102a54] px-4 py-3 text-xs font-black text-white shadow-md transition hover:bg-[#1a3e75]"
              >
                <Icon name="UsersRound" size={16} />
                Skor Keluarga
              </Link>

              <button
                type="button"
                onClick={handleNativeShare}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0876c9] px-4 py-3 text-xs font-black text-white shadow-md transition hover:bg-[#075da8]"
              >
                <Icon name="Share2" size={16} />
                Bagikan
              </button>

              <Link
                href="/challenge"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-xs font-bold text-[#102a54] transition hover:bg-slate-200"
              >
                <Icon name="RotateCcw" size={15} />
                Ulangi Uji
              </Link>
            </div>
          </div>
        </section>

        {/* ====================================================
            SUBBAB 4.3.1: PENGUKURAN DAMPAK PERILAKU
        ==================================================== */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0876c9]">
                4.3.1 Pengukuran Dampak Perilaku
              </span>
              <h2 className="mt-1 text-xl font-black text-[#102a54]">
                Perubahan Perilaku (Pre-Test vs Post-Test)
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Metrik Terukur Eksperimen
            </span>
          </div>

          {/* 3 Metric Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="text-[10px] font-black uppercase text-amber-800">
                Risky Action Rate (Pre)
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-700">{preRiskyRate}%</span>
                <span className="text-xs text-slate-400">Kondisi Baseline</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                Persentase pemilihan tindakan berisiko sebelum mendapatkan edukasi.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="text-[10px] font-black uppercase text-emerald-800">
                Risky Action Rate (Post)
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">{postRiskyRate}%</span>
                <span className="text-xs text-slate-400">Setelah Intervensi</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                Tindakan berisiko setelah melalui Scam Challenge & Instant Feedback.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="text-[10px] font-black uppercase text-[#0876c9]">
                Relative Reduction (X%)
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0876c9]">{relativeReduction}%</span>
                <span className="text-xs font-bold text-emerald-600">Efektivitas Solusi</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                Besaran efektivitas penurunan risiko yang digunakan dalam kalkulasi finansial.
              </p>
            </div>
          </div>

          {/* Mathematical Formulations Table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
            <h3 className="text-xs font-black text-[#102a54] mb-2 flex items-center gap-2">
              <Icon name="SlidersHorizontal" size={14} className="text-[#0876c9]" />
              Formulasi & Hasil Perhitungan Berdasarkan Data Pengguna:
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-200 pb-1.5">
                <span><strong>Behavioral Impact:</strong> Risky Rate (Pre) − Risky Rate (Post)</span>
                <span className="font-mono font-bold text-[#102a54]">{preRiskyRate}% − {postRiskyRate}% = {behavioralImpact}%</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span><strong>Relative Reduction (X%):</strong> [(Pre − Post) / Pre] × 100%</span>
                <span className="font-mono font-bold text-emerald-700">[({preRiskyRate}% − {postRiskyRate}%) / {preRiskyRate}%] × 100% = <strong>{relativeReduction}%</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            SUBBAB 4.3.2: ESTIMASI DAMPAK FINANSIAL (IASC / OJK)
        ==================================================== */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                4.3.2 Estimasi Dampak Finansial
              </span>
              <h2 className="mt-1 text-xl font-black text-[#102a54]">
                Proyeksi Kerugian yang Dihindari (External Benchmark OJK)
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Benchmark IASC 2024–2026
            </span>
          </div>

          {/* Benchmark Facts */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black text-[#102a54]">
                Data Publik OJK / IASC (22 Nov 2024 – 28 Des 2025)
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                <li>• Total Laporan Penipuan: <strong>411.055 Laporan</strong></li>
                <li>• Total Kerugian Nasional: <strong>Rp 9,00 Triliun</strong></li>
                <li>• Average Loss: Rp 9 T / 411.055 ≈ <strong>Rp 21,89 Juta / laporan</strong></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black text-[#102a54]">
                Update Data Laporan IASC (Hingga 30 Juni 2026)
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                <li>• Total Laporan Diterima: <strong>608.167 Laporan</strong></li>
                <li>• Rekening Dilaporkan / Diblokir: <strong>1.085.607 / 557.751 Rekening</strong></li>
                <li>• Dana Korban Berhasil Diblokir: <strong>Rp 674,1 Miliar</strong></li>
              </ul>
            </div>
          </div>

          {/* Formula 1,000 Reports Calculation Box */}
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#102a54] to-[#075da8] p-5 text-white shadow-md">
            <div className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
              Potential Loss Avoided per 1.000 Laporan Scam
            </div>
            <div className="mt-2 text-2xl md:text-3xl font-black text-white">
              {formatRupiah((1000 * (relativeReduction / 100) * avgLoss))}
            </div>
            <p className="mt-1 text-xs text-blue-100 font-mono">
              Potential Loss Avoided₍1.000₎ = 1.000 × {relativeReduction}% × Rp 21,89 Juta = <strong>Rp 21,89 Miliar × {relativeReduction}%</strong>
            </p>
            <div className="mt-3 text-[11px] text-blue-200 border-t border-white/10 pt-2">
              *Catatan Metodologi: Angka ini merupakan proyeksi potensi kerugian yang dapat dihindari berdasarkan efektivitas terukur ({relativeReduction}%), bukan klaim pencegahan kerugian aktual historis.
            </div>
          </div>
        </section>

        {/* ====================================================
            SUBBAB 4.3.3: PROYEKSI NET BENEFIT & PROJECTED ROI
        ==================================================== */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-700">
                4.3.3 Proyeksi Net Benefit dan ROI
              </span>
              <h2 className="mt-1 text-xl font-black text-[#102a54]">
                Kalkulator Kelayakan Bisnis & Projected ROI
              </h2>
            </div>
          </div>

          {/* Interactive Simulator Sliders */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <label className="text-xs font-black text-[#102a54] block">
                Skala Laporan Relevan: {scenarioReportCount.toLocaleString()} Laporan
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={scenarioReportCount}
                onChange={(e) => setScenarioReportCount(Number(e.target.value))}
                className="mt-2 w-full accent-[#0876c9]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>100 Laporan</span>
                <span>1.000 Laporan (Std)</span>
                <span>5.000 Laporan</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <label className="text-xs font-black text-[#102a54] block">
                Estimasi Biaya Investasi Solusi: {formatRupiah(implementationCost)}
              </label>
              <input
                type="range"
                min="50000000"
                max="1000000000"
                step="50000000"
                value={implementationCost}
                onChange={(e) => setImplementationCost(Number(e.target.value))}
                className="mt-2 w-full accent-[#0876c9]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Rp 50 Juta</span>
                <span>Rp 250 Juta (Dev + Ops)</span>
                <span>Rp 1 Miliar</span>
              </div>
            </div>
          </div>

          {/* Result Net Benefit & ROI Grid */}
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
              <div className="text-[10px] font-bold uppercase text-[#0876c9]">
                Potential Financial Benefit
              </div>
              <div className="mt-1 text-xl font-black text-[#102a54]">
                {formatRupiah(calculatedBenefit)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {scenarioReportCount} × {relativeReduction}% × Rp 21,89 Juta
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="text-[10px] font-bold uppercase text-emerald-800">
                Net Benefit
              </div>
              <div className="mt-1 text-xl font-black text-emerald-600">
                {formatRupiah(roiCalculations.netBenefit)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Financial Benefit − Biaya Investasi
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4">
              <div className="text-[10px] font-bold uppercase text-purple-800">
                Projected ROI
              </div>
              <div className="mt-1 text-xl font-black text-purple-700">
                {roiCalculations.roiPercent > 0 ? `+${roiCalculations.roiPercent}%` : `${roiCalculations.roiPercent}%`}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                [(Net Benefit) / Investasi] × 100%
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            NEONDB REAL-TIME AGGREGATE COHORT
        ==================================================== */}
        {globalStats && (
          <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  NeonDB Cohort Database
                </span>
                <h2 className="mt-1 text-base font-black text-[#102a54] md:text-lg">
                  Hasil Agregat Seluruh Responden ({globalStats.totalParticipants || 0} Partisipan)
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Pre Risky Rate</div>
                <div className="mt-1 text-lg font-black text-amber-600">{globalStats.avgPreRiskyRate}%</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Post Risky Rate</div>
                <div className="mt-1 text-lg font-black text-emerald-600">{globalStats.avgPostRiskyRate}%</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Reduction (X%)</div>
                <div className="mt-1 text-lg font-black text-[#0876c9]">{globalStats.avgRelativeReduction}%</div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Post Score</div>
                <div className="mt-1 text-lg font-black text-[#102a54]">{globalStats.avgPostScore}/100</div>
              </div>
            </div>

            {/* Individual Respondents Table */}
            {globalStats.recentParticipants && globalStats.recentParticipants.length > 0 && (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-[#102a54] uppercase tracking-wider">
                    Daftar Hasil Responden Terbaru (NeonDB Live Feed)
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {globalStats.recentParticipants.length} Data Terakhir
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400">
                        <th className="py-2">Nama / ID</th>
                        <th className="py-2 text-center">Umur</th>
                        <th className="py-2 text-center">Pre Score</th>
                        <th className="py-2 text-center">Post Score</th>
                        <th className="py-2 text-center">Pre Risky</th>
                        <th className="py-2 text-center">Post Risky</th>
                        <th className="py-2 text-right">Reduction (X%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {globalStats.recentParticipants.map((p, idx) => (
                        <tr key={p.sessionId || idx} className="hover:bg-slate-50/60 transition">
                          <td className="py-2.5 font-bold text-[#102a54]">
                            {p.participantName || `Responden #${idx + 1}`}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#0876c9]">
                              {p.participantAge ? `${p.participantAge} thn` : "25 thn"}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-mono text-slate-500">
                            {p.preScore || 0}
                          </td>
                          <td className="py-2.5 text-center font-mono font-bold text-emerald-600">
                            {p.postScore || 0}
                          </td>
                          <td className="py-2.5 text-center font-mono text-amber-600">
                            {p.preRiskyRate}%
                          </td>
                          <td className="py-2.5 text-center font-mono text-emerald-600">
                            {p.postRiskyRate}%
                          </td>
                          <td className="py-2.5 text-right font-mono font-black text-[#0876c9]">
                            {p.relativeReduction}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Security Recommendations Section */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-[#0876c9]">
              <Icon name="Shield" size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-[#102a54] md:text-lg">
                Personal Security Recommendation
              </h2>
              <p className="text-xs text-slate-400">
                Rekomendasi langkah perlindungan berdasarkan evaluasi performamu
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#102a54]">
                <Icon name="LockKeyhole" size={16} className="text-[#0876c9]" />
                Kerahasiaan OTP & PIN
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Jangan pernah membagikan kode OTP 6 digit atau PIN kepada siapa pun. Petugas perbankan resmi memiliki sistem otentikasi internal dan tidak meminta kode rahasia.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#102a54]">
                <Icon name="Zap" size={16} className="text-[#0876c9]" />
                Kewaspadaan File .APK
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Hindari membuka file berekstensi .apk dari pengirim WhatsApp atau Telegram. Kurir paket, surat undangan, atau tilang resmi tidak disebarkan dalam format instalasi aplikasi.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#102a54]">
                <Icon name="QrCode" size={16} className="text-[#0876c9]" />
                Verifikasi Nama Merchant QRIS
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Selalu teliti nama merchant di layar konfirmasi sebelum menginput PIN. Pastikan nama toko sesuai dengan lokasi pembayaran fisikmu.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#102a54]">
                <Icon name="UsersRound" size={16} className="text-[#0876c9]" />
                Edukasi Keluarga Terdekat
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Kelompok rentan seperti lansia dan remaja sering menjadi target social engineering. Bagikan link challenge ini secara berkala ke grup keluarga.
              </p>
            </div>
          </div>
        </section>

        {/* Gamified Badges / Pencapaian */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
                Pencapaian Anti-Fraud
              </span>
              <h2 className="text-base font-black text-[#102a54] md:text-lg">
                Badge & Status Penguasaan
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {BADGES_DATA.filter((b) => score >= b.unlockedScore).length} dari {BADGES_DATA.length} Terbuka
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {BADGES_DATA.map((badge) => {
              const unlocked = score >= badge.unlockedScore
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center rounded-2xl border p-4 text-center transition ${
                    unlocked
                      ? "border-blue-100 bg-blue-50/50"
                      : "border-slate-100 bg-slate-50/40 opacity-50"
                  }`}
                >
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      unlocked
                        ? "bg-[#0876c9] text-white shadow-sm"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Icon name={badge.icon} size={22} />
                  </div>

                  <div className="mt-3 text-xs font-black text-[#102a54]">
                    {badge.title}
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    {badge.desc}
                  </p>

                  <span
                    className={`mt-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      unlocked
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {unlocked ? "Terbuka" : `Skor Min. ${badge.unlockedScore}`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <BottomSpace />
      <BottomNav />
    </div>
  )
}
