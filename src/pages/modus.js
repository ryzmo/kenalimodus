import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  MODUS_LIST,
  MODUS_CATEGORIES,
  BCA_EDU_VIDEOS,
  BCA_EDU_ARTICLES
} from "../data/modusData"

export default function ModusPage() {
  const { data: session } = useSession()
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeModusModal, setActiveModusModal] = useState(null)
  const [activeVideoModal, setActiveVideoModal] = useState(null)
  const [activeArticleModal, setActiveArticleModal] = useState(null)
  const [claimedMedia, setClaimedMedia] = useState([])
  const [userPoints, setUserPoints] = useState(null)
  const [toastMsg, setToastMsg] = useState("")

  // Load status klaim edukasi & poin berdasarkan sesi user
  useEffect(() => {
    if (session?.user?.id) {
      const userKey = `kenali_claimed_edu_media_${session.user.id}`
      if (typeof window !== "undefined") {
        try {
          const storedClaimed = localStorage.getItem(userKey)
          if (storedClaimed) setClaimedMedia(JSON.parse(storedClaimed) || [])
          else setClaimedMedia([])
        } catch (e) {
          console.error(e)
        }
      }

      fetch(`/api/user/sync?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data?.total_points !== undefined) {
            setUserPoints(res.data.total_points)
          }
        })
        .catch((e) => console.log(e))
    } else {
      // Jika belum login, reset state klaim dan poin
      setClaimedMedia([])
      setUserPoints(null)
    }
  }, [session])

  const filteredModus = useMemo(() => {
    return MODUS_LIST.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" || item.tag === selectedCategory
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  const handleClaimEduPoints = async (mediaId, pts, title) => {
    if (!session?.user?.id) {
      setToastMsg("Silakan login terlebih dahulu untuk mengklaim poin edukasi.")
      setTimeout(() => setToastMsg(""), 3000)
      return
    }

    if (claimedMedia.includes(mediaId)) {
      setToastMsg(`Anda sudah pernah mengklaim poin untuk materi ini.`)
      setTimeout(() => setToastMsg(""), 2500)
      return
    }

    const newClaimed = [...claimedMedia, mediaId]
    setClaimedMedia(newClaimed)

    const userKey = `kenali_claimed_edu_media_${session.user.id}`
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(userKey, JSON.stringify(newClaimed))
      } catch (e) {
        console.error(e)
      }
    }

    const newPts = (userPoints || 0) + pts
    setUserPoints(newPts)
    setToastMsg(`Selamat! +${pts} Poin berhasil ditambahkan ke akun Anda 🎉`)
    setTimeout(() => setToastMsg(""), 3000)

    // Sinkronisasi penambahan poin LANGSUNG ke Neon Database
    try {
      await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          pointsAdded: pts,
          activityType: "edu_claim",
          description: `Edukasi BCA: ${title}`
        })
      })
    } catch (err) {
      console.error("Sync point claim to DB failed:", err)
    }
  }

  const mainVideo = BCA_EDU_VIDEOS[0]

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      {/* Full width container across desktop and mobile */}
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        {/* Top App Header with Back Button and Quick Count Badge */}
        <AppHeader
          title="Katalog Modus"
          subtitle="Bank BCA #AwasModus"
          showBack={true}
          backHref="/"

        />


        {/* BOTTOM SHEET: Full Width on Desktop, Curved Sheet on Mobile */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">

            {toastMsg && (
              <div className="rounded-2xl bg-[#003882] text-white p-3 text-xs font-bold text-center shadow-md animate-in fade-in flex items-center justify-center gap-2">
                <Icon name="Sparkles" size={16} />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Search Box & Category Filters in Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Icon name="Search" size={16} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modus (APK, Link, QRIS, CS)..."
                  className="w-full rounded-2xl bg-white border border-slate-200/80 py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-[#002554] placeholder:text-slate-400 shadow-2xs focus:border-[#0292fc] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="md:col-span-7 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {["Semua", "Video Edukasi", "Artikel", ...MODUS_CATEGORIES.filter((c) => c !== "Semua")].map((category) => {
                  const active = selectedCategory === category
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${active
                        ? "bg-[#0292fc] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
                        }`}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Video Highlight Card if in Semua / Video */}
            {(selectedCategory === "Semua" || selectedCategory === "Video Edukasi") && mainVideo && (
              <div className="glass-card rounded-[26px] p-5 border border-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-50 text-[#0292fc] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    Video Edukasi Resmi
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${claimedMedia.includes(mainVideo.id)
                    ? "bg-slate-100 text-slate-500"
                    : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                    }`}>
                    {claimedMedia.includes(mainVideo.id) ? "✓ Sudah Diklaim" : `+${mainVideo.rewardPoints} Poin`}
                  </span>
                </div>

                <div className="md:flex md:items-center md:justify-between gap-4 mt-2">
                  <div>
                    <h2 className="text-sm md:text-base font-black text-[#002554]">
                      {mainVideo.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl line-clamp-2">
                      {mainVideo.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(mainVideo)}
                    className="mt-3 md:mt-0 shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#0292fc] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0081e3] transition active:scale-95 cursor-pointer"
                  >
                    <span>{claimedMedia.includes(mainVideo.id) ? "Tonton Lagi" : "Tonton"}</span>
                    <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* List of Modus Items: Responsive Grid on Desktop */}
            <div>
              <div className="flex items-center justify-between px-1 mb-3">
                <span className="text-xs sm:text-sm font-bold text-[#002554]">
                  Daftar Modus
                </span>
              </div>

              {filteredModus.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white/50">
                  <p className="text-xs font-semibold text-slate-500">
                    Tidak ditemukan modus dengan kata kunci &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredModus.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveModusModal(item)}
                      className="glass-card rounded-[22px] p-4 border border-white flex items-center justify-between gap-3 cursor-pointer hover:border-blue-200 transition active:scale-[0.99] group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-11 w-11 shrink-0 rounded-2xl bg-blue-50/80 text-[#0292fc] flex items-center justify-center group-hover:scale-105 transition">
                          <Icon name={item.icon || "AlertTriangle"} size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-black text-[#002554] truncate">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0292fc] group-hover:text-white transition">
                        <Icon name="ChevronRight" size={15} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Educational Articles: Responsive Grid */}
            {(selectedCategory === "Semua" || selectedCategory === "Artikel") && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs sm:text-sm font-bold text-[#002554]">
                    Artikel Resmi #AwasModus
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BCA_EDU_ARTICLES.map((art) => {
                    const isClaimed = claimedMedia.includes(art.id)
                    return (
                      <div
                        key={art.id}
                        onClick={() => setActiveArticleModal(art)}
                        className="glass-card rounded-[22px] p-4 border border-white flex items-center justify-between gap-3 cursor-pointer hover:border-blue-200 transition active:scale-[0.99] group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="h-11 w-11 shrink-0 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition">
                            <Icon name="BookOpen" size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-amber-600">
                              {art.readTime}
                            </div>
                            <h4 className="text-xs sm:text-sm font-black text-[#002554] truncate">
                              {art.title}
                            </h4>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${isClaimed
                          ? "bg-slate-100 text-slate-400 border-slate-200"
                          : "text-emerald-700 bg-emerald-50 border-emerald-200"
                          }`}>
                          {isClaimed ? "✓ Selesai" : `+${art.rewardPoints} Pts`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <BottomSpace />
          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>

      {/* MODAL: Modus Detail */}
      {activeModusModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blue-50 text-[#0292fc] px-3 py-1 text-[10px] font-black uppercase">
                {activeModusModal.tag}
              </span>
              <button
                type="button"
                onClick={() => setActiveModusModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <h3 className="mt-3 text-base font-black text-[#002554]">
              {activeModusModal.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {activeModusModal.desc}
            </p>

            <div className="mt-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 p-3.5">
              <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
                <Icon name="AlertTriangle" size={14} />
                <span>Ciri-ciri Utama Penipuan:</span>
              </div>
              <ul className="mt-1.5 space-y-1 text-xs text-amber-900/90 pl-4 list-disc">
                {activeModusModal.traits?.map((t, idx) => (
                  <li key={idx}>{t}</li>
                )) || <li>Menggunakan nomor acak tidak resmi / kontak palsu.</li>}
              </ul>
            </div>

            <div className="mt-3 rounded-2xl bg-blue-50/70 border border-blue-200/60 p-3.5">
              <div className="text-[11px] font-bold text-[#003882] flex items-center gap-1.5">
                <Icon name="Shield" size={14} />
                <span>Langkah Pencegahan BCA:</span>
              </div>
              <p className="mt-1 text-xs text-[#003882]/90 leading-relaxed">
                {activeModusModal.prevention || "Jangan pernah memberikan kode OTP, PIN, atau mengklik tautan / file dari nomor tak dikenal."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModusModal(null)}
              className="mt-5 w-full rounded-2xl bg-[#0292fc] py-3 text-xs font-black text-white shadow-md hover:bg-[#0081e3] transition active:scale-98"
            >
              Saya Sudah Paham
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Video Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-bold text-[#003882]">
                Video Edukasi BCA
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-3">
              <h4 className="text-xs font-black text-[#002554]">
                {activeVideoModal.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {activeVideoModal.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClaimEduPoints(activeVideoModal.id, activeVideoModal.rewardPoints, activeVideoModal.title)
                setActiveVideoModal(null)
              }}
              className="mt-4 w-full rounded-2xl bg-emerald-500 py-2.5 text-xs font-black text-white shadow-md hover:bg-emerald-600 transition active:scale-98"
            >
              Selesai Menonton & Klaim +{activeVideoModal.rewardPoints} Poin
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Article Reader */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-t-[32px] sm:rounded-[32px] bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-[10px] font-black uppercase">
                {activeArticleModal.readTime}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <h3 className="mt-3 text-base font-black text-[#002554]">
              {activeArticleModal.title}
            </h3>

            <div className="mt-3 text-xs text-slate-600 leading-relaxed space-y-2 whitespace-pre-line">
              {activeArticleModal.content}
            </div>

            <button
              type="button"
              onClick={() => {
                handleClaimEduPoints(activeArticleModal.id, activeArticleModal.rewardPoints, activeArticleModal.title)
                setActiveArticleModal(null)
              }}
              className="mt-5 w-full rounded-2xl bg-emerald-500 py-3 text-xs font-black text-white shadow-md hover:bg-emerald-600 transition active:scale-98"
            >
              Selesai Membaca & Klaim +{activeArticleModal.rewardPoints} Poin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
