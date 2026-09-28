"use client";

import { Bell, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/users": "Users",
  "/courses": "Courses",
  "/revenue": "Revenue",
  "/ai": "AI & Engagement",
  "/support": "Support",
};

export default function Header() {
  const pathname = usePathname();

  const pageTitle = pageTitles[pathname] ?? "Overview";

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
          <Menu size={21} />
        </button>

        <div>
          <p className="text-xs text-slate-500">
            Dashboard
          </p>

          <h2 className="text-lg font-bold">
            {pageTitle}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search
            size={16}
            className="text-slate-400"
          />

          <input
            placeholder="Search..."
            className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <button className="relative rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white sm:flex">
          A
        </div>
      </div>
    </header>
  );
}