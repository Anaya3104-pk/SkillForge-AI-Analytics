import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface CourseStatsRow extends RowDataPacket {
  total_courses: number;
  active_courses: number;
  archived_courses: number;
  total_enrollments: number;
  average_rating: number | null;
}

interface LaunchTrendRow extends RowDataPacket {
  month: string;
  courses: number;
}

interface DifficultyRow extends RowDataPacket {
  difficulty: string;
  courses: number;
  enrollments: number;
  average_rating: number | null;
}

interface TopCourseRow extends RowDataPacket {
  course_name: string;
  enrollments: number;
  difficulty: string;
}

interface CategoryRow extends RowDataPacket {
  category_name: string;
  courses: number;
  enrollments: number;
}

interface InstructorRow extends RowDataPacket {
  instructor_name: string;
  courses: number;
  instructor_rating: number | null;
}

export async function GET() {
  try {
    
    // 1. Course statistics
    
    const [courseStatsRows] =
      await pool.query<CourseStatsRow[]>(`
        SELECT
          COUNT(DISTINCT c.course_id) AS total_courses,

          COUNT(
            DISTINCT CASE
              WHEN c.status = 'Active'
              THEN c.course_id
            END
          ) AS active_courses,

          COUNT(
            DISTINCT CASE
              WHEN c.status = 'Archived'
              THEN c.course_id
            END
          ) AS archived_courses,

          COUNT(e.enrollment_id) AS total_enrollments,

          AVG(
            CASE
              WHEN e.rating_given IS NOT NULL
              THEN e.rating_given
            END
          ) AS average_rating

        FROM courses c

        LEFT JOIN enrollments e
          ON c.course_id = e.course_id
      `);

    
    // 2. Course launch trend
    
    const [launchTrendRows] =
      await pool.query<LaunchTrendRow[]>(`
        SELECT
          DATE_FORMAT(launch_date, '%Y-%m') AS month,
          COUNT(*) AS courses

        FROM courses

        WHERE launch_date IS NOT NULL

        GROUP BY DATE_FORMAT(launch_date, '%Y-%m')

        ORDER BY month
      `);

    
    // 3. Difficulty analysis
    
    const [difficultyRows] =
      await pool.query<DifficultyRow[]>(`
        SELECT
          c.difficulty,

          COUNT(DISTINCT c.course_id) AS courses,

          COUNT(e.enrollment_id) AS enrollments,

          AVG(
            CASE
              WHEN e.rating_given IS NOT NULL
              THEN e.rating_given
            END
          ) AS average_rating

        FROM courses c

        LEFT JOIN enrollments e
          ON c.course_id = e.course_id

        GROUP BY c.difficulty

        ORDER BY
          CASE c.difficulty
            WHEN 'Beginner' THEN 1
            WHEN 'Intermediate' THEN 2
            WHEN 'Advanced' THEN 3
            ELSE 4
          END
      `);

    
    // 4. Top courses by enrollment
    
    const [topCourseRows] =
      await pool.query<TopCourseRow[]>(`
        SELECT
          c.course_name,
          c.difficulty,
          COUNT(e.enrollment_id) AS enrollments

        FROM courses c

        LEFT JOIN enrollments e
          ON c.course_id = e.course_id

        GROUP BY
          c.course_id,
          c.course_name,
          c.difficulty

        ORDER BY enrollments DESC

        LIMIT 10
      `);

    
    // 5. Courses by category
    
    const [categoryRows] =
      await pool.query<CategoryRow[]>(`
        SELECT
          cat.category_name,

          COUNT(DISTINCT c.course_id) AS courses,

          COUNT(e.enrollment_id) AS enrollments

        FROM categories cat

        LEFT JOIN courses c
          ON cat.category_id = c.category_id

        LEFT JOIN enrollments e
          ON c.course_id = e.course_id

        GROUP BY
          cat.category_id,
          cat.category_name

        ORDER BY enrollments DESC
      `);

    
    // 6. Courses by instructor
    
    const [instructorRows] =
      await pool.query<InstructorRow[]>(`
        SELECT
          CONCAT(
            i.first_name,
            ' ',
            i.last_name
          ) AS instructor_name,

          COUNT(c.course_id) AS courses,

          MAX(i.rating) AS instructor_rating

        FROM instructors i

        LEFT JOIN courses c
          ON i.instructor_id = c.instructor_id

        GROUP BY
          i.instructor_id,
          i.first_name,
          i.last_name

        ORDER BY courses DESC

        LIMIT 10
      `);

    
    // #Return API response
    
    return NextResponse.json({
      stats: {
        totalCourses: Number(
          courseStatsRows[0]?.total_courses ?? 0
        ),

        activeCourses: Number(
          courseStatsRows[0]?.active_courses ?? 0
        ),

        archivedCourses: Number(
          courseStatsRows[0]?.archived_courses ?? 0
        ),

        totalEnrollments: Number(
          courseStatsRows[0]?.total_enrollments ?? 0
        ),

        averageRating: Number(
          courseStatsRows[0]?.average_rating ?? 0
        ),
      },

      launchTrend: launchTrendRows.map((row) => ({
        month: row.month,
        courses: Number(row.courses),
      })),

      difficultyDistribution: difficultyRows.map(
        (row) => ({
          difficulty: row.difficulty,
          courses: Number(row.courses),
          enrollments: Number(row.enrollments),
          averageRating: Number(
            row.average_rating ?? 0
          ),
        })
      ),

      topCourses: topCourseRows.map((row) => ({
        courseName: row.course_name,
        difficulty: row.difficulty,
        enrollments: Number(row.enrollments),
      })),

      categoryDistribution: categoryRows.map(
        (row) => ({
          category: row.category_name,
          courses: Number(row.courses),
          enrollments: Number(row.enrollments),
        })
      ),

      instructorDistribution: instructorRows.map(
        (row) => ({
          instructor: row.instructor_name,
          courses: Number(row.courses),
          rating: Number(
            row.instructor_rating ?? 0
          ),
        })
      ),
    });
  } catch (error) {
    console.error("Courses API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch course analytics",
      },
      {
        status: 500,
      }
    );
  }
}