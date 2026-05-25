import type {
  PackageType,
  PlacementLeg,
  Placement,
  BinaryRank,
} from "@/lib/supabase/types";
import { siteConfig } from "@/lib/site-config";

// ============================================================
// CONSTANTS (centralizzati in siteConfig)
// ============================================================
export const POINTS_BY_PACKAGE: Record<PackageType, number> = {
  starter: siteConfig.mlm.points.starter,
  pro: siteConfig.mlm.points.pro,
  elite: siteConfig.mlm.points.elite,
};

export const DIRECT_BONUS_BY_PACKAGE: Record<PackageType, number> = {
  starter: siteConfig.mlm.directBonus.starter,
  pro: siteConfig.mlm.directBonus.pro,
  elite: siteConfig.mlm.directBonus.elite,
};

export const SALE_PRICE_BY_PACKAGE: Record<PackageType, number> = {
  starter: siteConfig.mlm.salePrice.starter,
  pro: siteConfig.mlm.salePrice.pro,
  elite: siteConfig.mlm.salePrice.elite,
};

// ============================================================
// TREE NODE (in-memory representation)
// ============================================================
export interface TreeNode {
  placement: Placement;
  collaboratorName?: string;
  left: TreeNode | null;
  right: TreeNode | null;
  // PV cumulativi del sottoalbero a partire da questo nodo (esclude se stesso)
  pointsLeft: number;
  pointsRight: number;
}

/**
 * Costruisce in-memory un albero binario a partire dalla lista flat di placements.
 * Calcola anche pointsLeft/pointsRight di ogni nodo.
 */
export function buildTree(
  placements: Placement[],
  collaboratorNames: Map<string, string> = new Map(),
): TreeNode | null {
  if (placements.length === 0) return null;

  // Map: id → TreeNode (vuoto, link da popolare)
  const nodes = new Map<string, TreeNode>();

  for (const p of placements) {
    nodes.set(p.id, {
      placement: p,
      collaboratorName:
        p.collaborator_id != null
          ? collaboratorNames.get(p.collaborator_id) ?? undefined
          : undefined,
      left: null,
      right: null,
      pointsLeft: 0,
      pointsRight: 0,
    });
  }

  let root: TreeNode | null = null;

  for (const p of placements) {
    const node = nodes.get(p.id)!;
    if (p.parent_id == null) {
      root = node;
    } else {
      const parent = nodes.get(p.parent_id);
      if (!parent) continue;
      if (p.leg === "LEFT") parent.left = node;
      else if (p.leg === "RIGHT") parent.right = node;
    }
  }

  if (root) computeBranchPoints(root);
  return root;
}

/**
 * Ricorsivamente computa pointsLeft/pointsRight di ogni nodo del sottoalbero.
 * Ritorna la somma totale del sottoalbero (incluso il nodo stesso).
 */
function computeBranchPoints(node: TreeNode): number {
  const leftTotal = node.left ? computeBranchPoints(node.left) : 0;
  const rightTotal = node.right ? computeBranchPoints(node.right) : 0;
  node.pointsLeft = leftTotal;
  node.pointsRight = rightTotal;
  return node.placement.points + leftTotal + rightTotal;
}

// ============================================================
// SUGGEST PLACEMENT (algoritmo)
// ============================================================
export interface PlacementSuggestion {
  adminCollaboratorId: string;
  adminName: string;
  leg: PlacementLeg;
  parentNodeId: string; // nodo sotto il quale piazzare (può essere admin o customer)
  parentNodeLabel: string; // nome admin se diretto, "X (sotto Andrea SX)" se profondo
  depth: number; // 0 = diretto sotto admin, 1+ = spillover
  reason: string; // per spiegare all'utente
}

/**
 * Trova il placement ottimale secondo logica greedy:
 * 1. Per ogni admin: trova il ramo debole (min pointsLeft / pointsRight)
 * 2. Scegli l'admin con il ramo debole minimo in assoluto
 * 3. Su quel ramo, fai BFS per trovare il primo "slot" vuoto disponibile
 */
export function suggestPlacement(root: TreeNode): PlacementSuggestion | null {
  if (!root) return null;

  // Raccogli tutti gli admin con i loro punti SX/DX
  const adminNodes = collectAdminNodes(root);
  if (adminNodes.length === 0) return null;

  // Per ogni admin: ramo debole = min(left, right) in PV
  type AdminScored = {
    node: TreeNode;
    weakestLeg: PlacementLeg;
    weakestPoints: number;
    strongestPoints: number;
  };

  const scored: AdminScored[] = adminNodes.map((n) => {
    const weakestLeg: PlacementLeg =
      n.pointsLeft <= n.pointsRight ? "LEFT" : "RIGHT";
    return {
      node: n,
      weakestLeg,
      weakestPoints: Math.min(n.pointsLeft, n.pointsRight),
      strongestPoints: Math.max(n.pointsLeft, n.pointsRight),
    };
  });

  // Greedy: admin con ramo debole più piccolo in assoluto
  scored.sort((a, b) => a.weakestPoints - b.weakestPoints);
  const target = scored[0];

  // BFS lungo il ramo debole per trovare primo slot vuoto
  const slot = findFirstEmptySlot(target.node, target.weakestLeg);
  if (!slot) return null;

  return {
    adminCollaboratorId: target.node.placement.collaborator_id!,
    adminName: target.node.collaboratorName ?? "—",
    leg: slot.leg,
    parentNodeId: slot.parentId,
    parentNodeLabel: slot.parentLabel,
    depth: slot.depth,
    reason: `${target.node.collaboratorName} ha il ramo ${target.weakestLeg === "LEFT" ? "sinistro" : "destro"} più debole (${target.weakestPoints} PV)`,
  };
}

