"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SpikeIcon } from "@/components/spike-icon";

interface NavProps {
  variant?: "home" | "page";
}

export function Nav({ variant = "page" }: NavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Chiudi il drawer quando si naviga via route change (link ancora a parte —
  // quelli chiamano già setOpen(false) onClick).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Chiudi con tasto Esc + blocca scroll del body quando il drawer è aperto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop mobile — sibling dell'header per stare sotto al drawer (z-50)
          ma sopra al contenuto della pagina. Click ovunque = chiude. */}
      <button
        type="button"
        aria-label="Chiudi menù"
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        tabIndex={-1}
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-xl bg-[rgba(5,8,15,0.7)]">
      <div className="container-page flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight"
        >
          <SpikeIcon size={56} title="Spike" />
          <span>Spike</span>
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
          </nav>
        )}

        <Link
          href="/scopri"
          className="hidden md:inline-flex btn btn-primary !py-2 !px-4 !text-sm"
        >
          Inizia ora →
        </Link>

        <button
          className="md:hidden relative grid place-items-center w-10 h-10 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors active:scale-95 transition-transform"
          aria-label={open ? "Chiudi menù" : "Apri menù"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {/* 3 barre animate: top ruota +45°, middle fade, bottom ruota -45° */}
          <span
            aria-hidden
            className={`absolute w-5 h-[2px] bg-current rounded-full transition-all duration-300 ease-out ${
              open ? "rotate-45" : "-translate-y-[6px]"
            }`}
          />
          <span
            aria-hidden
            className={`absolute w-5 h-[2px] bg-current rounded-full transition-all duration-200 ease-out ${
              open ? "opacity-0 scale-x-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden
            className={`absolute w-5 h-[2px] bg-current rounded-full transition-all duration-300 ease-out ${
              open ? "-rotate-45" : "translate-y-[6px]"
            }`}
          />
        </button>
      </div>

      {/* Drawer mobile: slide-down via grid-template-rows (gestisce qualsiasi altezza) */}
      <div
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <nav className="relative z-10 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-6 flex flex-col gap-1">
            {(variant === "home"
              ? [
                  { href: "#problema", label: "Il problema" },
                  { href: "#prodotto", label: "Cosa offre" },
                  { href: "#educatori", label: "Educatori" },
                  { href: "#faq", label: "FAQ" },
                ]
              : [
                  { href: "/", label: "Home" },
                  { href: "/scopri", label: "Scopri" },
                ]
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="py-3 border-b border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/scopri"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="btn btn-primary mt-4"
            >
              Inizia ora →
            </Link>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
