-- =====================================================================
-- FIX: ricorsione infinita nelle policy RLS di public.collaborators
-- =====================================================================
-- Sintomo: query SELECT FROM collaborators fallivano con
--   ERROR 42P17: infinite recursion detected in policy for relation
--   "collaborators"
-- Conseguenza UI: nomi admin mostrati come "—" nei rank card
-- (e in ogni altra query che doveva risolvere collaborator_id → full_name).
--
-- Causa:
-- La policy `collaborators_select_sponsor_visible` conteneva una
-- sotto-query `SELECT FROM collaborators` direttamente nel predicate
-- USING. Quando il planner valuta la sotto-query applica nuovamente le
-- policy RLS sulla stessa tabella → loop.
--
-- Soluzione:
-- Estrarre la sotto-query in una funzione SECURITY DEFINER che bypassa
-- RLS (row_security = off), come già fatto per is_admin().
-- =====================================================================

-- Helper: sponsor_id dell'utente loggato, bypassando RLS
create or replace function public.my_sponsor_id()
returns uuid
language sql
stable
security definer
set row_security = off
set search_path = public
as $$
  select sponsor_id from public.collaborators where id = auth.uid() limit 1;
$$;

-- La funzione deve girare come postgres (BYPASSRLS) per saltare le policy
alter function public.my_sponsor_id() owner to postgres;

-- Ricrea la policy senza la sotto-query auto-referenziante
drop policy if exists collaborators_select_sponsor_visible on public.collaborators;

create policy collaborators_select_sponsor_visible
  on public.collaborators
  for select
  using (
    auth.uid() is not null
    and id = public.my_sponsor_id()
  );

-- =====================================================================
-- Hardening is_admin(): pin row_security=off + search_path (idempotente)
-- =====================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set row_security = off
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.collaborators where id = auth.uid()),
    false
  );
$$;

alter function public.is_admin() owner to postgres;
