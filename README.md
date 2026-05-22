# NOA × One Tribe — MVP Distributori

> Sito MVP per la lead generation e il recruiting collaboratori NOA.
> Stack: **HTML/CSS/JS vanilla** + **GitHub Pages** + **Formspree** per i form.
> Costo: **0€/mese**.

---

## 🌐 Sito live

Dopo il deploy (vedi sotto): `https://<tuo-username>.github.io/<nome-repo>/`

Pagine:
- **Home** — `/`
- **Scopri NOA (B2C)** — `/scopri.html`
- **Collabora (recruiting)** — `/collabora.html`
- **Privacy / Termini** — `/privacy.html`
- **Grazie** — `/grazie.html`

---

## 📁 Struttura

```
noa-mvp/
├── site/                       ← cartella pubblicata su GitHub Pages
│   ├── index.html
│   ├── scopri.html
│   ├── collabora.html
│   ├── grazie.html
│   ├── privacy.html
│   ├── 404.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/
│       ├── css/style.css
│       ├── js/main.js
│       └── img/
├── copy/                       ← copy testuale di riferimento (markdown)
├── setup/                      ← guide setup Systeme.io, Framer, compensi
├── automation/                 ← tag system, workflow CRM
├── sitemap.md
├── .github/workflows/deploy-pages.yml
└── README.md
```

---

## 🚀 Come pubblicare su GitHub Pages

### 1. Crea il repo su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Nome repo: `noa-mvp` (o quello che preferisci)
3. Visibilità: **Public** (necessario per GitHub Pages free; alternative con piano Pro per private)
4. **Non** aggiungere README/gitignore (li abbiamo già)
5. Crea il repo

### 2. Connetti il repo locale e fai il push

Apri il terminale nella cartella `noa-mvp/` ed esegui:

```bash
git remote add origin https://github.com/<tuo-username>/noa-mvp.git
git branch -M main
git push -u origin main
```

