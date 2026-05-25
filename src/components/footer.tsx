import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { SpikeIcon } from "@/components/spike-icon";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] pt-20 pb-8 mt-20">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg mb-4">
              <SpikeIcon size={56} title="Spike" />
              <span>Spike</span>
            </Link>
            <p className="text-sm text-[var(--color-text-faint)] leading-relaxed">
              Educazione finanziaria, trading e investimenti.
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
                  Scopri il percorso
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
                <a
                  href={`mailto:${siteConfig.contacts.publicEmail}`}
                  className="hover:text-[var(--color-accent)]"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contacts.whatsappNumber}`}
                  rel="noopener"
                  className="hover:text-[var(--color-accent)]"
                >
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
            <strong>Marchi.</strong> I nomi dei software didattici menzionati
            (Hummingbird, Lumen, Maitryx, Solexx), i nomi degli educatori e dei rispettivi
            servizi appartengono ai loro legittimi titolari. Questo sito è gestito da{" "}
            <strong>Spike</strong> in qualità di collaboratore indipendente autorizzato e non
            costituisce il sito ufficiale del provider della piattaforma formativa proposta.
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
