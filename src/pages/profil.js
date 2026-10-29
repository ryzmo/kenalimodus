import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  BADGES_DATA,
  formatRupiah
} from "../data/modusData"

export default function ProfilPage() {
  const { data: session } = useSession()
  const [participantName, setParticipantName] = useState("Nasabah BCA")
  const [participantAge, setParticipantAge] = useState(25)
  const [copied, setCopied] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")

  const [resultData, setResultData] = useState({
    score: 84,
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

  useEffect(() => {
    if (session?.user?.name) {
      setParticipantName(session.user.name)

      // Sinkronisasi otomatis dari localStorage ke Cloud Neon jika login
      const storedPoints = localStorage.getItem("kenali_points_data")
      const storedResult = localStorage.getItem("kenali_modus_result")
      let currentPoints = 1250
      let currentScore = resultData.score

      if (storedPoints) {
        try {
          const parsedPts = JSON.parse(storedPoints)
          if (parsedPts.totalPoints) currentPoints = parsedPts.totalPoints
        } catch (e) {}
      }

      if (storedResult) {
        try {
          const parsedRes = JSON.parse(storedResult)
          if (parsedRes.score) currentScore = parsedRes.score
        } catch (e) {}
      }

      if (session.user.id) {
        fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            safeScore: currentScore,
            totalPoints: currentPoints,
            currentStreak: 1
          })
        }).catch((err) => console.log("Auto sync notice:", err))
      }
    }
  }, [session])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)

      const storedName = localStorage.getItem("kenali_participant_name")
      if (storedName) setParticipantName(storedName)

      const storedAge = localStorage.getItem("kenali_participant_age")
      if (storedAge) setParticipantAge(Number(storedAge) || 25)

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
    resultData.score >= 85
      ? BADGES_DATA[2]
      : resultData.score >= 75
        ? BADGES_DATA[1]
        : BADGES_DATA[0]

  const statusLabel =
    resultData.score >= 80
      ? "Sangat Waspada"
      : resultData.score >= 60
        ? "Cukup Waspada"
        : "Perlu Latihan"

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        <AppHeader
          title="Profil"
          subtitle="Bank BCA #AwasModus"
          showBack={true}
          backHref="/"
        />

        {/* HERO SECTION: Profil Ringkas & Skor Keamanan */}
        <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-2 pb-6 text-white">
          <div className="flex items-center justify-between gap-6">
            <div className="max-w-md">
              {/* Profile Chip */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-sky-100 backdrop-blur-xs">

                <span>{participantAge} Tahun</span>
              </div>

              {/* Safe Score Display */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-none drop-shadow-sm">
                  {resultData.score}
                </span>
                <span className="text-base font-bold text-white/80">/100</span>
                <span className={`ml-2 px-3 py-0.5 rounded-full text-xs font-bold ${resultData.score >= 80
                  ? "bg-emerald-400/25 text-emerald-100 border border-emerald-300/40"
                  : resultData.score >= 60
                    ? "bg-amber-400/25 text-amber-100 border border-amber-300/40"
                    : "bg-red-400/25 text-red-100 border border-red-300/40"
                  }`}>

                  {statusLabel}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-sm leading-relaxed">
                Telah menyelesaikan simulasi refleks dengan {resultData.correctCount} dari {resultData.totalQuestions} keputusan tepat.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <Link
                  href="/challenge"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#003882] shadow-sm hover:bg-slate-50 transition active:scale-95"
                >
                  <span>Uji Ulang</span>
                </Link>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 px-3.5 py-2 text-xs font-bold text-white transition active:scale-95 backdrop-blur-md cursor-pointer"
                >
                  <Icon name="Share2" size={14} />
                  <span>{copied ? "Link Tersalin!" : "Bagikan"}</span>
                </button>
                {session ? (
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/40 px-3.5 py-2 text-xs font-bold text-rose-100 transition active:scale-95 backdrop-blur-md cursor-pointer"
                  >
                    <Icon name="LogOut" size={14} />
                    <span>Keluar</span>
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 text-[#002554] hover:bg-amber-300 px-3.5 py-2 text-xs font-black transition active:scale-95 shadow-sm"
                  >
                    <Icon name="CloudUpload" size={14} />
                    <span>Cadangkan Skor ke Akun</span>
                  </Link>
                )}
              </div>
            </div>

            {/* 3D Shield Icon Asset */}
            <div className="hidden sm:flex h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 items-center justify-center p-3 shadow-sm">
              <Image
                src="/3d-shield-icon.png"
                alt="Badge Keamanan"
                width={80}
                height={80}
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM SHEET: Evaluasi, Lencana & Kunci Keamanan */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">

            {/* Top Grid: Lencana Keamanan + Evaluasi Resiko */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Lencana Penghargaan */}
              <section className="glass-card rounded-[26px] p-5 border border-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0292fc] bg-blue-50 px-2.5 py-1 rounded-full">
                      Lencana Kompetensi
                    </span>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Icon name="Award" size={14} />
                      Tercapai
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 text-[#0292fc] flex items-center justify-center border border-blue-100 shadow-2xs">
                      <Icon name={badgeEarned.icon || "Shield"} size={26} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-black text-[#002554]">
                        {badgeEarned.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {badgeEarned.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Target Lencana Berikutnya</span>
                  <span className="font-bold text-[#0292fc]">Skor 100 PTS</span>
                </div>
              </section>

              {/* Metrik Pengurangan Risiko */}
              <section className="glass-card rounded-[26px] p-5 border border-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0292fc] bg-blue-50 px-2.5 py-1 rounded-full">
                      Dampak Intervensi Edukasi
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Efektif
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-2xl bg-red-50/70 p-3 border border-red-100">
                      <div className="text-[10px] text-red-600 font-bold uppercase">Risiko Sebelum Tes</div>
                      <div className="text-xl font-black text-red-700 mt-1">{impactData.preRiskyRate}%</div>
                      <div className="text-[10px] text-red-500 mt-0.5">Rentan Tertipu</div>
                    </div>
                    <div className="rounded-2xl bg-emerald-50/70 p-3 border border-emerald-100">
                      <div className="text-[10px] text-emerald-700 font-bold uppercase">Risiko Pasca Edukasi</div>
                      <div className="text-xl font-black text-emerald-700 mt-1">{impactData.postRiskyRate}%</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Penurunan Signifikan</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 text-center">
                  Estimasi kerugian terlindungi per 1.000 nasabah: <strong className="text-emerald-700">{formatRupiah(impactData.potentialLossAvoided1k)}</strong>
                </div>
              </section>

            </div>

            {/* Kunci Emas Perlindungan BCA */}
            <section className="glass-card rounded-[28px] p-5 border border-white">
              <div className="flex items-center gap-2 text-[#002554] mb-3">

                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  3 Aturan Emas Keamanan Transaksi
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center font-black text-xs shrink-0">
                      1
                    </span>
                    <span className="text-xs font-black text-[#002554]">Jaga OTP & PIN</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Jangan pernah memberitahukan kode OTP, PIN m-BCA, atau 3 angka CVV kartu debit/kredit kepada siapapun.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center font-black text-xs shrink-0">
                      2
                    </span>
                    <span className="text-xs font-black text-[#002554]">Haram Buka APK</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Tolak unduh dan instal file berakhiran .apk di WhatsApp atau SMS yang mengaku undangan, paket, atau surat tilang.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center font-black text-xs shrink-0">
                      3
                    </span>
                    <span className="text-xs font-black text-[#002554]">Verifikasi QRIS</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Selalu cocokan nama toko/merchant yang muncul di layar sebelum menekan tombol konfirmasi bayar saat scan QRIS.
                  </p>
                </div>
              </div>
            </section>

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

