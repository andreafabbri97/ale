/**
 * Tipi TypeScript per il database Supabase.
 *
 * Si possono auto-generare con: `npx supabase gen types typescript --project-id <id>`
 * Per ora li manteniamo manuali, allineati a `supabase/migrations/*.sql`.
 */

export type LeadSource = "cliente" | "networker";

export type LeadStatus =
  | "new"
  | "contattato"
  | "call_prenotata"
  | "call_fatta"
  | "offerta_inviata"
  | "won"
  | "lost";

export type LostReason =
  | "no_budget"
  | "no_interesse"
  | "timing"
  | "concorrente"
  | "freddo"
  | "altro";

export type InterestB2C =
  | "iniziare_zero"
  | "investire_risparmi"
  | "trading_attivo"
  | "ai_pro"
  | "generico";

export type EsperienzaNm = "anni" | "mesi" | "no_pronto" | "no_non_interessa";

export type TempoSettimanale = "meno_5" | "5_10" | "10_20" | "20_plus";

export type DimensioneRete = "grande" | "piccola" | "zero";

export type LeadScore = "A" | "B" | "C" | "D";

export type PackageType = "starter" | "pro" | "elite";

export type RankLevel =
  | "partner"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond";

export type InteractionType =
  | "call"
  | "whatsapp"
  | "email"
  | "note"
  | "meeting"
  | "status_change";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  source: LeadSource;
  status: LeadStatus;
  lost_reason: LostReason | null;
  full_name: string;
  email: string;
  phone: string;
  assigned_to: string | null;
  ref_code: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  page_origin: string | null;
  interesse_b2c: InterestB2C | null;
  eta: number | null;
  citta: string | null;
  esperienza_nm: EsperienzaNm | null;
  tempo_disponibile: TempoSettimanale | null;
  rete: DimensioneRete | null;
  motivazione: string | null;
  score: LeadScore | null;
  package_acquired: PackageType | null;
  acquired_at: string | null;
  privacy_accepted: boolean;
  marketing_accepted: boolean | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface Collaborator {
  id: string;
  email: string;
  full_name: string;
  ref_code: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
  rank: RankLevel;
  is_admin: boolean;
  is_active: boolean;
  sponsor_id: string | null;
  joined_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  lead_id: string;
  collaborator_id: string;
  type: InteractionType;
  content: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Sale {
  id: string;
  lead_id: string | null;
  collaborator_id: string;
  package: PackageType;
  amount_first: number;
  amount_recurring: number;
  commission_direct: number;
  customer_email: string;
  customer_name: string | null;
  sold_at: string;
  notes: string | null;
}

export interface Rank {
  level: RankLevel;
  display_name: string;
  required_personal_sales: number;
  required_team_volume: number;
  required_team_size: number;
  monthly_bonus: number;
  renewal_percentage: number;
  one_time_bonus: number;
  description: string | null;
}

export interface LeadStats {
  collaborator_id: string;
  collaborator_name: string;
  total_leads: number;
  new_leads: number;
  won_leads: number;
  lost_leads: number;
  client_leads: number;
  networker_leads: number;
  leads_last_30d: number;
  leads_last_7d: number;
}

/* ============================================================
 * Insert/Update payloads esportati per i Server Actions
 * ============================================================ */
export type LeadInsert = Partial<Lead> &
  Pick<Lead, "source" | "full_name" | "email" | "phone">;

export type LeadUpdate = Partial<Lead>;

export type CollaboratorInsert = Partial<Collaborator> &
  Pick<Collaborator, "id" | "email" | "full_name" | "ref_code">;

export type InteractionInsert = Partial<Interaction> &
  Pick<Interaction, "lead_id" | "collaborator_id" | "type">;

/* ============================================================
 * Database typing for Supabase generated client
 * (Subset minimo — basterà per queries tipate)
 * ============================================================ */
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Partial<Lead> &
          Pick<Lead, "source" | "full_name" | "email" | "phone">;
        Update: Partial<Lead>;
      };
      collaborators: {
        Row: Collaborator;
        Insert: Partial<Collaborator> &
          Pick<Collaborator, "id" | "email" | "full_name" | "ref_code">;
        Update: Partial<Collaborator>;
      };
      interactions: {
        Row: Interaction;
        Insert: Partial<Interaction> &
          Pick<Interaction, "lead_id" | "collaborator_id" | "type">;
        Update: Partial<Interaction>;
      };
      sales: {
        Row: Sale;
        Insert: Partial<Sale> &
          Pick<
            Sale,
            | "collaborator_id"
            | "package"
            | "amount_first"
            | "commission_direct"
            | "customer_email"
          >;
        Update: Partial<Sale>;
      };
      ranks: {
        Row: Rank;
        Insert: Rank;
        Update: Partial<Rank>;
      };
    };
    Views: {
      lead_stats: { Row: LeadStats };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
  };
}
