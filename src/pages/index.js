import { useState, useEffect } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import ModusCard from "../components/ModusCard"
import Icon from "../components/Icon"
import { MODUS_LIST } from "../data/modusData"

export default function Home() {
  const [safeScore, setSafeScore] = useState(78)
  const [copied, setCopied] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)
      const stored = localStorage.getItem("kenali_modus_result")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.score !== undefined) {
            setSafeScore(parsed.score)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  const handleCopyLink = () => {
    const url = `${originUrl}/challenge`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const [activeChannelModal, setActiveChannelModal] = useState(null)
  const modusOfTheWeek = MODUS_LIST[0]
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Yuk uji seberapa aman kamu dari modus penipuan online terbaru di KENALI MODUS: ${originUrl}/challenge`
  )}`

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* Hero section */}
        <section className="relative mt-5 overflow-hidden rounded-[2rem] gradient-brand p-6 text-white shadow-soft md:p-10">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-cyan-300/10 pointer-events-none" />

          <div className="relative max-w-xl">
            {/* Badge */}

            {/* Heading */}
            <h1 className="text-3xl font-black leading-tight md:text-5xl">
              Yuk, kenali modusnya
              <br />
              sebelum jadi korbannya.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-blue-50 md:text-base font-normal">
              Bukan sekadar membaca artikel. Latih refleks pengambilan keputusanmu lewat simulasi 2-Minute Challenge, ukur Safe Score, dan lindungi orang terdekat.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/challenge"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0876c9] px-6 py-3.5 text-sm font-black text-white shadow-soft transition duration-200 hover:bg-[#075da8]"
              >
                Mulai 2-Minute Challenge
              </Link>

            </div>
          </div>
        </section>

        {/* Core Habit Loop */}
        <section className="mt-6 rounded-3xl bg-white p-5 shadow-soft md:p-7">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0876c9]">
                Core Habit Loop
              </span>
              <h2 className="mt-2 text-xl font-black leading-tight text-[#102a54] md:text-2xl">
                Dari edukasi pasif ke praktik pengambilan keputusan
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-400">
              5 Langkah Membangun Refleks Aman
            </p>
          </div>

          {/* Stepper Timeline Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {[
              {
                step: "01",
                name: "Discover",
                desc: "Pahami pola & skenario penipuan terbaru",
              },
              {
                step: "02",
                name: "Learn",
                desc: "Analisis ciri, taktik, dan red flags",
              },
              {
                step: "03",
                name: "Practice",
                desc: "Simulasi keputusan di bawah tekanan",
              },
              {
                step: "04",
                name: "Safe Score",
                desc: "Ukur ketahanan & refleks keamanan",
              },
              {
                step: "05",
                name: "Protect",
                desc: "Lindungi diri & keluarga bersama",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest text-[#0876c9]">
                      {item.step}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-[#0876c9] transition" />
                  </div>
                  <h3 className="mt-2 text-sm font-black text-[#102a54]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick features */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {/* Modus of the week */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-soft md:col-span-2">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Modus of the week
                  </p>
                  <h2 className="mt-1 text-xl font-black text-[#102a54]">
                    {modusOfTheWeek.title}
                  </h2>
                </div>
              </div>
            </div>

            <Link
              href="/challenge"
              className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-[#102a54] transition hover:bg-blue-50 hover:text-[#0876c9]"
            >
              Coba skenarionya langsung
              <Icon name="ChevronRight" size={18} />
            </Link>
          </div>

          {/* Safe Score Preview */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-soft">
            <div>
              <div className="flex items-center gap-2 text-[#0876c9]">
                <Icon name="TrendingUp" size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Safe Score Anda
                </span>
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-black text-[#102a54]">
                  {safeScore}
                </span>
                <span className="pb-1 text-sm font-bold text-slate-400">
                  / 100
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#0876c9] transition-all duration-500"
                  style={{ width: `${safeScore}%` }}
                />
              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                Berdasarkan hasil evaluasi challenge terakhirmu.
              </p>
            </div>

            <Link
              href="/hasil"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-black text-[#0876c9] hover:underline"
            >
              Lihat profil & rekomendasi
              <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        </section>

        {/* BCA Official #AwasModus Banner */}
        <section className="mt-6 rounded-3xl gradient-brand p-5 text-white shadow-soft md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-cyan-400/20 border border-cyan-300/30 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-cyan-200">
                  #AWASMODUS BCA
                </span>
                <span className="text-[11px] text-blue-200 font-semibold">
                  Mantra Jitu B-C-A Lawan Penipu
                </span>
              </div>
              <h3 className="mt-2 text-base font-black md:text-lg">
                Jangan Tertipu Website Palsu! Terapkan Rumus B-C-A
              </h3>
              <p className="mt-1 text-xs text-blue-100 max-w-xl">
                Buka dengan ketik manual, Cek keaslian website, dan Ayo bintangin di browsermu. Tonton video edukasi & baca artikel resmi Bank BCA.
              </p>
            </div>

            <Link
              href="/modus"
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-[#075da8] shadow-md hover:bg-slate-100 transition"
            >
              <span>Tonton & Baca Edukasi</span>
              <Icon name="ArrowRight" size={14} />
            </Link>
          </div>
        </section>

        {/* Modus terbaru list */}
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Stay updated
              </p>
              <h2 className="mt-1 text-2xl font-black text-[#102a54]">
                Modus Terbaru
              </h2>
            </div>

            <Link
              href="/modus"
              className="inline-flex items-center gap-1 text-sm font-black text-[#0876c9] hover:underline"
            >
              Lihat semua
              <Icon name="ChevronRight" size={15} />
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {MODUS_LIST.slice(0, 3).map((item) => (
              <ModusCard
                key={item.id}
                tag={item.tag}
                title={item.title}
                desc={item.desc}
                level={item.level}
                icon={item.icon}
              />
            ))}
          </div>
        </section>

        {/* Kanal implementasi & distribusi */}
        <section className="mt-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
                Omnichannel Strategy
              </span>
              <h2 className="mt-1 text-2xl font-black text-[#102a54]">
                Kanal & Implementasi
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-400">
              Integrasi ekosistem distribusi Kenali Modus
            </p>
          </div>

          <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. myBCA */}
            <div
              onClick={() =>
                setActiveChannelModal({
                  type: "myBCA",
                  badge: "In-App Feature",
                  title: "Integrasi myBCA",
                  subtitle: "Banner & Card Menuju Challenge / Modus Terbaru",
                  desc: "Nasabah myBCA dapat mengakses modul Kenali Modus langsung dari homepage aplikasi myBCA melalui banner dinamis atau card rekomendasi berbasis risiko transaksi nasabah.",
                  previewType: "mybca",
                })
              }
              className="group cursor-pointer rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0876c9]">
                  myBCA
                </span>
                <span className="text-[11px] font-bold text-[#0876c9] group-hover:translate-x-0.5 transition">
                  Lihat Mockup →
                </span>
              </div>
              <h3 className="mt-3 text-base font-black text-[#102a54]">
                In-App Banner / Card
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Banner/card interaktif di beranda aplikasi myBCA menuju 2-Minute Challenge atau modul modus perbankan terbaru.
              </p>
            </div>

            {/* 2. Media Sosial */}
            <div
              onClick={() =>
                setActiveChannelModal({
                  type: "social",
                  badge: "Social Media Campaign",
                  title: "Media Sosial & Edukasi Viral",
                  subtitle: "Konten Modus of the Week + Direct Link Challenge",
                  desc: "Konten infografis micro-learning & carousel interaktif di Instagram, TikTok, dan X Bank BCA dengan hook kasus viral nyata dan link instan menuju simulasi challenge.",
                  previewType: "social",
                })
              }
              className="group cursor-pointer rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-purple-700">
                  Media Sosial
                </span>
                <span className="text-[11px] font-bold text-purple-700 group-hover:translate-x-0.5 transition">
                  Lihat Mockup →
                </span>
              </div>
              <h3 className="mt-3 text-base font-black text-[#102a54]">
                Modus of the Week
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Konten mingguan viral di medsos resmi BCA yang mengulas modus hangat dengan tautan langsung ke latihan challenge.
              </p>
            </div>

            {/* 3. QR Campaign */}
            <div
              onClick={() =>
                setActiveChannelModal({
                  type: "qr",
                  badge: "On-Ground & Collateral",
                  title: "QR Code Campaign",
                  subtitle: "Poster Cabang, Booth Acara, Merchandise & Edukatips",
                  desc: "QR Code khusus tercetak pada standing banner kantor cabang BCA, merchant partner, booth pameran, serta merchandise nasabah untuk scan-and-play di tempat.",
                  previewType: "qr",
                })
              }
              className="group cursor-pointer rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  QR Campaign
                </span>
                <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition">
                  Lihat Mockup →
                </span>
              </div>
              <h3 className="mt-3 text-base font-black text-[#102a54]">
                Scan QR Code Fisik
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                QR code pada poster kantor cabang, booth event, merchandise, dan flyer materi edukasi nasabah.
              </p>
            </div>

            {/* 4. Push Notification */}
            <div
              onClick={() =>
                setActiveChannelModal({
                  type: "push",
                  badge: "Real-Time Alert",
                  title: "Push Notification Cerdas",
                  subtitle: "Early Warning Saat Modus Baru Sedang Marak",
                  desc: "Notifikasi pintar berbasis kejadian aktual yang langsung mengingatkan nasabah jika ada lonjakan modus penipuan berkedok promo/undian/file undangan.",
                  previewType: "push",
                })
              }
              className="group cursor-pointer rounded-3xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                  Push Notification
                </span>
                <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition">
                  Lihat Mockup →
                </span>
              </div>
              <h3 className="mt-3 text-base font-black text-[#102a54]">
                Alert Modus Ramai
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Pemberitahuan instan di smartphone saat terdeteksi gelombang modus baru yang membutuhkan kewaspadaan ekstra.
              </p>
            </div>
          </div>
        </section>

        {/* Protect others & sharing */}
        <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50/70 p-5 md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#0876c9] shadow-sm">
                <Icon name="UsersRound" size={22} />
              </div>

              <div>
                <h2 className="font-black text-[#102a54] text-base md:text-lg">
                  Lindungi Orang di Sekitarmu
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 max-w-lg">
                  Sudah selesai challenge? Bagikan link challenge ini ke keluarga atau teman di WhatsApp supaya mereka ikut menguji refleks keamanan mereka.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[#0876c9] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#075da8]"
              >
                <Icon name="MessageSquare" size={15} />
                Share WhatsApp
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <Icon name="Copy" size={15} />
                {copied ? "Tersalin!" : "Salin Link"}
              </button>
            </div>
          </div>
        </section>

        {/* Modal Detail Kanal & Implementasi */}
        {activeChannelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0876c9]">
                  {activeChannelModal.badge}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveChannelModal(null)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold"
                >
                  ✕
                </button>
              </div>

              <h2 className="mt-3 text-xl font-black text-[#102a54]">
                {activeChannelModal.title}
              </h2>
              <p className="mt-1 text-xs font-bold text-[#0876c9]">
                {activeChannelModal.subtitle}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {activeChannelModal.desc}
              </p>

              {/* Mockup Preview Visualizer */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Simulasi Tampilan Implementasi
                </div>

                {activeChannelModal.previewType === "mybca" && (
                  <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-[#102a54] to-[#0876c9] p-4 text-white shadow-sm">
                    <div className="flex items-center justify-between text-[10px] text-cyan-200 font-bold">
                      <span>myBCA Home Card</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-white">Baru</span>
                    </div>
                    <div className="mt-2 text-sm font-black">
                      Berapa Skor Ketahanan Finansialmu?
                    </div>
                    <p className="mt-1 text-[11px] text-blue-100">
                      Ikuti 2-Minute Scam Challenge langsung di myBCA dan dapatkan lencana nasabah waspada!
                    </p>
                    <Link
                      href="/challenge"
                      onClick={() => setActiveChannelModal(null)}
                      className="mt-3 inline-block rounded-xl bg-white px-3.5 py-1.5 text-xs font-black text-[#075da8]"
                    >
                      Buka Challenge
                    </Link>
                  </div>
                )}

                {activeChannelModal.previewType === "social" && (
                  <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#102a54] flex items-center justify-center text-[10px] font-black text-white">
                        BCA
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#102a54]">@GoodLifeBCA</div>
                        <div className="text-[10px] text-slate-400">Sponsored • Modus of the Week</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-700">
                      <strong>Hati-hati modus file APK Surat Tilang / Undangan!</strong> Jangan sembarangan klik file .apk di WhatsApp. Coba tes kemampuanmu di Kenali Modus sekarang:
                    </div>
                    <div className="mt-3 rounded-xl bg-slate-100 p-2.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#102a54]">kenalimodus.id/challenge</span>
                      <Link
                        href="/challenge"
                        onClick={() => setActiveChannelModal(null)}
                        className="rounded-lg bg-purple-600 px-3 py-1 font-bold text-white text-[11px]"
                      >
                        Play Now
                      </Link>
                    </div>
                  </div>
                )}

                {activeChannelModal.previewType === "qr" && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 border-2 border-dashed border-emerald-300 p-3 w-28 h-28 shrink-0 text-emerald-800 font-mono">
                      <div className="text-xs font-black">QR CODE</div>
                      <div className="text-[9px] font-bold text-emerald-600 mt-1">SCAN ME</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#102a54]">
                        Poster & Standee Cabang BCA
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        "Sambil menunggu antrean di Customer Service, scan QR untuk mainkan 2-Minute Scam Challenge dan tukarkan reward!"
                      </p>
                    </div>
                  </div>
                )}

                {activeChannelModal.previewType === "push" && (
                  <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        BCA Safe Alert • Sekarang
                      </span>
                      <span>Baru saja</span>
                    </div>
                    <div className="mt-1 text-xs font-black text-[#102a54]">
                      Waspada Modus Scamming APK Mengatasnamakan Kurir Paket!
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Sedang ramai modus APK kirim resi. Kenali ciri-cirinya dalam 1 menit sebelum Anda atau keluarga menjadi korban.
                    </p>
                    <div className="mt-2.5 flex gap-2">
                      <Link
                        href="/modus"
                        onClick={() => setActiveChannelModal(null)}
                        className="rounded-lg bg-amber-600 px-3 py-1 font-bold text-white text-[11px]"
                      >
                        Lihat Modus
                      </Link>
                      <Link
                        href="/challenge"
                        onClick={() => setActiveChannelModal(null)}
                        className="rounded-lg bg-slate-100 px-3 py-1 font-bold text-slate-700 text-[11px]"
                      >
                        Uji Skenario
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveChannelModal(null)}
                  className="rounded-2xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomSpace />
      </main>

      <BottomNav />
    </div>
  )
}