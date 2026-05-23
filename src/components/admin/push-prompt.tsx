"use client";

import { useEffect, useState, useTransition } from "react";
import {
  subscribeToPush,
  unsubscribeFromPush,
  sendTestPush,
} from "@/app/admin/(dashboard)/push-actions";

type Status = "unsupported" | "denied" | "prompt" | "subscribed" | "loading";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) {
    view[i] = raw.charCodeAt(i);
  }
  return view;
}

function bufferToBase64(buf: ArrayBuffer | null): string {
  if (!buf) return "";
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function PushPrompt() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const vapidPubKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        if (!cancelled) setStatus("unsupported");
        return;
      }

      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Aspetta che SW sia ready
        await navigator.serviceWorker.ready;

        const permission = Notification.permission;
        if (permission === "denied") {
          if (!cancelled) setStatus("denied");
          return;
        }

        const sub = await reg.pushManager.getSubscription();
        if (!cancelled) {
          setStatus(sub ? "subscribed" : "prompt");
        }
      } catch (err) {
        console.error("[push-prompt] SW register error:", err);
        if (!cancelled) {
          setStatus("unsupported");
          setMessage("Errore registrazione service worker.");
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubscribe() {
    if (!vapidPubKey) {
      setMessage("VAPID public key non configurata.");
      return;
    }

    setMessage(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "prompt");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPubKey),
      });

      const subJson = sub.toJSON();
      const p256dh = subJson.keys?.p256dh ?? bufferToBase64(sub.getKey("p256dh"));
      const auth = subJson.keys?.auth ?? bufferToBase64(sub.getKey("auth"));

      startTransition(async () => {
        const result = await subscribeToPush({
          endpoint: sub.endpoint,
          p256dh,
          auth,
          userAgent: navigator.userAgent,
        });

        if (result.ok) {
          setStatus("subscribed");
          setMessage("Notifiche attivate ✓");
        } else {
          setMessage(result.error ?? "Errore.");
        }
      });
    } catch (err) {
      console.error("[push-prompt] subscribe error:", err);
      setMessage("Impossibile attivare le notifiche.");
    }
  }

  async function handleUnsubscribe() {
    setMessage(null);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) {
        setStatus("prompt");
        return;
      }

      const endpoint = sub.endpoint;
      await sub.unsubscribe();

      startTransition(async () => {
        await unsubscribeFromPush(endpoint);
        setStatus("prompt");
        setMessage("Notifiche disattivate.");
      });
    } catch (err) {
      console.error("[push-prompt] unsubscribe error:", err);
      setMessage("Errore disattivazione.");
    }
  }

  async function handleTest() {
    setMessage(null);
    startTransition(async () => {
      const result = await sendTestPush();
      if (result.ok) {
        setMessage(`Test inviato a ${result.sent ?? 0} dispositivi.`);
      } else {
        setMessage(result.error ?? "Errore invio test.");
      }
    });
  }

  if (status === "loading") {
    return (
      <div className="card !p-4 text-xs text-[var(--color-text-faint)] text-center">
        Carico...
      </div>
    );
  }

  if (status === "unsupported") {
    return (
      <div className="card !p-4">
        <div className="text-xs font-semibold mb-1">🔕 Notifiche</div>
        <p className="text-xs text-[var(--color-text-dim)]">
          Browser non supportato. Su iPhone installa la PWA dalla home (iOS 16.4+).
        </p>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="card !p-4 border-[rgba(231,76,60,0.3)]">
        <div className="text-xs font-semibold mb-1">🔕 Notifiche bloccate</div>
        <p className="text-xs text-[var(--color-text-dim)]">
          Le hai bloccate. Riabilitale dalle impostazioni del browser per questo sito.
        </p>
      </div>
    );
  }

  if (status === "subscribed") {
    return (
      <div className="card !p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold">🔔 Notifiche attive</div>
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-success)]">
            ON
          </span>
        </div>
        {message && (
          <p className="text-xs text-[var(--color-accent)] mb-2">{message}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleTest}
            disabled={isPending}
            className="btn btn-ghost !px-2 !py-1.5 text-xs flex-1"
          >
            {isPending ? "..." : "Test"}
          </button>
          <button
            onClick={handleUnsubscribe}
            disabled={isPending}
            className="btn btn-ghost !px-2 !py-1.5 text-xs flex-1 text-[var(--color-text-faint)]"
          >
            Disattiva
          </button>
        </div>
      </div>
    );
  }

  // prompt
  return (
    <div className="card !p-4 border-[var(--color-accent)]/40">
      <div className="text-xs font-semibold mb-1">🔔 Attiva notifiche</div>
      <p className="text-xs text-[var(--color-text-dim)] mb-3">
        Ricevi un avviso istantaneo quando arriva un nuovo lead.
      </p>
      {message && (
        <p className="text-xs text-[var(--color-danger)] mb-2">{message}</p>
      )}
      <button
        onClick={handleSubscribe}
        disabled={isPending}
        className="btn btn-primary w-full !py-2 text-xs"
      >
        {isPending ? "Attivazione..." : "Attiva notifiche"}
      </button>
    </div>
  );
}
