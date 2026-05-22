import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadStatus, LeadSource } from "@/lib/supabase/types";

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "contattato",
  "call_prenotata",
  "call_fatta",
  "offerta_inviata",
  "won",
  "lost",
];
const VALID_SOURCES: LeadSource[] = ["cliente", "networker"];

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function leadToCsvRow(lead: Lead): string {
  return [
    lead.id,
    lead.created_at,
    lead.source,
    lead.status,
    lead.lost_reason ?? "",
    lead.full_name,
    lead.email,
    lead.phone,
    lead.citta ?? "",
    lead.eta ?? "",
    lead.score ?? "",
    lead.interesse_b2c ?? "",
    lead.esperienza_nm ?? "",
    lead.tempo_disponibile ?? "",
    lead.rete ?? "",
    lead.motivazione ?? "",
    lead.page_origin ?? "",
    lead.ref_code ?? "",
    lead.utm_source ?? "",
    lead.utm_medium ?? "",
    lead.utm_campaign ?? "",
    lead.utm_content ?? "",
    lead.privacy_accepted ? "1" : "0",
    lead.marketing_accepted ? "1" : "0",
  ]
    .map(csvEscape)
    .join(",");
}

const CSV_HEADER = [
  "id",
  "created_at",
  "source",
  "status",
  "lost_reason",
  "full_name",
  "email",
  "phone",
  "citta",
  "eta",
  "score",
  "interesse_b2c",
  "esperienza_nm",
  "tempo_disponibile",
  "rete",
  "motivazione",
  "page_origin",
  "ref_code",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "privacy_accepted",
  "marketing_accepted",
].join(",");

export async function GET(request: NextRequest) {
  // Auth gate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Filter parsing
  const url = new URL(request.url);
  const statusParam = url.searchParams.get("status");
  const sourceParam = url.searchParams.get("source");
  const query = url.searchParams.get("q")?.trim();

  let q = supabase.from("leads").select("*");

  if (statusParam && (VALID_STATUSES as readonly string[]).includes(statusParam)) {
    q = q.eq("status", statusParam);
  }
  if (sourceParam && (VALID_SOURCES as readonly string[]).includes(sourceParam)) {
    q = q.eq("source", sourceParam);
  }
  if (query) {
    const like = `%${query}%`;
    q = q.or(`full_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
  }

  const { data, error } = await q.order("created_at", { ascending: false }).limit(10000);

  if (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const leads = (data ?? []) as Lead[];

  // BOM for Excel UTF-8 support
  const csv = "﻿" + CSV_HEADER + "\n" + leads.map(leadToCsvRow).join("\n");

  const today = new Date().toISOString().split("T")[0];
  const filename = `noa-leads-${today}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
