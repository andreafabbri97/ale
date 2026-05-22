# Workflow CRM — Stati e Automazioni

> Definisce **cosa succede automaticamente** in ogni momento del ciclo di vita di un contatto.

---

## Schema stati (pipeline)

```
                    ┌─────────┐
   FORM SUBMIT ──→  │   NEW    │
                    └────┬─────┘
                         │
                         ▼
                    ┌─────────┐         ┌─────────────┐
                    │ NURTURE  │ ─────→ │ EMAIL_OPEN   │
                    └────┬─────┘         └──────┬──────┘
                         │                       │
                         ▼                       ▼
                    ┌──────────────────────────────────┐
                    │       CALL_PRENOTATA              │
                    └────────────────┬─────────────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  ▼                  ▼                  ▼
            ┌───────────┐    ┌─────────────┐    ┌─────────────┐
            │CALL_FATTA  │    │CALL_NO_SHOW │    │  CANCELED   │
            └─────┬─────┘    └──────┬──────┘    └─────────────┘
                  │                  │
                  ▼                  ▼
          ┌───────────────┐   ┌──────────────┐
          │OFFERTA_INVIATA│   │ RECUPERO_NS  │ (mail+WA)
          └───────┬───────┘   └──────────────┘
                  │
        ┌─────────┼─────────┐
        ▼                   ▼
  ┌──────────┐        ┌──────────┐
  │CLOSED_WON │        │CLOSED_LOST│
  └──────────┘        └──────────┘
        │
        ▼
  ┌────────────────┐
  │ CLIENTE_ATTIVO │ → onboarding email → upsell tracking → retention
  └────────────────┘
```

---

## Workflow 1 — Lead nuovo da form B2C

**Trigger**: submit form `/scopri` 

**Azioni in sequenza**:

1. ✅ Crea contatto in CRM (se nuovo)
2. ✅ Applica tag `LEAD_CLIENTE` + `NEW` + tag interesse
3. ✅ Applica tag fonte (da UTM)
4. ✅ Applica tag collaboratore origine (da parametro `?ref=`)
5. ✅ Invia email A1 (welcome + guida) — vedi `email-sequences.md`
6. ✅ Aggiungi a sequenza "Nurturing Cliente B2C"
7. ✅ Crea task in CRM "Chiamare entro 24h" assegnata al collaboratore origine
8. ✅ (Se Zapier connesso) → notifica WhatsApp interno + invio a Google Sheet "Lead tracker"

---

## Workflow 2 — Lead nuovo da form B2B

**Trigger**: submit form `/collabora`

**Azioni in sequenza**:

1. ✅ Crea contatto
2. ✅ Applica tag `LEAD_NETWORKER` + `NEW`
3. ✅ Calcola lead score:
   ```
   SCORE = (esperienza_NM * 3) + (tempo_disponibile * 3) + (rete * 3)
   - esperienza: anni=3, mesi=2, no_pronto=1, no_interessa=-99 (escludi)
   - tempo: >20h=3, 10-20h=2, 5-10h=1, <5h=0
   - rete: grande=3, piccola=1, zero=0
   
   IF score >= 7: tag LEAD_SCORE_A
   IF 5-6: LEAD_SCORE_B
   IF 3-4: LEAD_SCORE_C
   IF <3: LEAD_SCORE_D
   ```
4. ✅ Applica tag dettaglio (esperienza, tempo, rete)
5. ✅ Invia email B1 (welcome + video pitch)
6. ✅ Aggiungi a sequenza "Nurturing Networker B2B"
7. ✅ **SE score = A o B** → notifica WhatsApp immediata al collaboratore senior + task "Chiamare entro 48h"
8. ✅ **SE score = C** → solo task ordinario "Valutare in 1 settimana"
9. ✅ **SE score = D** → nessuna call, lascia in nurturing email; eventualmente "freeze" il lead in CRM

---

## Workflow 3 — Apertura email

**Trigger**: lead apre 1+ email

**Azioni**:

1. ✅ Aggiungi tag `EMAIL_OPEN`
2. ✅ Aumenta "engagement score" interno (campo numerico custom)
3. Se engagement_score >= 3 (aperto 3 email) → notifica collaboratore: "Lead caldo, ricontattalo"

---

## Workflow 4 — Prenotazione call

**Trigger**: lead prenota su Cal.com (via webhook Cal.com → Systeme.io)

**Azioni**:

1. ✅ Aggiungi tag `CALL_PRENOTATA`
2. ✅ Rimuovi tag `NEW`
3. ✅ Pausa la sequenza nurturing (Systeme.io: "rimuovi da campagna")
4. ✅ Invia email conferma con link Zoom/Google Meet
5. ✅ Crea task collaboratore: "Call con [Nome] il [data/ora]"
6. ✅ Invia reminder automatici:
   - 24h prima: email + WhatsApp
   - 1h prima: WhatsApp
