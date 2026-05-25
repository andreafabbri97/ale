"use client";

import { useEffect, useState, useTransition } from "react";
import {
  closeSaleWithPlacement,
  suggestPlacementForNewSale,
  type OpenLead,
  type AdminBranchSnapshot,
  type SerializedNode,
} from "@/app/admin/(dashboard)/leads-management/actions";
import type { PackageType, PlacementLeg } from "@/lib/supabase/types";

interface PlacementModalProps {
  lead: OpenLead;
  admins: AdminBranchSnapshot[];
  root: SerializedNode | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface SuggestionState {
  adminCollaboratorId: string;
  adminName: string;
  leg: PlacementLeg;
  parentNodeId: string;
  parentNodeLabel: string;
  depth: number;
  reason: string;
}

/**
 * Trova nello SerializedNode il chip diretto sotto un admin specifico, lato leg.
 * Usato per override manuale.
 */
function findDirectSlotsUnderAdmin(
  root: SerializedNode | null,
  adminCollaboratorId: string,
): { parentId: string; leftFree: boolean; rightFree: boolean } | null {
  if (!root) return null;
  // Walk dell'albero per trovare l'admin
  function walk(n: SerializedNode): SerializedNode | null {
    // Non c'è collaborator_id qui (lo abbiamo serializzato senza)
    // Recuperiamo per label match (gli admin sono i 3, label = nome).
    // Soluzione più robusta: serialize anche collaboratorId. Lo faremo se serve.
    if (n.type === "admin" && n.id === adminCollaboratorId) return n;
    if (n.left) {
      const r = walk(n.left);
      if (r) return r;
    }
    if (n.right) {
      const r = walk(n.right);
      if (r) return r;
    }
    return null;
  }
  const adminNode = walk(root);
  if (!adminNode) return null;
  return {
    parentId: adminNode.id,
    leftFree: !adminNode.left,
    rightFree: !adminNode.right,
  };
}

export function PlacementModal({
  lead,
  admins,
  root,
  onClose,
  onSuccess,
}: PlacementModalProps) {
  const [pkg, setPkg] = useState<PackageType>("starter");
  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);

