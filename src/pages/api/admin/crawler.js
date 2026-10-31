import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { getDb, initDbSchema } from "../../../lib/db"

// Daftar platform sumber scraping siber
const PLATFORM_SOURCES = [
  { id: "all", label: "Multi-Platform & Berita Nasional", queryModifier: "" },
  { id: "lapor_bareng", label: "Lapor Bareng BCA (Galeri Akun & Modus Palsu)", queryModifier: "" },
  { id: "twitter", label: "X / Twitter", queryModifier: " (site:x.com OR site:twitter.com OR \"di Twitter\" OR \"di X\")" },
  { id: "instagram", label: "Instagram", queryModifier: " (site:instagram.com OR \"di Instagram\" OR \"akun IG penipu\")" },
  { id: "threads", label: "Threads", queryModifier: " (\"di Threads\" OR site:threads.net OR \"modus threads\")" },
  { id: "tiktok", label: "TikTok", queryModifier: " (\"di TikTok\" OR site:tiktok.com OR \"konten tiktok penipuan\")" },
  { id: "telegram", label: "Telegram & WhatsApp", queryModifier: " (\"grup telegram\" OR \"chat whatsapp penipuan\" OR \"bot telegram\")" }
]

// Daftar preset query scraping cerdas untuk deteksi ragam modus scam/fraud terbaru
const SCRAPE_QUERIES = [
  { id: "all", label: "Semua Kategori (Global)", query: "penipuan online modus rekening bank ojk" },
  { id: "social_viral", label: "Viral Medsos (Curhatan Korban)", query: "viral penipuan scam modus korban saldo rekening ludes" },
  { id: "apk", label: "Modus File APK & Malware", query: "modus penipuan apk whatsapp perbankan" },
  { id: "cs_palsu", label: "CS Palsu & Social Engineering", query: "penipuan customer service bca bank telepon wa" },
  { id: "phishing", label: "Web Phishing & Link Palsu", query: "modus link phishing tarif transfer bank" },
  { id: "qris", label: "Manipulasi QRIS & Merchant", query: "modus penipuan qris palsu barcode rekening" },
  { id: "loker", label: "Loker Palsu & Like Subscribe", query: "penipuan loker freelance like video transfer deposit" },
  { id: "ai_deepfake", label: "Voice Phishing & AI Deepfake", query: "penipuan deepfake ai suara telepon video call bank" },
  { id: "love_scam", label: "Romance / Love Scam", query: "modus love scam kencan online pinjam uang transfer" },
  { id: "undian", label: "Undian Palsu & Phishing Pajak", query: "modus hadiah undian bca palsu menang kupon" }
]

function determineCategory(title) {
  const lower = title.toLowerCase()
  if (lower.includes("apk") || lower.includes("undangan") || lower.includes("kurir") || lower.includes("surat tilang")) {
    return "APK Berbahaya"
  }
  if (lower.includes("voice") || lower.includes("telepon") || lower.includes("cs") || lower.includes("halo") || lower.includes("petugas")) {
    return "Impersonation (CS Palsu)"
  }
  if (lower.includes("qris") || lower.includes("barcode") || lower.includes("merchant") || lower.includes("toko")) {
    return "QRIS Palsu"
  }
  if (lower.includes("loker") || lower.includes("tugas") || lower.includes("freelance") || lower.includes("like")) {
    return "Job Scam & Tugas Palsu"
  }
  if (lower.includes("deepfake") || lower.includes("ai") || lower.includes("tiruan") || lower.includes("kloning")) {
    return "AI Deepfake & Voice Scam"
  }
  if (lower.includes("phishing") || lower.includes("link") || lower.includes("tarif") || lower.includes("website")) {
    return "Phishing Website"
  }
  if (lower.includes("salah transfer") || lower.includes("rekening") || lower.includes("pinjol")) {
    return "Salah Transfer & Pinjol Ilegal"
  }
  return "Social Engineering"
}

