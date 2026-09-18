import { useState, useEffect } from "react"
import Link from "next/link"
import AppHeader from "../../components/AppHeader"
import BottomSpace from "../../components/BottomSpace"
import Icon from "../../components/Icon"
import { formatRupiah, IMPACT_BENCHMARK_OJK } from "../../data/modusData"

export default function AdminImpactPage() {
  const [data, setData] = useState({
    stats: {
      totalParticipants: 0,
      avgAge: 0,
      avgPreRiskyRate: 0,
      avgPostRiskyRate: 0,
      avgBehavioralImpact: 0,
      avgRelativeReduction: 0,
      totalPotentialLossAvoided: 0,
      avgPreScore: 0,
      avgPostScore: 0,
      avgAttention: 0,
      avgRepetition: 0,
      avgIntention: 0,
      avgAri: 0
    },
    recentParticipants: [],
    source: "loading"
  })

  const [loading, setLoading] = useState(true)
  const [filterQuery, setFilterQuery] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/impact/submit")
      const json = await res.json()
      if (json && json.success) {
        let recent = json.recentParticipants || []
        let stats = json.stats

        if (recent.length === 0 && typeof window !== "undefined") {
          const localImpact = localStorage.getItem("kenali_impact_result")
          if (localImpact) {
            try {
              const parsed = JSON.parse(localImpact)
              recent = [parsed]
              stats = {
                totalParticipants: 1,
                avgAge: parsed.participantAge || 25,
                avgPreRiskyRate: parsed.preRiskyRate || 0,
                avgPostRiskyRate: parsed.postRiskyRate || 0,
                avgBehavioralImpact: parsed.behavioralImpact || 0,
                avgRelativeReduction: parsed.relativeReduction || 0,
                totalPotentialLossAvoided: parsed.potentialLossAvoided1k || 0,
                avgPreScore: parsed.preScore || 0,
                avgPostScore: parsed.postScore || 0,
                avgAttention: parsed.attentionScore || 5,
                avgRepetition: parsed.repetitionScore || 5,
                avgIntention: parsed.intentionScore || 5,
                avgAri: parsed.ariAverage || 5
              }
            } catch (e) {
              console.error(e)
            }
          }
        }

        setData({
          ...json,
          stats: stats || json.stats,
          recentParticipants: recent
        })
      }
    } catch (err) {
      console.error("Error fetching admin data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const participants = data.recentParticipants || []
  const filteredParticipants = participants.filter((p) => {
    const name = (p.participantName || "").toLowerCase()
    const sid = (p.sessionId || "").toLowerCase()
    const ageStr = String(p.participantAge || "")
    const q = filterQuery.toLowerCase()
    return name.includes(q) || sid.includes(q) || ageStr.includes(q)
  })

  return (
    <div className="app-shell min-h-screen bg-[#f8fafc]">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Simple Professional Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#102a54] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Admin
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Database Sync: {data.source === "neondb" ? "NeonDB PostgreSQL" : "Local Memory"}
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#102a54] md:text-3xl">
              Rekap Data Peserta Challenge & Evaluasi ARI
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Audit data risiko (Pre vs Post), demografi usia, dan evaluasi pilar Attention, Repetition, & Intention.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchData}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Icon name="RotateCcw" size={13} className={loading ? "animate-spin text-[#0876c9]" : "text-slate-500"} />
              Muat Ulang
            </button>

            <Link
              href="/challenge"
              className="flex items-center gap-2 rounded-lg bg-[#0876c9] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#075da8]"
            >
              Uji Coba Baru
            </Link>
          </div>
        </div>

        {/* Metric cards (Risk & ARI metrics) */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Total Partisipan</div>
            <div className="mt-2 text-2xl font-bold text-[#102a54]">
              {data.stats.totalParticipants} <span className="text-xs font-normal text-slate-400">orang</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Total peserta terdaftar</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Rata-rata Usia</div>
            <div className="mt-2 text-2xl font-bold text-[#102a54]">
              {data.stats.avgAge || 25} <span className="text-xs font-normal text-slate-400">tahun</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Demografi responden</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Risky Rate (Pre)</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">
              {data.stats.avgPreRiskyRate}%
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Kondisi baseline awal</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Risky Rate (Post)</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">
              {data.stats.avgPostRiskyRate}%
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Setelah sesi tantangan</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-slate-500">Relative Reduction (X%)</div>
            <div className="mt-2 text-2xl font-bold text-[#0876c9]">
              {data.stats.avgRelativeReduction}%
            </div>
            <div className="mt-1 text-[11px] text-slate-400">Penurunan risiko terukur</div>
          </div>
        </div>

        {/* ARI Aggregate Bar */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500">Attention (Fokus)</div>
            <div className="mt-1 text-xl font-bold text-[#102a54]">{data.stats.avgAttention || 0} <span className="text-xs text-slate-400">/ 5</span></div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500">Repetition (Latihan)</div>
            <div className="mt-1 text-xl font-bold text-[#102a54]">{data.stats.avgRepetition || 0} <span className="text-xs text-slate-400">/ 5</span></div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500">Intention (Niat Aman)</div>
            <div className="mt-1 text-xl font-bold text-[#102a54]">{data.stats.avgIntention || 0} <span className="text-xs text-slate-400">/ 5</span></div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="text-[11px] font-semibold text-slate-500">Rata-rata Skor ARI</div>
            <div className="mt-1 text-xl font-bold text-[#0876c9]">{data.stats.avgAri || 0} <span className="text-xs text-slate-400">/ 5.0</span></div>
          </div>
        </div>

        {/* Data table: raw, calculated, age & ARI ratings */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#102a54]">
                Daftar Hasil Peserta, Usia & Evaluasi ARI
              </h2>
              <p className="text-xs text-slate-400">
                Menampilkan data demografi umur, kalkulasi risiko (Pre vs Post), serta skor pilar Attention, Repetition, & Intention.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nama, usia, atau ID..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#0876c9]"
              />
            </div>
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="py-14 text-center">
              <div className="text-sm font-semibold text-slate-700">
                Belum ada data peserta
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Data akan otomatis masuk setelah peserta menyelesaikan challenge dan evaluasi ARI.
              </p>
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                    <th className="py-2.5 px-3">Peserta & Waktu</th>
                    <th className="py-2.5 px-2 text-center">Umur</th>
                    <th className="py-2.5 px-2 text-center">Raw Pre (Risiko/Total)</th>
                    <th className="py-2.5 px-2 text-center">Risky Pre (%)</th>
                    <th className="py-2.5 px-2 text-center">Raw Post (Risiko/Total)</th>
                    <th className="py-2.5 px-2 text-center">Risky Post (%)</th>
                    <th className="py-2.5 px-2 text-center">Reduction (X%)</th>
                    <th className="py-2.5 px-2 text-center">Attention</th>
                    <th className="py-2.5 px-2 text-center">Repetition</th>
                    <th className="py-2.5 px-2 text-center">Intention</th>
                    <th className="py-2.5 px-2 text-center">Rata-rata ARI</th>
                    <th className="py-2.5 px-3 text-right">Kerugian Dihindari</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredParticipants.map((p, idx) => {
                    const preRawCount = p.preRiskyCount !== undefined ? p.preRiskyCount : Math.round(((p.preRiskyRate || 0) / 100) * 5)
                    const postRawCount = p.postRiskyCount !== undefined ? p.postRiskyCount : Math.round(((p.postRiskyRate || 0) / 100) * 5)
                    const rawPreTotal = p.preTotalQuestions || 5
                    const rawPostTotal = p.postTotalQuestions || 5
                    const lossAvoided = Math.round(1000 * ((p.relativeReduction || 0) / 100) * IMPACT_BENCHMARK_OJK.averageLossPerReport)
                    const att = p.attentionScore || 5
                    const rep = p.repetitionScore || 5
                    const intn = p.intentionScore || 5
                    const ari = p.ariAverage || Number(((att + rep + intn) / 3).toFixed(2))

                    return (
                      <tr key={p.sessionId || idx} className="hover:bg-slate-50 transition">
                        {/* Peserta */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">
                            {p.participantName || `Peserta #${idx + 1}`}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {p.createdAt ? new Date(p.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}
                          </div>
                        </td>

                        {/* Umur */}
                        <td className="py-3 px-2 text-center">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#0876c9]">
                            {p.participantAge ? `${p.participantAge} thn` : "25 thn"}
                          </span>
                        </td>

                        {/* Raw Pre */}
                        <td className="py-3 px-2 text-center font-mono">
                          {preRawCount} / {rawPreTotal}
                        </td>

                        {/* Risky Pre */}
                        <td className="py-3 px-2 text-center font-mono font-medium text-slate-800">
                          {p.preRiskyRate}%
                          <span className="block text-[10px] text-slate-400 font-normal">Skor: {p.preScore}</span>
                        </td>

                        {/* Raw Post */}
                        <td className="py-3 px-2 text-center font-mono">
                          {postRawCount} / {rawPostTotal}
                        </td>

                        {/* Risky Post */}
                        <td className="py-3 px-2 text-center font-mono font-medium text-slate-800">
                          {p.postRiskyRate}%
                          <span className="block text-[10px] text-slate-400 font-normal">Skor: {p.postScore}</span>
                        </td>

                        {/* Reduction */}
                        <td className="py-3 px-2 text-center font-mono font-bold text-[#0876c9]">
                          {p.relativeReduction}%
                        </td>

                        {/* Attention */}
                        <td className="py-3 px-2 text-center font-mono text-slate-700">
                          {att} / 5
                        </td>

                        {/* Repetition */}
                        <td className="py-3 px-2 text-center font-mono text-slate-700">
                          {rep} / 5
                        </td>

                        {/* Intention */}
                        <td className="py-3 px-2 text-center font-mono text-slate-700">
                          {intn} / 5
                        </td>

                        {/* ARI Average */}
                        <td className="py-3 px-2 text-center font-mono font-bold text-[#102a54]">
                          {ari}
                        </td>

                        {/* Loss Avoided */}
                        <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                          {formatRupiah(lossAvoided)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <BottomSpace />
    </div>
  )
}
