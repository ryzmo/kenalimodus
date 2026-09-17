export const MODUS_CATEGORIES = [
  "Semua",
  "Phishing",
  "APK Berbahaya",
  "Impersonation",
  "Social Engineering",
  "Quishing (QRIS)",
  "Account Takeover",
  "Recovery Scam",
  "Investment Scam"
]

export const MODUS_LIST = [
  {
    id: "cs-palsu-wa",
    category: "Impersonation",
    title: "Customer Service Palsu",
    description: "Penipu menyamar sebagai customer service melalui WhatsApp atau telepon.",
    icon: "📞",
    difficulty: "Sulit"
  },
  {
    id: "apk-berbahaya",
    category: "APK Berbahaya",
    title: "APK Berbahaya",
    description: "File APK dikirim dengan berbagai alasan seperti undangan, resi, atau tilang.",
    icon: "📱",
    difficulty: "Sulit"
  },
  {
    id: "phishing-link",
    category: "Phishing",
    title: "Phishing Link",
    description: "Tautan palsu digunakan untuk mengarahkan korban ke halaman atau layanan tiruan.",
    icon: "🔗",
    difficulty: "Sulit"
  },
  {
    id: "social-engineering",
    category: "Social Engineering",
    title: "Social Engineering",
    description: "Pelaku memanfaatkan tekanan, urgensi, atau manipulasi psikologis untuk memperoleh informasi atau tindakan korban.",
    icon: "🧠",
    difficulty: "Sangat Sulit"
  },
  {
    id: "qris-palsu",
    category: "Quishing (QRIS)",
    title: "QRIS Palsu",
    description: "QRIS dimanipulasi atau diganti sehingga pembayaran masuk ke rekening penerima yang tidak semestinya.",
    icon: "▦",
    difficulty: "Sulit"
  },
  {
    id: "account-takeover",
    category: "Account Takeover",
    title: "Account Takeover",
    description: "Pelaku mengambil alih akun korban melalui kombinasi manipulasi, kredensial, atau akses perangkat.",
    icon: "🔐",
    difficulty: "Sangat Sulit"
  },
  {
    id: "recovery-scam",
    category: "Recovery Scam",
    title: "Recovery Scam",
    description: "Pelaku menawarkan bantuan palsu untuk mengembalikan dana atau akun yang sebelumnya bermasalah.",
    icon: "🛡️",
    difficulty: "Sangat Sulit"
  },
  {
    id: "investment-scam",
    category: "Investment Scam",
    title: "Investment Scam",
    description: "Pelaku menggunakan identitas perusahaan, komunitas, atau peluang investasi untuk meyakinkan korban.",
    icon: "💰",
    difficulty: "Sangat Sulit"
  }
];
// Pool lengkap 10 Skenario Dunia Nyata
// Pool lengkap skenario dunia nyata
export const ALL_SCENARIOS_POOL = [
  {
    id: "sim-swap-01",
    category: "Account Takeover",
    difficulty: "Sulit",
    title: "Tiba-Tiba Tidak Ada Sinyal",
    context:
      "Pukul 22.15, ponsel kamu tiba-tiba kehilangan sinyal. Beberapa menit kemudian muncul dua notifikasi OTP untuk transaksi yang tidak kamu lakukan. Tidak ada pesan dari bank sebelumnya.",
    mockType: "sms",
    sender: "Notifikasi Bank",
    message:
      "Kode OTP Anda untuk transaksi sebesar Rp4.800.000 adalah 381924. Jika Anda tidak merasa melakukan transaksi ini, segera amankan akun Anda.",
    question:
      "Apa tindakan paling tepat yang harus kamu lakukan?",
    options: [
      {
        id: "a",
        text:
          "Menunggu beberapa menit karena gangguan jaringan bisa membuat SMS OTP terlambat.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Kehilangan sinyal secara tiba-tiba bersamaan dengan OTP transaksi yang tidak dikenali perlu segera diverifikasi."
      },
      {
        id: "b",
        text:
          "Restart ponsel lalu cek kembali transaksi setelah jaringan kembali normal.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Restart perangkat tidak memastikan nomor kamu masih berada di bawah kendalimu."
      },
      {
        id: "c",
        text:
          "Menghubungi operator melalui kanal resmi untuk memastikan status nomor, lalu menghubungi bank melalui kanal resmi.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Kombinasi kehilangan sinyal dan OTP tidak dikenal perlu diverifikasi melalui operator dan bank secara independen."
      },
      {
        id: "d",
        text:
          "Membalas SMS OTP agar sistem mengetahui bahwa transaksi tersebut bukan milikmu.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "OTP tidak perlu dibalas. Gunakan kanal resmi bank untuk memeriksa transaksi."
      },
      {
        id: "e",
        text:
          "Menghubungi nomor yang pernah meneleponmu terkait layanan operator agar proses pemulihan lebih cepat.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Nomor yang pernah menghubungi kamu belum tentu merupakan kanal resmi."
      }
    ],
    redFlags: [
      "Kehilangan sinyal secara tiba-tiba.",
      "Muncul OTP untuk transaksi yang tidak dilakukan.",
      "Ada kemungkinan nomor mengalami pengambilalihan atau masalah pada SIM."
    ],
    goldenRule:
      "Jika kehilangan sinyal terjadi bersamaan dengan aktivitas transaksi yang tidak dikenal, lakukan verifikasi melalui kanal resmi operator dan bank."
  },

  {
    id: "recovery-scam-01",
    category: "Recovery Scam",
    difficulty: "Sulit",
    title: "Ada yang Mengaku Bisa Mengembalikan Dana",
    context:
      "Kamu baru saja kehilangan uang akibat penipuan. Seseorang kemudian menghubungi kamu dan mengaku berasal dari tim recovery fraud.",
    mockType: "whatsapp",
    sender: "Fraud Recovery Team",
    message:
      "Kami mengetahui kasus penipuan yang Anda alami. Dana masih dapat dikembalikan melalui proses recovery. Untuk verifikasi kepemilikan rekening, kami membutuhkan nomor rekening dan kode verifikasi yang dikirim ke ponsel Anda.",
    question:
      "Apa tindakan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Memberikan nomor rekening saja karena nomor rekening bukan password.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nomor rekening mungkin tidak cukup untuk mengambil alih akun, tetapi komunikasi tersebut tetap belum terverifikasi."
      },
      {
        id: "b",
        text:
          "Memberikan data yang diminta karena pihak tersebut mengetahui bahwa kamu baru saja menjadi korban.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Penipu dapat memperoleh informasi korban dari laporan publik, media sosial, atau komunikasi sebelumnya."
      },
      {
        id: "c",
        text:
          "Meminta identitas lengkap petugas sebelum memberikan data apa pun.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Identitas, logo, atau kartu petugas dapat dipalsukan sehingga belum cukup sebagai verifikasi."
      },
      {
        id: "d",
        text:
          "Menghentikan komunikasi dan menghubungi bank melalui kanal resmi untuk memastikan apakah ada proses recovery.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Korban penipuan sering menjadi target recovery scam. Verifikasi harus dilakukan melalui kanal resmi yang kamu akses sendiri."
      },
      {
        id: "e",
        text:
          "Meminta mereka mengirim surat tugas terlebih dahulu melalui WhatsApp.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Dokumen digital juga dapat dibuat atau dipalsukan. Tetap lakukan verifikasi melalui kanal resmi."
      }
    ],
    redFlags: [
      "Pelaku mengetahui korban baru saja mengalami penipuan.",
      "Menggunakan klaim dapat mengembalikan dana.",
      "Meminta kode verifikasi."
    ],
    goldenRule:
      "Korban penipuan harus waspada terhadap pihak yang tiba-tiba menawarkan jasa pengembalian dana."
  },

  {
    id: "voice-cloning-01",
    category: "Impersonation",
    difficulty: "Sulit",
    title: "Suara yang Sangat Mirip",
    context:
      "Kamu menerima telepon dari seseorang yang suaranya sangat mirip dengan saudaramu. Ia juga mengetahui beberapa detail pribadi keluarga.",
    mockType: "phone",
    sender: "Panggilan Masuk",
    message:
      "Aku lagi ada masalah. HP-ku hampir mati dan aku butuh transfer sekarang. Tolong kirim Rp2.500.000 ke rekening ini dulu. Nanti aku jelaskan.",
    question:
      "Apa tindakan yang paling aman?",
    options: [
      {
        id: "a",
        text:
          "Transfer jumlah kecil terlebih dahulu untuk memastikan orang tersebut benar-benar saudaramu.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Transfer kecil tetap merupakan transaksi kepada pihak yang identitasnya belum terverifikasi."
      },
      {
        id: "b",
        text:
          "Menanyakan satu pertanyaan pribadi yang hanya diketahui oleh kalian berdua.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Informasi pribadi dapat diperoleh dari media sosial atau sumber lainnya sehingga bukan verifikasi yang kuat."
      },
      {
        id: "c",
        text:
          "Meminta dia mengirim foto atau voice note sebagai bukti.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Foto atau rekaman suara juga dapat dipalsukan atau diperoleh dari sumber lain."
      },
      {
        id: "d",
        text:
          "Mengakhiri telepon dan menghubungi nomor saudaramu yang tersimpan atau anggota keluarga lain melalui kanal berbeda.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Gunakan kanal independen yang sudah kamu miliki untuk memastikan identitas orang tersebut."
      },
      {
        id: "e",
        text:
          "Meminta dia menelepon kembali setelah mendapatkan jaringan yang lebih stabil.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Menunda panggilan tidak menyelesaikan masalah identitas penelepon."
      }
    ],
    redFlags: [
      "Permintaan transfer dilakukan secara mendesak.",
      "Penelepon menggunakan informasi pribadi untuk membangun kepercayaan.",
      "Identitas hanya diverifikasi melalui suara."
    ],
    goldenRule:
      "Untuk permintaan uang yang mendesak, verifikasi identitas melalui kanal lain yang sudah kamu percaya."
  },

  {
    id: "fake-bts-01",
    category: "Phishing",
    difficulty: "Sulit",
    title: "SMS Perubahan Tarif",
    context:
      "Kamu menerima SMS dengan nama pengirim yang terlihat seperti nama perusahaan resmi.",
    mockType: "sms",
    sender: "INFO-LAYANAN",
    message:
      "Terdapat perubahan tarif layanan mulai bulan depan. Detail perubahan dapat dilihat melalui tautan berikut. Tidak diperlukan kode OTP untuk melihat informasi.",
    question:
      "Apa tindakan yang paling aman?",
    options: [
      {
        id: "a",
        text:
          "Membuka link karena pesan tidak meminta password atau OTP.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Tidak meminta OTP bukan berarti sebuah tautan otomatis aman."
      },
      {
        id: "b",
        text:
          "Membuka link menggunakan browser pribadi agar lebih aman.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Browser pribadi tidak mengubah fakta bahwa tautan tersebut belum diverifikasi."
      },
      {
        id: "c",
        text:
          "Mencari informasi mengenai perubahan tarif melalui mesin pencari terlebih dahulu.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Pencarian dapat membantu, tetapi cara paling aman adalah langsung menggunakan kanal resmi perusahaan."
      },
      {
        id: "d",
        text:
          "Tidak menggunakan link tersebut dan membuka aplikasi atau website resmi perusahaan secara manual.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Akses kanal resmi secara mandiri tanpa mengikuti tautan dari pesan."
      },
      {
        id: "e",
        text:
          "Membalas SMS untuk memastikan apakah pesan tersebut benar-benar berasal dari perusahaan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Membalas pesan tidak menjamin identitas pengirim."
      }
    ],
    redFlags: [
      "Informasi penting disampaikan melalui tautan dari pesan.",
      "Nama pengirim yang terlihat resmi belum membuktikan keaslian pesan.",
      "Pengguna diarahkan keluar dari kanal resmi."
    ],
    goldenRule:
      "Untuk informasi penting, akses aplikasi atau website resmi secara mandiri daripada mengikuti link dari pesan."
  },

  {
    id: "bank-call-01",
    category: "Impersonation",
    difficulty: "Sulit",
    title: "Telepon dari Bank",
    context:
      "Seseorang menelepon mengaku sebagai petugas bank. Ia mengetahui sebagian nomor kartu kamu dan mengatakan ada perubahan sistem.",
    mockType: "phone",
    sender: "Customer Service",
    message:
      "Kami sedang melakukan penyesuaian sistem. Tidak perlu memberikan OTP atau PIN. Bapak/Ibu cukup membuka aplikasi mobile banking dan mengikuti instruksi yang kami berikan.",
    question:
      "Apa tindakan paling aman?",
    options: [
      {
        id: "a",
        text:
          "Mengikuti langkahnya selama tidak diminta memberikan OTP.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Tidak meminta OTP bukan berarti penelepon telah terverifikasi."
      },
      {
        id: "b",
        text:
          "Mengikuti instruksi tetapi menghentikan proses jika diminta memasukkan PIN.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Kamu tetap memberikan kesempatan kepada penelepon untuk mengarahkan tindakan di aplikasi."
      },
      {
        id: "c",
        text:
          "Meminta petugas menyebutkan nomor laporan sebelum mengikuti instruksi.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Nomor laporan dapat dibuat atau disebutkan oleh pelaku dan bukan verifikasi independen."
      },
      {
        id: "d",
        text:
          "Mengakhiri telepon dan menghubungi bank melalui nomor resmi yang kamu akses sendiri.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Verifikasi identitas harus dilakukan melalui kanal resmi yang tidak bergantung pada penelepon."
      },
      {
        id: "e",
        text:
          "Merekam percakapan dan mengikuti instruksi selama tidak memberikan data rahasia.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Rekaman percakapan tidak membuat instruksi dari penelepon menjadi aman."
      }
    ],
    redFlags: [
      "Penelepon meminta pengguna melakukan tindakan di aplikasi.",
      "Informasi parsial tentang kartu digunakan untuk membangun kepercayaan.",
      "Identitas penelepon belum diverifikasi."
    ],
    goldenRule:
      "Jika pihak yang menelepon meminta kamu melakukan tindakan finansial, hentikan komunikasi dan verifikasi melalui kanal resmi."
  },

  {
    id: "qris-ambiguous-01",
    category: "Quishing (QRIS)",
    difficulty: "Sulit",
    title: "Nama Merchant Hampir Sama",
    context:
      "Kamu membayar di sebuah booth. Sebelum menekan tombol bayar, aplikasi menampilkan nama penerima yang hampir sama dengan nama booth.",
    mockType: "qris",
    sender: "QRIS Merchant",
    message:
      "Nama booth: Dapur Nusantara. Nama penerima pada aplikasi: Dapur Nusantara Official.",
    question:
      "Apa yang sebaiknya kamu lakukan?",
    options: [
      {
        id: "a",
        text:
          "Tetap membayar karena nama penerima hanya berbeda sedikit.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Perbedaan nama tujuan perlu dikonfirmasi sebelum transaksi."
      },
      {
        id: "b",
        text:
          "Membayar nominal kecil terlebih dahulu untuk menguji QRIS.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Transaksi percobaan tetap mengirimkan uang kepada tujuan yang belum terverifikasi."
      },
      {
        id: "c",
        text:
          "Meminta penjual menunjukkan bukti bahwa rekening tersebut milik usaha.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Bukti yang diberikan penjual belum tentu cukup untuk memverifikasi kepemilikan rekening."
      },
      {
        id: "d",
        text:
          "Menunda pembayaran dan mengonfirmasi nama penerima kepada merchant sebelum melanjutkan.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Nama penerima harus dipastikan sesuai dengan merchant sebelum pembayaran."
      },
      {
        id: "e",
        text:
          "Membayar jika nominal transaksi tidak terlalu besar karena risikonya dianggap kecil.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nominal kecil tetap dapat masuk ke rekening yang salah."
      }
    ],
    redFlags: [
      "Nama penerima tidak identik dengan nama merchant.",
      "Pembayaran dilakukan melalui QRIS.",
      "Pengguna terdorong untuk segera menyelesaikan transaksi."
    ],
    goldenRule:
      "Selalu periksa nama penerima sebelum menekan tombol bayar."
  },

  {
    id: "trusted-friend-01",
    category: "Account Takeover",
    difficulty: "Sulit",
    title: "File dari Teman",
    context:
      "Seorang teman yang kamu kenal mengirim file melalui WhatsApp. Ia mengatakan itu adalah foto dokumentasi.",
    mockType: "whatsapp",
    sender: "Teman",
    message:
      "Bro, ini foto kemarin. Coba buka ya. Kalau muncul izin instalasi, tinggal lanjut aja.",
    question:
      "Apa tindakan yang paling aman?",
    options: [
      {
        id: "a",
        text:
          "Membuka file karena pengirimnya adalah teman sendiri.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Akun teman dapat diretas sehingga pesan dari kontak yang dikenal tidak otomatis aman."
      },
      {
        id: "b",
        text:
          "Membuka file tetapi tidak memberikan izin tambahan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "File yang meminta instalasi aplikasi sebaiknya tidak dilanjutkan."
      },
      {
        id: "c",
        text:
          "Meminta teman menjelaskan isi file melalui chat yang sama.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Jika akun teman telah diambil alih, jawaban di chat tersebut juga tidak dapat menjadi verifikasi."
      },
      {
        id: "d",
        text:
          "Mengonfirmasi melalui kanal lain bahwa teman tersebut benar-benar mengirim file tersebut sebelum membukanya.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Gunakan kanal berbeda untuk memastikan pesan benar-benar berasal dari teman."
      },
      {
        id: "e",
        text:
          "Menyimpan file terlebih dahulu dan membukanya ketika perangkat sedang tidak digunakan untuk transaksi.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Menunda waktu membuka file tidak menghilangkan risiko file berbahaya."
      }
    ],
    redFlags: [
      "File meminta instalasi aplikasi.",
      "Pesan berasal dari akun yang dikenal tetapi perilakunya tidak biasa.",
      "Pengguna diarahkan memberikan izin instalasi."
    ],
    goldenRule:
      "Kontak yang dikenal tetap perlu diverifikasi jika mengirim file atau instruksi yang tidak biasa."
  },

  {
    id: "service-code-01",
    category: "Social Engineering",
    difficulty: "Sulit",
    title: "Diminta Menekan Kode Layanan",
    context:
      "Penelepon mengaku sebagai petugas operator seluler. Ia mengatakan ada masalah pada jaringan.",
    mockType: "phone",
    sender: "Petugas Operator",
    message:
      "Tidak perlu OTP atau password. Untuk memperbaiki jaringan, silakan ketik kode layanan *123*... lalu tekan panggil.",
    question:
      "Apa tindakan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Mengikuti instruksi karena tidak ada permintaan OTP.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Kode layanan tertentu dapat mengubah pengaturan atau layanan pada nomor."
      },
      {
        id: "b",
        text:
          "Mengikuti instruksi jika penelepon dapat menyebutkan nama lengkapmu.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nama lengkap bukan bukti bahwa penelepon merupakan petugas resmi."
      },
      {
        id: "c",
        text:
          "Mencatat kode tersebut lalu mencari informasinya di internet.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Jangan menjalankan kode yang diberikan oleh pihak yang belum terverifikasi."
      },
      {
        id: "d",
        text:
          "Mengakhiri telepon dan menghubungi operator melalui kanal resmi untuk menanyakan masalah jaringan.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Verifikasi masalah jaringan melalui kanal resmi operator."
      },
      {
        id: "e",
        text:
          "Mencoba memasukkan kode tetapi tidak menekan tombol panggil sampai penelepon memberikan konfirmasi.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Memasukkan kode yang diberikan pihak asing tetap bukan langkah verifikasi yang aman."
      }
    ],
    redFlags: [
      "Penelepon meminta pengguna menjalankan kode layanan.",
      "Tidak ada verifikasi independen.",
      "Masalah jaringan digunakan sebagai alasan untuk membuat pengguna bertindak cepat."
    ],
    goldenRule:
      "Jangan menjalankan kode layanan yang diberikan oleh penelepon yang belum terverifikasi."
  },

  {
    id: "otp-refund-01",
    category: "Social Engineering",
    difficulty: "Sulit",
    title: "Refund dari Merchant",
    context:
      "Seseorang yang kamu kenal mengatakan ada transaksi merchant yang harus direfund.",
    mockType: "whatsapp",
    sender: "Teman",
    message:
      "Ada refund dari merchant. Katanya kode OTP yang masuk ke HP kamu diperlukan supaya refund bisa diproses. Kirim kodenya ke aku ya.",
    question:
      "Apa tindakan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Memberikan OTP karena permintaan datang dari teman yang dikenal.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "OTP adalah kode autentikasi dan tidak boleh dibagikan kepada orang lain."
      },
      {
        id: "b",
        text:
          "Memberikan OTP jika jumlah refund sesuai dengan transaksi sebelumnya.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Kesesuaian nominal tidak membuktikan bahwa permintaan OTP tersebut sah."
      },
      {
        id: "c",
        text:
          "Meminta teman mengirimkan bukti refund terlebih dahulu.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Bukti digital dapat dipalsukan dan tidak menggantikan verifikasi langsung kepada merchant."
      },
      {
        id: "d",
        text:
          "Tidak memberikan OTP dan menghubungi merchant melalui kanal resmi untuk memastikan proses refund.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Proses refund harus diverifikasi langsung melalui merchant dan OTP tidak boleh dibagikan."
      },
      {
        id: "e",
        text:
          "Memberikan OTP hanya jika tidak ada notifikasi transaksi baru.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Tidak adanya notifikasi transaksi baru bukan alasan untuk membagikan OTP."
      }
    ],
    redFlags: [
      "Meminta kode OTP.",
      "Klaim refund disampaikan melalui pihak lain.",
      "Pengguna diminta menyerahkan kode autentikasi."
    ],
    goldenRule:
      "OTP tidak boleh dibagikan untuk proses refund maupun alasan lainnya."
  },

  {
    id: "real-company-01",
    category: "Investment Scam",
    difficulty: "Sulit",
    title: "Investasi Menggunakan Nama Perusahaan Asli",
    context:
      "Kamu melihat promosi investasi yang menggunakan nama dan logo perusahaan terkenal.",
    mockType: "telegram",
    sender: "Investment Partnership",
    message:
      "Program investasi resmi perusahaan kami telah dibuka. Anda akan mendapatkan akses melalui grup privat. Untuk pencairan dana, transfer dilakukan ke rekening admin investasi.",
    question:
      "Apa tindakan paling aman?",
    options: [
      {
        id: "a",
        text:
          "Mengikuti karena nama perusahaan dan logonya dapat ditemukan di internet.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Nama dan logo perusahaan dapat disalahgunakan oleh pihak lain."
      },
      {
        id: "b",
        text:
          "Mengikuti jika admin dapat menunjukkan kartu identitas dan sertifikat.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Dokumen identitas juga dapat dipalsukan."
      },
      {
        id: "c",
        text:
          "Meminta admin memberikan website perusahaan untuk memastikan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Website yang diberikan oleh admin belum tentu merupakan kanal resmi."
      },
      {
        id: "d",
        text:
          "Memverifikasi penawaran melalui kanal resmi perusahaan dan memastikan identitas serta rekening tujuan sebelum melakukan transaksi.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Verifikasi dilakukan melalui kanal resmi yang kamu akses sendiri dan rekening tujuan harus diperiksa."
      },
      {
        id: "e",
        text:
          "Mencoba dengan nominal kecil terlebih dahulu untuk melihat apakah dana dapat dicairkan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nominal kecil tetap berisiko dan tidak membuktikan bahwa investasi tersebut resmi."
      }
    ],
    redFlags: [
      "Nama perusahaan asli digunakan untuk membangun kepercayaan.",
      "Komunikasi dilakukan melalui grup privat.",
      "Dana diarahkan ke rekening individu."
    ],
    goldenRule:
      "Jangan menilai keaslian investasi hanya dari nama, logo, atau dokumen. Verifikasi melalui kanal resmi perusahaan."
  }
]
// ==========================================
// DATA SKENARIO KHUSUS PRE-TEST (BASELINE) & POST-TEST (EVALUASI)
// Modus berbasis data laporan IASC (Indonesia Anti-Scam Centre / OJK)
// ==========================================

