// Helper untuk mode presentasi dummy di Kenali Modus

export function isPresentationMode() {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem("km_presentation_mode") === "true"
  } catch (e) {
    return false
  }
}

export function setPresentationMode(val) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("km_presentation_mode", val ? "true" : "false")
    window.dispatchEvent(new Event("presentation-mode-changed"))
  } catch (e) {
    console.error(e)
  }
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
      score: 64,
      status: "Cukup Waspada",
      weakCategory: "Social Engineering CS",
      avatarColor: "bg-amber-600",
      completedChallenges: 5,
      lastActive: "3 hari lalu"
    },
    {
      id: "demo-4",
      name: "Rina Santoso (Adik)",
      role: "Anak",
      relation: "Adik",
      score: 92,
      status: "Waspada",
      weakCategory: "Quishing QRIS",
      avatarColor: "bg-emerald-600",
      completedChallenges: 14,
      lastActive: "Hari ini"
    }
  ],
  rewardHistoryLog: [
    {
      id: "demo-log-1",
      activity: "Menyelesaikan 2-Min Scam Challenge (Sempurna)",
      points: 30,
      date: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "demo-log-2",
      activity: "Tukar Reward: Voucher Belanja Digital Rp 25.000",
      points: -500,
      date: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "demo-log-3",
      activity: "Bonus Challenge Streak 5 Hari Berturut-turut",
      points: 20,
      date: new Date(Date.now() - 172800000).toISOString()
    }
  ],
  challengeHistory: [
    {
      id: "demo-ch-1",
      score: 86,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      total_questions: 5,
      correct_count: 4,
      failed_count: 1
    },
    {
      id: "demo-ch-2",
      score: 100,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      total_questions: 5,
      correct_count: 5,
      failed_count: 0
    },
    {
      id: "demo-ch-3",
      score: 80,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      total_questions: 5,
      correct_count: 4,
      failed_count: 1
    }
  ]
}

