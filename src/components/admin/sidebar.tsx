"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { PushPrompt } from "@/components/admin/push-prompt";
import { SpikeIcon } from "@/components/spike-icon";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/leads-management", label: "Gestione lead", icon: "🌳" },
  { href: "/admin/leads", label: "Tutti i lead", icon: "✉" },
];

interface SidebarProps {
  userEmail: string;
  isAdmin: boolean;
}

export function Sidebar({ userEmail, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Active state ottimistico: quando l'utente clicca un link, salviamo subito
  // l'href "pending" e lo usiamo per highlight finché la nuova pathname
  // non corrisponde. Risultato: highlight istantaneo invece di aspettare SSR.
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Quando la navigation completa (pathname/search cambiano), pulisci il pending
  useEffect(() => {
    setPendingHref(null);
  }, [pathname, searchParams]);

  function isActive(item: NavItem): boolean {
    // Override: se l'utente ha appena cliccato quel link, mostra subito attivo
    if (pendingHref === item.href) return true;
    // Se c'è un pending diverso, disattiva tutti gli altri (no doppi highlight)
    if (pendingHref && pendingHref !== item.href) return false;

    if (item.href === "/admin") return pathname === "/admin";
    return pathname.startsWith(item.href);
  }

  return (
    <aside className="w-full h-full border-r border-[var(--color-border)] bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/admin" className="flex items-center gap-2.5 font-extrabold">
          <SpikeIcon size={60} title="Spike" />
          <div className="leading-tight">
            <div className="text-base">Spike</div>
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
              prefetch
              onClick={() => setPendingHref(item.href)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                active
                  ? "bg-[rgba(59,212,248,0.12)] text-[var(--color-accent)] font-semibold translate-x-0.5"
                  : "text-[var(--color-text-dim)] hover:bg-white/5 hover:text-[var(--color-text)] hover:translate-x-0.5"
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

      {/* Push notifications */}
      <div className="px-3 pb-3">
        <PushPrompt />
      </div>

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
