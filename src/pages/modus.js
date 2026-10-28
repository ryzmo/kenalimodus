import { useState, useMemo } from "react"
import Link from "next/link"
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
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeModusModal, setActiveModusModal] = useState(null)
  const [activeVideoModal, setActiveVideoModal] = useState(null)
  const [activeArticleModal, setActiveArticleModal] = useState(null)
  const [claimedMedia, setClaimedMedia] = useState([])

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

  const handleClaimEduPoints = (mediaId, pts, title) => {
    if (typeof window === "undefined") return
    if (claimedMedia.includes(mediaId)) return

    try {
      const stored = localStorage.getItem("kenali_points_data")
      let data = { totalPoints: 0, streakCount: 1, redeemed: [], historyLog: [] }
      if (stored) {
        data = JSON.parse(stored)
      }
      const newPts = (data.totalPoints || 0) + pts
      const newLog = [
        {
          id: `edu-${Date.now()}`,
          activity: `Edukasi BCA: ${title}`,
          points: pts,
          date: new Date().toISOString()
        },
        ...(data.historyLog || [])
      ]
      localStorage.setItem("kenali_points_data", JSON.stringify({
        ...data,
        totalPoints: newPts,
        historyLog: newLog
      }))
      setClaimedMedia((prev) => [...prev, mediaId])
    } catch (e) {
      console.error(e)
    }
  }

  const mainVideo = BCA_EDU_VIDEOS[0]

  return (
    <div className="app-shell flex justify-center bg-[#e7eff6] min-h-screen text-[#002554]">
      {/* iOS App Shell matching Home UI */}
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl min-h-screen md:min-h-0 md:my-5 md:rounded-[44px] shadow-2xl bg-gradient-to-b from-[#0292fc] via-[#85caff] to-[#f4faff] flex flex-col relative overflow-hidden border border-white/60 pb-safe">
        
        <AppHeader title="Katalog Modus" subtitle="Bank BCA #AwasModus" />

        {/* Top Header Summary in Sky Blue area */}
        <section className="px-6 pt-1 pb-5 text-white">
          <p className="text-xs font-semibold text-white/95 leading-relaxed">
            Kenali pola kejahatan perbankan digital terkini sebelum Anda menjadi sasaran berikutnya.
          </p>

          {/* Search Box with Glassmorphism */}
          <div className="mt-3 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modus (APK, Link, QRIS, CS)..."
              className="w-full rounded-2xl bg-white/25 backdrop-blur-md border border-white/40 px-4 py-2.5 text-xs font-bold text-white placeholder:text-white/70 shadow-sm focus:outline-none focus:bg-white/35"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-white/80"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {["Semua", "Video Edukasi", "Artikel", ...MODUS_CATEGORIES.filter((c) => c !== "Semua")].map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                    active
                      ? "bg-white text-[#003882] shadow-sm"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        {/* BOTTOM SHEET: Pure White Curved Content Panel */}
        <main className="flex-1 bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] px-5 pt-5 space-y-4 shadow-2xl">
          
          {/* Main Video Highlight Card if in Semua / Video */}
          {(selectedCategory === "Semua" || selectedCategory === "Video Edukasi") && mainVideo && (
            <div className="glass-card rounded-[26px] p-4 border border-white">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-50 text-[#0292fc] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                  Video Edukasi Resmi
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  +{mainVideo.rewardPoints} Poin
                </span>
              </div>

              <h2 className="mt-2 text-sm font-black text-[#002554]">
                {mainVideo.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                {mainVideo.desc}
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveVideoModal(mainVideo)
                  handleClaimEduPoints(mainVideo.id, mainVideo.rewardPoints, mainVideo.title)
                }}
                className="mt-3 w-full rounded-xl bg-[#0292fc] py-2 text-xs font-bold text-white shadow-xs hover:bg-[#007ad6] transition"
              >
                Tonton Video Edukasi
              </button>
            </div>
          )}

          {/* List Modus Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#002554]">
                Daftar Modus ({filteredModus.length})
              </span>
            </div>

            {filteredModus.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModusModal(item)}
                className="glass-card rounded-[22px] p-3.5 flex items-center justify-between gap-3 active:scale-98 transition cursor-pointer hover:border-blue-200 border border-white"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-xs ${
                      item.level === "Tinggi"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    <Icon name="AlertTriangle" size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-wide text-[#0292fc]">
                        {item.tag}
                      </span>
                      <span className="text-[8px] text-slate-300">•</span>
                      <span
                        className={`text-[9px] font-bold ${
                          item.level === "Tinggi" ? "text-red-500" : "text-amber-500"
                        }`}
                      >
                        {item.level === "Tinggi" ? "Risiko Tinggi" : "Waspada"}
                      </span>
                    </div>
                    <h3 className="text-xs font-black text-[#002554] line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="h-7 w-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                  <Icon name="ChevronRight" size={15} />
                </div>
              </div>
            ))}
          </div>

          <BottomSpace />
        </main>

        <BottomNav />

        {/* Modal Modus Detail */}
        {activeModusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-2xs animate-in fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-white p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-50 text-[#0292fc] px-2.5 py-0.5 text-[10px] font-black uppercase">
                  {activeModusModal.tag}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModusModal(null)}
                  className="h-7 w-7 rounded-full bg-slate-100 text-xs font-bold text-slate-500"
                >
                  ✕
                </button>
              </div>

              <h2 className="mt-3 text-base font-black text-[#002554]">
                {activeModusModal.title}
              </h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {activeModusModal.desc}
              </p>

              <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                  Trik Manipulasi & Red Flag
                </div>
                <div className="text-xs text-red-950 mt-1 font-semibold">
                  {activeModusModal.psychology}
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-blue-50 border border-blue-100 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0292fc]">
                  Langkah Penanganan Resmi
                </div>
                <div className="text-xs text-[#002554] mt-1 font-medium">
                  {activeModusModal.action}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  href="/challenge"
                  className="flex-1 rounded-xl bg-[#0292fc] py-2.5 text-center text-xs font-bold text-white shadow-xs"
                >
                  Uji di Challenge
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveModusModal(null)}
                  className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-2xs animate-in fade-in">
            <div className="w-full max-w-sm rounded-[32px] bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-[#002554]">Video Resmi BCA</span>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="h-7 w-7 rounded-full bg-slate-100 text-xs font-bold text-slate-500"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="mt-3 text-xs font-bold text-[#002554]">
                {activeVideoModal.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
