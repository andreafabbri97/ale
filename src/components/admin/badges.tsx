import type { LeadSource, LeadStatus, LeadScore } from "@/lib/supabase/types";

const STATUS_STYLES: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "Nuovo", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  contattato: {
    label: "Contattato",
    color: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  call_prenotata: {
    label: "Call prenotata",
    color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  },
  call_fatta: {
    label: "Call fatta",
    color: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  },
  offerta_inviata: {
    label: "Offerta inviata",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  won: { label: "WON", color: "bg-green-500/20 text-green-300 border-green-500/40" },
  lost: { label: "Lost", color: "bg-red-500/20 text-red-300 border-red-500/40" },
};

const SOURCE_STYLES: Record<LeadSource, { label: string; color: string }> = {
  cliente: { label: "Cliente B2C", color: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30" },
  networker: {
    label: "Networker",
    color: "bg-indigo-500/15 text-indigo-200 border-indigo-500/30",
  },
};

const SCORE_STYLES: Record<LeadScore, { color: string }> = {
  A: { color: "bg-green-500/25 text-green-300 border-green-500/50" },
  B: { color: "bg-blue-500/25 text-blue-300 border-blue-500/50" },
  C: { color: "bg-amber-500/25 text-amber-300 border-amber-500/50" },
  D: { color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/40" },
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}
    >
      {s.label}
    </span>
  );
}

export function LeadSourceBadge({ source }: { source: LeadSource }) {
  const s = SOURCE_STYLES[source];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}
    >
      {s.label}
    </span>
  );
}

export function LeadScoreBadge({ score }: { score: LeadScore | null }) {
  if (!score) return <span className="text-xs text-[var(--color-text-faint)]">—</span>;
  const s = SCORE_STYLES[score];
  return (
    <span
      className={`inline-grid place-items-center w-7 h-7 rounded-full text-xs font-extrabold border ${s.color}`}
    >
      {score}
    </span>
  );
}
