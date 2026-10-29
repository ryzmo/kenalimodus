import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
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

        {/* Top App Header with Back Button and Quick Count Badge */}
        <AppHeader 
          title="Katalog Modus" 
          subtitle="Bank BCA #AwasModus"
          showBack={true}
          backHref="/"
          rightElement={
            <div className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 border border-white/30 text-right">
              <span className="text-[11px] font-bold text-white tracking-wide">
                {MODUS_LIST.length} Modus
              </span>
            </div>
          }
        />

        {/* Hero Banner in Sky Blue Header Area */}
        <section className="px-6 pt-1 pb-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="max-w-[210px] sm:max-w-xs">
              <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-sky-100 uppercase backdrop-blur-xs">
                Database Kejahatan
              </span>
              <h2 className="text-xl font-black text-white mt-1 leading-tight tracking-tight">
                Pola Penipuan Digital Terkini
              </h2>
            </div>
            
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-2 shadow-sm">
              <Image
                src="/3d-alert-icon.png"
                alt="Waspada Modus"
                width={50}
                height={50}
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM SHEET: Pure White Curved Content Panel */}
        <main className="flex-1 bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] px-5 pt-6 space-y-4 shadow-2xl">

          {/* Search Box in Content Area */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Icon name="Search" size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modus (APK, Link, QRIS, CS)..."
              className="w-full rounded-2xl bg-white border border-slate-200/80 py-2.5 pl-10 pr-9 text-xs font-semibold text-[#002554] placeholder:text-slate-400 shadow-2xs focus:border-[#0292fc] focus:outline-none"
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

          {/* Category Filter Pills in Content Area */}
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
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
                onClick={() => setActiveVideoModal(mainVideo)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#0292fc] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#0081e3] transition active:scale-95"
              >
                <span>Tonton Video</span>
                <Icon name="ArrowRight" size={13} />
              </button>
            </div>
          )}

          {/* List of Modus Items */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#002554]">
                Daftar Modus ({filteredModus.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Pilih untuk detail pencegahan
              </span>
            </div>

            {filteredModus.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-white/50">
                <p className="text-xs font-semibold text-slate-500">
                  Tidak ditemukan modus dengan kata kunci &quot;{searchQuery}&quot;
                </p>
              </div>
            ) : (
              filteredModus.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModusModal(item)}
                  className="glass-card rounded-[22px] p-3.5 border border-white flex items-center justify-between gap-3 cursor-pointer hover:border-blue-200 transition active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-50/80 text-[#0292fc] flex items-center justify-center">
                      <Icon name={item.icon || "AlertTriangle"} size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#002554] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="h-7 w-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Icon name="ChevronRight" size={14} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Educational Articles if Selected */}
          {(selectedCategory === "Semua" || selectedCategory === "Artikel") && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#002554]">
                  Artikel Resmi #AwasModus
                </span>
                <span className="text-[11px] text-slate-400">Baca & Pahami</span>
              </div>

              {BCA_EDU_ARTICLES.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveArticleModal(art)}
                  className="glass-card rounded-[22px] p-3.5 border border-white flex items-center justify-between gap-3 cursor-pointer hover:border-blue-200 transition active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Icon name="BookOpen" size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-amber-600">
                        {art.readTime}
                      </div>
                      <h4 className="text-xs font-black text-[#002554] leading-snug">
                        {art.title}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                    +{art.rewardPoints} Poin
                  </span>
                </div>
              ))}
            </div>
          )}

          <BottomSpace />
        </main>

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

        <BottomNav />
      </div>
    </div>
  )
}
