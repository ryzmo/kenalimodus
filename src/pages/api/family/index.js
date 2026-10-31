import { getDb, initDbSchema } from "../../../lib/db"

export default async function handler(req, res) {
  await initDbSchema()
  const sql = getDb()

  if (!sql) {
    return res.status(500).json({ message: "Database tidak tersedia." })
  }

  // GET: Ambil grup keluarga & anggotanya
  if (req.method === "GET") {
    const { userId } = req.query

    try {
      let group = null
      let members = []

      if (userId) {
        // Cek apakah user pembuat grup atau anggota grup
        const userGroups = await sql`
          SELECT fg.* FROM family_groups fg
          LEFT JOIN family_members fm ON fm.group_id = fg.id
          WHERE fg.created_by = ${parseInt(userId, 10)} OR fm.user_id = ${parseInt(userId, 10)}
          LIMIT 1
        `
        if (userGroups.length > 0) {
          group = userGroups[0]
        }
      }

      // Jika belum ada grup, ambil grup pertama atau buat default di DB
      if (!group) {
        const anyGroup = await sql`SELECT * FROM family_groups LIMIT 1`
        if (anyGroup.length > 0) {
          group = anyGroup[0]
        } else {
          // Buat grup awal jika tabel masih kosong
          const newGroup = await sql`
            INSERT INTO family_groups (group_name, invite_code, family_defense_index, vulnerable_members_count)
            VALUES ('Keluarga Sejahtera BCA', 'AMAN-BCA-778', 78.0, 1)
            RETURNING *
          `
          group = newGroup[0]

          // Seed anggota awal ke DB
          await sql`
            INSERT INTO family_members (group_id, member_name, role_in_family, relation, safe_score, vulnerability_status, weak_category, avatar_color, completed_challenges)
            VALUES
              (${group.id}, 'Saya', 'Kepala Keluarga', 'Saya', 84, 'Waspada', 'Phishing URL', 'bg-blue-600', 3),
              (${group.id}, 'Ibu Siti', 'Orang Tua', 'Ibu', 48, 'Rentan', 'APK Palsu', 'bg-rose-600', 1),
              (${group.id}, 'Ayah Joko', 'Orang Tua', 'Ayah', 62, 'Cukup Waspada', 'Social Engineering', 'bg-amber-600', 2),
              (${group.id}, 'Adik Rina', 'Anak', 'Adik', 88, 'Waspada', 'Quishing (QRIS)', 'bg-emerald-600', 4)
          `
        }
      }

      // Ambil seluruh anggota dari database
      members = await sql`
        SELECT * FROM family_members
        WHERE group_id = ${group.id}
        ORDER BY id ASC
      `

      // Format response sesuai kebutuhan UI
      const formattedMembers = members.map((m) => ({
        id: String(m.id),
        userId: m.user_id,
        name: m.member_name,
        role: m.role_in_family,
        relation: m.relation || m.role_in_family,
        score: m.safe_score,
        status: m.vulnerability_status,
        weakCategory: m.weak_category || "Social Engineering",
        avatarColor: m.avatar_color || "bg-blue-600",
        completedChallenges: m.completed_challenges || 0,
        lastActive: "Terkoneksi Database"
      }))

      // Hitung indeks proteksi keluarga
      const avgScore = formattedMembers.length > 0
        ? Math.round(formattedMembers.reduce((acc, curr) => acc + (curr.score || 0), 0) / formattedMembers.length)
        : 75
      const vulnerableCount = formattedMembers.filter((m) => m.score < 60).length

      // Update skor grup jika berubah
      await sql`
        UPDATE family_groups
        SET family_defense_index = ${avgScore},
            vulnerable_members_count = ${vulnerableCount}
        WHERE id = ${group.id}
      `

      return res.status(200).json({
        success: true,
        data: {
          group: {
            ...group,
            family_defense_index: avgScore,
            vulnerable_members_count: vulnerableCount
          },
          members: formattedMembers
        }
      })
    } catch (e) {
      console.error("Family fetch error:", e)
      return res.status(500).json({ message: "Gagal memuat data keluarga dari database" })
    }
  }

  // POST: Tambah anggota keluarga baru ke Neon DB
  if (req.method === "POST") {
    const { groupId, name, relation = "Orang Tua", role = "Anggota", score = 50 } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Nama anggota keluarga wajib diisi" })
    }

    try {
      let targetGroupId = groupId
      if (!targetGroupId) {
        const anyGroup = await sql`SELECT id FROM family_groups LIMIT 1`
        targetGroupId = anyGroup[0]?.id
      }

      const status = score >= 80 ? "Waspada" : score >= 60 ? "Cukup Waspada" : "Rentan"
      const avatarColors = ["bg-blue-600", "bg-sky-600", "bg-indigo-600", "bg-teal-600"]
      const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]

      const inserted = await sql`
        INSERT INTO family_members (
          group_id, member_name, role_in_family, relation, safe_score,
          vulnerability_status, weak_category, avatar_color, completed_challenges
        )
        VALUES (
          ${targetGroupId}, ${name.trim()}, ${role}, ${relation}, ${score},
          ${status}, 'Belum Ikut Tes', ${randomColor}, 0
        )
        RETURNING *
      `

      return res.status(201).json({
        success: true,
        message: "Anggota keluarga berhasil ditambahkan ke database",
        member: inserted[0]
      })
    } catch (e) {
      console.error("Add family member error:", e)
      return res.status(500).json({ message: "Gagal menambahkan anggota keluarga" })
    }
  }

  // PUT: Nudge / Kirim peringatan ke anggota yang rentan
  if (req.method === "PUT") {
    const { memberId, action } = req.body

    if (!memberId) {
      return res.status(400).json({ message: "memberId diperlukan" })
    }

    try {
      if (action === "nudge") {
        return res.status(200).json({
          success: true,
          message: "Peringatan kewaspadaan berhasil dikirim ke anggota keluarga"
        })
      }

      return res.status(200).json({ success: true })
    } catch (e) {
      return res.status(500).json({ message: "Gagal memproses aksi" })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}

