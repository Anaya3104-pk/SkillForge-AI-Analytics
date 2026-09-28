"use client";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Bot,
  Headphones,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    name: "Users",
    icon: Users,
    href: "/users",
  },
  {
    name: "Courses",
    icon: BookOpen,
    href: "/courses",
  },
  {
    name: "Revenue",
    icon: CreditCard,
    href: "/revenue",
  },
  {
    name: "AI & Engagement",
    icon: Bot,
    href: "/ai",
  },
  {
    name: "Support",
    icon: Headphones,
    href: "/support",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <GraduationCap size={22} />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-tight">
              SkillForge
            </h1>

            <p className="text-xs text-slate-500">
              AI Analytics
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Analytics
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Card */}
      <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-slate-100 p-4">
        <p className="text-xs font-semibold text-slate-700">
          SkillForge Analytics
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          AI-powered learning platform insights.
        </p>
      </div>
    </aside>
  );
}