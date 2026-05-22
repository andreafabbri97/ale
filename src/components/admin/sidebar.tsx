"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/actions";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/leads", label: "Lead", icon: "✉" },
  { href: "/admin/leads?source=cliente", label: "Solo clienti", icon: "👤" },
  { href: "/admin/leads?source=networker", label: "Solo networker", icon: "🤝" },
];

interface SidebarProps {
  userEmail: string;
  isAdmin: boolean;
}

export function Sidebar({ userEmail, isAdmin }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/admin" className="flex items-center gap-2.5 font-extrabold">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black">
            N
          </span>
          <div className="leading-tight">
            <div className="text-sm">NOA × One Tribe</div>
            <div className="text-xs text-[var(--color-text-faint)] font-normal">Admin panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const itemPath = item.href.split("?")[0];
          const itemQuery = item.href.split("?")[1];
          const active =
            (itemPath === "/admin" && pathname === "/admin") ||
            (itemPath !== "/admin" && pathname.startsWith(itemPath) && !itemQuery) ||
            (itemQuery && pathname + window.location.search === item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active
                  ? "bg-[rgba(59,212,248,0.1)] text-[var(--color-accent)] font-semibold"
                  : "text-[var(--color-text-dim)] hover:bg-white/5 hover:text-[var(--color-text)]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="text-xs text-[var(--color-text-faint)] mb-1">Loggato come</div>
        <div className="text-sm font-semibold truncate" title={userEmail}>
          {userEmail}
        </div>
        {isAdmin && (
          <div className="mt-1 inline-block text-[10px] uppercase tracking-widest font-bold text-[var(--color-accent)] border border-[var(--color-accent)] rounded px-1.5 py-0.5">
            Admin
          </div>
        )}
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-[var(--color-text-dim)] hover:bg-white/5 hover:text-[var(--color-danger)] transition"
          >
            → Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
