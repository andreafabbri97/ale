import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { NetworkerLeadForm } from "@/components/lead-form-client";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { BetaBanner } from "@/components/beta-banner";

export const metadata: Metadata = {
  title: "Collabora · Costruisci un'attività nell'educazione finanziaria",
  description:
    "Distribuisci un percorso formativo strutturato in un mercato dove l'alfabetizzazione finanziaria resta una sfida concreta.",
};

export default function CollaboraPage() {
  return (
    <>
      <BetaBanner />
      <Nav />

      {/* ============= HERO ============= */}
      <section className="hero-glow py-20 md:py-28">
        <div className="container-page">
          <p className="eyebrow mb-6 animate-fade-up delay-0">
            Opportunità professionale · Vendita diretta autorizzata
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-[20ch] mb-6 animate-fade-up delay-1">
            Costruisci un&apos;attività nel mercato dell&apos;
            <span className="text-[var(--color-accent)]">educazione finanziaria</span>.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-dim)] max-w-[65ch] mb-8 animate-fade-up delay-2">
            Distribuisci un percorso formativo strutturato in un mercato dove
            l&apos;alfabetizzazione finanziaria resta una sfida concreta e la richiesta di
            formazione continua a crescere.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up delay-3">
            <Link href="#form-collab" className="btn btn-primary btn-lg animate-pulse-glow">
              Scopri l&apos;opportunità →
            </Link>
            <Link href="#profilo" className="btn btn-ghost btn-lg">
              Prima leggimi tutto
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--color-text-faint)] animate-fade-up delay-4">
            Vendita diretta autorizzata · Nessun investimento obbligatorio · Pagamenti trasparenti
          </p>
        </div>
      </section>

      {/* ============= OPPORTUNITÀ ============= */}
      <section className="py-20">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Il mercato</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              La domanda c&apos;è. L&apos;offerta{" "}
              <span className="text-[var(--color-accent)]">no</span>.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { val: 87, label: "Italiani non educati finanziariamente" },
              { val: 95, label: "Vorrebbe imparare" },
              { val: 3, label: "Ha accesso oggi a formazione di qualità" },
            ].map((item, i) => (
              <Reveal
                key={item.label}
                stagger={(i + 1) as 1 | 2 | 3}
                className="card card-hover text-center"
              >
                <div className="stat-num">
                  <CountUp to={item.val} suffix="%" />
                </div>
                <p className="mt-2 text-sm uppercase tracking-widest text-[var(--color-text-dim)]">
                  {item.label}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" stagger={4} className="text-center text-lg md:text-xl mt-10 max-w-2xl mx-auto">
            Tradotto: c&apos;è una <span className="text-[var(--color-accent)]">domanda enorme</span>{" "}
            e un&apos;offerta scarsa.
            <br />È questa la finestra di mercato.
          </Reveal>
        </div>
      </section>

      {/* ============= PERCHÉ QUESTA PIATTAFORMA ============= */}
      <section className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Cosa rende questa piattaforma{" "}
              <span className="text-[var(--color-accent)]">diversa</span>.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["✅", "Prodotto formativo reale", "Vendi un servizio di educazione finanziaria, non promesse di guadagno."],
              ["🤖", "Strumenti AI inclusi", "4 tool dedicati (Hummingbird, Lumen, Maitryx, Solexx) compresi nei piani Pro/Elite."],
              ["🎓", "Educatori e professionisti", "Profili consultabili, sessioni live, contenuti on-demand."],
              ["💰", "Compensi trasparenti", "Bonus di attivazione fissi per pacchetto + compenso mensile per rank. Numeri ufficiali."],
              ["🛠️", "Backoffice digitale", "Link tracciabili, dashboard, materiali pronti, formazione interna."],
              ["🇮🇹", "Made in Italy", "Brand italiano, in linea con la Legge 17 agosto 2005, n. 173 sulla vendita diretta."],
            ].map(([icon, title, desc], i) => (
              <Reveal
                key={title}
                stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                className="card card-hover"
              >
                <div className="text-3xl mb-3 transition-transform duration-300 hover:scale-125 inline-block">
                  {icon}
                </div>
                <h4 className="text-lg font-bold mb-1">{title}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= COMPENSI ============= */}
      <section className="py-20">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Come si guadagna</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Trasparenza, non promesse.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Reveal stagger={1} className="card card-hover">
              <h3 className="text-2xl font-extrabold mb-3">Bonus di attivazione cliente</h3>
              <p className="text-[var(--color-text-dim)] mb-4">
                Per ogni cliente che attiva un piano ricevi un{" "}
                <strong className="text-[var(--color-accent)]">bonus una tantum</strong> sulla
                vendita iniziale, in base al pacchetto:
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Starter Bundle → <strong className="text-[var(--color-text)]">$30</strong>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Pro Bundle → <strong className="text-[var(--color-text)]">$150</strong>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Elite Bundle → <strong className="text-[var(--color-text)]">$300</strong>
                </li>
              </ul>
              <p className="text-sm text-[var(--color-text-faint)] mt-4">
                Bonus ufficiali dal piano compensi del provider della piattaforma.
              </p>
            </Reveal>

            <Reveal stagger={2} className="card card-hover">
              <h3 className="text-2xl font-extrabold mb-3">Compenso mensile per rank</h3>
              <p className="text-[var(--color-text-dim)] mb-4">
                Oltre ai bonus di attivazione, è previsto un{" "}
                <strong className="text-[var(--color-accent)]">compenso mensile</strong> legato al
                volume di vendita personale e di team, distribuito su 14 livelli di rank
                (da $500 a $1.000.000/mese).
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Requisiti chiari su volume, bundle venduti, diretti, rinnovi
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Trasparente: vedi sempre dove sei e cosa serve per il prossimo livello
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  I numeri di esempio non garantiscono il loro raggiungimento
                </li>
              </ul>
              <p className="text-sm text-[var(--color-text-faint)] mt-4">
                Tabella rank completa presentata nella call conoscitiva.
              </p>
            </Reveal>
          </div>

          {/* Box trasparenza Legge 173/2005 */}
          <Reveal stagger={3} className="max-w-4xl mx-auto mt-6">
            <div className="p-4 sm:p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-sm">
              <p className="font-semibold mb-1 text-amber-200">Nota di trasparenza</p>
              <p className="text-[var(--color-text-dim)] leading-relaxed">
                Il programma collaboratori <strong>non remunera il semplice reclutamento</strong>{" "}
                di persone. I compensi sono collegati esclusivamente alla{" "}
                <strong>vendita effettiva di prodotti formativi</strong> a clienti finali e alle
                regole del piano compensi ufficiale. Non sono garantiti guadagni minimi o
                risultati specifici. Attività regolata dalla{" "}
                <strong>Legge 17 agosto 2005, n. 173</strong>.
              </p>
            </div>
          </Reveal>

          <Reveal stagger={4} className="text-center mt-8">
            <Link href="#form-collab" className="btn btn-primary btn-lg animate-pulse-glow">
              Richiedi informazioni
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============= PROFILO IDEALE ============= */}
      <section id="profilo" className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Onestà</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Per chi è (e per chi <span className="text-[var(--color-accent)]">non è</span>)
              questa opportunità.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Reveal stagger={1} className="card card-hover border-[rgba(46,204,113,0.3)]">
              <h3 className="text-xl font-extrabold text-[var(--color-success)] mb-4">
                ✅ È per te se...
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
                {[
                  "Sei una persona seria e affidabile",
                  "Sei disposto a imparare il prodotto a fondo",
                  "Hai almeno 5-10 ore alla settimana da dedicare",
                  "Vuoi costruire qualcosa nel lungo periodo",
                  "Hai una rete sociale o capacità di farti vedere online",
                  "Sei tu stesso/a interessato/a alla finanza personale",
                ].map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-[var(--color-success)] font-bold">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal stagger={2} className="card card-hover border-[rgba(231,76,60,0.3)]">
              <h3 className="text-xl font-extrabold text-[var(--color-danger)] mb-4">
                ❌ Non è per te se...
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
                {[
                  "Cerchi soldi facili senza lavorare",
                  "Non vuoi studiare l'argomento",
                  "Non hai tempo da dedicare",
                  "Vuoi guadagnare 10K in 30 giorni",
                  "Non ti piace parlare con le persone",
                  "Vendi qualcosa solo per i soldi, senza crederci",
                ].map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-[var(--color-danger)] font-bold">✗</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============= FORM ============= */}
      <section id="form-collab" className="py-20">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Iniziamo a conoscerci</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Candidati come <span className="text-[var(--color-accent)]">collaboratore</span>.
            </h2>
            <p className="mt-4 text-lg text-[var(--color-text-dim)]">
              Compila il form. Ti contattiamo entro 48h per una call conoscitiva di 30 minuti.
            </p>
          </Reveal>

          <Reveal stagger={1}>
            <NetworkerLeadForm />
          </Reveal>
        </div>
      </section>

      {/* ============= COSA ASPETTARSI DALLA CALL ============= */}
      <section className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Cosa succede nella <span className="text-[var(--color-accent)]">call</span>.
            </h2>
            <p className="mt-3 text-lg text-[var(--color-text-dim)]">30 minuti. Trasparenti.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              ["5 min", "Conoscenza", "Ci raccontiamo, capiamo da dove arrivi."],
              ["10 min", "Mercato e prodotto", "Ti mostriamo la piattaforma dal vivo, i dati di mercato."],
              ["10 min", "Piano compensi", "Numeri trasparenti, rank, esempi reali."],
              ["5 min", "Tue domande", "Tutto quello che vuoi sapere. Poi decidi tu."],
            ].map(([time, title, desc], i) => (
              <Reveal
                key={title}
                stagger={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="card card-hover"
              >
                <p className="eyebrow mb-2">{time}</p>
                <h4 className="text-xl font-bold mb-1">{title}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CTA FINALE ============= */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-bg-2)] to-[var(--color-bg-3)]">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              30 minuti possono cambiare la tua{" "}
              <span className="text-[var(--color-accent)]">direzione</span>.
            </h2>
          </Reveal>
          <Reveal as="p" stagger={1} className="text-lg md:text-xl text-[var(--color-text-dim)] mb-10">
            Nessuna pressione. Nessun obbligo.
          </Reveal>
          <Reveal stagger={2}>
            <Link href="#form-collab" className="btn btn-primary btn-lg animate-pulse-glow">
              Richiedi informazioni →
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
