# Sistema Compensi + Rank — Framework

> Questo file è il **template** dove inserire i numeri reali NOA appena li hai a disposizione.
> Per il MVP useremo placeholder. Quando avrai i numeri reali, sostituisci i `[X]` e i `[NOME RANK]`.

---

## 1. Modello di compenso (riepilogo)

Il guadagno del collaboratore NOA si compone di **3 leve**:

```
GUADAGNO TOTALE = 
   (a) Provvigione diretta sulla vendita   ← fissa per pacchetto
 + (b) Bonus rank                           ← % aggiuntiva in base al rank
 + (c) Provvigioni sui rinnovi              ← residuale mensile su $152/cliente attivo
```

---

## 2. Provvigioni dirette (componente fissa)

Per ogni vendita personale di un pacchetto NOA, il collaboratore riceve un importo fisso.

| Pacchetto | Prezzo primo mese | Prezzo rinnovo | **Provvigione diretta** |
|---|---|---|---|
| **STARTER** | $159 (o $195) | $152 | `$[X1]` |
| **PRO** | $845 (o $1.030) | $152 | `$[X2]` |
| **ELITE** | $1.699 (o $2.072) | $152 | `$[X3]` |

> ⚠️ **Da compilare**: chiedere a NOA gli importi esatti delle 3 provvigioni dirette.
> Suggerimento: probabilmente ~30-40% del prezzo del pacchetto, ma confermare.

**Esempio compilato (placeholder)**:
- Starter: $50 di provvigione diretta
- Pro: $250 di provvigione diretta
- Elite: $500 di provvigione diretta

---

## 3. Sistema a Rank

Il rank cresce in base ai risultati personali e di team. Ogni rank sblocca:
- Bonus aggiuntivi
- Percentuali sui rinnovi
- Eventuali override sulla downline (se previsti)

### 3.1 Struttura rank (template — adatta ai nomi NOA reali)

| Rank | Requisiti | Bonus mensile fisso | % extra rinnovi | Note |
|---|---|---|---|---|
| `[NOME RANK 1]` (es. **Starter Partner**) | — (rank di partenza) | $0 | 0% | All'iscrizione |
| `[NOME RANK 2]` (es. **Bronze**) | `[X vendite personali]` in `[Y mesi]` | $`[Z]` | `[W]%` | Primo rank guadagnante |
| `[NOME RANK 3]` (es. **Silver**) | `[X]` vendite + `[Y]` collaboratori attivi | $`[Z]` | `[W]%` | |
| `[NOME RANK 4]` (es. **Gold**) | `[X]` vendite + team con fatturato `$[Y]/mese` | $`[Z]` | `[W]%` | |
| `[NOME RANK 5]` (es. **Platinum**) | `[X]` collaboratori Silver+ in team | $`[Z]` | `[W]%` | |
| `[NOME RANK 6]` (es. **Diamond**) | `[X]` collaboratori Gold+ in team | $`[Z]` | `[W]%` | Top tier |

> ⚠️ **Da compilare con i dati NOA reali**. Manda i numeri e adatto il file.

### 3.2 Regole avanzamento (template)

**Tipiche regole MLM (verifica con NOA quali si applicano):**
- Si avanza di rank quando si raggiungono **TUTTI** i requisiti di quel rank per `X` mesi consecutivi
- Si **mantiene** il rank rinnovando il proprio abbonamento NOA personale + facendo almeno `Y` vendite/mese
- Si **retrocede** se per `Z` mesi consecutivi non si raggiungono i minimi del proprio rank

### 3.3 Bonus rank-up (one-time)

Alcuni piani prevedono **bonus una tantum** al raggiungimento di un nuovo rank:

| Raggiungi | Bonus one-time |
|---|---|
| `[RANK 2]` | $`[X]` |
| `[RANK 3]` | $`[X]` |
| `[RANK 4]` | $`[X]` |
| `[RANK 5]` | $`[X]` |
| `[RANK 6]` | $`[X]` |

---

## 4. Provvigioni sui rinnovi (residuale)

Ogni cliente NOA paga $152/mese di rinnovo (qualsiasi pacchetto, sembra dal PDF).

Sul rinnovo, il collaboratore riceve una % che **dipende dal rank attuale**:

| Rank | % rinnovi | Esempio: 10 clienti × $152 |
|---|---|---|
| `[RANK 2]` | `[W]%` | $`[totale]/mese` |
| `[RANK 3]` | `[W]%` | $`[totale]/mese` |
| `[RANK 4]` | `[W]%` | $`[totale]/mese` |
| `[RANK 5]` | `[W]%` | $`[totale]/mese` |
| `[RANK 6]` | `[W]%` | $`[totale]/mese` |

