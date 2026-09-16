import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "./Icon"

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "threat",
    title: "Peringatan: Modus APK Undangan & Tilang Elektronik",
    desc: "Waspada file .APK berbahaya berkedok dokumen foto, undangan pernikahan, atau surat konfirmasi tilang di WhatsApp yang mencuri OTP & SMS m-banking.",
    time: "10 menit yang lalu",
    unread: true,
    link: "/modus",
    badge: "Darurat",
    icon: "AlertTriangle",
    color: "red"
  },
  {
    id: "notif-2",
    type: "threat",
    title: "CS Palsu Mengatasnamakan Perubahan Tarif Transfer",
    desc: "Penipu menghubungi mengklaim tarif transfer naik menjadi Rp150.000/bulan dan meminta nasabah klik link pembatalan palsu. Bank tidak pernah memungut biaya via link.",
    time: "1 jam yang lalu",
    unread: true,
    link: "/modus",
    badge: "Waspada",
    icon: "AlertCircle",
    color: "amber"
  },
  {
    id: "notif-3",
    type: "challenge",
    title: "1.5-Minute Scam Challenge Baru Siap Diuji",
    desc: "Latih ketajaman refleks Anda menghadapi modus perbankan digital terkini dan ukur Safe Score terbaru Anda sekarang.",
    time: "3 jam yang lalu",
    unread: true,
    link: "/challenge",
    badge: "Tantangan",
    icon: "Zap",
    color: "blue"
  },
  {
    id: "notif-4",
    type: "family",
    title: "Pantau Safe Score Anggota Keluarga",
    desc: "Lindungi lansia dan kerabat dari manipulasi siber dengan memantau status kerentanan mereka di fitur Grup Keluarga.",
    time: "1 hari yang lalu",
    unread: false,
    link: "/keluarga",
    badge: "Keluarga",
    icon: "UsersRound",
    color: "emerald"
  },
  {
    id: "notif-5",
    type: "tips",
    title: "5 Kunci Emas Keamanan Finansial Digital",
    desc: "Ingat prinsip mutlak: Jangan pernah bagikan kode OTP/PIN/CVV kepada siapa pun dan periksa nama merchant sebelum konfirmasi bayar QRIS.",
    time: "2 hari yang lalu",
    unread: false,
    link: "/modus",
    badge: "Edukasi",
    icon: "Shield",
    color: "indigo"
  }
]