7. ✅ Aggiungi al calendario condiviso del team

---

## Workflow 5 — Call eseguita / no-show

### 5a. Call fatta — esito positivo (intenzione di comprare)

**Trigger manuale**: collaboratore segna "CALL_FATTA_POSITIVA"

**Azioni**:
1. Applica `CALL_FATTA` + `OFFERTA_INVIATA`
2. Rimuovi `CALL_PRENOTATA`
3. Invia email con riepilogo offerta + link checkout (se previsto)
4. Task follow-up a 48h

### 5b. Call fatta — esito negativo

**Azioni**:
1. Applica `CALL_FATTA` + `CLOSED_LOST` + sotto-tag (`LOST_NO_BUDGET`, etc.)
2. Aggiungi a sequenza "Lead Perso — re-engagement a 3 mesi"

### 5c. No-show

**Trigger**: ora call passata + nessuna conferma collaboratore

**Azioni**:
1. Applica `CALL_NO_SHOW`
2. Email D1 (vedi `email-sequences.md`) — invio immediato
3. Task collaboratore: "Tentativo recupero via WhatsApp"

---

## Workflow 6 — Cliente acquisito

**Trigger**: NOA notifica acquisto (webhook o inserimento manuale)

**Azioni**:

1. Rimuovi `LEAD_CLIENTE`, `OFFERTA_INVIATA`
2. Applica `CLIENTE_ATTIVO` + `PACCHETTO_[STARTER|PRO|ELITE]`
3. Invia email E1 (welcome cliente)
4. Aggiungi a sequenza "Onboarding cliente" (4-5 email distribuite nel primo mese)
5. **Calcola provvigione** in Google Sheet/Airtable "Vendite"
6. Crea record in tabella `Vendite` con tutti i dati
7. Notifica collaboratore origine: "Hai chiuso una vendita! +$X di provvigione"

---

## Workflow 7 — Re-engagement lead perso

**Trigger**: tag `CLOSED_LOST` da almeno **90 giorni**

**Azioni**:

1. Email re-engagement: "Quanto è cambiato in 3 mesi?"
2. Se apre → riapplica `EMAIL_OPEN` e sposta a sequenza retention
3. Se non apre per 14 giorni → tag `LOST_FREDDO_DEFINITIVO`, escludi da future comunicazioni

---

## Workflow 8 — Cliente in churn risk

**Trigger**: cliente attivo con 0 aperture email in 60 giorni

**Azioni**:

1. Email "Tutto ok? Hai sfruttato i nuovi strumenti?"
2. Notifica collaboratore: "Cliente [X] potrebbe disdire — chiama"
3. Crea task in CRM

---

## Workflow 9 — Avanzamento collaboratore (rank up)

**Trigger**: collaboratore raggiunge requisiti nuovo rank (verifica mensile)

**Azioni**:

1. Aggiorna tag `RANK_*` (rimuovi vecchio, aggiungi nuovo)
2. Invia email "Congratulazioni! Sei avanzato a [RANK]"
3. Bonus rank-up: aggiunge importo in foglio "Compensi collaboratori"
4. Pubblica annuncio nel canale Telegram/WhatsApp interno collaboratori

---

## Strumenti per realizzare i workflow

| Workflow | Possibile con Systeme.io free? | Note |
|---|---|---|
| 1, 2, 3, 6, 7 | ✅ Sì | Workflow standard |
| 4 (Cal.com webhook) | ⚠️ Parziale | Cal.com → Zapier free (100 ops/mese) → Systeme.io |
| 5 (manuale collaboratore) | ✅ Sì | Tag manuali via interfaccia |
| 8 (engagement score) | ⚠️ Limitato | Su free i custom fields sono base; su Startup ($27/mese) tutto OK |
| 9 (rank up automatico) | ❌ Non automatico | Verifica manuale mensile o foglio Airtable con formule |

---

## Vista CRM consigliata

Configura una **vista Kanban** in Systeme.io o in Airtable con queste colonne:

```
[NEW] [NURTURE] [CALL_PRENOTATA] [CALL_FATTA] [OFFERTA] [CLOSED_WON] [CLOSED_LOST]
```

Drag-and-drop dei card tra colonne = aggiornamento manuale rapido degli stati.

---

## Cosa non automatizzare (mai)

- **Prima call**: deve essere umana, vera, no bot
- **Risposta a obiezioni complesse**: vai sempre tu in voce
- **Onboarding tecnico cliente**: video registrato + persona di supporto disponibile
- **Comunicazione di problemi**: mai email automatica per cose serie (disdetta, rimborso, problema piattaforma)
