"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlacementModal } from "@/components/admin/placement-modal";
import { LeadStatusBadge, LeadSourceBadge } from "@/components/admin/badges";
import type {
  OpenLead,
  AdminBranchSnapshot,
  SerializedNode,
} from "@/app/admin/(dashboard)/leads-management/actions";
import type { LeadSource, LeadStatus } from "@/lib/supabase/types";

interface OpenLeadsListProps {
  leads: OpenLead[];
  admins: AdminBranchSnapshot[];
  root: SerializedNode | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OpenLeadsList({ leads, admins, root }: OpenLeadsListProps) {
  const router = useRouter();
  const [selectedLead, setSelectedLead] = useState<OpenLead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="card text-center py-10 text-[var(--color-text-dim)] text-sm">
        Nessun lead aperto da chiudere. Quando arrivano nuovi lead dai form pubblici,
        appariranno qui.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="card !p-3 sm:!p-4 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold truncate">{lead.fullName}</span>
                <LeadSourceBadge source={lead.source as LeadSource} />
                <LeadStatusBadge status={lead.status as LeadStatus} />
                {lead.hasAlreadyPlacement && (
                  <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 rounded px-1.5 py-0.5">
                    già piazzato
                  </span>
                )}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] truncate">
                {lead.email} · {lead.phone || "no tel"} · {formatDate(lead.createdAt)}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="btn btn-ghost !px-3 !py-1.5 text-xs"
              >
                Dettaglio
              </Link>
              <button
                onClick={() => setSelectedLead(lead)}
                disabled={lead.hasAlreadyPlacement}
                className="btn btn-primary !px-3 !py-1.5 text-xs disabled:opacity-40"
              >
                {lead.hasAlreadyPlacement ? "—" : "Vendi e piazza"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <PlacementModal
          lead={selectedLead}
          admins={admins}
          root={root}
          onClose={() => setSelectedLead(null)}
          onSuccess={() => {
            setSelectedLead(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
