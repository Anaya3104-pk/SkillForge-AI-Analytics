"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Star,
  Clock3,
  MessageSquare,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
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

interface AIData {
  stats: {
    totalAIChats: number;
    averageSatisfaction: number;
    averageResponseTime: number;
    averageTokens: number;
  };

  topics: {
    topic: string;
    chats: number;
    averageSatisfaction: number;
  }[];

  satisfaction: {
    rating: number;
    chats: number;
  }[];

  responseTime: {
    bucket: string;
    chats: number;
  }[];

  features: {
    feature: string;
    usage: number;
    averageSessionDuration: number;
  }[];

  devices: {
    device: string;
    usage: number;
    averageSessionDuration: number;
  }[];

  monthlyUsage: {
    month: string;
    usage: number;
  }[];
}

const satisfactionColors = [
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#1e293b",
];

const deviceColors: Record<string, string> = {
  Mobile: "#1e293b",
  Desktop: "#64748b",
  Tablet: "#94a3b8",
};

function getDeviceIcon(device: string) {
  if (device === "Mobile") return Smartphone;
  if (device === "Tablet") return Tablet;
  return Monitor;
}

export default function AIPage() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAIAnalytics() {
      try {
        const response = await fetch("/api/ai");

        if (!response.ok) {
          throw new Error(
            "Failed to fetch AI analytics"
          );
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error(
          "Failed to fetch AI analytics:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAIAnalytics();
  }, []);

  const monthlyUsageChart = useMemo(() => {
    if (!data) return [];

    return data.monthlyUsage.map((item) => {
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
        usage: item.usage,
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
              AI & Engagement
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor AI activity, user satisfaction,
              platform features and engagement patterns.
            </p>
          </section>

          {/* KPI Cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <KPICard
              title="Total AI Chats"
              value={
                loading
                  ? "Loading..."
                  : (
                      data?.stats.totalAIChats ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={Bot}
            />

            <KPICard
              title="Avg. Satisfaction"
              value={
                loading
                  ? "Loading..."
                  : `${(
                      data?.stats.averageSatisfaction ?? 0
                    ).toFixed(2)} / 5`
              }
              change="Live Data"
              icon={Star}
            />

            <KPICard
              title="Avg. Response Time"
              value={
                loading
                  ? "Loading..."
                  : `${(
                      data?.stats.averageResponseTime ?? 0
                    ).toFixed(2)} sec`
              }
              change="Live Data"
              icon={Clock3}
            />

            <KPICard
              title="Avg. Tokens / Chat"
              value={
                loading
                  ? "Loading..."
                  : Math.round(
                      data?.stats.averageTokens ?? 0
                    ).toLocaleString("en-IN")
              }
              change="Live Data"
              icon={Zap}
            />

          </section>

          {/* Monthly AI Usage */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Engagement Overview
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Monthly feature usage across the platform
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
                  Loading engagement data...
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart data={monthlyUsageChart}>

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
                        Number(value).toLocaleString(
                          "en-IN"
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
                      dataKey="usage"
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

          {/* AI Topics + Satisfaction */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* AI Topics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    AI Chat Topics
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Most frequently discussed topics
                  </p>
                </div>

                <MessageSquare
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
                    data={data?.topics ?? []}
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
                      dataKey="topic"
                      width={125}
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
                      dataKey="chats"
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

            {/* Satisfaction */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    AI Satisfaction
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Distribution of user satisfaction ratings
                  </p>
                </div>

                <Star
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-4 flex h-[330px] items-center justify-center">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>

                    <Pie
                      data={
                        data?.satisfaction ?? []
                      }
                      dataKey="chats"
                      nameKey="rating"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >

                      {(data?.satisfaction ?? []).map(
                        (entry, index) => (
                          <Cell
                            key={entry.rating}
                            fill={
                              satisfactionColors[
                                index %
                                  satisfactionColors.length
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

                {data?.satisfaction.map((item) => (
                  <div
                    key={item.rating}
                    className="rounded-lg bg-slate-50 p-2 text-center"
                  >
                    <p className="text-xs text-slate-500">
                      {item.rating} ★
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.chats.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                ))}

              </div>
            </div>

          </section>

          {/* Response Time + Features */}
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Response Time */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    AI Response Time
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Distribution of response times
                  </p>
                </div>

                <Clock3
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
                    data={data?.responseTime ?? []}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="bucket"
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

                    <Bar
                      dataKey="chats"
                      fill="#475569"
                      radius={[5, 5, 0, 0]}
                    />

                  </BarChart>
                </ResponsiveContainer>

              </div>
            </div>

            {/* Feature Usage */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    Feature Usage
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Most frequently used learning features
                  </p>
                </div>

                <Zap
                  size={19}
                  className="text-slate-400"
                />

              </div>

              <div className="mt-6 space-y-4">

                {data?.features.map(
                  (item, index) => {

                    const maxUsage =
                      data.features[0]?.usage ?? 1;

                    const percentage =
                      (item.usage / maxUsage) *
                      100;

                    return (
                      <div
                        key={item.feature}
                      >

                        <div className="flex items-center justify-between">

                          <span className="text-sm font-medium">
                            {item.feature}
                          </span>

                          <span className="text-xs text-slate-500">
                            {item.usage.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-slate-800"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Avg. session:{" "}
                          {item.averageSessionDuration.toFixed(
                            1
                          )}{" "}
                          min
                        </p>

                      </div>
                    );
                  }
                )}

              </div>
            </div>

          </section>

          {/* Device Usage */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-semibold">
                  Usage by Device
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Platform feature usage across devices
                </p>
              </div>

              <Smartphone
                size={19}
                className="text-slate-400"
              />

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              {data?.devices.map((item) => {

                const DeviceIcon =
                  getDeviceIcon(item.device);

                return (
                  <div
                    key={item.device}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <DeviceIcon
                          size={19}
                          className="text-slate-700"
                        />
                      </div>

                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            deviceColors[
                              item.device
                            ] ?? "#94a3b8",
                        }}
                      />

                    </div>

                    <p className="mt-4 text-sm font-medium">
                      {item.device}
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      {item.usage.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      usage events
                    </p>

                    <div className="mt-4 border-t border-slate-200 pt-3">

                      <p className="text-xs text-slate-500">
                        Avg. session duration
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {item.averageSessionDuration.toFixed(
                          1
                        )}{" "}
                        min
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>

        </div>
      </main>
    </div>
  );
}