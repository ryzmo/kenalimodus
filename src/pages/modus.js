import { useState, useMemo } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import { MODUS_LIST, MODUS_CATEGORIES, PIPELINE_STEPS } from "../data/modusData"

export default function ModusPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeModusModal, setActiveModusModal] = useState(null)

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

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* Header Title Section */}
        <section className="mt-6">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#0876c9]">
              Katalog Edukasi Anti-Fraud
            </span>
            <h1 className="text-2xl font-black text-[#102a54] md:text-3xl">
              Modus & Trik Penipuan Terbaru
            </h1>
            <p className="text-sm leading-6 text-slate-500 max-w-2xl">
              Pelajari pola kejahatan digital yang sedang marak, kenali tanda-tanda bahaya (red flags), dan pahami langkah pencegahan yang tepat.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Icon name="Search" size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modus (misal: APK, CS WhatsApp, QRIS)..."
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
            {MODUS_CATEGORIES.map((category) => {
              const active = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                    active
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

        {/* Modus List Grid */}
        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#0876c9]">
                      <Icon name={modus.icon} size={22} />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                        modus.level === "Tinggi"
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

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
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
        </section>

        {/* Pipeline / Alur Update Modus Terbaru */}
        <section className="mt-12 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
              Transparansi Informasi
            </span>
            <h2 className="text-xl font-black text-[#102a54] md:text-2xl">
              Alur Kurasi & Validasi Modus Terbaru
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Setiap materi dan skenario di KENALI MODUS melewati proses verifikasi ketat sebelum dipublikasikan untuk memastikan akurasi data.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {PIPELINE_STEPS.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100/70 text-[#0876c9]">
                    <Icon name={step.icon} size={16} />
                  </div>
                  <span className="text-[11px] font-black text-slate-400">
                    0{step.step}
                  </span>
                </div>
                <h4 className="mt-3 text-xs font-black text-[#102a54]">
                  {step.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <BottomSpace />
      </main>

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
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                  activeModusModal.level === "Tinggi"
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