export const PRE_TEST_SCENARIOS = [
  {
    id: "pre-1",
    pairId: "pair-call-otp",
    category: "Impersonation",
    modusType: "Fake Call / CS Perbankan Palsu",
    title: "Telepon Perubahan Biaya",
    difficulty: "Sangat Sulit",
    context:
      "Kamu mendapat telepon dari seseorang yang mengaku sebagai petugas bank. Ia menjelaskan bahwa ada perubahan biaya administrasi dan mengatakan kamu perlu melakukan beberapa langkah di aplikasi agar rekening tetap aktif. Ia tidak meminta OTP atau PIN secara langsung.",
    mockType: "phone",
    sender: "Petugas Layanan Bank",
    message:
      "Selamat siang. Ada perubahan tarif transfer menjadi Rp150.000/bulan. Jika Bapak/Ibu ingin tetap di tarif gratis lama, kami bantu proses sekarang. Tidak perlu memberikan PIN atau OTP. Bapak/Ibu cukup membuka aplikasi dan mengikuti instruksi kami.",
    question:
      "Apa respon spontan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Mengikuti langkahnya selama tidak diminta memberikan OTP atau PIN.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Tidak meminta OTP atau PIN bukan berarti penelepon sudah terverifikasi. Risiko dapat muncul dari instruksi lain yang diberikan melalui aplikasi."
      },
      {
        id: "b",
        text:
          "Meminta nomor laporan lalu mengikuti instruksinya jika nomor tersebut cocok.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nomor laporan dapat disebutkan atau dibuat oleh pelaku. Itu bukan verifikasi independen."
      },
      {
        id: "c",
        text:
          "Mengakhiri telepon dan menghubungi bank melalui kanal resmi yang kamu akses sendiri.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Identitas penelepon harus diverifikasi melalui kanal resmi yang kamu akses sendiri, bukan melalui nomor yang menghubungi kamu."
      },
      {
        id: "d",
        text:
          "Membuka aplikasi bank sambil tetap tersambung dengan penelepon agar prosesnya lebih cepat.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Penelepon tetap dapat mengarahkan tindakanmu selama panggilan berlangsung."
      },
      {
        id: "e",
        text:
          "Menunggu sampai penelepon menghubungi kembali melalui nomor resmi bank.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Menunggu panggilan kembali tidak memastikan bahwa komunikasi berikutnya benar-benar berasal dari bank."
      }
    ],
    redFlags: [
      "Penelepon meminta pengguna melakukan tindakan melalui aplikasi.",
      "Identitas penelepon belum diverifikasi secara independen.",
      "Ada tekanan agar pengguna segera mengikuti instruksi."
    ],
    goldenRule:
      "Jika pihak yang menelepon meminta kamu melakukan tindakan terkait rekening, hentikan komunikasi dan verifikasi melalui kanal resmi."
  },

  {
    id: "pre-2",
    pairId: "pair-apk-wa",
    category: "APK Berbahaya",
    modusType: "Penyebaran APK Resi/Kurir",
    title: "Resi Paket dari WhatsApp",
    difficulty: "Sangat Sulit",
    context:
      "Kamu sedang menunggu paket. Tiba-tiba ada WhatsApp dari nomor yang mengaku sebagai kurir dan mengatakan paket membutuhkan konfirmasi tambahan.",
    mockType: "whatsapp",
    sender: "Kurir Ekspedisi",
    message:
      "Siang kak, paket atas nama Anda perlu konfirmasi titik pengantaran. Kami kirim file resi sekaligus foto lokasi paket. Silakan buka file berikut: Foto_Bukti_Pengantaran.apk",
    question:
      "Apa tindakan yang paling aman?",
    options: [
      {
        id: "a",
        text:
          "Membuka file karena memang sedang menunggu paket.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Konteks paket yang memang sedang ditunggu dapat dimanfaatkan untuk membuat file berbahaya terlihat masuk akal."
      },
      {
        id: "b",
        text:
          "Membuka file tetapi tidak memberikan izin tambahan jika diminta.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Masalahnya sudah muncul sejak file meminta instalasi aplikasi dari sumber yang tidak terpercaya."
      },
      {
        id: "c",
        text:
          "Memeriksa nomor pengirim dan membuka file jika terlihat seperti nomor kurir.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nomor telepon yang terlihat seperti nomor kurir tidak cukup untuk memastikan file tersebut aman."
      },
      {
        id: "d",
        text:
          "Tidak membuka atau memasang file dan memeriksa status paket melalui aplikasi marketplace atau ekspedisi resmi.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Status paket dapat diverifikasi melalui aplikasi atau website resmi tanpa membuka file instalasi dari chat."
      },
      {
        id: "e",
        text:
          "Meminta pengirim mengirim ulang dokumen tersebut dalam format PDF.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Meminta format lain memang lebih baik daripada memasang APK, tetapi identitas pengirim tetap belum terverifikasi. Gunakan kanal resmi untuk mengecek paket."
      }
    ],
    redFlags: [
      "File yang dikirim meminta instalasi aplikasi.",
      "File berasal dari percakapan WhatsApp.",
      "Status paket dapat diperiksa melalui kanal resmi tanpa file tersebut."
    ],
    goldenRule:
      "Jangan memasang aplikasi dari file yang dikirim melalui chat. Periksa paket melalui aplikasi atau website resmi."
  },

  {
    id: "pre-3",
    pairId: "pair-phishing-link",
    category: "Phishing",
    modusType: "Phishing Link Keamanan Rekening",
    title: "SMS Peringatan Aktivitas Login",
    difficulty: "Sangat Sulit",
    context:
      "Kamu menerima SMS dengan nama pengirim yang terlihat seperti institusi keuangan. Pesan mengatakan ada aktivitas login yang tidak biasa.",
    mockType: "sms",
    sender: "INFO-PERBANKAN",
    message:
      "Rekening Anda terdeteksi login dari perangkat baru. Untuk memastikan akun tetap aman, lakukan verifikasi dalam 15 menit melalui tautan berikut: https://bca-verifikasi-keamanan.biz/login",
    question:
      "Langkah apa yang kamu ambil pertama kali?",
    options: [
      {
        id: "a",
        text:
          "Membuka link tersebut dan memasukkan User ID serta Password untuk memastikan akun aman.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "Tautan dari SMS belum terverifikasi dan dapat mengarahkan ke halaman phishing."
      },
      {
        id: "b",
        text:
          "Memastikan nama pengirim terlihat familiar lalu membuka link tersebut.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nama pengirim yang terlihat resmi tidak cukup untuk membuktikan keaslian pesan."
      },
      {
        id: "c",
        text:
          "Mencari nomor layanan bank di internet lalu tetap membuka link sambil menunggu informasi.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Tidak ada alasan untuk membuka tautan sebelum pesan tersebut diverifikasi."
      },
      {
        id: "d",
        text:
          "Mengabaikan tautan dan membuka aplikasi bank secara langsung untuk memeriksa status rekening.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Kanal resmi diakses secara mandiri sehingga kamu tidak bergantung pada tautan dalam SMS."
      },
      {
        id: "e",
        text:
          "Membalas SMS untuk memastikan apakah benar ada aktivitas login.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Membalas pesan tidak membuktikan bahwa pengirim benar-benar berasal dari bank."
      }
    ],
    redFlags: [
      "Pesan menggunakan tekanan waktu.",
      "Nama pengirim terlihat resmi tetapi belum diverifikasi.",
      "Pengguna diarahkan menuju link untuk melakukan verifikasi."
    ],
    goldenRule:
      "Untuk masalah rekening, jangan mengikuti link dari SMS. Buka aplikasi atau website resmi secara mandiri."
  },

  {
    id: "pre-4",
    pairId: "pair-soceng-deposit",
    category: "Social Engineering",
    modusType: "Social Engineering Skema Freelance",
    title: "Tawaran Pekerjaan Like Video",
    difficulty: "Sangat Sulit",
    context:
      "Kamu dimasukkan ke grup yang menawarkan pekerjaan online berupa like dan review. Pada tahap awal, kamu bahkan menerima pembayaran kecil.",
    mockType: "telegram",
    sender: "HRD Digital Media",
    message:
      "Tugas pertama: like 3 video dan kami transfer Rp45.000. Pembayaran sudah berhasil. Untuk masuk ke level berikutnya dengan komisi Rp1.500.000, diperlukan deposit jaminan Rp300.000.",
    question:
      "Bagaimana kamu menyikapi tawaran tersebut?",
    options: [
      {
        id: "a",
        text:
          "Transfer deposit karena tugas pertama sudah terbukti menghasilkan uang.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "Pembayaran kecil di awal dapat digunakan sebagai umpan untuk membangun kepercayaan sebelum korban diminta melakukan deposit."
      },
      {
        id: "b",
        text:
          "Meminta bukti bahwa anggota lain berhasil mencairkan komisi sebelum memutuskan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Bukti transfer atau testimoni dalam grup dapat dibuat oleh pihak yang terlibat dalam skema."
      },
      {
        id: "c",
        text:
          "Melanjutkan selama jumlah deposit masih lebih kecil daripada komisi yang dijanjikan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Perbandingan deposit dan komisi tidak membuat skema tersebut aman."
      },
      {
        id: "d",
        text:
          "Menolak deposit, keluar dari grup, dan menghentikan komunikasi.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Permintaan deposit untuk memperoleh pekerjaan atau mencairkan komisi merupakan indikator kuat skema penipuan."
      },
      {
        id: "e",
        text:
          "Meminta admin mengurangi nominal deposit agar risiko finansial lebih kecil.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Mengurangi nominal tidak menghilangkan pola penipuan. Masalah utamanya adalah pengguna diminta mengirim uang terlebih dahulu."
      }
    ],
    redFlags: [
      "Pekerjaan sederhana menghasilkan komisi yang tidak wajar.",
      "Pembayaran kecil diberikan terlebih dahulu untuk membangun kepercayaan.",
      "Korban diminta melakukan deposit untuk melanjutkan pekerjaan."
    ],
    goldenRule:
      "Jangan membayar untuk mendapatkan pekerjaan atau mencairkan komisi."
  },

  {
    id: "pre-5",
    pairId: "pair-qris-quishing",
    category: "Quishing (QRIS)",
    modusType: "Quishing / QRIS Tempelan",
    title: "QRIS dengan Nama Hampir Sesuai",
    difficulty: "Sangat Sulit",
    context:
      "Kamu sedang membeli makanan di sebuah merchant. Setelah QRIS dipindai, nama penerima yang muncul di aplikasi hampir sama dengan nama toko.",
    mockType: "qris",
    sender: "QRIS Kasir",
    message:
      "Nama toko: Bakmi Sedap 88. Nama penerima pada layar pembayaran: Bakmi Sedap 88 Official.",
    question:
      "Apa tindakan yang paling tepat sebelum memasukkan PIN?",
    options: [
      {
        id: "a",
        text:
          "Tetap membayar karena perbedaan nama hanya sedikit.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Perbedaan nama tujuan tetap perlu dikonfirmasi sebelum transaksi."
      },
      {
        id: "b",
        text:
          "Membayar nominal kecil terlebih dahulu untuk memastikan QRIS tersebut benar.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Transaksi kecil tetap mengirimkan dana ke rekening yang belum terverifikasi."
      },
      {
        id: "c",
        text:
          "Meminta kasir menunjukkan bukti bahwa rekening tersebut milik toko.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Bukti yang diberikan di tempat belum tentu cukup untuk memastikan kepemilikan rekening."
      },
      {
        id: "d",
        text:
          "Menunda pembayaran dan mengonfirmasi nama penerima kepada merchant sebelum melanjutkan.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Tepat. Nama penerima harus dipastikan sesuai dengan merchant sebelum pembayaran diotorisasi."
      },
      {
        id: "e",
        text:
          "Membayar jika nominal transaksi tidak terlalu besar karena risikonya dianggap kecil.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nominal transaksi tidak menentukan apakah tujuan pembayaran tersebut benar atau salah."
      }
    ],
    redFlags: [
      "Nama penerima tidak identik dengan nama merchant.",
      "QRIS merupakan media pembayaran yang perlu diverifikasi sebelum otorisasi.",
      "Pengguna dapat terdorong mengabaikan perbedaan karena antrean."
    ],
    goldenRule:
      "Selalu periksa nama penerima sebelum memasukkan PIN dan menyelesaikan pembayaran QRIS."
  }
]
export const POST_TEST_SCENARIOS = [
  {
    id: "post-1",
    pairId: "pair-call-otp",
    category: "Impersonation",
    modusType: "Fake Call / CS Perbankan Palsu",
    title: "Telepon Mengaku Petugas Anti-Fraud",
    difficulty: "Sedang",
    context:
      "Kamu menerima telepon dari seseorang yang mengaku sebagai petugas anti-fraud bank. Ia mengatakan ada transaksi mencurigakan dan meminta data kartu serta OTP.",
    mockType: "phone",
    sender: "Anti-Fraud Bank",
    message:
      "Kami mendeteksi transaksi sebesar Rp8.500.000. Untuk membatalkan transaksi tersebut, mohon sebutkan 3 angka CVV kartu dan kode OTP yang baru saja dikirim ke HP Anda.",
    question:
      "Apa tindakan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Memberikan CVV dan OTP agar transaksi segera dibatalkan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "Sangat berisiko. CVV dan OTP merupakan informasi rahasia yang tidak boleh diberikan kepada pihak yang menghubungi kamu."
      },
      {
        id: "b",
        text:
          "Meminta petugas menyebutkan nomor laporan sebelum memberikan data.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nomor laporan bukan bukti bahwa penelepon benar-benar berasal dari bank."
      },
      {
        id: "c",
        text:
          "Mengakhiri telepon dan menghubungi bank melalui aplikasi atau nomor resmi.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Benar. Jangan berikan CVV, OTP, atau data rahasia. Verifikasi transaksi melalui kanal resmi bank."
      },
      {
        id: "d",
        text:
          "Memberikan CVV tetapi tidak memberikan OTP.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "CVV juga merupakan data rahasia dan tidak boleh diberikan kepada penelepon."
      },
      {
        id: "e",
        text:
          "Tetap berbicara dengan petugas sambil membuka aplikasi bank untuk mengecek transaksi.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Penelepon tetap dapat mengarahkan tindakan kamu selama komunikasi berlangsung."
      }
    ],
    redFlags: [
      "Meminta CVV.",
      "Meminta OTP.",
      "Menggunakan alasan transaksi darurat untuk membuat korban panik."
    ],
    goldenRule:
      "Bank tidak membutuhkan OTP, PIN, atau CVV kamu melalui telepon."
  },

  {
    id: "post-2",
    pairId: "pair-apk-wa",
    category: "APK Berbahaya",
    modusType: "Penyebaran APK Surat Tilang",
    title: "Surat Tilang ETLE via WhatsApp",
    difficulty: "Sedang",
    context:
      "Kamu menerima WhatsApp yang mengatasnamakan pihak kepolisian dan mengirimkan file surat tilang.",
    mockType: "whatsapp",
    sender: "Layanan ETLE",
    message:
      "Kendaraan Anda tercatat melakukan pelanggaran lalu lintas. Silakan buka file Surat_Tilang_ETLE.apk untuk melihat bukti pelanggaran dan melakukan konfirmasi.",
    question:
      "Apa tindakan yang paling aman?",
    options: [
      {
        id: "a",
        text:
          "Membuka file APK untuk memastikan apakah kendaraanmu benar terkena tilang.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "File APK dari WhatsApp dapat berisi malware. Jangan memasang aplikasi dari sumber tersebut."
      },
      {
        id: "b",
        text:
          "Meminta pengirim mengirim ulang file tersebut dalam format PDF.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Mengubah format file tidak menyelesaikan masalah keaslian pengirim. Verifikasi melalui kanal resmi."
      },
      {
        id: "c",
        text:
          "Tidak membuka APK dan mengecek informasi tilang melalui kanal resmi kepolisian.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Benar. Jangan memasang APK dari pesan. Informasi tilang harus diperiksa melalui kanal resmi."
      },
      {
        id: "d",
        text:
          "Menyimpan file terlebih dahulu dan membukanya setelah memastikan ponsel tidak digunakan untuk mobile banking.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Menunda instalasi tidak membuat APK menjadi aman."
      },
      {
        id: "e",
        text:
          "Menanyakan nomor kendaraan yang tercatat kepada pengirim sebelum membuka file.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Informasi kendaraan dapat diperoleh dari berbagai sumber dan bukan bukti keaslian pengirim."
      }
    ],
    redFlags: [
      "File berformat .apk.",
      "File dikirim melalui WhatsApp.",
      "Mengatasnamakan institusi resmi."
    ],
    goldenRule:
      "Jangan instal APK yang dikirim melalui WhatsApp, SMS, atau Telegram."
  },

  {
    id: "post-3",
    pairId: "pair-phishing-link",
    category: "Phishing",
    modusType: "Phishing Link",
    title: "Link Upgrade Kartu",
    difficulty: "Sedang",
    context:
      "Kamu mendapatkan pesan yang menawarkan penggantian kartu bank secara online tanpa biaya.",
    mockType: "sms",
    sender: "BANK-NOTIFICATION",
    message:
      "Kartu Anda dapat di-upgrade ke kartu contactless tanpa biaya. Lengkapi data melalui link berikut agar kartu dikirim ke rumah: https://bank-upgrade-kartu.cc/form",
    question:
      "Apa tindakan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Membuka link dan mengisi data kartu agar proses upgrade segera dilakukan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "Link tersebut menggunakan domain yang tidak dapat dipastikan sebagai domain resmi bank."
      },
      {
        id: "b",
        text:
          "Membuka link tetapi tidak memasukkan PIN.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Tidak memasukkan PIN bukan berarti aman. Data kartu lainnya tetap dapat disalahgunakan."
      },
      {
        id: "c",
        text:
          "Meneruskan pesan kepada teman yang mungkin membutuhkan upgrade kartu.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Menyebarkan link yang belum diverifikasi dapat membuat orang lain menjadi korban."
      },
      {
        id: "d",
        text:
          "Mengabaikan link dan melakukan pengecekan melalui aplikasi atau website resmi bank.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Benar. Akses layanan perbankan melalui kanal resmi yang kamu buka sendiri."
      },
      {
        id: "e",
        text:
          "Mencari nama bank di mesin pencari lalu menggunakan link pertama yang muncul.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Hasil pencarian pertama tidak selalu menjadi kanal resmi. Pastikan domain resmi bank."
      }
    ],
    redFlags: [
      "Link berasal dari pesan.",
      "Domain tidak menggunakan domain resmi bank.",
      "Pengguna diarahkan mengisi data kartu."
    ],
    goldenRule:
      "Jangan login atau mengisi data perbankan melalui link yang datang dari SMS atau chat."
  },

  {
    id: "post-4",
    pairId: "pair-soceng-deposit",
    category: "Social Engineering",
    modusType: "Social Engineering Skema Freelance",
    title: "Tugas Review dengan Top-Up",
    difficulty: "Sedang",
    context:
      "Kamu mendapatkan tawaran pekerjaan online untuk memberikan rating dan review produk.",
    mockType: "telegram",
    sender: "Merchant Partnership",
    message:
      "Anda sudah mendapatkan komisi Rp150.000 dari tiga tugas pertama. Untuk membuka tugas Gold dengan komisi Rp5.000.000, silakan melakukan top-up saldo tugas sebesar Rp1.000.000.",
    question:
      "Apa keputusan yang paling aman?",
    options: [
      {
        id: "a",
        text:
          "Melakukan top-up karena sebelumnya sudah mendapatkan komisi.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "Pembayaran awal dapat digunakan sebagai umpan agar korban percaya sebelum diminta mengirim uang lebih besar."
      },
      {
        id: "b",
        text:
          "Melakukan top-up setengah nominal untuk mengurangi risiko.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Mengurangi nominal tidak menghilangkan pola penipuan."
      },
      {
        id: "c",
        text:
          "Meminta bukti pencairan anggota lain sebelum melakukan top-up.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Bukti transfer atau testimoni dalam grup dapat direkayasa."
      },
      {
        id: "d",
        text:
          "Menolak top-up, keluar dari grup, dan melaporkan akun tersebut.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Benar. Pekerjaan tidak seharusnya meminta pekerja mengirimkan uang untuk mendapatkan komisi."
      },
      {
        id: "e",
        text:
          "Meminta admin mengubah sistem menjadi pembayaran setelah pekerjaan selesai.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -5,
        feedbackReason:
          "Walaupun metode pembayaran diubah, pola penawaran tersebut tetap perlu dihindari jika meminta deposit."
      }
    ],
    redFlags: [
      "Pekerjaan sederhana dengan komisi besar.",
      "Ada pembayaran kecil sebagai umpan.",
      "Diminta melakukan top-up untuk memperoleh komisi."
    ],
    goldenRule:
      "Jangan membayar deposit atau top-up untuk mendapatkan pekerjaan atau mencairkan komisi."
  },

  {
    id: "post-5",
    pairId: "pair-qris-quishing",
    category: "Quishing (QRIS)",
    modusType: "Quishing / QRIS Tempelan",
    title: "QRIS Merchant Tidak Sesuai",
    difficulty: "Sedang",
    context:
      "Kamu sedang membeli makanan dan memindai QRIS yang tersedia di meja kasir.",
    mockType: "qris",
    sender: "QRIS Merchant",
    message:
      "Setelah QRIS dipindai, aplikasi menampilkan nama penerima: YAYASAN PEDULI BERSAMA. Nama merchant yang kamu datangi adalah Dapur Nusantara.",
    question:
      "Apa tindakan yang paling tepat?",
    options: [
      {
        id: "a",
        text:
          "Tetap membayar karena QRIS tersebut berada di meja kasir.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -20,
        feedbackReason:
          "Posisi QRIS di merchant tidak menjamin QRIS tersebut benar."
      },
      {
        id: "b",
        text:
          "Membayar nominal kecil terlebih dahulu untuk memastikan QRIS dapat digunakan.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Transaksi kecil tetap dapat masuk ke rekening yang salah."
      },
      {
        id: "c",
        text:
          "Menanyakan kepada kasir mengapa nama penerima berbeda dan meminta QRIS resmi merchant.",
        isCorrect: true,
        isRisky: false,
        scoreImpact: 20,
        feedbackReason:
          "Benar. Perbedaan nama penerima harus dikonfirmasi sebelum pembayaran."
      },
      {
        id: "d",
        text:
          "Membayar terlebih dahulu lalu meminta kasir mengecek transaksi setelahnya.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -15,
        feedbackReason:
          "Verifikasi harus dilakukan sebelum transaksi, bukan setelah uang terkirim."
      },
      {
        id: "e",
        text:
          "Membayar jika nominalnya kecil karena kerugian yang mungkin terjadi dianggap tidak besar.",
        isCorrect: false,
        isRisky: true,
        scoreImpact: -10,
        feedbackReason:
          "Nominal kecil tetap merupakan transaksi ke rekening yang belum terverifikasi."
      }
    ],
    redFlags: [
      "Nama penerima berbeda dari merchant.",
      "QRIS dapat ditempeli atau diganti.",
      "Verifikasi dilakukan sebelum memasukkan PIN."
    ],
    goldenRule:
      "Selalu cocokkan nama penerima dengan merchant sebelum memasukkan PIN pembayaran."
  }
]

