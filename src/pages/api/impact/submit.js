import { getDb, initDbSchema } from "../../../lib/db"
import {
  calculateRiskyActionRate,
  calculateBehavioralImpact,
  calculateRelativeReduction,
  calculatePotentialLossAvoided1k
} from "../../../data/modusData"

// In-memory server store fallback jika DATABASE_URL di .env belum diisi
// sehingga data lokal tetap tersimpan dan tidak hilang saat dicoba di browser
let inMemorySubmissions = []

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        sessionId,
        participantName = "Responden",
        participantAge = 25,
        preAnswers = [],
        postAnswers = [],
        preScore = 0,
        postScore = 0,
        attentionScore = 5,
        repetitionScore = 5,
        intentionScore = 5
      } = req.body

      const ageNum = Number(participantAge) || 25

      const preTotal = preAnswers.length || 5
      const preRiskyCount = preAnswers.filter((a) => a.isRisky).length
      const preRiskyRate = calculateRiskyActionRate(preRiskyCount, preTotal)

      const postTotal = postAnswers.length || 5
      const postRiskyCount = postAnswers.filter((a) => a.isRisky).length
      const postRiskyRate = calculateRiskyActionRate(postRiskyCount, postTotal)

      const behavioralImpact = calculateBehavioralImpact(preRiskyRate, postRiskyRate)
      const relativeReduction = calculateRelativeReduction(preRiskyRate, postRiskyRate)
      const potentialLossAvoided1k = calculatePotentialLossAvoided1k(relativeReduction)

      const att = Number(attentionScore) || 5
      const rep = Number(repetitionScore) || 5
      const intn = Number(intentionScore) || 5
      const ariAverage = Number(((att + rep + intn) / 3).toFixed(2))

      const experimentData = {
        sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        participantName,
        participantAge: ageNum,
        preTotalQuestions: preTotal,
        preRiskyCount,
        preRiskyRate,
        postTotalQuestions: postTotal,
        postRiskyCount,
        postRiskyRate,
        behavioralImpact,
        relativeReduction,
        potentialLossAvoided1k,
        preScore,
        postScore,
        attentionScore: att,
        repetitionScore: rep,
        intentionScore: intn,
        ariAverage,
        answers: { preAnswers, postAnswers },
        createdAt: new Date().toISOString()
      }

      // Simpan ke in-memory store (memastikan data langsung muncul)
      const existingIdx = inMemorySubmissions.findIndex((s) => s.sessionId === experimentData.sessionId)
      if (existingIdx >= 0) {
        inMemorySubmissions[existingIdx] = experimentData
      } else {
        inMemorySubmissions.unshift(experimentData)
      }

      // Simpan ke NeonDB jika terkoneksi
      const sql = getDb()
      let savedToDb = false

      if (sql) {
        try {
          await initDbSchema()
          await sql`
            INSERT INTO impact_experiments (
              session_id,
              participant_name,
              participant_age,
              pre_total_questions,
              pre_risky_count,
              pre_risky_rate,
              post_total_questions,
              post_risky_count,
              post_risky_rate,
              behavioral_impact,
              relative_reduction,
              potential_loss_avoided_1k,
              pre_score,
              post_score,
              attention_score,
              repetition_score,
              intention_score,
              ari_average,
              answers_json
            ) VALUES (
              ${experimentData.sessionId},
              ${experimentData.participantName},
              ${experimentData.participantAge},
              ${experimentData.preTotalQuestions},
              ${experimentData.preRiskyCount},
              ${experimentData.preRiskyRate},
              ${experimentData.postTotalQuestions},
              ${experimentData.postRiskyCount},
              ${experimentData.postRiskyRate},
              ${experimentData.behavioralImpact},
              ${experimentData.relativeReduction},
              ${experimentData.potentialLossAvoided1k},
              ${experimentData.preScore},
              ${experimentData.postScore},
              ${experimentData.attentionScore},
              ${experimentData.repetitionScore},
              ${experimentData.intentionScore},
              ${experimentData.ariAverage},
              ${JSON.stringify(experimentData.answers)}
            )
            ON CONFLICT (session_id) DO UPDATE SET
              participant_name = EXCLUDED.participant_name,
              participant_age = EXCLUDED.participant_age,
              post_risky_rate = EXCLUDED.post_risky_rate,
              behavioral_impact = EXCLUDED.behavioral_impact,
              relative_reduction = EXCLUDED.relative_reduction,
              potential_loss_avoided_1k = EXCLUDED.potential_loss_avoided_1k,
              post_score = EXCLUDED.post_score,
              attention_score = EXCLUDED.attention_score,
              repetition_score = EXCLUDED.repetition_score,
              intention_score = EXCLUDED.intention_score,
              ari_average = EXCLUDED.ari_average,
              answers_json = EXCLUDED.answers_json;
          `
          savedToDb = true
        } catch (dbErr) {
          console.error("NeonDB insert error:", dbErr)
        }
      }

      return res.status(200).json({
        success: true,
        savedToDb,
        data: experimentData
      })
    } catch (error) {
      console.error("Submit API error:", error)
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to process impact experiment"
      })
    }
  }

  // GET: Ambil ringkasan agregasi seluruh eksperimen
  if (req.method === "GET") {
    try {
      const sql = getDb()
      
      // Jika belum ada NeonDB, gunakan inMemorySubmissions
      if (!sql) {
        const total = inMemorySubmissions.length
        if (total === 0) {
          return res.status(200).json({
            success: true,
            source: "local-session",
            stats: {
              totalParticipants: 0,
              avgAge: 0,
              avgPreRiskyRate: 0,
              avgPostRiskyRate: 0,
              avgBehavioralImpact: 0,
              avgRelativeReduction: 0,
              totalPotentialLossAvoided: 0,
              avgPreScore: 0,
              avgPostScore: 0,
              avgAttention: 0,
              avgRepetition: 0,
              avgIntention: 0,
              avgAri: 0
            },
            recentParticipants: []
          })
        }

        const avgAge = Math.round(inMemorySubmissions.reduce((a, b) => a + Number(b.participantAge || 25), 0) / total)
        const avgPreRisky = inMemorySubmissions.reduce((a, b) => a + Number(b.preRiskyRate || 0), 0) / total
        const avgPostRisky = inMemorySubmissions.reduce((a, b) => a + Number(b.postRiskyRate || 0), 0) / total
        const avgImpact = inMemorySubmissions.reduce((a, b) => a + Number(b.behavioralImpact || 0), 0) / total
        const avgReduction = inMemorySubmissions.reduce((a, b) => a + Number(b.relativeReduction || 0), 0) / total
        const avgPreScore = Math.round(inMemorySubmissions.reduce((a, b) => a + Number(b.preScore || 0), 0) / total)
        const avgPostScore = Math.round(inMemorySubmissions.reduce((a, b) => a + Number(b.postScore || 0), 0) / total)
        const avgAtt = inMemorySubmissions.reduce((a, b) => a + Number(b.attentionScore || 5), 0) / total
        const avgRep = inMemorySubmissions.reduce((a, b) => a + Number(b.repetitionScore || 5), 0) / total
        const avgInt = inMemorySubmissions.reduce((a, b) => a + Number(b.intentionScore || 5), 0) / total
        const avgAri = inMemorySubmissions.reduce((a, b) => a + Number(b.ariAverage || 5), 0) / total
        const totalLossAvoided = inMemorySubmissions.reduce((a, b) => a + Number(b.potentialLossAvoided1k || 0), 0)

        return res.status(200).json({
          success: true,
          source: "local-memory",
          stats: {
            totalParticipants: total,
            avgAge: avgAge,
            avgPreRiskyRate: Number(avgPreRisky.toFixed(2)),
            avgPostRiskyRate: Number(avgPostRisky.toFixed(2)),
            avgBehavioralImpact: Number(avgImpact.toFixed(2)),
            avgRelativeReduction: Number(avgRelativeReduction.toFixed(2)),
            totalPotentialLossAvoided: totalLossAvoided,
            avgPreScore: avgPreScore,
            avgPostScore: avgPostScore,
            avgAttention: Number(avgAtt.toFixed(2)),
            avgRepetition: Number(avgRep.toFixed(2)),
            avgIntention: Number(avgInt.toFixed(2)),
            avgAri: Number(avgAri.toFixed(2))
          },
          recentParticipants: inMemorySubmissions
        })
      }

      // Jika NeonDB terkoneksi
      await initDbSchema()
      const rows = await sql`
        SELECT 
          COUNT(*)::int AS total_participants,
          COALESCE(AVG(participant_age), 25)::int AS avg_age,
          COALESCE(AVG(pre_risky_rate), 0)::numeric(5,2) AS avg_pre_risky_rate,
          COALESCE(AVG(post_risky_rate), 0)::numeric(5,2) AS avg_post_risky_rate,
          COALESCE(AVG(behavioral_impact), 0)::numeric(5,2) AS avg_behavioral_impact,
          COALESCE(AVG(relative_reduction), 0)::numeric(5,2) AS avg_relative_reduction,
          COALESCE(AVG(potential_loss_avoided_1k), 0)::numeric(15,2) AS avg_loss_avoided_1k,
          COALESCE(AVG(pre_score), 0)::int AS avg_pre_score,
          COALESCE(AVG(post_score), 0)::int AS avg_post_score,
          COALESCE(AVG(attention_score), 5)::numeric(3,2) AS avg_attention,
          COALESCE(AVG(repetition_score), 5)::numeric(3,2) AS avg_repetition,
          COALESCE(AVG(intention_score), 5)::numeric(3,2) AS avg_intention,
          COALESCE(AVG(ari_average), 5)::numeric(3,2) AS avg_ari
        FROM impact_experiments;
      `

      const recentRows = await sql`
        SELECT 
          session_id AS "sessionId",
          participant_name AS "participantName",
          participant_age AS "participantAge",
          pre_score AS "preScore",
          post_score AS "postScore",
          pre_risky_rate AS "preRiskyRate",
          post_risky_rate AS "postRiskyRate",
          relative_reduction AS "relativeReduction",
          attention_score AS "attentionScore",
          repetition_score AS "repetitionScore",
          intention_score AS "intentionScore",
          ari_average AS "ariAverage",
          created_at AS "createdAt"
        FROM impact_experiments
        ORDER BY created_at DESC
        LIMIT 50;
      `

      const row = rows[0] || {}

      return res.status(200).json({
        success: true,
        source: "neondb",
        stats: {
          totalParticipants: row.total_participants || 0,
          avgAge: row.avg_age || 25,
          avgPreRiskyRate: Number(row.avg_pre_risky_rate || 0),
          avgPostRiskyRate: Number(row.avg_post_risky_rate || 0),
          avgBehavioralImpact: Number(row.avg_behavioral_impact || 0),
          avgRelativeReduction: Number(row.avg_relative_reduction || 0),
          totalPotentialLossAvoided: Number(row.avg_loss_avoided_1k || 0),
          avgPreScore: row.avg_pre_score || 0,
          avgPostScore: row.avg_post_score || 0,
          avgAttention: Number(row.avg_attention || 5),
          avgRepetition: Number(row.avg_repetition || 5),
          avgIntention: Number(row.avg_intention || 5),
          avgAri: Number(row.avg_ari || 5)
        },
        recentParticipants: recentRows
      })
    } catch (error) {
      console.error("GET API error:", error)
      return res.status(500).json({ success: false, error: error.message })
    }
  }

  return res.status(405).json({ message: "Method not allowed" })
}
