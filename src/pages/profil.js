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
import { isPresentationMode, DUMMY_PRESENTATION_DATA } from "../utils/presentationMode"

export default function ProfilPage() {
  const { data: session } = useSession()
  const [participantName, setParticipantName] = useState("Nasabah BCA")
  const [participantAge, setParticipantAge] = useState(25)
  const [copied, setCopied] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")

  const [resultData, setResultData] = useState(null)

  const [impactData, setImpactData] = useState({
    preRiskyRate: 60,
    postRiskyRate: 0,
    behavioralImpact: 60,
    relativeReduction: 100,
    potentialLossAvoided1k: 21890000000,
    preScore: 40,
    postScore: 100
  })

  // State histori pengerjaan dari database
  const [challengeHistory, setChallengeHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [stats, setStats] = useState({
    avgScore: 0,
    latestScore: 0,
    totalSessions: 0
  })
  const [activeTab, setActiveTab] = useState("detail") // "detail" | "histori" | "panduan"
  const [expandedSessionId, setExpandedSessionId] = useState(null)
  const [totalPoints, setTotalPoints] = useState(null)

  // Fetch histori sesi challenge dari API database Neon HANYA jika sudah login
  const fetchChallengeHistory = async () => {
    if (!session?.user?.id) {
      setChallengeHistory([])
      setStats({ avgScore: 0, latestScore: 0, totalSessions: 0 })
      return
    }

    try {
      const res = await fetch(`/api/challenge/history?userId=${session.user.id}`)
      const json = await res.json()
      if (json.success && json.data) {
        setChallengeHistory(json.data.history || [])
        setStats({
          avgScore: json.data.avgScore || 0,
          latestScore: json.data.latestScore || 0,
          totalSessions: json.data.totalSessions || 0
        })
      }
    } catch (err) {
      console.error("Gagal load histori challenge:", err)
    }
  }

  // Fetch data user (poin live dari DB) HANYA jika sudah login
  const fetchUserData = async () => {
    if (!session?.user?.id) {
      setTotalPoints(null)
      return
    }

    try {
      const res = await fetch(`/api/user/sync?userId=${session.user.id}`)
      const json = await res.json()
      if (json.success && json.data) {
        if (json.data.total_points !== undefined) setTotalPoints(json.data.total_points)
      }
    } catch (err) {
      console.error("Gagal load user sync:", err)
    }
  }

  useEffect(() => {
    fetchChallengeHistory()
    fetchUserData()
  }, [session])

  useEffect(() => {
    // Jika Mode Presentasi aktif, isi data simulasi profil
    if (isPresentationMode()) {
      setParticipantName(DUMMY_PRESENTATION_DATA.userName)
      setTotalPoints(DUMMY_PRESENTATION_DATA.totalPoints)
      setStats({
        avgScore: DUMMY_PRESENTATION_DATA.avgScore,
        latestScore: DUMMY_PRESENTATION_DATA.latestScore,
        totalSessions: DUMMY_PRESENTATION_DATA.totalSessions
      })
      setChallengeHistory(DUMMY_PRESENTATION_DATA.challengeHistory)
      return
    }

    if (session?.user?.name) {
      setParticipantName(session.user.name)

      if (session.user.id) {
        fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            safeScore: stats.avgScore || null,
            totalPoints: totalPoints || 0,
            currentStreak: 1
          })
        }).catch((err) => console.log("Auto sync notice:", err))
      }
    } else {
      // Jika belum login, reset semua state data agar bersih dan tidak membaca riwayat tamu
      setParticipantName("Tamu")
      setResultData(null)
      setTotalPoints(null)
      setChallengeHistory([])
      setStats({ avgScore: 0, latestScore: 0, totalSessions: 0 })
    }
  }, [session])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)
    }
  }, [])

  const handleCopy = () => {
    const scoreVal = (session ? displayScore : (stats.totalSessions > 0 ? displayScore : null)) || 80
    const text = `Safe Score saya di Kenali Modus BCA adalah ${scoreVal}/100! Uji refleks anti-penipuanmu sekarang: ${originUrl}/challenge`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const displayScore = stats.totalSessions > 0
    ? stats.avgScore
    : (resultData?.score !== undefined ? resultData.score : null)

  const hasScore = displayScore !== null

  const latestSession = challengeHistory.length > 0 ? challengeHistory[0] : null

  const statusLabel = hasScore
    ? (displayScore >= 80 ? "Sangat Waspada" : displayScore >= 60 ? "Cukup Waspada" : "Perlu Latihan")
    : "Belum Ada Skor"

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        <AppHeader
          title="Profil"
          subtitle="Bank BCA #AwasModus"
          showBack={true}
          backHref="/"
          rightElement={
            !session ? (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#003882] hover:bg-slate-50 px-3.5 py-1.5 text-xs font-black transition active:scale-95 shadow-md cursor-pointer"
              >
                <Icon name="LogIn" size={14} />
                <span>Masuk</span>
              </Link>
            ) : null
          }
        />

        {/* HERO SECTION: Profil Ringkas & Status Login */}
        <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-2 pb-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">


              {/* Name & Safe Score Display */}
              <div className="mt-3">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {session?.user?.name || participantName}
                </h1>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-none drop-shadow-sm">
                  {session ? displayScore : (stats.totalSessions > 0 ? displayScore : "-")}
                </span>
                <span className="text-base font-bold text-white/80">/100</span>
                <span className="ml-2 px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                  {session ? statusLabel : (stats.totalSessions > 0 ? statusLabel : "Belum Ada Skor")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-sky-100 font-semibold">
                <span>Rata-Rata: <strong>{session ? displayScore : "-"} PTS</strong></span>
                {stats.totalSessions > 0 && (
                  <span>• Sesi Terakhir: <strong>{stats.latestScore} PTS</strong></span>
                )}
                <span>• Total Poin: <strong>{session ? (totalPoints || 0).toLocaleString() : 0} PTS</strong></span>
              </div>

              <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-sm leading-relaxed">
                {session
                  ? (stats.totalSessions > 0
                    ? `Akun Anda telah menyelesaikan ${stats.totalSessions} sesi simulasi refleks dengan total ${(totalPoints || 0).toLocaleString()} poin aktif tersimpan di cloud.`
                    : "Akun Anda siap mengikuti challenge untuk mengukur ketahanan safe score digital perbankan.")
                  : "Anda masuk sebagai tamu. Login untuk menyimpan progres, Safe Score, lencana, dan poin rewards."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <Link
                  href="/challenge"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#003882] shadow-sm hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                >

                  <span>{stats.totalSessions > 0 ? "Uji Ulang" : "Mulai Challenge"}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 px-3.5 py-2 text-xs font-bold text-white transition active:scale-95 backdrop-blur-md cursor-pointer"
                >
                  <Icon name="Share2" size={14} />

                </button>

                {session && (
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/40 px-3.5 py-2 text-xs font-bold text-rose-100 transition active:scale-95 backdrop-blur-md cursor-pointer"
                  >
                    <Icon name="LogOut" size={14} />
                    <span>Keluar Akun</span>
                  </button>
                )}
              </div>
            </div>


          </div>
        </section>

        {/* BOTTOM SHEET: Evaluasi, Lencana & Kunci Keamanan */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">

            {/* TAB SELECTOR: Segmented Control Bar Simple & Rapi */}
            <div className="flex rounded-2xl bg-slate-200/60 p-1 border border-slate-200/80 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab("detail")}
                className={`flex-1 py-2 px-2.5 rounded-xl transition text-center cursor-pointer ${activeTab === "detail"
                    ? "bg-white text-[#003882] shadow-xs"
                    : "hover:text-[#003882]"
                  }`}
              >
                Detail Safe Score
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("histori")}
                className={`flex-1 py-2 px-2.5 rounded-xl transition text-center cursor-pointer ${activeTab === "histori"
                    ? "bg-white text-[#003882] shadow-xs"
                    : "hover:text-[#003882]"
                  }`}
              >
                Histori Challenge
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("panduan")}
                className={`flex-1 py-2 px-2.5 rounded-xl transition text-center cursor-pointer ${activeTab === "panduan"
                    ? "bg-white text-[#003882] shadow-xs"
                    : "hover:text-[#003882]"
                  }`}
              >
                Panduan
              </button>
            </div>

            {/* TAB 0: DETAIL & EVALUASI ANALISIS SAFE SCORE */}
            {activeTab === "detail" && (
              <div className="space-y-4 animate-in fade-in">
                {/* Ringkasan Evaluasi Safe Score */}
                <section className="glass-card rounded-[28px] p-5 sm:p-6 border border-white space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#003882]">
                        DIAGNOSA REFLEKS KEAMANAN
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-[#002554] tracking-tight mt-0.5">
                        {latestSession
                          ? (latestSession.evaluation_headline || "Analisis Ketahanan Siber")
                          : hasScore
                            ? (displayScore >= 80 ? "Ketahanan Sangat Kuat" : displayScore >= 60 ? "Cukup Waspada" : "Risiko Kerentanan Tinggi")
                            : "Belum Mengikuti Challenge"}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#003882]">
                        {hasScore ? displayScore : 0}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">/100</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#003882] border border-blue-100">
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* 4 Kartu Breakdown dengan warna seragam dan teks clean tanpa icon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* 1. Evaluasi & Nilai */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-4">
                      <div className="text-xs font-black uppercase tracking-wider text-[#003882]">
                        Evaluasi Performa Nilai
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {hasScore
                          ? displayScore >= 80
                            ? `Skor Anda ${displayScore}/100 menunjukkan ketajaman refleks perbankan digital yang sangat prima dalam menangkal rekayasa sosial dan tautan berbahaya.`
                            : displayScore >= 60
                              ? `Skor Anda ${displayScore}/100 berada pada level moderat. Anda sudah mengenali modus umum, namun beberapa trik manipulasi psikologis masih dapat mengecoh refleks Anda.`
                              : `Skor Anda ${displayScore}/100 tergolong rentan. Akun Anda memiliki risiko tinggi menjadi korban kebocoran kredensial atau penipuan file malware.`
                          : "Anda belum memiliki catatan skor. Kerjakan simulasi 2-Minute Scam Challenge untuk mengukur tingkat kerentanan akun Anda."}
                      </p>
                    </div>

                    {/* 2. Titik Kurang / Celah Terdeteksi */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-4">
                      <div className="text-xs font-black uppercase tracking-wider text-[#003882]">
                        Titik Kurang & Celah Terdeteksi
                      </div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        {latestSession && Array.isArray(latestSession.details_json) && latestSession.details_json.some((d) => !d.isCorrect)
                          ? `Terdeteksi celah pada modus: ${latestSession.details_json.filter((d) => !d.isCorrect).map((d) => d.title || d.category).join(", ")}. Modus ini memanfaatkan rasa terburu-buru dan kepanikan.`
                          : hasScore && displayScore < 80
                            ? "Celah umumnya muncul pada skenario kontak WhatsApp tidak resmi yang menyamar sebagai CS Bank, serta kelalaian memeriksa alamat tautan URL KlikBCA resmi."
                            : "Tidak ditemukan titik rawan kritis. Seluruh skenario terbaru berhasil direspon dengan tepat tanpa terjebak manipulasi."}
                      </p>
                    </div>

                    {/* 3. Apa yang Harus Dilakukan */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-4">
                      <div className="text-xs font-black uppercase tracking-wider text-[#003882]">
                        Tindakan yang Harus Dilakukan
                      </div>
                      <ul className="text-xs text-slate-600 mt-2 space-y-1.5 leading-relaxed font-medium list-disc list-inside">
                        <li><strong>Terapkan Aturan 3 Detik:</strong> Berhenti sejenak dan jangan langsung klik tautan atau menyetujui transaksi mendesak.</li>
                        <li><strong>Kunci Kerahasiaan:</strong> Jangan pernah membagikan OTP, PIN, atau CVV kepada siapa pun termasuk pihak mengaku bank.</li>
                        <li><strong>Tolak File .APK:</strong> Segera tolak dan hapus dokumen berakhiran .apk yang dikirim via WhatsApp/Telegram.</li>
                      </ul>
                    </div>

                    {/* 4. Rekomendasi Pelatihan */}
                    <div className="rounded-2xl bg-white border border-slate-200/80 p-4">
                      <div className="text-xs font-black uppercase tracking-wider text-[#003882]">
                        Rekomendasi Langkah Nyata
                      </div>
                      <div className="text-xs text-slate-600 mt-2 space-y-2 leading-relaxed font-medium">
                        <p>
                          Pelajari materi katalog modus terkait dan lakukan uji ulang berkala untuk memperkuat memori refleks proteksi siber Anda.
                        </p>
                        <div className="pt-1 flex flex-wrap gap-2">
                          <Link
                            href="/modus"
                            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[#003882] text-[11px] font-bold hover:bg-slate-100 transition"
                          >
                            <span>Buka Katalog Modus</span>
                          </Link>
                          <Link
                            href="/challenge"
                            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#003882] text-white text-[11px] font-bold hover:bg-[#002554] transition"
                          >
                            <span>Ikuti Challenge Ulang</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sesi Soal Terakhir yang Dikerjakan Beserta Pembahasan */}
                {latestSession && Array.isArray(latestSession.details_json) && latestSession.details_json.length > 0 && (
                  <section className="glass-card rounded-[28px] p-5 sm:p-6 border border-white space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#003882]">
                        Hasil Soal Sesi Terakhir ({latestSession.details_json.length} Soal)
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Benar: {latestSession.correct_count || 0} • Salah: {latestSession.failed_count || 0}
                      </span>
                    </div>

                    <div className="space-y-2.5 mt-2">
                      {latestSession.details_json.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          className="p-3.5 rounded-2xl border border-slate-100 bg-white text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 bg-blue-50 text-[#003882]">
                                {dIdx + 1}
                              </span>
                              <span className="font-black text-[#002554]">{d.title}</span>
                              {d.category && (
                                <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                  {d.category}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                              {d.isCorrect ? "Tepat" : "Rentan"}
                            </span>
                          </div>

                          <div className="mt-2 text-slate-600 pl-7 text-[11px] leading-relaxed space-y-1">
                            <div>Jawaban Anda: <strong>{d.chosenText || "-"}</strong></div>
                            {d.feedback && (
                              <div className="text-slate-500 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                Evaluasi: {d.feedback}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* TAB 1: PANDUAN KEAMANAN */}
            {activeTab === "panduan" && (
              <div className="space-y-5">
                {/* 3 Aturan Emas Keamanan Transaksi */}
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
              </div>
            )}

            {/* TAB 2: HISTORI CHALLENGE & EVALUASI */}
            {activeTab === "histori" && (
              <section className="glass-card rounded-[28px] p-5 border border-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#003882] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      Histori Challenge & Progres
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    {challengeHistory.length > 0 ? `${challengeHistory.length} Sesi Terdata` : "Belum Ada Sesi"}
                  </div>
                </div>

                {loadingHistory ? (
                  <div className="space-y-2.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-2.5 w-24" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-14 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : challengeHistory.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                    <div className="mx-auto w-10 h-10 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center mb-2">
                      <Icon name="Target" size={20} />
                    </div>
                    <div className="text-xs font-bold text-[#002554]">Belum Ada Riwayat Sesi Challenge</div>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Mulai 2-Minute Scam Challenge sekarang untuk melatih refleks finansial dan mencatat riwayat skor Anda di database.
                    </p>
                    <Link
                      href="/challenge"
                      className="inline-flex items-center gap-1.5 mt-3 rounded-xl bg-[#0292fc] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#007ad6] transition cursor-pointer"
                    >
                      <span>Mulai Challenge</span>
                      <Icon name="ArrowRight" size={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
                    {challengeHistory.map((item, idx) => {
                      const isExpanded = expandedSessionId === (item.id || idx)
                      return (
                        <div key={item.id || idx} className="transition">
                          {/* Row Header Ringkas & Rapi */}
                          <button
                            type="button"
                            onClick={() => setExpandedSessionId(isExpanded ? null : (item.id || idx))}
                            className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="h-7 w-7 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center text-xs font-black shrink-0">
                                #{challengeHistory.length - idx}
                              </span>
                              <div className="truncate">
                                <div className="text-xs font-black text-[#002554] truncate">
                                  {item.evaluation_headline || "2-Minute Scam Challenge"}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <div className="text-right">
                                <span className="text-xs sm:text-sm font-black text-[#003882]">
                                  {item.score}/100
                                </span>
                              </div>

                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.score >= 80
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : item.score >= 60
                                    ? "bg-blue-50 text-[#003882] border-blue-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                  }`}
                              >
                                +{item.points_earned || 20} PTS
                              </span>

                              <Icon
                                name="ChevronDown"
                                size={16}
                                className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#003882]" : ""
                                  }`}
                              />
                            </div>
                          </button>

                          {/* Accordion Detail Soal (Hanya muncul jika di-klik) */}
                          {isExpanded && Array.isArray(item.details_json) && item.details_json.length > 0 && (
                            <div className="p-3.5 sm:p-4 bg-slate-50/60 border-t border-slate-100 animate-in fade-in">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Rincian Jawaban ({item.correct_count} Benar, {item.failed_count} Salah):
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {item.details_json.map((d, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className={`p-2.5 rounded-xl border text-[11px] ${d.isCorrect
                                      ? "bg-white border-slate-100 text-slate-700"
                                      : "bg-rose-50/40 border-rose-100 text-slate-800"
                                      }`}
/*  */                                  >
                                    <div className="flex items-center justify-between font-bold text-[10px]">
                                      <span className="truncate pr-1 text-[#002554]">{d.title}</span>
                                      <span className={d.isCorrect ? "text-emerald-600 shrink-0" : "text-rose-600 shrink-0"}>
                                        {d.isCorrect ? "✓ Tepat" : "✗ Rentan"}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                                      {d.chosenText}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

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

