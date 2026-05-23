"use server";

import { createClient } from "@/lib/supabase/server";
import { sendPushToAdmins } from "@/lib/push";

interface SubscribeInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}

interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Salva una nuova push subscription per il collaborator loggato.
 * Idempotente: se l'endpoint esiste già, non duplica.
 */
export async function subscribeToPush(input: SubscribeInput): Promise<ActionResult> {
  if (!input.endpoint || !input.p256dh || !input.auth) {
    return { ok: false, error: "Subscription payload incompleto." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    // Upsert per endpoint (unique)
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        collaborator_id: user.id,
        endpoint: input.endpoint,
        p256dh: input.p256dh,
        auth: input.auth,
        user_agent: input.userAgent ?? null,
      },
      { onConflict: "endpoint" },
    );

    if (error) {
      console.error("[push] subscribe insert failed:", error);
      return { ok: false, error: "Errore nel salvataggio." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[push] subscribe fatal:", err);
    return { ok: false, error: "Errore di connessione." };
  }
}

/**
 * Rimuove una subscription dato l'endpoint.
 */
export async function unsubscribeFromPush(endpoint: string): Promise<ActionResult> {
  if (!endpoint) return { ok: false, error: "Endpoint mancante." };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint)
      .eq("collaborator_id", user.id);

    if (error) {
      console.error("[push] unsubscribe failed:", error);
      return { ok: false, error: "Errore." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[push] unsubscribe fatal:", err);
    return { ok: false, error: "Errore di connessione." };
  }
}

/**
 * Invia una notifica push di test a tutti gli admin sottoscritti.
 * Usata dal pulsante "Invia test" nel pannello.
 */
export async function sendTestPush(): Promise<ActionResult & { sent?: number }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    const result = await sendPushToAdmins({
      title: "Test notifica Alead",
      body: "Se vedi questo messaggio, le notifiche push funzionano correttamente.",
      url: "/admin",
      tag: "alead-test",
    });

    return { ok: true, sent: result.sent };
  } catch (err) {
    console.error("[push] test send fatal:", err);
    return { ok: false, error: "Errore invio test." };
  }
}
