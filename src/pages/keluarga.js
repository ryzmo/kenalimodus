import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import { DEFAULT_FAMILY_MEMBERS } from "../data/modusData"

export default function KeluargaPage() {
  const [members, setMembers] = useState(DEFAULT_FAMILY_MEMBERS)
  const [groupName, setGroupName] = useState("Keluarga Sejahtera")
  const [inviteCode] = useState("AMAN-BCA-778")
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
                          : "Rentan (Perlu Edukasi)"
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

  const averageScore = Math.round(
    members.reduce((acc, curr) => acc + curr.score, 0) / members.length
  )

  const handleCopyInvite = () => {
    const text = `Yuk gabung ke grup perlindungan digital "${groupName}" di Kenali Modus BCA: ${originUrl}/keluarga?join=${inviteCode}`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2500)
  }

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newMemberName.trim()) return

    const newMember = {
      id: `fam-${Date.now()}`,
      name: newMemberName,
      relation: newMemberRole,
      age: 40,
      score: 50,
      status: "Rentan (Belum Tes)",
      lastChallenge: "Belum pernah",
      vulnerableTo: "Modus Belum Teridentifikasi",
      avatarBg: "bg-blue-100 text-blue-700"
    }

    const updated = [...members, newMember]
    setMembers(updated)
    setNewMemberName("")
    setShowAddModal(false)

    if (typeof window !== "undefined") {
      localStorage.setItem("kenali_family_group", JSON.stringify({ groupName, members: updated }))
    }
  }

  const handleNudge = (member) => {
    const text = `Halo ${member.name}, yuk ikuti 2-Minute Scam Challenge di Kenali Modus BCA untuk mengukur ketahanan keamanan perbankanmu: ${originUrl}/challenge`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank")
    setNudgedMember(member.name)
    setTimeout(() => setNudgedMember(null), 2500)
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        <AppHeader title="Grup Keluarga" subtitle="Perlindungan Multi-Generasi" />

        {/* Top Family Summary Header */}
        <section className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-1 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-sky-100">
                Skor Keamanan Rata-Rata
              </div>
              <div className="text-4xl font-black tracking-tight text-white mt-0.5">
                {averageScore} <span className="text-sm font-bold text-sky-200">/ 100</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-white/95">
                {groupName} • {members.length} Anggota Terdaftar
              </div>
            </div>

          </div>

          {/* Quick Actions in Header */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCopyInvite}
              className="flex-1 rounded-xl bg-white/25 backdrop-blur-md border border-white/40 py-2 text-xs font-bold text-white shadow-xs active:scale-95 transition"
            >
              {copiedInvite ? "Link Tersalin!" : "Undang Anggota"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#003882] shadow-xs active:scale-95 transition"
            >
              + Tambah
            </button>
          </div>
        </section>

        {/* BOTTOM SHEET: Member List & Vulnerability Cards */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10"><div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-5">

          {nudgedMember && (
            <div className="rounded-2xl bg-[#003882] text-white p-3 text-xs font-bold text-center animate-in fade-in">
              Pesan pengingat WhatsApp dikirimkan ke {nudgedMember}!
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#002554]">
              Status Ketahanan Anggota
            </span>

          </div>

          <div className="space-y-3">
            {members.map((m) => {
              const isVulnerable = m.score < 65
              return (
                <div
                  key={m.id}
                  className="glass-card rounded-[24px] p-4 flex flex-col justify-between border border-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#002554]">{m.name}</span>
                        <span className="rounded-md bg-blue-50 text-[#0292fc] px-2 py-0.5 text-[9px] font-bold">
                          {m.relation}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {m.vulnerableTo}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-[#002554] leading-none">
                        {m.score}
                        <span className="text-xs font-bold text-slate-400">/100</span>
                      </div>
                      <span
                        className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${m.score >= 80
                          ? "bg-emerald-50 text-emerald-600"
                          : m.score >= 60
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                          }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Tes: {m.lastChallenge}
                    </span>
                    {isVulnerable && m.id !== "saya" && (
                      <button
                        type="button"
                        onClick={() => handleNudge(m)}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
                      >
                        Ingatkan via WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <BottomSpace />
        </div>
        </main>

        <div className="md:hidden"><BottomNav /></div>

        {/* Modal Tambah Anggota */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-2xs animate-in fade-in">
            <div className="w-full max-w-xs rounded-[32px] bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-[#002554]">Tambah Anggota Keluarga</span>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-7 w-7 rounded-full bg-slate-100 text-xs font-bold text-slate-500"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMember} className="mt-3 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Nama</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Contoh: Kakek Budi"
                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0292fc]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Hubungan</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0292fc]"
                  >
                    <option value="Orang Tua">Orang Tua / Lansia</option>
                    <option value="Anak">Anak Remaja</option>
                    <option value="Pasangan">Pasangan</option>
                    <option value="Keluarga">Kerabat</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#0292fc] py-2 text-xs font-bold text-white shadow-xs"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
