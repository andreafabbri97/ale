"use client";

import { useState } from "react";
import type { SerializedNode } from "@/app/admin/(dashboard)/leads-management/actions";

interface BinaryTreeViewProps {
  root: SerializedNode | null;
}

const PKG_COLORS: Record<string, string> = {
  starter: "bg-zinc-700/30 border-zinc-500/40",
  pro: "bg-blue-600/20 border-blue-400/40",
  elite: "bg-cyan-500/20 border-cyan-300/50",
};

function NodeChip({ node }: { node: SerializedNode }) {
  const isAdmin = node.type === "admin";
  const pkgClass = node.package ? PKG_COLORS[node.package] : "";
  return (
    <div
      className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold border whitespace-nowrap ${
        isAdmin
          ? "bg-[rgba(59,212,248,0.15)] border-[var(--color-accent)] text-[var(--color-accent)]"
          : `${pkgClass} text-[var(--color-text)]`
      }`}
    >
      {isAdmin && <span className="text-[10px]">👤</span>}
      <span className="max-w-[60px] sm:max-w-[120px] truncate">{node.label}</span>
      {!isAdmin && node.package && (
        <span className="opacity-70 uppercase text-[9px]">{node.package[0]}</span>
      )}
    </div>
  );
}

function EmptySlot({ side }: { side: "L" | "R" }) {
  return (
    <div className="inline-flex items-center justify-center px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md text-[9px] sm:text-[10px] font-semibold text-[var(--color-text-faint)] border border-dashed border-[var(--color-border)] bg-white/[0.02] min-w-[28px] sm:min-w-[40px]">
      {side}
    </div>
  );
}

/**
 * Verifica se un sottoalbero ha almeno un nodo (ramo non completamente vuoto).
 * Usato per evitare di renderizzare valanghe di slot vuoti irrilevanti.
 */
function hasAnyDescendant(node: SerializedNode | null): boolean {
  if (!node) return false;
  return Boolean(node.left) || Boolean(node.right);
}

function RecursiveNode({
  node,
  depth,
  maxDepth,
}: {
  node: SerializedNode;
  depth: number;
  maxDepth: number;
}) {
  if (depth > maxDepth) {
    const hasMore = hasAnyDescendant(node);
    return (
      <div className="flex flex-col items-center gap-0.5">
        <NodeChip node={node} />
        {hasMore && (
          <div className="text-[9px] text-[var(--color-text-faint)]">
            +{node.pointsLeft + node.pointsRight} PV ↓
          </div>
        )}
      </div>
    );
  }

  // Non espandere oltre nodi che non hanno figli E non sono root/admin
  // (così evitiamo di mostrare slot vuoti dopo i clienti foglia)
  const isLeafCustomer = node.type === "customer" && !node.left && !node.right;
  if (isLeafCustomer) {
    return <NodeChip node={node} />;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <NodeChip node={node} />
      <div className="flex items-start gap-1.5 sm:gap-3 mt-0.5 pt-0.5 sm:pt-1 border-t border-[var(--color-border)]/40">
        <div className="flex flex-col items-center">
          <div className="text-[8px] sm:text-[9px] text-[var(--color-text-faint)] mb-0.5">
            SX
          </div>
          {node.left ? (
            <RecursiveNode node={node.left} depth={depth + 1} maxDepth={maxDepth} />
          ) : (
            <EmptySlot side="L" />
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[8px] sm:text-[9px] text-[var(--color-text-faint)] mb-0.5">
            DX
          </div>
          {node.right ? (
            <RecursiveNode node={node.right} depth={depth + 1} maxDepth={maxDepth} />
          ) : (
            <EmptySlot side="R" />
          )}
        </div>
      </div>
    </div>
  );
}

export function BinaryTreeView({ root }: BinaryTreeViewProps) {
  // Profondità: default 2 livelli (root + 2 = max 7 nodi). Espandibile a 4
  // tramite controllo utente — su mobile resta strettamente consigliato 2.
  const [maxDepth, setMaxDepth] = useState(2);

  if (!root) {
    return (
      <div className="card text-center py-12 text-[var(--color-text-dim)]">
        Albero non inizializzato. Verifica che gli admin siano stati popolati.
      </div>
    );
  }

  return (
    <div className="card !p-2 sm:!p-5">
      {/* Toolbar profondità + hint scroll */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="text-[10px] text-[var(--color-text-faint)] sm:hidden">
          ← scorri →
        </div>
        <div className="hidden sm:block text-xs text-[var(--color-text-faint)]">
          Profondità visibile: <strong className="text-[var(--color-text-dim)]">{maxDepth + 1} livelli</strong>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px]">
          {[2, 3, 4].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setMaxDepth(d)}
              className={`px-2 py-1 rounded border transition ${
                maxDepth === d
                  ? "bg-[rgba(59,212,248,0.15)] border-[var(--color-accent)] text-[var(--color-accent)] font-bold"
                  : "border-[var(--color-border)] text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
              }`}
              aria-label={`Mostra ${d + 1} livelli`}
            >
              {d + 1}L
            </button>
          ))}
        </div>
      </div>

      {/* Albero scorrevole orizzontalmente — il flex con inline-block centra
          il contenuto quando è più stretto del container, e lascia scrollare
          quando è più largo */}
      <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0 pb-2">
        <div className="min-w-min flex justify-center py-2 sm:py-4">
          <RecursiveNode node={root} depth={0} maxDepth={maxDepth} />
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-3 pt-2 sm:pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px] text-[var(--color-text-dim)]">
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-[rgba(59,212,248,0.15)] border border-[var(--color-accent)]" />
          Admin
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-zinc-700/30 border border-zinc-500/40" />
          Starter
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-blue-600/20 border border-blue-400/40" />
          Pro
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-cyan-500/20 border border-cyan-300/50" />
          Elite
        </span>
      </div>
    </div>
  );
}
