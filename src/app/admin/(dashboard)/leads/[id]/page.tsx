import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  LeadStatusBadge,
  LeadSourceBadge,
  LeadScoreBadge,
} from "@/components/admin/badges";
import { LeadStatusForm } from "@/components/admin/lead-status-form";
import { LeadNoteForm } from "@/components/admin/lead-note-form";
import { deleteLead } from "@/app/admin/(dashboard)/leads/actions";
import type { Lead, Interaction, InteractionType } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Dettaglio lead",
  robots: { index: false, follow: false },
};

const INTERACTION_LABELS: Record<InteractionType, string> = {
  note: "Nota",
  call: "Chiamata",
  whatsapp: "WhatsApp",
  email: "Email",
  meeting: "Meeting",
  status_change: "Cambio stato",
};

const INTERACTION_ICONS: Record<InteractionType, string> = {
  note: "📝",
  call: "📞",
  whatsapp: "💬",
  email: "✉️",
  meeting: "🤝",
  status_change: "🔄",
};

const INTEREST_B2C_LABELS: Record<string, string> = {
  iniziare_zero: "Iniziare da zero",
  investire_risparmi: "Investire risparmi",
  trading_attivo: "Trading attivo",
  ai_pro: "AI per pro",
  generico: "Generico",
};

const ESPERIENZA_LABELS: Record<string, string> = {
  anni: "Sì, da anni",
  mesi: "Sì, qualche mese",
  no_pronto: "No, ma pronto",
  no_non_interessa: "No, non interessato",
};

const TEMPO_LABELS: Record<string, string> = {
  meno_5: "<5h/sett",
  "5_10": "5-10h/sett",
  "10_20": "10-20h/sett",
  "20_plus": ">20h/sett",
};