// ==========================================
// FORMULA & PARAMETER STATISTIK BEHAVIORAL & FINANCIAL IMPACT (SUBBAB 4.3)
// ==========================================

// Benchmark Data OJK & IASC (22 Nov 2024 - 28 Des 2025)
export const IMPACT_BENCHMARK_OJK = {
  totalReports: 411055,
  totalLossRupiah: 9000000000000, // Rp 9 Triliun
  averageLossPerReport: 21894880, // Rp 21,89 Juta / laporan
  averageLossPerReportFormatted: "Rp 21,89 Juta",
  potentialLossAvoidedPer1kMultiplier: 21890000000, // Rp 21,89 Miliar per 1.000 laporan * X%
  updatedReports2026: 608167,
  reportedAccounts2026: 1085607,
  blockedAccounts2026: 557751,
  blockedFundsRupiah2026: 674100000000 // Rp 674,1 Miliar
}

/**
 * Menghitung Risky Action Rate (%)
 * Risky Action Rate = (Jumlah tindakan berisiko / Total respons skenario) * 100%
 */
export function calculateRiskyActionRate(riskyCount, totalResponses) {
  if (!totalResponses || totalResponses <= 0) return 0
  return Number(((riskyCount / totalResponses) * 100).toFixed(2))
}

/**
 * Menghitung Behavioral Impact (%)
 * Behavioral Impact = Risky Action Rate (Pre) - Risky Action Rate (Post)
 */
