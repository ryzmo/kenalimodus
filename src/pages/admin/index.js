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
  // "crawler" | "modus" | "soal" | "rewards" | "articles" | "settings"
  const [currentMenu, setCurrentMenu] = useState("menu")
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  // State Radar & Scraping Intelijen Siber
  const [scrapeCategory, setScrapeCategory] = useState("all")
  const [scrapePlatform, setScrapePlatform] = useState("all")
  const [customKeyword, setCustomKeyword] = useState("")
  const [scrapeLoading, setScrapeLoading] = useState(false)
  const [scrapeResults, setScrapeResults] = useState([])
  const [selectedScrapeItem, setSelectedScrapeItem] = useState(null)
  const [publishingAction, setPublishingAction] = useState(false)
  // Tracking item id mana yang sedang dalam proses aksi publikasi/simpan
  const [publishingItemId, setPublishingItemId] = useState(null)
  // Tracking case id yang statusnya sedang di-update
  const [updatingCaseId, setUpdatingCaseId] = useState(null)
  // Tracking id item yang sedang dihapus
  const [deletingItemId, setDeletingItemId] = useState(null)
  // Loading saat submit form modal
  const [modalSubmitting, setModalSubmitting] = useState(false)
  // Loading saat simpan pengaturan poin
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Data State dari Neon DB
  const [modusList, setModusList] = useState([])
  const [scenarioList, setScenarioList] = useState([])
  const [rewardList, setRewardList] = useState([])
  const [articleList, setArticleList] = useState([])
  const [settingsList, setSettingsList] = useState([])
  const [laporBarengList, setLaporBarengList] = useState([])
  const [caseRegistryList, setCaseRegistryList] = useState([])

  // Tracking Status Case State
  const [caseStatusFilter, setCaseStatusFilter] = useState("all")

  // Modal State & Edit Tracking State
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null) // ID item yang sedang diedit (null jika tambah baru)

  // 0. Form Inputs: Internal Lapor Bareng BCA
  const [laporForm, setLaporForm] = useState({
    title: "",
    modusCategory: "Impersonation (CS Palsu)",
    chronology: "",
    scammerPhone: "",
    scammerBankAccount: "",
    scammerBankName: "Bank Lain",
    estimatedLoss: 0,
    reporterName: "Satgas Anti-Scam BCA",
    reporterContact: "satgas@bca.co.id",
    status: "verified"
  })

  // 1. Form Inputs: Modus
  const [modusForm, setModusForm] = useState({
    title: "",
    category: "Social Engineering",
    description: "",
    difficulty: "Sedang",
    redFlags: "",
    tips: ""
  })

  // 2. Form Inputs: Soal Skenario (Pilihan Ganda 4 Opsi: A, B, C, D dengan Analisis Feedback Edukasi)
  const [scenarioForm, setScenarioForm] = useState({
    title: "",
    modusType: "Phishing Link",
    sender: "Halo BCA CS",
    message: "",
    question: "Apa tindakan paling aman yang harus Anda ambil?",
    optionA: "Abaikan pesan, jangan berikan kredensial/OTP, dan segera konfirmasi via Halo BCA 1500888.",
    feedbackA: "Tepat & Terlindungi (+20 Poin)! Tindakan verifikasi langsung melalui kontak resmi Halo BCA 1500888 berhasil mencegah pencurian data dan saldo rekening.",
    optionB: "Segera klik tautan atau unduh lampiran sesuai instruksi pengirim agar akun tidak diblokir.",
    feedbackB: "Sangat Berbahaya (-20 Poin)! Menekan tautan asing atau mengunduh lampiran akan mengaktifkan malware / situs phishing pencuri kredensial bank.",
    optionC: "Membalas pesan pengirim dan menanyakan apakah nomor tersebut resmi dari pihak BCA.",
    feedbackC: "Berisiko (-10 Poin)! Penipu akan menggunakan teknik manipulasi psikologis lebih lanjut untuk meyakinkan Anda bahwa mereka resmi.",
    optionD: "Meneruskan pesan beserta nomor pengirim ke grup keluarga tanpa memverifikasi kebenarannya.",
    feedbackD: "Kurang Tepat (-10 Poin)! Meneruskan pesan penipuan berisiko membuat anggota keluarga lain yang kurang waspada menjadi korban scam.",
    correctOption: "A"
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
      const [resModus, resScen, resRew, resArt, resSet, resLapor, resCases] = await Promise.all([
        fetch("/api/admin/manage?type=modus").then((r) => r.json()),
        fetch("/api/admin/manage?type=scenario").then((r) => r.json()),
        fetch("/api/admin/manage?type=reward").then((r) => r.json()),
        fetch("/api/admin/manage?type=article").then((r) => r.json()),
        fetch("/api/admin/manage?type=settings").then((r) => r.json()),
        fetch("/api/admin/manage?type=lapor_bareng").then((r) => r.json()),
        fetch("/api/admin/manage?type=cases").then((r) => r.json())
      ])

      if (resModus.data) setModusList(resModus.data)
      if (resScen.data) setScenarioList(resScen.data)
      if (resRew.data) setRewardList(resRew.data)
      if (resArt.data) setArticleList(resArt.data)
      if (resLapor.data) setLaporBarengList(resLapor.data)
      if (resCases.data) setCaseRegistryList(resCases.data)
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

  // Helper untuk membuka modal form tambah baru (reset state form & editingId)
  const handleOpenAddModal = (menuKey) => {
    setEditingId(null)
    if (menuKey === "modus") {
      setModusForm({
        title: "",
        category: "Social Engineering",
        description: "",
        difficulty: "Sedang",
        redFlags: "",
        tips: ""
      })
    } else if (menuKey === "soal") {
      setScenarioForm({
        title: "",
        modusType: "Phishing Link",
        sender: "Halo BCA CS",
        message: "",
        question: "Apa tindakan paling aman yang harus Anda ambil?",
        optionA: "Abaikan pesan, jangan berikan kredensial/OTP, dan segera konfirmasi via Halo BCA 1500888.",
        feedbackA: "Tepat & Terlindungi (+20 Poin)! Tindakan verifikasi langsung melalui kontak resmi Halo BCA 1500888 berhasil mencegah pencurian data dan saldo rekening.",
        optionB: "Segera klik tautan atau unduh lampiran sesuai instruksi pengirim agar akun tidak diblokir.",
        feedbackB: "Sangat Berbahaya (-20 Poin)! Menekan tautan asing atau mengunduh lampiran akan mengaktifkan malware / situs phishing pencuri kredensial bank.",
        optionC: "Membalas pesan pengirim dan menanyakan apakah nomor tersebut resmi dari pihak BCA.",
        feedbackC: "Berisiko (-10 Poin)! Penipu akan menggunakan teknik manipulasi psikologis lebih lanjut untuk meyakinkan Anda bahwa mereka resmi.",
        optionD: "Meneruskan pesan beserta nomor pengirim ke grup keluarga tanpa memverifikasi kebenarannya.",
        feedbackD: "Kurang Tepat (-10 Poin)! Meneruskan pesan penipuan berisiko membuat anggota keluarga lain yang kurang waspada menjadi korban scam.",
        correctOption: "A"
      })
    } else if (menuKey === "articles") {
      setArticleForm({
        title: "",
        contentType: "article",
        rewardPoints: 15,
        readingTime: "3 Menit",
        author: "Tim Edukasi Anti-Scam BCA",
        summary: "",
        fullContent: "",
        externalUrl: ""
      })
    } else if (menuKey === "rewards") {
      setRewardForm({
        title: "",
        category: "voucher",
        cost: 500,
        stock: 25,
        partner: "BCA",
        description: ""
      })
    }
    setShowModal(true)
  }

  // Helper untuk membuka modal edit pada Modus, Soal, dan Artikel
  const handleEditItem = (menuKey, item) => {
    setEditingId(item.id)
    if (menuKey === "modus") {
      setModusForm({
        title: item.title || "",
        category: item.category || "Social Engineering",
        description: item.description || "",
        difficulty: item.difficulty || "Sedang",
        redFlags: Array.isArray(item.red_flags) ? item.red_flags.join("\n") : (item.redFlags || ""),
        tips: Array.isArray(item.prevention_tips) ? item.prevention_tips.join("\n") : (item.tips || "")
      })
    } else if (menuKey === "soal") {
      const opts = item.options || []
      const optA = opts.find((o) => o.label === "A" || o.id === "a") || opts[0] || {}
      const optB = opts.find((o) => o.label === "B" || o.id === "b") || opts[1] || {}
      const optC = opts.find((o) => o.label === "C" || o.id === "c") || opts[2] || {}
      const optD = opts.find((o) => o.label === "D" || o.id === "d") || opts[3] || {}

      let detectedCorrect = "A"
      if (optB.isCorrect) detectedCorrect = "B"
      else if (optC.isCorrect) detectedCorrect = "C"
      else if (optD.isCorrect) detectedCorrect = "D"

      setScenarioForm({
        title: item.title || "",
        modusType: item.modus_type || "Umum",
        sender: item.sender || "Sistem BCA",
        message: item.message || "",
        question: item.question || "Apa tindakan paling aman yang harus Anda ambil?",
        optionA: optA.text || "",
        feedbackA: optA.feedbackReason || (optA.isCorrect ? "Tindakan mitigasi aman dan tepat (+20 Poin)." : "Pilihan ini berisiko dan berbahaya."),
        optionB: optB.text || "",
        feedbackB: optB.feedbackReason || (optB.isCorrect ? "Tindakan mitigasi aman dan tepat (+20 Poin)." : "Pilihan ini berisiko dan berbahaya."),
        optionC: optC.text || "Membalas dan meminta bukti surat resmi dari pengirim",
        feedbackC: optC.feedbackReason || "Berisiko (-10 Poin)! Penipu dapat memalsukan surat dan dokumen perbankan.",
        optionD: optD.text || "Meneruskan pesan ke kontak lain untuk menanyakan keabsahannya",
        feedbackD: optD.feedbackReason || "Kurang Tepat (-10 Poin)! Jangan menyebarkan informasi mencurigakan sebelum verifikasi resmi.",
        correctOption: detectedCorrect
      })
    } else if (menuKey === "articles") {
      setArticleForm({
        title: item.title || "",
        contentType: item.content_type || "article",
        rewardPoints: item.reward_points || 15,
        readingTime: item.reading_time || "3 Menit",
        author: item.author || "Tim Edukasi Anti-Scam BCA",
        summary: item.summary || "",
        fullContent: item.full_content || "",
        externalUrl: item.external_url || ""
      })
    }
    setShowModal(true)
  }

  // Submit Modus (Create / Update)
  const handleSubmitModus = async (e) => {
    e.preventDefault()
    setModalSubmitting(true)
    try {
      const payload = {
        title: modusForm.title,
        category: modusForm.category,
        description: modusForm.description,
        difficulty: modusForm.difficulty,
        redFlags: modusForm.redFlags.split("\n").filter(Boolean),
        tips: modusForm.tips.split("\n").filter(Boolean)
      }
      if (editingId) payload.id = editingId

      const res = await fetch("/api/admin/manage?type=modus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        showToast(editingId ? "Modus berhasil diperbarui!" : "Modus baru berhasil disimpan ke Database!")
        setShowModal(false)
        setEditingId(null)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan modus")
    } finally {
      setModalSubmitting(false)
    }
  }

  // Submit Soal (Create / Update - Selalu format pilihan ganda 4 opsi A, B, C, D lengkap dengan feedback alasan benar & salah)
  const handleSubmitScenario = async (e) => {
    e.preventDefault()
    setModalSubmitting(true)
    try {
      const correct = scenarioForm.correctOption || "A"

      const options = [
        {
          id: "a",
          label: "A",
          text: scenarioForm.optionA,
          isCorrect: correct === "A",
          isRisky: correct !== "A",
          scoreImpact: correct === "A" ? 20 : -20,
          feedbackReason: scenarioForm.feedbackA || (correct === "A" ? "Tepat & Aman (+20 Poin)! Verifikasi langsung adalah langkah mitigasi terbaik." : "Berbahaya (-20 Poin)! Pilihan ini berisiko membocorkan data.")
        },
        {
          id: "b",
          label: "B",
          text: scenarioForm.optionB,
          isCorrect: correct === "B",
          isRisky: correct !== "B",
          scoreImpact: correct === "B" ? 20 : -20,
          feedbackReason: scenarioForm.feedbackB || (correct === "B" ? "Tepat & Aman (+20 Poin)! Verifikasi langsung adalah langkah mitigasi terbaik." : "Berbahaya (-20 Poin)! Pilihan ini berisiko membocorkan data.")
        },
        {
          id: "c",
          label: "C",
          text: scenarioForm.optionC || "Membalas chat dan menanyakan keaslian pihak bank",
          isCorrect: correct === "C",
          isRisky: correct !== "C",
          scoreImpact: correct === "C" ? 20 : -10,
          feedbackReason: scenarioForm.feedbackC || (correct === "C" ? "Tepat & Aman (+20 Poin)! Verifikasi langsung adalah langkah mitigasi terbaik." : "Kurang Tepat (-10 Poin)! Berinteraksi dengan penipu memberi peluang manipulasi lebih lanjut.")
        },
        {
          id: "d",
          label: "D",
          text: scenarioForm.optionD || "Meneruskan pesan ke grup keluarga untuk menanyakan kabar",
          isCorrect: correct === "D",
          isRisky: correct !== "D",
          scoreImpact: correct === "D" ? 20 : -10,
          feedbackReason: scenarioForm.feedbackD || (correct === "D" ? "Tepat & Aman (+20 Poin)! Verifikasi langsung adalah langkah mitigasi terbaik." : "Kurang Tepat (-10 Poin)! Menyebarkan hoaks/link berisiko membahayakan anggota lain.")
        }
      ]

      const payload = {
        title: scenarioForm.title,
        modusType: scenarioForm.modusType,
        sender: scenarioForm.sender,
        message: scenarioForm.message,
        question: scenarioForm.question,
        options
      }
      if (editingId) payload.id = editingId

      const res = await fetch("/api/admin/manage?type=scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        showToast(editingId ? "Soal pilihan ganda (A, B, C, D) & analisis feedback berhasil diperbarui!" : "Soal Skenario 4 Opsi berhasil ditambahkan!")
        setShowModal(false)
        setEditingId(null)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan skenario")
    } finally {
      setModalSubmitting(false)
    }
  }

  // Submit Reward
  const handleSubmitReward = async (e) => {
    e.preventDefault()
    setModalSubmitting(true)
    try {
      const res = await fetch("/api/admin/manage?type=reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rewardForm)
      })
      if (res.ok) {
        showToast("Katalog Reward berhasil ditambahkan!")
        setShowModal(false)
        setEditingId(null)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan reward")
    } finally {
      setModalSubmitting(false)
    }
  }

  // Submit Artikel (Create / Update)
  const handleSubmitArticle = async (e) => {
    e.preventDefault()
    setModalSubmitting(true)
    try {
      const payload = { ...articleForm }
      if (editingId) payload.id = editingId

      const res = await fetch("/api/admin/manage?type=article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        showToast(editingId ? "Artikel edukasi berhasil diperbarui!" : "Artikel & Nilai Poin Edukasi Berhasil Disimpan!")
        setShowModal(false)
        setEditingId(null)
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan artikel")
    } finally {
      setModalSubmitting(false)
    }
  }

  // Submit Laporan Internal Lapor Bareng BCA
  const handleSubmitLaporBareng = async (e) => {
    e.preventDefault()
    setModalSubmitting(true)
    try {
      const res = await fetch("/api/admin/manage?type=lapor_bareng", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(laporForm)
      })
      if (res.ok) {
        showToast("Laporan Lapor Bareng BCA berhasil ditambahkan!")
        setShowModal(false)
        setLaporForm({
          title: "",
          modusCategory: "Impersonation (CS Palsu)",
          chronology: "",
          scammerPhone: "",
          scammerBankAccount: "",
          scammerBankName: "Bank Lain",
          estimatedLoss: 0,
          reporterName: "Satgas Anti-Scam BCA",
          reporterContact: "satgas@bca.co.id",
          status: "verified"
        })
        fetchAllData()
      }
    } catch (e) {
      showToast("Gagal menyimpan laporan internal Lapor Bareng")
    } finally {
      setModalSubmitting(false)
    }
  }

  // Simpan Perubahan Setting Poin Global
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSettingsSaving(true)
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
    } finally {
      setSettingsSaving(false)
    }
  }

  // Delete Handler
  const handleDelete = async (type, id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return
    setDeletingItemId(id)
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
    } finally {
      setDeletingItemId(null)
    }
  }

  // Fungsi Scraping Radar Modus Penipuan Siber
  const handleRunScrape = async (e) => {
    if (e) e.preventDefault()
    setScrapeLoading(true)
    setScrapeResults([])
    try {
      const res = await fetch("/api/admin/crawler?action=scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: scrapeCategory,
          platform: scrapePlatform,
          customKeyword
        })
      })
      const data = await res.json()
      if (data.success) {
        setScrapeResults(data.items || [])
        showToast(`Berhasil menemukan ${data.totalFound || 0} kasus intelijen siber!`)
      } else {
        showToast(data.message || "Gagal melakukan radar siber")
      }
    } catch (err) {
      showToast("Koneksi gagal saat melakukan scraping")
    } finally {
      setScrapeLoading(false)
    }
  }

  // Fungsi Publikasi Satu-Klik dari Hasil Scraping
  const handlePublishScrape = async (publishType, item) => {
    const actionKey = `${publishType}_${item.id || item.title}`
    setPublishingAction(true)
    setPublishingItemId(actionKey)
    try {
      let payload = {}
      if (publishType === "modus") {
        payload = {
          title: item.title,
          category: item.category,
          description: `Kasus terdeteksi via radar intelijen siber sumber ${item.source}. Dianalisis untuk proteksi nasabah.`,
          difficulty: "Tinggi",
          redFlags: item.redFlags,
          tips: item.preventionTips
        }
      } else if (publishType === "scenario") {
        payload = {
          title: item.scenarioDraft?.title || item.title,
          modusType: item.category,
          sender: item.scenarioDraft?.sender || "Pihak Mengaku Bank",
          message: item.scenarioDraft?.message || item.title,
          question: item.scenarioDraft?.question || "Bagaimana tindakan paling aman?",
          options: item.scenarioDraft?.options || []
        }
      } else if (publishType === "article") {
        payload = {
          title: item.articleDraft?.title || item.title,
          readingTime: item.articleDraft?.readingTime || "3 Menit",
          rewardPoints: item.articleDraft?.rewardPoints || 20,
          summary: item.articleDraft?.summary || item.title,
          fullContent: `${item.title}\n\nSumber Laporan: ${item.source}\nTautan Kasus: ${item.link}\n\nPanduan Mitigasi:\n${(item.preventionTips || []).map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
          author: item.articleDraft?.author || "Tim Riset Siber BCA #AwasModus"
        }
      } else if (publishType === "case_registry") {
        payload = {
          caseCode: item.case_code || `CASE-${Date.now().toString().slice(-6)}`,
          title: item.title,
          source: item.source,
          sourceUrl: item.link,
          category: item.category,
          isKnownInDb: item.isKnownInDb,
          noveltyType: item.noveltyType || "Varian Baru",
          noveltyNotes: item.noveltyNotes || "",
          chronology: item.chronology || item.title,
          redFlags: item.redFlags || [],
          preventionTips: item.preventionTips || [],
          status: item.targetStatus || "analisis",
          adminNotes: item.adminNotes || "Tersimpan via Radar Intelijen Siber"
        }
      }

      const res = await fetch("/api/admin/crawler?action=publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishType,
          payload,
          laporId: item.isLaporBareng ? item.laporId : null,
          caseId: item.isCaseRegistry ? item.id : null
        })
      })

      const result = await res.json()
      if (result.success) {
        showToast(result.message || "Berhasil dipublikasikan!")
        fetchAllData() // Refresh list di admin
      } else {
        showToast(result.message || "Gagal mempublikasikan")
      }
    } catch (err) {
      showToast("Terjadi kendala saat publikasi")
    } finally {
      setPublishingAction(false)
      setPublishingItemId(null)
    }
  }

  // Update Status Case di Registry
  const handleUpdateCaseStatus = async (id, newStatus, adminNotes) => {
    setUpdatingCaseId(id)
    try {
      const res = await fetch("/api/admin/manage?type=cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, adminNotes })
      })
      const result = await res.json()
      if (result.success) {
        showToast("Status kasus berhasil diperbarui!")
        fetchAllData()
      } else {
        showToast("Gagal memperbarui status kasus")
      }
    } catch (e) {
      showToast("Koneksi gagal")
    } finally {
      setUpdatingCaseId(null)
    }
  }

  // Daftar Menu Utama di Halaman Admin dengan 3D Icon seperti di Halaman Utama
  const adminMenuItems = [
    {
      id: "crawler",
      title: "Radar Scraping Siber",
      desc: "Scrape kasus modus & scam terbaru online",
      iconImg: "/3d-shield-icon.png",
      count: scrapeResults.length > 0 ? `${scrapeResults.length} Temuan` : "Siap Scrape",
      badge: "Intelijen AI",
      badgeColor: "bg-indigo-600"
    },
    {
      id: "cases_registry",
      title: "Investigasi Case Modus",
      desc: "Status kontrol & registry keunikan modus",
      iconImg: "/3d-shield-icon.png",
      count: caseRegistryList.length,
      badge: "Tracking Kasus",
      badgeColor: "bg-purple-600"
    },
    {
      id: "lapor_internal",
      title: "Lapor Bareng BCA",
      desc: "Input laporan aduan kasus & scam nasabah",
      iconImg: "/3d-alert-icon.png",
      count: laporBarengList.length,
      badge: "Internal BCA",
      badgeColor: "bg-cyan-600"
    },
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
    },
    {
      id: "challenge_impact_run",
      title: "Uji Challenge Impact",
      desc: "Simulasi Pre-Test & Post-Test Riset",
      iconImg: "/3d-shield-icon.png",
      href: "/challenge-impact",
      badge: "Riset Pre/Post",
      badgeColor: "bg-indigo-600"
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

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/challenge-impact"
                      className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md flex items-center gap-2 transition active:scale-95"
                    >
                      <Icon name="Target" size={15} />
                      <span>Uji Challenge Impact</span>
                    </Link>
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
            {/* SUBMENU 0: RADAR & SCRAPING INTELIJEN SIBER */}
            {/* ==================================================== */}
            {currentMenu === "crawler" && (
              <div className="space-y-5">
                {/* Header & Filter Card */}
                <div className="glass-card rounded-[28px] p-6 border border-white bg-white/95 shadow-sm space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      Auto-Intelligence Web Scraper
                    </span>
                    <h2 className="text-xl font-black text-[#002554] mt-2">
                      Radar Intelijen Kasus Modus Penipuan Online
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Scraping berita, rilis OJK, kepolisian, dan media siber untuk menjaring modus penipuan yang sudah ada maupun ragam modus baru yang belum dikenal masyarakat.
                    </p>
                  </div>

                  {/* Form Filter & Input Keyword */}
                  <form onSubmit={handleRunScrape} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Preset Kategori Modus
                        </label>
                        <select
                          value={scrapeCategory}
                          onChange={(e) => setScrapeCategory(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#0292fc]"
                        >
                          <option value="all">Semua Kategori (Global OJK & Siber)</option>
                          <option value="social_viral">Curhatan Korban Viral Medsos</option>
                          <option value="apk">File APK & Malware WhatsApp</option>
                          <option value="cs_palsu">CS Palsu & Social Engineering</option>
                          <option value="phishing">Link Phishing & Tarif Transfer</option>
                          <option value="qris">Manipulasi QRIS & Merchant</option>
                          <option value="loker">Loker Freelance & Like Video</option>
                          <option value="love_scam">Romance / Love Scam Kencan</option>
                          <option value="ai_deepfake">AI Voice Scam & Deepfake</option>
                          <option value="undian">Undian & Hadiah Palsu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Platform Sasaran Scraping
                        </label>
                        <select
                          value={scrapePlatform}
                          onChange={(e) => setScrapePlatform(e.target.value)}
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#0292fc]"
                        >
                          <option value="all">Multi-Platform & Portal Siber</option>
                          <option value="lapor_bareng">Lapor Bareng BCA (laporbareng.bca.co.id)</option>
                          <option value="twitter">X (Twitter) & Tweet Viral</option>
                          <option value="instagram">Instagram Post & Caption</option>
                          <option value="threads">Threads Curhatan Penipuan</option>
                          <option value="tiktok">TikTok & Video Modus</option>
                          <option value="telegram">Telegram & Chat WhatsApp</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Kata Kunci Spesifik (Opsional)
                        </label>
                        <input
                          type="text"
                          value={customKeyword}
                          onChange={(e) => setCustomKeyword(e.target.value)}
                          placeholder="Contoh: sniffing kartu, undangan apk..."
                          className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#0292fc]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {scrapeResults.length > 0 ? `Menampilkan ${scrapeResults.length} laporan hasil radar` : "Klik tombol untuk mulai mengumpulkan data internet"}
                      </span>
                      <button
                        type="submit"
                        disabled={scrapeLoading}
                        className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {scrapeLoading ? "Sedang Menelusuri Internet..." : "Jalankan Radar Scraping"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* State Loading */}
                {scrapeLoading && (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white space-y-3">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-indigo-900">
                      Sedang menjelajah kanal berita nasional & media siber...
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Sistem mengekstrak judul, menganalisis indikator bahaya (red flags), serta menyusun draf soal simulasi dan artikel secara otomatis.
                    </p>
                  </div>
                )}

                {/* Hasil Scraping */}
                {!scrapeLoading && scrapeResults.length === 0 && (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400 text-xs">
                    Belum ada data scraping aktif. Pilih kategori dan klik &quot;Jalankan Radar Scraping&quot; di atas.
                  </div>
                )}

                {!scrapeLoading && scrapeResults.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {scrapeResults.map((item, idx) => (
                      <div
                        key={item.id}
                        className="glass-card rounded-[24px] p-5 border border-white hover:border-indigo-200 bg-white shadow-xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          {/* Baris Status Analisis Keunikan & Timestamp Lengkap */}
                          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 border-b border-slate-100">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.noveltyBadgeColor || "bg-amber-50 text-amber-800 border-amber-200"}`}>
                              {item.noveltyType || (item.isKnownInDb ? "Sudah Dikenali di Database" : "Modus Unik & Baru")}
                            </span>
                            <span className="text-[10px] font-mono font-medium text-slate-500">
                              {item.fullTimestamp || "Realtime Radar"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {item.source}
                            </span>
                          </div>

                          <h3 className="text-sm font-black text-[#002554] leading-snug">
                            {item.title}
                          </h3>

                          {/* Catatan Keunikan / Hasil Analisis Database */}
                          {item.noveltyNotes && (
                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                              <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider mb-0.5">Analisis Deteksi Database:</span>
                              {item.noveltyNotes}
                            </div>
                          )}

                          {/* Jika bersumber dari Lapor Bareng BCA: Tampilkan Gambar Bukti & Narasi Resmi BCA */}
                          {item.isLaporBareng && (
                            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-900 tracking-wider">
                                <span>Platform: {item.targetPlatform || "BCA Media"}</span>
                                <span className="bg-amber-200/70 px-2 py-0.5 rounded-full text-amber-900">Resmi Lapor Bareng BCA</span>
                              </div>
                              {item.evidenceImage && (
                                <div className="rounded-xl overflow-hidden border border-amber-200/60 bg-white max-h-36 flex items-center justify-center">
                                  <img
                                    src={item.evidenceImage}
                                    alt={item.title}
                                    className="object-contain max-h-36 w-full"
                                  />
                                </div>
                              )}
                              <p className="text-[11px] text-slate-700 leading-relaxed line-clamp-3">
                                {item.chronology}
                              </p>
                            </div>
                          )}

                          {/* Red Flags / Ciri Bahaya Terdeteksi */}
                          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
                            <div className="text-[10px] font-black uppercase text-rose-600 tracking-wider">
                              Red Flags / Ciri Penipuan
                            </div>
                            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                              {(item.redFlags || []).slice(0, 2).map((rf, rIdx) => (
                                <li key={rIdx}>{rf}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Tips Mitigasi */}
                          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
                            <div className="text-[10px] font-black uppercase text-[#003882] tracking-wider">
                              Mitigasi & Solusi Aman
                            </div>
                            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                              {(item.preventionTips || []).slice(0, 2).map((tip, tIdx) => (
                                <li key={tIdx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Aksi Simpan ke Registry Kasus & Publikasi Cepat */}
                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-slate-400 hover:text-indigo-600 underline"
                            >
                              Buka Sumber Asli
                            </a>

                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("case_registry", item)}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-black text-[10px] shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                              title="Simpan ke Investigasi Case Modus untuk ditindaklanjuti"
                            >
                              {publishingItemId === `case_registry_${item.id || item.title}` ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Menyimpan Case...</span>
                                </>
                              ) : (
                                <span>+ Simpan ke Case Registry</span>
                              )}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 justify-end pt-1 border-t border-dashed border-slate-200">
                            <span className="text-[10px] text-slate-400 mr-auto font-medium">Publikasi Langsung:</span>
                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("modus", item)}
                              className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-[#003882] font-black text-[10px] border border-blue-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                              title="Masukkan ke Katalog Modus"
                            >
                              {publishingItemId === `modus_${item.id || item.title}` && (
                                <div className="w-2.5 h-2.5 border-2 border-[#003882] border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>+ Katalog</span>
                            </button>
                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("scenario", item)}
                              className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-800 font-black text-[10px] border border-amber-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                              title="Jadikan Soal Simulasi 2-Minute Test"
                            >
                              {publishingItemId === `scenario_${item.id || item.title}` && (
                                <div className="w-2.5 h-2.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>+ Soal Test</span>
                            </button>
                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("article", item)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 font-black text-[10px] border border-emerald-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                              title="Jadikan Artikel Edukasi Berhadiah Poin"
                            >
                              {publishingItemId === `article_${item.id || item.title}` && (
                                <div className="w-2.5 h-2.5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>+ Artikel Poin</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU: CASE REGISTRY & TRACKING INVESTIGASI MODUS */}
            {/* ==================================================== */}
            {currentMenu === "cases_registry" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-5 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 shadow-sm">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      Case Tracking & Intelligence Registry
                    </span>
                    <h2 className="text-lg font-black text-[#002554] mt-1.5">
                      Investigasi Case Modus
                    </h2>
                    <p className="text-xs text-slate-500">
                      Sistem kontrol status kasus, analisis pembeda/keunikan modus dari database, dan pencatatan audit timestamp lengkap.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Filter Status:</span>
                    <select
                      value={caseStatusFilter}
                      onChange={(e) => setCaseStatusFilter(e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 focus:outline-hidden"
                    >
                      <option value="all">Semua Status</option>
                      <option value="analisis">Sedang dalam Analisis</option>
                      <option value="investigasi">Dalam Investigasi</option>
                      <option value="terverifikasi">Terverifikasi Satgas</option>
                      <option value="terpublikasi">Sudah Terpublikasi</option>
                      <option value="diarsipkan">Diarsipkan</option>
                    </select>
                  </div>
                </div>

                {caseRegistryList.filter((c) => caseStatusFilter === "all" || c.status === caseStatusFilter).length === 0 ? (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400 text-xs">
                    Belum ada data kasus investigasi dengan filter ini. Simpan temuan baru melalui menu &quot;Radar Scraping Siber&quot;.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {caseRegistryList
                      .filter((c) => caseStatusFilter === "all" || c.status === caseStatusFilter)
                      .map((caseItem) => {
                        const statusColors = {
                          analisis: "bg-amber-100 text-amber-800 border-amber-200",
                          investigasi: "bg-blue-100 text-blue-800 border-blue-200",
                          terverifikasi: "bg-emerald-100 text-emerald-800 border-emerald-200",
                          terpublikasi: "bg-indigo-100 text-indigo-800 border-indigo-200",
                          diarsipkan: "bg-slate-100 text-slate-600 border-slate-200"
                        }
                        const formattedDate = caseItem.scraped_at
                          ? new Date(caseItem.scraped_at).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              timeZone: "Asia/Jakarta"
                            }) + " WIB"
                          : "-"

                        return (
                          <div
                            key={caseItem.id}
                            className="glass-card rounded-[24px] p-5 border border-white hover:border-purple-200 bg-white shadow-xs space-y-3.5 flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Header Kode Case, Status, & Timestamp */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                                    {caseItem.case_code || `CASE-${caseItem.id}`}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                                    {caseItem.category || "Modus Penipuan"}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                                  {formattedDate}
                                </span>
                              </div>

                              {/* Judul & Sumber */}
                              <div>
                                <h3 className="text-sm font-black text-[#002554] leading-snug">
                                  {caseItem.title}
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                  Sumber: {caseItem.source || "Laporan Siber"}
                                </p>
                              </div>

                              {/* Indikator Keunikan vs Database */}
                              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                    Status Keunikan Modus
                                  </span>
                                  <span
                                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                      caseItem.is_known_in_db
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-purple-50 text-purple-700 border-purple-200"
                                    }`}
                                  >
                                    {caseItem.novelty_type || (caseItem.is_known_in_db ? "Sudah Dikenali di Database" : "Modus Unik & Baru")}
                                  </span>
                                </div>
                                {caseItem.novelty_notes && (
                                  <p className="text-xs text-slate-700 leading-relaxed italic">
                                    &quot;{caseItem.novelty_notes}&quot;
                                  </p>
                                )}
                              </div>

                              {/* Status Distribusi / Sudah Masuk ke Ekosistem Mana Saja */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 mr-1">Telah Masuk ke:</span>
                                {caseItem.is_in_scenario ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                                    <Icon name="Check" size={10} /> Soal Test (PG)
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    Belum Soal
                                  </span>
                                )}

                                {caseItem.is_in_modus ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                                    <Icon name="Check" size={10} /> Katalog
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    Belum Katalog
                                  </span>
                                )}

                                {caseItem.is_in_article ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                                    <Icon name="Check" size={10} /> Artikel Edukasi
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    Belum Artikel
                                  </span>
                                )}
                              </div>

                              {/* Kronologi Singkat */}
                              {caseItem.chronology && (
                                <div className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                  {caseItem.chronology}
                                </div>
                              )}
                            </div>

                            {/* Kontrol Status & Aksi Publikasi */}
                            <div className="pt-3 border-t border-slate-100 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-bold text-slate-600">Status Investigasi:</span>
                                  {updatingCaseId === caseItem.id && (
                                    <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                  )}
                                </div>
                                <select
                                  disabled={updatingCaseId === caseItem.id}
                                  value={caseItem.status || "analisis"}
                                  onChange={(e) => handleUpdateCaseStatus(caseItem.id, e.target.value, caseItem.admin_notes)}
                                  className={`text-xs font-black px-2.5 py-1 rounded-xl border focus:outline-hidden disabled:opacity-50 cursor-pointer ${statusColors[caseItem.status] || statusColors.analisis}`}
                                >
                                  <option value="analisis">Sedang dalam Analisis</option>
                                  <option value="investigasi">Dalam Investigasi</option>
                                  <option value="terverifikasi">Terverifikasi Satgas</option>
                                  <option value="terpublikasi">Sudah Terpublikasi</option>
                                  <option value="diarsipkan">Diarsipkan</option>
                                </select>
                              </div>

                              {/* Aksi Konversi Cepat */}
                              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-dashed border-slate-200">
                                <span className="text-[10px] text-slate-400 font-medium">Konversi Cepat:</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={publishingAction}
                                    onClick={() => handlePublishScrape("modus", {
                                      id: caseItem.id,
                                      isCaseRegistry: true,
                                      title: caseItem.title,
                                      category: caseItem.category,
                                      chronology: caseItem.chronology,
                                      preventionTips: caseItem.prevention_tips || []
                                    })}
                                    className={`px-2 py-1 rounded-lg font-black text-[10px] border transition cursor-pointer flex items-center gap-1 ${
                                      caseItem.is_in_modus
                                        ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                                        : "bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-[#003882] border-blue-200"
                                    }`}
                                    title={caseItem.is_in_modus ? "Sudah masuk Katalog Modus" : "Masukkan ke Katalog Modus"}
                                  >
                                    {publishingItemId === `modus_${caseItem.id}` && (
                                      <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span>{caseItem.is_in_modus ? "✓ Katalog" : "+ Katalog"}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={publishingAction}
                                    onClick={() => handlePublishScrape("scenario", {
                                      id: caseItem.id,
                                      isCaseRegistry: true,
                                      title: caseItem.title,
                                      category: caseItem.category,
                                      scenarioDraft: {
                                        title: `Simulasi: ${caseItem.title.slice(0, 80)}`,
                                        sender: caseItem.source || "Indikasi Scammer",
                                        message: (caseItem.chronology || caseItem.title).slice(0, 180) + "...",
                                        question: "Apa tindakan mitigasi teraman saat menghadapi situasi ini?",
                                        options: [
                                          {
                                            id: "a",
                                            label: "A",
                                            text: (caseItem.prevention_tips && caseItem.prevention_tips[0])
                                              ? caseItem.prevention_tips[0]
                                              : "Abaikan pesan, jangan berikan kredensial/OTP, dan segera konfirmasi via Halo BCA 1500888.",
                                            isCorrect: true,
                                            isRisky: false,
                                            scoreImpact: 20,
                                            feedbackReason: "Tepat & Terlindungi (+20 Poin)! Tindakan verifikasi resmi melalui Halo BCA 1500888 atau memblokir kontak penipu berhasil menggagalkan pencurian dana nasabah."
                                          },
                                          {
                                            id: "b",
                                            label: "B",
                                            text: "Segera klik tautan, unduh lampiran, atau transfer sejumlah dana sesuai arahan pelaku.",
                                            isCorrect: false,
                                            isRisky: true,
                                            scoreImpact: -20,
                                            feedbackReason: "Bahaya & Berisiko Tinggi (-20 Poin)! Mengikuti perintah pelaku dapat membocorkan kredensial m-BCA, menyadap SMS OTP, dan mengakibatkan kerugian finansial."
                                          },
                                          {
                                            id: "c",
                                            label: "C",
                                            text: "Membalas pesan pengirim dan meminta nomor telepon alternatif lainnya.",
                                            isCorrect: false,
                                            isRisky: true,
                                            scoreImpact: -10,
                                            feedbackReason: "Kurang Tepat (-10 Poin)! Berkomunikasi lebih lanjut memberi celah bagi pelaku untuk melancarkan rekayasa sosial manipulatif."
                                          },
                                          {
                                            id: "d",
                                            label: "D",
                                            text: "Meneruskan pesan ke teman atau media sosial untuk mencari tahu kebenarannya.",
                                            isCorrect: false,
                                            isRisky: true,
                                            scoreImpact: -10,
                                            feedbackReason: "Kurang Tepat (-10 Poin)! Tautan atau APK berbahaya berpotensi diklik oleh orang lain jika disebarkan tanpa verifikasi resmi."
                                          }
                                        ]
                                      }
                                    })}
                                    className={`px-2 py-1 rounded-lg font-black text-[10px] border transition cursor-pointer flex items-center gap-1 ${
                                      caseItem.is_in_scenario
                                        ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
                                        : "bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-800 border-amber-200"
                                    }`}
                                    title={caseItem.is_in_scenario ? "Sudah masuk Soal Test PG" : "Jadikan Soal Test Pilihan Ganda"}
                                  >
                                    {publishingItemId === `scenario_${caseItem.id}` && (
                                      <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span>{caseItem.is_in_scenario ? "✓ Soal (PG)" : "+ Soal Test"}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={publishingAction}
                                    onClick={() => handlePublishScrape("article", {
                                      id: caseItem.id,
                                      isCaseRegistry: true,
                                      title: caseItem.title,
                                      articleDraft: {
                                        title: `Peringatan: ${caseItem.title.slice(0, 80)}`,
                                        readingTime: "3 Menit",
                                        rewardPoints: 20,
                                        summary: (caseItem.chronology || caseItem.title).slice(0, 150) + "...",
                                        author: "Satgas Investigasi Siber BCA"
                                      },
                                      source: caseItem.source,
                                      preventionTips: caseItem.prevention_tips || []
                                    })}
                                    className={`px-2 py-1 rounded-lg font-black text-[10px] border transition cursor-pointer flex items-center gap-1 ${
                                      caseItem.is_in_article
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                        : "bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 border-emerald-200"
                                    }`}
                                    title={caseItem.is_in_article ? "Sudah masuk Artikel Edukasi" : "Jadikan Artikel Edukasi Berhadiah Poin"}
                                  >
                                    {publishingItemId === `article_${caseItem.id}` && (
                                      <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span>{caseItem.is_in_article ? "✓ Artikel" : "+ Artikel"}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            )}

            {/* ==================================================== */}
            {/* SUBMENU: INTERNAL LAPOR BARENG BCA */}
            {/* ==================================================== */}
            {currentMenu === "lapor_internal" && (
              <div className="space-y-4">
                <div className="glass-card rounded-[24px] p-5 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 shadow-sm">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
                      Internal Satgas BCA #AwasModus
                    </span>
                    <h2 className="text-lg font-black text-[#002554] mt-1.5">
                      Bank Data Lapor Bareng BCA
                    </h2>
                    <p className="text-xs text-slate-500">
                      Entri dan kelola data aduan penipuan, akun palsu, serta nomor rekening/telepon penipu langsung dari tim internal untuk dikonversi menjadi modus & simulasi tes.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 rounded-2xl bg-[#003882] text-white font-black text-xs shadow-sm cursor-pointer hover:bg-[#002b66] transition active:scale-95 shrink-0"
                  >
                    <span>+ Input Aduan Lapor Bareng</span>
                  </button>
                </div>

                {laporBarengList.length === 0 ? (
                  <div className="glass-card rounded-[24px] p-8 text-center border border-white text-slate-400 text-xs">
                    Belum ada data aduan internal. Silakan klik &quot;+ Input Aduan Lapor Bareng&quot; untuk menambahkan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {laporBarengList.map((item) => (
                      <div
                        key={item.id}
                        className="glass-card rounded-[24px] p-5 border border-white hover:border-cyan-200 bg-white shadow-xs space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                              {item.modus_category || "Social Engineering"}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Pelapor: {item.reporter_name || "Internal BCA"}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-[#002554] leading-snug">
                            {item.title}
                          </h4>

                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Kronologi Kejadian
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                              &quot;{item.chronology}&quot;
                            </p>
                          </div>

                          {/* Data Finansial & Kontak Pelaku */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Kontak Pelaku:</span>
                              <span className="font-mono font-bold text-slate-800">{item.scammer_phone || "-"}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Rekening/Bank:</span>
                              <span className="font-mono font-bold text-slate-800">{item.scammer_bank_account || "-"} ({item.scammer_bank_name || "-"})</span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-amber-100/80 flex items-center justify-between">
                              <span className="text-slate-500 font-medium">Estimasi Kerugian:</span>
                              <span className="font-bold text-rose-600">Rp {Number(item.estimated_loss || 0).toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tombol Aksi Konversi Langsung */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            disabled={deletingItemId === item.id}
                            onClick={() => handleDelete("lapor_bareng", item.id)}
                            className="text-rose-500 text-xs font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            {deletingItemId === item.id && (
                              <div className="w-2.5 h-2.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            )}
                            <span>Hapus</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("modus", {
                                id: item.id,
                                title: item.title,
                                category: item.modus_category,
                                source: `Lapor Bareng BCA (${item.reporter_name})`,
                                redFlags: [
                                  `Nomor/Akun pelaku: ${item.scammer_phone || "-"}`,
                                  `Rekening tujuan: ${item.scammer_bank_account || "-"} (${item.scammer_bank_name})`,
                                  "Menggunakan teknik manipulasi psikologis kepanikan"
                                ],
                                preventionTips: [
                                  "Selalu verifikasi kontak melalui Halo BCA 1500888",
                                  "Jangan pernah transfer dana ke rekening perorangan yang tidak jelas"
                                ]
                              })}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-[#003882] font-black text-[10px] border border-blue-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                              title="Konversi ke Katalog Modus"
                            >
                              {publishingItemId === `modus_${item.id}` && (
                                <div className="w-2.5 h-2.5 border-2 border-[#003882] border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>+ Katalog</span>
                            </button>
                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("scenario", {
                                id: item.id,
                                title: item.title,
                                category: item.modus_category,
                                scenarioDraft: {
                                  title: `Simulasi Kasus: ${item.title.slice(0, 80)}`,
                                  sender: item.scammer_phone ? `Nomor Penipu (${item.scammer_phone})` : "Pihak Mengaku BCA",
                                  message: item.chronology.slice(0, 180) + "...",
                                  question: "Bagaimana cara menangkal modus ini?",
                                  options: [
                                    {
                                      id: "a",
                                      label: "A",
                                      text: "Tolak dan konfirmasi langsung ke cabang BCA terdekat atau Halo BCA 1500888.",
                                      isCorrect: true,
                                      isRisky: false,
                                      scoreImpact: 20,
                                      feedbackReason: "Tepat & Terlindungi (+20 Poin)! Verifikasi langsung adalah kunci utama mencegah pembobolan rekening."
                                    },
                                    {
                                      id: "b",
                                      label: "B",
                                      text: "Segera lakukan transfer sesuai instruksi agar transaksi tidak dibatalkan.",
                                      isCorrect: false,
                                      isRisky: true,
                                      scoreImpact: -20,
                                      feedbackReason: "Salah & Bahaya (-20 Poin)! Anda akan mengalami kerugian finansial karena mentransfer dana ke rekening penipu."
                                    },
                                    {
                                      id: "c",
                                      label: "C",
                                      text: "Menghubungi nomor telepon seluler pribadi yang dicantumkan pelaku.",
                                      isCorrect: false,
                                      isRisky: true,
                                      scoreImpact: -10,
                                      feedbackReason: "Kurang Tepat (-10 Poin)! Menghubungi nomor pelaku membuat Anda masuk dalam perangkap rekayasa sosial mereka."
                                    },
                                    {
                                      id: "d",
                                      label: "D",
                                      text: "Menyebarkan kabar transfer ini ke grup obrolan tanpa mengecek mutasi rekening.",
                                      isCorrect: false,
                                      isRisky: true,
                                      scoreImpact: -10,
                                      feedbackReason: "Kurang Tepat (-10 Poin)! Periksa rekening terlebih dahulu melalui aplikasi resmi m-BCA."
                                    }
                                  ]
                                }
                              })}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-800 font-black text-[10px] border border-amber-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                              title="Konversi ke Soal Test 2-Minute Challenge"
                            >
                              {publishingItemId === `scenario_${item.id}` && (
                                <div className="w-2.5 h-2.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>+ Soal Test</span>
                            </button>
                            <button
                              type="button"
                              disabled={publishingAction}
                              onClick={() => handlePublishScrape("article", {
                                id: item.id,
                                title: item.title,
                                articleDraft: {
                                  title: `Peringatan Kasus: ${item.title.slice(0, 80)}`,
                                  readingTime: "3 Menit",
                                  rewardPoints: 20,
                                  summary: `Kasus penipuan ${item.modus_category} dengan modus: ${item.chronology.slice(0, 150)}...`,
                                  author: "Satgas Lapor Bareng BCA"
                                },
                                source: "Internal Lapor Bareng BCA",
                                preventionTips: [
                                  "Hati-hati dengan rekening penampung penipuan",
                                  "Laporkan indikasi penipuan langsung ke laporbareng.bca.co.id"
                                ]
                              })}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-800 font-black text-[10px] border border-emerald-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                              title="Konversi ke Artikel Edukasi Berhadiah Poin"
                            >
                              {publishingItemId === `article_${item.id}` && (
                                <div className="w-2.5 h-2.5 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>+ Artikel Poin</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    onClick={() => handleOpenAddModal("modus")}
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
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditItem("modus", item)}
                              className="text-blue-600 text-xs font-bold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              disabled={deletingItemId === item.id}
                              onClick={() => handleDelete("modus", item.id)}
                              className="text-rose-500 text-xs font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                              {deletingItemId === item.id && (
                                <div className="w-2.5 h-2.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>Hapus</span>
                            </button>
                          </div>
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
                    <p className="text-xs text-slate-500">Studi kasus pilihan ganda yang disajikan pada 2-Minute Challenge</p>
                  </div>
                  <button
                    onClick={() => handleOpenAddModal("soal")}
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
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditItem("soal", item)}
                              className="text-amber-700 text-xs font-bold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              disabled={deletingItemId === item.id}
                              onClick={() => handleDelete("scenario", item.id)}
                              className="text-rose-500 text-xs font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                              {deletingItemId === item.id && (
                                <div className="w-2.5 h-2.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>Hapus</span>
                            </button>
                          </div>
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
                    onClick={() => handleOpenAddModal("articles")}
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
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditItem("articles", item)}
                              className="text-emerald-700 text-xs font-bold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              disabled={deletingItemId === item.id}
                              onClick={() => handleDelete("article", item.id)}
                              className="text-rose-500 text-xs font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                              {deletingItemId === item.id && (
                                <div className="w-2.5 h-2.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                              )}
                              <span>Hapus</span>
                            </button>
                          </div>
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
                    onClick={() => handleOpenAddModal("rewards")}
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
                            disabled={deletingItemId === item.id}
                            onClick={() => handleDelete("reward", item.id)}
                            className="text-rose-500 text-xs font-bold hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            {deletingItemId === item.id && (
                              <div className="w-2.5 h-2.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            )}
                            <span>Hapus</span>
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
                      disabled={settingsSaving}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#003882] hover:bg-[#002554] disabled:bg-[#003882]/60 text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {settingsSaving && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>{settingsSaving ? "Menyimpan Konfigurasi..." : "Simpan Seluruh Pengaturan"}</span>
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
                    <div>
                      <h2 className="text-base font-black text-[#002554]">
                        {currentMenu === "lapor_internal" && "Input Aduan Lapor Bareng BCA"}
                        {currentMenu === "modus" && (editingId ? "Edit Tipologi Modus" : "Formulir Modus Baru")}
                        {currentMenu === "soal" && (editingId ? "Edit Soal Simulasi (Pilihan Ganda)" : "Formulir Soal Simulasi Baru (Pilihan Ganda)")}
                        {currentMenu === "rewards" && "Formulir Reward Baru"}
                        {currentMenu === "articles" && (editingId ? "Edit Artikel Edukasi" : "Formulir Artikel Edukasi Baru")}
                      </h2>
                      {editingId && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mt-1 inline-block">
                          Mode Pembaruan Data (ID #{editingId})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowModal(false)
                        setEditingId(null)
                      }}
                      className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>

                  {/* FORM LAPOR BARENG BCA INTERNAL */}
                  {currentMenu === "lapor_internal" && (
                    <form onSubmit={handleSubmitLaporBareng} className="mt-4 space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700">Judul Kasus / Akun Palsu</label>
                        <input
                          type="text"
                          required
                          value={laporForm.title}
                          onChange={(e) => setLaporForm({ ...laporForm, title: e.target.value })}
                          placeholder="Contoh: Akun Instagram Palsu @halo_bca_official_promo"
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700">Kategori Penipuan</label>
                          <select
                            value={laporForm.modusCategory}
                            onChange={(e) => setLaporForm({ ...laporForm, modusCategory: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          >
                            <option value="Impersonation (CS Palsu)">Impersonation (CS Palsu)</option>
                            <option value="APK Berbahaya">APK Berbahaya</option>
                            <option value="QRIS Palsu">QRIS Palsu</option>
                            <option value="Phishing Website">Phishing Website / Webform</option>
                            <option value="Job Scam & Tugas Palsu">Job Scam & Tugas Palsu</option>
                            <option value="Romance Scam">Romance / Love Scam</option>
                            <option value="Social Engineering">Social Engineering Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-700">Estimasi Kerugian (Rp)</label>
                          <input
                            type="number"
                            value={laporForm.estimatedLoss}
                            onChange={(e) => setLaporForm({ ...laporForm, estimatedLoss: e.target.value })}
                            placeholder="0 jika belum ada kerugian"
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Kronologi / Modus Yang Terjadi</label>
                        <textarea
                          rows={3}
                          required
                          value={laporForm.chronology}
                          onChange={(e) => setLaporForm({ ...laporForm, chronology: e.target.value })}
                          placeholder="Uraikan alur pesan, tautan yang dikirim penipu, atau nomor kontak yang mencurigakan..."
                          className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700">No HP / Akun Pelaku</label>
                          <input
                            type="text"
                            value={laporForm.scammerPhone}
                            onChange={(e) => setLaporForm({ ...laporForm, scammerPhone: e.target.value })}
                            placeholder="+62812xxxx / @akun_scam"
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700">No Rekening / e-Wallet Pelaku</label>
                          <input
                            type="text"
                            value={laporForm.scammerBankAccount}
                            onChange={(e) => setLaporForm({ ...laporForm, scammerBankAccount: e.target.value })}
                            placeholder="1234567890 (Bank Lain)"
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700">Nama Petugas / Pelapor</label>
                          <input
                            type="text"
                            value={laporForm.reporterName}
                            onChange={(e) => setLaporForm({ ...laporForm, reporterName: e.target.value })}
                            placeholder="Satgas Anti-Scam BCA"
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700">Status Validasi</label>
                          <select
                            value={laporForm.status}
                            onChange={(e) => setLaporForm({ ...laporForm, status: e.target.value })}
                            className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 font-semibold"
                          >
                            <option value="verified">Terverifikasi (Valid)</option>
                            <option value="pending">Menunggu Penyelidikan</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={modalSubmitting}
                        className="w-full py-3 rounded-2xl bg-[#003882] text-white font-black shadow-md cursor-pointer mt-2 hover:bg-[#002554] disabled:bg-[#003882]/60 transition flex items-center justify-center gap-2"
                      >
                        {modalSubmitting && (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{modalSubmitting ? "Menyimpan Aduan..." : "Simpan ke Database Lapor Bareng BCA"}</span>
                      </button>
                    </form>
                  )}

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
                        disabled={modalSubmitting}
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2 disabled:bg-[#0292fc]/60 flex items-center justify-center gap-2"
                      >
                        {modalSubmitting && (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{modalSubmitting ? "Menyimpan Modus..." : "Simpan Modus ke Cloud Neon"}</span>
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
                      <div className="space-y-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-800">Opsi Pilihan A</label>
                            <span className="text-[10px] text-slate-400 font-semibold">Teks Jawaban Pilihan A</span>
                          </div>
                          <input
                            type="text"
                            required
                            value={scenarioForm.optionA}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, optionA: e.target.value })}
                            placeholder="Teks pilihan A..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                          />
                          <label className="block text-[11px] font-bold text-slate-600 mt-2 mb-1">
                            Alasan & Feedback Edukasi Pilihan A (Analisis Mengapa Benar/Salah)
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={scenarioForm.feedbackA}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, feedbackA: e.target.value })}
                            placeholder="Uraikan mengapa pilihan A benar atau salah serta dampaknya..."
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-normal"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-800">Opsi Pilihan B</label>
                            <span className="text-[10px] text-slate-400 font-semibold">Teks Jawaban Pilihan B</span>
                          </div>
                          <input
                            type="text"
                            required
                            value={scenarioForm.optionB}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, optionB: e.target.value })}
                            placeholder="Teks pilihan B..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                          />
                          <label className="block text-[11px] font-bold text-slate-600 mt-2 mb-1">
                            Alasan & Feedback Edukasi Pilihan B (Analisis Mengapa Benar/Salah)
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={scenarioForm.feedbackB}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, feedbackB: e.target.value })}
                            placeholder="Uraikan mengapa pilihan B benar atau salah serta dampaknya..."
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-normal"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-800">Opsi Pilihan C</label>
                            <span className="text-[10px] text-slate-400 font-semibold">Teks Jawaban Pilihan C</span>
                          </div>
                          <input
                            type="text"
                            required
                            value={scenarioForm.optionC}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, optionC: e.target.value })}
                            placeholder="Teks pilihan C..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                          />
                          <label className="block text-[11px] font-bold text-slate-600 mt-2 mb-1">
                            Alasan & Feedback Edukasi Pilihan C (Analisis Mengapa Benar/Salah)
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={scenarioForm.feedbackC}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, feedbackC: e.target.value })}
                            placeholder="Uraikan mengapa pilihan C benar atau salah serta dampaknya..."
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-normal"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-800">Opsi Pilihan D</label>
                            <span className="text-[10px] text-slate-400 font-semibold">Teks Jawaban Pilihan D</span>
                          </div>
                          <input
                            type="text"
                            required
                            value={scenarioForm.optionD}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, optionD: e.target.value })}
                            placeholder="Teks pilihan D..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold"
                          />
                          <label className="block text-[11px] font-bold text-slate-600 mt-2 mb-1">
                            Alasan & Feedback Edukasi Pilihan D (Analisis Mengapa Benar/Salah)
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={scenarioForm.feedbackD}
                            onChange={(e) => setScenarioForm({ ...scenarioForm, feedbackD: e.target.value })}
                            placeholder="Uraikan mengapa pilihan D benar atau salah serta dampaknya..."
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-normal"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                        <div>
                          <label className="font-black text-emerald-900 block">Kunci Jawaban Yang Benar (Aman)</label>
                          <span className="text-[11px] text-emerald-700">Pilihan ini akan mendapat +20 Poin, sedangkan opsi lainnya dianggap berisiko</span>
                        </div>
                        <select
                          value={scenarioForm.correctOption}
                          onChange={(e) => setScenarioForm({ ...scenarioForm, correctOption: e.target.value })}
                          className="p-2 px-3 rounded-xl border border-emerald-300 bg-white font-black text-xs text-emerald-900 focus:outline-hidden"
                        >
                          <option value="A">Jawaban Benar: Pilihan A</option>
                          <option value="B">Jawaban Benar: Pilihan B</option>
                          <option value="C">Jawaban Benar: Pilihan C</option>
                          <option value="D">Jawaban Benar: Pilihan D</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={modalSubmitting}
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2 disabled:bg-[#0292fc]/60 flex items-center justify-center gap-2"
                      >
                        {modalSubmitting && (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{modalSubmitting ? "Menyimpan Soal..." : "Simpan Soal ke Cloud Neon"}</span>
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
                        disabled={modalSubmitting}
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2 disabled:bg-[#0292fc]/60 flex items-center justify-center gap-2"
                      >
                        {modalSubmitting && (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{modalSubmitting ? "Menyimpan Artikel..." : "Simpan Artikel & Atur Poin"}</span>
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
                        disabled={modalSubmitting}
                        className="w-full py-3 rounded-2xl bg-[#0292fc] text-white font-black shadow-md cursor-pointer mt-2 disabled:bg-[#0292fc]/60 flex items-center justify-center gap-2"
                      >
                        {modalSubmitting && (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        <span>{modalSubmitting ? "Menyimpan Reward..." : "Simpan Reward ke Cloud Neon"}</span>
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
