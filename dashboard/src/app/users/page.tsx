"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  TrendingUp,
  MapPin,
  Briefcase,
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

interface UsersData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
  };

  subscriptionDistribution: {
    name: string;
    value: number;
  }[];

  stateDistribution: {
    state: string;
    users: number;
  }[];

  professionDistribution: {
    profession: string;
    users: number;
  }[];

  experienceDistribution: {
    level: string;
    users: number;
  }[];

  genderDistribution: {
    gender: string;
    users: number;
  }[];

  signupTrend: {
    month: string;
    users: number;
  }[];
}

const chartColors = [
  "#1e293b",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
];

export default function UsersPage() {
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error("Failed to fetch user analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const signupChartData = useMemo(() => {
    if (!data) return [];

    return data.signupTrend.map((item) => {
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
        users: item.users,
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
              User Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Understand user growth, demographics, subscriptions and
              account activity.
            </p>
          </section>

          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Users"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.totalUsers.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={Users}
            />

            <KPICard
              title="Active Users"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.activeUsers.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={UserCheck}
            />

            <KPICard
              title="Inactive Users"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.inactiveUsers.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={UserX}
            />

            <KPICard
              title="Suspended Users"
              value={
                loading
                  ? "Loading..."
                  : data?.stats.suspendedUsers.toLocaleString("en-IN") ?? "0"
              }
              change="Live Data"
              icon={ShieldAlert}
            />

          </section>

          {/* Signup Trend */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  User Signup Trend
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Monthly new user registrations
                </p>
              </div>

              <TrendingUp
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 h-[300px]">

              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading signup data...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={signupChartData}>

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
                      interval="preserveStartEnd"
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
                      formatter={(value) =>
                        Number(value).toLocaleString("en-IN")
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="users"
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

          {/* Subscription + Gender */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Subscription */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Subscription Distribution
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Users by subscription plan
                </p>
              </div>

              <div className="mt-4 h-[250px]">

                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Loading subscription data...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>

                      <Pie
                        data={data?.subscriptionDistribution ?? []}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {data?.subscriptionDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`subscription-${index}`}
                              fill={
                                chartColors[
                                  index % chartColors.length
                                ]
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

              <div className="space-y-3">

                {data?.subscriptionDistribution.map(
                  (item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >

                      <div className="flex items-center gap-2">

                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              chartColors[
                                index % chartColors.length
                              ],
                          }}
                        />

                        <span className="text-slate-500">
                          {item.name}
                        </span>

                      </div>

                      <span className="font-semibold">
                        {item.value.toLocaleString("en-IN")}
                      </span>

                    </div>
                  )
                )}

              </div>
            </div>

            {/* Gender */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Gender Distribution
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  User demographic breakdown
                </p>
              </div>

              <div className="mt-6 space-y-6">

                {data?.genderDistribution.map(
                  (item, index) => {

                    const total =
                      data.genderDistribution.reduce(
                        (sum, current) =>
                          sum + current.users,
                        0
                      );

                    const percentage =
                      total > 0
                        ? (item.users / total) * 100
                        : 0;

                    return (
                      <div key={item.gender}>

                        <div className="mb-2 flex items-center justify-between">

                          <span className="text-sm font-medium">
                            {item.gender}
                          </span>

                          <span className="text-sm font-semibold">
                            {item.users.toLocaleString("en-IN")}
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor:
                                chartColors[
                                  index % chartColors.length
                                ],
                            }}
                          />

                        </div>

                        <p className="mt-1 text-right text-xs text-slate-400">
                          {percentage.toFixed(1)}%
                        </p>

                      </div>
                    );
                  }
                )}

              </div>
            </div>

          </section>

          {/* Profession + Experience */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Profession */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Users by Profession
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Professional background
                  </p>
                </div>

                <Briefcase
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 h-[320px]">

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.professionDistribution ?? []}
                    layout="vertical"
                    margin={{
                      left: 10,
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
                      dataKey="profession"
                      width={110}
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
                      dataKey="users"
                      fill="#1e293b"
                      radius={[0, 5, 5, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>
            </div>

            {/* Experience */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Experience Level
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    User experience distribution
                  </p>
                </div>

                <Users
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 space-y-7">

                {data?.experienceDistribution.map(
                  (item, index) => {

                    const total =
                      data.experienceDistribution.reduce(
                        (sum, current) =>
                          sum + current.users,
                        0
                      );

                    const percentage =
                      total > 0
                        ? (item.users / total) * 100
                        : 0;

                    return (
                      <div key={item.level}>

                        <div className="mb-2 flex items-center justify-between">

                          <span className="text-sm font-medium">
                            {item.level}
                          </span>

                          <span className="text-sm font-semibold">
                            {item.users.toLocaleString("en-IN")}
                          </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-slate-800 transition-all duration-700"
                            style={{
                              width: `${percentage}%`,
                              opacity:
                                1 - index * 0.18,
                            }}
                          />

                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          {percentage.toFixed(1)}% of users
                        </p>

                      </div>
                    );
                  }
                )}

              </div>
            </div>

          </section>

          {/* State Distribution */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Top States
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  States with the highest number of users
                </p>
              </div>

              <MapPin
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {data?.stateDistribution.map(
                (item, index) => {

                  const maxUsers = Math.max(
                    ...data.stateDistribution.map(
                      (state) => state.users
                    )
                  );

                  const percentage =
                    maxUsers > 0
                      ? (item.users / maxUsers) * 100
                      : 0;

                  return (
                    <div
                      key={item.state}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-medium text-slate-500">
                          #{index + 1}
                        </span>

                        <MapPin
                          size={14}
                          className="text-slate-400"
                        />

                      </div>

                      <p className="mt-3 font-semibold">
                        {item.state}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.users.toLocaleString("en-IN")} users
                      </p>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className="h-full rounded-full bg-slate-800"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}