export function calculateBehavioralImpact(preRiskyRate, postRiskyRate) {
  return Number((preRiskyRate - postRiskyRate).toFixed(2))
}

/**
 * Menghitung Relative Reduction (X%)
 * Relative Reduction = [(Risky Action Rate (Pre) - Risky Action Rate (Post)) / Risky Action Rate (Pre)] * 100%
 */
export function calculateRelativeReduction(preRiskyRate, postRiskyRate) {
  if (!preRiskyRate || preRiskyRate <= 0) {
    return postRiskyRate === 0 ? 100 : 0
  }
  const reduction = ((preRiskyRate - postRiskyRate) / preRiskyRate) * 100
  return Number(Math.max(0, Math.min(100, reduction)).toFixed(2))
}

/**
 * Menghitung Estimasi Potential Loss Avoided per 1.000 Laporan
 * Potential Loss Avoided(1.000) = 1.000 * X% * Rp 21,89 Juta = Rp 21,89 Miliar * X%
 */
export function calculatePotentialLossAvoided1k(relativeReductionPercent) {
  const fraction = (relativeReductionPercent || 0) / 100
  return Number((IMPACT_BENCHMARK_OJK.potentialLossAvoidedPer1kMultiplier * fraction).toFixed(0))
}

/**
 * Menghitung Net Benefit & Projected ROI
 * Net Benefit = Potential Financial Benefit - Implementation Cost
 * ROI = [(Potential Financial Benefit - Implementation Cost) / Implementation Cost] * 100%
 */
