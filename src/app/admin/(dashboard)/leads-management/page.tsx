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

        <div className="card border-[var(--color-danger)]/40 bg-[rgba(231,76,60,0.05)]">
          <h3 className="font-bold text-[var(--color-danger)] mb-2">
            ⚠ Sistema non inizializzato
          </h3>
          <p className="text-sm text-[var(--color-text-dim)] mb-3">
            {stateResult.error}
          </p>
          <p className="text-sm text-[var(--color-text-dim)]">
            Probabile causa: la migration <code className="text-[var(--color-accent)]">0004_binary_tree.sql</code>{" "}
            non è ancora stata eseguita su Supabase. Aprila in{" "}
            <a
              href="https://supabase.com/dashboard/project/fylljpfijhwiwapibpwd/sql/new"
              target="_blank"
              rel="noopener"
              className="text-[var(--color-accent)] underline"
            >
              SQL Editor
            </a>{" "}
            e incolla il file <code>supabase/migrations/0004_binary_tree.sql</code>.
          </p>
        </div>
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
