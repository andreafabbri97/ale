-- =====================================================================
-- NOA × One Tribe — Initial database schema
-- Run this on Supabase SQL editor (https://app.supabase.com → SQL Editor)
-- =====================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- ENUMS
-- =====================================================================

create type lead_source as enum (
  'cliente',         -- Lead da landing /scopri (B2C)
  'networker'        -- Lead da landing /collabora (recruiting)
);

create type lead_status as enum (
  'new',             -- Appena ricevuto
  'contattato',      -- Contattato almeno una volta
  'call_prenotata',  -- Call fissata
  'call_fatta',      -- Call eseguita
  'offerta_inviata', -- Proposta commerciale inviata
  'won',             -- Diventato cliente / collaboratore
  'lost'             -- Perso (con motivo)
);

create type lost_reason as enum (
  'no_budget',
  'no_interesse',
  'timing',
  'concorrente',
  'freddo',          -- non risponde più
  'altro'
);

create type interest_b2c as enum (
  'iniziare_zero',
  'investire_risparmi',
  'trading_attivo',
  'ai_pro',
  'generico'
);

create type esperienza_nm as enum (
  'anni',
  'mesi',
  'no_pronto',
  'no_non_interessa'
);

create type tempo_settimanale as enum (
  'meno_5',
  '5_10',
  '10_20',
  '20_plus'
);

create type dimensione_rete as enum (
  'grande',          -- >1000 contatti
  'piccola',         -- 100-1000
  'zero'             -- 0-100
);

create type lead_score as enum ('A', 'B', 'C', 'D');

create type package_type as enum ('starter', 'pro', 'elite');

create type rank_level as enum (
  'partner',     -- Entry level
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond'
);

create type interaction_type as enum (
  'call',
  'whatsapp',
  'email',
  'note',
  'meeting',
  'status_change'
);

-- =====================================================================
-- TABLE: collaborators (extends auth.users)
-- =====================================================================

create table public.collaborators (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text unique not null,
  full_name       text not null,
  ref_code        text unique not null,                 -- es. "andrea-rossi" usato in ?ref=
  phone           text,
  city            text,
  bio             text,
  avatar_url      text,
  rank            rank_level not null default 'partner',
  is_admin        boolean not null default false,        -- admin globale (vede tutto)
  is_active       boolean not null default true,
  sponsor_id      uuid references public.collaborators(id), -- chi mi ha sponsorizzato
  joined_at       timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index collaborators_ref_code_idx on public.collaborators(ref_code);
create index collaborators_sponsor_id_idx on public.collaborators(sponsor_id);

comment on table public.collaborators is 'Collaboratori NOA: estende auth.users con info di profilo, ref code, rank e sponsor';
comment on column public.collaborators.ref_code is 'Codice univoco usato nei link affiliate (?ref=CODE)';
comment on column public.collaborators.is_admin is 'True = vede tutti i lead di tutti i collaboratori';

-- =====================================================================
-- TABLE: leads
-- =====================================================================

create table public.leads (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  source          lead_source not null,                -- cliente | networker
  status          lead_status not null default 'new',
  lost_reason     lost_reason,

  -- Contatti
  full_name       text not null,
  email           text not null,
  phone           text not null,

  -- Attribution
  assigned_to     uuid references public.collaborators(id), -- chi gestisce questo lead
  ref_code        text,                                -- ?ref=xxx (codice del collaboratore che ha portato il lead)
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  page_origin     text,                                -- '/scopri' o '/collabora'

  -- Campi B2C
  interesse_b2c   interest_b2c,

  -- Campi B2B/Networker
  eta             int,
  citta           text,
  esperienza_nm   esperienza_nm,
  tempo_disponibile tempo_settimanale,
  rete            dimensione_rete,
  motivazione     text,
  score           lead_score,                          -- calcolato server-side

  -- Conversione
  package_acquired package_type,                       -- popolato se status=won
  acquired_at     timestamptz,

  -- Privacy
  privacy_accepted boolean not null default false,
  marketing_accepted boolean default false,

  -- Tecnica
  ip_address      inet,
  user_agent      text
);

create index leads_status_idx on public.leads(status);
create index leads_source_idx on public.leads(source);
create index leads_assigned_to_idx on public.leads(assigned_to);
create index leads_ref_code_idx on public.leads(ref_code);
create index leads_created_at_idx on public.leads(created_at desc);
create index leads_email_idx on public.leads(email);

comment on table public.leads is 'Lead in entrata (clienti e candidati networker). Trigger automatici per assegnare a collaboratore in base a ref_code';
comment on column public.leads.assigned_to is 'Collaboratore proprietario. Default: derivato da ref_code';
comment on column public.leads.score is 'Calcolato server-side per lead networker (A/B/C/D)';

-- =====================================================================
-- TABLE: interactions (storico attività su un lead)
-- =====================================================================

create table public.interactions (
  id              uuid primary key default uuid_generate_v4(),
  lead_id         uuid not null references public.leads(id) on delete cascade,
  collaborator_id uuid not null references public.collaborators(id),
  type            interaction_type not null,
  content         text,                                -- contenuto nota / esito call
  metadata        jsonb,                               -- dati strutturati (es. {"from": "new", "to": "contattato"})
  created_at      timestamptz not null default now()
);

create index interactions_lead_id_idx on public.interactions(lead_id, created_at desc);
create index interactions_collaborator_id_idx on public.interactions(collaborator_id);

comment on table public.interactions is 'Timeline attività su ogni lead (call, note, cambi di stato)';

-- =====================================================================
-- TABLE: ranks (definizione rank con requisiti — placeholder NOA)
-- =====================================================================

create table public.ranks (
  level                   rank_level primary key,
  display_name            text not null,
  required_personal_sales int not null default 0,
  required_team_volume    numeric(12,2) not null default 0,
  required_team_size      int not null default 0,
  monthly_bonus           numeric(12,2) not null default 0,
  renewal_percentage      numeric(5,2) not null default 0,    -- % sui rinnovi
  one_time_bonus          numeric(12,2) not null default 0,   -- bonus rank-up
  description             text
);

-- Seed iniziale (placeholder — aggiornare con dati reali NOA)
insert into public.ranks (level, display_name, required_personal_sales, required_team_volume, required_team_size, monthly_bonus, renewal_percentage, one_time_bonus, description) values
  ('partner',  'Partner',  0,   0,      0,  0,    0,    0,   'Rank di partenza all''iscrizione'),
  ('bronze',   'Bronze',   3,   0,      0,  100,  10,   100, '3 vendite personali al mese'),
  ('silver',   'Silver',   5,   2000,   2,  300,  15,   500, '5 vendite + 2 collaboratori attivi'),
  ('gold',     'Gold',     8,   5000,   5,  800,  20,   1500, '8 vendite + team con fatturato 5K/mese'),
  ('platinum', 'Platinum', 10,  15000,  10, 2000, 25,   5000, '10 collaboratori Silver+ in team'),
  ('diamond',  'Diamond',  15,  50000,  25, 5000, 30,   15000, '25 collaboratori Gold+ in team');

comment on table public.ranks is 'Definizione dei rank NOA. Aggiornare con valori reali quando disponibili';

-- =====================================================================
-- TABLE: sales (vendite chiuse — per calcolo provvigioni e rank)
-- =====================================================================

create table public.sales (
  id                uuid primary key default uuid_generate_v4(),
  lead_id           uuid references public.leads(id),
  collaborator_id   uuid not null references public.collaborators(id),
  package           package_type not null,
  amount_first      numeric(12,2) not null,            -- primo mese (es. $159, $845, $1699)
  amount_recurring  numeric(12,2) not null default 152,-- rinnovo mensile
  commission_direct numeric(12,2) not null,            -- provvigione diretta che riceve il collaboratore
  customer_email    text not null,
  customer_name     text,
  sold_at           timestamptz not null default now(),
  notes             text
);

create index sales_collaborator_id_idx on public.sales(collaborator_id, sold_at desc);
create index sales_lead_id_idx on public.sales(lead_id);

comment on table public.sales is 'Vendite chiuse. Una vendita = una provvigione diretta + base per calcolo rank';

-- =====================================================================
-- VIEW: lead_stats (per dashboard)
-- =====================================================================

create view public.lead_stats as
select
  c.id as collaborator_id,
  c.full_name as collaborator_name,
  count(l.id) as total_leads,
  count(l.id) filter (where l.status = 'new') as new_leads,
  count(l.id) filter (where l.status = 'won') as won_leads,
  count(l.id) filter (where l.status = 'lost') as lost_leads,
  count(l.id) filter (where l.source = 'cliente') as client_leads,
  count(l.id) filter (where l.source = 'networker') as networker_leads,
  count(l.id) filter (where l.created_at >= now() - interval '30 days') as leads_last_30d,
  count(l.id) filter (where l.created_at >= now() - interval '7 days') as leads_last_7d
from public.collaborators c
left join public.leads l on l.assigned_to = c.id
group by c.id, c.full_name;

comment on view public.lead_stats is 'Vista aggregata per dashboard: numeri lead per collaboratore';

-- =====================================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================================

-- Trigger: aggiorna updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

create trigger collaborators_updated_at
  before update on public.collaborators
  for each row execute function public.handle_updated_at();

-- Trigger: assegna automaticamente lead al collaboratore dato il ref_code
create or replace function public.auto_assign_lead()
returns trigger language plpgsql security definer as $$
declare
  matched_collaborator uuid;
begin
  -- Se non c'è assigned_to ma c'è ref_code, prova a matchare
  if new.assigned_to is null and new.ref_code is not null then
    select id into matched_collaborator
    from public.collaborators
    where lower(ref_code) = lower(new.ref_code) and is_active = true
    limit 1;

    if matched_collaborator is not null then
      new.assigned_to = matched_collaborator;
    end if;
  end if;

  -- Calcolo score per lead networker
  if new.source = 'networker' and new.score is null then
    new.score = public.calc_lead_score(
      new.esperienza_nm,
      new.tempo_disponibile,
      new.rete
    );
  end if;

  return new;
end;
$$;

create trigger leads_auto_assign
  before insert on public.leads
  for each row execute function public.auto_assign_lead();

-- Function: calcolo lead score per networker
create or replace function public.calc_lead_score(
  esp esperienza_nm,
  tempo tempo_settimanale,
  rete dimensione_rete
) returns lead_score language plpgsql immutable as $$
declare
  score int := 0;
begin
  -- Esperienza
  score := score + case esp
    when 'anni' then 3
    when 'mesi' then 2
    when 'no_pronto' then 1
    when 'no_non_interessa' then -99
    else 0
  end;

  -- Tempo
  score := score + case tempo
    when '20_plus' then 3
    when '10_20' then 2
    when '5_10' then 1
    else 0
  end;

  -- Rete
  score := score + case rete
    when 'grande' then 3
    when 'piccola' then 1
    else 0
  end;

  if score < -50 then return 'D'; end if;
  if score >= 7 then return 'A'; end if;
  if score >= 5 then return 'B'; end if;
  if score >= 3 then return 'C'; end if;
  return 'D';
end;
$$;

-- Function: crea automaticamente profilo collaborator quando si registra un nuovo utente
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.collaborators (id, email, full_name, ref_code)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(
      new.raw_user_meta_data->>'ref_code',
      lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]+', '-', 'g'))
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- HELPER FUNCTIONS for RLS
-- =====================================================================

-- Returns true se l'utente corrente è admin
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select coalesce(
    (select is_admin from public.collaborators where id = auth.uid()),
    false
  );
$$;

-- =====================================================================
-- COMPLETION
-- =====================================================================

-- Crea il primo super-admin manualmente DOPO il signup:
-- update public.collaborators set is_admin = true where email = 'tuoemail@example.com';

comment on schema public is 'NOA × One Tribe — schema gestione lead, collaboratori, rank, vendite';
