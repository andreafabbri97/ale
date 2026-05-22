# Setup Systeme.io — Guida passo-passo

> Tempo stimato: **2-3 ore** per essere operativi.

---

## STEP 1 — Creazione account

1. Vai su **https://systeme.io/it** (oppure systeme.io con lingua impostata su italiano)
2. Click "**Inizia gratis**"
3. Email: usa un'email **vera, professionale**, dedicata al progetto (es. `tuonome@gmail.com` o meglio `contatti@noa-tuonome.it` se compri il dominio)
4. Password: usa un password manager (1Password, Bitwarden free, anche browser va bene)
5. Conferma email
6. Salta il tutorial onboarding (lo facciamo qui in modo più focalizzato)

✅ **Verifica**: dovresti vedere la dashboard Systeme.io con menu a sinistra (Contatti, Funnels, Email, Automazioni, Affiliate, etc.)

---

## STEP 2 — Configurazione account

### 2.1 Impostazioni profilo
- Profilo → Inserire nome, foto, fuso orario Europa/Rome
- Lingua: italiano

### 2.2 Email mittente
- Email → Impostazioni → "Mittente predefinito"
- Nome: **"[Tuo Nome] da NOA"**
- Email: la stessa con cui ti sei registrato (oppure aggiungi un dominio personalizzato — vedi step 8)

### 2.3 Branding (facoltativo MVP)
- Profilo → Logo → carica logo NOA (chiedi a NOA il logo ufficiale per collaboratori)
- Footer email default: vedi sezione "Footer email" in fondo

---

## STEP 3 — Creazione tag base

Vai su **Contatti → Tag → "Crea nuovo tag"**.

Crea questi tag (li userai nei workflow):

**Tag di stato lead**
- `LEAD_CLIENTE`
- `LEAD_NETWORKER`
- `CLIENTE_ATTIVO`
- `NETWORKER_ATTIVO`
- `CALL_PRENOTATA`
- `CALL_FATTA`
- `CALL_NO_SHOW`
- `LOST_FREDDO`
- `LOST_NO_BUDGET`
- `LOST_NO_INTERESSE`

**Tag interesse cliente**
- `INTERESSE_STARTER`
- `INTERESSE_PRO`
- `INTERESSE_ELITE`
- `INTERESSE_GENERICO`

**Tag qualifica networker**
- `LEAD_SCORE_A` (≥7 punti)
- `LEAD_SCORE_B` (5-6)
- `LEAD_SCORE_C` (3-4)
- `LEAD_SCORE_D` (<3, basso)

**Tag fonte**
- `FONTE_DIRECT`
- `FONTE_GOOGLE`
- `FONTE_META`
- `FONTE_TIKTOK`
- `FONTE_INSTAGRAM`
- `FONTE_REFERRAL`
- `FONTE_AFFILIATE`

**Tag rank (per collaboratori — uso futuro)**
- `RANK_BRONZE`
- `RANK_SILVER`
- `RANK_GOLD`
- `RANK_PLATINUM`
- `RANK_DIAMOND`
(adatta in base ai nomi reali dei rank NOA)

---

## STEP 4 — Creazione Funnel #1: B2C "Scopri NOA"

### 4.1 Nuovo funnel
- Funnels → **"+ Crea funnel"**
- Tipo: "**Build my audience**" (lead capture)
- Nome funnel: `B2C - Scopri NOA`
- Currency: USD (per allinearsi al pricing NOA) o EUR (se preferisci mostrare EUR convertiti)

### 4.2 Step 1 — Squeeze page
- Template: scegli uno **dark theme** semplice (cerca "lead capture dark")
- Modifica la pagina inserendo il **copy** che trovi in `copy/landing-clienti.md`
- Form: aggiungi i campi
  - Nome (obbligatorio)
  - Email (obbligatorio)
  - Telefono (obbligatorio, con prefisso +39)
  - Custom field "interesse" (dropdown con 4 opzioni)
  - Checkbox privacy
- Bottone form: "RICEVI LA GUIDA GRATIS"

### 4.3 Step 2 — Thank-you page
- Template: una "thank you" semplice
- Testo: "Grazie! Tra pochi minuti riceverai la guida nella tua email. Nel frattempo, prenota una call gratuita di 30 min."
- Embed Cal.com (vedi step 6)

