"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Headphones,
  Clock3,
  Star,
  CircleAlert,
  CheckCircle2,
  MessageCircle,
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

interface SupportData {
  stats: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    averageResolutionTime: number;
    averageCustomerRating: number;
  };

  categories: {
    category: string;
    tickets: number;
  }[];

  priorities: {
    priority: string;
    tickets: number;
    averageResolutionTime: number;
  }[];

  statuses: {
    status: string;
    tickets: number;
  }[];

  ratings: {
    rating: number;
    tickets: number;
  }[];

  monthlyTickets: {
    month: string;
    tickets: number;
  }[];
}

const priorityColors: Record<string, string> = {
  High: "#1e293b",
  Medium: "#64748b",
  Low: "#94a3b8",
};

const statusColors: Record<string, string> = {
  Open: "#cbd5e1",
  Resolved: "#475569",
  Closed: "#1e293b",
};

const ratingColors = [
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#1e293b",
];

export default function SupportPage() {
  const [data, setData] = useState<SupportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupportAnalytics() {
      try {
        const response = await fetch("/api/support");

        if (!response.ok) {
          throw new Error(
            "Failed to fetch support analytics"
          );
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error(
          "Failed to fetch support analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSupportAnalytics();
  }, []);

  const monthlyChartData = useMemo(() => {
    if (!data) return [];

    return data.monthlyTickets.map((item) => {
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
        tickets: item.tickets,
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
              Support Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor support tickets, response performance,
              priorities and customer satisfaction.
            </p>
          </section>

          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total Tickets"
              value={
                loading
                  ? "Loading..."
                  : (
                      data?.stats.totalTickets ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={Headphones}
            />

            <KPICard
              title="Open Tickets"
              value={
                loading
                  ? "Loading..."
                  : (
                      data?.stats.openTickets ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={CircleAlert}
            />

            <KPICard
              title="Avg. Resolution Time"
              value={
                loading
                  ? "Loading..."
                  : `${(
                      data?.stats.averageResolutionTime ??
                      0
                    ).toFixed(2)} hrs`
              }
              change="Live Data"
              icon={Clock3}
            />

            <KPICard
              title="Avg. Customer Rating"
              value={
                loading
                  ? "Loading..."
                  : `${(
                      data?.stats.averageCustomerRating ??
                      0
                    ).toFixed(2)} / 5`
              }
              change="Live Data"
              icon={Star}
            />

          </section>

          {/* Ticket Trend */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Support Ticket Trend
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Monthly support ticket volume
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
                  Loading support data...
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
                      tick={{
                        fontSize: 10,
                        fill: "#64748b",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

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

                    <Line
                      type="monotone"
                      dataKey="tickets"
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

          {/* Categories + Status */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Categories */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Tickets by Category
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Support demand across ticket categories
                  </p>
                </div>

                <MessageCircle
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 h-[330px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={data?.categories ?? []}
                    layout="vertical"
                    margin={{
                      left: 20,
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
                        Number(value).toLocaleString(
                          "en-IN"
                        )
                      }
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Bar
                      dataKey="tickets"
                      fill="#1e293b"
                      radius={[
                        0,
                        5,
                        5,
                        0,
                      ]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Ticket Status
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Current support ticket distribution
                </p>
              </div>

              <div className="mt-4 flex h-[300px] items-center justify-center">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={data?.statuses ?? []}
                      dataKey="tickets"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {(data?.statuses ?? []).map(
                        (entry) => (
                          <Cell
                            key={entry.status}
                            fill={
                              statusColors[
                                entry.status
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

                {data?.statuses.map((item) => (
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
                      {item.tickets.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>
                ))}

              </div>

            </div>

          </section>

          {/* Priority + Ratings */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Priority */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <h3 className="font-semibold">
                  Tickets by Priority
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Ticket volume and average resolution time
                </p>
              </div>

              <div className="mt-6 space-y-5">

                {data?.priorities.map((item) => {

                  const maxTickets =
                    Math.max(
                      ...(data.priorities.map(
                        (priority) =>
                          priority.tickets
                      ) ?? [1])
                    );

                  const percentage =
                    (item.tickets /
                      maxTickets) *
                    100;

                  return (
                    <div key={item.priority}>

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                priorityColors[
                                  item.priority
                                ] ?? "#94a3b8",
                            }}
                          />

                          <span className="text-sm font-medium">
                            {item.priority}
                          </span>

                        </div>

                        <span className="text-sm font-semibold">
                          {item.tickets.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              priorityColors[
                                item.priority
                              ] ?? "#94a3b8",
                          }}
                        />

                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Avg. resolution:{" "}
                        {item.averageResolutionTime.toFixed(
                          2
                        )}{" "}
                        hrs
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* Ratings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Customer Ratings
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Distribution of customer satisfaction
                  </p>
                </div>

                <Star
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-4 flex h-[300px] items-center justify-center">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={data?.ratings ?? []}
                      dataKey="tickets"
                      nameKey="rating"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {(data?.ratings ?? []).map(
                        (entry, index) => (
                          <Cell
                            key={entry.rating}
                            fill={
                              ratingColors[
                                index %
                                  ratingColors.length
                              ]
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

              <div className="grid grid-cols-5 gap-2">

                {data?.ratings.map((item) => (
                  <div
                    key={item.rating}
                    className="rounded-lg bg-slate-50 p-2 text-center"
                  >

                    <p className="text-xs text-slate-500">
                      {item.rating} ★
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.tickets.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </section>

          {/* Resolution Summary */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Support Resolution Summary
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Current ticket resolution performance
                </p>
              </div>

              <CheckCircle2
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-xs text-slate-500">
                  Open Tickets
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {(
                    data?.stats.openTickets ?? 0
                  ).toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Awaiting resolution
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-xs text-slate-500">
                  Resolved Tickets
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {(
                    data?.stats.resolvedTickets ?? 0
                  ).toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Successfully resolved
                </p>

              </div>

              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-xs text-slate-500">
                  Closed Tickets
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {(
                    data?.stats.closedTickets ?? 0
                  ).toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Completed support cases
                </p>

              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}