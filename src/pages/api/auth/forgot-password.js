import crypto from "crypto"
import bcrypt from "bcryptjs"
import { getDb, initDbSchema } from "../../../lib/db"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { action, email, token, newPassword } = req.body

  await initDbSchema()
  const sql = getDb()
  if (!sql) {
    return res.status(500).json({ message: "Koneksi database tidak tersedia." })
  }

  // ACTION 1: Request Kode / Token Reset Password
  if (action === "request") {
    if (!email) {
      return res.status(400).json({ message: "Email wajib diisi." })
    }

    const cleanEmail = email.trim().toLowerCase()
    const users = await sql`
      SELECT id, name FROM users WHERE email = ${cleanEmail} LIMIT 1
    `

    if (users.length === 0) {
      // Keamanan: Jangan beri tahu apakah email terdaftar atau tidak
      return res.status(200).json({
        success: true,
        message: "Jika email terdaftar, kode verifikasi reset kata sandi telah dibuat."
      })
    }

    const user = users[0]
    // Buat kode verifikasi 6-digit untuk kemudahan input nasabah
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // Berlaku 15 menit

    await sql`
      UPDATE users
      SET reset_token = ${resetCode},
          reset_token_expiry = ${expiry}
      WHERE id = ${user.id}
    `

    return res.status(200).json({
      success: true,
      message: "Kode pemulihan berhasil dibuat.",
      // Kode verifikasi di-return di response agar user bisa langsung memasukkannya tanpa perlu email provider eksternal
      demoResetCode: resetCode
    })
  }

  // ACTION 2: Konfirmasi Reset Kata Sandi dengan Token / Kode
  if (action === "confirm") {
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Email, kode token, dan kata sandi baru wajib diisi." })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Kata sandi baru minimal 6 karakter." })
    }

    const cleanEmail = email.trim().toLowerCase()
    const users = await sql`
      SELECT id, reset_token, reset_token_expiry FROM users WHERE email = ${cleanEmail} LIMIT 1
    `

    if (users.length === 0) {
      return res.status(400).json({ message: "Permintaan reset tidak valid." })
    }

    const user = users[0]

    if (!user.reset_token || user.reset_token !== token.trim()) {
      return res.status(400).json({ message: "Kode pemulihan salah atau tidak sesuai." })
    }

    if (new Date(user.reset_token_expiry).getTime() < Date.now()) {
      return res.status(400).json({ message: "Kode pemulihan telah kedaluwarsa. Silakan ajukan ulang." })
    }

    // Hash kata sandi baru
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Reset lockout & password
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash},
          reset_token = NULL,
          reset_token_expiry = NULL,
          failed_attempts = 0,
          lockout_until = NULL
      WHERE id = ${user.id}
    `

    return res.status(200).json({
      success: true,
      message: "Kata sandi Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru."
    })
  }

  return res.status(400).json({ message: "Aksi tidak dikenal." })
}

