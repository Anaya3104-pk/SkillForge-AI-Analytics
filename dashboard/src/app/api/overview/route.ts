import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface UserRow extends RowDataPacket {
  total_users: number;
}

interface EnrollmentRow extends RowDataPacket {
  total_enrollments: number;
}

interface RevenueRow extends RowDataPacket {
  successful_revenue: number;
}

interface AIChatRow extends RowDataPacket {
  total_ai_chats: number;
}

interface CompletionRow extends RowDataPacket {
  completion_rate: number;
}

interface SupportRow extends RowDataPacket {
  total_support_tickets: number;
}

interface RevenueTrendRow extends RowDataPacket {
  month: string;
  revenue: number;
}

interface EnrollmentStatusRow extends RowDataPacket {
  status: string;
  count: number;
}

interface TopCourseRow extends RowDataPacket {
  course_name: string;
  enrollments: number;
}

interface LoginRow extends RowDataPacket {
  total_logins: number;
}

interface FeatureUsageRow extends RowDataPacket {
  total_feature_usage: number;
}

export async function GET() {
  try {
    // -----------------------------------------
    // 1. Total Users
    // -----------------------------------------
    const [userRows] = await pool.query<UserRow[]>(`
      SELECT COUNT(*) AS total_users
      FROM Users
    `);

    // -----------------------------------------
    // 2. Total Enrollments
    // -----------------------------------------
    const [enrollmentRows] = await pool.query<EnrollmentRow[]>(`
      SELECT COUNT(*) AS total_enrollments
      FROM Enrollments
    `);

    // -----------------------------------------
    // 3. Successful Revenue
    // -----------------------------------------
    const [revenueRows] = await pool.query<RevenueRow[]>(`
      SELECT COALESCE(SUM(amount), 0) AS successful_revenue
      FROM Payments
      WHERE payment_status = 'Success'
    `);

    // -----------------------------------------
    // 4. Total AI Chats
    // -----------------------------------------
    const [aiChatRows] = await pool.query<AIChatRow[]>(`
      SELECT COUNT(*) AS total_ai_chats
      FROM AI_Chats
    `);

    // -----------------------------------------
    // 5. Completion Rate
    // -----------------------------------------
    const [completionRows] = await pool.query<CompletionRow[]>(`
      SELECT
        ROUND(
          100 * SUM(
            CASE
              WHEN completion_status = 'Completed' THEN 1
              ELSE 0
            END
          ) / COUNT(*),
          2
        ) AS completion_rate
      FROM Enrollments
    `);

    // -----------------------------------------
    // 6. Support Tickets
    // -----------------------------------------
    const [supportRows] = await pool.query<SupportRow[]>(`
      SELECT COUNT(*) AS total_support_tickets
      FROM Support_Tickets
    `);

    // -----------------------------------------
    // 7. Monthly Successful Revenue
    // -----------------------------------------
    const [revenueTrendRows] =
      await pool.query<RevenueTrendRow[]>(`
        SELECT
          DATE_FORMAT(payment_date, '%Y-%m') AS month,
          ROUND(SUM(amount), 2) AS revenue
        FROM Payments
        WHERE payment_status = 'Success'
        GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
        ORDER BY month
      `);

    // -----------------------------------------
    // 8. Enrollment Status
    // -----------------------------------------
    const [enrollmentStatusRows] =
      await pool.query<EnrollmentStatusRow[]>(`
        SELECT
          completion_status AS status,
          COUNT(*) AS count
        FROM Enrollments
        GROUP BY completion_status
        ORDER BY count DESC
      `);

    // -----------------------------------------
    // 9. Top 5 Courses by Enrollment
    // -----------------------------------------
    const [topCourseRows] =
      await pool.query<TopCourseRow[]>(`
        SELECT
          c.course_name,
          COUNT(e.enrollment_id) AS enrollments
        FROM Enrollments e
        INNER JOIN Courses c
          ON e.course_id = c.course_id
        GROUP BY c.course_id, c.course_name
        ORDER BY enrollments DESC
        LIMIT 5
      `);

    // -----------------------------------------
    // 10. Total Login Activity
    // -----------------------------------------
    const [loginRows] = await pool.query<LoginRow[]>(`
      SELECT COUNT(*) AS total_logins
      FROM Login_History
    `);

    // -----------------------------------------
    // 11. Total Feature Usage
    // -----------------------------------------
    const [featureUsageRows] =
      await pool.query<FeatureUsageRow[]>(`
        SELECT COUNT(*) AS total_feature_usage
        FROM Feature_Usage
      `);

    return NextResponse.json({
      totalUsers: Number(userRows[0]?.total_users ?? 0),

      totalEnrollments: Number(
        enrollmentRows[0]?.total_enrollments ?? 0
      ),

      successfulRevenue: Number(
        revenueRows[0]?.successful_revenue ?? 0
      ),

      totalAIChats: Number(
        aiChatRows[0]?.total_ai_chats ?? 0
      ),

      completionRate: Number(
        completionRows[0]?.completion_rate ?? 0
      ),

      totalSupportTickets: Number(
        supportRows[0]?.total_support_tickets ?? 0
      ),

      revenueTrend: revenueTrendRows.map((row) => ({
        month: row.month,
        revenue: Number(row.revenue),
      })),

      enrollmentStatus: enrollmentStatusRows.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),

      topCourses: topCourseRows.map((row) => ({
        courseName: row.course_name,
        enrollments: Number(row.enrollments),
      })),

      totalLogins: Number(
        loginRows[0]?.total_logins ?? 0
      ),

      totalFeatureUsage: Number(
        featureUsageRows[0]?.total_feature_usage ?? 0
      ),
    });
  } catch (error) {
    console.error("Overview API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch overview data",
      },
      {
        status: 500,
      }
    );
  }
}