function generateAnalysis(title, category, source) {
  let redFlags = []
  let tips = []
  let scenarioDraft = {}
  let articleDraft = {}

  if (category === "APK Berbahaya") {
    redFlags = [
      "Pelaku mengirim file dengan ekstensi .APK bukan dokumen PDF gambar asli",
      "Meminta izin akses SMS (READ_SMS) dan Accessibility Service pada ponsel",
      "Nomor pengirim tidak dikenal dan mengaku sebagai kurir paket atau instansi resmi"
    ]
    tips = [
      "Haram mengklik dan menginstal file .APK dari pengirim yang tidak dikenal",
      "Periksa permission aplikasi secara ketat di pengaturan smartphone",
      "Gunakan Google Play Protect dan aktifkan proteksi instalasi sumber luar"
    ]
    scenarioDraft = {
      title: `Simulasi Waspada: ${title.slice(0, 80)}`,
      modusType: "APK Berbahaya",
      sender: "Kurir Ekspedisi / WhatsApp Tidak Dikenal",
      message: "Paket Anda tertahan di gudang pusat. Mohon buka file detail resi berikut: LIHAT_PAKET.apk",
      question: "Apa tindakan paling tepat dan aman saat menerima pesan tersebut?",
      options: [
        {
          id: "a",
          label: "A",
          text: "Langsung blokir nomor dan laporkan pesan sebagai spam tanpa mengunduh file.",
          isCorrect: true,
          scoreImpact: 20,
          feedbackReason: "Tepat! File .APK dari sumber asing berisiko tinggi mencuri SMS OTP dan menguras saldo bank Anda."
        },
        {
          id: "b",
          label: "B",
          text: "Unduh file tersebut untuk mengecek apakah resi paket benar atas nama kita.",
          isCorrect: false,
          isRisky: true,
          scoreImpact: -20,
          feedbackReason: "Sangat Berbahaya! Mengunduh APK memungkinkan malware otomatis menyadap ponsel Anda."
        }
      ]
    }
    articleDraft = {
      title: `Waspada Modus Baru: ${title.slice(0, 90)}`,
      readingTime: "3 Menit",
      rewardPoints: 20,
      summary: `Masyarakat diimbau ekstra waspada terhadap fenomena baru pencurian data melalui manipulasi file APK. Laporan dari ${source || "Media Siber"} menunjukkan peningkatan kasus serupa.`,
      author: "Tim Riset Siber BCA #AwasModus"
    }
  } else if (category === "Impersonation (CS Palsu)") {
    redFlags = [
      "Menghubungi nasabah melalui nomor seluler biasa / WhatsApp tanpa centang hijau resmi",
      "Menawarkan pembatalan kenaikan tarif transfer atau meminta aktivasi ulang akun",
      "Meminta data rahasia seperti nomor kartu ATM, CVV, OTP, atau PIN m-BCA"
    ]
    tips = [
      "Ingat selalu CS resmi BCA hanya Halo BCA 1500888 atau via aplikasi haloBCA gratis",
      "Pihak bank tidak pernah meminta Kode OTP, PIN, dan kode CVV untuk alasan apapun",
      "Abaikan panggilan dari nomor yang diawali kode luar negeri atau nomor ponsel GSM biasa"
    ]
    scenarioDraft = {
      title: `Simulasi Waspada: ${title.slice(0, 80)}`,
      modusType: "Impersonation (CS Palsu)",
      sender: "Halo BCA Palsu (+62812xxxx)",
      message: "Pemberitahuan perubahan tarif transfer BCA menjadi Rp 150.000/bulan. Ketik 'BATAL' dan klik link verifikasi ini jika ingin membatalkan.",
      question: "Langkah terbaik apa yang wajib Anda ambil?",
      options: [
        {
          id: "a",
          label: "A",
          text: "Abaikan dan verifikasi langsung via aplikasi resmi haloBCA atau telepon 1500888.",
          isCorrect: true,
          scoreImpact: 20,
          feedbackReason: "Benar sekali! BCA tidak pernah menaikkan tarif transfer secara mendadak melalui chat WhatsApp non-resmi."
        },
        {
          id: "b",
          label: "B",
          text: "Segera klik link pembatalan karena khawatir saldo terpotong setiap bulan.",
          isCorrect: false,
          isRisky: true,
          scoreImpact: -20,
          feedbackReason: "Salah! Link tersebut adalah situs phishing yang dirancang untuk menguras kredensial perbankan Anda."
        }
      ]
    }
    articleDraft = {
      title: `Edukasi Mitigasi: ${title.slice(0, 90)}`,
      readingTime: "4 Menit",
      rewardPoints: 25,
      summary: `Kenali ciri-ciri penipuan mengatasnamakan Customer Service bank resmi. Berdasarkan temuan ${source || "media siber nasional"}, nasabah kerap terpancing kepanikan palsu.`,
      author: "Pusat Literasi Keamanan Nasabah"
    }
  } else if (category === "QRIS Palsu") {
    redFlags = [
      "Stiker QRIS tempelan mencurigakan yang menutupi barcode asli merchant",
      "Nama penerima pada konfirmasi bayar berbeda jauh dengan nama toko/usaha",
      "Meminta transfer tambahan dengan alasan deposit atau verifikasi merchant"
    ]
    tips = [
      "Selalu verifikasi dan tanyakan nama merchant yang tertera sebelum memasukkan PIN",
      "Raba stiker QRIS untuk memastikan tidak ada tempelan ganda di atas QR code asli",
      "Gunakan fitur notifikasi realtime pada aplikasi m-BCA untuk memantau mutasi"
    ]
    scenarioDraft = {
      title: `Simulasi Waspada: ${title.slice(0, 80)}`,
      modusType: "QRIS Palsu",
      sender: "Kasir / Booth Pembayaran",
      message: "Saat Anda memindai QRIS di kasir, layar konfirmasi menampilkan nama toko 'DONASI YAYASAN DIGITAL' padahal Anda berbelanja di warung makan.",
      question: "Apakah tindakan yang harus segera Anda lakukan?",
      options: [
        {
          id: "a",
          label: "A",
          text: "Batalkan pembayaran dan segera konfirmasi nama toko langsung kepada pemilik kasir.",
          isCorrect: true,
          scoreImpact: 20,
          feedbackReason: "Sangat tepat! Ketidaksesuaian nama merchant merupakan indikasi kuat stiker QRIS telah ditimpa oleh oknum penipu."
        },
        {
          id: "b",
          label: "B",
          text: "Tetap lanjutkan bayar karena nominalnya kecil dan malas bertanya.",
          isCorrect: false,
          isRisky: true,
          scoreImpact: -20,
          feedbackReason: "Berisiko! Uang Anda akan masuk ke rekening penipu dan pihak toko belum menerima pembayaran Anda."
        }
      ]
    }
    articleDraft = {
      title: `Waspada Barcode: ${title.slice(0, 90)}`,
      readingTime: "3 Menit",
      rewardPoints: 20,
      summary: `Kasus manipulasi stiker QRIS di fasilitas publik kian canggih. Pastikan selalu memverifikasi identitas merchant sebelum menekan tombol konfirmasi.`,
      author: "Tim Riset Siber BCA #AwasModus"
    }
  } else {
    redFlags = [
      "Menjanjikan keuntungan tidak masuk akal atau komisi instan dengan tugas ringan",
      "Membuat situasi darurat mendesak agar korban panik dan tidak sempat berpikir jernih",
      "Meminta korban mentransfer sejumlah uang jaminan awal ke nomor rekening perorangan"
    ]
    tips = [
      "Terapkan rumus 3T: Tetap Tenang, Tidak Tergesa-gesa, Telepon saluran resmi bank",
      "Jangan pernah tergiur skema transfer deposit untuk pekerjaan atau hadiah undian",
      "Laporkan nomor dan rekening pelaku ke Call Center bank terkait agar segera diblokir"
    ]
    scenarioDraft = {
      title: `Simulasi Waspada: ${title.slice(0, 80)}`,
      modusType: category,
      sender: "Pesan Anonim / Grup Sosial Media",
      message: "Selamat! Nomor Anda terpilih mendapatkan reward Rp 25.000.000. Untuk mencairkan, silakan transfer biaya meterai dan pajak hadiah sebesar Rp 250.000.",
      question: "Bagaimana cara menyikapi pengumuman tersebut?",
      options: [
        {
          id: "a",
          label: "A",
          text: "Abaikan dan hapus pesan, karena hadiah resmi tidak pernah meminta transfer uang di muka.",
          isCorrect: true,
          scoreImpact: 20,
          feedbackReason: "Tepat! Pajak hadiah resmi umumnya ditanggung penyelenggara atau dipotong langsung dari hadiah, bukan dengan transfer di muka."
        },
        {
          id: "b",
          label: "B",
          text: "Transfer Rp 250.000 dengan harapan hadiah Rp 25 juta benar-benar dicairkan.",
          isCorrect: false,
          isRisky: true,
          scoreImpact: -20,
          feedbackReason: "Terjebak! Pelaku akan terus meminta uang dengan alasan biaya administrasi lain sampai uang Anda habis."
        }
      ]
    }
    articleDraft = {
      title: `Waspada Modus Siber: ${title.slice(0, 90)}`,
      readingTime: "3 Menit",
      rewardPoints: 20,
      summary: `Masyarakat perlu terus memperbarui wawasan mengenai metode manipulasi psikologis terkini. Edukasi dan pencegahan adalah benteng terkuat nasabah.`,
      author: "Pusat Literasi Keamanan Nasabah"
    }
  }

  return { redFlags, tips, scenarioDraft, articleDraft }
}

