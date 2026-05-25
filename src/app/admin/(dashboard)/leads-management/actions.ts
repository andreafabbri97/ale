"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  buildTree,
  suggestPlacement as algoSuggest,
  countPackagesInBranches,
  computeRank,
  POINTS_BY_PACKAGE,
  DIRECT_BONUS_BY_PACKAGE,
  SALE_PRICE_BY_PACKAGE,
  type TreeNode,
  type PlacementSuggestion,
  type RankStatus,
} from "@/lib/binary-tree";
import type {
  Placement,
  PackageType,
  PlacementLeg,
  Lead,
  BinaryRank,
} from "@/lib/supabase/types";

// ============================================================
// READ: stato albero + dati admin
// ============================================================

export interface AdminBranchSnapshot {
  collaboratorId: string;
  name: string;
  email: string;
  isMe: boolean; // se è l'admin loggato
  pointsLeft: number;
  pointsRight: number;
  weakestLeg: PlacementLeg;
  weakestPoints: number;
  rank: RankStatus;
}

export interface TreeStateResult {
  ok: true;
  root: SerializedNode | null;
  admins: AdminBranchSnapshot[];
}

export interface ErrorResult {
  ok: false;
  error: string;
}

// Serialized tree (per passare a client components)
export interface SerializedNode {
  id: string;
  type: "admin" | "customer";
  label: string; // nome admin o cliente
  package: PackageType | null;
  points: number;
  pointsLeft: number;
  pointsRight: number;
  placedAt: string;
  left: SerializedNode | null;
  right: SerializedNode | null;
}

function serializeNode(node: TreeNode): SerializedNode {
  return {
    id: node.placement.id,
    type: node.placement.node_type,
    label:
      node.placement.node_type === "admin"
        ? node.collaboratorName ?? "—"
        : node.placement.customer_name ?? "Cliente",
    package: node.placement.package,
    points: node.placement.points,
    pointsLeft: node.pointsLeft,
    pointsRight: node.pointsRight,
    placedAt: node.placement.placed_at,
    left: node.left ? serializeNode(node.left) : null,
    right: node.right ? serializeNode(node.right) : null,
  };
}

export async function getTreeState(): Promise<TreeStateResult | ErrorResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    const { data: placementsRaw, error: placementsErr } = await supabase
      .from("placements")
      .select("*");

    if (placementsErr) {
      // Rileva esplicitamente "table not found" → la migration 0004 non è stata eseguita
      const msg = placementsErr.message ?? "";
      const code = (placementsErr as { code?: string }).code ?? "";
      if (code === "PGRST205" || msg.toLowerCase().includes("placements")) {
        return {
          ok: false,
          error:
            "Tabella `placements` mancante nel DB. Esegui la migration 0004_binary_tree.sql in Supabase SQL Editor.",
        };
      }
      return { ok: false, error: `Errore DB: ${msg || code}` };
    }

    const placements = (placementsRaw ?? []) as Placement[];

    if (placements.length === 0) {
      return {
        ok: false,
        error:
          "Albero vuoto. Esegui la migration 0004_binary_tree.sql in Supabase SQL Editor: il seed inserisce automaticamente i 3 admin nelle posizioni corrette.",
      };
    }

    const { data: collabsRaw } = await supabase
      .from("collaborators")
      .select("id, full_name, email")
      .eq("is_admin", true);
    const collabs =
      (collabsRaw ?? []) as { id: string; full_name: string; email: string }[];
    const namesMap = new Map<string, string>();
    for (const c of collabs) namesMap.set(c.id, c.full_name);

    const { data: ranksRaw } = await supabase
      .from("binary_ranks")
      .select("*")
      .order("level", { ascending: true });
    const ranks = (ranksRaw ?? []) as BinaryRank[];

    const root = buildTree(placements, namesMap);
    if (!root) return { ok: true, root: null, admins: [] };

    // Costruisce snapshot per ogni admin
    const currentUserId = user.id;
    const admins: AdminBranchSnapshot[] = [];
    function visit(n: TreeNode) {
      if (n.placement.node_type === "admin" && n.placement.collaborator_id) {
        const collabId = n.placement.collaborator_id;
        const collab = collabs.find((c) => c.id === collabId);
        const counts = countPackagesInBranches(n);
        const rankStatus = computeRank(n, counts, ranks);
        admins.push({
          collaboratorId: collabId,
          name: collab?.full_name ?? "—",
          email: collab?.email ?? "—",
          isMe: collabId === currentUserId,
          pointsLeft: n.pointsLeft,
          pointsRight: n.pointsRight,
          weakestLeg: n.pointsLeft <= n.pointsRight ? "LEFT" : "RIGHT",
          weakestPoints: Math.min(n.pointsLeft, n.pointsRight),
          rank: rankStatus,
        });
      }
      if (n.left) visit(n.left);
      if (n.right) visit(n.right);
    }
    visit(root);

    // Ordina admin: l'utente loggato primo, poi gli altri
    admins.sort((a, b) => {
      if (a.isMe && !b.isMe) return -1;
      if (!a.isMe && b.isMe) return 1;
      return a.name.localeCompare(b.name);
    });

    return {
      ok: true,
      root: serializeNode(root),
      admins,
    };
  } catch (err) {
    console.error("[leads-mgmt] getTreeState error:", err);
    return { ok: false, error: "Errore lettura albero." };
  }
}

// ============================================================
// READ: lead aperti (non chiusi) ordinati per priorità
// ============================================================

export interface OpenLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  score: string | null;
  createdAt: string;
  hasAlreadyPlacement: boolean;
}