export function calculateROI(potentialFinancialBenefit, implementationCost) {
  const cost = Number(implementationCost) || 1
  const benefit = Number(potentialFinancialBenefit) || 0
  const netBenefit = benefit - cost
  const roi = ((benefit - cost) / cost) * 100
  return {
    netBenefit: Number(netBenefit.toFixed(0)),
    roiPercent: Number(roi.toFixed(2))
  }
}

// Format Rupiah Helper
export function formatRupiah(number) {
  if (isNaN(number)) return "Rp 0"
  if (number >= 1000000000000) {
    return `Rp ${(number / 1000000000000).toFixed(2)} Triliun`
  }
  if (number >= 1000000000) {
    return `Rp ${(number / 1000000000).toFixed(2)} Miliar`
  }
  if (number >= 1000000) {
    return `Rp ${(number / 1000000).toFixed(2)} Juta`
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number)
}

// ==========================================
// KUESIONER EVALUASI PASCA-CHALLENGE: ATTENTION, REPETITION, INTENTION (ARI)
// ==========================================
export const ARI_SURVEY_QUESTIONS = [
  {
    id: "ari_attention",
    pillar: "Attention",
    title: "Tingkat Perhatian & Fokus (Attention)",
    question: "Seberapa tinggi tingkat fokus dan perhatian Anda saat mengenali ciri-ciri manipulasi penipuan di skenario tadi?",
    options: [
      { score: 5, label: "Sangat Fokus & Teliti", desc: "Mampu mengenali detail red flags dengan cepat" },
      { score: 4, label: "Cukup Fokus", desc: "Memperhatikan sebagian besar indikator kecurigaan" },
      { score: 3, label: "Biasa Saja / Netral", desc: "Membaca sekilas tanpa analisis mendalam" },
      { score: 2, label: "Kurang Fokus", desc: "Sempat terkecoh oleh urgensi pesan" },
      { score: 1, label: "Sangat Tidak Fokus", desc: "Langsung memilih tanpa memeriksa detail" }
    ]
  },
  {
    id: "ari_repetition",
    pillar: "Repetition",
    title: "Kebutuhan Latihan Berkala (Repetition)",
    question: "Seberapa penting menurut Anda melakukan simulasi tantangan seperti ini secara rutin untuk menjaga refleks keamanan?",
    options: [
      { score: 5, label: "Sangat Perlu (Rutin Mingguan/Bulanan)", desc: "Sangat efektif mempertahankan kewaspadaan" },
      { score: 4, label: "Perlu Secara Berkala", desc: "Membantu mengingat modus-modus baru" },
      { score: 3, label: "Cukup Sekali-kali", desc: "Hanya saat ada isu modus viral" },
      { score: 2, label: "Kurang Perlu", desc: "Cukup membaca artikel edukasi saja" },
      { score: 1, label: "Tidak Perlu Sama Sekali", desc: "Merasa sudah cukup paham tanpa latihan" }
    ]
  },
  {
    id: "ari_intention",
    pillar: "Intention",
    title: "Komitmen Tindakan Aman (Intention)",
    question: "Seberapa kuat komitmen Anda untuk menerapkan aturan keamanan (tidak bagi OTP, tolak APK, cek QRIS) di kehidupan nyata?",
    options: [
      { score: 5, label: "Sangat Kuat & Berkomitmen Penuh", desc: "Pasti menerapkan 100% dan melindungi keluarga" },
      { score: 4, label: "Kuat", desc: "Akan berhati-hati sebelum melakukan transfer/klik" },
      { score: 3, label: "Cukup Kuat", desc: "Berusaha mengingat bila situasi tidak terburu-buru" },
      { score: 2, label: "Ragu-ragu", desc: "Khawatir tetap panik saat ditelepon penipu" },
      { score: 1, label: "Tidak Ada Niat Khusus", desc: "Tidak mengubah kebiasaan transaksi harian" }
    ]
  }
]

