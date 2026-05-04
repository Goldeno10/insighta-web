"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Search,
  UserCircle,
  Sparkles,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profiles", label: "Profiles", icon: Users },
  { href: "/search", label: "Search", icon: Search },
  { href: "/account", label: "Account", icon: UserCircle },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-teal-900/40 bg-teal-950 text-teal-50 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-14 items-center gap-2 border-b border-teal-900/50 px-4 md:h-16 md:px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
          <Sparkles size={20} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">
            Insighta Labs+
          </p>
          <p className="hidden truncate text-xs text-teal-400/90 sm:block">
            Demographic intelligence
          </p>
        </div>
      </div>

      <nav
        className="flex flex-1 flex-row gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:gap-0.5 md:p-3 [&::-webkit-scrollbar]:hidden"
        aria-label="Main"
      >
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={
                active
                  ? "flex shrink-0 items-center gap-2 rounded-lg bg-teal-600/25 px-3 py-2.5 text-sm font-medium text-white ring-1 ring-teal-400/30 md:gap-3"
                  : "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-teal-200/80 transition hover:bg-teal-900/50 hover:text-teal-50 md:gap-3"
              }
            >
              <Icon size={18} className="shrink-0 opacity-90" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-teal-900/50 p-2 md:p-3">
        <LogoutButton className="flex w-full items-center justify-center gap-2 rounded-lg border border-teal-700/50 bg-teal-900/40 px-3 py-2.5 text-sm font-medium text-teal-100 transition hover:bg-teal-800/60 hover:text-white" />
      </div>
    </aside>
  );
}
