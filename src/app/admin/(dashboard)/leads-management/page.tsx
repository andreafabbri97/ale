import type { Metadata } from "next";
import { AdminRankCard } from "@/components/admin/admin-rank-card";
import { BinaryTreeView } from "@/components/admin/binary-tree-view";
import { OpenLeadsList } from "@/components/admin/open-leads-list";
import { Reveal } from "@/components/reveal";
import { getTreeState, getOpenLeads } from "./actions";

export const metadata: Metadata = {
  title: "Gestione lead · Albero binario",
  robots: { index: false, follow: false },
};

export default async function LeadsManagementPage() {
  const [stateResult, openLeads] = await Promise.all([
    getTreeState(),
    getOpenLeads(),
  ]);

  if (!stateResult.ok) {
    return (
      <>
        <header className="mb-6">
          <p className="eyebrow mb-2">MLM Binary</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Gestione lead
          </h1>
        </header>

        <div className="card border-amber-500/40 bg-amber-500/5 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">⚠</div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-200 text-lg mb-1">
                Migration database non eseguita
              </h3>
              <p className="text-sm text-[var(--color-text-dim)]">
                {stateResult.error}
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
            <p className="text-sm font-semibold">Come risolvere in 60 secondi:</p>
            <ol className="text-sm text-[var(--color-text-dim)] space-y-2 list-decimal list-inside ml-2">
              <li>
                Apri il{" "}
                <a
                  href="https://supabase.com/dashboard/project/fylljpfijhwiwapibpwd/sql/new"
                  target="_blank"
                  rel="noopener"
                  className="text-[var(--color-accent)] underline font-semibold"
                >
                  SQL Editor di Supabase
                </a>{" "}
                (link diretto, già su questo progetto)
              </li>
              <li>
                Apri il file{" "}
                <code className="text-[var(--color-accent)] text-xs bg-white/5 px-1.5 py-0.5 rounded">
                  supabase/migrations/0004_binary_tree.sql
                </code>{" "}
                nel repository
              </li>
              <li>
                <strong>Ctrl+A</strong> per selezionare tutto, <strong>Ctrl+C</strong>{" "}
                per copiare, incolla nel SQL Editor di Supabase
              </li>
              <li>
                Click <strong>Run</strong> in basso a destra → attendi messaggio
                &quot;Success&quot;
              </li>
              <li>Torna qui e ricarica la pagina (Ctrl+R)</li>
            </ol>

            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-faint)]">
                <strong>Cosa fa la migration:</strong> crea le tabelle{" "}
                <code>placements</code> (nodi albero binario) e{" "}
                <code>binary_ranks</code> (14 livelli compenso), funzioni ricorsive
                per calcolo PV, e inserisce automaticamente i 3 admin (Luigi root,
                Enrico SX, Andrea DX di Enrico) nelle posizioni corrette.
              </p>
            </div>
          </div>
        </div>

        {/* Mostra comunque i lead aperti — per evitare che l'utente perda contesto */}
        {openLeads.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3">
              Lead aperti{" "}
              <span className="text-[var(--color-text-faint)] font-normal text-sm">
                ({openLeads.length})
              </span>
            </h2>
            <p className="text-xs text-[var(--color-text-dim)] mb-4">
              Quando la migration sarà eseguita, potrai chiudere queste vendite
              piazzandole nell&apos;albero. Nel frattempo continua a gestirli da{" "}
              <a href="/admin/leads" className="text-[var(--color-accent)] underline">
                Tutti i lead
              </a>
              .
            </p>
            <div className="space-y-2">
              {openLeads.map((l) => (
                <div key={l.id} className="card !p-3 text-sm">
                  <div className="font-semibold">{l.fullName}</div>
                  <div className="text-xs text-[var(--color-text-faint)]">
                    {l.email} · {l.phone || "no tel"}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </>
    );
  }

  const { admins, root } = stateResult;

  return (
    <>
      <header className="mb-6 animate-fade-up">
        <p className="eyebrow mb-2">MLM Binary</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Gestione lead
        </h1>
        <p className="text-[var(--color-text-dim)] mt-2 text-sm sm:text-base">
          Chiudi vendite e piazza i clienti nell&apos;albero binario. Il sistema
          suggerisce sempre il posto migliore per equilibrare i 3 admin sul ramo debole.
        </p>
      </header>

      {/* ============ ADMIN CARDS ============ */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">Stato admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {admins.map((admin, i) => (
            <Reveal
              key={admin.collaboratorId}
              stagger={(i + 1) as 1 | 2 | 3}
            >
              <AdminRankCard admin={admin} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BINARY TREE ============ */}
      <section className="mb-8">
        <Reveal as="h2" className="text-lg font-bold mb-3">
          Albero binario
        </Reveal>
        <Reveal stagger={1}>
          <BinaryTreeView root={root} />
        </Reveal>
      </section>

      {/* ============ LEAD APERTI ============ */}
      <section>
        <Reveal as="h2" className="text-lg font-bold mb-3">
          Lead aperti da chiudere{" "}
          <span className="text-[var(--color-text-faint)] font-normal text-sm">
            ({openLeads.length})
          </span>
        </Reveal>
        <Reveal stagger={1}>
          <OpenLeadsList leads={openLeads} admins={admins} root={root} />
        </Reveal>
      </section>
    </>
  );
}