const RETE_LABELS: Record<string, string> = {
  grande: "Grande (>1000)",
  piccola: "Piccola (100-1000)",
  zero: "Parte da zero",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "ora";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m fa`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h fa`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}g fa`;
  return formatDateTime(iso);
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-1">
        {label}
      </div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single();

  if (!lead) {
    notFound();
  }

  const typedLead = lead as Lead;

  const { data: interactions } = await supabase
    .from("interactions")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  const timeline = (interactions ?? []) as Interaction[];

  return (
    <>
      <header className="mb-8">
        <Link
          href="/admin/leads"
          className="text-sm text-[var(--color-text-faint)] hover:text-[var(--color-accent)] inline-flex items-center gap-1"
        >
          ← Torna alla lista
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LeadSourceBadge source={typedLead.source} />
              <LeadStatusBadge status={typedLead.status} />
              {typedLead.source === "networker" && <LeadScoreBadge score={typedLead.score} />}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {typedLead.full_name}
            </h1>
            <p className="text-sm text-[var(--color-text-dim)] mt-1">
              Lead ricevuto il {formatDateTime(typedLead.created_at)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${typedLead.email}`}
              className="btn btn-ghost text-sm"
            >
              ✉ Email
            </a>
            <a
              href={`https://wa.me/${typedLead.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener"
              className="btn btn-ghost text-sm"
            >
              💬 WhatsApp
            </a>
            <a href={`tel:${typedLead.phone}`} className="btn btn-ghost text-sm">
              📞 Chiama
            </a>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* ============ LEFT: dati lead + timeline ============ */}
        <div className="space-y-6">
          {/* Anagrafica */}
          <section className="card">
            <h2 className="text-lg font-bold mb-4">Anagrafica</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome" value={typedLead.full_name} />
              <Field label="Email" value={typedLead.email} />
              <Field label="Telefono" value={typedLead.phone} />
              {typedLead.citta && <Field label="Città" value={typedLead.citta} />}
              {typedLead.eta && <Field label="Età" value={typedLead.eta} />}
            </div>
          </section>

          {/* Dettagli specifici */}
          {typedLead.source === "cliente" && (
            <section className="card">
              <h2 className="text-lg font-bold mb-4">Dettagli cliente B2C</h2>
              <Field
                label="Interesse"
                value={
                  typedLead.interesse_b2c
                    ? INTEREST_B2C_LABELS[typedLead.interesse_b2c] ?? typedLead.interesse_b2c
                    : null
                }
              />
            </section>
          )}

          {typedLead.source === "networker" && (
            <section className="card">
              <h2 className="text-lg font-bold mb-4">Profilo networker</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Esperienza NM"
                  value={
                    typedLead.esperienza_nm
                      ? ESPERIENZA_LABELS[typedLead.esperienza_nm]
                      : null
                  }
                />
                <Field
                  label="Tempo disponibile"
                  value={
                    typedLead.tempo_disponibile
                      ? TEMPO_LABELS[typedLead.tempo_disponibile]
                      : null
                  }
                />
                <Field
                  label="Rete personale"
                  value={typedLead.rete ? RETE_LABELS[typedLead.rete] : null}
                />
                <Field
                  label="Score calcolato"
                  value={<LeadScoreBadge score={typedLead.score} />}
                />
              </div>
              {typedLead.motivazione && (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-1">
                    Motivazione
                  </div>
                  <p className="text-sm text-[var(--color-text-dim)] whitespace-pre-line">
                    {typedLead.motivazione}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Attribution */}
          <section className="card">
            <h2 className="text-lg font-bold mb-4">Attribution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Pagina di origine" value={typedLead.page_origin} />
              <Field label="Ref code (affiliate)" value={typedLead.ref_code} />
              <Field label="UTM source" value={typedLead.utm_source} />
              <Field label="UTM medium" value={typedLead.utm_medium} />
              <Field label="UTM campaign" value={typedLead.utm_campaign} />
              <Field label="UTM content" value={typedLead.utm_content} />
            </div>
          </section>

          {/* Aggiungi nota */}
          <section className="card">
            <h2 className="text-lg font-bold mb-4">Aggiungi nota / attività</h2>
            <LeadNoteForm leadId={typedLead.id} />
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-lg font-bold mb-4">
              Storico attività{" "}
              <span className="text-sm text-[var(--color-text-faint)] font-normal">
                ({timeline.length})
              </span>
            </h2>
            {timeline.length === 0 ? (
              <p className="card text-sm text-[var(--color-text-dim)] text-center py-8">
                Ancora nessuna attività registrata. Aggiungi una nota sopra.
              </p>
            ) : (
              <ol className="space-y-3">
                {timeline.map((it) => (
                  <li key={it.id} className="card">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{INTERACTION_ICONS[it.type]}</span>
                        <span className="font-semibold text-sm">
                          {INTERACTION_LABELS[it.type]}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-text-faint)]">
                        {timeAgo(it.created_at)}
                      </span>
                    </div>
                    {it.content && (
                      <p className="text-sm text-[var(--color-text-dim)] whitespace-pre-line">
                        {it.content}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* ============ RIGHT: cambio stato + delete ============ */}
        <aside className="space-y-6">
          <section className="card">
            <h3 className="text-base font-bold mb-4">Stato corrente</h3>
            <LeadStatusForm leadId={typedLead.id} currentStatus={typedLead.status} />
          </section>

          {typedLead.status === "lost" && typedLead.lost_reason && (
            <section className="card border-[rgba(231,76,60,0.3)]">
              <h3 className="text-base font-bold mb-2 text-[var(--color-danger)]">
                Motivo perdita
              </h3>
              <p className="text-sm text-[var(--color-text-dim)]">{typedLead.lost_reason}</p>
            </section>
          )}

          <section className="card">
            <h3 className="text-base font-bold mb-2">Privacy</h3>
            <p className="text-xs text-[var(--color-text-dim)]">
              Privacy accettata: {typedLead.privacy_accepted ? "✓ sì" : "✗ no"}
            </p>
            <p className="text-xs text-[var(--color-text-dim)]">
              Marketing: {typedLead.marketing_accepted ? "✓ sì" : "✗ no"}
            </p>
          </section>

          <section className="card border-[rgba(231,76,60,0.2)]">
            <h3 className="text-sm font-bold mb-3 text-[var(--color-danger)]">
              ⚠ Zona pericolosa
            </h3>
            <form action={deleteLead}>
              <input type="hidden" name="lead_id" value={typedLead.id} />
              <button
                type="submit"
                className="btn w-full text-sm text-[var(--color-danger)] border border-[rgba(231,76,60,0.3)] hover:bg-[rgba(231,76,60,0.1)]"
              >
                Elimina lead
              </button>
              <p className="text-[10px] text-[var(--color-text-faint)] mt-2 text-center">
                Azione irreversibile. Solo admin.
              </p>
            </form>
          </section>
        </aside>
      </div>
    </>
  );
}
