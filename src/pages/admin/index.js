import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import AppHeader from "../../components/AppHeader"
import BottomSpace from "../../components/BottomSpace"
import Icon from "../../components/Icon"

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // State Menu Navigasi Admin
  // "menu" = halaman beranda menu admin
  // "modus" | "soal" | "rewards" | "articles" | "settings"
  const [currentMenu, setCurrentMenu] = useState("menu")
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  // Data State dari Neon DB
  const [modusList, setModusList] = useState([])
  const [scenarioList, setScenarioList] = useState([])
  const [rewardList, setRewardList] = useState([])
  const [articleList, setArticleList] = useState([])
  const [settingsList, setSettingsList] = useState([])

  // Modal State
  const [showModal, setShowModal] = useState(false)

  // 1. Form Inputs: Modus
  const [modusForm, setModusForm] = useState({
    title: "",
    category: "Social Engineering",
    description: "",
    difficulty: "Sedang",
    redFlags: "",
    tips: ""
  })

  // 2. Form Inputs: Soal Skenario
  const [scenarioForm, setScenarioForm] = useState({
    title: "",
    modusType: "Phishing Link",
    sender: "Halo BCA CS",
    message: "",
    question: "Apa tindakan paling aman yang harus Anda ambil?",
    optionA: "Klik tautan untuk konfirmasi",
    optionB: "Abaikan dan hubungi Halo BCA resmi 1500888",
    correctOption: "B"
  })

  // 3. Form Inputs: Reward & Poin
  const [rewardForm, setRewardForm] = useState({
    title: "",
    category: "voucher",
    cost: 500,
    stock: 25,
    partner: "BCA",
    description: ""
  })

  // 4. Form Inputs: Artikel Edukasi & Poin
  const [articleForm, setArticleForm] = useState({
    title: "",
    contentType: "article",
    rewardPoints: 15,
    readingTime: "3 Menit",
    author: "Tim Edukasi Anti-Scam BCA",
    summary: "",
    fullContent: "",
    externalUrl: ""
  })

  // 5. Form Inputs: Pengaturan Poin Sistem
  const [editableSettings, setEditableSettings] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3000)
  }

  // Load Seluruh Data Admin dari Cloud Neon DB
  const fetchAllData = async () => {
    if (!session || session.user?.role !== "admin") return
    setLoading(true)
    try {
      const [resModus, resScen, resRew, resArt, resSet] = await Promise.all([
        fetch("/api/admin/manage?type=modus").then((r) => r.json()),
        fetch("/api/admin/manage?type=scenario").then((r) => r.json()),
        fetch("/api/admin/manage?type=reward").then((r) => r.json()),
        fetch("/api/admin/manage?type=article").then((r) => r.json()),
        fetch("/api/admin/manage?type=settings").then((r) => r.json())
      ])

      if (resModus.data) setModusList(resModus.data)
      if (resScen.data) setScenarioList(resScen.data)
      if (resRew.data) setRewardList(resRew.data)
      if (resArt.data) setArticleList(resArt.data)
      if (resSet.data) {
        setSettingsList(resSet.data)
        setEditableSettings(resSet.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchAllData()
    }
  }, [session])

  // Submit Modus
  const handleSubmitModus = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/manage?type=modus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: modusForm.title,
          category: modusForm.category,
          description: modusForm.description,
          difficulty: modusForm.difficulty,
          redFlags: modusForm.redFlags.split("\n").filter(Boolean),
          tips: modusForm.tips.split("\n").filter(Boolean)
        })
      })
      if (res.ok) {
        showToast("Modus baru berhasil disimpan ke Database!")
        setShowModal(false)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan modus")
    }
  }

  // Submit Soal
  const handleSubmitScenario = async (e) => {
    e.preventDefault()
    try {
      const options = [
        {
          label: "A",
          text: scenarioForm.optionA,
          isCorrect: scenarioForm.correctOption === "A",
          scoreImpact: scenarioForm.correctOption === "A" ? 20 : -10
        },
        {
          label: "B",
          text: scenarioForm.optionB,
          isCorrect: scenarioForm.correctOption === "B",
          scoreImpact: scenarioForm.correctOption === "B" ? 20 : -10
        }
      ]

      const res = await fetch("/api/admin/manage?type=scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: scenarioForm.title,
          modusType: scenarioForm.modusType,
          sender: scenarioForm.sender,
          message: scenarioForm.message,
          question: scenarioForm.question,
          options
        })
      })
      if (res.ok) {
        showToast("Soal Skenario berhasil ditambahkan!")
        setShowModal(false)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan skenario")
    }
  }

  // Submit Reward
  const handleSubmitReward = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/manage?type=reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rewardForm)
      })
      if (res.ok) {
        showToast("Katalog Reward berhasil ditambahkan!")
        setShowModal(false)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan reward")
    }
  }

  // Submit Artikel
  const handleSubmitArticle = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/manage?type=article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm)
      })
      if (res.ok) {
        showToast("Artikel & Nilai Poin Edukasi Berhasil Disimpan!")
        setShowModal(false)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan artikel")
    }
  }

  // Simpan Perubahan Setting Poin Global
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/manage?type=settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: editableSettings })
      })
      if (res.ok) {
        showToast("Konfigurasi Poin & Parameter Sistem Berhasil Diperbarui!")
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal memperbarui konfigurasi sistem")
    }
  }

  // Delete Handler
  const handleDelete = async (type, id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return
    try {
      const res = await fetch(`/api/admin/manage?type=${type}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        showToast("Data berhasil dihapus dari Neon DB")
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menghapus data")
    }
  }

  // Daftar Menu Utama di Halaman Admin dengan 3D Icon seperti di Halaman Utama
  const adminMenuItems = [
    {
      id: "modus",
      title: "Katalog Modus",
      desc: "Ensiklopedia modus & tips mitigasi",
      iconImg: "/3d-alert-icon.png",
      count: modusList.length,
      badge: "Katalog",
      badgeColor: "bg-blue-500"
    },
    {
      id: "soal",
      title: "Bank Soal Simulasi",
      desc: "Skenario chat, SMS & uji Safe Score",
      iconImg: "/3d-shield-icon.png",
      count: scenarioList.length,
      badge: "Simulasi",
      badgeColor: "bg-amber-500"
    },
    {
      id: "articles",
      title: "Artikel & Edukasi",
      desc: "Materi edukasi & reward poin baca",
      iconImg: "/3d-trophy-icon.png",
      count: articleList.length,
      badge: "Poin Edu",
      badgeColor: "bg-emerald-500"
    },
    {
      id: "rewards",
      title: "Katalog Rewards",
      desc: "Voucher e-wallet & harga poin",
      iconImg: "/3d-trophy-icon.png",
      count: rewardList.length,
      badge: "Poin Store",
      badgeColor: "bg-rose-500"
    },
    {
      id: "settings",
      title: "Aturan Poin Sistem",
      desc: "Parameter poin & keamanan akun",
      iconImg: "/3d-shield-icon.png",
      count: settingsList.length,
      badge: "Aturan",
      badgeColor: "bg-purple-500"
    },
    {
      id: "impact_nav",
      title: "Analitik Riset",
      desc: "Metrik behavioral impact & OJK",
      iconImg: "/3d-family-icon.png",
      href: "/admin/impact",
      badge: "Laporan",
      badgeColor: "bg-sky-500"
    }
  ]

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="font-bold">Memverifikasi Hak Akses Administrator...</p>
      </div>
    )
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff] flex flex-col justify-between p-6 text-slate-800">
        <AppHeader title="Akses Terbatas" subtitle="Sistem Keamanan BCA" />
        <div className="w-full max-w-md mx-auto my-auto glass-card rounded-[32px] p-8 text-center border border-white">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-200">
            <Icon name="ShieldAlert" size={32} />
          </div>
          <h2 className="text-xl font-black text-[#002554]">Bukan Akun Admin</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Halaman ini khusus untuk Administrator BCA #AwasModus. Silakan login menggunakan akun administrator Anda.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="w-full py-2.5 rounded-2xl bg-[#003882] text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              Login Akun Admin
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-2xl bg-white/50 text-slate-700 font-bold text-xs hover:bg-white transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
        <BottomSpace />
      </div>
    )
  }

  return (
    <div className="app-shell flex flex-col min-h-screen text-[#002554] bg-gradient-to-b from-[#0292fc] via-[#5bbdff] to-[#f4faff]">
      <Head>
        <title>Admin Control Center — Kenali Modus BCA</title>
      </Head>

      <div className="w-full flex-1 flex flex-col relative overflow-hidden pb-safe">
        <AppHeader
          title={currentMenu === "menu" ? "Admin Control Center" : adminMenuItems.find((m) => m.id === currentMenu)?.title || "Admin"}
          subtitle="Sistem Manajemen Konten Terpadu BCA"
          showBack={currentMenu !== "menu"}
          onBack={() => setCurrentMenu("menu")}
        />

        {/* BOTTOM SHEET / DESKTOP FULL CONTENT BODY */}
        <main className="flex-1 w-full bg-gradient-to-b from-[#f4faff] to-[#edf5fc] rounded-t-[36px] md:rounded-t-[44px] shadow-2xl pt-6 md:pt-8 pb-12 mt-2">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-6">

            {/* Toast Notifikasi */}
            {toastMsg && (
              <div className="fixed top-6 right-6 z-50 bg-[#002554] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-blue-400 animate-fade-in">
                <Icon name="CheckCircle" size={16} className="text-emerald-400" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* ==================================================== */}
            {/* TAMPILAN 1: GRID MENU UTAMA ADMIN */}
            {/* ==================================================== */}
            {currentMenu === "menu" && (
              <div className="space-y-6">
                {/* Banner Sambutan Admin */}
                <div className="glass-card rounded-[28px] p-6 border border-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>

                    <h1 className="text-xl sm:text-2xl font-black text-[#002554] tracking-tight">
                      Pusat Pengaturan Ekosistem
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      Kelola skenario simulasi, tipologi modus kejahatan, artikel edukasi berhadiah poin, dan parameter sistem dalam satu kendali.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/admin/impact"
                      className="px-4 py-2.5 rounded-2xl bg-[#003882] text-white font-bold text-xs hover:bg-[#002554] shadow-md flex items-center gap-2 transition active:scale-95"
                    >
                      <Icon name="TrendingUp" size={15} />
                      <span>Laporan Riset Impact</span>
                    </Link>
                  </div>
                </div>

                {/* Grid Menu Kotak-Kotak Tanpa Icon (Clean Minimalist Modern) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  {adminMenuItems.map((menu) => {
                    const CardInner = (
                      <div className="flex flex-col justify-between h-full p-4 sm:p-5 text-left">
                        <div>
                          {menu.badge && (
                            <div className="mb-3">
                              <span className={`inline-block text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-md shadow-2xs ${menu.badgeColor || "bg-[#0292fc]"}`}>
                                {menu.badge}
                              </span>
                            </div>
                          )}

                          <h3 className="text-sm font-black text-[#002554] leading-snug group-hover:text-[#0292fc] transition-colors">
                            {menu.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {menu.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 w-full border-t border-slate-100 flex items-center justify-start">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#0292fc] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                            {menu.count !== undefined ? `${menu.count} Data` : "Buka"}
                          </span>
                        </div>
                      </div>
                    )

                    if (menu.href) {
                      return (
                        <Link
                          key={menu.id}
                          href={menu.href}
                          className="glass-card rounded-[24px] border border-white hover:border-blue-200 shadow-soft hover:shadow-md transition active:scale-[0.98] group bg-white/70"
                        >
                          {CardInner}
                        </Link>
                      )
                    }

                    return (
                      <div
                        key={menu.id}
                        onClick={() => setCurrentMenu(menu.id)}
                        className="glass-card rounded-[24px] border border-white hover:border-blue-200 shadow-soft hover:shadow-md transition active:scale-[0.98] cursor-pointer group bg-white/70"
                      >
                        {CardInner}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU 1: KATALOG MODUS */}
            {/* ==================================================== */}
            {currentMenu === "modus" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-4 border border-white flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#002554]">Manajemen Katalog Modus</h2>
                    <p className="text-xs text-slate-500">Daftar tipologi penipuan yang muncul di halaman Katalog</p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-2xl bg-[#003882] text-white font-black text-xs shadow-sm cursor-pointer hover:bg-[#002b66] transition active:scale-95"
                  >
                    <span>Tambah Modus</span>
                  </button>
                </div>

                {modusList.length === 0 ? (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400">
                    Belum ada modus kustom. Silakan tambahkan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {modusList.map((item) => (
                      <div key={item.id} className="glass-card rounded-[22px] p-4 border border-white flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-[#0292fc]">
                            {item.category}
                          </span>
                          <h4 className="text-sm font-black text-[#002554] mt-1.5">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">ID #{item.id}</span>
                          <button
                            onClick={() => handleDelete("modus", item.id)}
                            className="text-rose-500 text-xs font-bold hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU 2: BANK SOAL SIMULASI */}
            {/* ==================================================== */}
            {currentMenu === "soal" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-4 border border-white flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#002554]">Manajemen Soal Skenario</h2>
                    <p className="text-xs text-slate-500">Studi kasus yang disajikan pada 2-Minute Challenge</p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-2xl bg-[#003882] text-white font-black text-xs shadow-sm cursor-pointer hover:bg-[#002b66] transition active:scale-95"
                  >
                    <span>Tambah Soal</span>
                  </button>
                </div>

                {scenarioList.length === 0 ? (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400">
                    Belum ada soal kustom. Silakan tambahkan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scenarioList.map((item) => (
                      <div key={item.id} className="glass-card rounded-[22px] p-4 border border-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                              {item.sender}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.modus_type}</span>
                          </div>
                          <h4 className="text-sm font-black text-[#002554] mt-1.5">{item.title}</h4>
                          <p className="text-xs italic bg-slate-50 p-2 rounded-xl mt-1 text-slate-600">
                            &quot;{item.message}&quot;
                          </p>
                          <p className="text-xs font-bold text-slate-700 mt-2">{item.question}</p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">ID #{item.id}</span>
                          <button
                            onClick={() => handleDelete("scenario", item.id)}
                            className="text-rose-500 text-xs font-bold hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU 3: ARTIKEL & REWARD POIN */}
            {/* ==================================================== */}
            {currentMenu === "articles" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-4 border border-white flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#002554]">Artikel Edukasi & Nilai Poin</h2>
                    <p className="text-xs text-slate-500">Tentukan artikel dan berapa reward poin yang didapat nasabah setelah membaca</p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-2xl bg-[#003882] text-white font-black text-xs shadow-sm cursor-pointer hover:bg-[#002b66] transition active:scale-95"
                  >
                    <span>Tambah Artikel</span>
                  </button>
                </div>

                {articleList.length === 0 ? (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400">
                    Belum ada artikel kustom. Silakan klik Tambah Artikel.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {articleList.map((item) => (
                      <div key={item.id} className="glass-card rounded-[22px] p-4 border border-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                              {item.reading_time || "3 Menit"}
                            </span>
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              +{item.reward_points} Poin
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-[#002554] mt-2">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.summary}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Penulis: {item.author}</p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">ID #{item.id}</span>
                          <button
                            onClick={() => handleDelete("article", item.id)}
                            className="text-rose-500 text-xs font-bold hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU 4: REWARDS & PENUKARAN */}
            {/* ==================================================== */}
            {currentMenu === "rewards" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-4 border border-white flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-[#002554]">Katalog Hadiah & Poin Penukaran</h2>
                    <p className="text-xs text-slate-500">Atur harga poin dan sisa stok voucher hadiah</p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-2xl bg-[#003882] text-white font-black text-xs shadow-sm cursor-pointer hover:bg-[#002b66] transition active:scale-95"
                  >
                    <span>Tambah Reward</span>
                  </button>
                </div>

                {rewardList.length === 0 ? (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400">
                    Belum ada reward kustom. Silakan tambahkan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rewardList.map((item) => (
                      <div key={item.id} className="glass-card rounded-[22px] p-4 border border-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              {item.partner}
                            </span>
                            <span className="text-xs font-black text-amber-600">
                              {item.cost} Poin
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-[#002554] mt-2">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">Stok: {item.stock} unit</p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">ID #{item.id}</span>
                          <button
                            onClick={() => handleDelete("reward", item.id)}
                            className="text-rose-500 text-xs font-bold hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU 5: ATURAN POIN & PENGATURAN SISTEM */}
            {/* ==================================================== */}
            {currentMenu === "settings" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-4 border border-white">
                  <h2 className="text-lg font-black text-[#002554]">Konfigurasi Aturan Poin & Keamanan</h2>
                  <p className="text-xs text-slate-500">Ubah nilai perolehan poin per aktivitas dan parameter perlindungan sistem</p>
                </div>

                <form onSubmit={handleSaveSettings} className="glass-card rounded-[28px] p-6 border border-white shadow-sm space-y-4">
                  <div className="space-y-4">
                    {editableSettings.map((item, idx) => (
                      <div key={item.setting_key} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="max-w-md">
                          <div className="text-xs font-black text-[#002554]">
                            {item.setting_key.replace(/_/g, " ").toUpperCase()}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            required
                            value={item.setting_value}
                            onChange={(e) => {
                              const updated = [...editableSettings]
                              updated[idx].setting_value = e.target.value
                              setEditableSettings(updated)
                            }}
                            className="w-24 p-2 text-center text-xs font-black rounded-xl border border-slate-300 bg-white focus:border-[#0292fc] focus:outline-hidden"
                          />
                          <span className="text-xs font-bold text-slate-400">
                            {item.setting_key.includes("duration") ? "Detik" : "Poin"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#003882] hover:bg-[#002554] text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
                    >
                      Simpan Seluruh Pengaturan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ==================================================== */}
            {/* MODAL FORM INPUT POPUP */}
            {/* ==================================================== */}
            {showModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-[32px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-black text-[#002554]">
                      {currentMenu === "modus" && "Formulir Modus Baru"}
                      {currentMenu === "soal" && "Formulir Soal Simulasi Baru"}
                      {currentMenu === "rewards" && "Formulir Reward Baru"}
                      {currentMenu === "articles" && "Formulir Artikel Edukasi Baru"}
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>

                  {/* FORM MODUS */}
                  {currentMenu === "modus" && (
                    <form onSubmit={handleSubmitModus} className="mt-4 space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700">Judul Modus</label>
                        <input
                          type="text"
                          required
                          value={modusForm.title}
                          onChange={(e) => setModusForm({ ...modusForm, title: e.target.value })}
                          placeholder="Contoh: Modus Quishing QRIS Palsu"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Kategori</label>
                        <select
                          value={modusForm.category}
                          onChange={(e) => setModusForm({ ...modusForm, category: e.target.value })}
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        >
                          <option value="Social Engineering">Social Engineering</option>
                          <option value="Phishing">Phishing & Malware</option>
                          <option value="APK Berbahaya">APK Berbahaya</option>
                          <option value="Quishing">QRIS / Quishing</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Deskripsi Kasus</label>
                        <textarea
                          required
                          rows={3}
                          value={modusForm.description}
                          onChange={(e) => setModusForm({ ...modusForm, description: e.target.value })}
                          placeholder="Jelaskan alur penipuan..."
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Poin Indikasi Bahaya (Pemisah baris)</label>
                        <textarea
                          rows={2}
                          value={modusForm.redFlags}
                          onChange={(e) => setModusForm({ ...modusForm, redFlags: e.target.value })}
                          placeholder="Nomor rekening tidak cocok&#10;Mendesak transfer"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Panduan Mitigasi (Pemisah baris)</label>
                        <textarea
                          rows={2}
                          value={modusForm.tips}
                          onChange={(e) => setModusForm({ ...modusForm, tips: e.target.value })}
                          placeholder="Hubungi Halo BCA 1500888&#10;Jangan bagikan OTP"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2"
                      >
                        Simpan Modus ke Cloud Neon
                      </button>
                    </form>
                  )}

                  {/* FORM SOAL */}
                  {currentMenu === "soal" && (
                    <form onSubmit={handleSubmitScenario} className="mt-4 space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700">Judul Kasus</label>
                        <input
                          type="text"
                          required
                          value={scenarioForm.title}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, title: e.target.value })}
                          placeholder="Contoh: Chat Undangan APK via WhatsApp"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700">Nama Pengirim</label>
                          <input
                            type="text"
                            value={scenarioForm.sender}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, sender: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700">Tipe Modus</label>
                          <input
                            type="text"
                            value={scenarioForm.modusType}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, modusType: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Isi Chat Tiruan</label>
                        <textarea
                          required
                          rows={2}
                          value={scenarioForm.message}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, message: e.target.value })}
                          placeholder="Mohon unduh lampiran undangan pernikahan surat.apk berikut..."
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Pertanyaan</label>
                        <input
                          type="text"
                          required
                          value={scenarioForm.question}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, question: e.target.value })}
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Pilihan A</label>
                        <input
                          type="text"
                          required
                          value={scenarioForm.optionA}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, optionA: e.target.value })}
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Pilihan B</label>
                        <input
                          type="text"
                          required
                          value={scenarioForm.optionB}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, optionB: e.target.value })}
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Kunci Jawaban Tepat</label>
                        <select
                          value={scenarioForm.correctOption}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, correctOption: e.target.value })}
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        >
                          <option value="A">Pilihan A</option>
                          <option value="B">Pilihan B</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2"
                      >
                        Simpan Soal ke Cloud Neon
                      </button>
                    </form>
                  )}

                  {/* FORM ARTIKEL */}
                  {currentMenu === "articles" && (
                    <form onSubmit={handleSubmitArticle} className="mt-4 space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700">Judul Artikel Edukasi</label>
                        <input
                          type="text"
                          required
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                          placeholder="Contoh: Mengapa Bank Tidak Pernah Meminta PIN & OTP"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700">Reward Poin Didapat</label>
                          <input
                            type="number"
                            required
                            value={articleForm.rewardPoints}
                            onChange={(e) => setArticleForm({ ...articleForm, rewardPoints: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700">Estimasi Baca</label>
                          <input
                            type="text"
                            value={articleForm.readingTime}
                            onChange={(e) => setArticleForm({ ...articleForm, readingTime: e.target.value })}
                            placeholder="Contoh: 3 Menit"
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Ringkasan / Sinopsis Singkat</label>
                        <textarea
                          required
                          rows={2}
                          value={articleForm.summary}
                          onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                          placeholder="Ringkasan poin penting..."
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Isi Lengkap Artikel (Opsional)</label>
                        <textarea
                          rows={4}
                          value={articleForm.fullContent}
                          onChange={(e) => setArticleForm({ ...articleForm, fullContent: e.target.value })}
                          placeholder="Isi materi edukasi..."
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Link Referensi Resmi / Video (Opsional)</label>
                        <input
                          type="url"
                          value={articleForm.externalUrl}
                          onChange={(e) => setArticleForm({ ...articleForm, externalUrl: e.target.value })}
                          placeholder="https://bca.co.id/awasmodus"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2"
                      >
                        Simpan Artikel & Atur Poin
                      </button>
                    </form>
                  )}

                  {/* FORM REWARD */}
                  {currentMenu === "rewards" && (
                    <form onSubmit={handleSubmitReward} className="mt-4 space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700">Nama Hadiah</label>
                        <input
                          type="text"
                          required
                          value={rewardForm.title}
                          onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                          placeholder="Contoh: Voucher Diskon Rp 50.000"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700">Harga Poin</label>
                          <input
                            type="number"
                            required
                            value={rewardForm.cost}
                            onChange={(e) => setRewardForm({ ...rewardForm, cost: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700">Stok</label>
                          <input
                            type="number"
                            required
                            value={rewardForm.stock}
                            onChange={(e) => setRewardForm({ ...rewardForm, stock: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Partner / Mitra</label>
                        <input
                          type="text"
                          value={rewardForm.partner}
                          onChange={(e) => setRewardForm({ ...rewardForm, partner: e.target.value })}
                          placeholder="BCA / Alfamart / Grab"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2"
                      >
                        Simpan Reward ke Cloud Neon
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
