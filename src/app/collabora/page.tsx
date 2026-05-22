import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { NetworkerLeadForm } from "@/components/lead-form-client";

export const metadata: Metadata = {
  title: "Diventa partner NOA · Costruisci un'attività nell'educazione finanziaria",
  description:
    "Distribuisci NOA × One Tribe Academy: un prodotto reale, con clienti reali, in un mercato dove l'87% degli italiani ha bisogno di formazione.",
};

export default function CollaboraPage() {
  return (
    <>
      <Nav />

      {/* ============= HERO ============= */}
      <section className="hero-glow py-20 md:py-28">
        <div className="container-page">
          <p className="eyebrow mb-6">
            Opportunità professionale · Vendita diretta autorizzata
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-[20ch] mb-6">
            Costruisci un&apos;attività nel mercato dell&apos;
            <span className="text-[var(--color-accent)]">educazione finanziaria</span>.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-dim)] max-w-[65ch] mb-8">
            Distribuisci NOA × One Tribe Academy: un prodotto reale, con clienti reali, in un
            mercato dove <strong>l&apos;87% degli italiani</strong> ha bisogno di formazione e{" "}
            <strong>solo il 3%</strong> ha accesso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="#form-collab" className="btn btn-primary btn-lg">
              Scopri l&apos;opportunità →
            </Link>
            <Link href="#profilo" className="btn btn-ghost btn-lg">
              Prima leggimi tutto
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--color-text-faint)]">
            Vendita diretta autorizzata · Nessun investimento obbligatorio · Pagamenti trasparenti
          </p>
        </div>
      </section>

      {/* ============= OPPORTUNITÀ ============= */}
      <section className="py-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Il mercato</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              La domanda c&apos;è. L&apos;offerta{" "}
              <span className="text-[var(--color-accent)]">no</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["87%", "Italiani non educati finanziariamente"],
              ["95%", "Vorrebbe imparare"],
              ["3%", "Ha accesso oggi a formazione di qualità"],
            ].map(([num, label]) => (
              <div key={num} className="card text-center">
                <div className="stat-num">{num}</div>
                <p className="mt-2 text-sm uppercase tracking-widest text-[var(--color-text-dim)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg md:text-xl mt-10 max-w-2xl mx-auto">
            Tradotto: c&apos;è una <span className="text-[var(--color-accent)]">domanda enorme</span>{" "}
            e un&apos;offerta scarsa.
            <br />È questa la finestra di mercato.
          </p>
        </div>
      </section>

      {/* ============= PERCHÉ NOA ============= */}
      <section className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Cosa rende NOA <span className="text-[var(--color-accent)]">diversa</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["✅", "Prodotto reale e utile", "Non vendi 'aria': vendi formazione che migliora la vita finanziaria delle persone."],
              ["🤖", "Stack proprietario", "4 software AI esclusivi (Hummingbird, Lumen, Maitryx, Solexx) non replicabili."],
              ["🎓", "Educatori riconosciuti", "6 professionisti con curriculum verificabili. Niente 'guru' anonimi."],
              ["💰", "Compensi trasparenti", "Provvigione fissa per pacchetto + sistema rank. Solo numeri."],
              ["🛠️", "Backoffice digitale", "Link tracciabili, dashboard, materiali pronti, formazione gratuita."],
              ["🇮🇹", "Made in Italy", "Brand italiano, in linea con normativa (L. 173/2005). Niente borderline."],
            ].map(([icon, title, desc]) => (
              <div key={title} className="card card-hover">
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="text-lg font-bold mb-1">{title}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= COMPENSI ============= */}
      <section className="py-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Come si guadagna</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Trasparenza, non promesse.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-2xl font-extrabold mb-3">Provvigioni dirette</h3>
              <p className="text-[var(--color-text-dim)] mb-4">
                Per ogni cliente che porti a NOA ricevi una{" "}
                <strong className="text-[var(--color-accent)]">provvigione fissa</strong> in base al
                pacchetto venduto:
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Starter ($159/mese) → provvigione diretta
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Pro ($845/mese) → provvigione diretta più alta
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Elite ($1.699/mese) → provvigione diretta massima
                </li>
              </ul>
              <p className="text-sm text-[var(--color-text-faint)] mt-4">
                Importi esatti riservati ai collaboratori. Te li mostriamo nella call conoscitiva.
              </p>
            </div>

            <div className="card">
              <h3 className="text-2xl font-extrabold mb-3">Sistema a Rank</h3>
              <p className="text-[var(--color-text-dim)] mb-4">
                Più cresci, più guadagni: il{" "}
                <strong className="text-[var(--color-accent)]">sistema a rank</strong> ti premia
                mano a mano che la tua attività si sviluppa.
              </p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)]">
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Ogni rank sblocca bonus e percentuali aggiuntive
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Si avanza in base ai risultati personali e di team
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-accent)] font-bold">→</span>
                  Trasparente: vedi sempre dove sei e cosa serve per il prossimo livello
                </li>
              </ul>
              <p className="text-sm text-[var(--color-text-faint)] mt-4">
                Numeri e nomi dei rank presentati nella call.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="#form-collab" className="btn btn-primary btn-lg">
              Voglio i dettagli — Prenota call
            </Link>
          </div>
        </div>
      </section>

      {/* ============= PROFILO IDEALE ============= */}
      <section id="profilo" className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Onestà</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Per chi è (e per chi <span className="text-[var(--color-accent)]">non è</span>)
              questa opportunità.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card border-[rgba(46,204,113,0.3)]">
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
            </div>
            <div className="card border-[rgba(231,76,60,0.3)]">
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
            </div>
          </div>
        </div>
      </section>

      {/* ============= FORM ============= */}
      <section id="form-collab" className="py-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Iniziamo a conoscerci</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Candidati come <span className="text-[var(--color-accent)]">collaboratore</span>.
            </h2>
            <p className="mt-4 text-lg text-[var(--color-text-dim)]">
              Compila il form. Ti contattiamo entro 48h per una call conoscitiva di 30 minuti.
            </p>
          </div>

          <NetworkerLeadForm />
        </div>
      </section>

      {/* ============= COSA ASPETTARSI DALLA CALL ============= */}
      <section className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Cosa succede nella <span className="text-[var(--color-accent)]">call</span>.
            </h2>
            <p className="mt-3 text-lg text-[var(--color-text-dim)]">30 minuti. Trasparenti.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              ["5 min", "Conoscenza", "Ci raccontiamo, capiamo da dove arrivi."],
              ["10 min", "Mercato e prodotto", "Ti mostriamo NOA dal vivo, i dati di mercato."],
              ["10 min", "Piano compensi", "Numeri trasparenti, rank, esempi reali."],
              ["5 min", "Tue domande", "Tutto quello che vuoi sapere. Poi decidi tu."],
            ].map(([time, title, desc]) => (
              <div key={title} className="card">
                <p className="eyebrow mb-2">{time}</p>
                <h4 className="text-xl font-bold mb-1">{title}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CTA FINALE ============= */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-bg-2)] to-[var(--color-bg-3)]">
        <div className="container-page text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            30 minuti possono cambiare la tua{" "}
            <span className="text-[var(--color-accent)]">direzione</span>.
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-dim)] mb-10">
            Nessuna pressione. Nessun obbligo.
          </p>
          <Link href="#form-collab" className="btn btn-primary btn-lg">
            Candidati ora →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
