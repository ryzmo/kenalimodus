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
  const [selectedOrgan, setSelectedOrgan] = useState("apk")
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
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
      sub: "Uji Refleks",
      iconImg: "/3d-shield-icon.png",
      href: "/challenge",
      badge: "Utama",
      badgeColor: "bg-amber-500",
    },
    {
      title: "Katalog Modus",
      sub: "Pola Penipuan",
      iconImg: "/3d-alert-icon.png",
      href: "/modus",
      badge: null,
    },
    {
      title: "Keluarga",
      sub: "Pantau Lansia",
      iconImg: "/3d-family-icon.png",
      href: "/keluarga",
      badge: null,
    },
    {
      title: "Rewards",
      sub: "Tukar Poin",
      iconImg: "/3d-trophy-icon.png",
      href: "/rewards",
      badge: "Poin",
      badgeColor: "bg-red-500",
    },
  ]

  const scamFocusTypes = [
    {
      id: "apk",
      label: "File APK",
      sub: "Surat Tilang & Undangan",
      risk: "Tinggi",
      icon: "Smartphone",
    },
    {
      id: "transfer",
      label: "Tarif Palsu",
      sub: "CS Gadungan Mengaku BCA",
      risk: "Waspada",
      icon: "PhoneCall",
    },
    {
      id: "qr",
      label: "QRIS Palsu",
      sub: "Stiker Tempelan Merchant",
      risk: "Sedang",
      icon: "QrCode",
    },
  ]

  return (
    <div className="app-shell flex justify-center bg-[#e7eff6] min-h-screen text-[#002554]">
      {/* iOS Curved Device Mockup Frame */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl min-h-screen md:min-h-0 md:my-5 md:rounded-[44px] shadow-2xl bg-gradient-to-b from-[#0292fc] via-[#85caff] to-[#f4faff] flex flex-col relative overflow-hidden border border-white/60 pb-safe">


        {/* NATIVE APP USER BAR (Exact like "Good Morning Sarah" in Reference Screen 3) */}
        <div className="px-6 pt-7 flex items-center justify-between z-20">
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
              <div className="text-base font-extrabold text-white tracking-tight mt-1">
                Kenali Modus
              </div>
            </div>
          </div>

          {/* Native App Bell Button with Popover */}
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

            {/* Notification Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-slate-100 bg-white p-3.5 shadow-2xl animate-in fade-in zoom-in-95 text-[#002554]">
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

        {/* HERO TOP SECTION (Exact Sky Blue Gradient fading downward with 3D Robot Assistant) */}
        <section className="px-6 pt-2 relative text-white">
          <div className="flex items-center justify-between">
            <div className="max-w-[200px] md:max-w-xs z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl md:text-6xl font-black tracking-tight text-white leading-none drop-shadow-sm">
                  {safeScore}
                </span>
                <span className="text-sm font-bold text-white/80">/100</span>
              </div>

              {/* Progress Slider Pill with knob (Exact Match to Screen 3) */}
              <div className="mt-3.5 relative h-2.5 w-40 rounded-full bg-white/30 backdrop-blur-xs flex items-center">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${safeScore}%` }}
                />
                <div
                  className="absolute h-4 w-4 rounded-full bg-[#0292fc] border-2 border-white shadow-md"
                  style={{ left: `calc(${safeScore}% - 8px)` }}
                />
              </div>

              <div className="mt-3 text-xs font-semibold text-white/95 leading-snug drop-shadow-xs">
                Complete your AI anti-scam check in just 2 minutes today.
              </div>

              {/* <Link
                href="/challenge"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/35 backdrop-blur-md px-4 py-2 text-xs font-black text-white border border-white/60 shadow-sm active:scale-95 transition hover:bg-white/45"
              >
                <span>Continue</span>
              </Link> */}
            </div>

            <div className="relative w-44 h-48 sm:w-52 sm:h-56 shrink-0 drop-shadow-2xl  scale-100 -translate-y-5">
              <Image
                src="/image2.png"
                alt="3D BCA Cyber Cop Assistant"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM SHEET: Soft Sky-White to Clean Card Container */}
        <main className="flex-1 bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] px-5 pt-5 space-y-4 md:space-y-5 shadow-2xl">

          {/* 1. EMERGENCY SCAM CALLOUT (Glassmorphic Card matching Screen 3 "Emergency Call") */}
          <section className="glass-card rounded-[26px] p-3.5 flex items-center justify-between gap-3 shadow-soft border border-white/90">
            <div className="flex items-center gap-3">

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#002554]">
                    Emergency Call (Halo BCA)
                  </span>
                  <span className="rounded-full bg-red-100 text-red-700 text-[8px] font-extrabold px-1.5 py-0.2">
                    1500888
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Call now for urgent anti-fraud help & blocking
                </div>
              </div>
            </div>

            <a
              href="tel:1500888"
              className="h-10 w-10 shrink-0 rounded-full bg-[#001c3d] text-white flex items-center justify-center shadow-md hover:bg-[#002d60] transition active:scale-95"
              aria-label="Panggil Halo BCA"
            >
              <Icon name="PhoneCall" size={17} />
            </a>
          </section>

          {/* 2. 3D GLOSSY SERVICES (Matching 2x2 Clean Vitals Grid in Screen 3) */}
          <section>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {appServices.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="glass-card rounded-[24px] p-3.5 flex flex-col justify-between group active:scale-95 transition hover:shadow-md border border-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="relative h-12 w-12 rounded-2xl overflow-hidden shadow-2xs group-hover:scale-105 transition">
                      <Image
                        src={service.iconImg}
                        alt={service.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {service.badge && (
                      <span
                        className={`text-[8px] font-black text-white px-2 py-0.5 rounded-full ${service.badgeColor} shadow-2xs`}
                      >
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-black text-[#002554] leading-tight">
                      {service.title}
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 4. RUMUS B-C-A LAWAN PENIPU (Pill Card) */}
          <section className="rounded-[26px] bg-gradient-to-r from-[#0292fc] via-[#21a4ff] to-[#47b5ff] p-4 text-white shadow-soft">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-white/25 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                #AWASMODUS
              </span>
              <span className="text-[10px] text-white/90 font-semibold">
                Rumus Jitu B-C-A
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/15 p-2.5 text-center border border-white/20 backdrop-blur-xs">
                <div className="text-base font-black text-white leading-none">B</div>
                <div className="text-[11px] font-extrabold text-white mt-1">Buka Manual</div>
                <div className="text-[8px] text-white/80">Ketik link resmi</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-2.5 text-center border border-white/20 backdrop-blur-xs">
                <div className="text-base font-black text-white leading-none">C</div>
                <div className="text-[11px] font-extrabold text-white mt-1">Cek Keaslian</div>
                <div className="text-[8px] text-white/80">Domain bca.co.id</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-2.5 text-center border border-white/20 backdrop-blur-xs">
                <div className="text-base font-black text-white leading-none">A</div>
                <div className="text-[11px] font-extrabold text-white mt-1">Ayo Simpan</div>
                <div className="text-[8px] text-white/80">Bintangin web</div>
              </div>
            </div>
          </section>

          {/* 5. MODUS TERKINI (Interactive Action Cards) */}
          <section>
            <div className="flex items-center justify-between px-1 mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0292fc] animate-ping" />
                <h2 className="text-xs font-black uppercase tracking-wider text-[#002554]">
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

            <div className="space-y-2.5">
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
                    href="/challenge"
                    className="glass-card rounded-[22px] p-3.5 flex items-center justify-between gap-3 active:scale-98 transition hover:border-blue-200 border border-white group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100/60 text-[#0292fc] flex items-center justify-center border border-blue-100 shadow-2xs group-hover:scale-105 transition">
                        <Icon name={iconName} size={20} strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-black text-[#002554] truncate">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
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
          </section>

          {/* 6. SHARE KE KELUARGA (Unified iOS Blue Theme) */}
          <section className="glass-card rounded-[26px] p-3.5 flex items-center justify-between gap-3 border border-white">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#0292fc] to-[#0055b8] text-white flex items-center justify-center shadow-sm">
                <Icon name="UsersRound" size={19} strokeWidth={2.2} />
              </div>
              <div>
                <div className="text-xs font-black text-[#002554]">
                  Lindungi Keluarga
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  Ajak kerabat uji refleks keamanan online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-[#0292fc] px-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#007ad6] active:scale-95 transition"
              >
                <span>Share</span>
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

          <BottomSpace />
        </main>

        <BottomNav />
      </div>
    </div >
  )
}
