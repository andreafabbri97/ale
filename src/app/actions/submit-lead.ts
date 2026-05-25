"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { sendPushToAdmins } from "@/lib/push";
import type {
  LeadSource,
  LeadInsert,
  InterestB2C,
  EsperienzaNm,
  TempoSettimanale,
  DimensioneRete,
} from "@/lib/supabase/types";

const VALID_INTEREST_B2C: InterestB2C[] = [
  "iniziare_zero",
  "investire_risparmi",
  "trading_attivo",
  "ai_pro",
  "generico",
];

const VALID_ESPERIENZA: EsperienzaNm[] = [
  "anni",
  "mesi",
  "no_pronto",
  "no_non_interessa",
];

const VALID_TEMPO: TempoSettimanale[] = ["meno_5", "5_10", "10_20", "20_plus"];

const VALID_RETE: DimensioneRete[] = ["grande", "piccola", "zero"];

function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (typeof value !== "string") return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function asString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asInt(value: FormDataEntryValue | null): number | null {
  const s = asString(value);
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface SubmitResult {
  ok: boolean;
  error?: string;
}

/**
 * Server Action condiviso per il submit di lead da entrambi i form pubblici.
 * Inserisce un record in public.leads via service_role client (bypassa RLS).
 * I form pubblici devono poter scrivere senza autenticazione.
 */
export async function submitLead(formData: FormData): Promise<SubmitResult> {
  const source = asEnum<LeadSource>(formData.get("source"), [
    "cliente",
    "networker",
  ]);
  if (!source) {
    return { ok: false, error: "Source non valido." };
  }

  const fullName = asString(formData.get("full_name"));
  const email = asString(formData.get("email"));
  const phone = asString(formData.get("phone"));
  const notRobot = formData.get("not_robot") === "on";

  if (!fullName || !email) {
    return { ok: false, error: "Compila nome ed email." };
  }
  // Telefono obbligatorio su entrambi i form: ci serve per il ricontatto
  // WhatsApp (B2C) e per la call conoscitiva (B2B networker).
  if (!phone) {
    return { ok: false, error: "Inserisci un telefono / WhatsApp per il ricontatto." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Email non valida." };
  }
  if (!notRobot) {
    return { ok: false, error: "Conferma di non essere un robot." };
  }

  const refCode = asString(formData.get("ref_code"));
  const utmSource = asString(formData.get("utm_source"));
  const utmMedium = asString(formData.get("utm_medium"));
  const utmCampaign = asString(formData.get("utm_campaign"));
  const utmContent = asString(formData.get("utm_content"));
  const pageOrigin = asString(formData.get("page_origin"));

  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip");

  const baseInsert = {
    source,
    full_name: fullName.slice(0, 200),
    email: email.toLowerCase().slice(0, 200),
    phone: phone ? phone.slice(0, 50) : "",
    privacy_accepted: true,
    marketing_accepted: formData.get("marketing") === "on",
    ref_code: refCode,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    page_origin: pageOrigin,
    user_agent: userAgent,
    ip_address: ip ?? null,
  };

  // Campi specifici per source
  const sourceSpecific =
    source === "cliente"
      ? {
          interesse_b2c:
            asEnum<InterestB2C>(formData.get("interesse_b2c"), VALID_INTEREST_B2C) ??
            "generico",
        }
      : {
          eta: asInt(formData.get("eta")),
          citta: asString(formData.get("citta")),
          esperienza_nm: asEnum<EsperienzaNm>(
            formData.get("esperienza_nm"),
            VALID_ESPERIENZA,
          ),
          tempo_disponibile: asEnum<TempoSettimanale>(
            formData.get("tempo_disponibile"),
            VALID_TEMPO,
          ),
          rete: asEnum<DimensioneRete>(formData.get("rete"), VALID_RETE),
          motivazione: asString(formData.get("motivazione"))?.slice(0, 2000) ?? null,
        };

  let insertedLeadId: string | null = null;

  try {
    const supabase = createAdminClient();
    const payload: LeadInsert = { ...baseInsert, ...sourceSpecific };
    const { data, error } = await supabase
      .from("leads")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("Lead insert failed:", error);
      return {
        ok: false,
        error: "Errore durante l'invio. Riprova tra qualche istante.",
      };
    }

    const inserted = data as { id: string } | null;
    insertedLeadId = inserted?.id ?? null;
  } catch (err) {
    console.error("Lead submission error:", err);
    return {
      ok: false,
      error: "Errore di connessione. Riprova tra qualche istante.",
    };
  }

  // Push notification agli admin — VERA fire-and-forget per non bloccare il redirect.
  // Vercel Serverless mantiene la function alive finché la promise pending non risolve,
  // ma il client riceve la response (redirect) immediatamente.
  if (insertedLeadId) {
    const sourceLabel = source === "cliente" ? "Cliente B2C" : "Networker";
    const interestFromSource =
      sourceSpecific && "interesse_b2c" in sourceSpecific
        ? sourceSpecific.interesse_b2c
        : null;
    const bodyParts = [
      fullName.slice(0, 60),
      interestFromSource ? `Interesse: ${interestFromSource.replace(/_/g, " ")}` : null,
      refCode ? `ref: ${refCode}` : null,
    ].filter(Boolean);

    // Niente await: parte in parallelo al redirect
    sendPushToAdmins({
      title: `Nuovo lead — ${sourceLabel}`,
      body: bodyParts.join(" · "),
      url: `/admin/leads/${insertedLeadId}`,
      tag: `lead-${insertedLeadId}`,
    }).catch((pushErr) => {
      console.error("[push] notify on new lead failed:", pushErr);
    });
  }

  // Redirect a /grazie con info sul source per personalizzare il messaggio
  redirect(`/grazie?source=${source}`);
}