### 4.4 Configurazione form (sezione critica)
- Click sul form → tab "**Azioni dopo submit**"
- Aggiungi azioni:
  1. ✅ Applica tag `LEAD_CLIENTE`
  2. ✅ Applica tag in base al valore "interesse" (workflow condizionale)
  3. ✅ Aggiungi a campagna email "Nurturing Cliente B2C" (creato in step 5)
  4. ✅ Redirect alla thank-you page

### 4.5 URL slug
- Impostazioni funnel → URL: `/scopri`

---

## STEP 5 — Creazione Funnel #2: Recruiting "Collabora"

Stessi passi di sopra, ma:
- Nome funnel: `B2B - Collabora con NOA`
- URL slug: `/collabora`
- Template: scegli uno con form più strutturato (multi-step se possibile)
- Form: campi multipli (vedi `copy/landing-networker.md` per la lista completa)
- Azioni dopo submit:
  1. Applica tag `LEAD_NETWORKER`
  2. Calcola lead score (workflow condizionale — vedi step 7)
  3. Aggiungi a campagna "Nurturing Networker B2B"
  4. Notifica WhatsApp se score = A o B (richiede integrazione Zapier/Make free tier)

---

## STEP 6 — Sequenze email

### 6.1 Creazione campagna
- Email → **Campagne → "+ Crea campagna"**
- Nome: `Nurturing Cliente B2C`
- Tipo: **sequenza automatica**

### 6.2 Email della sequenza
Crea le 5 email seguendo `copy/email-sequences.md`:

| # | Soggetto | Delay |
|---|---|---|
| A1 | La tua guida è pronta (e una cosa importante) | Immediato |
| A2 | Il ciclo che intrappola il 95% delle persone | 1 giorno |
| A3 | Cosa è NOA (in 90 secondi) | 3 giorni |
| A4 | Starter, Pro, Elite — quale fa per te? | 5 giorni |
| A5 | L'ultimo email di questa serie | 7 giorni |

Per ogni email:
- Soggetto (da `email-sequences.md`)
- Pre-header: prima riga del corpo
- Corpo: copia-incolla da `email-sequences.md`
- Sostituisci `[LINK BOOKING]` con il vero link Cal.com
- Sostituisci `[TUO NOME]` con il tuo nome reale

### 6.3 Ripeti per Networker
- Nuova campagna: `Nurturing Networker B2B`
- 5 email da B1 a B5

---

## STEP 7 — Lead scoring automatico (Workflow)

- Vai su **Automazioni → "+ Crea workflow"**
- Nome: `Lead Score Networker`
- Trigger: "Tag aggiunto" → `LEAD_NETWORKER`
- Azioni condizionali (annidate):

```
SE custom_field "esperienza" = "Sì, da anni"
  AND custom_field "tempo" = ">20 ore"
  AND custom_field "rete" = "grande"
  → Aggiungi tag LEAD_SCORE_A
  → Invia email interna a TE: "Lead A in arrivo, chiamalo subito"
  → (Opzionale) Webhook Zapier → WhatsApp

ALTRIMENTI SE "esperienza" in [sì_mesi, sì_anni]
  AND "tempo" in [10-20, >20]
  → Aggiungi tag LEAD_SCORE_B
  → Invia email interna: "Lead B, chiamalo entro 48h"

ALTRIMENTI
  → Aggiungi tag LEAD_SCORE_C
```

**Nota Systeme.io free**: i workflow base sono inclusi, ma alcune condizioni complesse richiedono il piano Startup ($27/mese). Per il MVP usa logica semplice e affina dopo.

---

## STEP 8 — Dominio personalizzato

### Opzione A: Sottodominio Systeme.io (free, brutto)
- URL: `tuonome.systeme.io/scopri`
- ✅ Funziona subito, gratis
- ❌ Non professionale

### Opzione B: Dominio proprio (consigliato)
- Compra un dominio su **Cloudflare Registrar** (~10$/anno, più economico di GoDaddy)
  - Suggerimenti naming:
    - `noa-andrea.it` (semplice, personale)
    - `educazione-finanziaria-noa.com`
    - `formazione-finanziaria.it`
    - **Evita** nomi che usano "NOA" da solo o "guadagno", "ricchezza" — vincoli MLM italiani
- Punta DNS a Systeme.io (Settings → Custom Domains)
- Configura SSL (automatico)

