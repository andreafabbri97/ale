# Tag System & Segmentazione

> Regola d'oro: ogni contatto deve avere almeno **3 tag** che lo descrivono in modo univoco: chi è, da dove arriva, in che stato.

---

## Architettura tag

### 1. Tag IDENTITÀ (cosa è)
Mutuamente esclusivi (un contatto ne ha **uno solo**):
- `LEAD_CLIENTE` — interessato ai corsi NOA
- `LEAD_NETWORKER` — interessato a diventare collaboratore
- `CLIENTE_ATTIVO` — ha acquistato e usa NOA
- `COLLABORATORE_ATTIVO` — è un networker nella nostra downline
- `EX_CLIENTE` — ha disdetto
- `EX_COLLABORATORE` — ha cessato attività

### 2. Tag STATO (a che punto è nel funnel)
Mutuamente esclusivi:
- `NEW` — appena entrato
- `EMAIL_OPEN` — ha aperto almeno 1 email
- `CALL_PRENOTATA` — ha prenotato call
- `CALL_FATTA` — call eseguita
- `CALL_NO_SHOW` — non si è presentato
- `OFFERTA_INVIATA` — gli abbiamo mandato proposta
- `CLOSED_WON` — ha acquistato (passa a `CLIENTE_ATTIVO`)
- `CLOSED_LOST` — non ha acquistato (con sotto-categoria sotto)

### 3. Tag PERDITA (perché ha detto no — solo se `CLOSED_LOST`)
- `LOST_FREDDO` — non risponde più
- `LOST_NO_BUDGET` — non se lo può permettere
- `LOST_NO_INTERESSE` — non gli interessa
- `LOST_CONCORRENTE` — è andato altrove
- `LOST_TIMING` — non era il momento giusto, riprovare dopo X mesi

### 4. Tag INTERESSE / PROFILO

**Cliente B2C** (uno per contatto):
- `INTERESSE_STARTER` — vuole partire da zero
- `INTERESSE_INVESTIRE_RISPARMI` — ha risparmi da investire
- `INTERESSE_TRADING_ATTIVO` — vuole imparare trading
- `INTERESSE_AI_TOOLS` — interessato a strumenti professionali
- `INTERESSE_GENERICO` — non specificato

**Networker B2B** (multipli possibili):
- `NETWORKER_ESPERIENZA_ALTA` — già networker da anni
- `NETWORKER_ESPERIENZA_MEDIA` — qualche mese
- `NETWORKER_ESPERIENZA_ZERO_PRONTO` — no esperienza ma pronto
- `NETWORKER_RETE_GRANDE` — ha audience >1000
- `NETWORKER_RETE_PICCOLA` — 100-1000
- `NETWORKER_RETE_ZERO` — parte da zero
- `NETWORKER_TEMPO_FULLTIME` — >20h/sett
- `NETWORKER_TEMPO_PARTTIME` — 10-20h/sett
- `NETWORKER_TEMPO_LIMITATO` — <10h/sett

### 5. Tag SCORE
- `LEAD_SCORE_A` — alta priorità (chiamare entro 24h)
- `LEAD_SCORE_B` — buona qualità (chiamare entro 48h)
- `LEAD_SCORE_C` — media qualità (lascia maturare nel nurturing)
- `LEAD_SCORE_D` — bassa qualità (no call diretta, solo email)

### 6. Tag FONTE (come ci ha trovati)
Mutuamente esclusivi:
- `FONTE_DIRECT` — ha digitato URL direttamente
- `FONTE_GOOGLE_ORGANIC` — da ricerca Google
- `FONTE_GOOGLE_ADS` — da pubblicità Google
- `FONTE_META_ADS` — da pubblicità Facebook/Instagram
- `FONTE_META_ORGANIC` — da post organico
- `FONTE_TIKTOK_ADS`
- `FONTE_TIKTOK_ORGANIC`
- `FONTE_YOUTUBE`
- `FONTE_LINKEDIN`
- `FONTE_REFERRAL_AMICO` — passaparola
- `FONTE_REFERRAL_COLLABORATORE` (con sotto-tag `REF_NOMECOGNOME`)

### 7. Tag COLLABORATORE-ORIGINE (chi ha portato il lead)
Per tracciare provvigioni:
- `COLLAB_ANDREA_ROSSI`
- `COLLAB_MARIA_BIANCHI`
- ...uno per ogni collaboratore. **Formato**: `COLLAB_NOME_COGNOME` in maiuscolo, senza accenti, snake_case.

---

## Esempio contatto completamente taggato

**Esempio**: Mario Rossi, 35 anni, arrivato da Instagram tramite link di Andrea Rossi.

Tag applicati:
- `LEAD_CLIENTE` (identità)
- `CALL_PRENOTATA` (stato)
- `INTERESSE_INVESTIRE_RISPARMI` (interesse)
- `LEAD_SCORE_B` (score)
- `FONTE_META_ORGANIC` (fonte)
- `REF_ANDREA_ROSSI` (collaboratore origine)
- `COLLAB_ANDREA_ROSSI` (alias)

Dopo la call → si aggiunge `CALL_FATTA`, si rimuove `CALL_PRENOTATA`.
Se acquista → si aggiunge `CLOSED_WON` → si rimuove `LEAD_CLIENTE`, si aggiunge `CLIENTE_ATTIVO`, `PACCHETTO_PRO` (o quello che ha comprato).

---

## Tag che si "consumano" automaticamente

Workflow Systeme.io che mantengono i tag puliti:

1. Quando aggiungo `CALL_FATTA` → rimuovi automatico `CALL_PRENOTATA`
2. Quando aggiungo `CLOSED_WON` → rimuovi `LEAD_CLIENTE` e `LEAD_NETWORKER`, aggiungi `CLIENTE_ATTIVO`
3. Quando aggiungo `EX_CLIENTE` → rimuovi `CLIENTE_ATTIVO`
4. Quando arriva un lead → tag automatici `NEW` + `LEAD_CLIENTE/NETWORKER` + fonte (da UTM)

---

## Convenzioni naming tag

- **SCREAMING_SNAKE_CASE** sempre (es. `LEAD_CLIENTE`, non `Lead Cliente` o `lead-cliente`)
- Prefissi per raggruppare (es. tutti i `FONTE_*` insieme)
- Italiano, no inglese mischiato (`COLLABORATORE_ATTIVO`, non `ACTIVE_PARTNER`)
- Brevi ma descrittivi (`LOST_FREDDO` non `LEAD_LOST_BECAUSE_GHOSTED`)

---

## Segmenti pronti da usare

In Systeme.io puoi creare **segmenti dinamici** (liste basate su combinazioni di tag):

| Segmento | Logica | Uso |
|---|---|---|
| **Hot lead clienti** | `LEAD_CLIENTE` + `LEAD_SCORE_A` + `NEW` | Chiamare oggi |
| **Cold cliente da riattivare** | `LEAD_CLIENTE` + (nessuna apertura email da 30 gg) | Sequenza re-engagement |
| **Networker da chiamare** | `LEAD_NETWORKER` + (`LEAD_SCORE_A` o `LEAD_SCORE_B`) | Priorità call |
| **Clienti soddisfatti** | `CLIENTE_ATTIVO` da >6 mesi | Chiedere testimonianza |
| **Per upsell Pro→Elite** | `CLIENTE_ATTIVO` + `PACCHETTO_PRO` da >3 mesi | Email proposta upgrade |
| **Cliente prossimo al churn** | `CLIENTE_ATTIVO` + `EMAIL_OPEN` da >60 gg falso | Email retention |