// Fungsi pemilih skenario adaptif dinamis
export function getAdaptiveScenarios({ count = 5, weakCategory = null, randomSeed = false } = {}) {
  let pool = [...ALL_SCENARIOS_POOL]

  if (randomSeed) {
    pool = pool.sort(() => Math.random() - 0.5)
  }

  // Jika ada kategori yang lemah, prioritaskan 2 skenario dari kategori tersebut
  if (weakCategory && weakCategory !== "Semua") {
    const weakMatch = pool.filter((s) => s.category === weakCategory)
    const others = pool.filter((s) => s.category !== weakCategory)
    const selected = [...weakMatch.slice(0, 2), ...others.slice(0, count - Math.min(2, weakMatch.length))]
    return selected.slice(0, count)
  }

  return pool.slice(0, count)
}

// Data awal default untuk Family Group Hub
export const DEFAULT_FAMILY_MEMBERS = [
  {
    id: "ayah",
    name: "Ayah",
    relation: "Kepala Keluarga",
    score: 40,
    status: "Rentan",
    weakCategory: "APK Berbahaya",
    lastActive: "Kemarin",
    avatarColor: "bg-blue-600",
    completedChallenges: 2,
    nudgeCount: 1,
    recommendation: "Perlu latihan ekstra membedakan file resi/tilang .apk vs dokumen asli."
  },
  {
    id: "ibu",
    name: "Ibu",
    relation: "Ibu",
    score: 55,
    status: "Rentan",
    weakCategory: "Impersonation",
    lastActive: "3 hari lalu",
    avatarColor: "bg-pink-600",
    completedChallenges: 3,
    nudgeCount: 2,
    recommendation: "Sering panik saat dihubungi CS palsu soal transaksi rekening mencurigakan."
  },
  {
    id: "kakak",
    name: "Kakak (Rian)",
    relation: "Kakak",
    score: 75,
    status: "Cukup Waspada",
    weakCategory: "Social Engineering",
    lastActive: "Hari ini",
    avatarColor: "bg-emerald-600",
    completedChallenges: 6,
    nudgeCount: 0,
    recommendation: "Perlu waspada pada penawaran jastip tiket konser & freelance like video."
  },
  {
    id: "saya",
    name: "Saya (Akun Utama)",
    relation: "Protector",
    score: 85,
    status: "Tinggi (Waspada)",
    weakCategory: "Quishing (QRIS)",
    lastActive: "Baru saja",
    avatarColor: "bg-[#0876c9]",
    completedChallenges: 8,
    nudgeCount: 0,
    recommendation: "Refleks sudah sangat baik, siap membimbing anggota keluarga lain."
  },
  {
    id: "adek",
    name: "Adek (Dinda)",
    relation: "Adik",
    score: 50,
    status: "Rentan",
    weakCategory: "Phishing",
    lastActive: "Minggu lalu",
    avatarColor: "bg-purple-600",
    completedChallenges: 1,
    nudgeCount: 3,
    recommendation: "Sering tergiur link promo diskon game & bebas admin di media sosial."
  }
]

