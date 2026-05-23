-- =====================================================================
-- NOA × One Tribe — Web Push subscriptions
-- Run on Supabase SQL Editor
-- =====================================================================

create table if not exists public.push_subscriptions (
  id              uuid primary key default uuid_generate_v4(),
  collaborator_id uuid not null references public.collaborators(id) on delete cascade,
  endpoint        text not null unique,
  p256dh          text not null,
  auth            text not null,
  user_agent      text,
  created_at      timestamptz not null default now(),
  last_used_at    timestamptz
);

create index if not exists push_subscriptions_collaborator_id_idx
  on public.push_subscriptions(collaborator_id);

comment on table public.push_subscriptions is
  'Web Push subscriptions per collaboratore. Una collaborator può avere più sub (telefono + desktop).';

-- =====================================================================
-- RLS
-- =====================================================================

alter table public.push_subscriptions enable row level security;

-- SELECT: ogni utente vede solo le proprie subscriptions
create policy "push_subs_select_own"
  on public.push_subscriptions for select
  using (collaborator_id = auth.uid());

-- INSERT: ogni utente può registrare una nuova sub per sé stesso
create policy "push_subs_insert_own"
  on public.push_subscriptions for insert
  with check (collaborator_id = auth.uid());

-- DELETE: ogni utente può rimuovere le proprie sub
create policy "push_subs_delete_own"
  on public.push_subscriptions for delete
  using (collaborator_id = auth.uid());

-- Admin può fare tutto
create policy "push_subs_admin_all"
  on public.push_subscriptions for all
  using (public.is_admin())
  with check (public.is_admin());

-- Grant per anon: nessuno (gestiamo tutto da Server Actions con session)
grant select, insert, delete on public.push_subscriptions to authenticated;
