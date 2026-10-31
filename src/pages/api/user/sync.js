import { getDb, initDbSchema } from "../../../lib/db"

export default async function handler(req, res) {
  await initDbSchema()
  const sql = getDb()

  if (!sql) {
    return res.status(500).json({ message: "Database tidak tersedia." })
  }

  // GET: Ambil progres user dari Neon PostgreSQL
  if (req.method === "GET") {
    const { userId } = req.query
    if (!userId) {
      return res.status(400).json({ message: "userId diperlukan" })
    }

    try {
      const users = await sql`
        SELECT id, name, email, safe_score, total_points, current_streak, tier_id
        FROM users
        WHERE id = ${parseInt(userId, 10)}
        LIMIT 1
      `

      if (users.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" })
      }

      return res.status(200).json({
        success: true,
        data: users[0]
      })
    } catch (e) {
      console.error("Fetch progress error:", e)
      return res.status(500).json({ message: "Gagal mengambil progres" })
    }
  }

  // POST: Sinkronisasi simpan skor, poin, dan streak ke Neon DB
  if (req.method === "POST") {
    const { userId, safeScore, totalPoints, currentStreak, activityType, description, pointsAdded } = req.body

    if (!userId) {
      return res.status(400).json({ message: "userId diperlukan untuk sinkronisasi" })
    }

    try {
      const parsedUserId = parseInt(userId, 10)

      let updated
      if (pointsAdded) {
        updated = await sql`
          UPDATE users
          SET safe_score = COALESCE(${safeScore}, safe_score),
              total_points = COALESCE(total_points, 0) + ${parseInt(pointsAdded, 10)},
              current_streak = COALESCE(${currentStreak}, current_streak),
              last_active_date = CURRENT_DATE,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parsedUserId}
          RETURNING id, name, email, safe_score, total_points, current_streak
        `

        // Catat ke user_point_history jika ada penambahan poin
        await sql`
          INSERT INTO user_point_history (
            user_id, activity_type, description, points_changed
          )
          VALUES (
            ${parsedUserId},
            ${activityType || 'edu_claim'},
            ${description || 'Klaim poin edukasi'},
            ${parseInt(pointsAdded, 10)}
          )
        `
      } else {
        updated = await sql`
          UPDATE users
          SET safe_score = COALESCE(${safeScore}, safe_score),
              total_points = COALESCE(${totalPoints}, total_points),
              current_streak = COALESCE(${currentStreak}, current_streak),
              last_active_date = CURRENT_DATE,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${parsedUserId}
          RETURNING id, name, email, safe_score, total_points, current_streak
        `
      }

      if (updated.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" })
      }

      return res.status(200).json({
        success: true,
        message: "Progres berhasil disinkronkan ke Cloud Neon DB",
        data: updated[0]
      })
    } catch (e) {
      console.error("Sync progress error:", e)
      return res.status(500).json({ message: "Gagal menyinkronkan progres" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

