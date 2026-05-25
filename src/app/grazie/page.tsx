import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { LeadSource } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Grazie!",
  description: "Iscrizione completata. Ti contattiamo presto.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ source?: string }>;
}

export default async function GraziePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const source: LeadSource =
    params.source === "networker" ? "networker" : "cliente";

  const headline =
    source === "networker" ? "Candidatura ricevuta!" : "Grazie, ci sei!";
  const sub =
    source === "networker"
      ? "Ti contattiamo entro 48h per fissare la call conoscitiva."
      : "La tua guida è pronta qui sotto. Tra poco ti scriviamo anche su WhatsApp.";

  return (
    <>
      <Nav />

      <section className="hero-glow py-20 md:py-32">
        <div className="container-page max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            {headline.split("!")[0]}
            <span className="text-[var(--color-accent)]">!</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-dim)]">{sub}</p>

          {/* DOWNLOAD GUIDA — visibile solo per source=cliente */}
          {source === "cliente" && (
            <div className="card mt-10 max-w-xl mx-auto border-[var(--color-accent)]/40">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📘</div>
                <div className="flex-1 text-left">
                  <p className="eyebrow mb-2">Download immediato</p>
                  <h3 className="text-xl font-bold mb-1">
                    I 7 errori finanziari che fanno gli italiani
                  </h3>
                  <p className="text-sm text-[var(--color-text-dim)] mb-4">
                    Guida PDF gratuita — 10 pagine · ~6 minuti di lettura
                  </p>
                  <a
                    href="/guida-7-errori-finanziari.pdf"
                    download
                    target="_blank"
                    rel="noopener"
                    className="btn btn-primary"
                  >
                    ⬇ Scarica la guida (PDF)
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="card text-left max-w-xl mx-auto mt-8">
            <h3 className="text-xl font-bold mb-4">Cosa succede ora</h3>
            <ul className="space-y-3 text-[var(--color-text-dim)]">
              <li className="flex gap-3">
                <span className="text-[var(--color-accent)] font-bold">1.</span>
                <span>
                  <strong>Subito</strong>: {source === "cliente" ? "scarichi la guida qui sopra" : "ti arriva una email di conferma"}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-accent)] font-bold">2.</span>
                <span>
                  <strong>Entro 24–48h</strong>: ti contattiamo via WhatsApp o telefono
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-accent)] font-bold">3.</span>
                <span>
                  <strong>Ti proponiamo</strong>: una call gratuita di 30 minuti
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-accent)] font-bold">4.</span>
                <span>
                  <strong>Niente pressioni</strong>: decidi tu se andare avanti
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold mb-3">Vuoi anticipare? Scrivici su WhatsApp.</h3>
            <a
              href={`https://wa.me/393000000000?text=${encodeURIComponent(
                source === "networker"
                  ? "Ciao, mi sono appena candidato/a come collaboratore tramite Spike"
                  : "Ciao, mi sono appena iscritto/a tramite Spike",
              )}`}
              rel="noopener"
              className="btn btn-primary"
            >
              💬 Scrivici su WhatsApp →
            </a>
          </div>

          <p className="mt-16">
            <Link href="/" className="text-[var(--color-text-dim)] underline hover:text-[var(--color-accent)]">
              ← Torna alla home
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