function analyzeNovelty(title, desc = "", dbTitles = []) {
  const combined = (title + " " + desc).toLowerCase()

  // 1. Cek kecocokan dengan data modus di database
  const knownKeywords = [
    "cs palsu", "customer service bca", "halobca", "perubahan tarif", "kenaikan biaya transfer",
    "apk undangan", "surat tilang apk", "kurir paket apk", "unduh file apk",
    "qris palsu", "stiker barcode", "qr code palsu",
    "phishing klikbca", "link verifikasi", "webform bca",
    "loker like video", "tugas youtube freelance", "deposit komisi",
    "undian berhadiah", "pajak hadiah"
  ]

  let matchedKeyword = null
  for (const kw of knownKeywords) {
    if (combined.includes(kw)) {
      matchedKeyword = kw
      break
    }
  }

  // Cek apakah ada judul yang sangat mirip di database
  const matchedInDb = dbTitles.some((t) => {
    const cleanT = t.toLowerCase()
    return combined.includes(cleanT) || cleanT.includes(title.toLowerCase())
  })

  // Deteksi indikasi teknik baru / belum dikenal luas
  const uniqueEmergingPatterns = [
    { pattern: "deepfake", note: "Rekayasa video call wajah & kecerdasan buatan" },
    { pattern: "voice clone", note: "Kloning suara anggota keluarga atau pejabat bank" },
    { pattern: "ai", note: "Pemanfaatan model AI otomatis untuk social engineering" },
    { pattern: "nfc", note: "Penyadapan tanpa kontak (NFC tapping/skimming baru)" },
    { pattern: "quishing", note: "Phishing tersembunyi dalam payload barcode QR dinamis" },
    { pattern: "sim swap", note: "Pengambilalihan kartu SIM operator seluler" },
    { pattern: "otp bypass", note: "Eksploitasi celah pengalihan SMS / call forwarding" },
    { pattern: "salah transfer", note: "Modus jebakan pinjol transfer misterius ke rekening" },
    { pattern: "romance", note: "Manipulasi emosional bertahap (pig butchering / love scam)" },
    { pattern: "love scam", note: "Manipulasi asmara lintas platform digital" },
    { pattern: "screen sharing", note: "Permintaan izin remote control layar HP AnyDesk/TeamViewer" }
  ]

  let uniqueFound = null
  for (const p of uniqueEmergingPatterns) {
    if (combined.includes(p.pattern)) {
      uniqueFound = p
      break
    }
  }

  if (uniqueFound) {
    return {
      isKnown: false,
      noveltyType: "Modus Unik & Baru",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      notes: `Varian unik: Terdeteksi indikasi teknologi/metode baru (${uniqueFound.note}) yang belum banyak dikenali masyarakat umum.`
    }
  }

  if (matchedInDb || matchedKeyword) {
    return {
      isKnown: true,
      noveltyType: "Sudah Dikenali di Database",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      notes: `Pola kasus cocok dengan tipologi penipuan yang sudah terdaftar (${matchedKeyword || "database Kenali Modus"}).`
    }
  }

  return {
    isKnown: false,
    noveltyType: "Varian Baru (Perlu Analisis)",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    notes: "Pola komunikasi atau skema penyaluran dana memiliki sudut pendekatan berbeda dari template modus umum."
  }
}

