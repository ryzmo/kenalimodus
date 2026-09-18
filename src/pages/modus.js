import { useState, useMemo } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  MODUS_LIST,
  MODUS_CATEGORIES,
  PIPELINE_STEPS,
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

  // Award Points when watching video or reading article
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
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* Header Title Section */}
        <section className="mt-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black text-[#102a54] md:text-3xl">
              Modus & Edukasi
            </h1>
            <p className="text-sm leading-6 text-slate-500 max-w-2xl">
              Pelajari pola kejahatan digital terbaru, kenali tanda bahaya, dan tonton materi resmi <strong>#AwasModus</strong>
            </p>
          </div>

          {/* Search Input */}
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Icon name="Search" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modus atau edukasi (misal: Website Palsu, APK, CS WhatsApp)..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-[#102a54] shadow-sm transition placeholder:text-slate-400 focus:border-[#0876c9] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {["Semua", "Video #AwasModus", "Artikel Edukatips", ...MODUS_CATEGORIES.filter((c) => c !== "Semua")].map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${active
                    ? "bg-[#102a54] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                    }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>

        {/* Featured Video #AwasModus */}
        {(selectedCategory === "Semua" || selectedCategory === "Video #AwasModus") && (
          <section className="mt-6 rounded-3xl gradient-brand p-6 text-white shadow-soft md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-xl">

                <h2 className="text-xl font-black md:text-2xl leading-tight">
                  {mainVideo.title}
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-blue-100">
                  {mainVideo.desc}
                </p>

                {/* Mantra Jitu B-C-A visual tags */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {mainVideo.mantraPoints.map((pt) => (
                    <div
                      key={pt.letter}
                      className="rounded-2xl bg-white/10 border border-white/15 p-3 backdrop-blur-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400 text-[#102a54] text-xs font-black">
                          {pt.letter}
                        </span>
                        <span className="text-xs font-black text-white leading-tight">
                          {pt.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Play Trigger Banner */}
              <div className="shrink-0 flex flex-col items-center">
                <div
                  onClick={() => {
                    setActiveVideoModal(mainVideo)
                    handleClaimEduPoints(mainVideo.id, mainVideo.pointsAward, mainVideo.title)
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-white/30 bg-slate-900 w-full sm:w-72 h-44 shadow-xl flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                  {/* Play Button */}
                  <div className="relative grid h-14 w-14 place-items-center rounded-full bg-cyan-400 text-[#102a54] shadow-lg transition duration-200 group-hover:scale-110">
                    <span className="text-xl pl-1 font-black">▶</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                    <span>Mantra Jitu B-C-A</span>
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-cyan-200">
                      {mainVideo.duration}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveVideoModal(mainVideo)
                    handleClaimEduPoints(mainVideo.id, mainVideo.pointsAward, mainVideo.title)
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-black text-cyan-200 hover:text-white transition"
                >
                  <span>Tonton Video & Dapatkan +{mainVideo.pointsAward} Pts</span>
                  <Icon name="ArrowRight" size={14} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Official BCA Artikel & Edukatips feed */}
        {(selectedCategory === "Semua" || selectedCategory === "Artikel Edukatips") && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#102a54]">
                  Rekomendasi Artikel Edukatips
                </h2>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {BCA_EDU_ARTICLES.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    setActiveArticleModal(art)
                    handleClaimEduPoints(art.id, art.pointsAward, art.title)
                  }}
                  className="group cursor-pointer flex flex-col justify-between rounded-3xl bg-white p-5 shadow-soft border border-slate-100 hover:border-blue-200 transition duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0876c9]">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {art.date}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-black leading-snug text-[#102a54] group-hover:text-[#0876c9] transition">
                      {art.title}
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-bold text-[#0876c9]">
                    <span>Baca Lengkap ({art.readTime})</span>
                    <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-700">
                      +{art.pointsAward} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modus simulasi list grid */}
        {selectedCategory !== "Video #AwasModus" && selectedCategory !== "Artikel Edukatips" && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Simulasi Interaktif
                </span>
                <h2 className="text-lg font-black text-[#102a54]">
                  Katalog Skenario Modus Penipuan
                </h2>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredModus.length === 0 ? (
                <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-soft">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <Icon name="Search" size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-black text-[#102a54]">
                    Modus tidak ditemukan
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Coba gunakan kata kunci pencarian yang lain atau ganti kategori.
                  </p>
                </div>
              ) : (
                filteredModus.map((modus) => (
                  <div
                    key={modus.id}
                    className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${modus.level === "Tinggi"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                            }`}
                        >
                          Risiko {modus.level}
                        </span>
                      </div>

                      <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
                        {modus.tag}
                      </div>

                      <h3 className="mt-1 text-lg font-black leading-snug text-[#102a54]">
                        {modus.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {modus.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveModusModal(modus)}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-[#0876c9] hover:underline"
                      >
                        Lihat Red Flags & Tips
                        <Icon name="ChevronRight" size={14} />
                      </button>

                      <Link
                        href="/challenge"
                        className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#102a54] transition hover:bg-[#0876c9] hover:text-white"
                      >
                        Uji Skenario
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}


        <BottomSpace />
      </main>

      {/* Modal video player #AwasModus */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase text-[#0876c9]">
                  {activeVideoModal.campaign}
                </span>
                <h3 className="mt-1 text-sm font-black text-[#102a54]">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Video Player Mockup / Embed */}
            <div className="relative bg-slate-950 aspect-video flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="text-base font-black text-cyan-400">
                #AWASMODUS: Mantra Jitu Lawan Penipu
              </div>
              <div className="mt-2 text-2xl font-black">
                B - C - A
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-left text-[11px] max-w-md w-full">
                <div className="rounded-lg bg-white/10 p-2">
                  <strong className="text-cyan-300 block">B</strong> Buka dengan ketik manual
                </div>
                <div className="rounded-lg bg-white/10 p-2">
                  <strong className="text-cyan-300 block">C</strong> Cek keaslian website
                </div>
                <div className="rounded-lg bg-white/10 p-2">
                  <strong className="text-cyan-300 block">A</strong> Ayo bintangin
                </div>
              </div>
              <p className="mt-3 text-[10px] text-slate-400">
                Sumber Resmi: myVideo BCA / Youtube Solusi BCA ({activeVideoModal.duration})
              </p>
            </div>

            {/* Modal Body Info */}
            <div className="p-5">
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                <span>+{activeVideoModal.pointsAward} Points Telah Ditambahkan ke Akunmu!</span>
                <span className="font-mono text-emerald-700">✓ Selesai</span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Tutup
                </button>
                <Link
                  href="/challenge"
                  className="flex-1 rounded-2xl bg-[#0876c9] py-3 text-center text-xs font-black text-white shadow-md hover:bg-[#075da8]"
                >
                  Uji Skenario di Challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal artikel edukatips BCA */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setActiveArticleModal(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <Icon name="X" size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0876c9]">
                {activeArticleModal.category}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {activeArticleModal.date} · {activeArticleModal.readTime}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-black text-[#102a54]">
              {activeArticleModal.title}
            </h3>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs leading-relaxed text-slate-700 whitespace-pre-line font-medium">
              {activeArticleModal.content}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Sumber: bca.co.id / News & Features</span>
              <a
                href={activeArticleModal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0876c9] hover:underline"
              >
                Buka Link Asli BCA ↗
              </a>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Tutup
              </button>
              <Link
                href="/challenge"
                className="flex-1 rounded-2xl bg-[#0876c9] py-3 text-center text-xs font-black text-white shadow-md hover:bg-[#075da8]"
              >
                Latih di Challenge
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Modus & Red Flags */}
      {activeModusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setActiveModusModal(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <Icon name="X" size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0876c9]">
                {activeModusModal.tag}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${activeModusModal.level === "Tinggi"
                  ? "bg-red-50 text-red-600"
                  : "bg-amber-50 text-amber-600"
                  }`}
              >
                Risiko {activeModusModal.level}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-black text-[#102a54]">
              {activeModusModal.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {activeModusModal.summary}
            </p>

            {/* Red Flags Section */}
            <div className="mt-6 rounded-2xl bg-red-50/70 p-4 border border-red-100">
              <div className="flex items-center gap-2 text-red-700">
                <Icon name="AlertTriangle" size={16} />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Red Flags (Tanda Bahaya)
                </h4>
              </div>
              <ul className="mt-2.5 flex flex-col gap-2">
                {activeModusModal.redFlags.map((flag, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-5 text-red-900"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safe Actions Section */}
            <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700">
                <Icon name="CheckCircle2" size={16} />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Tindakan Aman & Pencegahan
                </h4>
              </div>
              <ul className="mt-2.5 flex flex-col gap-2">
                {activeModusModal.safeActions.map((action, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs leading-5 text-emerald-900"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveModusModal(null)}
                className="flex-1 rounded-2xl bg-slate-100 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Tutup
              </button>
              <Link
                href="/challenge"
                className="flex-1 rounded-2xl bg-[#0876c9] py-3 text-center text-xs font-black text-white shadow-md hover:bg-[#075da8]"
              >
                Coba Challenge Ini
              </Link>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

