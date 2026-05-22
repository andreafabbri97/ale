# Setup Framer — Home page

> Tempo stimato: **1-2 ore** per una home pulita.

---

## STEP 1 — Account Framer

1. Vai su **https://framer.com**
2. Sign up con Google o email
3. Verifica email
4. Crea **nuovo workspace**: "NOA - [Tuo Nome]"
5. Piano: **Free** è sufficiente per MVP (limite: subdomain `.framer.website`, 1 progetto attivo)

✅ Verifica: vedi la dashboard Framer.

---

## STEP 2 — Template di partenza

Framer ha template gratuiti. Per il nostro caso:

1. New site → **Browse templates**
2. Filtri: **Landing Page** + **Dark**
3. Suggeriti (cerca uno di questi):
   - **"Atlas"** (free)
   - **"Linear"** (premium, ma versione free disponibile)
   - **"Ramble"** (clean dark)
   - **Qualsiasi template "SaaS dark"** funziona bene

4. Click "**Use Template**" → crea progetto "NOA Home"

✅ Sei dentro l'editor visuale.

---

## STEP 3 — Personalizzazione brand

### 3.1 Colori

Sostituisci la palette del template con quella NOA (dal PDF):

| Ruolo | Colore | Hex |
|---|---|---|
| Background primario | Nero quasi puro | `#0A0E1A` |
| Background secondario | Blu navy scuro | `#0A1F3D` |
| Accent primario | Azzurro brillante (testi key) | `#3BD4F8` |
| Accent secondario | Blu medio | `#2C7BE5` |
| Testi base | Bianco | `#FFFFFF` |
| Testi secondari | Grigio chiaro | `#A8B3CF` |
| Errori/avvisi | Rosso vivo (per stats) | `#E74C3C` |

**Come applicarli**:
- Top right: pannello **Colors** → modifica i 6 colori principali del template
- Sostituiscili uno per uno

### 3.2 Font

- **Primary**: `Manrope` o `Inter` (cerca nel font picker Framer — sono gratuiti, di Google)
- Weight: 800 per H1, 700 per H2-H3, 400 per body
- Letter spacing: -0.02em sui titoli grandi (più moderno)

### 3.3 Logo

- Se NOA non ti ha dato il logo: scaricalo da `noaitaly.io` (tasto destro → salva immagine)
- ⚠️ **Verifica con NOA** che hai il permesso di usarlo come collaboratore
- In Framer: Insert → Logo → carica il file
- Dimensioni consigliate: altezza 40-50px nella navbar

---

## STEP 4 — Costruzione sezioni

Apri `copy/home.md` e segui le 9 sezioni descritte lì.

### 4.1 Hero (sezione 1)
- Background: gradient nero → blu navy (Framer ha gradient editor visuale)
- H1: copia da `copy/home.md`
- 2 bottoni CTA:
  - Bottone 1: "VOGLIO IMPARARE" → link `/scopri` (URL del funnel Systeme.io)
  - Bottone 2: "VOGLIO COLLABORARE" → link `/collabora`
- Su mobile: bottoni stacked verticali (Framer responsive editor)

### 4.2 Stats (sezione 2 - Il Problema)
- 3 colonne con 3 stats (87%, 95%, 3%)
- Numero grande (font size 80-100px), label sotto
- Aggiungi animazione "count-up" (Framer Effects → Counter)

### 4.3 Ciclo visualizzato (sezione 3)
- Usa l'**Insert → Vector** per disegnare cerchio con frecce
- O più semplice: crea screenshot della slide dal PDF e inseriscila come immagine
- Suggerimento MVP: per stasera usa direttamente l'immagine ritagliata dalla slide PDF

### 4.4 Quadrante Cashflow (sezione 4)
- Crea Grid 2×2 in Framer
- 4 box con bordi, ciascuno con titolo + descrizione + % piccola in alto
- Sfondo bianco/grigio chiaro per evidenziare contro il nero

### 4.5 Cosa offre NOA (sezione 5)
- Grid 4 colonne × 2 righe = 8 voci
- Icone: usa Phosphor Icons o Lucide (Framer ha integrate gratis)
- Hover effect: leggero lift + glow azzurro

### 4.6 Educatori (sezione 6)
- Grid orizzontale 5-6 foto
- Foto rotonde, nome sotto, specializzazione in micro
- Per stasera: usa le foto del PDF (ritagliate). Per il finale, chiedi foto ufficiali a NOA.

### 4.7 CTA ripetuto (sezione 7)
- Stessi 2 bottoni hero

