// =====================================================================
// Spike — Service Worker
// Gestisce: Web Push notifications + click handler
// =====================================================================

const CACHE_NAME = "spike-v1";

self.addEventListener("install", (event) => {
  // Attiva immediatamente il nuovo SW senza aspettare il refresh
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // Cleanup vecchie cache + claim subito tutti i client
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

// =====================================================================
// PUSH event — server invia notifica
// =====================================================================
self.addEventListener("push", (event) => {
  let payload = {
    title: "Spike",
    body: "Nuovo evento",
    url: "/admin",
  };

  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() };
    }
  } catch (err) {
    // Fallback per push senza payload JSON valido
    if (event.data) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: payload.tag || "spike-notification",
    data: { url: payload.url || "/admin" },
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// =====================================================================
// NOTIFICATIONCLICK — apri la pagina collegata
// =====================================================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/admin";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Se l'app è già aperta in una tab, focus + naviga
      for (const client of allClients) {
        const clientUrl = new URL(client.url);
        if (clientUrl.origin === self.location.origin) {
          await client.focus();
          if ("navigate" in client) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }

      // Altrimenti apri nuova finestra
      return self.clients.openWindow(targetUrl);
    })(),
  );
});
