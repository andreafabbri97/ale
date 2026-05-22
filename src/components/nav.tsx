"use client";

import Link from "next/link";
import { useState } from "react";

interface NavProps {
  variant?: "home" | "page";
}

export function Nav({ variant = "page" }: NavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-xl bg-[rgba(5,8,15,0.7)]">
      <div className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight"
        >
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black">
            N
          </span>
          <span>
            NOA <span className="text-[var(--color-text-faint)]">×</span> One Tribe
          </span>
        </Link>

        {variant === "home" ? (
          <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-text-dim)]">
            <Link href="#problema" className="hover:text-[var(--color-accent)] transition">
              Il problema
            </Link>
            <Link href="#prodotto" className="hover:text-[var(--color-accent)] transition">
              Cosa offre
            </Link>
            <Link href="#educatori" className="hover:text-[var(--color-accent)] transition">
              Educatori
            </Link>
            <Link href="#faq" className="hover:text-[var(--color-accent)] transition">
              FAQ
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-text-dim)]">
            <Link href="/" className="hover:text-[var(--color-accent)] transition">
              Home
            </Link>
            <Link href="/scopri" className="hover:text-[var(--color-accent)] transition">
              Scopri
            </Link>
            <Link href="/collabora" className="hover:text-[var(--color-accent)] transition">
              Collabora
            </Link>
          </nav>
        )}

        <Link href="/scopri" className="hidden md:inline-flex btn btn-primary">
          Inizia ora →
        </Link>

        <button
          className="md:hidden grid place-items-center w-10 h-10 rounded-lg border border-[var(--color-border)]"
          aria-label="Apri menù"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-6 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 border-b border-[var(--color-border)]">
            Home
          </Link>
          <Link href="/scopri" onClick={() => setOpen(false)} className="py-2 border-b border-[var(--color-border)]">
            Scopri NOA
          </Link>
          <Link href="/collabora" onClick={() => setOpen(false)} className="py-2 border-b border-[var(--color-border)]">
            Collabora
          </Link>
          <Link href="/scopri" onClick={() => setOpen(false)} className="btn btn-primary mt-2">
            Inizia ora →
          </Link>
        </nav>
      )}
    </header>
  );
}