export const BADGES_DATA = [
  {
    id: "anti-phishing",
    title: "Anti-Phishing Specialist",
    desc: "Mampu membedakan website resmi dan link tiruan dengan cermat.",
    icon: "LockKeyhole",
    unlockedScore: 60
  },
  {
    id: "otp-guardian",
    title: "OTP & PIN Guardian",
    desc: "Selalu menjaga kerahasiaan kode keamanan dari pihak mana pun.",
    icon: "Shield",
    unlockedScore: 75
  },
  {
    id: "apk-hunter",
    title: "Malware Deflector",
    desc: "Kebal terhadap jebakan file .apk resi dan undangan manipulatif.",
    icon: "Zap",
    unlockedScore: 85
  },
  {
    id: "family-protector",
    title: "Pelindung Komunitas",
    desc: "Aktif membagikan pemahaman anti-fraud ke keluarga dan rekan terdekat.",
    icon: "UsersRound",
    unlockedScore: 100
  }
]

export const PIPELINE_STEPS = [
  {
    step: 1,
    title: "Public Data Sources",
    desc: "Memantau berita publik, media sosial, dan laporan insight penipuan terbaru.",
    icon: "Search"
  },
  {
    step: 2,
    title: "Web Scraping & Filtering",
    desc: "Mengumpulkan indikator, membersihkan duplikasi data, dan menyaring anomali.",
    icon: "Filter"
  },
  {
    step: 3,
    title: "Human Analysis & Grouping",
    desc: "Tim analis mengidentifikasi pola kejahatan baru dan membandingkannya dengan database.",
    icon: "SlidersHorizontal"
  },
  {
    step: 4,
    title: "Human Validation",
    desc: "Verifikasi sumber, validasi fakta teknis, serta penentuan tingkat risiko modus.",
    icon: "CheckCheck"
  },
  {
    step: 5,
    title: "Content Creation & Challenge",
    desc: "Mengubah temuan menjadi materi skenario interaktif yang siap dipelajari pengguna.",
    icon: "BookOpen"
  }
]

// ============================================
// POINTS & REWARD GAMIFICATION DATA
// ============================================

export const POINTS_ACTIVITIES = [
  {
    id: "complete-challenge",
    activity: "Menyelesaikan Scam Challenge",
    points: 10,
    icon: "Zap",
    color: "blue"
  },
  {
    id: "perfect-score",
    activity: "Menjawab seluruh skenario dengan benar",
    points: 10,
    icon: "CheckCircle2",
    color: "emerald"
  },
  {
    id: "watch-edu-video",
    activity: "Menonton Video Edukasi #AwasModus",
    points: 2,
    icon: "Video",
    color: "cyan"
  },
  {
    id: "read-edu-article",
    activity: "Membaca Artikel Edukatips",
    points: 1,
    icon: "BookOpen",
    color: "purple"
  },
  {
    id: "new-modus",
    activity: "Mengikuti Modus Terbaru",
    points: 5,
    icon: "BookOpen",
    color: "indigo"
  },
  {
    id: "streak",
    activity: "Menjaga challenge streak",
    points: 10,
    icon: "Flame",
    color: "amber"
  },
  {
    id: "share-challenge",
    activity: "Membagikan challenge melalui Protect Others",
    points: 10,
    icon: "UsersRound",
    color: "cyan"
  }
]

