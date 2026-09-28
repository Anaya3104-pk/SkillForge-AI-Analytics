"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Archive,
  Users,
  Star,
  TrendingUp,
  Layers3,
  UserRound,
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

interface CoursesData {
  stats: {
    totalCourses: number;
    activeCourses: number;
    archivedCourses: number;
    totalEnrollments: number;
    averageRating: number;
  };

  launchTrend: {
    month: string;
    courses: number;
  }[];

  difficultyDistribution: {
    difficulty: string;
    courses: number;
    enrollments: number;
    averageRating: number;
  }[];

  topCourses: {
    courseName: string;
    difficulty: string;
    enrollments: number;
  }[];

  categoryDistribution: {
    category: string;
    courses: number;
    enrollments: number;
  }[];

  instructorDistribution: {
    instructor: string;
    courses: number;
    rating: number;
  }[];
}

const chartColors = [
  "#1e293b",
  "#475569",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
];

export default function CoursesPage() {
  const [data, setData] = useState<CoursesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses");

        if (!response.ok) {
          throw new Error("Failed to fetch course analytics");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error("Failed to fetch course analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const launchChartData = useMemo(() => {
    if (!data) return [];

    return data.launchTrend.map((item) => {
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
        courses: item.courses,
      };
    });
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
              Course Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Analyze course catalog performance, enrollment,
              difficulty and instructor activity.
            </p>
          </section>

          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Courses"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.totalCourses.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={BookOpen}
            />

            <KPICard
              title="Active Courses"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.activeCourses.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={CheckCircle2}
            />

            <KPICard
              title="Total Enrollments"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.totalEnrollments.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={Users}
            />

            <KPICard
              title="Average Rating"
              value={
                loading
                  ? "Loading..."
                  : data
                    ? `${data.stats.averageRating.toFixed(2)} / 5`
                    : "0"
              }
              change="Live Data"
              icon={Star}
            />

          </section>

          {/* Launch Trend */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Course Launch Trend
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Number of courses launched each month
                </p>
              </div>

              <TrendingUp
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 h-[280px]">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading launch data...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={launchChartData}>

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
                      allowDecimals={false}
                      tick={{
                        fontSize: 11,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `${Number(value)} courses`
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="courses"
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

          {/* Difficulty + Category */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Difficulty */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Courses by Difficulty
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Course volume and enrollment by level
                  </p>
                </div>

                <Layers3
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 h-[300px]">

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.difficultyDistribution ?? []}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="difficulty"
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
                    />

                    <Tooltip
                      formatter={(value, name) => [
                        Number(value).toLocaleString("en-IN"),
                        name === "courses"
                          ? "Courses"
                          : "Enrollments",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Bar
                      dataKey="courses"
                      name="courses"
                      fill="#1e293b"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="enrollments"
                      name="enrollments"
                      fill="#94a3b8"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>

              <div className="mt-4 space-y-3">

                {data?.difficultyDistribution.map((item) => (
                  <div
                    key={item.difficulty}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >

                    <span className="text-sm font-medium">
                      {item.difficulty}
                    </span>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        {item.courses} courses
                      </span>

                      <span>
                        {item.averageRating.toFixed(2)} ★
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            </div>

            {/* Category */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Courses by Category
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enrollment volume across learning categories
                </p>
              </div>

              <div className="mt-6 h-[300px]">

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.categoryDistribution ?? []}
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
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="category"
                      width={105}
                      tick={{
                        fontSize: 10,
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

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                {data?.categoryDistribution.map((item) => (
                  <div
                    key={item.category}
                    className="rounded-lg border border-slate-100 p-3"
                  >

                    <p className="text-xs text-slate-500">
                      {item.category}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.enrollments.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {item.courses} courses
                    </p>

                  </div>
                ))}

              </div>
            </div>

          </section>

          {/* Top Courses */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Top Courses
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Courses ranked by enrollment volume
                </p>
              </div>

              <BookOpen
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 h-[360px]">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.topCourses ?? []}
                  layout="vertical"
                  margin={{
                    left: 15,
                    right: 25,
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
                      fontSize: 10,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="courseName"
                    width={145}
                    tick={{
                      fontSize: 10,
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

            </div>

          </section>

          {/* Instructors */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Instructor Overview
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Instructors with the highest course count
                </p>
              </div>

              <UserRound
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {data?.instructorDistribution.map(
                (item, index) => (
                  <div
                    key={item.instructor}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-medium text-slate-400">
                        #{index + 1}
                      </span>

                      <Star
                        size={14}
                        className="text-slate-400"
                      />

                    </div>

                    <p className="mt-3 text-sm font-semibold">
                      {item.instructor}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.courses} courses
                    </p>

                    <div className="mt-3 flex items-center gap-1">

                      <Star
                        size={13}
                        className="fill-current text-slate-700"
                      />

                      <span className="text-xs font-semibold">
                        {item.rating.toFixed(2)}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}