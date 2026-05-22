import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] pt-20 pb-8 mt-20">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg mb-4">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black">
                N
              </span>
              <span>NOA × One Tribe</span>
            </Link>
            <p className="text-sm text-[var(--color-text-faint)] leading-relaxed">
              Piattaforma di educazione finanziaria.
              <br />
              Distribuita da collaboratore indipendente.
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
            I contenuti di questo sito hanno scopo esclusivamente <strong>formativo</strong> e{" "}
            <strong>non costituiscono consulenza finanziaria</strong>, raccomandazione di investimento,
            sollecitazione al pubblico risparmio né attività riservata ai sensi del TUF. Investire
            comporta rischi, anche di perdita totale del capitale. Le performance passate non
            garantiscono risultati futuri. Rivolgiti sempre a un consulente finanziario abilitato prima
            di prendere decisioni di investimento.
          </p>
          <p>
            NOA Italy e One Tribe Academy sono brand di formazione. Questo sito è gestito da un
            collaboratore indipendente del brand, in conformità con il D.Lgs 173/2005 sulla vendita
            diretta.
          </p>
          <p>© {new Date().getFullYear()} · Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
