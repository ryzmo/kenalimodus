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
    await sql`
      CREATE TABLE IF NOT EXISTS impact_experiments (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100) UNIQUE NOT NULL,
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

    return true
  } catch (error) {
    console.error("Failed to initialize NeonDB tables:", error)
    return false
  }
}
