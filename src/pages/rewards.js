import { useState, useEffect } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import {
  POINTS_ACTIVITIES,
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

function getNextTier(totalPoints) {
  const idx = TIER_LEVELS.findIndex(
    (t) => totalPoints >= t.minPoints && totalPoints <= t.maxPoints
  )
  return idx < TIER_LEVELS.length - 1 ? TIER_LEVELS[idx + 1] : null
}

function generateStreakData(streakCount) {
  const days = ["S", "S", "R", "K", "J", "S", "M"]
  const today = new Date().getDay()
  const adjusted = today === 0 ? 6 : today - 1
  return days.map((day, idx) => ({
    day,
    isActive: idx <= adjusted && idx > adjusted - streakCount,
    isCurrent: idx === adjusted
  }))
}

export default function RewardsPage() {
  const [totalPoints, setTotalPoints] = useState(0)
  const [safeScore, setSafeScore] = useState(78)
  const [streakCount, setStreakCount] = useState(3)
  const [redeemModal, setRedeemModal] = useState(null)
  const [redeemed, setRedeemed] = useState([])
  const [historyLog, setHistoryLog] = useState([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedResult = localStorage.getItem("kenali_modus_result")
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult)
        if (parsed.score !== undefined) setSafeScore(parsed.score)
      } catch (e) { console.error(e) }
    }

    const storedPoints = localStorage.getItem("kenali_points_data")
    if (storedPoints) {
      try {
        const p = JSON.parse(storedPoints)
        if (p.totalPoints !== undefined) setTotalPoints(p.totalPoints)
        if (p.streakCount !== undefined) setStreakCount(p.streakCount)
        if (p.redeemed) setRedeemed(p.redeemed)
        if (p.historyLog) setHistoryLog(p.historyLog)
      } catch (e) { console.error(e) }
    } else {
      const demo = {
        totalPoints: 65, streakCount: 3, redeemed: [],
        historyLog: [
          { id: "h1", activity: "Menyelesaikan Scam Challenge", points: 10, date: new Date(Date.now() - 86400000).toISOString() },
          { id: "h2", activity: "Menjawab seluruh skenario dengan benar", points: 10, date: new Date(Date.now() - 86400000).toISOString() },
          { id: "h3", activity: "Mengikuti Modus Terbaru", points: 5, date: new Date(Date.now() - 172800000).toISOString() },
          { id: "h4", activity: "Menjaga challenge streak", points: 10, date: new Date(Date.now() - 172800000).toISOString() },
          { id: "h5", activity: "Membagikan challenge via Protect Others", points: 10, date: new Date(Date.now() - 259200000).toISOString() },
          { id: "h6", activity: "Menyelesaikan Scam Challenge", points: 10, date: new Date(Date.now() - 345600000).toISOString() },
          { id: "h7", activity: "Mengikuti Modus Terbaru", points: 5, date: new Date(Date.now() - 345600000).toISOString() },
          { id: "h8", activity: "Menjaga challenge streak", points: 5, date: new Date(Date.now() - 432000000).toISOString() }
        ]
      }
      setTotalPoints(demo.totalPoints)
      setStreakCount(demo.streakCount)
      setHistoryLog(demo.historyLog)
      localStorage.setItem("kenali_points_data", JSON.stringify(demo))
    }
  }, [])

  const savePoints = (pts, streak, red, history) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_points_data", JSON.stringify({
        totalPoints: pts, streakCount: streak, redeemed: red, historyLog: history
      }))
    }
  }

  const handleRedeem = (reward) => {
    if (totalPoints < reward.cost) return
    const newPts = totalPoints - reward.cost
    const newRed = [...redeemed, reward.id]
    const newHist = [
      { id: `r-${Date.now()}`, activity: `Tukar: ${reward.title}`, points: -reward.cost, date: new Date().toISOString() },
      ...historyLog
    ]
    setTotalPoints(newPts)
    setRedeemed(newRed)
    setHistoryLog(newHist)
    savePoints(newPts, streakCount, newRed, newHist)
    setRedeemModal(null)
  }

  const currentTier = getCurrentTier(totalPoints)
  const nextTier = getNextTier(totalPoints)
  const tierProgress = nextTier
    ? ((totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100
  const streakData = generateStreakData(streakCount)

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">

        {/* ── HERO ── */}
        <section className="mt-5 rounded-2xl gradient-brand p-5 text-white shadow-soft md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* Left: Points */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                Points & Reward
              </p>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-black">{totalPoints}</span>
                <span className="text-sm font-semibold text-blue-200">pts</span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black"
                  style={{ background: `${currentTier.color}30`, color: "#fff" }}
                >
                  {currentTier.name}
                </span>
                {nextTier && (
                  <span className="text-blue-200">
                    {nextTier.minPoints - totalPoints} pts → {nextTier.name}
                  </span>
                )}
              </div>

              {nextTier && (
                <div className="mt-2.5 max-w-[200px]">
                  <div className="h-1.5 rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-white/70 transition-all duration-500"
                      style={{ width: `${tierProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── STREAK ── */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Streak</p>
              <h2 className="mt-0.5 text-base font-black text-[#102a54]">Challenge Streak</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600">{streakCount}</span>
              <span className="ml-1 text-xs font-semibold text-slate-400">hari</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {streakData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`grid h-9 w-9 place-items-center rounded-lg text-[11px] font-black transition ${d.isActive
                    ? d.isCurrent
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 text-amber-700"
                    : "bg-slate-50 text-slate-300"
                    }`}
                >
                  {d.isActive ? "🔥" : "·"}
                </div>
                <span className={`text-[10px] font-bold ${d.isCurrent ? "text-amber-600" : "text-slate-400"}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-800">
            Jaga streak 7 hari berturut-turut → <strong>+10 bonus poin</strong>
          </p>
        </section>

        {/* ── CARA MENDAPATKAN POINTS ── */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0876c9]">
            Earn Points
          </p>
          <h2 className="mt-1 text-base font-black text-[#102a54]">
            Cara Mendapatkan Points
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0876c9] text-white text-xs">
                  <th className="px-4 py-2.5 font-bold">Aktivitas</th>
                  <th className="px-4 py-2.5 font-bold text-right w-20">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {POINTS_ACTIVITIES.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-xs font-semibold text-[#102a54]">
                      {act.activity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-700">
                        +{act.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>



        {/* ── REWARD CATALOG ── */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Rewards</p>
          <h2 className="mt-1 text-base font-black text-[#102a54]">Tukar Poin dengan Reward</h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Terinspirasi dari mekanisme The New Gacha BCA
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {REWARD_CATALOG.map((reward) => {
              const canRedeem = totalPoints >= reward.cost && reward.available && !redeemed.includes(reward.id)
              const done = redeemed.includes(reward.id)
              const pct = Math.min((totalPoints / reward.cost) * 100, 100)

              return (
                <div
                  key={reward.id}
                  className={`rounded-xl border p-4 transition ${done
                    ? "border-emerald-200 bg-emerald-50/40"
                    : reward.available
                      ? "border-slate-200 hover:border-blue-200 hover:shadow-sm"
                      : "border-slate-100 bg-slate-50/50 opacity-50"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {reward.category}
                    </span>
                    {done && (
                      <span className="text-[10px] font-bold text-emerald-600">✓ Ditukar</span>
                    )}
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-[#102a54] leading-snug">
                    {reward.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    {reward.desc}
                  </p>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-black text-[#102a54]">{reward.cost} pts</span>
                      <span className="text-slate-400">{totalPoints}/{reward.cost}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-400" : pct >= 100 ? "bg-[#0876c9]" : "bg-slate-300"
                          }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canRedeem}
                    onClick={() => setRedeemModal(reward)}
                    className={`mt-3 w-full rounded-lg py-2 text-[11px] font-bold transition ${done
                      ? "bg-emerald-50 text-emerald-600 cursor-default"
                      : canRedeem
                        ? "bg-[#0876c9] text-white hover:bg-[#075da8]"
                        : "bg-slate-50 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    {done ? "Sudah Ditukar" : canRedeem ? "Tukar Sekarang" : !reward.available ? "Segera Hadir" : `Butuh ${reward.cost - totalPoints} pts lagi`}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── LEADERBOARD ── */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-soft">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-600">Community</p>
          <h2 className="mt-1 text-base font-black text-[#102a54]">Leaderboard Mingguan</h2>

          <div className="mt-4 space-y-1.5">
            {LEADERBOARD_MOCK.map((e) => (
              <div
                key={e.rank}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs ${e.rank <= 3 ? "bg-blue-50/60" : "bg-slate-50/60"
                  }`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-black ${e.rank === 1 ? "bg-amber-400 text-white"
                  : e.rank === 2 ? "bg-slate-400 text-white"
                    : e.rank === 3 ? "bg-amber-700 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                  {e.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[#102a54]">{e.name}</span>
                  <span className="ml-2 text-[10px] text-slate-400">{e.tier} · {e.streak}d streak</span>
                </div>
                <span className="font-black text-[#0876c9]">{e.points} <span className="font-normal text-slate-400">pts</span></span>
              </div>
            ))}

            {/* Your position */}
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/30 px-3 py-2.5 text-xs">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#0876c9] text-[11px] font-black text-white">
                —
              </span>
              <div className="flex-1">
                <span className="font-bold text-[#102a54]">Kamu</span>
                <span className="ml-2 text-[10px] text-slate-400">{currentTier.name}</span>
              </div>
              <span className="font-black text-[#0876c9]">{totalPoints} <span className="font-normal text-slate-400">pts</span></span>
            </div>
          </div>
        </section>

        {/* ── RIWAYAT ── */}
        {historyLog.length > 0 && (
          <section className="mt-5 rounded-2xl bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Log</p>
                <h2 className="mt-0.5 text-base font-black text-[#102a54]">Riwayat Poin</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{historyLog.length} aktivitas</span>
            </div>

            <div className="mt-3 space-y-1 max-h-[220px] overflow-y-auto">
              {historyLog.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-slate-50 transition">
                  <span className="font-semibold text-[#102a54] truncate mr-3">{log.activity}</span>
                  <span className={`shrink-0 font-black ${log.points < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {log.points < 0 ? log.points : `+${log.points}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <BottomSpace />
      </main>

      {/* ── REDEEM MODAL ── */}
      {redeemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-5">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#102a54]">Konfirmasi Tukar</h3>
              <button
                type="button"
                onClick={() => setRedeemModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-bold text-[#102a54]">{redeemModal.title}</p>
              <p className="text-[10px] text-slate-400">{redeemModal.category}</p>
            </div>

            <div className="mt-3 text-center">
              <span className="text-2xl font-black text-[#102a54]">{redeemModal.cost}</span>
              <span className="ml-1 text-xs text-slate-400">pts</span>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Saldo setelah tukar: {totalPoints - redeemModal.cost} pts
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setRedeemModal(null)}
                className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleRedeem(redeemModal)}
                className="flex-1 rounded-lg bg-[#0876c9] py-2 text-xs font-bold text-white hover:bg-[#075da8]"
              >
                Tukar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