function collectAdminNodes(root: TreeNode): TreeNode[] {
  const out: TreeNode[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const node = queue.shift()!;
    if (node.placement.node_type === "admin") out.push(node);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return out;
}

interface EmptySlot {
  parentId: string;
  parentLabel: string;
  leg: PlacementLeg;
  depth: number;
}

/**
 * BFS sul sottoalbero del ramo specificato.
 * Trova il primo nodo che ha almeno uno slot vuoto (preferenza LEFT se ramo è LEFT, ecc.)
 */
function findFirstEmptySlot(
  adminNode: TreeNode,
  preferredLeg: PlacementLeg,
): EmptySlot | null {
  // Caso 1: il ramo diretto è vuoto
  const directChild = preferredLeg === "LEFT" ? adminNode.left : adminNode.right;
  if (!directChild) {
    return {
      parentId: adminNode.placement.id,
      parentLabel: adminNode.collaboratorName ?? "—",
      leg: preferredLeg,
      depth: 0,
    };
  }

  // Caso 2: BFS dentro il ramo per trovare il primo slot vuoto
  const queue: { node: TreeNode; depth: number }[] = [
    { node: directChild, depth: 1 },
  ];

  while (queue.length) {
    const { node, depth } = queue.shift()!;

    // Preferenza: prima LEFT poi RIGHT (BFS standard)
    if (!node.left) {
      return {
        parentId: node.placement.id,
        parentLabel: labelOfNode(node),
        leg: "LEFT",
        depth,
      };
    }
    if (!node.right) {
      return {
        parentId: node.placement.id,
        parentLabel: labelOfNode(node),
        leg: "RIGHT",
        depth,
      };
    }

    queue.push({ node: node.left, depth: depth + 1 });
    queue.push({ node: node.right, depth: depth + 1 });
  }

  return null; // teoricamente impossibile (albero infinito)
}

function labelOfNode(node: TreeNode): string {
  if (node.placement.node_type === "admin") {
    return node.collaboratorName ?? "—";
  }
  return node.placement.customer_name ?? "Cliente";
}

// ============================================================
// RANK COMPUTATION
// ============================================================

/**
 * Calcola il rank attuale di un admin in base ai requisiti SX/DX di:
 * - PV totali
 * - vendite di Bundle 1 / 2 / 3 (Starter/Pro/Elite)
 *
 * Ritorna il rank più alto raggiunto (e quello successivo come target).
 *
 * Nota: ignora "diretti" e "rinnovi" (richiedono dati storici aggiuntivi
 * che gestiremo in fase 2 quando avremo abbastanza dati per testarli).
 */
export interface RankStatus {
  current: BinaryRank | null;
  next: BinaryRank | null;
  pointsLeft: number;
  pointsRight: number;
  totalPoints: number;
  counts: {
    starter: { left: number; right: number };
    pro: { left: number; right: number };
    elite: { left: number; right: number };
  };
}

export function computeRank(
  adminNode: TreeNode,
  packageCounts: {
    starter: { left: number; right: number };
    pro: { left: number; right: number };
    elite: { left: number; right: number };
  },
  ranks: BinaryRank[],
): RankStatus {
  const totalPoints = adminNode.pointsLeft + adminNode.pointsRight;

  let current: BinaryRank | null = null;
  let next: BinaryRank | null = null;

  // ranks ordinati per level asc
  const sortedRanks = [...ranks].sort((a, b) => a.level - b.level);

  for (const r of sortedRanks) {
    const ok =
      totalPoints >= r.volume_required &&
      packageCounts.starter.left >= r.bundle1_left &&
      packageCounts.starter.right >= r.bundle1_right &&
      packageCounts.pro.left >= r.bundle2_left &&
      packageCounts.pro.right >= r.bundle2_right &&
      packageCounts.elite.left >= r.bundle3_left &&
      packageCounts.elite.right >= r.bundle3_right;

    if (ok) {
      current = r;
    } else if (current && !next) {
      next = r;
      break;
    } else if (!current && !next) {
      next = r;
      break;
    }
  }

  // Se ha superato tutti i rank, no next
  if (current && !next) {
    const lastIdx = sortedRanks.findIndex((r) => r.level === current!.level);
    next = sortedRanks[lastIdx + 1] ?? null;
  }

  return {
    current,
    next,
    pointsLeft: adminNode.pointsLeft,
    pointsRight: adminNode.pointsRight,
    totalPoints,
    counts: packageCounts,
  };
}

// ============================================================
// PACKAGE COUNT (BFS in TS per evitare round-trip)
// ============================================================
export function countPackagesInBranches(adminNode: TreeNode): {
  starter: { left: number; right: number };
  pro: { left: number; right: number };
  elite: { left: number; right: number };
} {
  function countSubtree(node: TreeNode | null): {
    starter: number;
    pro: number;
    elite: number;
  } {
    if (!node) return { starter: 0, pro: 0, elite: 0 };
    const left = countSubtree(node.left);
    const right = countSubtree(node.right);
    const own = { starter: 0, pro: 0, elite: 0 };
    if (node.placement.package === "starter") own.starter = 1;
    else if (node.placement.package === "pro") own.pro = 1;
    else if (node.placement.package === "elite") own.elite = 1;
    return {
      starter: left.starter + right.starter + own.starter,
      pro: left.pro + right.pro + own.pro,
      elite: left.elite + right.elite + own.elite,
    };
  }

  const left = countSubtree(adminNode.left);
  const right = countSubtree(adminNode.right);
  return {
    starter: { left: left.starter, right: right.starter },
    pro: { left: left.pro, right: right.pro },
    elite: { left: left.elite, right: right.elite },
  };
}