export default function AppHeader() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all") // "all" | "threat" | "activity"
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)
  const dropdownRef = useRef(null)

  // Load read status from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kenali_notifications_read")
      if (stored) {
        try {
          const readIds = JSON.parse(stored)
          setNotifications((prev) =>
            prev.map((n) => ({
              ...n,
              unread: !readIds.includes(n.id)
            }))
          )
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }))
    setNotifications(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "kenali_notifications_read",
        JSON.stringify(notifications.map((n) => n.id))
      )
    }
  }

  const handleNotificationClick = (notif) => {
    // Mark clicked as read
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    setNotifications(updated)
    if (typeof window !== "undefined") {
      const readIds = updated.filter((n) => !n.unread).map((n) => n.id)
      localStorage.setItem("kenali_notifications_read", JSON.stringify(readIds))
    }
    setIsOpen(false)
    if (notif.link) {
      router.push(notif.link)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "threat") return n.type === "threat"
    if (activeTab === "activity") return n.type === "challenge" || n.type === "family" || n.type === "tips"
    return true
  })

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col">
          <div className="text-base font-black tracking-tight text-[#102a54]">
            KENALI
            <span className="text-[#0876c9]"> MODUS</span>
          </div>
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Stay Alert Stay Safe
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-bold text-slate-500 transition hover:text-[#0876c9]"
          >
            Home
          </Link>
          <Link
            href="/modus"
            className="text-sm font-bold text-slate-500 transition hover:text-[#0876c9]"
          >
            Modus Terbaru
          </Link>
          <Link
            href="/challenge"
            className="text-sm font-bold text-slate-500 transition hover:text-[#0876c9]"
          >
            Challenge
          </Link>
          <Link
            href="/keluarga"
            className="text-sm font-bold text-slate-500 transition hover:text-[#0876c9]"
          >
            Grup Keluarga
          </Link>
          <Link
            href="/hasil"
            className="text-sm font-bold text-slate-500 transition hover:text-[#0876c9]"
          >
            Profil
          </Link>
          <Link
            href="/admin/impact"
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-[#102a54] transition hover:bg-blue-50 hover:text-[#0876c9]"
          >
            Admin Panel
          </Link>
        </nav>

        {/* Notification Bell with Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Pemberitahuan"
            className={`relative grid h-10 w-10 place-items-center rounded-full transition shadow-sm ${
              isOpen
                ? "bg-blue-50 text-[#0876c9] ring-2 ring-[#0876c9]/20"
                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#0876c9]"
            }`}
          >
            <Icon name="Bell" size={19} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ====================================================
              NOTIFICATION DROPDOWN POPOVER
          ==================================================== */}
          {isOpen && (
            <div className="absolute right-0 top-12 z-50 w-[92vw] max-w-sm rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl transition-all animate-in fade-in zoom-in-95 sm:w-96">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-[#0876c9]">
                    <Icon name="Bell" size={15} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#102a54]">Pemberitahuan</h3>
                    <div className="text-[10px] font-semibold text-slate-400">
                      {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
                    </div>
                  </div>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[#0876c9] hover:bg-blue-50 transition"
                  >
                    <Icon name="CheckCheck" size={13} />
                    Tandai dibaca
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-100/80 p-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 rounded-lg py-1.5 transition text-center ${
                    activeTab === "all"
                      ? "bg-white text-[#102a54] shadow-xs font-black"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("threat")}
                  className={`flex-1 rounded-lg py-1.5 transition text-center ${
                    activeTab === "threat"
                      ? "bg-white text-red-600 shadow-xs font-black"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Peringatan ({notifications.filter((n) => n.type === "threat").length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 rounded-lg py-1.5 transition text-center ${
                    activeTab === "activity"
                      ? "bg-white text-[#0876c9] shadow-xs font-black"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Aktivitas ({notifications.filter((n) => n.type !== "threat").length})
                </button>
              </div>

              {/* Notifications List */}
              <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Tidak ada pemberitahuan pada kategori ini.
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const isRed = notif.color === "red"
                    const isAmber = notif.color === "amber"
                    const isEmerald = notif.color === "emerald"

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`group relative cursor-pointer rounded-2xl border p-3.5 transition hover:shadow-sm ${
                          notif.unread
                            ? isRed
                              ? "border-red-100 bg-red-50/40 hover:bg-red-50/70"
                              : isAmber
                              ? "border-amber-100 bg-amber-50/40 hover:bg-amber-50/70"
                              : "border-blue-100 bg-blue-50/40 hover:bg-blue-50/70"
                            : "border-slate-100 bg-white hover:bg-slate-50"
                        }`}
                      >
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              {notif.unread && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-[#0876c9]" />
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                  isRed
                                    ? "bg-red-100 text-red-700"
                                    : isAmber
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-blue-100 text-[#0876c9]"
                                }`}
                              >
                                {notif.badge}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {notif.time}
                            </span>
                          </div>

                          <h4 className="mt-1.5 text-xs font-bold leading-snug text-[#102a54] group-hover:text-[#0876c9] transition">
                            {notif.title}
                          </h4>

                          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                            {notif.desc}
                          </p>

                          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#0876c9]">
                            <span>Buka Halaman</span>
                            <Icon name="ArrowRight" size={11} className="transition group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Bottom Footer */}
              <div className="mt-3 border-t border-slate-100 pt-2.5 flex items-center justify-between">
                <Link
                  href="/modus"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-bold text-[#0876c9] hover:underline"
                >
                  Lihat Semua Modus Terbaru →
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}