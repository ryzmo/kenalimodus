import { useState, useEffect } from "react"
import Link from "next/link"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import { DEFAULT_FAMILY_MEMBERS } from "../data/modusData"

export default function KeluargaPage() {
  const [members, setMembers] = useState(DEFAULT_FAMILY_MEMBERS)
  const [groupName, setGroupName] = useState("Keluarga Sejahtera")
  const [inviteCode, setInviteCode] = useState("AMAN-BCA-778")
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("Keluarga")
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")
  const [nudgedMember, setNudgedMember] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)
      const storedGroup = localStorage.getItem("kenali_family_group")
      if (storedGroup) {
        try {
          const parsed = JSON.parse(storedGroup)
          if (parsed.members) setMembers(parsed.members)
          if (parsed.groupName) setGroupName(parsed.groupName)
        } catch (e) {
          console.error(e)
        }
      }

      // Sync personal score from challenge result if available
      const storedPersonalResult = localStorage.getItem("kenali_modus_result")
      if (storedPersonalResult) {
        try {
          const parsedRes = JSON.parse(storedPersonalResult)
          if (parsedRes.score !== undefined) {
            setMembers((prev) =>
              prev.map((m) =>
                m.id === "saya"
                  ? {
                    ...m,
                    score: parsedRes.score,
                    status:
                      parsedRes.score >= 80
                        ? "Tinggi (Waspada)"
                        : parsedRes.score >= 60
                          ? "Cukup Waspada"
                          : "Rentan"
                  }
                  : m
              )
            )
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  const saveMembersToStorage = (updatedMembers, updatedGroupName = groupName) => {
    setMembers(updatedMembers)
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "kenali_family_group",
        JSON.stringify({ groupName: updatedGroupName, members: updatedMembers })
      )
    }
  }

  // Calculate Family Defense Index (Average Score)
  const totalScore = members.reduce((acc, m) => acc + m.score, 0)
  const avgScore = Math.round(totalScore / members.length)
  const vulnerableCount = members.filter((m) => m.score < 65).length

  let defenseStatus = "Tinggi (Keluarga Terlindungi)"
  let defenseBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200"

  if (avgScore < 60) {
    defenseStatus = "Rentan (Perlu Perhatian Segera)"
    defenseBadgeColor = "bg-red-50 text-red-700 border-red-200"
  } else if (avgScore < 75) {
    defenseStatus = "Waspada Sedang (Terdapat Anggota Rentan)"
    defenseBadgeColor = "bg-amber-50 text-amber-700 border-amber-200"
  }

  const handleCopyInvite = () => {
    const inviteLink = `${originUrl}/keluarga?join=${inviteCode}`
    const shareText = `Halo! Yuk gabung ke Grup Anti-Fraud ${groupName} di KENALI MODUS untuk saling pantau Safe Score dan melindungi keluarga dari penipuan digital: ${inviteLink}`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
    }
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2500)
  }

  const handleNudgeMember = (member) => {
    const nudgeMessage = `Halo ${member.name}! Di grup ${groupName} KENALI MODUS, Safe Score ${member.name} saat ini ${member.score}/100 dan masih rentan di modus "${member.weakCategory}". Yuk luangkan 2 menit coba simulasi challenge baru biar makin waspada: ${originUrl}/challenge?target=${member.id}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(nudgeMessage)}`

    // Increment nudge count
    const updated = members.map((m) =>
      m.id === member.id ? { ...m, nudgeCount: (m.nudgeCount || 0) + 1 } : m
    )
    saveMembersToStorage(updated)
    setNudgedMember(member.name)
    setTimeout(() => setNudgedMember(null), 3000)

    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank")
    }
  }

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newMemberName.trim()) return

    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      relation: newMemberRole,
      score: 50,
      status: "Belum Mengikuti Challenge",
      weakCategory: "Belum Terdata",
      lastActive: "Baru ditambahkan",
      avatarColor: "bg-slate-600",
      completedChallenges: 0,
      nudgeCount: 0,
      recommendation: "Ajak untuk pertama kali menyelesaikan 2-Minute Scam Challenge."
    }

    const updated = [...members, newMember]
    saveMembersToStorage(updated)
    setNewMemberName("")
    setShowAddModal(false)
  }

  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mobile-container px-5 pb-8 md:px-8">
        {/* Header Title */}
        <section className="mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-[#102a54] md:text-3xl">
              {groupName}
            </h1>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-black text-[#0876c9] hover:bg-blue-100 shrink-0"
            >
              <Icon name="UsersRound" size={14} />
              +
            </button>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 max-w-xl">
            Pantau Safe Score keluarga secara kolektif, ingatkan anggota yang masih rentan, dan bangun kebiasaan aman bersama.
          </p>
        </section>

        {/* Family Defense Index Banner */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-soft md:p-8">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            {/* Average Score Gauge */}
            <div className="flex flex-col items-center border-b border-slate-100 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Family Defense Index
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#102a54]">
                  {avgScore}
                </span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <div
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black ${defenseBadgeColor}`}
              >
                {defenseStatus}
              </div>
            </div>

            {/* Insight & Vulnerable Members Alert */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-[#102a54]">
                  Status Ketahanan Keluarga
                </h2>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {vulnerableCount > 0 ? (
                  <>
                    Terdapat <strong className="text-red-600 font-bold">{vulnerableCount} anggota keluarga</strong> yang skornya di bawah 65 dan membutuhkan latihan pengingat berkala.
                  </>
                ) : (
                  "Seluruh anggota keluarga telah memiliki Safe Score tinggi. Lakukan latihan rutin setiap minggu untuk menjaga refleks."
                )}
              </p>

              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  <Icon name="Copy" size={14} />
                  {copiedInvite ? "Link Undangan Disalin!" : "Bagikan Kode Grup"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Nudge Confirmation Toast */}
        {nudgedMember && (
          <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <Icon name="CheckCircle2" size={16} className="text-emerald-600" />
            Template pengingat WhatsApp untuk {nudgedMember} berhasil dibuka!
          </div>
        )}

        {/* Family Members List */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#102a54]">
              Anggota Keluarga ({members.length})
            </h2>
            <span className="text-xs text-slate-400">Urut berdasarkan skor</span>
          </div>

          <div className="mt-3 space-y-2">
            {members
              .sort((a, b) => b.score - a.score)
              .map((member, idx) => {
                const isVulnerable = member.score < 65

                return (
                  <div
                    key={member.id}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Left: Info */}
                    <div className="flex items-center gap-3">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                        idx === 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        #{idx + 1}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#102a54] truncate">
                            {member.name}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shrink-0">
                            {member.relation}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Rentan: <span className={isVulnerable ? "font-bold text-red-600" : "text-slate-600"}>{member.weakCategory}</span> · {member.completedChallenges}x challenge
                        </div>
                      </div>
                    </div>

                    {/* Right: Score & Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 border-t border-slate-100 sm:pt-0 sm:border-0">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-black text-[#102a54]">
                          {member.score}
                          <span className="text-xs font-normal text-slate-400">/100</span>
                        </span>
                        <span
                          className={`ml-2 text-[10px] font-bold uppercase sm:ml-0 sm:block ${
                            isVulnerable ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNudgeMember(member)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                          isVulnerable
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isVulnerable ? "Ingatkan WA" : "Tantang WA"}
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>

        {/* Continuous Loop Educational Banner */}
        <section className="mt-8 rounded-3xl gradient-brand p-6 text-white shadow-soft md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-200">
                Continuous Habit Loop
              </span>
              <h2 className="mt-1 text-xl font-black md:text-2xl">
                Modus Penipuan Terus Berevolusi di Dunia Nyata
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-blue-100">
                Satu kali tes tidak cukup. Penipu selalu menciptakan variasi skenario baru setiap minggu. Buat jadwal latihan rutin bersama keluarga agar refleks tetap terlatih.
              </p>
            </div>

            <Link
              href="/challenge"
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-xs font-black text-[#075da8] shadow-md hover:bg-slate-100"
            >
              <Icon name="RotateCcw" size={15} />
              Coba Skenario Adaptif Sekarang
            </Link>
          </div>
        </section>

        <BottomSpace />
      </main>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#102a54]">
                Tambah Anggota Keluarga
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Nama Anggota
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paman Budi, Nenek Ani..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-xs font-bold text-[#102a54] focus:border-[#0876c9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Hubungan / Peran
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-xs font-bold text-[#102a54] focus:border-[#0876c9] focus:outline-none"
                >
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Kakak/Adik">Kakak/Adik</option>
                  <option value="Pasangan">Pasangan</option>
                  <option value="Kerabat">Kerabat</option>
                  <option value="Teman/Rekan">Teman/Rekan</option>
                </select>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#0876c9] py-3 text-xs font-black text-white shadow-sm"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
