# Sitemap & Architettura

## Mappa completa pagine

### A. Pubbliche (visibili a tutti, indicizzate)

| URL | Tool | Scopo | Conversion goal |
|---|---|---|---|
| `/` | Framer | Home — vetrina, doppio CTA | Click su CTA cliente o networker |
| `/scopri` | Systeme.io | Landing B2C "Scopri NOA" | Submit form lead cliente |
| `/collabora` | Systeme.io | Landing Recruiting | Submit form qualifica networker |
| `/chi-siamo` | Framer | Storia, valori, partnership NOA × One Tribe | Trust building |
| `/educatori` | Framer | Profili Pellegrino, Vallotto, Rossiello, Furnari, Ribbeni, Harfouch | Trust building |
| `/piattaforme` | Framer | Cosa sono Lumen, Hummingbird, Maitryx, Solexx | Trust + curiosità |
| `/blog` | Framer CMS | Articoli educativi (SEO + nurturing) | Lead capture in-article |
| `/privacy` `/cookie` `/termini` | Framer (semplici) | Compliance GDPR | — |

### B. Funnel (semi-pubbliche, dietro form)

| URL | Tool | Scopo |
|---|---|---|
| `/scopri/grazie` | Systeme.io | Thank-you page + invito a prenotare call |
| `/collabora/grazie` | Systeme.io | Thank-you page + video presentazione opportunità |
| `/prenota-call` | Cal.com embed | Calendario prenotazione 30 min |

### C. Aree riservate (login)

| URL | Tool | Scopo |
|---|---|---|
| `/area-collaboratore` | Systeme.io membership | Materiali per network (presentazioni, copy social, link affiliate personale) |
| `/area-cliente` | (NOA ufficiale gestisce) | Non gestito da noi |

---

## Doppio percorso (B2C vs B2B/Recruiting)

### Percorso CLIENTE (B2C)
```
Home → CTA "Voglio imparare"
  ↓
Landing /scopri
  ↓
Form: nome, email, telefono, "cosa ti interessa?"
  ↓
Email 1 (immediata): "Ciao, ecco la guida gratis"
Email 2 (giorno+1): "Il problema dell'educazione finanziaria in Italia"
Email 3 (giorno+3): "Come funziona NOA: 3 pilastri"
Email 4 (giorno+5): "I 3 piani: Starter, Pro, Elite"
Email 5 (giorno+7): "Prenota una call gratuita"
  ↓
Booking call su Cal.com
  ↓
Call qualificazione → Vendita pacchetto NOA
```

### Percorso NETWORKER (B2B)
```
Home → CTA "Voglio collaborare"
  ↓
Landing /collabora
  ↓
Form qualifica:
  - Hai già esperienza nel network marketing?
  - Hai una community/audience?
  - Quanto tempo puoi dedicare?
  - Hai capitale iniziale per partire?
  ↓
Email 1 (immediata): "Grazie, ecco il video pitch"
Email 2 (giorno+1): "Perché NOA è diversa: piano compensi"
Email 3 (giorno+3): "I rank e come si guadagna"
Email 4 (giorno+5): "Testimonianze collaboratori"
Email 5 (giorno+7): "Prenota call conoscitiva"
  ↓
Booking call su Cal.com
  ↓
Call onboarding → Iscrizione come collaboratore
```

---

## Convenzione naming URL

- Tutto in italiano: `/scopri` (no `/discover`)
- Lowercase, kebab-case: `/chi-siamo` non `/chiSiamo`
- Niente parametri tracker visibili: gli UTM stanno in URL ma "puliti" dietro
- Link affiliate dei collaboratori: `?ref=NOMECOGNOME` (gestiti da Systeme.io)

## Mobile-first

Tutte le pagine **devono** essere responsive. Framer e Systeme.io lo sono di default, ma in fase di design controllare sempre la preview mobile prima di pubblicare.

## SEO base

- Title tag univoco per pagina (es. "NOA Italia | Educazione Finanziaria Seria — Distribuita da [Nome]")
- Meta description 150-160 caratteri
- Open Graph image (1200×630) — può essere lo stesso template per tutte le pagine inizialmente
- Sitemap.xml automatica (Framer e Systeme.io la generano)
- Disclaimer obbligatorio in footer: **"Le performance passate non garantiscono risultati futuri. Questo non costituisce consulenza finanziaria."**
