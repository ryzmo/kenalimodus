import { neon } from "@neondatabase/serverless"

let sqlClient = null

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    return null
  }
  if (!sqlClient) {
    sqlClient = neon(databaseUrl)
  }
  return sqlClient
}

// Inisialisasi skema tabel database di NeonDB secara otomatis jika belum ada
export async function initDbSchema() {
  const sql = getDb()
  if (!sql) return false

  try {
    // 1. Tiers Master Table
    await sql`
      CREATE TABLE IF NOT EXISTS tiers (
        id SERIAL PRIMARY KEY,
        tier_name VARCHAR(50) UNIQUE NOT NULL,
        min_points INT NOT NULL DEFAULT 0,
        max_points INT NOT NULL DEFAULT 99,
        badge_icon VARCHAR(50) DEFAULT 'Shield',
        perks_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Seed tiers default if empty
    await sql`
      INSERT INTO tiers (tier_name, min_points, max_points, badge_icon, perks_description)
      VALUES 
        ('Bronze Guardian', 0, 99, 'Shield', 'Tingkat dasar pertahanan siber'),
        ('Silver Protector', 100, 249, 'ShieldCheck', 'Pelindung aktif dengan reflek waspada'),
        ('Gold Champion', 250, 499, 'Award', 'Ahli deteksi modus rekayasa sosial'),
        ('Platinum Legend', 500, 99999, 'Crown', 'Duta anti-scam & pertahanan keluarga')
      ON CONFLICT (tier_name) DO NOTHING;
    `

    // 2. Users Table (Email & Password, anti-bruteforce, safe_score, points, streak)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150),
        email VARCHAR(191) UNIQUE,
        password_hash TEXT,
        image TEXT,
        age INT DEFAULT 25,
        safe_score INT DEFAULT 78,
        total_points INT DEFAULT 120,
        current_streak INT DEFAULT 1,
        last_active_date DATE DEFAULT CURRENT_DATE,
        tier_id INT REFERENCES tiers(id) ON DELETE SET NULL,
        role VARCHAR(30) DEFAULT 'user',
        failed_attempts INT DEFAULT 0,
        lockout_until TIMESTAMP WITH TIME ZONE,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Pastikan kolom baru terpasang jika tabel sudah ada sebelumnya
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS lockout_until TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP WITH TIME ZONE;
    `

    // NextAuth Accounts Table (untuk Google OAuth provider)
    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type VARCHAR(50),
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(provider, provider_account_id)
      );
    `

    // NextAuth Sessions Table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `

    // NextAuth Verification Tokens Table
    await sql`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `

    // 3. Family Groups Table
    await sql`
      CREATE TABLE IF NOT EXISTS family_groups (
        id SERIAL PRIMARY KEY,
        group_name VARCHAR(100) NOT NULL,
        invite_code VARCHAR(20) UNIQUE NOT NULL,
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        family_defense_index NUMERIC(5,2) DEFAULT 75.0,
        vulnerable_members_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 4. Family Members Table
    await sql`
      CREATE TABLE IF NOT EXISTS family_members (
        id SERIAL PRIMARY KEY,
        group_id INT NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        member_name VARCHAR(100) NOT NULL,
        role_in_family VARCHAR(50) DEFAULT 'Anggota',
        safe_score INT DEFAULT 70,
        vulnerability_status VARCHAR(30) DEFAULT 'Waspada',
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 6. User Point History Table
    await sql`
      CREATE TABLE IF NOT EXISTS user_point_history (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        points_changed INT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 7. Modus Items Custom Table (Dikelola oleh Admin)
    await sql`
      CREATE TABLE IF NOT EXISTS custom_modus (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'Social Engineering',
        icon VARCHAR(50) DEFAULT 'AlertTriangle',
        description TEXT NOT NULL,
        difficulty VARCHAR(20) DEFAULT 'Sedang',
        red_flags JSONB DEFAULT '[]'::jsonb,
        prevention_tips JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 8. Custom Scenarios / Questions Table (Dikelola oleh Admin)
    await sql`
      CREATE TABLE IF NOT EXISTS custom_scenarios (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        modus_type VARCHAR(100) DEFAULT 'Umum',
        sender VARCHAR(100) DEFAULT 'Sistem BCA',
        message TEXT NOT NULL,
        context TEXT,
        question TEXT NOT NULL,
        options JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 9. Custom Rewards Table (Dikelola oleh Admin)
    await sql`
      CREATE TABLE IF NOT EXISTS custom_rewards (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) DEFAULT 'e-wallet',
        cost INT NOT NULL DEFAULT 500,
        stock INT NOT NULL DEFAULT 50,
        partner VARCHAR(100) DEFAULT 'BCA',
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 10. Education Articles & Videos Table (Dikelola Admin & Reward Points)
    await sql`
      CREATE TABLE IF NOT EXISTS custom_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        content_type VARCHAR(50) DEFAULT 'article', -- 'article' | 'video'
        reward_points INT NOT NULL DEFAULT 15,
        reading_time VARCHAR(50) DEFAULT '3 Menit',
        author VARCHAR(100) DEFAULT 'Tim Keamanan Siber BCA',
        summary TEXT NOT NULL,
        full_content TEXT,
        external_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // 11. Global App Settings / Point Rules Configuration (Dikelola Admin)
    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        description VARCHAR(255),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Seed default settings jika belum ada
    await sql`
      INSERT INTO app_settings (setting_key, setting_value, description)
      VALUES 
        ('points_challenge_complete', '20', 'Poin didapat setelah menyelesaikan 2-minute challenge'),
        ('points_perfect_score', '30', 'Bonus poin jika Safe Score mencapai 100/100'),
        ('points_read_article', '15', 'Poin membaca artikel edukasi anti-scam'),
        ('points_share_family', '10', 'Poin membagikan skor aman ke grup keluarga WhatsApp'),
        ('lockout_duration_seconds', '60', 'Durasi gembok akun jika salah kata sandi 3x')
      ON CONFLICT (setting_key) DO NOTHING;
    `

    // 12. Impact Experiments Table
    await sql`
      CREATE TABLE IF NOT EXISTS impact_experiments (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100) UNIQUE NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        participant_name VARCHAR(100) DEFAULT 'Responden',
        participant_age INT DEFAULT 25,
        pre_total_questions INT NOT NULL DEFAULT 5,
        pre_risky_count INT NOT NULL DEFAULT 0,
        pre_risky_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
        post_total_questions INT NOT NULL DEFAULT 5,
        post_risky_count INT NOT NULL DEFAULT 0,
        post_risky_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
        behavioral_impact NUMERIC(5,2) NOT NULL DEFAULT 0,
        relative_reduction NUMERIC(5,2) NOT NULL DEFAULT 0,
        potential_loss_avoided_1k NUMERIC(15,2) NOT NULL DEFAULT 0,
        pre_score INT NOT NULL DEFAULT 0,
        post_score INT NOT NULL DEFAULT 0,
        attention_score INT DEFAULT 5,
        repetition_score INT DEFAULT 5,
        intention_score INT DEFAULT 5,
        ari_average NUMERIC(3,2) DEFAULT 5.00,
        answers_json JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Add columns if table already existed previously
    await sql`
      ALTER TABLE impact_experiments 
      ADD COLUMN IF NOT EXISTS participant_age INT DEFAULT 25,
      ADD COLUMN IF NOT EXISTS attention_score INT DEFAULT 5,
      ADD COLUMN IF NOT EXISTS repetition_score INT DEFAULT 5,
      ADD COLUMN IF NOT EXISTS intention_score INT DEFAULT 5,
      ADD COLUMN IF NOT EXISTS ari_average NUMERIC(3,2) DEFAULT 5.00;
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_impact_created_at ON impact_experiments (created_at DESC);
    `

    // 13. Lapor Bareng Community Scam Reports Table
    await sql`
      CREATE TABLE IF NOT EXISTS lapor_bareng_reports (
        id SERIAL PRIMARY KEY,
        reporter_name VARCHAR(100) DEFAULT 'Warga Anonim',
        reporter_contact VARCHAR(100),
        modus_category VARCHAR(100) NOT NULL DEFAULT 'Social Engineering',
        title VARCHAR(200) NOT NULL,
        chronology TEXT NOT NULL,
        scammer_phone VARCHAR(100),
        scammer_bank_account VARCHAR(100),
        scammer_bank_name VARCHAR(50),
        estimated_loss NUMERIC(15,2) DEFAULT 0,
        evidence_attachment TEXT,
        status VARCHAR(50) DEFAULT 'verified', -- 'pending' | 'verified' | 'converted'
        is_converted_to_modus BOOLEAN DEFAULT FALSE,
        is_converted_to_scenario BOOLEAN DEFAULT FALSE,
        is_converted_to_article BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Seed dummy data Lapor Bareng jika tabel masih kosong
    const laporCount = await sql`SELECT count(*) FROM lapor_bareng_reports`
    if (parseInt(laporCount[0]?.count || "0", 10) === 0) {
      await sql`
        INSERT INTO lapor_bareng_reports (
          reporter_name,
          reporter_contact,
          modus_category,
          title,
          chronology,
          scammer_phone,
          scammer_bank_account,
          scammer_bank_name,
          estimated_loss,
          status
        ) VALUES 
          (
            'Hendra Wibowo',
            'hendra.w@email.com',
            'APK Berbahaya',
            'File APK Undangan Pernikahan Menguras Saldo m-BCA',
            'Saya menerima pesan WhatsApp dari nomor asing mengaku teman SMP mengundang ke nikahan. Ada file Surat_Undangan.apk. Begitu dibuka, HP restart sendiri dan 10 menit kemudian ada notifikasi transfer keluar Rp 15.000.000.',
            '+62813-8891-2311',
            '8820192811',
            'Bank Lain',
            15000000,
            'verified'
          ),
          (
            'Siti Rahmawati',
            'siti.rahma@email.com',
            'Impersonation (CS Palsu)',
            'CS Palsu WhatsApp Mengaku Halo BCA Meminta Kode OTP',
            'Ditelepon via WA foto profil logo Halo BCA resmi. Katanya ada pembaruan biaya transfer bulanan dari Rp 6.500 jadi Rp 150.000. Penipu mengarahkan saya memberikan 6 digit OTP yang masuk SMS agar kenaikan tarif dibatalkan.',
            '+62852-1144-8900',
            '12900381928',
            'Bank Lain',
            4500000,
            'verified'
          ),
          (
            'Rian Pratama',
            'rian.p@email.com',
            'QRIS Palsu',
            'Stiker QRIS Rumah Ibadah & Kafe Ditempel Kode Pribadi Penipu',
            'Saat mau bayar kopi di gerai kasir, saya scan QRIS di meja kasir. Pas konfirmasi pembayaran namanya ternyata Toko Barokah Elektronik, bukan nama kafe. Untung saya konfirmasi ke kasir sebelum masukkan PIN.',
            '+62819-0922-3111',
            '00192837192',
            'e-Wallet',
            0,
            'verified'
          ),
          (
            'Dewi Lestari',
            'dewi.lestari@email.com',
            'Job Scam & Tugas Palsu',
            'Tawaran Kerja Freelance Like Video YouTube Berujung Setoran Deposit',
            'Dimasukkan ke grup Telegram kerja sampingan. Awalnya dibayar Rp 20.000 per 3 like. Lalu di tugas level 4 diminta deposit Rp 2.000.000 untuk buka komisi Rp 5.000.000, uang saya langsung dibawa kabur admin grup.',
            '+62877-2291-8841',
            '99182736152',
            'Bank Lain',
            2000000,
            'verified'
          )
      `
    }

    // 14. Intelligence Cases Registry (Pusat Tracking & Investigasi Case Modus)
    await sql`
      CREATE TABLE IF NOT EXISTS intelligence_cases (
        id SERIAL PRIMARY KEY,
        case_code VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        source VARCHAR(100) NOT NULL, -- 'Lapor Bareng BCA' | 'X/Twitter' | 'Instagram' | 'Web Scraper' | dll
        source_url TEXT,
        category VARCHAR(100) NOT NULL,
        is_known_in_db BOOLEAN DEFAULT FALSE,
        novelty_type VARCHAR(50) DEFAULT 'Varian Baru', -- 'Sudah Dikenali' | 'Varian Baru' | 'Modus Unik/Belum Dikenal'
        novelty_notes TEXT,
        chronology TEXT,
        red_flags JSONB DEFAULT '[]'::jsonb,
        prevention_tips JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'analisis', -- 'analisis' | 'investigasi' | 'terverifikasi' | 'terpublikasi' | 'diarsipkan'
        admin_notes TEXT,
        scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    return true
  } catch (error) {
    console.error("Failed to initialize NeonDB tables:", error)
    return false
  }
}
