/**
 * Configurazione centralizzata del sito Alead.
 *
 * ⚠️ TODO PRIMA DEL GO-LIVE PRODUTTIVO:
 * Tutti i campi marcati con `__TODO__` vanno sostituiti con i dati reali del
 * titolare del trattamento prima di rimuovere il <BetaBanner /> dal sito.
 *
 * I valori in __TODO__ sono volutamente evidenti per essere notati subito in
 * page testing — non sostituirli con placeholder neutri tipo "Mario Rossi"
 * perché potrebbero passare inosservati.
 */

export const siteConfig = {
  // ----------------------------------------------------------------------
  // Identità sito
  // ----------------------------------------------------------------------
  brand: {
    name: "Alead",
    tagline: "Distribuiamo NOA × One Tribe Academy",
    siteUrl: "https://ale-two-alpha.vercel.app",
    officialBrandUrl: "https://noaitaly.io",
  },

  // ----------------------------------------------------------------------
  // Titolare del trattamento dati (GDPR)
  // ----------------------------------------------------------------------
  legal: {
    titolare: "__TODO__ Nome Cognome / Ragione Sociale",
    indirizzo: "__TODO__ Via, CAP, Città (IT)",
    partitaIva: "__TODO__ P.IVA (se applicabile)",
    codiceFiscale: "__TODO__ CF (se persona fisica senza P.IVA)",
    emailPrivacy: "__TODO__privacy@dominio-reale.it",
    emailContatti: "__TODO__contatti@dominio-reale.it",
    pec: "__TODO__ PEC (se professionista/società)",
    foroCompetente: "__TODO__ Città del Foro",
  },

  // ----------------------------------------------------------------------
  // Contatti pubblici (mostrati nel footer/grazie/CTA)
  // ----------------------------------------------------------------------
  contacts: {
    // Usato in mailto: del footer e delle CTA email
    publicEmail: "__TODO__contatti@dominio-reale.it",
    // Numero WhatsApp in formato internazionale SENZA "+" né spazi
    whatsappNumber: "393000000000",
  },

  // ----------------------------------------------------------------------
  // Fornitori esterni (per informativa privacy GDPR)
  // ----------------------------------------------------------------------
  providers: {
    hosting: { name: "Vercel Inc.", location: "USA (EU edge)" },
    database: { name: "Supabase Inc.", location: "EU (Frankfurt)" },
    pushNotifications: { name: "Web Push (VAPID, self-hosted)", location: "EU" },
    analytics: { name: "—", location: "non attivato" },
    crm: { name: "Interno (Supabase)", location: "EU" },
  },

  // ----------------------------------------------------------------------
  // Durate di conservazione dati (GDPR)
  // ----------------------------------------------------------------------
  retention: {
    leadEmail: "5 anni dall'ultima interazione",
    marketingConsent: "fino a revoca esplicita",
    cookieTechnical: "sessione",
    cookieAnalytics: "13 mesi (se attivati)",
    cookieMarketing: "non utilizzati",
  },

  // ----------------------------------------------------------------------
  // Sezioni legali normative
  // ----------------------------------------------------------------------
  norms: {
    venditaDiretta: "Legge 17 agosto 2005, n. 173",
    tuf: "Testo Unico della Finanza (D.Lgs 24 febbraio 1998, n. 58)",
    gdpr: "Regolamento UE 2016/679 (GDPR) e D.Lgs 196/2003 e ss.mm.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
