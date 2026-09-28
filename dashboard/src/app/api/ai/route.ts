import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface AIStatsRow extends RowDataPacket {
  total_ai_chats: number;
  average_satisfaction: number | null;
  average_response_time: number | null;
  average_tokens: number | null;
}

interface TopicRow extends RowDataPacket {
  topic: string;
  chats: number;
  average_satisfaction: number | null;
}

interface SatisfactionRow extends RowDataPacket {
  satisfaction_rating: number;
  chats: number;
}

interface ResponseTimeRow extends RowDataPacket {
  response_bucket: string;
  chats: number;
}

interface FeatureRow extends RowDataPacket {
  feature_name: string;
  usage_count: number;
  average_session_duration: number | null;
}

interface DeviceRow extends RowDataPacket {
  device: string;
  usage_count: number;
  average_session_duration: number | null;
}

interface MonthlyUsageRow extends RowDataPacket {
  month: string;
  usage_count: number;
}

export async function GET() {
  try {
    
    // 1. AI + engagement statistics
    
    const [aiStatsRows] =
      await pool.query<AIStatsRow[]>(`
        SELECT
          COUNT(*) AS total_ai_chats,

          AVG(satisfaction_rating)
            AS average_satisfaction,

          AVG(response_time_seconds)
            AS average_response_time,

          AVG(tokens_used)
            AS average_tokens

        FROM ai_chats
      `);

    
    // 2. AI chat topics
    
    const [topicRows] =
      await pool.query<TopicRow[]>(`
        SELECT
          topic,

          COUNT(*) AS chats,

          AVG(satisfaction_rating)
            AS average_satisfaction

        FROM ai_chats

        GROUP BY topic

        ORDER BY chats DESC
      `);

    
    // 3. Satisfaction distribution
    
    const [satisfactionRows] =
      await pool.query<SatisfactionRow[]>(`
        SELECT
          satisfaction_rating,

          COUNT(*) AS chats

        FROM ai_chats

        WHERE satisfaction_rating IS NOT NULL

        GROUP BY satisfaction_rating

        ORDER BY satisfaction_rating
      `);

    
    // 4. Response-time distribution
    
    const [responseTimeRows] =
      await pool.query<ResponseTimeRow[]>(`
        SELECT
          CASE
            WHEN response_time_seconds < 5
              THEN '< 5 sec'

            WHEN response_time_seconds < 10
              THEN '5-10 sec'

            WHEN response_time_seconds < 15
              THEN '10-15 sec'

            WHEN response_time_seconds < 20
              THEN '15-20 sec'

            ELSE '20+ sec'
          END AS response_bucket,

          COUNT(*) AS chats

        FROM ai_chats

        WHERE response_time_seconds IS NOT NULL

        GROUP BY response_bucket

        ORDER BY
          CASE response_bucket
            WHEN '< 5 sec' THEN 1
            WHEN '5-10 sec' THEN 2
            WHEN '10-15 sec' THEN 3
            WHEN '15-20 sec' THEN 4
            WHEN '20+ sec' THEN 5
          END
      `);

    
    // 5. Feature usage
    
    const [featureRows] =
      await pool.query<FeatureRow[]>(`
        SELECT
          feature_name,

          COUNT(*) AS usage_count,

          AVG(session_duration_minutes)
            AS average_session_duration

        FROM feature_usage

        GROUP BY feature_name

        ORDER BY usage_count DESC
      `);

    
    // 6. Usage by device
    
    const [deviceRows] =
      await pool.query<DeviceRow[]>(`
        SELECT
          device,

          COUNT(*) AS usage_count,

          AVG(session_duration_minutes)
            AS average_session_duration

        FROM feature_usage

        GROUP BY device

        ORDER BY usage_count DESC
      `);

    
    // 7. Monthly feature usage
    
    const [monthlyUsageRows] =
      await pool.query<MonthlyUsageRow[]>(`
        SELECT

          DATE_FORMAT(
            usage_date,
            '%Y-%m'
          ) AS month,

          COUNT(*) AS usage_count

        FROM feature_usage

        GROUP BY DATE_FORMAT(
          usage_date,
          '%Y-%m'
        )

        ORDER BY month
      `);

    
    // Return API response
    
    return NextResponse.json({
      stats: {
        totalAIChats: Number(
          aiStatsRows[0]?.total_ai_chats ?? 0
        ),

        averageSatisfaction: Number(
          aiStatsRows[0]?.average_satisfaction ?? 0
        ),

        averageResponseTime: Number(
          aiStatsRows[0]?.average_response_time ?? 0
        ),

        averageTokens: Number(
          aiStatsRows[0]?.average_tokens ?? 0
        ),
      },

      topics: topicRows.map((row) => ({
        topic: row.topic,
        chats: Number(row.chats),
        averageSatisfaction: Number(
          row.average_satisfaction ?? 0
        ),
      })),

      satisfaction: satisfactionRows.map((row) => ({
        rating: Number(
          row.satisfaction_rating
        ),
        chats: Number(row.chats),
      })),

      responseTime: responseTimeRows.map((row) => ({
        bucket: row.response_bucket,
        chats: Number(row.chats),
      })),

      features: featureRows.map((row) => ({
        feature: row.feature_name,
        usage: Number(row.usage_count),
        averageSessionDuration: Number(
          row.average_session_duration ?? 0
        ),
      })),

      devices: deviceRows.map((row) => ({
        device: row.device,
        usage: Number(row.usage_count),
        averageSessionDuration: Number(
          row.average_session_duration ?? 0
        ),
      })),

      monthlyUsage: monthlyUsageRows.map((row) => ({
        month: row.month,
        usage: Number(row.usage_count),
      })),
    });
  } catch (error) {
    console.error("AI Analytics API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch AI and engagement analytics",
      },
      {
        status: 500,
      }
    );
  }
}