-- =====================================================================
-- Alead — Binary tree placements + monthly rank table
-- =====================================================================

-- ENUMS
create type placement_leg as enum ('LEFT', 'RIGHT');
create type placement_node_type as enum ('admin', 'customer');

-- =====================================================================
-- TABLE: placements (nodo dell'albero binario)
-- =====================================================================
create table public.placements (
  id                          uuid primary key default uuid_generate_v4(),

  -- Struttura albero
  parent_id                   uuid references public.placements(id) on delete restrict,
  leg                         placement_leg,  -- null per la root (Luigi)

  -- Identità nodo
  node_type                   placement_node_type not null,

  -- Se node_type = 'admin' → riferisce un collaborator
  collaborator_id             uuid references public.collaborators(id) on delete restrict,

  -- Se node_type = 'customer' → riferisce il lead originario + dati denormalizzati
  lead_id                     uuid references public.leads(id) on delete set null,
  customer_name               text,
  customer_email              text,

  -- Dati commerciali
  package                     package_type,                          -- starter / pro / elite
  points                      int not null default 0,                -- PV del pacchetto (99/450/990)
  sale_amount                 numeric(12,2),
  commission_immediate        numeric(12,2),                         -- $30/$150/$300 bonus

  -- Chi ha materialmente chiuso la vendita (riceve il bonus immediato)
  closed_by_collaborator_id   uuid references public.collaborators(id),

  placed_at                   timestamptz not null default now(),
  placed_by_collaborator_id   uuid references public.collaborators(id),
  notes                       text,

  -- Vincoli
  constraint placements_unique_position unique (parent_id, leg),
  constraint placements_root_no_leg check (
    (parent_id is null and leg is null) or
    (parent_id is not null and leg is not null)
  ),
  constraint placements_admin_or_customer check (
    (node_type = 'admin' and collaborator_id is not null) or
    (node_type = 'customer' and customer_name is not null)
  )
);

create index placements_parent_id_idx on public.placements(parent_id);
create index placements_collaborator_id_idx on public.placements(collaborator_id);
create index placements_lead_id_idx on public.placements(lead_id);
create index placements_closed_by_idx on public.placements(closed_by_collaborator_id);
create index placements_placed_at_idx on public.placements(placed_at desc);

comment on table public.placements is 'Nodi dell''albero binario MLM. Admin e clienti sono entrambi nodi.';

-- =====================================================================
-- TABLE: binary_ranks (15 livelli compenso mensile)
-- =====================================================================
create table public.binary_ranks (
  level               int primary key,                  -- 1..15
  bonus_amount        numeric(12,2) not null,           -- compenso mensile in $
  volume_required     int not null,                     -- PV totali (SX+DX richiesto)

  -- Requisiti per ramo: minimum N a SX AND N a DX di ciascun bundle
  bundle3_left        int not null default 0,           -- Elite richiesti a SX
  bundle3_right       int not null default 0,
  bundle2_left        int not null default 0,           -- Pro richiesti a SX
  bundle2_right       int not null default 0,
  bundle1_left        int not null default 0,           -- Starter richiesti a SX
  bundle1_right       int not null default 0,
  rinnovo_left        int not null default 0,           -- Rinnovi richiesti a SX
  rinnovo_right       int not null default 0,

  direct_sponsorships int not null default 0,           -- numero "Diretti"
  absorption_pct      int not null default 100,         -- % Assorbimento Linea Diretta
  display_name        text                              -- es. "Rank 1 — $500"
);

comment on table public.binary_ranks is
  'Tabella ufficiale dei 15 rank mensili. I requisiti X/Y sono per ramo (X a SX, Y a DX).';

-- =====================================================================
-- HELPER FUNCTIONS
-- =====================================================================

-- Somma PV di tutto il sottoalbero a partire da un nodo (incluso)
create or replace function public.get_subtree_points(root_node_id uuid)
returns int language sql stable as $$
  with recursive subtree as (
    select id, points from public.placements where id = root_node_id
    union all
    select p.id, p.points
    from public.placements p
    join subtree s on p.parent_id = s.id
  )
  select coalesce(sum(points), 0)::int from subtree;
$$;

-- PV di un ramo (LEFT/RIGHT) di un admin specifico
create or replace function public.get_admin_branch_points(
  admin_collaborator_id uuid,
  branch_leg placement_leg
) returns int language plpgsql stable as $$
declare
  admin_node_id uuid;
  branch_root_id uuid;
begin
  select id into admin_node_id
  from public.placements
  where collaborator_id = admin_collaborator_id and node_type = 'admin';

  if admin_node_id is null then return 0; end if;

  select id into branch_root_id
  from public.placements
  where parent_id = admin_node_id and leg = branch_leg;

  if branch_root_id is null then return 0; end if;

  return public.get_subtree_points(branch_root_id);
end;
$$;

-- Conta vendite per pacchetto in un ramo dell'admin
create or replace function public.get_admin_branch_package_count(
  admin_collaborator_id uuid,
  branch_leg placement_leg,
  pkg package_type
) returns int language plpgsql stable as $$
declare
  admin_node_id uuid;
  branch_root_id uuid;
  cnt int;
begin
  select id into admin_node_id
  from public.placements
  where collaborator_id = admin_collaborator_id and node_type = 'admin';
  if admin_node_id is null then return 0; end if;

  select id into branch_root_id
  from public.placements
  where parent_id = admin_node_id and leg = branch_leg;
  if branch_root_id is null then return 0; end if;

  with recursive subtree as (
    select id, package from public.placements where id = branch_root_id
    union all
    select p.id, p.package
    from public.placements p
    join subtree s on p.parent_id = s.id
  )
  select count(*)::int into cnt from subtree where package = pkg;

  return coalesce(cnt, 0);
end;
$$;

-- =====================================================================
-- SEED: i 3 admin nell'albero binario
-- Struttura attesa:
--   Luigi (root)
--   ├── LEFT: Enrico
--   │         ├── LEFT: vuoto
--   │         └── RIGHT: Andrea
--   │                   ├── LEFT: vuoto
--   │                   └── RIGHT: vuoto
--   └── RIGHT: vuoto
-- =====================================================================

do $$
declare
  v_luigi_id uuid;
  v_enrico_id uuid;
  v_andrea_id uuid;
  v_luigi_node_id uuid;
  v_enrico_node_id uuid;
begin
  -- Recupera gli ID dei 3 admin dalle email
  select id into v_luigi_id from public.collaborators where email = 'luigi.piccirillo1997@gmail.com';
  select id into v_enrico_id from public.collaborators where email = 'picciherry@gmail.com';
  select id into v_andrea_id from public.collaborators where email = 'andrea.fabbri2897@gmail.com';

  if v_luigi_id is null or v_enrico_id is null or v_andrea_id is null then
    raise exception 'Admin mancanti in collaborators. Esegui prima il seed admin.';
  end if;

  -- Luigi root
  insert into public.placements (parent_id, leg, node_type, collaborator_id)
  values (null, null, 'admin', v_luigi_id)
  on conflict do nothing
  returning id into v_luigi_node_id;

  if v_luigi_node_id is null then
    select id into v_luigi_node_id from public.placements where collaborator_id = v_luigi_id;
  end if;

  -- Enrico sotto Luigi (LEFT)
  insert into public.placements (parent_id, leg, node_type, collaborator_id)
  values (v_luigi_node_id, 'LEFT', 'admin', v_enrico_id)
  on conflict do nothing
  returning id into v_enrico_node_id;

  if v_enrico_node_id is null then
    select id into v_enrico_node_id from public.placements where collaborator_id = v_enrico_id;
  end if;

  -- Andrea sotto Enrico (RIGHT)
  insert into public.placements (parent_id, leg, node_type, collaborator_id)
  values (v_enrico_node_id, 'RIGHT', 'admin', v_andrea_id)
  on conflict do nothing;
end $$;

-- =====================================================================
-- SEED: 15 rank ufficiali (dalla tabella NOA)
-- =====================================================================

insert into public.binary_ranks (
  level, bonus_amount, volume_required,
  bundle3_left, bundle3_right,
  bundle2_left, bundle2_right,
  bundle1_left, bundle1_right,
  rinnovo_left, rinnovo_right,
  direct_sponsorships, absorption_pct,
  display_name
) values
  ( 1,     500,      1980,    1,    1,    2,    2,    10,    10,    10,    10,   2, 100, 'Rank 1'),
  ( 2,    1500,      7920,    4,    4,    8,    8,    40,    40,    40,    40,   3, 100, 'Rank 2'),
  ( 3,    3000,     14850,    7,    7,   15,   15,    75,    75,    75,    75,   3,  90, 'Rank 3'),
  ( 4,    5000,     39600,   20,   20,   40,   40,   200,   200,   200,   200,   4,  75, 'Rank 4'),
  ( 5,    9000,     74250,   37,   37,   75,   75,   375,   375,   375,   375,   6,  65, 'Rank 5'),
  ( 6,   15000,     99000,   50,   50,  100,  100,   500,   500,   500,   500,   7,  60, 'Rank 6'),
  ( 7,   25000,    198000,  100,  100,  200,  200,  1000,  1000,  1000,  1000,   8,  60, 'Rank 7'),
  ( 8,   50000,    396000,  200,  200,  400,  400,  2000,  2000,  2000,  2000,   9,  55, 'Rank 8'),
  ( 9,   75000,    594000,  300,  300,  600,  600,  3000,  3000,  3000,  3000,  10,  50, 'Rank 9'),
  (10,  100000,    891000,  450,  450,  900,  900,  4500,  4500,  4500,  4500,  11,  50, 'Rank 10'),
  (11,  250000,   1782000,  900,  900, 1800, 1800,  9000,  9000,  9000,  9000,  12,  45, 'Rank 11'),
  (12,  500000,   3564000, 1800, 1800, 3600, 3600, 18000, 18000, 18000, 18000,  13,  40, 'Rank 12'),
  (13,  750000,   7128000, 3600, 3600, 7200, 7200, 36000, 36000, 36000, 36000,  14,  40, 'Rank 13'),
  (14, 1000000,  14256000, 7200, 7200,14400,14400, 72000, 72000, 72000, 72000,  15,  40, 'Rank 14');

-- Note: la tabella PDF mostra 15 righe ma la prima è $500 → ho mappato come livelli 1..14.
-- Se serve un livello 15 aggiuntivo (es. >$1M) si aggiunge in futuro.

-- =====================================================================
-- RLS POLICIES
-- =====================================================================
alter table public.placements enable row level security;
alter table public.binary_ranks enable row level security;

-- placements: solo admin possono vedere/modificare
create policy "placements_admin_all"
  on public.placements for all
  using (public.is_admin())
  with check (public.is_admin());

-- binary_ranks: tutti gli autenticati leggono, solo admin modifica
create policy "binary_ranks_read_authenticated"
  on public.binary_ranks for select
  using (auth.uid() is not null);

create policy "binary_ranks_admin_write"
  on public.binary_ranks for all
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.placements to authenticated;
grant select on public.binary_ranks to authenticated;
grant insert, update, delete on public.binary_ranks to authenticated;
