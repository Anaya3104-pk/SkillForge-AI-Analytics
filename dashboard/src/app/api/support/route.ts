import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface SupportStatsRow extends RowDataPacket {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  average_resolution_time: number | null;
  average_customer_rating: number | null;
}

interface CategoryRow extends RowDataPacket {
  category: string;
  tickets: number;
}

interface PriorityRow extends RowDataPacket {
  priority: string;
  tickets: number;
  average_resolution_time: number | null;
}

interface StatusRow extends RowDataPacket {
  status: string;
  tickets: number;
}

interface RatingRow extends RowDataPacket {
  rating: number;
  tickets: number;
}

interface MonthlyRow extends RowDataPacket {
  month: string;
  tickets: number;
}

export async function GET() {
  try {
    // -----------------------------------------
    // 1. Support statistics
    // -----------------------------------------
    const [statsRows] =
      await pool.query<SupportStatsRow[]>(`
        SELECT
          COUNT(*) AS total_tickets,

          SUM(
            CASE
              WHEN ticket_status = 'Open'
              THEN 1
              ELSE 0
            END
          ) AS open_tickets,

          SUM(
            CASE
              WHEN ticket_status = 'Resolved'
              THEN 1
              ELSE 0
            END
          ) AS resolved_tickets,

          SUM(
            CASE
              WHEN ticket_status = 'Closed'
              THEN 1
              ELSE 0
            END
          ) AS closed_tickets,

          AVG(resolution_time_hours)
            AS average_resolution_time,

          AVG(customer_rating)
            AS average_customer_rating

        FROM Support_Tickets
      `);

    // -----------------------------------------
    // 2. Tickets by category
    // -----------------------------------------
    const [categoryRows] =
      await pool.query<CategoryRow[]>(`
        SELECT
          ticket_category AS category,
          COUNT(*) AS tickets

        FROM Support_Tickets

        GROUP BY ticket_category

        ORDER BY tickets DESC
      `);

    // -----------------------------------------
    // 3. Tickets by priority
    // -----------------------------------------
    const [priorityRows] =
      await pool.query<PriorityRow[]>(`
        SELECT
          priority,
          COUNT(*) AS tickets,

          AVG(resolution_time_hours)
            AS average_resolution_time

        FROM Support_Tickets

        GROUP BY priority

        ORDER BY
          CASE priority
            WHEN 'High' THEN 1
            WHEN 'Medium' THEN 2
            WHEN 'Low' THEN 3
            ELSE 4
          END
      `);

    // -----------------------------------------
    // 4. Ticket status
    // -----------------------------------------
    const [statusRows] =
      await pool.query<StatusRow[]>(`
        SELECT
          ticket_status AS status,
          COUNT(*) AS tickets

        FROM Support_Tickets

        GROUP BY ticket_status

        ORDER BY tickets DESC
      `);

    // -----------------------------------------
    // 5. Customer rating distribution
    // -----------------------------------------
    const [ratingRows] =
      await pool.query<RatingRow[]>(`
        SELECT
          customer_rating AS rating,
          COUNT(*) AS tickets

        FROM Support_Tickets

        WHERE customer_rating IS NOT NULL

        GROUP BY customer_rating

        ORDER BY customer_rating
      `);

    // -----------------------------------------
    // 6. Monthly ticket trend
    // -----------------------------------------
    const [monthlyRows] =
      await pool.query<MonthlyRow[]>(`
        SELECT
          DATE_FORMAT(
            created_date,
            '%Y-%m'
          ) AS month,

          COUNT(*) AS tickets

        FROM Support_Tickets

        GROUP BY DATE_FORMAT(
          created_date,
          '%Y-%m'
        )

        ORDER BY month
      `);

    // -----------------------------------------
    // Return API response
    // -----------------------------------------
    return NextResponse.json({
      stats: {
        totalTickets: Number(
          statsRows[0]?.total_tickets ?? 0
        ),

        openTickets: Number(
          statsRows[0]?.open_tickets ?? 0
        ),

        resolvedTickets: Number(
          statsRows[0]?.resolved_tickets ?? 0
        ),

        closedTickets: Number(
          statsRows[0]?.closed_tickets ?? 0
        ),

        averageResolutionTime: Number(
          statsRows[0]?.average_resolution_time ?? 0
        ),

        averageCustomerRating: Number(
          statsRows[0]?.average_customer_rating ?? 0
        ),
      },

      categories: categoryRows.map((row) => ({
        category: row.category,
        tickets: Number(row.tickets),
      })),

      priorities: priorityRows.map((row) => ({
        priority: row.priority,
        tickets: Number(row.tickets),
        averageResolutionTime: Number(
          row.average_resolution_time ?? 0
        ),
      })),

      statuses: statusRows.map((row) => ({
        status: row.status,
        tickets: Number(row.tickets),
      })),

      ratings: ratingRows.map((row) => ({
        rating: Number(row.rating),
        tickets: Number(row.tickets),
      })),

      monthlyTickets: monthlyRows.map((row) => ({
        month: row.month,
        tickets: Number(row.tickets),
      })),
    });
  } catch (error) {
    console.error(
      "Support Analytics API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch support analytics",
      },
      {
        status: 500,
      }
    );
  }
}