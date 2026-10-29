import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  BADGES_DATA,
  IMPACT_BENCHMARK_OJK,
  formatRupiah
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

  const [copied, setCopied] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)
      const storedResult = localStorage.getItem("kenali_modus_result")
      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult)
          if (parsed.score !== undefined) setResultData(parsed)
        } catch (e) {
          console.error(e)
        }
      }

      const storedImpact = localStorage.getItem("kenali_impact_metric")
      if (storedImpact) {
        try {
          const parsedImp = JSON.parse(storedImpact)
          setImpactData(parsedImp)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  const handleCopy = () => {
    const text = `Safe Score saya di Kenali Modus BCA adalah ${resultData.score}/100! Uji refleks anti-penipuanmu sekarang: ${originUrl}/challenge`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const badgeEarned =
    resultData.score >= 80
      ? BADGES_DATA[0]
      : resultData.score >= 60
        ? BADGES_DATA[1]
        : BADGES_DATA[2]

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-[#0292fc] md:bg-gradient-to-b md:from-[#0292fc] md:via-[#66baff] md:to-[#edf5fc]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">
        
        <AppHeader title="Profil & Hasil" subtitle="Evaluasi Keputusan Keamanan" />

        {/* Top Score Banner */}
        <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-1 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-100">
                Safe Score Akun Anda
              </div>
              <div className="text-4xl font-black tracking-tight text-white mt-0.5">
                {resultData.score} <span className="text-sm font-bold text-sky-200">/ 100</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-white/95">
                Lencana: {badgeEarned.title} • {resultData.correctCount} dari {resultData.totalQuestions} Benar
              </div>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center p-2 shadow-sm">
              <Image
                src="/3d-shield-icon.png"
                alt="Security Shield"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href="/challenge"
              className="flex-1 rounded-xl bg-white py-2 text-center text-xs font-bold text-[#003882] shadow-xs active:scale-95 transition"
            >
              Uji Ulang Challenge
            </Link>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 rounded-xl bg-white/25 backdrop-blur-md border border-white/40 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
            >
              {copied ? "Hasil Tersalin!" : "Bagikan Hasil"}
            </button>
          </div>
        </section>

        {/* BOTTOM SHEET: Impact & Detailed Feedback */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10"><div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-5">
          
          {/* Behavioral Impact Metric Card */}
          <section className="glass-card rounded-[26px] p-4 border border-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0292fc]">
                Dampak Intervensi Refleks (ARI Metric)
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Efektif
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-[10px] text-slate-400 font-semibold">Risiko Sebelum</div>
                <div className="text-lg font-black text-red-500 mt-0.5">{impactData.preRiskyRate}%</div>
              </div>
              <div className="rounded-2xl bg-blue-50 p-2.5 border border-blue-100">
                <div className="text-[10px] text-[#0292fc] font-semibold">Risiko Sesudah</div>
                <div className="text-lg font-black text-[#003882] mt-0.5">{impactData.postRiskyRate}%</div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-3">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                Potensi Kerugian Dihindari (Per 1.000 Nasabah)
              </div>
              <div className="text-sm font-black text-emerald-900 mt-0.5">
                {formatRupiah(impactData.potentialLossAvoided1k)}
              </div>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Estimasi berbasis rata-rata kerugian penipuan perbankan menurut OJK & Satgas PASTI.
              </p>
            </div>
          </section>

          {/* Rekomendasi Resmi BCA */}
          <section className="glass-card rounded-[26px] p-4 border border-white">
            <div className="text-xs font-black uppercase tracking-wider text-[#002554] mb-2">
              Kunci Emas Perlindungan Nasabah
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Jangan pernah membagikan <strong>OTP, PIN, atau 3 angka CVV</strong> kartu kepada siapapun, termasuk staf BCA.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Hindari klik file <strong>.APK</strong> di WhatsApp berkedok dokumen surat tilang, undangan, atau resi kurir.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Selalu periksa nama merchant sebelum memasukkan PIN pada saat transaksi QRIS.</span>
              </li>
            </ul>
          </section>

          <BottomSpace />
          </div>
        </main>

        <div className="md:hidden"><BottomNav /></div>
      </div>
    </div>
  )
}
