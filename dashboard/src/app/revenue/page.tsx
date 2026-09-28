"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  Wallet,
  TicketPercent,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";

interface RevenueData {
  stats: {
    successfulRevenue: number;
    successfulTransactions: number;
    pendingPayments: number;
    failedPayments: number;
    totalDiscounts: number;
    averageTransactionValue: number;
  };

  monthlyRevenue: {
    month: string;
    revenue: number;
    transactions: number;
  }[];

  paymentMethods: {
    method: string;
    revenue: number;
    transactions: number;
  }[];

  paymentStatus: {
    status: string;
    payments: number;
    amount: number;
  }[];

  subscriptionRevenue: {
    plan: string;
    revenue: number;
    transactions: number;
  }[];

  couponAnalysis: {
    couponUsage: number;
    discountAmount: number;
  };
}

const statusColors: Record<string, string> = {
  Success: "#1e293b",
  Pending: "#94a3b8",
  Failed: "#cbd5e1",
};

const planColors = [
  "#1e293b",
  "#475569",
  "#64748b",
  "#94a3b8",
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function formatCompactCurrency(value: number) {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const response = await fetch("/api/revenue");

        if (!response.ok) {
          throw new Error("Failed to fetch revenue analytics");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error(
          "Failed to fetch revenue analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRevenue();
  }, []);

  const monthlyChartData = useMemo(() => {
    if (!data) return [];

    return data.monthlyRevenue.map((item) => {
      const [year, month] = item.month.split("-");

      const date = new Date(
        Number(year),
        Number(month) - 1,
        1
      );

      return {
        month: date.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        revenue: item.revenue,
        transactions: item.transactions,
      };
    });
  }, [data]);

  const paymentMethodChartData = useMemo(() => {
    if (!data) return [];

    return data.paymentMethods.map((item) => ({
      name: item.method,
      revenue: item.revenue,
      transactions: item.transactions,
    }));
  }, [data]);

  const paymentStatusChartData = useMemo(() => {
    if (!data) return [];

    return data.paymentStatus.map((item) => ({
      name: item.status,
      value: item.payments,
      amount: item.amount,
    }));
  }, [data]);

  const subscriptionChartData = useMemo(() => {
    if (!data) return [];

    return data.subscriptionRevenue.map((item) => ({
      plan: item.plan,
      revenue: item.revenue,
      transactions: item.transactions,
    }));
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="lg:ml-64">
        <Header />

        <div className="space-y-6 p-5 md:p-8">

          {/* Page Header */}
          <section>
            <p className="text-sm font-medium text-slate-500">
              Analytics
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Revenue Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor successful revenue, transactions,
              payment methods and subscription performance.
            </p>
          </section>

          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Successful Revenue"
              value={
                loading
                  ? "Loading..."
                  : formatCompactCurrency(
                      data?.stats.successfulRevenue ?? 0
                    )
              }
              change="Live Data"
              icon={CreditCard}
            />

            <KPICard
              title="Successful Transactions"
              value={
                loading
                  ? "Loading..."
                  : (
                      data?.stats.successfulTransactions ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={CheckCircle2}
            />

            <KPICard
              title="Pending Payments"
              value={
                loading
                  ? "Loading..."
                  : (
                      data?.stats.pendingPayments ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={Clock3}
            />

            <KPICard
              title="Failed Payments"
              value={
                loading
                  ? "Loading..."
                  : (
                      data?.stats.failedPayments ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={XCircle}
            />

          </section>

          {/* Secondary Metrics */}
          <section className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Wallet
                    size={19}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Average Transaction Value
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {loading
                      ? "Loading..."
                      : formatCurrency(
                          data?.stats
                            .averageTransactionValue ?? 0
                        )}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <TicketPercent
                    size={19}
                    className="text-slate-700"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Total Discounts
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {loading
                      ? "Loading..."
                      : formatCurrency(
                          data?.stats.totalDiscounts ?? 0
                        )}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {data?.couponAnalysis.couponUsage.toLocaleString(
                      "en-IN"
                    ) ?? 0}{" "}
                    coupon uses
                  </p>
                </div>

              </div>
            </div>

          </section>

          {/* Monthly Revenue */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Revenue Overview
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Monthly successful revenue
                </p>
              </div>

              <TrendingUp
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 h-[320px]">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading revenue data...
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={monthlyChartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tickFormatter={(value) =>
                        formatCompactCurrency(
                          Number(value)
                        )
                      }
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value))
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1e293b"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 5,
                      }}
                    />

                  </LineChart>
                </ResponsiveContainer>
              )}

            </div>
          </section>

          {/* Payment Methods + Status */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Payment Methods */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Revenue by Payment Method
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Successful revenue generated by payment channel
                  </p>
                </div>

                <CreditCard
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 h-[300px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={paymentMethodChartData}
                    layout="vertical"
                    margin={{
                      left: 15,
                      right: 20,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      type="number"
                      tickFormatter={(value) =>
                        formatCompactCurrency(
                          Number(value)
                        )
                      }
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={90}
                      tick={{
                        fontSize: 10,
                        fill: "#475569",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value))
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Bar
                      dataKey="revenue"
                      fill="#1e293b"
                      radius={[0, 5, 5, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>

            </div>

            {/* Payment Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Payment Status
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Distribution of successful, pending and failed payments
                </p>
              </div>

              <div className="mt-5 flex h-[300px] items-center justify-center">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={paymentStatusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {paymentStatusChartData.map(
                        (entry) => (
                          <Cell
                            key={entry.name}
                            fill={
                              statusColors[
                                entry.name
                              ] ?? "#94a3b8"
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        Number(value).toLocaleString(
                          "en-IN"
                        )
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>

              </div>

              <div className="space-y-3">

                {data?.paymentStatus.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between"
                  >

                    <div className="flex items-center gap-2">

                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            statusColors[
                              item.status
                            ] ?? "#94a3b8",
                        }}
                      />

                      <span className="text-sm">
                        {item.status}
                      </span>

                    </div>

                    <span className="text-sm font-semibold">
                      {item.payments.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </section>

          {/* Subscription Revenue */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>
              <h3 className="font-semibold">
                Revenue by Subscription Plan
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Successful revenue generated across subscription plans
              </p>
            </div>

            <div className="mt-6 h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={subscriptionChartData}
                  margin={{
                    left: 10,
                    right: 20,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="plan"
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tickFormatter={(value) =>
                      formatCompactCurrency(
                        Number(value)
                      )
                    }
                    tick={{
                      fontSize: 10,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(Number(value))
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    radius={[6, 6, 0, 0]}
                  >
                    {subscriptionChartData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.plan}
                          fill={
                            planColors[
                              index %
                                planColors.length
                            ]
                          }
                        />
                      )
                    )}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>

            </div>

          </section>

          {/* Payment Method Summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>
              <h3 className="font-semibold">
                Payment Method Summary
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Successful transactions and revenue contribution
              </p>
            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[650px] text-sm">

                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500">

                    <th className="pb-3 font-medium">
                      Payment Method
                    </th>

                    <th className="pb-3 font-medium">
                      Transactions
                    </th>

                    <th className="pb-3 font-medium">
                      Revenue
                    </th>

                    <th className="pb-3 text-right font-medium">
                      Avg. Transaction
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {data?.paymentMethods.map((item) => (
                    <tr
                      key={item.method}
                      className="border-b border-slate-100 last:border-0"
                    >

                      <td className="py-4 font-medium">
                        {item.method}
                      </td>

                      <td className="py-4 text-slate-600">
                        {item.transactions.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="py-4 text-slate-600">
                        {formatCurrency(item.revenue)}
                      </td>

                      <td className="py-4 text-right font-medium">
                        {formatCurrency(
                          item.transactions > 0
                            ? item.revenue /
                                item.transactions
                            : 0
                        )}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}