### Opzione C: Acquisto dominio + Framer per la home
- Compra dominio (come sopra)
- Punta `www.tuodominio.it` su Framer (la home)
- Sottodomini su Systeme.io: `funnel.tuodominio.it/scopri`, `funnel.tuodominio.it/collabora`

---

## STEP 9 — Affiliate Program (per i tuoi collaboratori)

Systeme.io ha programma affiliate **built-in** anche su free tier (limitato).

- Vai su **Affiliate → Impostazioni**
- Crea un nuovo programma:
  - Nome: `NOA Distributori`
  - % commissione: lascia 0% (gestiremo provvigioni manualmente — non si vendono prodotti Systeme.io, è solo per tracking link)
  - Cookie duration: 90 giorni

- **Genera link affiliate** per ogni collaboratore:
  - URL: `tuodominio.it/scopri?ref=NOMECOGNOME`
  - Systeme.io traccia ogni click e ogni conversione attribuibile al collaboratore
  - Vedi report in tempo reale (lead generati, vendite, % conversione)

⚠️ **Limite free tier**: 0 commissioni automatiche calcolate (le calcoli tu in foglio Excel/Airtable). Per calcolo automatico serve piano Startup.

---

## STEP 10 — Integrazione Cal.com

### 10.1 Setup Cal.com
- Registrati su **https://cal.com** (free)
- Crea evento: "**Call conoscitiva NOA · 30 min**"
- Disponibilità: definisci slot (es. lun-ven 18:00-21:00)
- Buffer: 15 min tra una call e l'altra
- Domande aggiuntive prima della prenotazione (riprendi le domande del form se hanno saltato)

### 10.2 Embed in Systeme.io
- In Cal.com: "Embed" → copia HTML embed code
- In Systeme.io thank-you page: aggiungi blocco **Custom HTML** → incolla embed
- Verifica responsive mobile

---

## STEP 11 — Footer email obbligatorio

In **Email → Impostazioni → Footer predefinito**, inserisci:

```
---

[TUO NOME]
Collaboratore indipendente NOA × One Tribe Academy
WhatsApp: [tuo numero]
Sito: tuodominio.it

P.IVA: [se ne hai una]
Sede: [città]

---

I contenuti di questa email hanno scopo esclusivamente formativo
e non costituiscono consulenza finanziaria, raccomandazione di
investimento, sollecitazione al pubblico risparmio né attività
riservata ai sensi del TUF. Investire comporta rischi, anche
di perdita totale del capitale. Le performance passate non
garantiscono risultati futuri.

Hai ricevuto questa email perché ti sei iscritto alla nostra
lista. Se non vuoi più ricevere comunicazioni:
[Disiscriviti] [Aggiorna preferenze]
```

---

## STEP 12 — Test end-to-end (PRIMA di lanciare ads)

1. Apri la pagina `/scopri` in modalità incognito
2. Submit form con email vera
3. Verifica:
   - ✅ Tag applicati (in CRM controlla il tuo contatto test)
   - ✅ Email A1 ricevuta entro 5 min
   - ✅ Thank-you page caricata
   - ✅ Cal.com embed visibile e funzionante
4. Aspetta 24h → verifica arrivo email A2
5. Ripeti per `/collabora`
6. Test su mobile (Chrome mobile, Safari mobile)

✅ Solo dopo il test puoi lanciare traffico.

---

## STEP 13 — Privacy & GDPR

⚠️ **Obbligatorio in Italia**: 

- Crea pagina **Privacy Policy** (genera gratis su iubenda.com o privacypolicies.com)
- Crea pagina **Cookie Policy**
- Aggiungi link in footer di tutte le pagine
- Banner cookie su tutte le pagine (Systeme.io ha banner cookie built-in)
- Doppio opt-in raccomandato (utente conferma email prima di entrare in lista) — Systeme.io supporta

---

## Costi totali stack Systeme.io

| Voce | Costo |
|---|---|
| Systeme.io Free | 0€ |
| Cal.com Free | 0€ |
| Dominio Cloudflare | ~10€/anno |
| iubenda free / privacy generator | 0€ |
| **TOTALE** | **~1€/mese** |

Quando crescerai (>2.000 contatti, automazioni avanzate):
- Systeme.io Startup: $27/mese (5.000 contatti, automazioni complete)
- Systeme.io Webinar: $47/mese (10.000 contatti, A/B test)
