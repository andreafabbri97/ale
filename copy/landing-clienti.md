# Landing B2C — "Scopri NOA" (Systeme.io)

> URL: `/scopri` — Obiettivo unico: **lead capture**. Form: nome, email, telefono.

---

## STRUTTURA PAGINA (single-column, mobile-first)

### HERO

**Pre-headline** (occhiello piccolo):
> EDUCAZIONE FINANZIARIA · TRADING · INVESTIMENTI

**Headline (H1)**:
> **Stop a "lavora, guadagna, paga, ricomincia".**
> Impara come funziona davvero il denaro.

**Sub-headline**:
> Scarica subito la guida gratuita **"I 7 errori finanziari che fanno gli italiani"** e scopri come iniziare a costruire la tua libertà finanziaria con NOA.

**Form lead (sopra la piega)**:
```
┌────────────────────────────────────┐
│  Nome*                              │
│  [_______________________________] │
│                                     │
│  Email*                             │
│  [_______________________________] │
│                                     │
│  Telefono/WhatsApp*                 │
│  [_______________________________] │
│                                     │
│  Cosa ti interessa di più? (opt)    │
│  ○ Iniziare da zero                 │
│  ○ Investire i miei risparmi        │
│  ○ Imparare a fare trading          │
│  ○ Strumenti AI per trader esperti  │
│                                     │
│  ☐ Accetto la privacy policy*       │
│                                     │
│  [  RICEVI LA GUIDA GRATIS →  ]    │
└────────────────────────────────────┘
```

**Trust badge sotto form**:
> 🔒 I tuoi dati sono al sicuro. Niente spam, mai. Disiscrizione con un click.

---

### SEZIONE PROBLEMA

**Titolo**:
> Lo dicono i numeri, non noi.

**3 stat affiancate** (riprese dal PDF):
- **-3%** salari reali in Italia dal 1990 al 2020 (vs +34% Germania)
- **+24%** spesa al supermercato dal 2021
- **+34,1%** bollette energia e gas

**Sub**:
> Ogni anno che passa il tuo potere d'acquisto si riduce. **Lasciare i soldi sul conto = perdere soldi.**

---

### SEZIONE INTERESSE COMPOSTO ("L'ottava meraviglia")

**Titolo**:
> Cosa succede se investi 50€/mese per 30 anni a un rendimento medio del 20%?

**Visual numero grande**:
> **€247.619**

**Sub**:
> Versato totale: **24.000 €** · Interessi maturati: **223.619 €**

**Mini-disclaimer**:
> *Esempio puramente educativo. Le performance passate non garantiscono risultati futuri. Il rendimento medio S&P 500 negli ultimi 22 anni è ~9% annuo (questo esempio usa 20% solo come riferimento dell'ottava meraviglia).*

---

### SEZIONE COSA TROVERAI IN NOA

**Titolo**:
> Cosa è incluso quando entri in NOA.

**Lista checkmark** (icona verde + voce):
- ✅ **Accademia NOA** — Corsi on-demand su tutti gli asset (azionario, forex, materie prime, crypto)
- ✅ **Sessioni live settimanali** con 6 educatori professionisti
- ✅ **Idee di trading formative** condivise da 10+ professionisti
- ✅ **Software AI proprietari** (Hummingbird, Lumen, Maitryx, Solexx) — solo nei piani Pro/Elite
- ✅ **Trading Journal** per tracciare le tue operazioni
- ✅ **Community attiva** di studenti e collaboratori
- ✅ **Calcolatori finanziari** (interesse composto, money management)

---

### SEZIONE I 3 PIANI

**Titolo**:
> Scegli il piano giusto per te.

**Pricing table 3 colonne**:

| **STARTER** | **PRO** | **ELITE** |
|---|---|---|
| Per chi inizia | Per chi fa sul serio | Per professionisti |
| Accademia base | + Forex + Elliot Wave + Mercato Azionario | + Certificati azionari |
| 3 canali idee trading | 6 canali idee trading | 9 canali idee trading |
| | + Trading Journal | + Hummingbird + Solexx |
| | + Lumen | + Lumen |
| | + Live US30 | + Live US30 |
| **da $159 il 1° mese**<br>poi $152/mese | **da $845 il 1° mese**<br>poi $152/mese | **da $1.699 il 1° mese**<br>poi $152/mese |

**CTA sotto tabella**: bottone "Prenota call gratuita per scegliere il piano"

---

### SEZIONE TESTIMONIANZE

**Titolo**:
> Cosa dicono gli studenti.

**3-4 testimonianze** (per il MVP placeholder, poi sostituire con vere):
- Foto + nome + città + breve frase + asset trattato

> *Da inserire dopo aver raccolto testimonial reali dalla community NOA. Per il MVP, usare 3 placeholder con icona generica e testo "Testimonianza in arrivo".*

---

### SEZIONE FAQ (5 domande max)

1. **Non so nulla di trading, posso comunque iscrivermi?**
   Sì, il piano Starter parte dalle basi assolute. Imparerai con video, sessioni live e tutor.

2. **Quanto tempo serve dedicarci?**
   Da 30 minuti al giorno per chi vuole solo investire passivamente, fino a 2-3 ore per chi vuole imparare il trading attivo.

3. **Posso disdire quando voglio?**
   Sì, l'abbonamento è mensile e si può cancellare senza penali.

4. **NOA promette guadagni?**
   No. NOA forma. Quanto guadagni dipende dalla tua disciplina, dalle tue scelte e dal mercato. Investire comporta sempre rischi.

5. **Cosa succede dopo che invio il form?**
   Ricevi subito la guida gratuita in email + accesso a una call gratuita di 30 minuti dove ti mostriamo la piattaforma dal vivo.

---

### CTA FINALE

**Titolo**:
> Il primo passo è gratis.

**Form (ripetuto)**: stesso form della hero.

**Bottone**: "RICEVI LA GUIDA GRATIS →"

---

## CONFIGURAZIONE SYSTEME.IO

### Tag da applicare al submit
- `LEAD_CLIENTE`
- `INTERESSE_[STARTER|PRO|ELITE|GENERICO]` (in base alla risposta "cosa ti interessa")
- `FONTE_[GOOGLE|META|TIKTOK|REFERRAL|DIRECT]` (passato via UTM)
- `COLLABORATORE_[NOMECOGNOME]` (se arrivato da link affiliate)

### Workflow post-submit
1. Salvataggio contatto in CRM con stato "NEW"
2. Invia email 1 (welcome + guida PDF allegata)
3. Aggiunge a sequenza "Nurturing Cliente B2C" (5 email in 7 giorni)
4. Notifica WhatsApp al collaboratore di riferimento (via webhook → API WhatsApp Business)
5. Crea task in CRM "Chiamare entro 24h"

### Goal pagina
- **Macro-conversione**: submit form
- **Micro-conversioni**: scroll 50%, click su "Prenota call", click su FAQ
- Tracking via Systeme.io + GA4 + Pixel Meta (se attiverete ads)