⚠️ Se è la prima volta che usi git su questo PC, GitHub ti chiederà credenziali:
- Username: il tuo username GitHub
- Password: **non la password GitHub**, ma un **Personal Access Token**. Crealo qui: [github.com/settings/tokens](https://github.com/settings/tokens) → "Generate new token (classic)" → scope: `repo`.

### 3. Attiva GitHub Pages

1. Sul tuo repo GitHub: **Settings → Pages**
2. Source: **GitHub Actions** (non "Deploy from branch")
3. Il workflow `.github/workflows/deploy-pages.yml` è già configurato per pubblicare la cartella `site/`
4. Aspetta 1-2 minuti che la prima build finisca
5. URL del tuo sito: `https://<tuo-username>.github.io/noa-mvp/`

### 4. Test

Aprite il link da desktop e mobile. Tutto deve funzionare tranne i form (che richiedono Formspree, prossimo step).

---

## 📧 Attivare i form (Formspree, 2 minuti)

I form al momento mostrano un alert "form non configurato" — è una protezione esplicita scritta in [main.js](site/assets/js/main.js).

Per attivarli:

### 1. Account Formspree

1. Vai su [formspree.io](https://formspree.io)
2. Registrati con la tua email
3. Free tier: 50 submission/mese gratis (sufficiente per partire)

### 2. Crea 2 form

- Form #1: "Lead Cliente NOA" — riceve i submit di `/scopri`
- Form #2: "Candidatura Collaboratore" — riceve i submit di `/collabora`

Ogni form ti darà un endpoint tipo `https://formspree.io/f/xabcdefg`.

### 3. Sostituisci nel codice

In [site/scopri.html](site/scopri.html) e [site/collabora.html](site/collabora.html), trova:

```html
action="https://formspree.io/f/YOUR_FORMSPREE_ID"
```

E sostituisci `YOUR_FORMSPREE_ID` con il tuo ID reale (es. `xabcdefg`).

### 4. Commit + push

```bash
git add site/scopri.html site/collabora.html
git commit -m "feat: connect Formspree endpoints"
git push
```

GitHub Actions ridepoia automaticamente (1-2 min). Da quel momento i form inviano email a te.

### 5. Redirect post-submit (opzionale)

Per far atterrare l'utente su `/grazie.html` dopo l'invio:

In Formspree → Form Settings → **Redirect URL** → inserisci `https://<tuo-username>.github.io/noa-mvp/grazie.html`

---

## 🛠️ Modificare il sito localmente

Non serve build step. Apri direttamente i file `.html` nel browser:

**Su Windows**: doppio click su `site/index.html`.

Oppure, per un server locale (consigliato per testare i link relativi):

```bash
# Con Python (preinstallato su molti sistemi)
cd site
python -m http.server 8080
# Apri http://localhost:8080
```

```bash
# Oppure con Node.js (se installato)
npx serve site
```

---

## 🎨 Brand & customizzazioni rapide

### Colori
Tutti definiti in `:root` in [site/assets/css/style.css](site/assets/css/style.css):

```css
--accent: #3BD4F8;   /* azzurro brillante */
--accent-2: #2C7BE5; /* blu medio */
--bg: #05080F;       /* sfondo nero */
```

### Logo
Per ora c'è un placeholder testuale "N" nel quadrato gradiente. Per il logo NOA reale:
1. Chiedi il file SVG/PNG ufficiale a NOA (uso collaboratori)
2. Mettilo in `site/assets/img/logo.svg`
3. Sostituisci `<span class="nav__brand-mark">N</span>` con `<img src="assets/img/logo.svg" alt="NOA" />` in tutti gli HTML

### Numero WhatsApp
Sostituisci `393000000000` con il tuo numero (formato internazionale senza `+`) in tutti gli HTML.

### Email
Sostituisci `contatti@example.com` con la tua email reale.

---

## 🔌 Prossimi step (post-MVP)

In ordine di priorità:

1. ✅ **Formspree connesso** → form funzionanti (vedi sopra)
2. **Cal.com configurato** → embed in `grazie.html` per booking call
3. **Numero WhatsApp + email reali** → cercare e sostituire i placeholder
4. **Foto reale + bio collaboratore** → in `grazie.html` o nuova `/chi-sono.html`
5. **Privacy policy reale** → generata con iubenda (sostituisce placeholder)
6. **Dominio custom** → opzionale, costa ~10€/anno (Cloudflare Registrar)
   - In Settings → Pages → Custom domain → inserisci `tuodominio.it`
   - Aggiungi record DNS sul registrar (Pages te li mostra)
7. **Systeme.io collegato** → migrare i form da Formspree a Systeme.io quando attivate l'account (così avete CRM + email automation)
8. **Pixel Meta + GA4** → per ads tracking (placeholder già pronto in HTML, basta aggiungere tag manager)

---

## 🧱 Dipendenze esterne

Il sito non ha **nessuna dipendenza JS/CSS via npm**. Carica solo:

- **Google Fonts** (Manrope) — caricato da `fonts.googleapis.com`
- **Nessun framework** (no React, no Vue, no Tailwind CDN — solo CSS scritto a mano)
- **Nessun tracker** built-in — voi decidete cosa aggiungere

---

## 📜 Licenza

Codice del sito: licenza MIT (vedi `LICENSE`).
Contenuti testuali (copy, descrizioni NOA): proprietà di NOA / One Tribe Academy. Usabili da collaboratori autorizzati.

---

## ✉️ Supporto

Per modifiche al codice o problemi tecnici, basta editare i file `.html` e `.css` — è tutto leggibile.

Per il setup completo (Systeme.io, dominio, automazioni email avanzate), vedi le guide in:
- [`setup/systeme-io-setup.md`](setup/systeme-io-setup.md)
- [`setup/framer-setup.md`](setup/framer-setup.md)
- [`setup/compensi-rank-system.md`](setup/compensi-rank-system.md)
