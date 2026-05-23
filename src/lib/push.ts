import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/server";

// =====================================================================
// VAPID config (chiamato solo lato server)
// =====================================================================
function configureVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    console.warn("[push] VAPID env vars missing — push disabled");
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

const vapidReady = configureVapid();

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

interface SubscriptionRow {
  id: string;
  collaborator_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Invia una notifica push a TUTTI gli admin (collaborators con is_admin=true)
 * che hanno almeno una subscription registrata.
 *
 * Rimuove automaticamente le subscription stale (410 Gone / 404).
 *
 * Fallback safe: se VAPID non è configurato o se Supabase fallisce, non lancia
 * eccezioni — solo log. Non vogliamo che un push fallito blocchi l'inserimento di un lead.
 */
export async function sendPushToAdmins(payload: PushPayload): Promise<{
  sent: number;
  failed: number;
  removed: number;
}> {
  if (!vapidReady) {
    return { sent: 0, failed: 0, removed: 0 };
  }

  try {
    const supabase = createAdminClient();

    // Recupera tutti gli admin ID
    const { data: admins, error: adminsErr } = await supabase
      .from("collaborators")
      .select("id")
      .eq("is_admin", true)
      .eq("is_active", true);

    if (adminsErr || !admins || admins.length === 0) {
      return { sent: 0, failed: 0, removed: 0 };
    }

    const adminIds = (admins as { id: string }[]).map((a) => a.id);

    // Recupera tutte le loro subscriptions
    const { data: subs, error: subsErr } = await supabase
      .from("push_subscriptions")
      .select("id, collaborator_id, endpoint, p256dh, auth")
      .in("collaborator_id", adminIds);

    if (subsErr || !subs || subs.length === 0) {
      return { sent: 0, failed: 0, removed: 0 };
    }

    const subscriptions = subs as SubscriptionRow[];
    const messageBody = JSON.stringify(payload);

    let sent = 0;
    let failed = 0;
    const staleSubIds: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            messageBody,
          );
          sent += 1;
        } catch (err: unknown) {
          const statusCode =
            typeof err === "object" && err !== null && "statusCode" in err
              ? (err as { statusCode: number }).statusCode
              : 0;

          // 404/410: subscription scaduta o revocata — rimuovi
          if (statusCode === 404 || statusCode === 410) {
            staleSubIds.push(sub.id);
          } else {
            failed += 1;
            console.error("[push] send error:", statusCode, err);
          }
        }
      }),
    );

    if (staleSubIds.length > 0) {
      await supabase.from("push_subscriptions").delete().in("id", staleSubIds);
    }

    return { sent, failed, removed: staleSubIds.length };
  } catch (err) {
    console.error("[push] sendPushToAdmins fatal:", err);
    return { sent: 0, failed: 0, removed: 0 };
  }
}
