import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import AppHeader from "../components/AppHeader"
import BottomNav from "../components/BottomNav"
import BottomSpace from "../components/BottomSpace"
import Icon from "../components/Icon"
import { isPresentationMode, DUMMY_PRESENTATION_DATA } from "../utils/presentationMode"

export default function KeluargaPage() {
  const { data: session } = useSession()
  const [members, setMembers] = useState([])
  const [groupName, setGroupName] = useState("Keluarga Sejahtera")
  const [inviteCode, setInviteCode] = useState("AMAN-778")
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [originUrl, setOriginUrl] = useState("https://kenalimodus.id")
  const [nudgedMember, setNudgedMember] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch live family data from database
  const fetchFamilyData = async () => {
    // Jika Mode Presentasi aktif, isi data simulasi grup keluarga
    if (isPresentationMode()) {
      setGroupName(DUMMY_PRESENTATION_DATA.familyGroupName)
      setMembers(DUMMY_PRESENTATION_DATA.familyMembers)
      setLoading(false)
      return
    }

    // Jika belum login, jangan fetch data grup dummy/default
    if (!session?.user?.id) {
      setMembers([])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/family?userId=${session.user.id}`)
      const json = await res.json()
      if (json.success && json.data) {
        if (json.data.group?.group_name) setGroupName(json.data.group.group_name)
        if (json.data.group?.invite_code) setInviteCode(json.data.group.invite_code)
        if (Array.isArray(json.data.members)) {
          setMembers(json.data.members)
        }
      }
    } catch (err) {
      console.error("Gagal load keluarga dari DB:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin)
    }
    fetchFamilyData()
  }, [session])

  const averageScore = members.length > 0
    ? Math.round(members.reduce((acc, curr) => acc + (curr.score || 0), 0) / members.length)
    : null

  const vulnerableCount = members.filter((m) => (m.score || 0) < 60).length

  const handleCopyInvite = () => {
    const text = `Halo! Yuk gabung ke perlindungan keamanan digital keluarga "${groupName}" di Kenali Modus: ${originUrl}/challenge`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
    setCopiedInvite(true)
    setTimeout(() => setCopiedInvite(false), 2500)
  }

  const handleNudge = (member) => {
    const text = `Halo ${member.name}, ayo luangkan 2 menit untuk ikut Scam Challenge di Kenali Modus agar terhindar dari modus penipuan online terbaru: ${originUrl}/challenge`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank")
    setNudgedMember(member.name)
    setTimeout(() => setNudgedMember(null), 3000)

    // Catat aksi nudge ke backend
    fetch("/api/family", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: member.id, action: "nudge" })
    }).catch((e) => console.log(e))
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">

        <AppHeader
          title="Grup Keluarga"
          subtitle="Bank BCA #AwasModus"
          showBack={true}
          backHref="/"

        />

        {/* HERO TOP SECTION: Clean, Visual, Balanced */}
        <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-2 pb-6 text-white">
          <div className="flex items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider text-sky-100 uppercase backdrop-blur-xs">
                {groupName}
              </span>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-none drop-shadow-sm">
                  {averageScore !== null ? averageScore : "-"}
                </span>
                <span className="text-base font-bold text-white/80">/100</span>
                {averageScore !== null ? (
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${averageScore >= 80
                    ? "bg-emerald-400/25 text-emerald-100 border border-emerald-300/40"
                    : averageScore >= 60
                      ? "bg-amber-400/25 text-amber-100 border border-amber-300/40"
                      : "bg-red-400/25 text-red-100 border border-red-300/40"
                    }`}>
                    {averageScore >= 80 ? "Sangat Aman" : averageScore >= 60 ? "Cukup Waspada" : "Butuh Edukasi"}
                  </span>
                ) : (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white/90 border border-white/30">
                    Belum Ada Data
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-sm leading-relaxed">
                {!session && !isPresentationMode() ? (
                  <>
                    <Link href="/auth/login" className="underline font-bold hover:text-white">
                      Login ke akun Anda
                    </Link>{" "}
                    untuk menghubungkan dan memantau perlindungan keluarga Anda.
                  </>
                ) : vulnerableCount > 0 ? (
                  `Ada ${vulnerableCount} anggota keluarga yang terdeteksi rentan penipuan online. Yuk ingatkan mereka!`
                ) : (
                  "Hebat! Seluruh anggota keluarga memiliki ketahanan refleks yang baik terhadap fraud."
                )}
              </p>

              {/* Quick Action Button: Hanya Undang Via Link */}
              <div className="flex items-center gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#003882] shadow-sm hover:bg-slate-50 transition active:scale-95 cursor-pointer"
                >
                  <Icon name="Share2" size={15} />
                  <span>{copiedInvite ? "Link Undangan Tersalin!" : "Undang Keluarga"}</span>
                </button>
              </div>
            </div>

            {/* 3D Visual Asset */}
            <div className="hidden sm:flex h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 items-center justify-center p-3 shadow-sm">
              <Image
                src="/3d-family-icon.png"
                alt="Family Protection"
                width={80}
                height={80}
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM SHEET: Pure White Curved Content Panel */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-5">

            {/* Toast Nudge Notification */}
            {nudgedMember && (
              <div className="rounded-2xl bg-emerald-500 text-white px-4 py-3 text-xs font-bold text-center shadow-md animate-in fade-in flex items-center justify-center gap-2">
                <Icon name="CheckCircle2" size={16} />
                <span>Pesan WhatsApp pengingat challenge siap dikirimkan ke {nudgedMember}!</span>
              </div>
            )}

            {/* Section Header with Quick Status Filter */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">

                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#002554]">
                  Anggota Keluarga ({members.length})
                </h2>
              </div>
            </div>

            {/* Responsive Family Members Grid */}
            {!session && !isPresentationMode() ? (
              <div className="glass-card rounded-[28px] p-8 border border-white text-center flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-50 text-[#003882] flex items-center justify-center mb-3">
                  <Icon name="UsersRound" size={32} />
                </div>
                <h3 className="text-base font-black text-[#002554]">
                  Grup Keluarga Belum Terhubung
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
                  Silakan login atau daftar akun untuk membentuk jaringan perlindungan keluarga, mengundang anggota, dan memantau kerentanan bersama.
                </p>
                <Link
                  href="/auth/login"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#0292fc] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#007ad6] transition active:scale-95"
                >
                  <Icon name="UserRound" size={16} />
                  <span>Masuk Akun Sekarang</span>
                </Link>
              </div>
            ) : members.length === 0 ? (
              <div className="glass-card rounded-[28px] p-8 border border-white text-center flex flex-col items-center justify-center">
                <p className="text-xs text-slate-500">
                  Belum ada anggota keluarga di grup ini. Gunakan tombol &quot;Undang Keluarga&quot; di atas untuk mulai melindungi kerabat Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {members.map((m) => {
                  const isVulnerable = (m.score || 0) < 60
                  const isModerate = (m.score || 0) >= 60 && (m.score || 0) < 80
                  const isStrong = (m.score || 0) >= 80

                  // Status Pill: Khusus yang Rentan (<60) diberi aksen merah halus agar jelas terlihat risikonya
                  const badgeStyle = isVulnerable
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : isStrong
                      ? "bg-blue-50 text-[#003882] border-blue-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"

                  return (
                    <div
                      key={m.id}
                      className="glass-card rounded-[24px] p-4.5 border border-white hover:border-blue-100 hover:shadow-xs transition duration-200 flex flex-col justify-between gap-3.5"
                    >
                      {/* Member Profile Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar: Bersih dan konsisten dengan aksen merah lembut jika rentan */}
                          <div className={`h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center font-black text-sm border ${isVulnerable
                            ? "bg-rose-50 border-rose-200 text-rose-600"
                            : "bg-blue-50 border-blue-100 text-[#003882]"
                            }`}>
                            {m.name.charAt(0)}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-[#002554]">
                                {m.name}
                              </span>
                              {m.id === "saya" && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#003882] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                                  Saya
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {m.relation} • Aktif: {m.lastActive}
                            </div>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className="text-right shrink-0">
                          <div className={`text-lg font-black leading-none ${isVulnerable ? "text-rose-600" : "text-[#002554]"}`}>
                            {m.score}
                            <span className="text-xs font-bold text-slate-400">/100</span>
                          </div>
                          <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                            {isStrong ? "Waspada" : isModerate ? "Cukup" : "Rentan"}
                          </span>
                        </div>
                      </div>

                      {/* Vulnerability & Progress Bar */}
                      <div className="rounded-2xl bg-slate-50/80 p-3 border border-slate-100">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Titik Rawan:</span>
                          <span className={`font-bold ${isVulnerable ? "text-rose-600" : "text-[#002554]"}`}>
                            {m.weakCategory || "Aman"}
                          </span>
                        </div>

                        {/* Mini Score Bar: Merah jika rentan (<60), Biru untuk yang aman */}
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isVulnerable ? "bg-rose-500" : "bg-[#003882]"}`}
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {m.completedChallenges || 0} Tantangan Selesai
                        </span>

                        {m.id !== "saya" ? (
                          <button
                            type="button"
                            onClick={() => handleNudge(m)}
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition active:scale-95 cursor-pointer border ${isVulnerable
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200"
                              : "bg-blue-50 text-[#003882] hover:bg-blue-100/80 border-blue-200/80"
                              }`}
                          >
                            <Icon name="Send" size={12} />
                            <span>Ingatkan</span>
                          </button>
                        ) : (
                          <Link
                            href="/challenge"
                            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 text-[#003882] hover:bg-blue-100/80 border border-blue-200/80 px-3.5 py-1.5 text-xs font-bold transition active:scale-95"
                          >
                            <span>Latihan</span>
                            <Icon name="ArrowRight" size={12} />
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tips Perlindungan Multi-Generasi */}
            <section className="glass-card rounded-[28px] p-5 border border-white mt-6">
              <div className="flex items-center gap-2 text-[#003882]">

                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                  Tips Melindungi Orang Tua & Keluarga
                </h3>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/80 p-3.5 border border-slate-100">
                  <div className="text-xs font-black text-[#002554]">1. Matikan Izin APK</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Bantu matikan pengaturan &quot;Install Unknown Apps&quot; di HP orang tua agar tidak sembarangan klik file .apk undangan/resi.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3.5 border border-slate-100">
                  <div className="text-xs font-black text-[#002554]">2. Beri Nomor Penting</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Simpan nomor resmi Halo BCA (1500888) di kontak telepon mereka dengan nama yang jelas agar tidak tertipu nomor penipu acak.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3.5 border border-slate-100">
                  <div className="text-xs font-black text-[#002554]">3. Diskusi Sebelum Transfer</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Ingatkan agar selalu menelpon Anda sebelum mentransfer uang ke rekening tak dikenal yang meminta tindakan darurat.
                  </p>
                </div>
              </div>
            </section>

            <BottomSpace />
          </div>
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>

        {/* MODAL: Tambah Anggota Keluarga */}
      </div>
    </div>
  )
}