export const REWARD_CATALOG = [
  {
    id: "voucher-digital",
    title: "Voucher Belanja Digital",
    desc: "Voucher e-commerce senilai Rp 25.000 untuk pengguna setia.",
    icon: "Gift",
    cost: 50,
    category: "Voucher",
    color: "blue",
    available: true
  },
  {
    id: "badge-scam-buster",
    title: "Exclusive Badge 'Scam Buster'",
    desc: "Badge eksklusif yang tampil di profil sebagai tanda penguasaan anti-fraud.",
    icon: "Medal",
    cost: 30,
    category: "Badge",
    color: "amber",
    available: true
  },
  {
    id: "priority-alert",
    title: "Priority Alert Access",
    desc: "Akses prioritas notifikasi modus penipuan terbaru sebelum dipublikasi umum.",
    icon: "Bell",
    cost: 80,
    category: "Benefit",
    color: "purple",
    available: true
  },
  {
    id: "mystery-box",
    title: "Mystery Reward Box",
    desc: "Hadiah langsung kejutan — bisa voucher, merchandise, atau benefit premium.",
    icon: "Sparkles",
    cost: 100,
    category: "Hadiah Langsung",
    color: "emerald",
    available: true
  },
  {
    id: "family-shield",
    title: "Family Shield Premium",
    desc: "Fitur Grup Keluarga premium: pantau hingga 10 anggota keluarga secara real-time.",
    icon: "Shield",
    cost: 120,
    category: "Benefit",
    color: "cyan",
    available: true
  },
  {
    id: "voucher-cashback",
    title: "Cashback Transfer Voucher",
    desc: "Voucher cashback 1% untuk 5 kali transaksi transfer berikutnya.",
    icon: "Star",
    cost: 150,
    category: "Voucher",
    color: "rose",
    available: false
  }
]

export const TIER_LEVELS = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    maxPoints: 49,
    color: "#cd7f32",
    bgColor: "from-amber-800/10 to-amber-600/5",
    borderColor: "border-amber-300",
    icon: "Shield"
  },
  {
    id: "silver",
    name: "Silver",
    minPoints: 50,
    maxPoints: 149,
    color: "#a0a0a0",
    bgColor: "from-slate-400/10 to-slate-300/5",
    borderColor: "border-slate-300",
    icon: "Award"
  },
  {
    id: "gold",
    name: "Gold",
    minPoints: 150,
    maxPoints: 299,
    color: "#f59e0b",
    bgColor: "from-yellow-500/10 to-amber-400/5",
    borderColor: "border-yellow-400",
    icon: "Crown"
  },
  {
    id: "platinum",
    name: "Platinum",
    minPoints: 300,
    maxPoints: Infinity,
    color: "#0876c9",
    bgColor: "from-blue-600/10 to-cyan-400/5",
    borderColor: "border-blue-300",
    icon: "Sparkles"
  }
]

export const LEADERBOARD_MOCK = [
  { rank: 1, name: "Andi S.", points: 385, tier: "Platinum", streak: 14 },
  { rank: 2, name: "Rina M.", points: 320, tier: "Platinum", streak: 11 },
  { rank: 3, name: "Budi P.", points: 275, tier: "Gold", streak: 9 },
  { rank: 4, name: "Sari W.", points: 210, tier: "Gold", streak: 7 },
  { rank: 5, name: "Dian K.", points: 180, tier: "Gold", streak: 6 }
]

// ============================================
// BCA OFFICIAL EDUCATION MEDIA (#AWASMODUS)
// ============================================

export const BCA_EDU_VIDEOS = [
  {
    id: "bca-vid-1",
    title: "Jangan Tertipu Website Palsu! Ingat Selalu B-C-A!",
    campaign: "#AWASMODUS",
    tagline: "Mantra Jitu Lawan Penipu",
    desc: "Kenali rumus sakti B-C-A: Buka dengan ketik manual, Cek keaslian website, Ayo bintangin di browser agar aman dari link jebakan situs palsu.",
    duration: "0:55",
    views: "2.100 Views",
    date: "26 Jan 2026",
    badge: "Utama",
    source: "Solusi BCA / #AwasModus",
    pointsAward: 2,
    mantraPoints: [
      { letter: "B", title: "Buka dengan ketik manual", desc: "Ketik alamat portal resmi langsung di browser (contoh: bca.co.id atau klikbca.com)." },
      { letter: "C", title: "Cek keaslian website", desc: "Pastikan ada ikon gembok keamanan SSL/HTTPS dan sertifikat digital resmi." },
      { letter: "A", title: "Ayo bintangin", desc: "Bookmark website resmi BCA di browser agar tidak perlu mencari di search engine yang rawan iklan palsu." }
    ]
  },
  {
    id: "bca-vid-2",
    title: "Awas Modus Situs Palsu KlikBCA Bisnis",
    campaign: "#AWASMODUS",
    tagline: "Waspada Iklan Palsu di Search Engine",
    desc: "Penipu membeli iklan berbayar di mesin pencari dengan tampilan mirip situs resmi KlikBCA Bisnis. Jangan asal klik hasil teratas.",
    duration: "0:55",
    views: "1.850 Views",
    date: "20 Jan 2026",
    badge: "Bisnis",
    source: "Berita BCA",
    pointsAward: 2,
    mantraPoints: [
      { letter: "1", title: "Jangan Klik Hasil Iklan (Ad)", desc: "Situs phishing sering dipromosikan lewat Google Ads dengan URL tiruan." },
      { letter: "2", title: "Perhatikan Typo Nama Domain", desc: "Penipu sering menggunakan nama mirip seperti klik-bca-id atau bca-online." }
    ]
  }
]

export const BCA_EDU_ARTICLES = [
  {
    id: "art-1",
    title: "Hindari Website Palsu dengan Mantra B-C-A",
    category: "Awas Modus",
    date: "9 Sep 2026",
    readTime: "2 mnt baca",
    sourceUrl: "https://www.bca.co.id/id/informasi/news-and-features/awas-modus",
    summary: "Saat ini marak website tiruan yang menyerupai internet banking. Lindungi diri Anda dengan menerapkan tiga langkah sederhana: Buka dengan ketik manual, Cek keaslian, dan Ayo bintangin.",
    content: "Penipuan bermodus website palsu kian marak. Modus ini biasanya memancing korban dengan tampilan antarmuka yang sangat mirip situs resmi bank.\n\nTips Mengamankan Diri:\n1. B - Buka dengan ketik manual: Jangan klik link dari SMS, chat WhatsApp, atau email mencurigakan.\n2. C - Cek keaslian website: Pastikan domain resmi berakhiran .bca.co.id atau .klikbca.com dan memiliki sertifikat SSL gembok hijau/aman.\n3. A - Ayo bintangin: Simpan (bookmark) alamat resmi di browser agar akses berikutnya selalu terarah ke situs yang benar.",
    pointsAward: 1
  },
  {
    id: "art-2",
    title: "Informasi Perubahan Layanan & Waspada Modus CS Palsu",
    category: "News & Features",
    date: "8 Sep 2026",
    readTime: "3 mnt baca",
    sourceUrl: "https://www.bca.co.id/id/informasi/news-and-features",
    summary: "Waspadai nomor telepon atau akun WhatsApp tidak bercentang hijau yang mengatasnamakan Bank BCA dan meminta verifikasi OTP/PIN.",
    content: "Halo BCA resmi hanya dapat dihubungi melalui nomor resmi 1500888 atau aplikasi haloBCA (bebas pulsa), serta akun WhatsApp resmi yang memiliki centang hijau terverifikasi.\n\nPetugas BCA tidak pernah:\n• Meminta kode OTP, PIN m-BCA, atau nomor CVV kartu debit/kredit.\n• Meminta nasabah menginstal file aplikasi berformat .apk.\n• Mengirimkan link pembatalan tarif transfer.",
    pointsAward: 1
  },
  {
    id: "art-3",
    title: "Tips Terhindar dari Penipuan File .APK di WhatsApp",
    category: "Edukatips",
    date: "1 Sep 2026",
    readTime: "2 mnt baca",
    sourceUrl: "https://www.bca.co.id/id/informasi/edukatips",
    summary: "Ketahui bahaya file APK undangan pernikahan, resi kurir, dan surat tilang yang dapat menyadap SMS OTP m-banking.",
    content: "File berekstensi .apk adalah paket aplikasi Android yang dapat mengakses SMS dan notifikasi tanpa izin jika diinstal.\n\nPencegahan:\n• Jangan pernah klik atau buka file .apk dari kontak tak dikenal.\n• Matikan izin 'Install unknown apps' pada pengaturan smartphone Anda.\n• Jika terlanjur terinstal, segera putuskan koneksi internet dan hubungi Halo BCA.",
    pointsAward: 1
  }
]

