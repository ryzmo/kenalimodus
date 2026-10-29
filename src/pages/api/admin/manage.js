import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { getDb, initDbSchema } from "../../../lib/db"

export default async function handler(req, res) {
  // Verifikasi role admin
  const session = await getServerSession(req, res, authOptions)
  
  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Khusus Administrator BCA." })
  }

  await initDbSchema()
  const sql = getDb()
  if (!sql) {
    return res.status(500).json({ message: "Koneksi database gagal." })
  }

  const { type } = req.query // "modus" | "scenario" | "reward" | "article" | "settings"

  try {
    // ----------------------------------------------------
    // 1. MANAJEMEN MODUS
    // ----------------------------------------------------
    if (type === "modus") {
      if (req.method === "GET") {
        const items = await sql`SELECT * FROM custom_modus ORDER BY id DESC`
        return res.status(200).json({ success: true, data: items })
      }

      if (req.method === "POST") {
        const { title, category, description, difficulty, redFlags, tips } = req.body
        const inserted = await sql`
          INSERT INTO custom_modus (title, category, description, difficulty, red_flags, prevention_tips)
          VALUES (
            ${title},
            ${category || 'Social Engineering'},
            ${description},
            ${difficulty || 'Sedang'},
            ${JSON.stringify(redFlags || [])}::jsonb,
            ${JSON.stringify(tips || [])}::jsonb
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, data: inserted[0] })
      }

      if (req.method === "DELETE") {
        const { id } = req.body
        await sql`DELETE FROM custom_modus WHERE id = ${parseInt(id, 10)}`
        return res.status(200).json({ success: true, message: "Modus berhasil dihapus" })
      }
    }

    // ----------------------------------------------------
    // 2. MANAJEMEN SOAL / SCENARIOS
    // ----------------------------------------------------
    if (type === "scenario") {
      if (req.method === "GET") {
        const items = await sql`SELECT * FROM custom_scenarios ORDER BY id DESC`
        return res.status(200).json({ success: true, data: items })
      }

      if (req.method === "POST") {
        const { title, modusType, sender, message, question, options } = req.body
        const inserted = await sql`
          INSERT INTO custom_scenarios (title, modus_type, sender, message, question, options)
          VALUES (
            ${title},
            ${modusType || 'Umum'},
            ${sender || 'Sistem BCA'},
            ${message},
            ${question},
            ${JSON.stringify(options || [])}::jsonb
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, data: inserted[0] })
      }

      if (req.method === "DELETE") {
        const { id } = req.body
        await sql`DELETE FROM custom_scenarios WHERE id = ${parseInt(id, 10)}`
        return res.status(200).json({ success: true, message: "Soal skenario berhasil dihapus" })
      }
    }

    // ----------------------------------------------------
    // 3. MANAJEMEN REWARDS & POIN
    // ----------------------------------------------------
    if (type === "reward") {
      if (req.method === "GET") {
        const items = await sql`SELECT * FROM custom_rewards ORDER BY id DESC`
        return res.status(200).json({ success: true, data: items })
      }

      if (req.method === "POST") {
        const { title, category, cost, stock, partner, description } = req.body
        const inserted = await sql`
          INSERT INTO custom_rewards (title, category, cost, stock, partner, description)
          VALUES (
            ${title},
            ${category || 'voucher'},
            ${parseInt(cost, 10) || 500},
            ${parseInt(stock, 10) || 10},
            ${partner || 'BCA'},
            ${description || ''}
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, data: inserted[0] })
      }

      if (req.method === "DELETE") {
        const { id } = req.body
        await sql`DELETE FROM custom_rewards WHERE id = ${parseInt(id, 10)}`
        return res.status(200).json({ success: true, message: "Reward berhasil dihapus" })
      }
    }

    // ----------------------------------------------------
    // 4. MANAJEMEN ARTIKEL & EDUKASI
    // ----------------------------------------------------
    if (type === "article") {
      if (req.method === "GET") {
        const items = await sql`SELECT * FROM custom_articles ORDER BY id DESC`
        return res.status(200).json({ success: true, data: items })
      }

      if (req.method === "POST") {
        const { title, contentType, rewardPoints, readingTime, author, summary, fullContent, externalUrl } = req.body
        const inserted = await sql`
          INSERT INTO custom_articles (
            title, content_type, reward_points, reading_time, author, summary, full_content, external_url
          ) VALUES (
            ${title},
            ${contentType || 'article'},
            ${parseInt(rewardPoints, 10) || 15},
            ${readingTime || '3 Menit'},
            ${author || 'Tim Edukasi Anti-Scam BCA'},
            ${summary},
            ${fullContent || ''},
            ${externalUrl || ''}
          )
          RETURNING *
        `
        return res.status(201).json({ success: true, data: inserted[0] })
      }

      if (req.method === "DELETE") {
        const { id } = req.body
        await sql`DELETE FROM custom_articles WHERE id = ${parseInt(id, 10)}`
        return res.status(200).json({ success: true, message: "Artikel berhasil dihapus" })
      }
    }

    // ----------------------------------------------------
    // 5. ATURAN POIN & PENGATURAN GLOBAL SISTEM
    // ----------------------------------------------------
    if (type === "settings") {
      if (req.method === "GET") {
        const items = await sql`SELECT * FROM app_settings ORDER BY id ASC`
        return res.status(200).json({ success: true, data: items })
      }

      if (req.method === "POST") {
        const { settings } = req.body // array of { setting_key, setting_value }
        if (Array.isArray(settings)) {
          for (const item of settings) {
            await sql`
              UPDATE app_settings
              SET setting_value = ${String(item.setting_value)},
                  updated_at = CURRENT_TIMESTAMP
              WHERE setting_key = ${item.setting_key}
            `
          }
        }
        return res.status(200).json({ success: true, message: "Pengaturan aturan poin berhasil diperbarui!" })
      }
    }

    return res.status(400).json({ message: "Tipe entitas tidak valid." })
  } catch (error) {
    console.error("Admin Manage API Error:", error)
    return res.status(500).json({ message: "Gagal memproses data admin." })
  }
}
