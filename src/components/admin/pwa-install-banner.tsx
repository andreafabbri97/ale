"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "alead_pwa_install_dismissed_at";
const DISMISS_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "android" | "ios" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "desktop";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function wasRecentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number.parseInt(raw, 10);
    if (Number.isNaN(dismissedAt)) return false;
    const days = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    return days < DISMISS_DAYS;
  } catch {
    return false;
  }
}

export function PwaInstallBanner() {
  const [mounted, setMounted] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [showBanner, setShowBanner] = useState(false);
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPlatform(detectPlatform());

    if (isStandalone() || wasRecentlyDismissed()) {
      return;
    }

    setShowBanner(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setShowBanner(false);
      setInstallEvent(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setShowBanner(false);
    setShowIosGuide(false);
  }

  async function handleInstall() {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") {
        setShowBanner(false);
      }
      setInstallEvent(null);
      return;
    }

    if (platform === "ios") {
      setShowIosGuide(true);
      return;
    }

    // Fallback: nessun prompt nativo disponibile
    setShowIosGuide(true);
  }

  if (!mounted || !showBanner) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
          paddingRight: "max(0.75rem, env(safe-area-inset-right))",
        }}
      >
        <div className="pointer-events-auto max-w-md mx-auto bg-gradient-to-r from-[var(--color-bg-2)] to-[var(--color-bg-3)] border border-[var(--color-accent)]/40 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black text-xl shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">Installa Alead sul telefono</div>
            <div className="text-xs text-[var(--color-text-dim)] mt-0.5">
              Ricevi notifiche push quando arriva un nuovo lead.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstall}
              className="btn btn-primary !px-3 !py-2 text-sm"
            >
              Installa
            </button>
            <button
              onClick={dismiss}
              aria-label="Chiudi"
              className="grid place-items-center w-8 h-8 rounded-lg text-[var(--color-text-faint)] hover:text-[var(--color-text)] transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* iOS guide modal */}
      {showIosGuide && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            className="card max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2">
              Installa Alead {platform === "ios" ? "su iPhone" : "manualmente"}
            </h3>
            <ol className="text-sm text-[var(--color-text-dim)] space-y-2 list-decimal list-inside mb-4">
              {platform === "ios" ? (
                <>
                  <li>
                    Tocca il pulsante <strong>Condividi</strong> ⤴ in basso a Safari
                  </li>
                  <li>
                    Scorri e tocca <strong>&quot;Aggiungi a Home&quot;</strong>
                  </li>
                  <li>
                    Conferma con <strong>&quot;Aggiungi&quot;</strong>
                  </li>
                  <li>L&apos;icona Alead apparirà sulla home — apri da lì</li>
                  <li>Dentro l&apos;app, attiva le notifiche dal banner</li>
                </>
              ) : (
                <>
                  <li>Apri il menù del browser (3 puntini in alto)</li>
                  <li>
                    Tocca <strong>&quot;Installa app&quot;</strong> o{" "}
                    <strong>&quot;Aggiungi a schermata Home&quot;</strong>
                  </li>
                  <li>Conferma</li>
                </>
              )}
            </ol>
            <p className="text-xs text-[var(--color-text-faint)] mb-4">
              ⚠ Le notifiche push su iPhone funzionano solo se l&apos;app è installata sulla home (iOS 16.4+).
            </p>
            <button
              onClick={() => setShowIosGuide(false)}
              className="btn btn-ghost w-full"
            >
              Ho capito
            </button>
          </div>
        </div>
      )}
    </>
  );
}
