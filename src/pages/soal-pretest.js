import { useState } from "react"
import Link from "next/link"
import { PRE_TEST_SCENARIOS } from "../data/modusData"

export default function SoalPreTestPage() {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showAllDetails, setShowAllDetails] = useState(true)

  const handleSelect = (scenarioId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [scenarioId]: option
    }))
  }

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 text-slate-800 antialiased font-sans">
      {/* Top Bar Ringkas */}
      <div className="max-w-[1400px] mx-auto mb-3 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/challenge"
            className="text-xs font-bold text-[#0876c9] hover:underline"
          >
            &larr; Kembali ke Challenge
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-sm md:text-base font-black text-[#102a54] tracking-tight">
            Instrumen Soal Pre-Test (5 Skenario Uji Refleks)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAllDetails(!showAllDetails)}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
          >
            {showAllDetails ? "Sembunyikan Kunci/Red Flags" : "Tampilkan Kunci & Red Flags"}
          </button>
          <button
            onClick={() => window.print()}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#102a54] text-white hover:bg-slate-800"
          >
            Cetak / PDF
          </button>
        </div>
      </div>

      {/* Grid 5 Soal Kompak (Bisa Screenshot 1 Layar di Desktop / Zoom Fit) */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {PRE_TEST_SCENARIOS.map((item, index) => {
          const chosen = selectedAnswers[item.id]

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between text-[11px] leading-tight"
            >
              {/* Header Skenario */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-blue-100 text-[#0876c9] font-black px-1.5 py-0.5 rounded text-[10px]">
                      No. {index + 1}
                    </span>
                    <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    {item.difficulty}
                  </span>
                </div>

                <h2 className="font-black text-[#102a54] text-xs leading-snug mb-1">
                  {item.title}
                </h2>

                {/* Konteks Kasus */}
                <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-lg mb-2 text-slate-600 text-[10px] leading-normal">
                  <strong className="text-slate-800 block text-[9px] uppercase tracking-wider mb-0.5">
                    Situasi:
                  </strong>
                  {item.context}
                </div>

                {/* Mockup Pesan Ringkas */}
                <div className="border border-slate-200 bg-slate-100/70 p-1.5 rounded-lg mb-2">
                  <div className="text-[9px] font-bold text-[#102a54] border-b border-slate-200 pb-0.5 mb-1 flex justify-between">
                    <span>Pengirim: {item.sender}</span>
                    <span className="text-slate-400 capitalize">[{item.mockType}]</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-slate-100 text-slate-800 font-medium text-[10px] leading-normal">
                    {item.message}
                  </div>
                </div>

                {/* Pertanyaan */}
                <div className="font-bold text-[#102a54] text-[10.5px] mb-1.5">
                  {item.question}
                </div>

                {/* Pilihan Respon A-E */}
                <div className="space-y-1 mb-2">
                  {item.options.map((opt) => {
                    const isSelected = chosen?.id === opt.id
                    const isKey = showAllDetails && opt.isCorrect

                    let bgStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200"

                    if (isKey) {
                      bgStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold"
                      badgeStyle = "bg-emerald-600 text-white border-emerald-600"
                    } else if (isSelected) {
                      bgStyle = opt.isCorrect
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                        : "bg-rose-50 border-rose-400 text-rose-900"
                      badgeStyle = opt.isCorrect
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-rose-600 text-white border-rose-600"
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(item.id, opt)}
                        className={`cursor-pointer border rounded-lg p-1.5 transition-all text-[10px] leading-snug flex items-start gap-1.5 ${bgStyle}`}
                      >
                        <span
                          className={`shrink-0 w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] border ${badgeStyle}`}
                        >
                          {opt.id.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <span>{opt.text}</span>
                          {showAllDetails && (
                            <div className="mt-0.5 text-[9px] font-normal text-slate-500">
                              <span className={opt.isCorrect ? "font-bold text-emerald-700" : "font-semibold text-rose-700"}>
                                {opt.isCorrect ? "[Benar / Aman]" : "[Berisiko]"}
                              </span>{" "}
                              {opt.scoreImpact > 0 ? `+${opt.scoreImpact}` : opt.scoreImpact} pts
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Red Flags & Golden Rule (Bisa Ditampilkan Kompak) */}
              {showAllDetails && (
                <div className="mt-1 pt-1.5 border-t border-slate-200 bg-slate-50 p-1.5 rounded-lg text-[9.5px]">
                  <div className="mb-1">
                    <strong className="text-slate-800 text-[9px] uppercase tracking-wider block">
                      Tanda Bahaya:
                    </strong>
                    <ul className="list-disc pl-3 text-slate-600 space-y-0.5">
                      {item.redFlags.slice(0, 2).map((rf, rIdx) => (
                        <li key={rIdx}>{rf}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-slate-200 pt-1">
                    <strong className="text-[#102a54] text-[9px] uppercase tracking-wider block">
                      Kaidah Perlindungan:
                    </strong>
                    <p className="text-slate-700 italic">
                      "{item.goldenRule}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
