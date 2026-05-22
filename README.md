# NOA × One Tribe — Piattaforma distributori

> Sito pubblico + pannello admin per lead generation, gestione clienti, recruiting
> collaboratori e (in arrivo) tracking provvigioni e rank.
>
> Stack: **Next.js 16 (App Router, TypeScript, Tailwind v4)** · **Supabase** (Postgres + Auth + RLS)
> · **Vercel** (hosting). Costo operativo: ~**0€/mese** sui free tier iniziali.

---

## 🌐 Stato deploy

- **Sito live (Vercel)**: `https://<tuo-progetto>.vercel.app` _(URL definitivo dopo il primo deploy)_
- **Repo GitHub**: <https://github.com/andreafabbri97/ale>
- **Supabase project**: <https://supabase.com/dashboard/project/fylljpfijhwiwapibpwd>

### Pagine pubbliche
| URL | Cosa fa |
|---|---|
| `/` | Home con doppio CTA (cliente / networker) |
| `/scopri` | Landing B2C — form lead per richiedere la guida |
| `/collabora` | Landing recruiting — form qualifica collaboratore + lead scoring |
| `/grazie` | Thank-you page post-submit |
| `/privacy` | Privacy, Cookie, Termini (placeholder, da sostituire con iubenda) |

### Pagine admin (in costruzione)
| URL | Cosa fa |
|---|---|
| `/admin/login` | Login admin/collaboratori |
| `/admin` | Dashboard con stats lead |
| `/admin/leads` | Lista lead con filtri |
| `/admin/leads/[id]` | Dettaglio lead, note, cambio stato |

---

## 📁 Struttura del progetto

```
ale/
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── scopri/, collabora/, grazie/, privacy/
│   │   ├── admin/                  ← in arrivo
│   │   └── actions/submit-lead.ts  ← Server Action condiviso form pubblici
│   ├── components/
│   │   ├── nav.tsx, footer.tsx
│   │   └── lead-form-client.tsx    ← form B2C + B2B con useActionState
│   └── lib/supabase/
│       ├── client.ts               ← browser Supabase client
│       ├── server.ts               ← server + admin (service_role) client
│       ├── middleware.ts           ← session refresh + auth gate /admin
│       └── types.ts                ← TypeScript types DB
├── supabase/
│   └── migrations/
│       ├── 0001_initial_schema.sql ← tabelle, enums, trigger, ranks seed
│       └── 0002_rls_policies.sql   ← Row Level Security multi-tenant
├── middleware.ts                   ← Next.js middleware root (chiama updateSession)
├── public/                         ← favicon, asset statici
├── archive/static-site/            ← vecchio sito statico (pre-Next.js)
├── copy/, setup/, automation/      ← documentazione strategica
├── .env.example                    ← template variabili ambiente (.env.local è gitignored)
└── package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs
```

---

## 🚀 Setup locale (per chi clona il repo)

### Prerequisiti
- Node.js 20+ (consigliato 22 LTS o superiore)
- Account [Supabase](https://supabase.com) (free tier)
- Account [Vercel](https://vercel.com) (free tier) per deploy

### Step
1. **Clone**:
   ```bash
   git clone https://github.com/andreafabbri97/ale.git
   cd ale
   npm install
   ```
2. **Variabili ambiente**: copia `.env.example` in `.env.local` e compila i 3 valori Supabase
   (URL + anon key + service_role key) presi da
   _Project Settings → API_ nella dashboard Supabase.
3. **Migrazioni DB** (solo prima volta): apri il [SQL Editor di Supabase](https://supabase.com/dashboard/project/fylljpfijhwiwapibpwd/sql/new),
   esegui in ordine:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
4. **Run dev server**:
   ```bash
   npm run dev    # http://localhost:3000
   ```
5. **Build di produzione (verifica typecheck)**:
   ```bash
   npm run build && npm run start
   ```

---

## 🔌 Deploy su Vercel (primo deploy)

1. Vai su <https://vercel.com/new> → Import dal repo GitHub `andreafabbri97/ale`
2. Framework preset: **Next.js** (auto-detect)
3. **Environment Variables** (copia da `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → `https://<tuo-progetto>.vercel.app` (aggiorna dopo il primo deploy)
4. Click **Deploy**. Aspetta ~2 minuti.
5. Ogni `git push` su `main` farà un nuovo deploy automatico.

---

## 🧪 Flusso lead end-to-end (come testarlo)

1. Apri `https://<sito>/scopri` (B2C) o `/collabora` (recruiting)
2. Compila il form (con email vera per test)
3. Submit → redirect a `/grazie?source=cliente|networker`
4. Verifica su Supabase → SQL Editor:
   ```sql
   select id, source, status, score, full_name, email, created_at
   from leads order by created_at desc limit 10;
   ```
5. Dovresti vedere il record con `score` calcolato automaticamente (per `networker`).

### Lead scoring automatico (`networker`)
Il trigger `leads_auto_assign` (in `0001_initial_schema.sql`) calcola lo `score` (A/B/C/D)
in base a: esperienza nel NM + tempo disponibile/sett + dimensione rete personale.

### Link affiliate (`?ref=`)
Quando un visitatore arriva da `/scopri?ref=nomecognome`, il `ref_code` viene catturato
nel form (campo hidden, popolato lato client dal `lead-form-client.tsx`). Al submit,
il trigger DB risolve il `ref_code` al `collaborator_id` corrispondente e assegna il lead
direttamente a quel collaboratore.

---

## 🔐 Sicurezza

- Tutte le route `/admin/*` sono protette dal middleware Next.js: senza session → redirect a `/admin/login`
- Row Level Security attivo su tutte le tabelle:
  - `leads`: insert pubblico OK (per i form), select/update solo se `assigned_to = auth.uid()` o `is_admin()`
  - `collaborators`: vedi solo te stesso, admin vede tutti
  - `sales`: vedi solo le tue, admin vede tutto
- `.env.local` è gitignored. **Non committare mai** la `service_role` key
- La `service_role` key bypassa RLS — usata solo nei Server Actions (lato server, non esposta al browser)

### Promozione primo admin
Dopo la prima signup di un utente, esegui questa query in Supabase SQL Editor:
```sql
update public.collaborators set is_admin = true where email = 'tuoemail@example.com';
```

---

## 🛠️ Comandi utili

```bash
npm run dev         # dev server con HMR su http://localhost:3000
npm run build       # production build + typecheck
npm run start       # avvia build di produzione
npm run lint        # ESLint
npm run typecheck   # solo TypeScript (no build)
```

---

## 📜 Licenza

MIT (vedi [LICENSE](LICENSE)).

I contenuti testuali relativi a NOA × One Tribe Academy (descrizioni prodotto, nomi educatori,
pricing) rimangono di proprietà di NOA Italy / One Tribe Academy e possono essere usati solo
da collaboratori autorizzati.
