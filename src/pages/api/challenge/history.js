import { getDb, initDbSchema } from "../../../lib/db"

export default async function handler(req, res) {
  await initDbSchema()
  const sql = getDb()

  if (!sql) {
    return res.status(500).json({ message: "Database tidak tersedia." })
  }

  // GET: Ambil histori challenge dan statistik rata-rata
  if (req.method === "GET") {
    const { userId, participantName } = req.query

    try {
      let sessions = []
      if (userId) {
        sessions = await sql`
          SELECT * FROM challenge_sessions
          WHERE user_id = ${parseInt(userId, 10)}
          ORDER BY created_at DESC
        `
      } else if (participantName) {
        sessions = await sql`
          SELECT * FROM challenge_sessions
          WHERE participant_name = ${participantName}
          ORDER BY created_at DESC
        `
      } else {
        sessions = await sql`
          SELECT * FROM challenge_sessions
          ORDER BY created_at DESC
          LIMIT 20
        `
      }

      // Hitung agregat rata-rata
      const totalSessions = sessions.length
      const avgScore = totalSessions > 0
        ? Math.round(sessions.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalSessions)
        : 0

      const latestScore = totalSessions > 0 ? sessions[0].score : 0

      return res.status(200).json({
        success: true,
        data: {
          totalSessions,
          avgScore,
          latestScore,
          history: sessions
        }
      })
    } catch (e) {
      console.error("Fetch challenge history error:", e)
      return res.status(500).json({ message: "Gagal mengambil riwayat challenge" })
    }
  }

  // POST: Simpan sesi challenge baru, hitung rata-rata akumulatif, dan update poin ke database
  if (req.method === "POST") {
    const {
      userId,
      participantName = "Nasabah",
      score,
      totalQuestions = 5,
      correctCount = 0,
      failedCount = 0,
      evaluationHeadline = "Challenge Selesai",
      details = [],
      pointsEarned = 20
    } = req.body

    try {
      const parsedUserId = userId ? parseInt(userId, 10) : null

      // 1. Simpan sesi ke tabel challenge_sessions
      const inserted = await sql`
        INSERT INTO challenge_sessions (
          user_id, participant_name, score, total_questions,
          correct_count, failed_count, evaluation_headline,
          details_json, points_earned
        )
        VALUES (
          ${parsedUserId}, ${participantName}, ${score}, ${totalQuestions},
          ${correctCount}, ${failedCount}, ${evaluationHeadline},
          ${JSON.stringify(details)}, ${pointsEarned}
        )
        RETURNING *
      `

      // 2. Jika ada userId, hitung nilai rata-rata keseluruhan dari seluruh sesi di database
      let avgScore = score
      let newTotalPoints = pointsEarned

      if (parsedUserId) {
        const stats = await sql`
          SELECT 
            ROUND(AVG(score)) as avg_score,
            COUNT(*) as session_count
          FROM challenge_sessions
          WHERE user_id = ${parsedUserId}
        `

        avgScore = stats[0]?.avg_score ? parseInt(stats[0].avg_score, 10) : score

        // Ambil data user sekarang
        const userRow = await sql`
          SELECT total_points, current_streak FROM users
          WHERE id = ${parsedUserId}
          LIMIT 1
        `

        const currPoints = userRow[0]?.total_points ?? 0
        const currStreak = userRow[0]?.current_streak ?? 1
        newTotalPoints = currPoints + pointsEarned

        // Update safe_score user menjadi rata-rata keseluruhan dan tambah poin
        await sql`
          UPDATE users
          SET safe_score = ${avgScore},
              total_points = ${newTotalPoints},
              current_streak = ${currStreak + 1},
              last_active_date = CURRENT_DATE,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parsedUserId}
        `

        // Catat ke user_point_history
        await sql`
          INSERT INTO user_point_history (
            user_id, activity_type, description, points_changed
          )
          VALUES (
            ${parsedUserId},
            'challenge_reward',
            ${'Menyelesaikan Challenge Safe Score ' + score + '/100'},
            ${pointsEarned}
          )
        `

        // 3. Update juga di anggota keluarga jika user terhubung ke grup keluarga
        await sql`
          UPDATE family_members
          SET safe_score = ${avgScore},
              vulnerability_status = CASE 
                WHEN ${avgScore} >= 80 THEN 'Waspada'
                WHEN ${avgScore} >= 60 THEN 'Cukup Waspada'
                ELSE 'Rentan'
              END,
              completed_challenges = completed_challenges + 1
          WHERE user_id = ${parsedUserId}
        `
      }

      return res.status(200).json({
        success: true,
        message: "Sesi challenge berhasil disimpan ke database",
        session: inserted[0],
        avgScore,
        newTotalPoints
      })
    } catch (e) {
      console.error("Save challenge session error:", e)
      return res.status(500).json({ message: "Gagal menyimpan sesi challenge" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

