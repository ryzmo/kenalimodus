import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDb, initDbSchema } from "../../../lib/db"

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Akun Kenali Modus",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan kata sandi wajib diisi.")
        }

        await initDbSchema()
        const sql = getDb()
        if (!sql) {
          throw new Error("Koneksi database tidak tersedia.")
        }

        const email = credentials.email.trim().toLowerCase()

        // Ambil data user beserta role
        const users = await sql`
          SELECT id, name, email, password_hash, image, safe_score, total_points, current_streak,
                 role, failed_attempts, lockout_until
          FROM users
          WHERE email = ${email}
          LIMIT 1
        `

        if (users.length === 0) {
          throw new Error("Email atau kata sandi tidak sesuai.")
        }

        const user = users[0]

        // 1. Cek proteksi lockout Anti-Spam / Brute-force
        if (user.lockout_until) {
          const lockoutTime = new Date(user.lockout_until).getTime()
          const currentTime = Date.now()

          if (lockoutTime > currentTime) {
            const remainingSec = Math.ceil((lockoutTime - currentTime) / 1000)
            throw new Error(`Akun terkunci sementara karena salah 3x. Coba lagi dalam ${remainingSec} detik.`)
          } else {
            // Masa lockout habis, reset failed_attempts
            await sql`
              UPDATE users
              SET failed_attempts = 0, lockout_until = NULL
              WHERE id = ${user.id}
            `
            user.failed_attempts = 0
          }
        }

        // 2. Verifikasi Password
        if (!user.password_hash) {
          throw new Error("Akun ini belum memiliki kata sandi.")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

        if (!isPasswordValid) {
          const newFailedAttempts = (user.failed_attempts || 0) + 1

          if (newFailedAttempts >= 3) {
            // Kunci akun selama 60 detik (1 menit) jika gagal 3x berturut-turut
            const lockUntil = new Date(Date.now() + 60 * 1000)
            await sql`
              UPDATE users
              SET failed_attempts = ${newFailedAttempts},
                  lockout_until = ${lockUntil}
              WHERE id = ${user.id}
            `
            throw new Error("Salah kata sandi 3 kali berturut-turut. Akun dikunci selama 60 detik.")
          } else {
            const sisaKesempatan = 3 - newFailedAttempts
            await sql`
              UPDATE users
              SET failed_attempts = ${newFailedAttempts}
              WHERE id = ${user.id}
            `
            throw new Error(`Kata sandi salah. Sisa kesempatan: ${sisaKesempatan} kali.`)
          }
        }

        // 3. Login Berhasil: Reset failed_attempts & lockout
        await sql`
          UPDATE users
          SET failed_attempts = 0,
              lockout_until = NULL,
              last_active_date = CURRENT_DATE
          WHERE id = ${user.id}
        `

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || (user.email === "admin@bca.co.id" ? "admin" : "user"),
          safe_score: user.safe_score,
          total_points: user.total_points,
          current_streak: user.current_streak
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role || "user"
        session.user.safe_score = token.safe_score || 78
        session.user.total_points = token.total_points || 120
        session.user.current_streak = token.current_streak || 1
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = String(user.id)
        token.name = user.name
        token.email = user.email
        token.role = user.role || "user"
        token.safe_score = user.safe_score
        token.total_points = user.total_points
        token.current_streak = user.current_streak
      }
      return token
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "bca_kenali_modus_secret_key_2026",
}

export default NextAuth(authOptions)