  // Override manuale
  const [overrideOn, setOverrideOn] = useState(false);
  const [manualAdminId, setManualAdminId] = useState<string>("");
  const [manualLeg, setManualLeg] = useState<PlacementLeg>("LEFT");

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await suggestPlacementForNewSale();
      if (cancelled) return;
      if (res.ok) {
        setSuggestion({
          adminCollaboratorId: res.suggestion.adminCollaboratorId,
          adminName: res.suggestion.adminName,
          leg: res.suggestion.leg,
          parentNodeId: res.suggestion.parentNodeId,
          parentNodeLabel: res.suggestion.parentNodeLabel,
          depth: res.suggestion.depth,
          reason: res.suggestion.reason,
        });
      } else {
        setError(res.error);
      }
      setLoadingSuggestion(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Quando l'utente attiva override, preseleziona admin con primo slot libero diretto
  useEffect(() => {
    if (!overrideOn || manualAdminId !== "") return;
    for (const a of admins) {
      const slots = findDirectSlotsUnderAdmin(root, a.collaboratorId);
      if (slots && (slots.leftFree || slots.rightFree)) {
        setManualAdminId(a.collaboratorId);
        setManualLeg(slots.leftFree ? "LEFT" : "RIGHT");
        return;
      }
    }
  }, [overrideOn, admins, root, manualAdminId]);

  const manualSlots = manualAdminId
    ? findDirectSlotsUnderAdmin(root, manualAdminId)
    : null;

  async function handleSubmit() {
    setError(null);

    let parentId: string;
    let leg: PlacementLeg;

    if (overrideOn) {
      if (!manualSlots || !manualAdminId) {
        setError("Seleziona admin + lato per override manuale.");
        return;
      }
      if (
        (manualLeg === "LEFT" && !manualSlots.leftFree) ||
        (manualLeg === "RIGHT" && !manualSlots.rightFree)
      ) {
        setError(
          `Slot ${manualLeg} di quell'admin è già occupato. Disattiva override per spillover automatico.`,
        );
        return;
      }
      parentId = manualSlots.parentId;
      leg = manualLeg;
    } else {
      if (!suggestion) {
        setError("Suggerimento non disponibile.");
        return;
      }
      parentId = suggestion.parentNodeId;
      leg = suggestion.leg;
    }

    startTransition(async () => {
      const result = await closeSaleWithPlacement({
        leadId: lead.id,
        package: pkg,
        parentPlacementId: parentId,
        leg,
      });
      if (result.ok) {
        onSuccess();
      } else {
        setError(result.error ?? "Errore generico.");
      }
    });
  }

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="card max-w-lg w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="eyebrow mb-1">Chiudi vendita</p>
            <h3 className="text-xl font-bold">{lead.fullName}</h3>
            <p className="text-sm text-[var(--color-text-dim)]">{lead.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-faint)] hover:text-[var(--color-text)] text-xl leading-none"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        {/* PACCHETTO */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
            Pacchetto venduto
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { v: "starter", label: "Starter", sub: "$159 · 99 PV · bonus $30" },
                { v: "pro", label: "Pro", sub: "$845 · 450 PV · bonus $150" },
                { v: "elite", label: "Elite", sub: "$1.699 · 990 PV · bonus $300" },
              ] as { v: PackageType; label: string; sub: string }[]
            ).map((p) => (
              <button
                key={p.v}
                onClick={() => setPkg(p.v)}
                className={`p-3 rounded-lg border text-left transition ${
                  pkg === p.v
                    ? "border-[var(--color-accent)] bg-[rgba(59,212,248,0.08)]"
                    : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                }`}
              >
                <div className="font-bold text-sm">{p.label}</div>
                <div className="text-[10px] text-[var(--color-text-faint)] leading-tight mt-1">
                  {p.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SUGGERIMENTO PLACEMENT */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-2">
            Posizionamento nell&apos;albero
          </label>

          {loadingSuggestion && (
            <div className="card !p-3 text-sm text-[var(--color-text-dim)] text-center">
              Calcolo suggerimento...
            </div>
          )}

          {!loadingSuggestion && suggestion && !overrideOn && (
            <div className="card !p-3 border-[var(--color-accent)]/40">
              <div className="text-xs text-[var(--color-text-faint)] mb-1">
                ✨ Suggerimento automatico
              </div>
              <div className="text-sm font-semibold">
                Sotto <span className="text-[var(--color-accent)]">{suggestion.parentNodeLabel}</span>,
                lato <span className="text-[var(--color-accent)]">{suggestion.leg === "LEFT" ? "SX" : "DX"}</span>
                {suggestion.depth > 0 && (
                  <span className="text-[var(--color-text-faint)] font-normal">
                    {" "}(spillover profondità {suggestion.depth})
                  </span>
                )}
              </div>
              <div className="text-xs text-[var(--color-text-dim)] mt-1">
                {suggestion.reason}
              </div>
            </div>
          )}

          {overrideOn && (
            <div className="card !p-3 space-y-2">
              <div className="text-xs text-[var(--color-text-faint)] mb-1">
                🔧 Override manuale
              </div>
              <select
                value={manualAdminId}
                onChange={(e) => {
                  setManualAdminId(e.target.value);
                  const slots = findDirectSlotsUnderAdmin(root, e.target.value);
                  if (slots) {
                    setManualLeg(slots.leftFree ? "LEFT" : "RIGHT");
                  }
                }}
                className="input text-sm"
              >
                <option value="">— scegli admin —</option>
                {admins.map((a) => {
                  const slots = findDirectSlotsUnderAdmin(root, a.collaboratorId);
                  const noSlots = slots && !slots.leftFree && !slots.rightFree;
                  return (
                    <option
                      key={a.collaboratorId}
                      value={a.collaboratorId}
                      disabled={!!noSlots}
                    >
                      {a.name} {noSlots ? "(slot diretti pieni)" : ""}
                    </option>
                  );
                })}
              </select>
              {manualSlots && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setManualLeg("LEFT")}
                    disabled={!manualSlots.leftFree}
                    className={`p-2 rounded text-sm border ${
                      manualLeg === "LEFT"
                        ? "border-[var(--color-accent)] bg-[rgba(59,212,248,0.08)]"
                        : "border-[var(--color-border)]"
                    } ${!manualSlots.leftFree ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    SX {!manualSlots.leftFree && "(pieno)"}
                  </button>
                  <button
                    onClick={() => setManualLeg("RIGHT")}
                    disabled={!manualSlots.rightFree}
                    className={`p-2 rounded text-sm border ${
                      manualLeg === "RIGHT"
                        ? "border-[var(--color-accent)] bg-[rgba(59,212,248,0.08)]"
                        : "border-[var(--color-border)]"
                    } ${!manualSlots.rightFree ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    DX {!manualSlots.rightFree && "(pieno)"}
                  </button>
                </div>
              )}
              <p className="text-[10px] text-[var(--color-text-faint)]">
                Override solo per slot diretti dei 3 admin. Per spillover profondo usa il
                suggerimento automatico.
              </p>
            </div>
          )}

          <label className="flex items-center gap-2 mt-3 text-xs text-[var(--color-text-dim)] cursor-pointer">
            <input
              type="checkbox"
              checked={overrideOn}
              onChange={(e) => setOverrideOn(e.target.checked)}
              className="accent-[var(--color-accent)]"
            />
            Sovrascrivi manualmente (no spillover automatico)
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-ghost text-sm">
            Annulla
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || loadingSuggestion}
            className="btn btn-primary text-sm"
          >
            {isPending ? "Salvataggio..." : "Chiudi vendita"}
          </button>
        </div>
      </div>
    </div>
  );
}
