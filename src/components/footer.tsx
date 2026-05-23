import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] pt-20 pb-8 mt-20">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg mb-4">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black">
                A
              </span>
              <span>Alead</span>
            </Link>
            <p className="text-sm text-[var(--color-text-faint)] leading-relaxed">
              Distribuiamo NOA × One Tribe Academy.
              <br />
              Collaboratori indipendenti autorizzati.
            </p>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-widest mb-4 text-[var(--color-text)] font-semibold">
              Esplora
            </h5>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-text-dim)]">
              <li>
                <Link href="/" className="hover:text-[var(--color-accent)]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scopri" className="hover:text-[var(--color-accent)]">
                  Scopri NOA
                </Link>
              </li>
              <li>
                <Link href="/collabora" className="hover:text-[var(--color-accent)]">
                  Collabora
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-widest mb-4 text-[var(--color-text)] font-semibold">
              Legale
            </h5>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-text-dim)]">
              <li>
                <Link href="/privacy" className="hover:text-[var(--color-accent)]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy#cookie" className="hover:text-[var(--color-accent)]">
                  Cookie
                </Link>
              </li>
              <li>
                <Link href="/privacy#termini" className="hover:text-[var(--color-accent)]">
                  Termini
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm uppercase tracking-widest mb-4 text-[var(--color-text)] font-semibold">
              Contatti
            </h5>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--color-text-dim)]">
              <li>
                <a href="mailto:contatti@example.com" className="hover:text-[var(--color-accent)]">
                  Email
                </a>
              </li>
              <li>
                <a href="https://wa.me/393000000000" rel="noopener" className="hover:text-[var(--color-accent)]">
                  WhatsApp
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[var(--color-accent)] opacity-60">
                  Area riservata
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border)] text-xs text-[var(--color-text-faint)] leading-relaxed space-y-3">
          <p>
            <strong>Disclaimer.</strong> I contenuti di questo sito hanno scopo esclusivamente{" "}
            <strong>formativo</strong> e{" "}
            <strong>non costituiscono consulenza finanziaria</strong>, raccomandazione di
            investimento, sollecitazione al pubblico risparmio né attività riservata ai sensi del
            TUF (D.Lgs 58/1998). Investire comporta rischi, anche di perdita totale del capitale.
            Le performance passate non garantiscono risultati futuri. Rivolgiti sempre a un
            consulente finanziario abilitato prima di prendere decisioni di investimento.
          </p>
          <p>
            <strong>Marchi.</strong> &quot;NOA&quot;, &quot;One Tribe Academy&quot;,
            &quot;One Tribe Global&quot; e i relativi loghi, nomi di prodotti (Hummingbird,
            Lumen, Maitryx, Solexx) e materiali appartengono ai rispettivi titolari. Questo sito
            è gestito da <strong>Alead</strong>, collaboratore indipendente autorizzato, e{" "}
            <strong>non costituisce il sito ufficiale del brand</strong>. Sito ufficiale NOA:{" "}
            <a
              href="https://noaitaly.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--color-accent)]"
            >
              noaitaly.io
            </a>
            .
          </p>
          <p>
            <strong>Vendita diretta.</strong> L&apos;attività di collaborazione è regolata dalla{" "}
            Legge 17 agosto 2005, n. 173. Il programma collaboratori non remunera il semplice
            reclutamento: i compensi derivano esclusivamente dalla vendita di prodotti
            formativi a clienti finali. Non sono garantiti guadagni minimi.
          </p>
          <p>© {new Date().getFullYear()} · Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
