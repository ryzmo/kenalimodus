import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import {
  REWARD_CATALOG,
  TIER_LEVELS,
  LEADERBOARD_MOCK
} from "../data/modusData"

function getCurrentTier(totalPoints) {
  for (let i = TIER_LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= TIER_LEVELS[i].minPoints) return TIER_LEVELS[i]
  }
  return TIER_LEVELS[0]
}

export default function RewardsPage() {
  const [totalPoints, setTotalPoints] = useState(1250)
  const [streakCount, setStreakCount] = useState(3)
  const [activeTab, setActiveTab] = useState("catalog") // "catalog" | "history" | "leaderboard"
  const [redeemed, setRedeemed] = useState([])
  const [historyLog, setHistoryLog] = useState([])
  const [selectedReward, setSelectedReward] = useState(null)
  const [toastMsg, setToastMsg] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const storedPoints = localStorage.getItem("kenali_points_data")
    if (storedPoints) {
      try {
        const parsed = JSON.parse(storedPoints)
        if (parsed.totalPoints !== undefined) setTotalPoints(parsed.totalPoints)
        if (parsed.streakCount !== undefined) setStreakCount(parsed.streakCount)
        if (parsed.redeemed) setRedeemed(parsed.redeemed)
        if (parsed.historyLog) setHistoryLog(parsed.historyLog)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const currentTier = getCurrentTier(totalPoints)

  const handleRedeem = (item) => {
    if (totalPoints < item.cost) {
      setToastMsg("Poin Anda belum mencukupi")
      setTimeout(() => setToastMsg(""), 2000)
      return
    }

    const newPoints = totalPoints - item.cost
    const newRedeemed = [...redeemed, item.id]
    const newLog = [
      {
        id: `redeem-${Date.now()}`,
        activity: `Tukar Reward: ${item.title}`,
        points: -item.cost,
        date: new Date().toISOString()
      },
      ...historyLog
    ]

    setTotalPoints(newPoints)
    setRedeemed(newRedeemed)
    setHistoryLog(newLog)
    setSelectedReward(null)
    setToastMsg(`Berhasil menukar ${item.title}!`)
    setTimeout(() => setToastMsg(""), 2500)

    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_points_data", JSON.stringify({
        totalPoints: newPoints,
        streakCount,
        redeemed: newRedeemed,
        historyLog: newLog
      }))
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">
        
        <AppHeader title="Rewards & Poin" subtitle="Gamifikasi Proteksi" />

        {/* Top Points Summary in Sky Blue Header */}
        <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-1 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-100">
                Total Poin Aktif
              </div>
              <div className="text-4xl font-black tracking-tight text-white mt-0.5">
                {totalPoints.toLocaleString()} <span className="text-sm font-bold text-sky-200">PTS</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-white/90">
                Tingkat: <span className="underline">{currentTier.name}</span> • Streak {streakCount} Hari 🔥
              </div>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center p-2 shadow-sm">
              <Image
                src="/3d-trophy-icon.png"
                alt="Trophy Poin"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="mt-4 flex rounded-2xl bg-white/20 backdrop-blur-md p-1 border border-white/30 text-xs font-bold text-white">
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === "catalog" ? "bg-white text-[#003882] shadow-xs" : "hover:bg-white/10"
              }`}
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("leaderboard")}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === "leaderboard" ? "bg-white text-[#003882] shadow-xs" : "hover:bg-white/10"
              }`}
            >
              Peringkat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-1.5 rounded-xl transition ${
                activeTab === "history" ? "bg-white text-[#003882] shadow-xs" : "hover:bg-white/10"
              }`}
            >
              Riwayat
            </button>
          </div>
        </section>

        {/* BOTTOM SHEET */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10"><div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-5">
          
          {toastMsg && (
            <div className="rounded-2xl bg-[#003882] text-white p-3 text-xs font-bold text-center animate-in fade-in">
              {toastMsg}
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="space-y-5">
              {/* Widget Challenge Streak & Cara Mendapatkan Points (Hanya muncul di tab Katalog) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card Challenge Streak */}
                <div className="glass-card rounded-[24px] p-5 border border-white/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-[#0292fc]">
                          STREAK
                        </div>
                        <h2 className="text-lg font-black text-[#002554] tracking-tight mt-0.5">
                          Challenge Streak
                        </h2>
                      </div>
                      <div className="flex items-baseline gap-1 text-[#003882]">
                        <span className="text-3xl font-black leading-none">{streakCount}</span>
                        <span className="text-xs font-bold text-slate-500">hari</span>
                      </div>
                    </div>

                    {/* 7-Day Streak Pills */}
                    {(() => {
                      const days = [
                        { key: "S", label: "S", active: true, fire: false, isToday: false },
                        { key: "S2", label: "S", active: true, fire: true, isToday: false },
                        { key: "R", label: "R", active: true, fire: true, isToday: false },
                        { key: "K", label: "K", active: true, fire: true, isToday: true },
                        { key: "J", label: "J", active: false, fire: false, isToday: false },
                        { key: "S3", label: "S", active: false, fire: false, isToday: false },
                        { key: "M", label: "M", active: false, fire: false, isToday: false },
                      ]

                      return (
                        <div className="mt-4 grid grid-cols-7 gap-2">
                          {days.map((d) => (
                            <div key={d.key} className="flex flex-col items-center gap-1.5">
                              <div
                                className={`w-full aspect-square max-w-[44px] rounded-xl flex items-center justify-center transition-all ${
                                  d.isToday
                                    ? "bg-[#0292fc] text-white shadow-xs ring-2 ring-sky-200"
                                    : d.fire
                                    ? "bg-sky-50 border border-sky-100 text-[#0292fc]"
                                    : "bg-slate-100/70 border border-slate-200/50 text-slate-300"
                                }`}
                              >
                                {d.fire ? (
                                  <Icon
                                    name="Flame"
                                    className={`h-4 w-4 fill-current ${
                                      d.isToday ? "text-white" : "text-[#0292fc]"
                                    }`}
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-slate-300">-</span>
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-bold ${
                                  d.isToday ? "text-[#003882] font-black" : "text-slate-400"
                                }`}
                              >
                                {d.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Bottom Banner */}
                  <div className="mt-4 rounded-xl bg-blue-50/80 border border-blue-100/70 p-2.5 text-center">
                    <p className="text-xs font-medium text-slate-700">
                      Jaga streak 7 hari berturut-turut <span className="font-black text-[#003882]">→ +10 bonus poin</span>
                    </p>
                  </div>
                </div>

                {/* Card Cara Mendapatkan Points */}
                <div className="glass-card rounded-[24px] p-5 border border-white/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#0292fc]">
                      EARN POINTS
                    </div>
                    <h2 className="text-lg font-black text-[#002554] tracking-tight mt-0.5">
                      Cara Mendapatkan Points
                    </h2>

                    {/* Table / List Cara Mendapatkan Poin */}
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs">
                      <div className="flex items-center justify-between bg-[#003882] px-4 py-2.5 text-xs font-bold text-white">
                        <span>Aktivitas Edukasi & Proteksi</span>
                        <span>Points</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition">
                          <span className="font-medium text-slate-700">Menyelesaikan 2-Min Scam Challenge (Skor ≥80)</span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-black text-[#003882]">
                            +30
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition">
                          <span className="font-medium text-slate-700">Menyelesaikan 2-Min Scam Challenge</span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-black text-[#003882]">
                            +20
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition">
                          <span className="font-medium text-slate-700">Menonton Video Edukasi Resmi #AwasModus</span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-black text-[#003882]">
                            +15
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition">
                          <span className="font-medium text-slate-700">Membaca Artikel Resmi & Rumus Jitu BCA</span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-black text-[#003882]">
                            +10
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition">
                          <span className="font-medium text-slate-700">Bonus Streak Challenge 7 Hari Beruntun</span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-black text-[#003882]">
                            +10
                          </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition">
                          <span className="font-medium text-slate-700">Membagikan Skor atau Proteksi ke Keluarga</span>
                          <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 font-black text-[#003882]">
                            +5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian Katalog Tukar Hadiah */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#002554]">
                    Tukar Hadiah Digital
                  </span>
                  <span className="text-[11px] text-slate-400">Merchant Resmi BCA</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REWARD_CATALOG.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card rounded-[24px] p-4 flex flex-col justify-between border border-white hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#0292fc]">
                            {item.category}
                          </span>
                          <span className="rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 text-[10px] font-black">
                            {item.cost} PTS
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-[#002554] mt-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedReward(item)}
                        disabled={totalPoints < item.cost}
                        className={`mt-4 w-full rounded-xl py-2 text-xs font-bold transition shadow-xs ${
                          totalPoints >= item.cost
                            ? "bg-[#0292fc] text-white hover:bg-[#007ad6] active:scale-95 cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {totalPoints >= item.cost ? "Tukarkan" : "Poin Belum Cukup"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "leaderboard" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#002554]">
                  Peringkat Nasabah Paling Waspada
                </span>
              </div>

              {LEADERBOARD_MOCK.map((user, idx) => (
                <div
                  key={user.id}
                  className="glass-card rounded-[20px] p-3 flex items-center justify-between border border-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-full bg-blue-50 text-[#0292fc] flex items-center justify-center text-xs font-black">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-black text-[#002554]">{user.name}</div>
                      <div className="text-[10px] text-slate-400">Safe Score {user.score}</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#0292fc]">
                    {user.points.toLocaleString()} PTS
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#002554] px-1">
                Riwayat Perolehan Poin
              </span>
              {historyLog.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada transaksi poin. Mainkan 2-Min Challenge untuk mulai mengumpulkan!
                </div>
              ) : (
                historyLog.map((log) => (
                  <div
                    key={log.id}
                    className="glass-card rounded-[18px] p-3 flex items-center justify-between border border-white"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#002554]">{log.activity}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        {new Date(log.date).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-black ${
                        log.points > 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {log.points > 0 ? `+${log.points}` : log.points} PTS
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          <BottomSpace />
          </div>
        </main>

        <div className="md:hidden"><BottomNav /></div>

        {/* Modal Konfirmasi Redeem */}
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-2xs animate-in fade-in">
            <div className="w-full max-w-xs rounded-[32px] bg-white p-5 shadow-2xl text-center">
              <div className="text-sm font-black text-[#002554]">
                Konfirmasi Penukaran
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Gunakan <strong>{selectedReward.cost} PTS</strong> untuk menukarkan voucher <strong>{selectedReward.title}</strong>?
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRedeem(selectedReward)}
                  className="flex-1 rounded-xl bg-[#0292fc] py-2 text-xs font-bold text-white"
                >
                  Ya, Tukar
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReward(null)}
                  className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
