"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "@/app/admin/actions";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  matchSearch?: { key: string; value: string };
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/leads", label: "Tutti i lead", icon: "✉" },
  {
    href: "/admin/leads?source=cliente",
    label: "Solo clienti",
    icon: "👤",
    matchSearch: { key: "source", value: "cliente" },
  },
  {
    href: "/admin/leads?source=networker",
    label: "Solo networker",
    icon: "🤝",
    matchSearch: { key: "source", value: "networker" },
  },
];

interface SidebarProps {
  userEmail: string;
  isAdmin: boolean;
}

export function Sidebar({ userEmail, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(item: NavItem): boolean {
    const itemPath = item.href.split("?")[0];

    if (item.matchSearch) {
      return (
        pathname.startsWith(itemPath) &&
        searchParams.get(item.matchSearch.key) === item.matchSearch.value
      );
    }

    if (itemPath === "/admin") return pathname === "/admin";

    // /admin/leads attivo solo se non ci sono filtri source (perché quelli hanno una voce dedicata)
    if (itemPath === "/admin/leads") {
      return pathname.startsWith("/admin/leads") && !searchParams.get("source");
    }

    return pathname.startsWith(itemPath);
  }

  return (
    <aside className="w-full h-full border-r border-[var(--color-border)] bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/admin" className="flex items-center gap-2.5 font-extrabold">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black">
            A
          </span>
          <div className="leading-tight">
            <div className="text-base">Alead</div>
            <div className="text-xs text-[var(--color-text-faint)] font-normal">Admin panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
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
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* External link al sito pubblico */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-dim)] hover:bg-white/5 hover:text-[var(--color-text)] transition mt-6"
        >
          <span className="text-base w-5 text-center">↗</span>
          <span>Sito pubblico</span>
        </Link>
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
