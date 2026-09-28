import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

interface RevenueStatsRow extends RowDataPacket {
  successful_revenue: number;
  successful_transactions: number;
  pending_payments: number;
  failed_payments: number;
  total_discounts: number;
  average_transaction_value: number;
}

interface MonthlyRevenueRow extends RowDataPacket {
  month: string;
  revenue: number;
  transactions: number;
}

interface PaymentMethodRow extends RowDataPacket {
  payment_method: string;
  revenue: number;
  transactions: number;
}

interface PaymentStatusRow extends RowDataPacket {
  payment_status: string;
  payments: number;
  amount: number;
}

interface SubscriptionRevenueRow extends RowDataPacket {
  plan_name: string;
  revenue: number;
  transactions: number;
}

interface CouponRow extends RowDataPacket {
  coupon_usage: number;
  discount_amount: number;
}

export async function GET() {
  try {
    // -----------------------------------------
    // 1. Revenue statistics
    // -----------------------------------------
    const [revenueStatsRows] =
      await pool.query<RevenueStatsRow[]>(`
        SELECT

          COALESCE(
            SUM(
              CASE
                WHEN payment_status = 'Success'
                THEN amount
                ELSE 0
              END
            ),
            0
          ) AS successful_revenue,

          SUM(
            CASE
              WHEN payment_status = 'Success'
              THEN 1
              ELSE 0
            END
          ) AS successful_transactions,

          SUM(
            CASE
              WHEN payment_status = 'Pending'
              THEN 1
              ELSE 0
            END
          ) AS pending_payments,

          SUM(
            CASE
              WHEN payment_status = 'Failed'
              THEN 1
              ELSE 0
            END
          ) AS failed_payments,

          COALESCE(
            SUM(
              CASE
                WHEN payment_status = 'Success'
                THEN discount_amount
                ELSE 0
              END
            ),
            0
          ) AS total_discounts,

          COALESCE(
            AVG(
              CASE
                WHEN payment_status = 'Success'
                THEN amount
              END
            ),
            0
          ) AS average_transaction_value

        FROM Payments
      `);

    // -----------------------------------------
    // 2. Monthly successful revenue
    // -----------------------------------------
    const [monthlyRevenueRows] =
      await pool.query<MonthlyRevenueRow[]>(`
        SELECT

          DATE_FORMAT(payment_date, '%Y-%m') AS month,

          SUM(amount) AS revenue,

          COUNT(*) AS transactions

        FROM Payments

        WHERE payment_status = 'Success'

        GROUP BY DATE_FORMAT(payment_date, '%Y-%m')

        ORDER BY month
      `);

    // -----------------------------------------
    // 3. Revenue by payment method
    // -----------------------------------------
    const [paymentMethodRows] =
      await pool.query<PaymentMethodRow[]>(`
        SELECT

          payment_method,

          SUM(
            CASE
              WHEN payment_status = 'Success'
              THEN amount
              ELSE 0
            END
          ) AS revenue,

          SUM(
            CASE
              WHEN payment_status = 'Success'
              THEN 1
              ELSE 0
            END
          ) AS transactions

        FROM Payments

        GROUP BY payment_method

        ORDER BY revenue DESC
      `);

    // -----------------------------------------
    // 4. Payment status distribution
    // -----------------------------------------
    const [paymentStatusRows] =
      await pool.query<PaymentStatusRow[]>(`
        SELECT

          payment_status,

          COUNT(*) AS payments,

          COALESCE(
            SUM(amount),
            0
          ) AS amount

        FROM Payments

        GROUP BY payment_status

        ORDER BY payments DESC
      `);

    // -----------------------------------------
    // 5. Revenue by subscription plan
    // -----------------------------------------
    const [subscriptionRevenueRows] =
      await pool.query<SubscriptionRevenueRow[]>(`
        SELECT

          sp.plan_name,

          SUM(
            CASE
              WHEN p.payment_status = 'Success'
              THEN p.amount
              ELSE 0
            END
          ) AS revenue,

          SUM(
            CASE
              WHEN p.payment_status = 'Success'
              THEN 1
              ELSE 0
            END
          ) AS transactions

        FROM Payments p

        INNER JOIN Subscription_Plans sp
          ON p.subscription_id = sp.subscription_id

        GROUP BY
          sp.subscription_id,
          sp.plan_name

        ORDER BY revenue DESC
      `);

    // -----------------------------------------
    // 6. Coupon / discount analysis
    // -----------------------------------------
    const [couponRows] =
      await pool.query<CouponRow[]>(`
        SELECT

          COUNT(
            CASE
              WHEN coupon_code IS NOT NULL
                AND coupon_code <> ''
              THEN 1
            END
          ) AS coupon_usage,

          COALESCE(
            SUM(
              CASE
                WHEN payment_status = 'Success'
                THEN discount_amount
                ELSE 0
              END
            ),
            0
          ) AS discount_amount

        FROM Payments
      `);

    // -----------------------------------------
    // Return API response
    // -----------------------------------------
    return NextResponse.json({
      stats: {
        successfulRevenue: Number(
          revenueStatsRows[0]?.successful_revenue ?? 0
        ),

        successfulTransactions: Number(
          revenueStatsRows[0]?.successful_transactions ?? 0
        ),

        pendingPayments: Number(
          revenueStatsRows[0]?.pending_payments ?? 0
        ),

        failedPayments: Number(
          revenueStatsRows[0]?.failed_payments ?? 0
        ),

        totalDiscounts: Number(
          revenueStatsRows[0]?.total_discounts ?? 0
        ),

        averageTransactionValue: Number(
          revenueStatsRows[0]?.average_transaction_value ?? 0
        ),
      },

      monthlyRevenue: monthlyRevenueRows.map((row) => ({
        month: row.month,
        revenue: Number(row.revenue),
        transactions: Number(row.transactions),
      })),

      paymentMethods: paymentMethodRows.map((row) => ({
        method: row.payment_method,
        revenue: Number(row.revenue),
        transactions: Number(row.transactions),
      })),

      paymentStatus: paymentStatusRows.map((row) => ({
        status: row.payment_status,
        payments: Number(row.payments),
        amount: Number(row.amount),
      })),

      subscriptionRevenue: subscriptionRevenueRows.map((row) => ({
        plan: row.plan_name,
        revenue: Number(row.revenue),
        transactions: Number(row.transactions),
      })),

      couponAnalysis: {
        couponUsage: Number(
          couponRows[0]?.coupon_usage ?? 0
        ),

        discountAmount: Number(
          couponRows[0]?.discount_amount ?? 0
        ),
      },
    });
  } catch (error) {
    console.error("Revenue API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch revenue analytics",
      },
      {
        status: 500,
      }
    );
  }
}