### 4.8 FAQ (sezione 8)
- Framer ha componente **Accordion** built-in
- Copia le 6 domande da `copy/home.md`

### 4.9 Footer (sezione 9)
- 4 colonne: Logo, Sitemap, Contatti, Social
- Disclaimer legale in fondo (testo piccolo, ma leggibile)

---

## STEP 5 — Responsive mobile

Framer mostra in alto 3 breakpoint: **Desktop / Tablet / Mobile**.

Per ogni sezione:
- Click sul breakpoint Mobile
- Verifica: testi non troppo grandi, bottoni full-width, padding ridotto
- I template ben fatti si adattano automaticamente — controlla solo che nulla "esca" dal viewport

Test reale: dopo pubblicazione, apri il sito sul tuo telefono. Punto.

---

## STEP 6 — SEO base

Per ogni pagina (anche se hai solo Home):
- **Settings → Pages → Meta**
- Title: "NOA Italia | Educazione Finanziaria Seria — [Tuo Nome]"
- Description: "Impara come funziona davvero il denaro con NOA × One Tribe Academy. Formazione, sessioni live con professionisti, software AI proprietari."
- OG Image: 1200×630px (crea una su Canva gratis con logo NOA + claim)

---

## STEP 7 — Performance check

Prima di pubblicare:
- Compress immagini: Framer fa già auto-compression, ma controlla che peso totale pagina sia <2.5MB
- Test su PageSpeed Insights di Google: punteggio target ≥85 su mobile

---

## STEP 8 — Pubblicazione

### 8.1 Subdomain Framer (free)
- Top right: **Publish**
- URL: `tuonome.framer.website`
- ✅ Online immediato
- ❌ URL non professionale

### 8.2 Dominio custom (consigliato)
- Settings → Domains → Custom Domain
- Inserisci `tuodominio.it`
- Framer ti dà i record DNS da impostare
- Vai sul tuo registrar (Cloudflare se hai seguito Systeme.io setup) → DNS → aggiungi i record
- Aspetta 10-30 minuti per propagazione
- Verifica HTTPS: Framer attiva automaticamente certificato SSL

⚠️ Custom domain su Framer richiede piano **Mini ($5/mese)** o superiore. Decidi se sforare il budget di pochi euro o restare sul subdomain.

---

## STEP 9 — Collegamento home ↔ funnel

Importante: la home deve linkare ai funnel Systeme.io.

**Scenario A**: tutto su stesso dominio (più professionale ma più complicato)
- Home Framer: `tuodominio.it`
- Funnel Systeme.io: `tuodominio.it/scopri` e `tuodominio.it/collabora`
- Per fare questo serve **Cloudflare Workers** o configurazione DNS avanzata — fattibile ma rischia 2-3 ore di setup
- **Alternativa più facile**: usa sottodomini
  - Home: `tuodominio.it`
  - Funnel: `app.tuodominio.it/scopri`

**Scenario B**: redirect "trasparenti"
- Su Framer non ti permette nativamente di "puntare" altri domini
- Soluzione MVP: il bottone "Voglio imparare" linka direttamente a `app.tuodominio.it/scopri` (sottodominio Systeme.io)
- Funziona, semplice, professionale.

**Per stasera (MVP)**: scenario B. Più avanti, se necessario, migrate a A.

---

## STEP 10 — Test finale

Apri in incognito, su desktop e mobile:
- [ ] Home carica veloce (<3s)
- [ ] Tutti i link funzionano
- [ ] Bottone "Voglio imparare" → apre `/scopri`
- [ ] Bottone "Voglio collaborare" → apre `/collabora`
- [ ] FAQ si aprono/chiudono
- [ ] Footer disclaimer visibile
- [ ] Su mobile: navbar leggibile, bottoni cliccabili (44×44px minimo)

---

## Costo stack Framer

| Voce | Costo |
|---|---|
| Framer Free (`.framer.website`) | 0€ |
| Framer Mini (custom domain) | $5/mese (opzionale) |
| Dominio (già contato in Systeme.io setup) | ~10€/anno |

---

## Risorse Framer utili

- **Template gratuiti**: framer.com/templates (filtra "Free")
- **Tutorial video ufficiali**: youtube.com/@framer
- **Component library**: framer.com/community (componenti drag-and-drop gratis)
- **Phosphor Icons**: framer.com/marketplace/plugins/phosphor-icons (icone gratis)
- **Confronto Framer vs Webflow**: Framer è più rapido per MVP, Webflow più potente per progetti grandi
