-- =====================================================================
-- NOA × One Tribe — Row Level Security policies
-- Run AFTER 0001_initial_schema.sql
-- =====================================================================

-- =====================================================================
-- ENABLE RLS on all tables
-- =====================================================================

alter table public.collaborators enable row level security;
alter table public.leads         enable row level security;
alter table public.interactions  enable row level security;
alter table public.sales         enable row level security;
alter table public.ranks         enable row level security;

-- =====================================================================
-- COLLABORATORS policies
-- =====================================================================

-- Vede il proprio profilo
create policy "collaborators_select_own"
  on public.collaborators for select
  using (id = auth.uid());

-- Admin vede tutti i collaboratori
create policy "collaborators_select_admin"
  on public.collaborators for select
  using (public.is_admin());

-- Tutti i collaboratori autenticati possono vedere lo sponsor (per riferimento upline)
create policy "collaborators_select_sponsor_visible"
  on public.collaborators for select
  using (
    auth.uid() is not null
    and id in (
      select sponsor_id from public.collaborators where id = auth.uid()
    )
  );

-- Il collaboratore può aggiornare solo il proprio profilo (no campi sensibili come is_admin, rank, sponsor_id)
create policy "collaborators_update_own"
  on public.collaborators for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    -- Non può cambiarsi i campi sensibili: lasciamo check granulare a livello applicativo
  );

-- Admin può aggiornare tutti
create policy "collaborators_update_admin"
  on public.collaborators for update
  using (public.is_admin())
  with check (public.is_admin());

-- Solo admin può inserire collaboratori manualmente (oltre al trigger handle_new_user)
create policy "collaborators_insert_admin"
  on public.collaborators for insert
  with check (public.is_admin());

-- Solo admin può cancellare
create policy "collaborators_delete_admin"
  on public.collaborators for delete
  using (public.is_admin());

-- =====================================================================
-- LEADS policies
-- =====================================================================

-- INSERT pubblico: chiunque può creare un lead via form (no auth required)
-- Importante per il funzionamento dei form pubblici!
create policy "leads_insert_public"
  on public.leads for insert
  with check (true);

-- SELECT: admin vede tutti i lead
create policy "leads_select_admin"
  on public.leads for select
  using (public.is_admin());

-- SELECT: collaboratore vede solo i lead a lui assegnati
create policy "leads_select_assigned"
  on public.leads for select
  using (assigned_to = auth.uid());

-- UPDATE: admin può modificare tutti
create policy "leads_update_admin"
  on public.leads for update
  using (public.is_admin())
  with check (public.is_admin());

-- UPDATE: collaboratore può modificare solo i lead a lui assegnati (cambio stato, note, ecc.)
create policy "leads_update_assigned"
  on public.leads for update
  using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

-- DELETE: solo admin
create policy "leads_delete_admin"
  on public.leads for delete
  using (public.is_admin());

-- =====================================================================
-- INTERACTIONS policies
-- =====================================================================

-- SELECT: vede le interactions sui lead che può vedere (admin: tutti; collaboratore: i suoi)
create policy "interactions_select_admin"
  on public.interactions for select
  using (public.is_admin());

create policy "interactions_select_own_leads"
  on public.interactions for select
  using (
    lead_id in (
      select id from public.leads where assigned_to = auth.uid()
    )
  );

-- INSERT: può aggiungere interaction solo sui lead che può vedere
create policy "interactions_insert_admin"
  on public.interactions for insert
  with check (public.is_admin() and collaborator_id = auth.uid());

create policy "interactions_insert_assigned"
  on public.interactions for insert
  with check (
    collaborator_id = auth.uid()
    and lead_id in (
      select id from public.leads where assigned_to = auth.uid()
    )
  );

-- UPDATE: solo chi ha creato l'interaction può modificarla (entro 24h, gestito a livello app se necessario)
create policy "interactions_update_own"
  on public.interactions for update
  using (collaborator_id = auth.uid())
  with check (collaborator_id = auth.uid());

-- DELETE: solo admin o chi ha creato
create policy "interactions_delete_admin"
  on public.interactions for delete
  using (public.is_admin());

create policy "interactions_delete_own"
  on public.interactions for delete
  using (collaborator_id = auth.uid());

-- =====================================================================
-- SALES policies
-- =====================================================================

-- SELECT: admin vede tutto; collaboratore vede solo le proprie vendite
create policy "sales_select_admin"
  on public.sales for select
  using (public.is_admin());

create policy "sales_select_own"
  on public.sales for select
  using (collaborator_id = auth.uid());

-- INSERT: admin può registrare vendita per chiunque
create policy "sales_insert_admin"
  on public.sales for insert
  with check (public.is_admin());

-- INSERT: collaboratore può registrare proprie vendite (workflow: si auto-dichiara, poi admin verifica)
create policy "sales_insert_own"
  on public.sales for insert
  with check (collaborator_id = auth.uid());

-- UPDATE: solo admin (per evitare manomissione provvigioni)
create policy "sales_update_admin"
  on public.sales for update
  using (public.is_admin())
  with check (public.is_admin());

-- DELETE: solo admin
create policy "sales_delete_admin"
  on public.sales for delete
  using (public.is_admin());

-- =====================================================================
-- RANKS policies
-- =====================================================================

-- SELECT: tutti gli utenti autenticati vedono i rank (per simulatore, dashboard, ecc.)
create policy "ranks_select_all_authenticated"
  on public.ranks for select
  using (auth.uid() is not null);

-- UPDATE/INSERT/DELETE: solo admin
create policy "ranks_modify_admin"
  on public.ranks for all
  using (public.is_admin())
  with check (public.is_admin());

-- =====================================================================
-- VIEW: lead_stats (security_invoker = false ⇒ usa privilegi del creatore)
-- Per sicurezza ricreiamo come security_invoker per rispettare RLS
-- =====================================================================

drop view if exists public.lead_stats;

create view public.lead_stats
with (security_invoker = true)
as
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

-- =====================================================================
-- GRANT permissions to anon and authenticated roles
-- =====================================================================

-- Anon role: può solo inserire leads (per form pubblici)
grant insert on public.leads to anon;
grant usage on schema public to anon;

-- Authenticated role: accesso completo (filtrato da RLS)
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
grant select on public.lead_stats to authenticated;

-- Reset di permessi di default per le future tabelle
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
