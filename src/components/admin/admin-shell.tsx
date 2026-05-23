"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { PwaInstallBanner } from "@/components/admin/pwa-install-banner";

interface AdminShellProps {
  userEmail: string;
  isAdmin: boolean;
  children: React.ReactNode;
}

export function AdminShell({ userEmail, isAdmin, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Chiudi il drawer quando si naviga
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll quando il drawer è aperto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Sidebar — desktop: inline, mobile: fixed overlay (rispetta safe area su iOS) */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw]
          transform transition-transform duration-200 ease-out
          md:relative md:translate-x-0 md:w-64 md:max-w-none md:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
        }}
      >
        <Sidebar userEmail={userEmail} isAdmin={isAdmin} />
      </div>

      {/* Backdrop mobile */}
      {mobileOpen && (
        <button
          aria-label="Chiudi menù"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden cursor-default"
        />
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile (visibile solo <md) — gestisce notch iOS via safe-area-inset-top */}
        <header
          className="md:hidden sticky top-0 z-30 bg-[rgba(5,8,15,0.85)] backdrop-blur-xl border-b border-[var(--color-border)] flex items-center justify-between px-4"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
            minHeight: "calc(3.5rem + env(safe-area-inset-top))",
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="grid place-items-center w-10 h-10 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition shrink-0"
            aria-label="Apri menù"
            aria-expanded={mobileOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="flex items-center gap-2 font-extrabold">
            <span className="grid place-items-center w-7 h-7 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black text-sm">
              A
            </span>
            <span>Alead</span>
          </div>

          {/* Spacer per bilanciare il burger */}
          <div className="w-10 h-10" />
        </header>

        {/* Content area */}
        <main
          className="flex-1 overflow-x-hidden"
          style={{
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          <div
            className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto md:mx-0"
            style={{
              paddingBottom: "calc(8rem + env(safe-area-inset-bottom))",
            }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* PWA install banner — visibile finché non installata */}
      <PwaInstallBanner />
    </div>
  );
}
