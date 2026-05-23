import Link from "next/link";
import {
  LeadStatusBadge,
  LeadSourceBadge,
  LeadScoreBadge,
} from "@/components/admin/badges";
import type { Lead } from "@/lib/supabase/types";

interface LeadCardMobileProps {
  lead: Lead;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Card mobile per visualizzare un lead nella lista — sostituisce la riga di tabella su <md.
 */
export function LeadCardMobile({ lead }: LeadCardMobileProps) {
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className="card card-hover block !p-4 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base truncate">{lead.full_name}</h3>
          <p className="text-xs text-[var(--color-text-faint)] mt-0.5">
            {formatDate(lead.created_at)}
          </p>
        </div>
        {lead.source === "networker" && lead.score && (
          <LeadScoreBadge score={lead.score} />
        )}
      </div>

      <div className="space-y-1 mb-3 text-sm text-[var(--color-text-dim)]">
        <div className="truncate">
          <span className="text-[var(--color-text-faint)]">✉</span> {lead.email}
        </div>
        <div className="truncate">
          <span className="text-[var(--color-text-faint)]">☎</span> {lead.phone}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <LeadSourceBadge source={lead.source} />
        <LeadStatusBadge status={lead.status} />
        <span className="ml-auto text-xs text-[var(--color-accent)]">Apri →</span>
      </div>
    </Link>
  );
}
