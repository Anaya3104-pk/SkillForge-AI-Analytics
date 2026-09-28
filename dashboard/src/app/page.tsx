"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  BookOpen,
  CreditCard,
  Bot,
  TrendingUp,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KPICard from "@/components/KPICard";

interface OverviewData {
  totalUsers: number;
  totalEnrollments: number;
  successfulRevenue: number;
  totalAIChats: number;
  completionRate: number;
  totalSupportTickets: number;
  totalLogins: number;
  totalFeatureUsage: number;

  revenueTrend: {
    month: string;
    revenue: number;
  }[];

  enrollmentStatus: {
    status: string;
    count: number;
  }[];

  topCourses: {
    courseName: string;
    enrollments: number;
  }[];
}

export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await fetch("/api/overview");

        if (!response.ok) {
          throw new Error("Failed to fetch overview data");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error("Failed to fetch overview:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, []);

  const formatRevenue = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }

    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }

    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatMonth = (month: string) => {
    const [year, monthNumber] = month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
  };

  const revenueChartData = useMemo(() => {
    if (!data) return [];

    return data.revenueTrend.map((item) => ({
      month: formatMonth(item.month),
      revenue: item.revenue,
    }));
  }, [data]);

  const enrollmentChartData = useMemo(() => {
    if (!data) return [];

    return data.enrollmentStatus.map((item) => ({
      name: item.status,
      value: item.count,
    }));
  }, [data]);

  const activityData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "Logins",
        value: data.totalLogins,
      },
      {
        name: "Feature Usage",
        value: data.totalFeatureUsage,
      },
      {
        name: "AI Chats",
        value: data.totalAIChats,
      },
      {
        name: "Support Tickets",
        value: data.totalSupportTickets,
      },
    ];
  }, [data]);

  const maxActivity = Math.max(
    ...(activityData.map((item) => item.value)),
    1
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="lg:ml-64">
        <Header />

        <div className="space-y-6 p-5 md:p-8">

          {/* Page Heading */}
          <section>
            <p className="text-sm font-medium text-slate-500">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Learning Platform Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor users, courses, revenue, engagement and AI activity.
            </p>
          </section>

          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Users"
              value={
                loading
                  ? "Loading..."
                  : data?.totalUsers.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={Users}
            />

            <KPICard
              title="Enrollments"
              value={
                loading
                  ? "Loading..."
                  : data?.totalEnrollments.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={BookOpen}
            />

            <KPICard
              title="Successful Revenue"
              value={
                loading
                  ? "Loading..."
                  : data
                    ? formatRevenue(data.successfulRevenue)
                    : "₹0"
              }
              change="Live Data"
              icon={CreditCard}
            />

            <KPICard
              title="AI Chats"
              value={
                loading
                  ? "Loading..."
                  : data?.totalAIChats.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={Bot}
            />

          </section>

          {/* Revenue + Enrollment */}
          <section className="grid gap-6 xl:grid-cols-3">

            {/* Revenue Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Revenue Overview
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Monthly successful revenue
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp size={14} />
                  Live Data
                </div>

              </div>

              <div className="mt-6 h-[280px] w-full">

                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading revenue data...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueChartData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                          `₹${(value / 100000).toFixed(0)}L`
                        }
                      />

                      <Tooltip
                        formatter={(value) =>
                          `₹${Number(value).toLocaleString("en-IN")}`
                        }
                        labelStyle={{
                          color: "#0f172a",
                        }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.08)",
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
            </div>

            {/* Enrollment Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Enrollment Status
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Current course progress
                </p>
              </div>

              <div className="mt-4 h-[210px]">

                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading enrollment data...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>

                      <Pie
                        data={enrollmentChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={82}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {enrollmentChartData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.name === "Completed"
                                  ? "#1e293b"
                                  : entry.name === "In Progress"
                                    ? "#94a3b8"
                                    : "#cbd5e1"
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString("en-IN")
                        }
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      />

                    </PieChart>
                  </ResponsiveContainer>
                )}

              </div>

              {/* Completion Center */}
              <div className="relative -mt-[142px] mb-[92px] text-center pointer-events-none">

                <p className="text-2xl font-bold">
                  {loading
                    ? "..."
                    : `${data?.completionRate ?? 0}%`}
                </p>

                <p className="text-xs text-slate-500">
                  Completed
                </p>

              </div>

              {/* Legend */}
              <div className="space-y-3">

                {!loading &&
                  data?.enrollmentStatus.map((item) => {

                    const total = data.enrollmentStatus.reduce(
                      (sum, current) =>
                        sum + current.count,
                      0
                    );

                    const percentage =
                      total > 0
                        ? (
                            (item.count / total) *
                            100
                          ).toFixed(1)
                        : "0";

                    return (
                      <div
                        key={item.status}
                        className="flex items-center justify-between text-sm"
                      >

                        <span className="text-slate-500">
                          {item.status}
                        </span>

                        <span className="font-semibold">
                          {percentage}%
                        </span>

                      </div>
                    );
                  })}

              </div>
            </div>

          </section>

          {/* Top Courses + Activity */}
          <section className="grid gap-6 md:grid-cols-2">

            {/* Top Courses */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Top Courses
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on enrollment volume
                  </p>
                </div>

                <BookOpen
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 h-[280px]">

                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading courses...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data?.topCourses ?? []}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        type="number"
                        tick={{
                          fontSize: 11,
                          fill: "#64748b",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        type="category"
                        dataKey="courseName"
                        width={125}
                        tick={{
                          fontSize: 11,
                          fill: "#475569",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString("en-IN")
                        }
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                        }}
                      />

                      <Bar
                        dataKey="enrollments"
                        fill="#1e293b"
                        radius={[0, 5, 5, 0]}
                      />

                    </BarChart>
                  </ResponsiveContainer>
                )}

              </div>

            </div>

            {/* Platform Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Platform Activity
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Activity volume across the platform
                  </p>
                </div>

                <Activity
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 space-y-6">

                {activityData.map((item) => {

                  const percentage = Math.max(
                    3,
                    (item.value / maxActivity) * 100
                  );

                  return (
                    <div key={item.name}>

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm font-medium">
                          {item.name}
                        </span>

                        <span className="text-sm font-semibold">
                          {item.value.toLocaleString("en-IN")}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-slate-800 transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">

                <p className="text-xs leading-5 text-slate-500">
                  Activity metrics represent records captured
                  across login history, feature usage, AI
                  conversations and support interactions.
                </p>

              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}