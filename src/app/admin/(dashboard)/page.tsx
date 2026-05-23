import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LeadStatusBadge, LeadSourceBadge } from "@/components/admin/badges";
import { LeadCardMobile } from "@/components/admin/lead-card-mobile";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import type { Lead } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

interface StatBucket {
  total: number;
  last30d: number;
  last7d: number;
}

function emptyBucket(): StatBucket {
  return { total: 0, last30d: 0, last7d: 0 };
}

interface DashboardData {
  total: StatBucket;
  cliente: StatBucket;
  networker: StatBucket;
  byStatus: Record<string, number>;
  latest: Lead[];
}

async function fetchDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  // Select solo i campi che ci servono per stats + ultimi 10 lead
  // (evita di trasferire campi grossi come motivazione, user_agent, ecc.)
  const { data: leads, error } = await supabase
    .from("leads")
    .select(
      "id, created_at, source, status, full_name, email, phone, score",
    )
    .order("created_at", { ascending: false });

  if (error || !leads) {
    return {
      total: emptyBucket(),
      cliente: emptyBucket(),
      networker: emptyBucket(),
      byStatus: {},
      latest: [],
    };
  }

  const now = Date.now();
  const D30 = 30 * 24 * 60 * 60 * 1000;
  const D7 = 7 * 24 * 60 * 60 * 1000;

  const data: DashboardData = {
    total: emptyBucket(),
    cliente: emptyBucket(),
    networker: emptyBucket(),
    byStatus: {},
    latest: leads.slice(0, 10) as Lead[],
  };

  for (const lead of leads as Lead[]) {
    const ts = new Date(lead.created_at).getTime();
    const isLast30d = now - ts <= D30;
    const isLast7d = now - ts <= D7;

    data.total.total += 1;
    if (isLast30d) data.total.last30d += 1;
    if (isLast7d) data.total.last7d += 1;

    const bucket = lead.source === "cliente" ? data.cliente : data.networker;
    bucket.total += 1;
    if (isLast30d) bucket.last30d += 1;
    if (isLast7d) bucket.last7d += 1;

    data.byStatus[lead.status] = (data.byStatus[lead.status] ?? 0) + 1;
  }

  return data;
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}) {
  // Se il valore è numerico, animiamo con CountUp; altrimenti rendiamo "as is"
  const numericValue = typeof value === "number" ? value : null;

  return (
    <div
      className={`card card-hover !p-4 sm:!p-6 ${
        accent ? "border-[var(--color-accent)]/40" : ""
      }`}
    >
      <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-text-faint)] mb-1 sm:mb-2">
        {label}
      </div>
      <div className="text-2xl sm:text-4xl font-extrabold tracking-tight">
        {numericValue !== null ? (
          <CountUp to={numericValue} duration={1200} />
        ) : (
          value
        )}
      </div>
      {sub && (
        <div className="text-[11px] sm:text-xs text-[var(--color-text-dim)] mt-1">{sub}</div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const data = await fetchDashboardData();

  const statusOrder = [
    "new",
    "contattato",
    "call_prenotata",
    "call_fatta",
    "offerta_inviata",
    "won",
    "lost",
  ] as const;

  return (
    <>
      <header className="mb-6 sm:mb-8 animate-fade-up">
        <p className="eyebrow mb-2">Pannello amministrazione</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-dim)] mt-2 text-sm sm:text-base">
          Una panoramica sui lead generati dal sito.
        </p>
      </header>

      {/* Stats: 2 cols su mobile, 4 su lg */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 animate-fade-up delay-1">
        <StatCard
          label="Totale lead"
          value={data.total.total}
          sub={`${data.total.last7d} ultimi 7gg`}
          accent
        />
        <StatCard
          label="Clienti (B2C)"
          value={data.cliente.total}
          sub={`${data.cliente.last7d} ultimi 7gg`}
        />
        <StatCard
          label="Networker"
          value={data.networker.total}
          sub={`${data.networker.last7d} ultimi 7gg`}
        />
        <StatCard
          label="Won"
          value={data.byStatus["won"] ?? 0}
          sub={
            data.total.total
              ? `${(((data.byStatus["won"] ?? 0) / data.total.total) * 100).toFixed(1)}% conversion`
              : "—"
          }
        />
      </section>

      {/* Status pipeline: 2 cols mobile, 7 desktop, con scroll orizzontale se serve */}
      <section className="mb-8 sm:mb-10">
        <Reveal as="h2" className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          Pipeline per stato
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {statusOrder.map((status, i) => (
            <Reveal
              key={status}
              stagger={((i % 7) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7}
              className="card card-hover text-center !py-3 sm:!py-4 !px-2"
            >
              <div className="text-xl sm:text-2xl font-extrabold">
                <CountUp to={data.byStatus[status] ?? 0} duration={900} />
              </div>
              <div className="mt-1.5 sm:mt-2">
                <LeadStatusBadge status={status} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Latest leads — tabella su md+, cards su mobile */}
      <section>
        <Reveal className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Ultimi 10 lead</h2>
          <Link
            href="/admin/leads"
            className="text-sm text-[var(--color-accent)] link-underline"
          >
            Vedi tutti →
          </Link>
        </Reveal>

        {data.latest.length === 0 ? (
          <div className="card text-center py-12 sm:py-16">
            <p className="text-[var(--color-text-dim)] text-sm sm:text-base">
              Nessun lead ancora. Quando arriverà un submit dai form pubblici,
              <br className="hidden sm:inline" /> lo vedrai qui in tempo reale.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-3">
              {data.latest.map((lead, i) => (
                <Reveal
                  key={lead.id}
                  stagger={((i % 8) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
                >
                  <LeadCardMobile lead={lead} />
                </Reveal>
              ))}
            </div>

            {/* Desktop: tabella */}
            <div className="hidden md:block card overflow-x-auto !p-0 animate-fade-up delay-2">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
                  <tr>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Nome</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Source</th>
                    <th className="text-left p-3">Stato</th>
                    <th className="p-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {data.latest.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[rgba(59,212,248,0.04)] transition-colors duration-200"
                    >
                      <td className="p-3 whitespace-nowrap text-[var(--color-text-faint)]">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="p-3 font-semibold">{lead.full_name}</td>
                      <td className="p-3 text-[var(--color-text-dim)]">{lead.email}</td>
                      <td className="p-3">
                        <LeadSourceBadge source={lead.source} />
                      </td>
                      <td className="p-3">
                        <LeadStatusBadge status={lead.status} />
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-[var(--color-accent)] hover:underline text-xs"
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
      </section>
    </>
  );
}
