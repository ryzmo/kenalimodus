// Helper untuk mode presentasi dummy di Kenali Modus (Tersinkronisasi Realtime Antar-Device lewat NeonDB)

export function isPresentationMode() {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem("km_presentation_mode") === "true"
  } catch (e) {
    return false
  }
}

// Update mode presentasi baik di memori/storage lokal maupun tersimpan di database global
export async function setPresentationMode(val) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("km_presentation_mode", val ? "true" : "false")
    window.dispatchEvent(new Event("presentation-mode-changed"))

    // Sync ke backend database Neon
    await fetch("/api/presentation-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !!val })
    })
  } catch (e) {
    console.error("Gagal sinkronisasi setPresentationMode:", e)
  }
}

// Fungsi sinkronisasi realtime dari database global
export async function syncPresentationModeFromServer() {
  if (typeof window === "undefined") return false
  try {
    const res = await fetch("/api/presentation-mode?t=" + Date.now())
    const json = await res.json()
    if (json && json.success) {
      const serverVal = !!json.enabled
      const localVal = localStorage.getItem("km_presentation_mode") === "true"

      if (serverVal !== localVal) {
        localStorage.setItem("km_presentation_mode", serverVal ? "true" : "false")
        window.dispatchEvent(new Event("presentation-mode-changed"))
      }
      return serverVal
    }
  } catch (e) {
    console.error("Gagal syncPresentationModeFromServer:", e)
  }
  return isPresentationMode()
}

export const DUMMY_PRESENTATION_DATA = {
  userName: "Budi Santoso",
  safeScore: 86,
  totalPoints: 1450,
  currentStreak: 5,
  avgScore: 84,
  latestScore: 86,
  totalSessions: 12,
  familyGroupName: "Keluarga Santoso",
  familyScore: 82,
  familyMembers: [
    {
      id: "demo-1",
      name: "Budi Santoso (Saya)",
      role: "Kepala Keluarga",
      relation: "Saya",
      score: 86,
      status: "Waspada",
      weakCategory: "Phishing Link",
      avatarColor: "bg-blue-600",
      completedChallenges: 12,
      lastActive: "Hari ini"
    },
    {
      id: "demo-2",
      name: "Siti Rahma (Ibu)",
      role: "Orang Tua",
      relation: "Ibu",
      score: 48,
      status: "Rentan",
      weakCategory: "Modus APK Undangan",
      avatarColor: "bg-rose-600",
      completedChallenges: 3,
      lastActive: "Kemarin"
    },
    {
      id: "demo-3",
      name: "Joko Santoso (Ayah)",
      role: "Orang Tua",
      relation: "Ayah",
      score: 52,
      status: "Rentan",
      weakCategory: "CS Palsu Halo BCA",
      avatarColor: "bg-amber-600",
      completedChallenges: 4,
      lastActive: "2 hari lalu"
    },
    {
      id: "demo-4",
      name: "Rina Santoso (Anak)",
      role: "Anak",
      relation: "Anak",
      score: 94,
      status: "Aman",
      weakCategory: "Sosial Media",
      avatarColor: "bg-emerald-600",
      completedChallenges: 18,
      lastActive: "Hari ini"
    }
  ],
  rewardHistoryLog: [
    {
      id: "demo-log-1",
      rewardTitle: "Voucher Bebas Transfer BCA (5x)",
      pointsCost: 350,
      claimedAt: "Kemarin, 14:20 WIB",
      status: "Berhasil Dipakai",
      code: "BCA-FREE-TRF-9821"
    },
    {
      id: "demo-log-2",
      rewardTitle: "E-Wallet Gopay Rp25.000",
      pointsCost: 500,
      claimedAt: "2 hari lalu",
      status: "Terkirim",
      code: "GOPAY-BCA-5512"
    }
  ],
  challengeHistoryLog: [
    {
      id: "demo-ch-1",
      score: 80,
      evaluation_headline: "Resisten Sangat Baik (Cenderung Waspada)",
      created_at: new Date().toISOString(),
      total_questions: 5,
      correct_count: 4,
      failed_count: 1,
      points_earned: 20,
      details_json: [
        {
          title: "Modus Panggilan CS Halo BCA Palsu",
          category: "Social Engineering",
          isCorrect: true,
          chosenText: "Matikan telepon dan hubungi Halo BCA resmi di 1500888",
          feedback: "Pilihan sangat tepat. BCA tidak pernah meminta data rahasia."
        },
        {
          title: "Link Pembatalan Tarif Rp150.000 Palsu",
          category: "Phishing",
          isCorrect: true,
          chosenText: "Abaikan SMS dan jangan pernah klik tautan",
          feedback: "BCA tidak menaikkan tarif secara sepihak lewat tautan SMS."
        },
        {
          title: "File Undangan Pernikahan .APK",
          category: "Malware APK",
          isCorrect: false,
          chosenText: "Download file untuk melihat isi undangan",
          feedback: "Waspada! File .apk mencuri SMS OTP perbankan secara diam-diam."
        },
        {
          title: "Stiker QRIS Palsu Tertimpa di Toko",
          category: "QRIS Palsu",
          isCorrect: true,
          chosenText: "Cocokkan nama merchant di layar HP dengan kasir toko",
          feedback: "Nama merchant wajib terverifikasi sebelum memasukkan PIN."
        },
        {
          title: "Penawaran Kerja Paruh Waktu Like & Subscribe Telegram",
          category: "Job Scam",
          isCorrect: true,
          chosenText: "Tolak dan jangan transfer uang deposit",
          feedback: "Trik skema ponzi yang meminta deposit awal untuk tugas harian."
        }
      ]
    },
    {
      id: "demo-ch-2",
      score: 100,
      evaluation_headline: "Sempurna Tanpa Celah (Refleks Teladan)",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      total_questions: 5,
      correct_count: 5,
      failed_count: 0,
      points_earned: 20,
      details_json: [
        {
          title: "Modus Tilang Elektronik APK",
          category: "APK Berbahaya",
          isCorrect: true,
          chosenText: "Abaikan dan konfirmasi melalui situs resmi Korlantas",
          feedback: "Langkah tepat dan aman."
        },
        {
          title: "Promo Hadiah Mengatasnamakan BCA",
          category: "Phishing",
          isCorrect: true,
          chosenText: "Cek kanal resmi bca.co.id/promo",
          feedback: "Mantra B-C-A berhasil dijalankan dengan sangat baik."
        }
      ]
    }
  ]
}
