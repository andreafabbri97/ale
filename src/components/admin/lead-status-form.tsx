"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateLeadStatus } from "@/app/admin/(dashboard)/leads/actions";
import type { LeadStatus } from "@/lib/supabase/types";

interface ActionState {
  ok: boolean;
  error?: string;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuovo",
  contattato: "Contattato",
  call_prenotata: "Call prenotata",
  call_fatta: "Call fatta",
  offerta_inviata: "Offerta inviata",
  won: "WON (acquistato)",
  lost: "LOST (perso)",
};

const STATUS_VALUES: LeadStatus[] = [
  "new",
  "contattato",
  "call_prenotata",
  "call_fatta",
  "offerta_inviata",
  "won",
  "lost",
];

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? "Salvataggio..." : "Aggiorna stato"}
    </button>
  );
}

interface Props {
  leadId: string;
  currentStatus: LeadStatus;
}

export function LeadStatusForm({ leadId, currentStatus }: Props) {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    async (_prev, formData) => updateLeadStatus(formData),
    null,
  );
  const [selected, setSelected] = useState<LeadStatus>(currentStatus);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="lead_id" value={leadId} />

      {state?.error && (
        <div
          role="alert"
          className="p-2 rounded border border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] text-xs"
        >
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest mb-1 text-[var(--color-text-faint)]">
          Nuovo stato
        </label>
        <select
          name="status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as LeadStatus)}
          className="input"
        >
          {STATUS_VALUES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {selected === "lost" && (
        <div>
          <label className="block text-xs uppercase tracking-widest mb-1 text-[var(--color-text-faint)]">
            Motivo perdita
          </label>
          <select name="lost_reason" required className="input">
            <option value="">Seleziona...</option>
            <option value="no_budget">Senza budget</option>
            <option value="no_interesse">Non interessato</option>
            <option value="timing">Timing sbagliato</option>
            <option value="concorrente">Andato dalla concorrenza</option>
            <option value="freddo">Non risponde più</option>
            <option value="altro">Altro</option>
          </select>
        </div>
      )}

      <SubmitBtn />
    </form>
  );
}