⚠️ Verifica con NOA: il rinnovo $152 è uguale per tutti i pacchetti? Sembra di sì dal PDF ma confermare.

---

## 5. Provvigioni da downline (override)

⚠️ **Verifica obbligatoria con NOA**: il piano prevede override sulle vendite dei collaboratori che recluti?

Se sì, struttura tipica (placeholder):

| Livello downline | % override sulle loro vendite |
|---|---|
| Livello 1 (chi recluto io) | `[X]%` |
| Livello 2 (chi reclutano i miei) | `[Y]%` |
| Livello 3+ | `[Z]%` o niente |

⚠️ **Vincolo legale italiano** (L. 173/2005): non si può guadagnare *solo* dal reclutamento. Il prodotto deve essere vendibile autonomamente, e la maggior parte del guadagno deve venire dalle vendite a clienti finali, non da iscrizioni di nuovi networker.

---

## 6. Simulatore guadagno (esempio fittizio per il sito)

Per la landing recruiting, può essere utile mostrare un **esempio fittizio** con tono onesto:

> **Esempio fittizio — Mese 6 da partenza** (un collaboratore con impegno costante e profilo medio)
>
> - 4 vendite Starter ($50 × 4) = $200
> - 2 vendite Pro ($250 × 2) = $500
> - 0 vendite Elite = $0
> - 18 clienti attivi su rinnovi (15% del rinnovo × $152) = $410
> - Bonus rank Bronze raggiunto: +$100/mese
>
> **Totale mese 6**: ~$1.210
>
> *Questa è una simulazione di esempio, NON una promessa. Il guadagno reale dipende da impegno, mercato, profilo personale, e capacità individuali. La maggior parte dei collaboratori non raggiunge questi risultati. (Disclaimer obbligatorio: vedi reddito disclosure NOA ufficiale.)*

⚠️ **In Italia il "reddito disclosure" è raccomandato** per evitare contestazioni: pubblicate annualmente la distribuzione reale dei guadagni della rete (mediana, percentili). Chiedi a NOA se hanno già questo documento.

---

## 7. Tracking compensi — Sheet Airtable / Google

Finché Systeme.io free non calcola automaticamente, gestisci su **Airtable** o **Google Sheet** condiviso:

### Tabella `Vendite`

| Data | Cliente | Pacchetto | Importo lordo | Provvigione diretta | Collaboratore origine | Status |
|---|---|---|---|---|---|---|
| 2026-01-15 | Mario Rossi | Pro | $845 | $250 | NomeCognome | Pagata |

### Tabella `Rinnovi mensili`

| Mese | Cliente | Importo rinnovo | % provvigione | Provvigione | Collaboratore |
|---|---|---|---|---|---|
| 2026-02 | Mario Rossi | $152 | 15% | $22.80 | NomeCognome |

### Tabella `Rank tracking`

| Collaboratore | Rank attuale | Vendite mese corrente | Team size | Next rank |
|---|---|---|---|---|
| NomeCognome | Bronze | 6 | 0 | Silver (servono 10 vendite + 2 collab.) |

→ Una volta strutturato, si può **automatizzare** lasciando Systeme.io a inviare ogni vendita ad Airtable via webhook/Zapier.

---

## 8. Documenti legali necessari

⚠️ **Da preparare prima di lanciare il programma collaboratori in modo serio**:

1. **Contratto di collaborazione/incarico** (modello fornito da NOA)
2. **Documento "Reddito Disclosure"** annuale (consigliato)
3. **Codice di condotta** per i collaboratori (cosa possono e non possono dichiarare)
4. **Termini & condizioni programma** (Systeme.io ha template, ma serve consulenza legale italiana)
5. **Apertura P.IVA** per il collaboratore (regime forfettario se sotto €85k/anno)

📌 Suggerimento: **NOA Italia probabilmente fornisce già questi documenti** ai nuovi collaboratori. Verifica.

---

## 9. Cosa ti serve dare a me per completare questo file

Per stasera (o entro 1-2 giorni) idealmente mandami:

1. **Provvigioni dirette esatte** per Starter / Pro / Elite ($ o %?)
2. **Nomi dei rank** e **requisiti** per ognuno
3. **Bonus rank-up** (se esistono)
4. **% sui rinnovi** per ogni rank
5. **Esistono override su downline?** Se sì, quanti livelli, quali %?
6. **Periodicità pagamenti**: settimanale, mensile, bimestrale?
7. **NOA fornisce documenti legali** (contratto collaboratore, reddito disclosure)?

Quando li avrai → mandami i numeri in chat e riscrivo questo file con i valori reali.
