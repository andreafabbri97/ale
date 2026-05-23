import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

export default function HomePage() {
  return (
    <>
      <Nav variant="home" />

      {/* ============= HERO ============= */}
      <section className="hero-glow py-14 sm:py-20 md:py-32">
        <div className="container-page">
          <p className="eyebrow mb-4 sm:mb-6 animate-fade-up delay-0">
            Educazione finanziaria · Trading · Investimenti
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-[18ch] mb-4 sm:mb-6 animate-fade-up delay-1">
            In Italia <span className="text-[var(--color-accent)]">l&apos;87%</span> non è educato
            finanziariamente.
            <br />
            Noi siamo nell&apos;altro 13%.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-dim)] max-w-[60ch] mb-6 sm:mb-8 animate-fade-up delay-2">
            NOA × One Tribe Academy è la piattaforma italiana che insegna come funziona davvero il
            denaro. Niente &quot;soldi facili&quot;. Solo strumenti, dati e professionisti.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up delay-3">
            <Link href="/scopri" className="btn btn-primary btn-lg animate-pulse-glow">
              Voglio imparare →
            </Link>
            <Link href="/collabora" className="btn btn-ghost btn-lg">
              Voglio collaborare →
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--color-text-faint)] animate-fade-up delay-4">
            Le performance passate non garantiscono risultati futuri. Investire comporta rischi.
          </p>
        </div>
      </section>

      {/* ============= PROBLEMA ============= */}
      <section id="problema" className="py-14 sm:py-20">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">I dati, non le opinioni</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Il problema non sei tu.
              <br />
              Nessuno ti ha mai{" "}
              <span className="text-[var(--color-accent)]">insegnato</span> a gestire il denaro.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal stagger={1} className="card card-hover text-center">
              <div className="stat-num stat-num-danger">
                <CountUp to={87} suffix="%" duration={1600} />
              </div>
              <p className="mt-2 text-sm uppercase tracking-widest text-[var(--color-text-dim)]">
                Italiani non educati finanziariamente
              </p>
            </Reveal>
            <Reveal stagger={2} className="card card-hover text-center">
              <div className="stat-num">
                <CountUp to={95} suffix="%" duration={1800} />
              </div>
              <p className="mt-2 text-sm uppercase tracking-widest text-[var(--color-text-dim)]">
                Vorrebbe imparare a gestire i soldi
              </p>
            </Reveal>
            <Reveal stagger={3} className="card card-hover text-center">
              <div className="stat-num">
                <CountUp to={3} suffix="%" duration={1400} />
              </div>
              <p className="mt-2 text-sm uppercase tracking-widest text-[var(--color-text-dim)]">
                Ha accesso a formazione di qualità
              </p>
            </Reveal>
          </div>
          <Reveal
            as="p"
            stagger={4}
            className="text-center text-sm text-[var(--color-text-faint)] mt-6"
          >
            Fonte: OCSE, Banca d&apos;Italia, Openpolis
          </Reveal>
        </div>
      </section>

      {/* ============= CICLO ============= */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-transparent via-[var(--color-bg-2)] to-transparent">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Così vive <span className="text-[var(--color-accent)]">il 95%</span> delle persone.
            </h2>
          </Reveal>
          <div className="max-w-md mx-auto text-center space-y-2">
            {[
              { label: "Lavora", arrow: "↓ per guadagnare" },
              { label: "Guadagna", arrow: "↓ per pagare i debiti" },
              { label: "Debiti", arrow: "↓ per rimanere" },
              { label: "Senza soldi", arrow: "↑ così lavora di nuovo" },
            ].map((step, i) => (
              <Reveal key={step.label} stagger={(i + 1) as 1 | 2 | 3 | 4}>
                <div className="text-xl font-extrabold uppercase tracking-widest text-[var(--color-accent)]">
                  {step.label}
                </div>
                <div className="text-sm text-[var(--color-text-faint)]">{step.arrow}</div>
              </Reveal>
            ))}
          </div>
          <Reveal
            as="p"
            stagger={5}
            className="text-center text-lg md:text-xl text-[var(--color-text)] mt-10 max-w-2xl mx-auto"
          >
            Si esce da questo ciclo solo in un modo:
            <br />
            <strong className="text-[var(--color-accent)]">
              imparando come funziona davvero il denaro.
            </strong>
          </Reveal>
        </div>
      </section>

      {/* ============= QUADRANTE ============= */}
      <section className="py-14 sm:py-20">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Il quadrante del Cashflow</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Dove ti trovi <span className="text-[var(--color-accent)]">oggi</span>?
            </h2>
          </Reveal>

          <Reveal className="max-w-2xl mx-auto grid grid-cols-2 border border-[var(--color-border-strong)] rounded-2xl overflow-hidden">
            {[
              { pct: "60%", name: "Dipendente", desc: "Svolge un lavoro" },
              { pct: "4%", name: "Imprenditore", desc: "Possiede un sistema" },
              { pct: "35%", name: "Autonomo", desc: "Possiede un lavoro" },
              { pct: "1%", name: "Investitore", desc: "Possiede investimenti" },
            ].map((q) => (
              <div
                key={q.name}
                className="p-6 bg-[var(--color-bg-2)] border border-[var(--color-border)] text-center transition-colors duration-300 hover:bg-[var(--color-bg-3)]"
              >
                <div className="text-xl font-extrabold text-[var(--color-accent)] mb-1">
                  {q.pct}
                </div>
                <div className="font-extrabold uppercase tracking-widest mb-1">{q.name}</div>
                <p className="text-sm text-[var(--color-text-dim)]">{q.desc}</p>
              </div>
            ))}
          </Reveal>

          <Reveal
            as="p"
            stagger={2}
            className="text-center text-lg md:text-xl mt-12 max-w-2xl mx-auto"
          >
            Il 95% scambia tempo per soldi.
            <br />
            <span className="text-[var(--color-accent)] font-bold">
              L&apos;1% mette i soldi a lavorare.
            </span>
          </Reveal>
        </div>
      </section>

      {/* ============= PRODOTTO ============= */}
      <section id="prodotto" className="py-14 sm:py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Cosa è incluso</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Formazione professionale
              <br />+ <span className="text-[var(--color-accent)]">strumenti AI proprietari</span>.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["📚", "Educazione Finanziaria", "Le basi che la scuola non ti ha insegnato."],
              ["📈", "Mercato Azionario", "Come funzionano davvero le borse mondiali."],
              ["🌍", "Macroeconomia", "Capire il contesto prima di muovere soldi."],
              ["📊", "Indici Azionari", "S&P 500, NASDAQ, FTSE letti come si deve."],
              ["🌾", "Materie Prime", "Petrolio, grano, gas: gli asset che muovono i mercati."],
              ["💱", "Forex Exchange", "Il mercato più liquido del mondo."],
              ["🥇", "Metalli Preziosi", "Oro, argento, platino: la riserva di valore."],
              ["📉", "Analisi Volumetrica", "Leggere il mercato come fanno i professionisti."],
            ].map(([icon, title, desc], i) => (
              <Reveal
                key={title}
                stagger={((i % 8) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
                className="card card-hover"
              >
                <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(59,212,248,0.15)] to-[rgba(44,123,229,0.15)] text-[var(--color-accent)] text-2xl mb-3 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                  {icon}
                </div>
                <h4 className="text-lg font-bold mb-1">{title}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-16 mb-8">
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Più <span className="text-[var(--color-accent)]">4 software AI proprietari</span>
            </h3>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Hummingbird", "Scanner armonico potenziato dall'AI."],
              ["Lumen", "Analisi crypto con supporto AI."],
              ["Solexx", "App con idee di trading dai professionisti."],
              ["Maitryx", "Pattern armonici + breakout. Fino all'85% di efficacia."],
            ].map(([name, desc], i) => (
              <Reveal
                key={name}
                stagger={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="card card-hover"
              >
                <h4 className="text-lg font-bold mb-1">{name}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= EDUCATORI ============= */}
      <section id="educatori" className="py-14 sm:py-20">
        <div className="container-page">
          <Reveal className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Chi insegna</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Imparerai da chi <span className="text-[var(--color-accent)]">vive di questo</span>{" "}
              da decenni.
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              ["MP", "Dr. Michele Pellegrino", "Macroeconomia"],
              ["CV", "Carlo Vallotto", "Metalli preziosi · Materie prime"],
              ["DR", "Donato Rossiello", "Mercato e indici azionari"],
              ["RF", "Rosita Furnari", "Analisi volumetrica"],
              ["FR", "Fabrizio Ribbeni", "Teoria delle onde di Elliot"],
              ["AH", "Abdallah Harfouch", "Scalping US30 (live giornaliere)"],
            ].map(([initials, name, role], i) => (
              <Reveal
                key={name}
                stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                className="text-center p-4 group"
              >
                <div className="w-24 h-24 mx-auto mb-3 rounded-full grid place-items-center bg-gradient-to-br from-[var(--color-bg-3)] to-[var(--color-bg-2)] border-2 border-[var(--color-border-strong)] text-[var(--color-accent)] text-2xl font-extrabold transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--color-accent)] group-hover:shadow-[0_0_30px_rgba(59,212,248,0.4)]">
                  {initials}
                </div>
                <h4 className="font-bold">{name}</h4>
                <p className="text-sm text-[var(--color-text-dim)]">{role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-[var(--color-bg-2)] to-[var(--color-bg-3)]">
        <div className="container-page text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Pronto a fare il primo passo?
            </h2>
          </Reveal>
          <Reveal stagger={1} as="p" className="text-lg md:text-xl text-[var(--color-text-dim)] mb-10">
            Scegli da dove vuoi iniziare.
          </Reveal>
          <Reveal stagger={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scopri" className="btn btn-primary btn-lg animate-pulse-glow">
              Voglio imparare →
            </Link>
            <Link href="/collabora" className="btn btn-ghost btn-lg">
              Voglio collaborare →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============= FAQ ============= */}
      <section id="faq" className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <Reveal className="text-center mb-12">
            <p className="eyebrow mb-3">Domande frequenti</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Le cose che ci chiedono <span className="text-[var(--color-accent)]">sempre</span>.
            </h2>
          </Reveal>
          <div className="space-y-1">
            {[
              {
                q: "NOA è una promessa di guadagno?",
                a: "No. NOA è una piattaforma di formazione finanziaria. Quanto guadagni dipende solo da te, dalla tua disciplina e dal mercato. Investire comporta sempre rischi, anche di perdita totale del capitale.",
              },
              {
                q: "Quanto costa?",
                a: "3 piani: Starter (~$159 primo mese, poi $152/mese), Pro (~$845 primo mese, $152/mese), Elite (~$1.699 primo mese, $152/mese). Tutti i dettagli nella call gratuita.",
              },
              {
                q: "Sono un principiante totale, posso iniziare?",
                a: "Sì. Il piano Starter è pensato proprio per chi non sa nulla. Si parte dalle basi assolute con video, sessioni live e supporto.",
              },
              {
                q: "Posso provare prima di pagare?",
                a: "Sì, prenotiamo una call gratuita di 30 minuti dove ti mostriamo dal vivo la piattaforma e capiamo insieme se fa per te.",
              },
              {
                q: "Cosa significa \"collaborare\"?",
                a: "NOA ha un programma per chi vuole distribuire il prodotto e crearsi un reddito. Se ti interessa, clicca \"Voglio collaborare\" e raccontaci di te.",
              },
              {
                q: "È uno schema piramidale?",
                a: "No. Gli schemi piramidali sono vietati dalla legge italiana (L. 173/2005). In NOA si guadagna solo dalla vendita di formazione reale ai clienti finali. Non si guadagna \"reclutando\" senza vendere prodotto.",
              },
            ].map((f, i) => (
              <Reveal
                key={i}
                as="details"
                stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                className="group border-b border-[var(--color-border)] py-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between text-lg font-bold list-none [&::-webkit-details-marker]:hidden hover:text-[var(--color-accent)] transition-colors">
                  {f.q}
                  <span className="text-2xl text-[var(--color-accent)] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[var(--color-text-dim)]">{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