export async function getOpenLeads(): Promise<OpenLead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, email, phone, status, source, score, created_at")
    .not("status", "in", "(won,lost)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[leads-mgmt] getOpenLeads:", error);
    return [];
  }

  const leads = (data ?? []) as Lead[];
  if (leads.length === 0) return [];

  // Verifica quali lead hanno già un placement (sono già stati venduti, edge case)
  const { data: placementsForLeads } = await supabase
    .from("placements")
    .select("lead_id")
    .in(
      "lead_id",
      leads.map((l) => l.id),
    );
  const placedSet = new Set(
    ((placementsForLeads ?? []) as { lead_id: string | null }[])
      .map((p) => p.lead_id)
      .filter((x): x is string => x !== null),
  );

  return leads.map((l) => ({
    id: l.id,
    fullName: l.full_name,
    email: l.email,
    phone: l.phone,
    status: l.status,
    source: l.source,
    score: l.score,
    createdAt: l.created_at,
    hasAlreadyPlacement: placedSet.has(l.id),
  }));
}

// ============================================================
// SUGGEST PLACEMENT (per modal)
// ============================================================

export async function suggestPlacementForNewSale(): Promise<
  | { ok: true; suggestion: PlacementSuggestion }
  | { ok: false; error: string }
> {
  try {
    const state = await getTreeState();
    if (!state.ok) return { ok: false, error: state.error };
    if (!state.root) return { ok: false, error: "Albero vuoto." };

    // Ricostruisco la TreeNode da serializednode è una pena.
    // Più semplice: rifaccio buildTree e suggest qui dentro.
    const supabase = await createClient();
    const { data: placementsRaw } = await supabase
      .from("placements")
      .select("*");
    const placements = (placementsRaw ?? []) as Placement[];

    const { data: collabsRaw } = await supabase
      .from("collaborators")
      .select("id, full_name")
      .eq("is_admin", true);
    const namesMap = new Map<string, string>();
    for (const c of (collabsRaw ?? []) as { id: string; full_name: string }[]) {
      namesMap.set(c.id, c.full_name);
    }

    const tree = buildTree(placements, namesMap);
    if (!tree) return { ok: false, error: "Albero vuoto." };

    const suggestion = algoSuggest(tree);
    if (!suggestion)
      return { ok: false, error: "Impossibile suggerire un posto." };

    return { ok: true, suggestion };
  } catch (err) {
    console.error("[leads-mgmt] suggestPlacement error:", err);
    return { ok: false, error: "Errore nel suggerimento." };
  }
}

// ============================================================
// MUTATION: chiudi vendita + crea placement (transazionale)
// ============================================================

export interface CloseSaleInput {
  leadId: string;
  package: PackageType;
  parentPlacementId: string; // sotto chi piazzare
  leg: PlacementLeg;
  notes?: string;
}

export interface CloseSaleResult {
  ok: boolean;
  error?: string;
  placementId?: string;
}

export async function closeSaleWithPlacement(
  input: CloseSaleInput,
): Promise<CloseSaleResult> {
  if (!input.leadId || !input.parentPlacementId || !input.package || !input.leg) {
    return { ok: false, error: "Parametri mancanti." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Sessione scaduta." };

    // 1. Verifica che il posto sia libero
    const { data: occupied } = await supabase
      .from("placements")
      .select("id")
      .eq("parent_id", input.parentPlacementId)
      .eq("leg", input.leg)
      .maybeSingle();

    if (occupied) {
      return {
        ok: false,
        error: "Quel posto risulta già occupato. Ricarica la pagina.",
      };
    }

    // 2. Recupera lead
    const { data: leadRaw, error: leadErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", input.leadId)
      .single();
    if (leadErr || !leadRaw) {
      return { ok: false, error: "Lead non trovato." };
    }
    const lead = leadRaw as Lead;

    if (lead.status === "won") {
      return { ok: false, error: "Lead già marcato come WON." };
    }

    // 3. Crea placement
    const points = POINTS_BY_PACKAGE[input.package];
    const commission = DIRECT_BONUS_BY_PACKAGE[input.package];
    const salePrice = SALE_PRICE_BY_PACKAGE[input.package];

    const placementPayload = {
      parent_id: input.parentPlacementId,
      leg: input.leg,
      node_type: "customer" as const,
      collaborator_id: null,
      lead_id: lead.id,
      customer_name: lead.full_name,
      customer_email: lead.email,
      package: input.package,
      points,
      sale_amount: salePrice,
      commission_immediate: commission,
      closed_by_collaborator_id: user.id,
      placed_by_collaborator_id: user.id,
      notes: input.notes ?? null,
    };

    const { data: placedRaw, error: placeErr } = await supabase
      .from("placements")
      .insert(placementPayload)
      .select("id")
      .single();

    if (placeErr || !placedRaw) {
      console.error("[leads-mgmt] insert placement failed:", placeErr);
      return {
        ok: false,
        error: `Errore creazione placement: ${placeErr?.message ?? "sconosciuto"}`,
      };
    }
    const placement = placedRaw as { id: string };

    // 4. Aggiorna lead → won
    await supabase
      .from("leads")
      .update({
        status: "won",
        package_acquired: input.package,
        acquired_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    // 5. Log interaction
    await supabase.from("interactions").insert({
      lead_id: lead.id,
      collaborator_id: user.id,
      type: "status_change",
      content: `Vendita chiusa: pacchetto ${input.package.toUpperCase()} ($${salePrice}). Piazzato in albero binario (placement ${placement.id.slice(0, 8)}).`,
      metadata: {
        from: lead.status,
        to: "won",
        package: input.package,
        placement_id: placement.id,
        parent_id: input.parentPlacementId,
        leg: input.leg,
      },
    });

    revalidatePath("/admin/leads-management");
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true, placementId: placement.id };
  } catch (err) {
    console.error("[leads-mgmt] closeSale error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Errore generico.",
    };
  }
}