export default async function handler(req, res) {
  // Hanya role admin yang diizinkan menggunakan crawler & scraper intelijen modus
  const session = await getServerSession(req, res, authOptions)
  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Fitur intelijen siber khusus Administrator BCA." })
  }

  const { action = "scrape" } = req.query

  // ----------------------------------------------------
  // ACTION: AMBIL DAFTAR PRESET KATEGORI & PLATFORM
  // ----------------------------------------------------
  if (action === "presets") {
    return res.status(200).json({
      success: true,
      presets: SCRAPE_QUERIES,
      platforms: PLATFORM_SOURCES
    })
  }

  // ----------------------------------------------------
  // ACTION: SCRAPE & CRAWL BERITA / LAPORAN MODUS TERKINI
  // ----------------------------------------------------
  if (action === "scrape" && req.method === "POST") {
    try {
      const { category = "all", platform = "all", customKeyword = "" } = req.body

      // JIKA PLATFORM ADALAH LAPOR BARENG BCA: Tarik langsung live dari https://laporbareng.bca.co.id
      if (platform === "lapor_bareng") {
        let liveItems = []
        try {
          const laporRes = await fetch("https://laporbareng.bca.co.id", {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
          })

          if (laporRes.ok) {
            const html = await laporRes.text()
            const popupItems = html.split("gallery-popup-item")
            for (let i = 1; i < popupItems.length; i++) {
              const raw = popupItems[i]
              const rawPlatform = (raw.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] || "BCA Media"
              const rawTitle = (raw.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1] || ""
              const img = (raw.match(/<img[^>]*src=["'](.*?)["']/) || [])[1] || ""
              const descMatch = raw.match(/<p><p>([\s\S]*?)<\/p><\/p>/) || raw.match(/<p>([\s\S]*?)<\/p>/)
              const desc = descMatch ? descMatch[1].replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim() : ""

              if (rawTitle && rawTitle.trim().length > 3) {
                liveItems.push({
                  platform: rawPlatform.trim(),
                  title: rawTitle.trim(),
                  img,
                  desc
                })
              }
            }
          }
        } catch (fetchErr) {
          console.error("Gagal fetch live laporbareng.bca.co.id, fallback ke database internal:", fetchErr)
        }

        // Filter keyword jika ada
        if (customKeyword && customKeyword.trim().length > 0) {
          const kw = customKeyword.trim().toLowerCase()
          liveItems = liveItems.filter((it) => it.title.toLowerCase().includes(kw) || it.desc.toLowerCase().includes(kw))
        }

        // Format hasil untuk antarmuka admin
        const results = liveItems.map((r, index) => {
          const categoryDetected = determineCategory(r.title + " " + r.desc)
          const source = `Lapor Bareng BCA (${r.platform})`
          const analysis = generateAnalysis(r.title, categoryDetected, source)
          const novelty = analyzeNovelty(r.title, r.desc)

          const scenarioDraft = {
            title: `Simulasi Waspada BCA: ${r.title.slice(0, 80)}`,
            modusType: categoryDetected,
            sender: `Akun Palsu ${r.platform} Mengatasnamakan BCA`,
            message: r.desc.slice(0, 180) + "...",
            question: "Bagaimana cara membedakan akun resmi BCA dan menghindari penipuan ini?",
            options: [
              {
                id: "a",
                label: "A",
                text: "Periksa tanda centang verifikasi resmi (bukan di dalam foto profil) dan hubungi Halo BCA 1500888.",
                isCorrect: true,
                scoreImpact: 20,
                feedbackReason: "Tepat sekali! Akun resmi BCA selalu memiliki centang biru/hijau resmi terverifikasi dan tidak pernah meminta data rahasia seperti PIN/OTP."
              },
              {
                id: "b",
                label: "B",
                text: "Langsung percaya dan mengikuti instruksi admin jika foto profilnya menggunakan logo resmi BCA.",
                isCorrect: false,
                isRisky: true,
                scoreImpact: -20,
                feedbackReason: "Sangat Berbahaya! Logo BCA pada foto profil sangat mudah ditiru oleh penipu untuk menjebak nasabah."
              }
            ]
          }

          const articleDraft = {
            title: `Waspada Modus: ${r.title.slice(0, 80)}`,
            readingTime: "3 Menit",
            rewardPoints: 20,
            summary: r.desc.slice(0, 200) + "...",
            author: "Satgas Lapor Bareng BCA #AwasModus"
          }

          const now = new Date()
          const fullTimestamp = now.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }) + " WIB"

          return {
            id: `lapor_bca_${index + 1}`,
            isLaporBareng: true,
            laporId: `bca_${index + 1}`,
            targetPlatform: r.platform,
            title: r.title,
            originalTitle: r.title,
            link: "https://laporbareng.bca.co.id",
            pubDate: "Terverifikasi Resmi BCA",
            fullTimestamp,
            isoTimestamp: now.toISOString(),
            source: `Lapor Bareng BCA (${r.platform})`,
            category: categoryDetected,
            chronology: r.desc,
            evidenceImage: r.img,
            isKnownInDb: novelty.isKnown,
            noveltyType: novelty.noveltyType,
            noveltyBadgeColor: novelty.badgeColor,
            noveltyNotes: novelty.notes,
            status: "analisis",
            redFlags: analysis.redFlags,
            preventionTips: analysis.tips,
            scenarioDraft,
            articleDraft
          }
        })

        return res.status(200).json({
          success: true,
          platformUsed: "lapor_bareng_bca",
          totalFound: results.length,
          items: results
        })
      }

      let searchQuery = "penipuan online modus rekening bank ojk"
      const matched = SCRAPE_QUERIES.find((p) => p.id === category)
      if (matched) {
        searchQuery = matched.query
      }

      if (customKeyword && customKeyword.trim().length > 0) {
        searchQuery = `${customKeyword.trim()} modus penipuan online`
      }

      // Gabungkan dengan filter platform (X/Twitter, Instagram, Threads, TikTok, Telegram)
      const matchedPlatform = PLATFORM_SOURCES.find((pl) => pl.id === platform)
      if (matchedPlatform && matchedPlatform.queryModifier) {
        searchQuery += matchedPlatform.queryModifier
      }

      const encodedQuery = encodeURIComponent(searchQuery)
      const feedUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=id&gl=ID&ceid=ID:id`

      const response = await fetch(feedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      })

      if (!response.ok) {
        return res.status(502).json({ message: "Gagal mengambil data dari agregator berita nasional." })
      }

      const xml = await response.text()
      const itemRegex = /<item>([\s\S]*?)<\/item>/g
      const results = []

      let match
      while ((match = itemRegex.exec(xml)) !== null && results.length < 15) {
        const itemContent = match[1]
        let rawTitle = (itemContent.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ""
        let link = (itemContent.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || ""
        let pubDate = (itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || ""
        let source = (itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || "Media Informasi Siber"

        // Bersihkan title dari entitas HTML & nama portal berita di akhir judul
        let cleanTitle = rawTitle
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s*-\s*[^-]+$/, "")
          .trim()

        if (!cleanTitle || cleanTitle.length < 10) continue

        const categoryDetected = determineCategory(cleanTitle)
        const analysis = generateAnalysis(cleanTitle, categoryDetected, source)
        const novelty = analyzeNovelty(cleanTitle, "")

        const now = new Date()
        const fullTimestamp = now.toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }) + " WIB"

        results.push({
          id: `scrape_${Date.now()}_${results.length}`,
          title: cleanTitle,
          originalTitle: rawTitle,
          link,
          pubDate,
          fullTimestamp,
          isoTimestamp: now.toISOString(),
          source,
          category: categoryDetected,
          isKnownInDb: novelty.isKnown,
          noveltyType: novelty.noveltyType,
          noveltyBadgeColor: novelty.badgeColor,
          noveltyNotes: novelty.notes,
          status: "analisis",
          redFlags: analysis.redFlags,
          preventionTips: analysis.tips,
          scenarioDraft: analysis.scenarioDraft,
          articleDraft: analysis.articleDraft
        })
      }

      return res.status(200).json({
        success: true,
        queryUsed: searchQuery,
        totalFound: results.length,
        items: results
      })
    } catch (err) {
      console.error("Scraping Error:", err)
      return res.status(500).json({ message: "Terjadi kegagalan saat memproses scraping intelijen siber." })
    }
  }

  // ----------------------------------------------------
  // ACTION: PUBLIKASIKAN HASIL SCRAPING KE SISTEM
  // ----------------------------------------------------
  if (action === "publish" && req.method === "POST") {
    try {
      const { publishType, payload, laporId } = req.body // publishType: "modus" | "scenario" | "article"

      await initDbSchema()
      const sql = getDb()
      if (!sql) {
        return res.status(500).json({ message: "Koneksi database Neon gagal." })
      }

      // Tandai status konversi pada tabel Lapor Bareng jika bersumber dari aduan warga
      if (laporId) {
        if (publishType === "modus") {
          await sql`UPDATE lapor_bareng_reports SET is_converted_to_modus = TRUE, status = 'converted' WHERE id = ${parseInt(laporId, 10)}`
        } else if (publishType === "scenario") {
          await sql`UPDATE lapor_bareng_reports SET is_converted_to_scenario = TRUE, status = 'converted' WHERE id = ${parseInt(laporId, 10)}`
        } else if (publishType === "article") {
          await sql`UPDATE lapor_bareng_reports SET is_converted_to_article = TRUE, status = 'converted' WHERE id = ${parseInt(laporId, 10)}`
        }
      }

      // 1. Publikasikan ke Katalog Modus
      if (publishType === "modus") {
        const { title, category, description, difficulty, redFlags, tips } = payload
        const inserted = await sql`
          INSERT INTO custom_modus (title, category, description, difficulty, red_flags, prevention_tips)
          VALUES (
            ${title},
            ${category || 'Social Engineering'},
            ${description || 'Modus hasil temuan radar scraping siber terbaru.'},
            ${difficulty || 'Sedang'},
            ${JSON.stringify(redFlags || [])}::jsonb,
            ${JSON.stringify(tips || [])}::jsonb
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, message: "Modus berhasil dipublikasikan ke Katalog Modus!", data: inserted[0] })
      }

      // 2. Publikasikan ke Bank Soal Simulasi 2-Minute Challenge
      if (publishType === "scenario") {
        const { title, modusType, sender, message, question, options } = payload
        const inserted = await sql`
          INSERT INTO custom_scenarios (title, modus_type, sender, message, question, options)
          VALUES (
            ${title},
            ${modusType || 'Umum'},
            ${sender || 'WhatsApp Tidak Dikenal'},
            ${message},
            ${question},
            ${JSON.stringify(options || [])}::jsonb
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, message: "Soal berhasil dipublikasikan ke Bank Simulasi!", data: inserted[0] })
      }

      // 3. Publikasikan ke Artikel Edukasi Berhadiah Poin
      if (publishType === "article") {
        const { title, readingTime, rewardPoints, summary, fullContent, author } = payload
        const inserted = await sql`
          INSERT INTO custom_articles (title, content_type, reward_points, reading_time, author, summary, full_content)
          VALUES (
            ${title},
            'article',
            ${rewardPoints || 20},
            ${readingTime || '3 Menit'},
            ${author || 'Tim Riset Siber BCA #AwasModus'},
            ${summary},
            ${fullContent || summary}
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, message: "Artikel berhasil dipublikasikan ke Edukasi Poin!", data: inserted[0] })
      }

      // 4. Simpan ke Registry Case Intelijen (intelligence_cases) untuk Tracking & Status Kontrol
      if (publishType === "case_registry") {
        const { caseCode, title, source, sourceUrl, category, isKnownInDb, noveltyType, noveltyNotes, chronology, redFlags, preventionTips, status, adminNotes } = payload
        const genCode = caseCode || `CASE-${Date.now().toString().slice(-6)}`
        const inserted = await sql`
          INSERT INTO intelligence_cases (
            case_code,
            title,
            source,
            source_url,
            category,
            is_known_in_db,
            novelty_type,
            novelty_notes,
            chronology,
            red_flags,
            prevention_tips,
            status,
            admin_notes
          ) VALUES (
            ${genCode},
            ${title},
            ${source || 'Radar Intelijen Siber'},
            ${sourceUrl || ''},
            ${category || 'Social Engineering'},
            ${!!isKnownInDb},
            ${noveltyType || 'Varian Baru'},
            ${noveltyNotes || ''},
            ${chronology || ''},
            ${JSON.stringify(redFlags || [])}::jsonb,
            ${JSON.stringify(preventionTips || [])}::jsonb,
            ${status || 'analisis'},
            ${adminNotes || ''}
          )
          ON CONFLICT (case_code) DO UPDATE
          SET status = EXCLUDED.status,
              admin_notes = EXCLUDED.admin_notes,
              updated_at = CURRENT_TIMESTAMP
          RETURNING *
        `
        return res.status(201).json({ success: true, message: `Kasus ${genCode} berhasil disimpan ke Registry Investigasi!`, data: inserted[0] })
      }

      return res.status(400).json({ message: "Tipe publikasi tidak dikenali." })
    } catch (err) {
      console.error("Publishing Scrape Error:", err)
      return res.status(500).json({ message: "Gagal mempublikasikan konten ke database." })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

