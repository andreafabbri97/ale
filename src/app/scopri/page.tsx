import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ClientLeadForm } from "@/components/lead-form-client";

export const metadata: Metadata = {
  title: "Scopri NOA · Educazione finanziaria che funziona",
  description:
    "Ricevi la guida gratuita 'I 7 errori finanziari che fanno gli italiani' e scopri come iniziare a costruire la tua libertà finanziaria con NOA.",
};

export default function ScopriPage() {
  return (
    <>
      <Nav />

      {/* ============= HERO + FORM ============= */}
      <section className="hero-glow py-20 md:py-28">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-6">
                Educazione finanziaria · Trading · Investimenti
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Stop a &quot;lavora, guadagna, paga, ricomincia&quot;.
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-text-dim)] mb-8">
                Scarica subito la guida gratuita{" "}
                <strong>&quot;I 7 errori finanziari che fanno gli italiani&quot;</strong> e scopri
                come iniziare a costruire la tua libertà finanziaria con NOA.
              </p>
              <ul className="space-y-3 text-[var(--color-text-dim)]">
                {[
                  "Cosa cambia tra \"debiti buoni\" e \"debiti cattivi\"",
                  "L'errore #1 che fa erodere i tuoi risparmi ogni anno",
                  "Come funziona l'interesse composto (con esempi reali)",
                  "I 4 quadranti del cashflow di Kiyosaki",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[var(--color-accent)] font-bold mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div id="form-lead">
              <ClientLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ============= STAT ============= */}
      <section className="py-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">Lo dicono i numeri</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Il tuo potere d&apos;acquisto sta{" "}
              <span className="text-[var(--color-accent)]">scendendo</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["-3%", "Salari reali in Italia dal 1990 al 2020 (vs +34% Germania)"],
              ["+24%", "Spesa al supermercato dal 2021"],
              ["+34%", "Bollette di energia e gas"],
            ].map(([num, label]) => (
              <div key={num} className="card text-center">
                <div className="stat-num stat-num-danger">{num}</div>
                <p className="mt-2 text-sm uppercase tracking-widest text-[var(--color-text-dim)]">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg md:text-xl mt-10">
            Lasciare i soldi sul conto ={" "}
            <span className="text-[var(--color-accent)] font-bold">perdere soldi</span>.
          </p>
        </div>
      </section>

      {/* ============= INTERESSE COMPOSTO ============= */}
      <section className="py-20 bg-[var(--color-bg-2)]">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="eyebrow mb-3">L&apos;ottava meraviglia del mondo</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Cosa succede se investi <span className="text-[var(--color-accent)]">50€/mese</span>{" "}
              per 30 anni?
            </h2>
          </div>
          <div className="text-center">
            <div className="text-7xl md:text-9xl font-black tracking-tighter bg-gradient-to-br from-[var(--color-accent)] to-white bg-clip-text text-transparent">
              €247.619
            </div>
            <p className="text-lg md:text-xl mt-4">
              Versato totale: <strong>€24.000</strong> · Interessi maturati:{" "}
              <strong className="text-[var(--color-accent)]">€223.619</strong>
            </p>
            <p className="text-sm text-[var(--color-text-faint)] mt-6 max-w-2xl mx-auto">
              Esempio educativo con rendimento ipotetico del 20%. Il rendimento medio dell&apos;S&P
              500 negli ultimi 22 anni è ~9% annuo. Le performance passate non garantiscono
              risultati futuri.
            </p>
          </div>
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section id="piani" className="py-20">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="eyebrow mb-3">3 piani</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Scegli il piano <span className="text-[var(--color-accent)]">giusto</span> per te.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* STARTER */}
            <div className="card">
              <div className="text-2xl font-extrabold uppercase tracking-widest">Starter</div>
              <p className="text-sm text-[var(--color-text-dim)] mt-1 mb-6">
                Per chi inizia da zero.
              </p>
              <div className="text-4xl font-extrabold">
                $159
                <span className="text-sm text-[var(--color-text-faint)] font-normal">
                  {" "}
                  primo mese
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-faint)] mb-6">poi $152/mese</p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)] mb-6">
                {["Accademia NOA", "Macroeconomia", "Basi del trading", "Materie prime", "Metalli preziosi", "3 canali idee di trading"].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--color-accent)] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="#form-lead" className="btn btn-ghost btn-block">
                Voglio iniziare
              </Link>
            </div>

            {/* PRO */}
            <div className="card border-[var(--color-accent)] shadow-[0_0_60px_rgba(59,212,248,0.15)] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Più scelto
              </span>
              <div className="text-2xl font-extrabold uppercase tracking-widest">Pro</div>
              <p className="text-sm text-[var(--color-text-dim)] mt-1 mb-6">
                Per chi fa sul serio.
              </p>
              <div className="text-4xl font-extrabold">
                $845
                <span className="text-sm text-[var(--color-text-faint)] font-normal">
                  {" "}
                  primo mese
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-faint)] mb-6">poi $152/mese</p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)] mb-6">
                {[
                  "Tutto di Starter",
                  "Forex Exchange",
                  "Teoria delle Onde di Elliot",
                  "Mercato azionario",
                  "Trading Journal",
                  "Lumen AI (crypto)",
                  "Live US30 con A. Harfouch",
                  "6 canali idee di trading",
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--color-accent)] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="#form-lead" className="btn btn-primary btn-block">
                Voglio il Pro
              </Link>
            </div>

            {/* ELITE */}
            <div className="card">
              <div className="text-2xl font-extrabold uppercase tracking-widest">Élite</div>
              <p className="text-sm text-[var(--color-text-dim)] mt-1 mb-6">Per professionisti.</p>
              <div className="text-4xl font-extrabold">
                $1.699
                <span className="text-sm text-[var(--color-text-faint)] font-normal">
                  {" "}
                  primo mese
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-faint)] mb-6">poi $152/mese</p>
              <ul className="space-y-2 text-sm text-[var(--color-text-dim)] mb-6">
                {[
                  "Tutto di Pro",
                  "Certificati azionari",
                  "Hummingbird AI (scanner armonico)",
                  "Solexx (idee trading da pro)",
                  "9 canali idee di trading",
                  "Accesso prioritario educatori",
                ].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[var(--color-accent)] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="#form-lead" className="btn btn-ghost btn-block">
                Voglio l&apos;Élite
              </Link>
            </div>
          </div>
          <p className="text-center text-sm text-[var(--color-text-faint)] mt-8">
            Prezzi in USD. Pagamenti gestiti direttamente da NOA. Disdetta possibile mese per mese.
          </p>
        </div>
      </section>

      {/* ============= CTA FINALE ============= */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-bg-2)] to-[var(--color-bg-3)]">
        <div className="container-page text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Il primo passo è <span className="text-[var(--color-accent)]">gratis</span>.
          </h2>
          <p className="text-lg md:text-xl text-[var(--color-text-dim)] mb-10">
            Scarica la guida, leggila, decidi tu.
          </p>
          <Link href="#form-lead" className="btn btn-primary btn-lg">
            Ricevi la guida gratis →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
