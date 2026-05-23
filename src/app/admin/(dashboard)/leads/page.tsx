import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  LeadStatusBadge,
  LeadSourceBadge,
  LeadScoreBadge,
} from "@/components/admin/badges";
import { LeadCardMobile } from "@/components/admin/lead-card-mobile";
import type { Lead, LeadStatus, LeadSource } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Lead",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 25;

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Tutti gli stati" },
  { value: "new", label: "Nuovi" },
  { value: "contattato", label: "Contattati" },
  { value: "call_prenotata", label: "Call prenotata" },
  { value: "call_fatta", label: "Call fatta" },
  { value: "offerta_inviata", label: "Offerta inviata" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const SOURCE_OPTIONS: { value: LeadSource | "all"; label: string }[] = [
  { value: "all", label: "Tutte le origini" },
  { value: "cliente", label: "Cliente (B2C)" },
  { value: "networker", label: "Networker" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface PageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    q?: string;
    page?: string;
  }>;
}

interface FetchParams {
  status?: LeadStatus;
  source?: LeadSource;
  query?: string;
  page: number;
}

async function fetchLeads(p: FetchParams): Promise<{ leads: Lead[]; total: number }> {
  const supabase = await createClient();
  let q = supabase.from("leads").select("*", { count: "exact" });

  if (p.status) q = q.eq("status", p.status);
  if (p.source) q = q.eq("source", p.source);
  if (p.query) {
    const like = `%${p.query}%`;
    q = q.or(`full_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
  }

  const from = (p.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await q
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("fetchLeads error:", error);
    return { leads: [], total: 0 };
  }
  return { leads: (data ?? []) as Lead[], total: count ?? 0 };
}

export default async function LeadsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusParam = params.status as LeadStatus | "all" | undefined;
  const sourceParam = params.source as LeadSource | "all" | undefined;
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const { leads, total } = await fetchLeads({
    status: statusParam && statusParam !== "all" ? statusParam : undefined,
    source: sourceParam && sourceParam !== "all" ? sourceParam : undefined,
    query: query || undefined,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters =
    (statusParam && statusParam !== "all") ||
    (sourceParam && sourceParam !== "all") ||
    Boolean(query);

  // Build CSV export URL preserving filters
  const exportParams = new URLSearchParams();
  if (statusParam && statusParam !== "all") exportParams.set("status", statusParam);
  if (sourceParam && sourceParam !== "all") exportParams.set("source", sourceParam);
  if (query) exportParams.set("q", query);
  const exportHref = `/admin/leads/export${exportParams.toString() ? `?${exportParams.toString()}` : ""}`;

  return (
    <>
      <header className="mb-5 sm:mb-6 flex flex-wrap items-start sm:items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-1.5">Gestione</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Lead
          </h1>
          <p className="text-[var(--color-text-dim)] mt-1 sm:mt-2 text-sm">
            {total} {total === 1 ? "risultato" : "risultati"}
            {hasFilters ? " con filtri" : " totali"}
          </p>
        </div>

        <a href={exportHref} className="btn btn-ghost text-sm" download>
          ⬇ CSV
        </a>
      </header>

      {/* Filters */}
      <form
        method="get"
        className="card mb-5 sm:mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label
            htmlFor="q"
            className="block text-xs uppercase tracking-widest mb-1 text-[var(--color-text-faint)]"
          >
            Cerca
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Nome, email, telefono..."
            className="input"
          />
        </div>
        <div>
          <label
            htmlFor="source"
            className="block text-xs uppercase tracking-widest mb-1 text-[var(--color-text-faint)]"
          >
            Origine
          </label>
          <select
            id="source"
            name="source"
            defaultValue={sourceParam ?? "all"}
            className="input"
          >
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-xs uppercase tracking-widest mb-1 text-[var(--color-text-faint)]"
          >
            Stato
          </label>
          <select
            id="status"
            name="status"
            defaultValue={statusParam ?? "all"}
            className="input"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary flex-1 md:flex-none">
            Filtra
          </button>
          <Link href="/admin/leads" className="btn btn-ghost flex-1 md:flex-none">
            Reset
          </Link>
        </div>
      </form>

      {/* Lista */}
      {leads.length === 0 ? (
        <div className="card text-center py-12 sm:py-16">
          <p className="text-[var(--color-text-dim)] text-sm sm:text-base">
            Nessun lead trovato.
            {hasFilters ? (
              <>
                <br />
                <Link
                  href="/admin/leads"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Rimuovi i filtri
                </Link>
              </>
            ) : null}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {leads.map((lead) => (
              <LeadCardMobile key={lead.id} lead={lead} />
            ))}
          </div>

          {/* Desktop: tabella */}
          <div className="hidden md:block card overflow-x-auto !p-0">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
                <tr>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Telefono</th>
                  <th className="text-left p-3">Origine</th>
                  <th className="text-left p-3">Stato</th>
                  <th className="text-left p-3">Score</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/3 transition">
                    <td className="p-3 whitespace-nowrap text-[var(--color-text-faint)]">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="p-3 font-semibold whitespace-nowrap">{lead.full_name}</td>
                    <td className="p-3 text-[var(--color-text-dim)]">{lead.email}</td>
                    <td className="p-3 text-[var(--color-text-dim)] whitespace-nowrap">
                      {lead.phone}
                    </td>
                    <td className="p-3">
                      <LeadSourceBadge source={lead.source} />
                    </td>
                    <td className="p-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="p-3">
                      <LeadScoreBadge score={lead.score} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-[var(--color-accent)] hover:underline text-xs whitespace-nowrap"
                      >
                        Apri →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between text-sm gap-3">
          <span className="text-[var(--color-text-faint)] text-xs sm:text-sm">
            Pag. {page} di {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                className="btn btn-ghost !px-3"
              >
                ←
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                className="btn btn-ghost !px-3"
              >
                →
              </Link>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
