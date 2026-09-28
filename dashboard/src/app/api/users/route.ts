import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface userstatsRow extends RowDataPacket {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
}

interface SubscriptionRow extends RowDataPacket {
  subscription_name: string;
  users: number;
}

interface StateRow extends RowDataPacket {
  state: string;
  users: number;
}

interface ProfessionRow extends RowDataPacket {
  profession: string;
  users: number;
}

interface ExperienceRow extends RowDataPacket {
  experience_level: string;
  users: number;
}

interface GenderRow extends RowDataPacket {
  gender: string;
  users: number;
}

interface SignupTrendRow extends RowDataPacket {
  month: string;
  users: number;
}

export async function GET() {
  try {
    
    // 1. User statistics
    
    const [userstatsRows] = await pool.query<userstatsRow[]>(`
      SELECT
        COUNT(*) AS total_users,

        SUM(
          CASE
            WHEN account_status = 'Active' THEN 1
            ELSE 0
          END
        ) AS active_users,

        SUM(
          CASE
            WHEN account_status = 'Inactive' THEN 1
            ELSE 0
          END
        ) AS inactive_users,

        SUM(
          CASE
            WHEN account_status = 'Suspended' THEN 1
            ELSE 0
          END
        ) AS suspended_users

      FROM users
    `);

    
    // 2. users by subscription plan
    
    const [subscriptionRows] =
      await pool.query<SubscriptionRow[]>(`
        SELECT
          sp.plan_name AS subscription_name,
          COUNT(u.user_id) AS users

        FROM users u

        INNER JOIN subscription_plans sp
          ON u.subscription_id = sp.subscription_id

        GROUP BY
          sp.subscription_id,
          sp.plan_name

        ORDER BY users DESC
      `);

    
    // 3. users by state
    
    const [stateRows] =
      await pool.query<StateRow[]>(`
        SELECT
          state,
          COUNT(*) AS users

        FROM users

        WHERE state IS NOT NULL
          AND state <> ''

        GROUP BY state

        ORDER BY users DESC

        LIMIT 10
      `);

    
    // 4. users by profession
    
    const [professionRows] =
      await pool.query<ProfessionRow[]>(`
        SELECT
          profession,
          COUNT(*) AS users

        FROM users

        WHERE profession IS NOT NULL
          AND profession <> ''

        GROUP BY profession

        ORDER BY users DESC
      `);

    
    // 5. users by experience level
    
    const [experienceRows] =
      await pool.query<ExperienceRow[]>(`
        SELECT
          experience_level,
          COUNT(*) AS users

        FROM users

        WHERE experience_level IS NOT NULL
          AND experience_level <> ''

        GROUP BY experience_level

        ORDER BY users DESC
      `);

    
    // 6. users by gender
    
    const [genderRows] =
      await pool.query<GenderRow[]>(`
        SELECT
          gender,
          COUNT(*) AS users

        FROM users

        WHERE gender IS NOT NULL

        GROUP BY gender

        ORDER BY users DESC
      `);

    
    // 7. Monthly signup trend
    
    const [signupTrendRows] =
      await pool.query<SignupTrendRow[]>(`
        SELECT
          DATE_FORMAT(signup_date, '%Y-%m') AS month,
          COUNT(*) AS users

        FROM users

        GROUP BY DATE_FORMAT(signup_date, '%Y-%m')

        ORDER BY month
      `);

    
    // Return API response
    
    return NextResponse.json({
      stats: {
        totalUsers: Number(
          userstatsRows[0]?.total_users ?? 0
        ),

        activeUsers: Number(
          userstatsRows[0]?.active_users ?? 0
        ),

        inactiveUsers: Number(
          userstatsRows[0]?.inactive_users ?? 0
        ),

        suspendedUsers: Number(
          userstatsRows[0]?.suspended_users ?? 0
        ),
      },

      subscriptionDistribution:
        subscriptionRows.map((row) => ({
          name: row.subscription_name,
          value: Number(row.users),
        })),

      stateDistribution:
        stateRows.map((row) => ({
          state: row.state,
          users: Number(row.users),
        })),

      professionDistribution:
        professionRows.map((row) => ({
          profession: row.profession,
          users: Number(row.users),
        })),

      experienceDistribution:
        experienceRows.map((row) => ({
          level: row.experience_level,
          users: Number(row.users),
        })),

      genderDistribution:
        genderRows.map((row) => ({
          gender: row.gender,
          users: Number(row.users),
        })),

      signupTrend:
        signupTrendRows.map((row) => ({
          month: row.month,
          users: Number(row.users),
        })),
    });

  } catch (error) {
    console.error("users API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user analytics",
      },
      {
        status: 500,
      }
    );
  }
}