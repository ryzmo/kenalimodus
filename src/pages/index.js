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

  const modusOfTheWeek = MODUS_LIST[0]
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Yuk uji seberapa aman kamu dari modus penipuan online terbaru di KENALI MODUS: ${originUrl}/challenge`
  )}`

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* =========================
            HERO
        ========================== */}
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
              Bukan sekadar membaca artikel. Latih refleks pengambilan keputusanmu lewat simulasi 1.5-Minute Challenge, ukur Safe Score, dan lindungi orang terdekat.
            </p>

            {/* CTA */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/challenge"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#075da8] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Mulai 1.5-Minute Challenge
              </Link>

            </div>
          </div>
        </section>

        {/* =========================
            CORE LOOP & POSITIONING
        ========================== */}
        {/* =========================
            CORE HABIT LOOP
        ========================== */}
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

        {/* =========================
            QUICK FEATURES
        ========================== */}
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

        {/* =========================
            BCA OFFICIAL #AWASMODUS BANNER
        ========================== */}
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

        {/* =========================
            MODUS TERBARU LIST
        ========================== */}
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

        {/* =========================
            PROTECT OTHERS & SHARING
        ========================== */}
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

        <BottomSpace />
      </main>

      <BottomNav />
    </div>
  )
}