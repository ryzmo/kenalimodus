import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import { MODUS_LIST } from "../data/modusData"

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "threat",
    title: "Peringatan: Modus APK Undangan & Tilang",
    desc: "Waspada file .APK berbahaya di WhatsApp yang mencuri OTP & SMS.",
    time: "10m lalu",
    unread: true,
    link: "/modus",
    badge: "Darurat",
  },
  {
    id: "notif-2",
    type: "threat",
    title: "CS Palsu Perubahan Tarif Transfer",
    desc: "Penipu meminta nasabah klik link pembatalan palsu.",
    time: "1j lalu",
    unread: true,
    link: "/modus",
    badge: "Waspada",
  },
  {
    id: "notif-3",
    type: "challenge",
    title: "2-Minute Scam Challenge Baru",
    desc: "Latih ketajaman refleks perbankan digitalmu sekarang.",
    time: "3j lalu",
    unread: true,
    link: "/challenge",
    badge: "Tantangan",
  }
]

export default function Home() {
  const [safeScore, setSafeScore] = useState(84)
  const [copied, setCopied] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)
  const notifRef = useRef(null)

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false)
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notificationsOpen])

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleCopyLink = () => {
    const url = `${originUrl}/challenge`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Yuk uji seberapa aman kamu dari modus penipuan online terbaru di KENALI MODUS: ${originUrl}/challenge`
  )}`

  const appServices = [
    {
      title: "2-Min Test",
      sub: "Uji Refleks Cepat",
      iconImg: "/3d-shield-icon.png",
      href: "/challenge",
      badge: "Utama",
      badgeColor: "bg-amber-500",
    },
    {
      title: "Katalog Modus",
      sub: "Kumpulan Kejahatan",
      iconImg: "/3d-alert-icon.png",
      href: "/modus",
      badge: null,
    },
    {
      title: "Keluarga",
      sub: "Proteksi Bersama",
      iconImg: "/3d-family-icon.png",
      href: "/keluarga",
      badge: null,
    },
    {
      title: "Rewards",
      sub: "Tukar Poin Berharga",
      iconImg: "/3d-trophy-icon.png",
      href: "/rewards",
      badge: "Poin",
      badgeColor: "bg-red-500",
    },
  ]

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      {/* WRAPPER: Full width in desktop, mobile-framed in small viewports */}
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        {/* NATIVE APP USER BAR / DESKTOP HEADER */}
        <header className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-5 md:pt-7 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-white/30 p-0.5 border-2 border-white/50 shadow-sm flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-[#003882] flex items-center justify-center text-white font-black text-xs shadow-inner">
                Hi
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-white/90 flex items-center gap-1 leading-none">
                <span>Good Morning</span>
                <span className="text-amber-300">👋</span>
              </div>
              <div className="text-base md:text-lg font-extrabold text-white tracking-tight mt-1">
                Kenali Modus <span className="hidden md:inline text-xs font-semibold text-white/80">• Bank BCA #AwasModus</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links & Mobile Bell Button */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full p-1 border border-white/25">
              <Link href="/" className="px-3.5 py-1 rounded-full text-xs font-bold bg-white text-[#003882] shadow-2xs">
                Beranda
              </Link>
              <Link href="/modus" className="px-3.5 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
                Katalog Modus
              </Link>
              <Link href="/challenge" className="px-3.5 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
                Challenge
              </Link>
              <Link href="/keluarga" className="px-3.5 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
                Keluarga
              </Link>
              <Link href="/rewards" className="px-3.5 py-1 rounded-full text-xs font-bold text-white hover:bg-white/20 transition">
                Rewards
              </Link>
            </nav>

            {/* Notification Bell Button */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="h-10 w-10 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xs active:scale-95 transition"
                aria-label="Notifikasi"
              >
                <Icon name="Bell" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 md:w-80 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-2xl animate-in fade-in zoom-in-95 text-[#002554]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-[#003882]">Peringatan Keamanan</span>
                    <span className="text-[10px] text-slate-400">{unreadCount} baru</span>
                  </div>
                  <div className="mt-2 divide-y divide-slate-50 max-h-56 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="py-2">
                        <div className="text-[11px] font-bold text-[#003882]">{n.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{n.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* HERO TOP SECTION: Responsive Desktop & Mobile */}
        <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-3 md:pt-6 pb-4 md:pb-8 relative text-white">
          <div className="flex items-center justify-between gap-6">
            <div className="max-w-[220px] sm:max-w-md md:max-w-xl z-10">
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none drop-shadow-sm">
                  {safeScore}
                </span>
                <span className="text-sm md:text-base font-bold text-white/80">/100</span>

              </div>

              {/* Progress Slider Pill */}
              <div className="mt-3.5 relative h-2.5 md:h-3 w-40 sm:w-56 md:w-72 rounded-full bg-white/30 backdrop-blur-xs flex items-center">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${safeScore}%` }}
                />
                <div
                  className="absolute h-4 w-4 md:h-5 md:w-5 rounded-full bg-[#0292fc] border-2 border-white shadow-md"
                  style={{ left: `calc(${safeScore}% - 8px)` }}
                />
              </div>

              <div className="mt-3 text-xs sm:text-sm font-semibold text-white/95 leading-snug drop-shadow-xs max-w-md">
                Latih ketajaman refleks perbankan digitalmu hanya dalam 2 menit. Kenali sebelum tertipu.
              </div>

              <div className="hidden md:flex items-center gap-3 mt-5">
                <Link
                  href="/challenge"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-[#003882] shadow-md hover:bg-slate-50 transition active:scale-95"
                >
                  <span>Mulai Challenge 2-Menit</span>
                </Link>
                <Link
                  href="/modus"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/40 px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 backdrop-blur-md"
                >
                  <Icon name="Search" size={15} />
                  <span>Jelajahi Modus</span>
                </Link>
              </div>
            </div>

            <div className="relative w-40 h-44 sm:w-52 sm:h-56 md:w-72 md:h-72 shrink-0 drop-shadow-2xl scale-100 -translate-y-2 md:-translate-y-4">
              <Image
                src="/image2.png"
                alt="3D BCA Cyber Cop Assistant"
                fill
                sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, 288px"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM SHEET / DESKTOP FULL CONTENT BODY */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-10 pb-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5 md:space-y-7">

            {/* 1. EMERGENCY SCAM CALLOUT */}
            <section className="glass-card rounded-[26px] p-4 flex items-center justify-between gap-4 shadow-soft border border-white/90">
              <div className="flex items-center gap-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-[#002554]">
                      Emergency Call (Halo BCA)
                    </span>
                    <span className="rounded-full bg-red-100 text-red-700 text-[9px] font-extrabold px-2 py-0.5">
                      1500888
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">
                    Segera hubungi Halo BCA jika ada transaksi mencurigakan atau rekening terblokir.
                  </div>
                </div>
              </div>

              <a
                href="tel:1500888"
                className="h-11 w-11 shrink-0 rounded-full bg-[#001c3d] text-white flex items-center justify-center shadow-md hover:bg-[#002d60] transition active:scale-95"
                aria-label="Panggil Halo BCA"
              >
                <Icon name="PhoneCall" size={18} />
              </a>
            </section>

            {/* 2. 4 CORE APP SERVICES (Responsive: 2-Cols in Mobile, 4-Cols in Desktop) */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {appServices.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="glass-card rounded-[24px] p-4 flex flex-col justify-between group active:scale-95 transition hover:shadow-md hover:border-blue-200 border border-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="relative h-12 w-12 rounded-2xl overflow-hidden shadow-2xs group-hover:scale-105 transition">
                        <Image
                          src={service.iconImg}
                          alt={service.title}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                      {service.badge && (
                        <span
                          className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full ${service.badgeColor} shadow-2xs`}
                        >
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="text-xs sm:text-sm font-black text-[#002554] leading-tight">
                        {service.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* 3. DESKTOP SPLIT GRID: Left (Rumus B-C-A & Keluarga) vs Right (Modus Sedang Ramai) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">

              {/* Left Column (5 Cols on Desktop): Rumus B-C-A & Lindungi Keluarga */}
              <div className="lg:col-span-5 space-y-5">
                {/* Rumus B-C-A Pill Card */}
                <section className="rounded-[28px] bg-gradient-to-r from-[#0292fc] via-[#21a4ff] to-[#47b5ff] p-5 text-white shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-white/25 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                      #AWASMODUS
                    </span>
                    <span className="text-[11px] text-white/90 font-bold">
                      Rumus Jitu B-C-A
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    <div className="rounded-2xl bg-white/15 p-3 text-center border border-white/20 backdrop-blur-xs">
                      <div className="text-xl font-black text-white leading-none">B</div>
                      <div className="text-[11px] font-extrabold text-white mt-1">Buka Manual</div>
                      <div className="text-[9px] text-white/80 mt-0.5">Ketik link resmi</div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3 text-center border border-white/20 backdrop-blur-xs">
                      <div className="text-xl font-black text-white leading-none">C</div>
                      <div className="text-[11px] font-extrabold text-white mt-1">Cek Keaslian</div>
                      <div className="text-[9px] text-white/80 mt-0.5">Domain bca.co.id</div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-3 text-center border border-white/20 backdrop-blur-xs">
                      <div className="text-xl font-black text-white leading-none">A</div>
                      <div className="text-[11px] font-extrabold text-white mt-1">Ayo Simpan</div>
                      <div className="text-[9px] text-white/80 mt-0.5">Bintangin web</div>
                    </div>
                  </div>
                </section>

                {/* Share ke Keluarga Card */}
                <section className="glass-card rounded-[28px] p-4.5 flex items-center justify-between gap-3 border border-white">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#0292fc] to-[#0055b8] text-white flex items-center justify-center shadow-sm">
                      <Icon name="UsersRound" size={20} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-[#002554]">
                        Lindungi Keluarga
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Ajak kerabat uji refleks keamanan di WhatsApp
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={waShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 items-center gap-1.5 rounded-xl bg-[#0292fc] px-4 text-xs font-bold text-white shadow-xs hover:bg-[#007ad6] active:scale-95 transition"
                    >
                      <Icon name="Send" size={13} />

                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 active:scale-95 shadow-2xs hover:bg-slate-50 transition"
                      aria-label="Salin Link"
                    >
                      {copied ? <span className="text-[10px] font-bold text-[#0292fc]">✓</span> : <Icon name="Copy" size={14} />}
                    </button>
                  </div>
                </section>
              </div>

              {/* Right Column (7 Cols on Desktop): Modus Sedang Ramai */}
              <div className="lg:col-span-7">
                <section className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between px-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#0292fc] animate-ping" />
                        <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#002554]">
                          Modus Sedang Ramai
                        </h2>
                      </div>
                      <Link
                        href="/modus"
                        className="text-xs font-bold text-[#0292fc] hover:underline"
                      >
                        Lihat Semua
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {MODUS_LIST.slice(0, 3).map((item) => {
                        const iconName =
                          item.category === "Impersonation"
                            ? "PhoneCall"
                            : item.category === "APK Berbahaya"
                              ? "Smartphone"
                              : "Link"

                        return (
                          <Link
                            key={item.id}
                            href="/modus"
                            className="glass-card rounded-[22px] p-4 flex items-center justify-between gap-3 active:scale-98 transition hover:border-blue-200 border border-white group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100/60 text-[#0292fc] flex items-center justify-center border border-blue-100 shadow-2xs group-hover:scale-105 transition">
                                <Icon name={iconName} size={20} strokeWidth={2.2} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xs sm:text-sm font-black text-[#002554] truncate">
                                  {item.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
                                  {item.description || item.desc}
                                </p>
                              </div>
                            </div>

                            <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-[#0292fc] group-hover:text-white transition">
                              <Icon name="ChevronRight" size={16} />
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </section>
              </div>

            </div>

            <BottomSpace />
          </div>
        </main>

        {/* Floating Mobile Bottom Navigation bar (Visible only on mobile/tablet) */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
