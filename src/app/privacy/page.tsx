import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BetaBanner } from "@/components/beta-banner";

export const metadata: Metadata = {
  title: "Privacy, Cookie & Termini",
  description: "Informativa privacy, cookie policy e termini di utilizzo.",
};

export default function PrivacyPage() {
  return (
    <>
      <BetaBanner />
      <Nav />

      <section className="py-16">
        <div className="container-page max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Documento legale · 2026</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
            Privacy, Cookie & Termini
          </h1>

          <div className="p-4 rounded-lg border-l-4 border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] mb-10">
            <p className="text-sm">
              <strong>⚠️ Placeholder</strong>: questo documento è generato come bozza. Prima di
              andare in produzione, sostituiscilo con un&apos;informativa generata su{" "}
              <a
                href="https://iubenda.com"
                target="_blank"
                rel="noopener"
                className="text-[var(--color-accent)] underline"
              >
                iubenda.com
              </a>{" "}
              o redatta da un legale.
            </p>
          </div>

          <article className="prose-content text-[var(--color-text-dim)] space-y-5 leading-relaxed">
            <h2 id="privacy" className="text-2xl font-extrabold text-[var(--color-text)] mt-12 mb-4">
              1. Privacy Policy
            </h2>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.1 Titolare del trattamento
            </h3>
            <p>
              Il titolare del trattamento è <strong>[NOME E COGNOME / RAGIONE SOCIALE]</strong>, con
              sede in [INDIRIZZO], P.IVA [NUMERO P.IVA], email{" "}
              <a href="mailto:contatti@example.com" className="text-[var(--color-accent)]">
                contatti@example.com
              </a>
              .
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">1.2 Dati raccolti</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Dati di contatto</strong>: nome, cognome, email, telefono — forniti via form
              </li>
              <li>
                <strong>Dati di navigazione</strong>: IP, browser, OS — raccolti per statistiche
              </li>
              <li>
                <strong>Dati di marketing</strong>: UTM, sorgente, link affiliate utilizzato
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">1.3 Finalità</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Inviarti i materiali formativi richiesti</li>
              <li>Contattarti tramite email, WhatsApp o telefono per presentare i prodotti</li>
              <li>Analizzare il comportamento sul sito (anonimo)</li>
              <li>Adempiere a obblighi di legge</li>
            </ul>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.4 Base giuridica
            </h3>
            <p>
              Consenso esplicito (art. 6.1.a GDPR), prestato tramite spunta al momento dell&apos;invio
              del form.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.5 Diritti dell&apos;interessato
            </h3>
            <p>Ai sensi degli artt. 15-22 GDPR, hai il diritto di:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Accedere ai tuoi dati</li>
              <li>Rettificarli o cancellarli</li>
              <li>Limitarne il trattamento</li>
              <li>Opporti al trattamento</li>
              <li>Ricevere i dati in formato strutturato</li>
              <li>Revocare il consenso in qualsiasi momento</li>
              <li>Proporre reclamo al Garante Privacy</li>
            </ul>
            <p>
              Per esercitare questi diritti:{" "}
              <a href="mailto:contatti@example.com" className="text-[var(--color-accent)]">
                contatti@example.com
              </a>
              .
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.6 Trasferimento a terzi
            </h3>
            <p>I dati possono essere trattati da fornitori esterni:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Supabase</strong> (USA/UE) — database e auth
              </li>
              <li>
                <strong>Vercel</strong> (USA) — hosting
              </li>
              <li>
                <strong>Google Analytics</strong> (USA) — se attivato
              </li>
            </ul>

            <h2 id="cookie" className="text-2xl font-extrabold text-[var(--color-text)] mt-12 mb-4">
              2. Cookie Policy
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Cookie tecnici</strong> (sempre attivi): necessari al funzionamento
              </li>
              <li>
                <strong>Cookie analitici</strong> (opzionali): statistiche anonime
              </li>
              <li>
                <strong>Cookie di marketing</strong> (opzionali): tracking conversioni
              </li>
            </ul>

            <h2 id="termini" className="text-2xl font-extrabold text-[var(--color-text)] mt-12 mb-4">
              3. Termini di utilizzo
            </h2>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.1 Natura formativa
            </h3>
            <p>
              Tutti i contenuti hanno esclusivamente scopo <strong>formativo ed educativo</strong>.
              Non costituiscono consulenza finanziaria, raccomandazione di investimento,
              sollecitazione al pubblico risparmio né attività riservate ai sensi del TUF (D.Lgs
              58/1998).
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.2 Rischio di investimento
            </h3>
            <p>
              Investire comporta <strong>rischi significativi</strong>, incluso il rischio di
              perdita totale del capitale. Le performance passate non garantiscono risultati
              futuri. Rivolgersi sempre a un consulente finanziario abilitato.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.3 Programma collaboratori
            </h3>
            <p>
              L&apos;adesione al programma collaboratori NOA è regolata da contratto separato. I
              guadagni dipendono esclusivamente da impegno e capacità individuali. Non è lavoro
              subordinato. Non sono garantiti guadagni minimi. Schemi piramidali vietati dalla
              Legge 173/2005 — NOA opera nel rispetto della normativa italiana sulla vendita
              diretta (Legge 17 agosto 2005, n. 173).
            </p>

            <hr className="my-10 border-[var(--color-border)]" />

            <p>
              <Link href="/" className="btn btn-ghost">
                ← Torna alla home
              </Link>
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
