import { getDb, initDbSchema } from "@/lib/db"

export default async function handler(req, res) {
  // Prevent any caching on CDN / Vercel Edge / Browser
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0")
  res.setHeader("Pragma", "no-cache")
  res.setHeader("Expires", "0")

  await initDbSchema()
  const sql = getDb()
  if (!sql) {
    return res.status(500).json({ success: false, message: "Database connection failed" })
  }

  // GET: Baca status mode presentasi global
  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT setting_value FROM app_settings 
        WHERE setting_key = 'presentation_mode' 
        LIMIT 1
      `
      const isEnabled = rows.length > 0 && rows[0].setting_value === "true"
      return res.status(200).json({ success: true, enabled: isEnabled })
    } catch (err) {
      console.error("Gagal get presentation_mode:", err)
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  // POST: Update status mode presentasi global (Admin / Penguji)
  if (req.method === "POST") {
    try {
      const { enabled } = req.body
      const valStr = enabled ? "true" : "false"

      await sql`
        INSERT INTO app_settings (setting_key, setting_value, description)
        VALUES ('presentation_mode', ${valStr}, 'Status global mode presentasi')
        ON CONFLICT (setting_key) DO UPDATE
        SET setting_value = ${valStr},
            updated_at = CURRENT_TIMESTAMP
      `
      return res.status(200).json({ success: true, enabled: !!enabled })
    } catch (err) {
      console.error("Gagal set presentation_mode:", err)
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

