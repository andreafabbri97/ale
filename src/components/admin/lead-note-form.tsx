"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addLeadNote } from "@/app/admin/(dashboard)/leads/actions";

interface ActionState {
  ok: boolean;
  error?: string;
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? "Salvataggio..." : "Salva nota"}
    </button>
  );
}

interface Props {
  leadId: string;
}

export function LeadNoteForm({ leadId }: Props) {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    async (_prev, formData) => addLeadNote(formData),
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Pulisci il form dopo salvataggio riuscito
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="lead_id" value={leadId} />

      {state?.error && (
        <div
          role="alert"
          className="p-2 rounded border border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] text-xs"
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select name="note_type" defaultValue="note" className="input">
          <option value="note">📝 Nota interna</option>
          <option value="call">📞 Esito chiamata</option>
          <option value="whatsapp">💬 WhatsApp</option>
          <option value="email">✉️ Email</option>
          <option value="meeting">🤝 Meeting</option>
        </select>
        <SubmitBtn />
      </div>

      <textarea
        name="content"
        required
        rows={4}
        maxLength={5000}
        placeholder="Cosa è successo? Cosa è importante ricordare per la prossima volta?"
        className="textarea"
      />
    </form>
  );
}
