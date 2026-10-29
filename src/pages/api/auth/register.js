import bcrypt from "bcryptjs"
import { getDb, initDbSchema } from "../../../lib/db"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan kata sandi wajib diisi." })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Kata sandi minimal 6 karakter." })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()

    await initDbSchema()
    const sql = getDb()
    if (!sql) {
      return res.status(500).json({ message: "Gagal menghubungkan ke database Neon." })
    }

    // Periksa apakah email sudah terdaftar
    const existing = await sql`
      SELECT id FROM users WHERE email = ${cleanEmail} LIMIT 1
    `

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email ini sudah terdaftar. Silakan login." })
    }

    // Hash password dengan bcrypt
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Simpan user baru ke database Neon (tanpa phone_number)
    const inserted = await sql`
      INSERT INTO users (
        name,
        email,
        password_hash,
        safe_score,
        total_points,
        current_streak
      ) VALUES (
        ${cleanName},
        ${cleanEmail},
        ${passwordHash},
        78,
        120,
        1
      )
      RETURNING id, name, email, safe_score, total_points
    `

    const newUser = inserted[0]

    return res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil! Silakan masuk.",
      user: newUser
    })
  } catch (error) {
    console.error("Register Error:", error)
    return res.status(500).json({ message: "Terjadi kesalahan pada server saat mendaftar." })
  }
}

