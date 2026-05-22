"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, LostReason, InteractionType } from "@/lib/supabase/types";

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "contattato",
  "call_prenotata",
  "call_fatta",
  "offerta_inviata",
  "won",
  "lost",
];

const VALID_LOST_REASONS: LostReason[] = [
  "no_budget",
  "no_interesse",
  "timing",
  "concorrente",
  "freddo",
  "altro",
];

interface ActionResult {
  ok: boolean;
  error?: string;
}

function isStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (VALID_STATUSES as readonly string[]).includes(value);
}

function isLostReason(value: unknown): value is LostReason {
  return (
    typeof value === "string" && (VALID_LOST_REASONS as readonly string[]).includes(value)
  );
}

/**
 * Aggiorna lo stato di un lead. Se passa a `lost` richiede una `lost_reason`.
 * Registra automaticamente un'interaction tipo `status_change`.
 */
export async function updateLeadStatus(formData: FormData): Promise<ActionResult> {
  const leadId = String(formData.get("lead_id") ?? "");
  const newStatus = formData.get("status");
  const lostReason = formData.get("lost_reason");

  if (!leadId) return { ok: false, error: "Lead id mancante." };
  if (!isStatus(newStatus)) return { ok: false, error: "Stato non valido." };
  if (newStatus === "lost" && !isLostReason(lostReason)) {
    return { ok: false, error: "Indica il motivo della perdita." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    // Recupera stato precedente per log
    const { data: existingRaw } = await supabase
      .from("leads")
      .select("status")
      .eq("id", leadId)
      .single();

    const existing = existingRaw as { status: LeadStatus } | null;
    const prevStatus = existing?.status ?? null;

    const updatePayload: Record<string, unknown> = { status: newStatus };
    if (newStatus === "lost") {
      updatePayload.lost_reason = lostReason;
    } else {
      updatePayload.lost_reason = null;
    }
    if (newStatus === "won") {
      updatePayload.acquired_at = new Date().toISOString();
    }

    const { error } = await supabase.from("leads").update(updatePayload).eq("id", leadId);
    if (error) {
      console.error("updateLeadStatus failed:", error);
      return { ok: false, error: "Errore nel salvataggio." };
    }

    // Log interaction
    await supabase.from("interactions").insert({
      lead_id: leadId,
      collaborator_id: user.id,
      type: "status_change" as InteractionType,
      content: `Stato cambiato: ${prevStatus ?? "—"} → ${newStatus}${
        newStatus === "lost" && lostReason ? ` (${lostReason})` : ""
      }`,
      metadata: { from: prevStatus, to: newStatus, lost_reason: lostReason ?? null },
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("updateLeadStatus error:", err);
    return { ok: false, error: "Errore di connessione." };
  }
}

/**
 * Aggiunge una nota a un lead (interaction type = note).
 */
export async function addLeadNote(formData: FormData): Promise<ActionResult> {
  const leadId = String(formData.get("lead_id") ?? "");
  const noteType = String(formData.get("note_type") ?? "note");
  const content = String(formData.get("content") ?? "").trim();

  if (!leadId) return { ok: false, error: "Lead id mancante." };
  if (!content) return { ok: false, error: "Inserisci il testo della nota." };
  if (content.length > 5000)
    return { ok: false, error: "Nota troppo lunga (max 5000 caratteri)." };

  const validTypes: InteractionType[] = ["note", "call", "whatsapp", "email", "meeting"];
  const interactionType = (validTypes as readonly string[]).includes(noteType)
    ? (noteType as InteractionType)
    : "note";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    const { error } = await supabase.from("interactions").insert({
      lead_id: leadId,
      collaborator_id: user.id,
      type: interactionType,
      content,
    });

    if (error) {
      console.error("addLeadNote failed:", error);
      return { ok: false, error: "Errore nel salvataggio nota." };
    }

    revalidatePath(`/admin/leads/${leadId}`);
    return { ok: true };
  } catch (err) {
    console.error("addLeadNote error:", err);
    return { ok: false, error: "Errore di connessione." };
  }
}

/**
 * Elimina un lead (solo admin via RLS).
 */
export async function deleteLead(formData: FormData): Promise<void> {
  const leadId = String(formData.get("lead_id") ?? "");
  if (!leadId) return;

  const supabase = await createClient();
  await supabase.from("leads").delete().eq("id", leadId);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}
