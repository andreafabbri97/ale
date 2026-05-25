"use client";

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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${
        isAdmin
          ? "bg-[rgba(59,212,248,0.15)] border-[var(--color-accent)] text-[var(--color-accent)]"
          : `${pkgClass} text-[var(--color-text)]`
      }`}
    >
      {isAdmin && <span>👤</span>}
      <span className="max-w-[120px] truncate">{node.label}</span>
      {!isAdmin && node.package && (
        <span className="opacity-70 uppercase text-[10px]">{node.package[0]}</span>
      )}
    </div>
  );
}

function EmptySlot({ side }: { side: "L" | "R" }) {
  return (
    <div className="inline-flex items-center justify-center px-2 py-1.5 rounded-lg text-[10px] font-semibold text-[var(--color-text-faint)] border border-dashed border-[var(--color-border)] bg-white/[0.02] min-w-[40px]">
      {side}
    </div>
  );
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
    // Collapse: mostra solo conteggio se ha sottoalbero
    const hasMore = node.left || node.right;
    return (
      <div className="flex flex-col items-center gap-1">
        <NodeChip node={node} />
        {hasMore && (
          <div className="text-[10px] text-[var(--color-text-faint)]">
            +{node.pointsLeft + node.pointsRight} PV ↓
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <NodeChip node={node} />
      {(node.left || node.right || depth < 2) && (
        <div className="flex items-start gap-3 mt-1 pt-1 border-t border-[var(--color-border)]/40">
          <div className="flex flex-col items-center">
            <div className="text-[9px] text-[var(--color-text-faint)] mb-0.5">SX</div>
            {node.left ? (
              <RecursiveNode
                node={node.left}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ) : (
              <EmptySlot side="L" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[9px] text-[var(--color-text-faint)] mb-0.5">DX</div>
            {node.right ? (
              <RecursiveNode
                node={node.right}
                depth={depth + 1}
                maxDepth={maxDepth}
              />
            ) : (
              <EmptySlot side="R" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function BinaryTreeView({ root }: BinaryTreeViewProps) {
  if (!root) {
    return (
      <div className="card text-center py-12 text-[var(--color-text-dim)]">
        Albero non inizializzato. Verifica che gli admin siano stati popolati.
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <div className="min-w-full flex justify-center py-4">
        <RecursiveNode node={root} depth={0} maxDepth={4} />
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-center gap-3 text-[11px] text-[var(--color-text-dim)]">
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[rgba(59,212,248,0.15)] border border-[var(--color-accent)]" />
          Admin
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-zinc-700/30 border border-zinc-500/40" />
          Starter
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-600/20 border border-blue-400/40" />
          Pro
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-cyan-500/20 border border-cyan-300/50" />
          Elite
        </span>
      </div>
    </div>
  );
}
