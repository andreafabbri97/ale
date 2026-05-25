import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BetaBanner } from "@/components/beta-banner";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy, Cookie & Termini",
  description: "Informativa privacy, cookie policy e termini di utilizzo.",
};

// Helper rendering: mostra il valore se è reale, altrimenti placeholder evidente
function Val({ value }: { value: string }) {
  const isTodo = value.startsWith("__TODO__") || value === "—";
  if (isTodo) {
    return (
      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono text-xs">
        {value.replace("__TODO__", "")} (da completare)
      </span>
    );
  }
  return <strong>{value}</strong>;
}

export default function PrivacyPage() {
  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <BetaBanner />
      <Nav />

      <section className="py-16">
        <div className="container-page max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Documento legale · Ultimo aggiornamento: {today}</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
            Privacy, Cookie &amp; Termini
          </h1>

          <div className="p-4 rounded-lg border-l-4 border-amber-500 bg-amber-500/10 mb-10">
            <p className="text-sm leading-relaxed">
              <strong>⚠ Documento in completamento.</strong> I dati del titolare del trattamento
              (nome, indirizzo, P.IVA, email reali) sono in fase di raccolta. I valori
              evidenziati come <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono text-xs">da completare</span> verranno sostituiti prima della pubblicazione
              produttiva.
            </p>
          </div>

          <article className="prose-content text-[var(--color-text-dim)] space-y-5 leading-relaxed">
            {/* ============================ PRIVACY ============================ */}
            <h2 id="privacy" className="text-2xl font-extrabold text-[var(--color-text)] mt-12 mb-4">
              1. Privacy Policy
            </h2>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.1 Titolare del trattamento
            </h3>
            <p>
              Il titolare del trattamento dei dati è <Val value={siteConfig.legal.titolare} />,
              con sede in <Val value={siteConfig.legal.indirizzo} />, P.IVA{" "}
              <Val value={siteConfig.legal.partitaIva} />. Email privacy:{" "}
              <Val value={siteConfig.legal.emailPrivacy} />.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.2 Dati raccolti
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Dati di contatto</strong>: nome, email, telefono (se fornito) — raccolti
                tramite form di richiesta informazioni e candidatura collaboratori
              </li>
              <li>
                <strong>Dati di profilo</strong> (collaboratori): rank, attività di vendita, link
                affiliate
              </li>
              <li>
                <strong>Dati di navigazione</strong>: IP, user agent, pagine visitate, parametri
                UTM, sorgente (necessari al funzionamento del sito e all&apos;attribuzione lead)
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.3 Finalità del trattamento
            </h3>
            <ol className="list-decimal pl-6 space-y-1">
              <li>
                <strong>Invio materiali informativi richiesti</strong> (guida formativa,
                presentazione opportunità) — base giuridica: consenso (art. 6.1.a GDPR)
              </li>
              <li>
                <strong>Ricontatto commerciale</strong> per presentare i prodotti formativi
                proposti — base giuridica: consenso esplicito al ricontatto
              </li>
              <li>
                <strong>Adempimento contratto</strong> per i collaboratori — base giuridica: art.
                6.1.b GDPR
              </li>
              <li>
                <strong>Statistiche aggregate</strong> di utilizzo del sito — base giuridica:
                legittimo interesse (art. 6.1.f GDPR)
              </li>
              <li>
                <strong>Adempimento obblighi di legge</strong> — base giuridica: art. 6.1.c GDPR
              </li>
            </ol>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.4 Tempi di conservazione
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Lead (form): <strong>{siteConfig.retention.leadEmail}</strong>
              </li>
              <li>
                Consensi marketing: <strong>{siteConfig.retention.marketingConsent}</strong>
              </li>
              <li>
                Cookie tecnici: <strong>{siteConfig.retention.cookieTechnical}</strong>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.5 Diritti dell&apos;interessato
            </h3>
            <p>
              Ai sensi degli artt. 15-22 GDPR puoi: accedere ai tuoi dati, rettificarli o
              cancellarli, limitarne il trattamento, opporti al trattamento, ricevere i dati in
              formato strutturato (portabilità), revocare il consenso in qualsiasi momento,
              proporre reclamo al Garante per la Protezione dei Dati Personali (
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] underline"
              >
                garanteprivacy.it
              </a>
              ).
            </p>
            <p>
              Per esercitare questi diritti, scrivi a{" "}
              <Val value={siteConfig.legal.emailPrivacy} />.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              1.6 Trasferimento dati a terze parti (responsabili del trattamento)
            </h3>
            <p>I dati possono essere trattati dai seguenti fornitori:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>{siteConfig.providers.hosting.name}</strong> — hosting sito (
                {siteConfig.providers.hosting.location})
              </li>
              <li>
                <strong>{siteConfig.providers.database.name}</strong> — database e auth (
                {siteConfig.providers.database.location})
              </li>
              <li>
                <strong>{siteConfig.providers.pushNotifications.name}</strong> — notifiche push (
                {siteConfig.providers.pushNotifications.location})
              </li>
            </ul>
            <p>
              I trasferimenti extra-UE avvengono nel rispetto del GDPR mediante Clausole
              Contrattuali Standard approvate dalla Commissione Europea o altri meccanismi
              riconosciuti.
            </p>

            {/* ============================ COOKIE ============================ */}
            <h2 id="cookie" className="text-2xl font-extrabold text-[var(--color-text)] mt-12 mb-4">
              2. Cookie Policy
            </h2>
            <p>
              Questo sito utilizza esclusivamente <strong>cookie tecnici</strong> necessari al
              funzionamento (sessione di navigazione, autenticazione admin, preferenze cookie).
              Per i cookie tecnici non è richiesto consenso ai sensi del provvedimento del
              Garante Privacy in materia.
            </p>
            <p>
              Cookie analitici o di marketing sono <strong>attualmente disattivati</strong>.
              Quando verranno attivati, sarà mostrato un banner di gestione consenso conforme
              alle linee guida del Garante e potrai accettare/rifiutare singole categorie.
            </p>

            {/* ============================ TERMINI ============================ */}
            <h2 id="termini" className="text-2xl font-extrabold text-[var(--color-text)] mt-12 mb-4">
              3. Termini di utilizzo
            </h2>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.1 Natura formativa dei contenuti
            </h3>
            <p>
              Tutti i contenuti del sito hanno esclusivamente scopo{" "}
              <strong>formativo ed educativo</strong>. Non costituiscono:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>consulenza finanziaria personalizzata</li>
              <li>consulenza in materia di investimenti</li>
              <li>raccomandazione personalizzata</li>
              <li>sollecitazione al pubblico risparmio</li>
              <li>
                attività riservate ai sensi del Testo Unico della Finanza ({siteConfig.norms.tuf})
              </li>
            </ul>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.2 Rischio di investimento
            </h3>
            <p>
              Investire nei mercati finanziari comporta <strong>rischi significativi</strong>,
              inclusa la possibilità di <strong>perdita totale del capitale</strong>. Le
              performance passate non garantiscono risultati futuri. Rivolgersi sempre a un
              consulente finanziario abilitato (CONSOB) prima di prendere decisioni di
              investimento.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.3 Programma collaboratori
            </h3>
            <p>
              L&apos;adesione al programma collaboratori è regolata da contratto separato con il
              provider della piattaforma formativa. I compensi derivano{" "}
              <strong>esclusivamente dalla vendita di prodotti formativi</strong> a clienti
              finali, in conformità con la {siteConfig.norms.venditaDiretta}. Il programma{" "}
              <strong>non remunera il mero reclutamento</strong>. Non sono garantiti guadagni
              minimi né risultati specifici. Non si tratta di lavoro subordinato.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">3.4 Marchi</h3>
            <p>
              I nomi dei software didattici menzionati (Hummingbird, Lumen, Maitryx, Solexx),
              i nomi degli educatori e dei rispettivi servizi appartengono ai loro legittimi
              titolari. Il sito è gestito da {siteConfig.brand.name} in qualità di{" "}
              <strong>collaboratore indipendente autorizzato</strong> e non costituisce il sito
              ufficiale del provider della piattaforma formativa proposta.
            </p>

            <h3 className="text-xl font-bold text-[var(--color-text)] mt-6 mb-2">
              3.5 Foro competente
            </h3>
            <p>
              Per qualsiasi controversia è competente il Foro di{" "}
              <Val value={siteConfig.legal.foroCompetente} />, salvo quanto diversamente
              previsto dalla legge a tutela del consumatore.
            </p>

            <hr className="my-10 border-[var(--color-border)]" />

            <p>
              Per qualsiasi chiarimento, scrivi a{" "}
              <Val value={siteConfig.legal.emailPrivacy} />.
            </p>

            <p className="mt-8">
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
