"use client";

import { useState } from "react";

type Theme = "dark" | "light";

const FILES: Record<Theme, string> = {
  dark: "/guida-7-errori-finanziari-dark.pdf",
  light: "/guida-7-errori-finanziari-light.pdf",
};

interface ThemeCardProps {
  theme: Theme;
  selected: boolean;
  onSelect: () => void;
}

function ThemePreview({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";
  const bg = isDark ? "#05080F" : "#FFFFFF";
  const text = isDark ? "#F5F8FF" : "#0F172A";
  const dim = isDark ? "#A8B3CF" : "#475569";
  const accent = isDark ? "#3BD4F8" : "#2C7BE5";
  const cardBg = isDark ? "#0A1226" : "#F8FAFC";
  const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  return (
    <div
      className="aspect-[3/4] rounded-lg overflow-hidden relative"
      style={{
        background: bg,
        border: `1px solid ${border}`,
      }}
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: accent }} />

      <div className="p-3 sm:p-4 h-full flex flex-col">
        <div className="text-[7px] sm:text-[8px] font-bold tracking-widest mb-2" style={{ color: accent }}>
          SPIKE · GUIDA
        </div>

        <div className="text-[11px] sm:text-sm font-extrabold leading-tight mb-2" style={{ color: text }}>
          I 7 errori<br />
          finanziari
        </div>

        <div className="text-[7px] sm:text-[9px] leading-tight mb-3" style={{ color: dim }}>
          Cosa nessuno ti ha mai insegnato.
        </div>

        {/* Fake content blocks */}
        <div className="space-y-1 flex-1">
          <div className="h-1 rounded" style={{ background: dim, opacity: 0.4, width: "90%" }} />
          <div className="h-1 rounded" style={{ background: dim, opacity: 0.4, width: "75%" }} />
          <div className="h-1 rounded" style={{ background: dim, opacity: 0.4, width: "85%" }} />
        </div>

        {/* Fake callout */}
        <div
          className="mt-2 p-1.5 rounded text-[6px] sm:text-[7px] font-semibold"
          style={{
            background: `${accent}1a`,
            border: `0.5px solid ${accent}`,
            color: text,
          }}
        >
          Cosa fare oggi →
        </div>

        {/* Footer */}
        <div
          className="mt-2 pt-1 text-[6px] sm:text-[7px] flex justify-between"
          style={{
            color: dim,
            borderTop: `0.5px solid ${border}`,
          }}
        >
          <span>Spike</span>
          <span style={{ background: cardBg }}>Pag. 1</span>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({ theme, selected, onSelect }: ThemeCardProps) {
  const label = theme === "dark" ? "Tema scuro" : "Tema chiaro";
  const desc =
    theme === "dark"
      ? "Migliore di sera, schermo a occhio riposato."
      : "Migliore per stampa e lettura diurna.";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`text-left rounded-xl p-3 sm:p-4 transition-all duration-200 group ${
        selected
          ? "bg-[rgba(59,212,248,0.08)] border-2 border-[var(--color-accent)] shadow-[0_0_30px_rgba(59,212,248,0.2)]"
          : "bg-[var(--color-bg-2)] border-2 border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
      }`}
    >
      <ThemePreview theme={theme} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-bold text-sm sm:text-base">{label}</div>
          <div className="text-xs text-[var(--color-text-dim)] mt-0.5">{desc}</div>
        </div>
        <div
          className={`shrink-0 w-5 h-5 rounded-full border-2 grid place-items-center transition ${
            selected
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
              : "border-[var(--color-border-strong)]"
          }`}
        >
          {selected && (
            <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="var(--color-bg)" strokeWidth="3">
              <polyline points="3,8 7,12 13,4" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

export function GuideDownloadPicker() {
  const [theme, setTheme] = useState<Theme>("dark");

  return (
    <div className="card mt-10 max-w-2xl mx-auto border-[var(--color-accent)]/40">
      <div className="text-left mb-5">
        <p className="eyebrow mb-2">Download immediato</p>
        <h3 className="text-xl sm:text-2xl font-bold mb-1">
          I 7 errori finanziari che fanno gli italiani
        </h3>
        <p className="text-sm text-[var(--color-text-dim)]">
          Guida PDF gratuita · 14 pagine · ~20 minuti di lettura
        </p>
      </div>

      <p className="text-sm font-semibold mb-3 text-left">
        Scegli la versione che preferisci:
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
        <ThemeCard
          theme="dark"
          selected={theme === "dark"}
          onSelect={() => setTheme("dark")}
        />
        <ThemeCard
          theme="light"
          selected={theme === "light"}
          onSelect={() => setTheme("light")}
        />
      </div>

      <a
        href={FILES[theme]}
        download
        target="_blank"
        rel="noopener"
        className="btn btn-primary btn-block btn-lg"
      >
        ⬇ Scarica la guida ({theme === "dark" ? "scuro" : "chiaro"})
      </a>

      <p className="text-xs text-[var(--color-text-faint)] text-center mt-3">
        Cambi idea? Puoi tornare qui e scaricare anche l&apos;altra versione.
      </p>
    </div>
  );
}
