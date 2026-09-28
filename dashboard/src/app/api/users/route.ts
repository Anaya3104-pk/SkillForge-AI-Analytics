import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface UserStatsRow extends RowDataPacket {
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
    // -----------------------------------------
    // 1. User statistics
    // -----------------------------------------
    const [userStatsRows] = await pool.query<UserStatsRow[]>(`
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

      FROM Users
    `);

    // -----------------------------------------
    // 2. Users by subscription plan
    // -----------------------------------------
    const [subscriptionRows] =
      await pool.query<SubscriptionRow[]>(`
        SELECT
          sp.plan_name AS subscription_name,
          COUNT(u.user_id) AS users

        FROM Users u

        INNER JOIN Subscription_Plans sp
          ON u.subscription_id = sp.subscription_id

        GROUP BY
          sp.subscription_id,
          sp.plan_name

        ORDER BY users DESC
      `);

    // -----------------------------------------
    // 3. Users by state
    // -----------------------------------------
    const [stateRows] =
      await pool.query<StateRow[]>(`
        SELECT
          state,
          COUNT(*) AS users

        FROM Users

        WHERE state IS NOT NULL
          AND state <> ''

        GROUP BY state

        ORDER BY users DESC

        LIMIT 10
      `);

    // -----------------------------------------
    // 4. Users by profession
    // -----------------------------------------
    const [professionRows] =
      await pool.query<ProfessionRow[]>(`
        SELECT
          profession,
          COUNT(*) AS users

        FROM Users

        WHERE profession IS NOT NULL
          AND profession <> ''

        GROUP BY profession

        ORDER BY users DESC
      `);

    // -----------------------------------------
    // 5. Users by experience level
    // -----------------------------------------
    const [experienceRows] =
      await pool.query<ExperienceRow[]>(`
        SELECT
          experience_level,
          COUNT(*) AS users

        FROM Users

        WHERE experience_level IS NOT NULL
          AND experience_level <> ''

        GROUP BY experience_level

        ORDER BY users DESC
      `);

    // -----------------------------------------
    // 6. Users by gender
    // -----------------------------------------
    const [genderRows] =
      await pool.query<GenderRow[]>(`
        SELECT
          gender,
          COUNT(*) AS users

        FROM Users

        WHERE gender IS NOT NULL

        GROUP BY gender

        ORDER BY users DESC
      `);

    // -----------------------------------------
    // 7. Monthly signup trend
    // -----------------------------------------
    const [signupTrendRows] =
      await pool.query<SignupTrendRow[]>(`
        SELECT
          DATE_FORMAT(signup_date, '%Y-%m') AS month,
          COUNT(*) AS users

        FROM Users

        GROUP BY DATE_FORMAT(signup_date, '%Y-%m')

        ORDER BY month
      `);

    // -----------------------------------------
    // Return API response
    // -----------------------------------------
    return NextResponse.json({
      stats: {
        totalUsers: Number(
          userStatsRows[0]?.total_users ?? 0
        ),

        activeUsers: Number(
          userStatsRows[0]?.active_users ?? 0
        ),

        inactiveUsers: Number(
          userStatsRows[0]?.inactive_users ?? 0
        ),

        suspendedUsers: Number(
          userStatsRows[0]?.suspended_users ?? 0
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
    console.error("Users API error:", error);

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