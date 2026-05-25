"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead } from "@/app/actions/submit-lead";

interface FormState {
  ok: boolean;
  error?: string;
}

const initialState: FormState | null = null;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary btn-lg btn-block">
      {pending ? "Invio in corso..." : label}
    </button>
  );
}

interface HiddenTrackingFieldsProps {
  pageOrigin: string;
}

function HiddenTrackingFields({ pageOrigin }: HiddenTrackingFieldsProps) {
  return (
    <>
      <input type="hidden" name="page_origin" value={pageOrigin} />
      <input type="hidden" name="utm_source" defaultValue="" data-utm="utm_source" />
      <input type="hidden" name="utm_medium" defaultValue="" data-utm="utm_medium" />
      <input type="hidden" name="utm_campaign" defaultValue="" data-utm="utm_campaign" />
      <input type="hidden" name="utm_content" defaultValue="" data-utm="utm_content" />
      <input type="hidden" name="ref_code" defaultValue="" data-utm="ref" />
    </>
  );
}

/**
 * Form lead B2C — pagina /scopri
 */
export function ClientLeadForm() {
  const [state, formAction] = useActionState<FormState | null, FormData>(
    async (_prev, formData) => submitLead(formData),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="bg-gradient-to-b from-[var(--color-bg-2)] to-[var(--color-bg-3)] border border-[var(--color-border-strong)] rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <input type="hidden" name="source" value="cliente" />
      <HiddenTrackingFields pageOrigin="/scopri" />

      <h3 className="text-2xl font-bold mb-1">Ricevi la guida gratuita</h3>
      <p className="text-sm text-[var(--color-text-faint)] mb-6">
        Compila il form e scaricala subito.
      </p>

      {state?.error && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-lg border border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] text-sm text-[var(--color-text)]"
        >
          {state.error}
        </div>
      )}

      <div className="mb-5">
        <label htmlFor="full_name" className="block text-sm font-semibold mb-2">
          Nome <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="given-name"
          className="input"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          Email <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="phone" className="block text-sm font-semibold mb-2">
          Telefono / WhatsApp <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="+39 ..."
          className="input"
        />
      </div>

      <fieldset className="mb-5">
        <legend className="block text-sm font-semibold mb-2">Cosa ti interessa di più?</legend>
        <div className="flex flex-col gap-2">
          {[
            ["iniziare_zero", "Iniziare da zero"],
            ["investire_risparmi", "Investire i miei risparmi"],
            ["trading_attivo", "Imparare a fare trading"],
            ["ai_pro", "Strumenti AI per trader esperti"],
          ].map(([value, label]) => (
            <label key={value} className="radio-card">
              <input type="radio" name="interesse_b2c" value={value} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mb-6">
        <label className="flex items-center gap-3 text-sm cursor-pointer p-3 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-2)] hover:border-[var(--color-accent)] transition">
          <input
            type="checkbox"
            name="not_robot"
            required
            className="w-5 h-5 accent-[var(--color-accent)] shrink-0"
          />
          <span className="font-medium">Non sono un robot</span>
        </label>
      </div>

      <SubmitButton label="Ricevi la guida gratis →" />
    </form>
  );
}

/**
 * Form lead B2B — pagina /collabora
 */
export function NetworkerLeadForm() {
  const [state, formAction] = useActionState<FormState | null, FormData>(
    async (_prev, formData) => submitLead(formData),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="bg-gradient-to-b from-[var(--color-bg-2)] to-[var(--color-bg-3)] border border-[var(--color-border-strong)] rounded-2xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-2xl mx-auto"
    >
      <input type="hidden" name="source" value="networker" />
      <HiddenTrackingFields pageOrigin="/collabora" />

      {state?.error && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-lg border border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] text-sm text-[var(--color-text)]"
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="md:col-span-2">
          <label htmlFor="full_name" className="block text-sm font-semibold mb-2">
            Nome e cognome <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input id="full_name" name="full_name" type="text" required className="input" />
        </div>
        <div>
          <label htmlFor="eta" className="block text-sm font-semibold mb-2">
            Età
          </label>
          <input id="eta" name="eta" type="number" min={18} max={99} className="input" />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          Email <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input id="email" name="email" type="email" required className="input" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold mb-2">
            Telefono / WhatsApp <span className="text-[var(--color-accent)]">*</span>
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="+39 ..." className="input" />
        </div>
        <div>
          <label htmlFor="citta" className="block text-sm font-semibold mb-2">
            Città / Regione
          </label>
          <input id="citta" name="citta" type="text" className="input" />
        </div>
      </div>

      <fieldset className="mb-5">
        <legend className="block text-sm font-semibold mb-2">
          Hai già esperienza nel network marketing o vendita?
        </legend>
        <div className="flex flex-col gap-2">
          {[
            ["anni", "Sì, da anni"],
            ["mesi", "Sì, qualche mese"],
            ["no_pronto", "No, ma sono pronto/a a imparare"],
            ["no_non_interessa", "No, e non mi interessa il NM"],
          ].map(([value, label]) => (
            <label key={value} className="radio-card">
              <input type="radio" name="esperienza_nm" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="block text-sm font-semibold mb-2">
          Quante ore alla settimana puoi dedicare?
        </legend>
        <div className="flex flex-col gap-2">
          {[
            ["meno_5", "Meno di 5 ore"],
            ["5_10", "5–10 ore"],
            ["10_20", "10–20 ore"],
            ["20_plus", "Più di 20 ore (full time)"],
          ].map(([value, label]) => (
            <label key={value} className="radio-card">
              <input type="radio" name="tempo_disponibile" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-5">
        <legend className="block text-sm font-semibold mb-2">
          Hai già una rete/audience online o offline?
        </legend>
        <div className="flex flex-col gap-2">
          {[
            ["grande", "Sì, importante (>1.000 contatti)"],
            ["piccola", "Sì, piccola (100–1.000 contatti)"],
            ["zero", "No, parto da zero"],
          ].map(([value, label]) => (
            <label key={value} className="radio-card">
              <input type="radio" name="rete" value={value} required />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mb-5">
        <label htmlFor="motivazione" className="block text-sm font-semibold mb-2">
          Cosa ti aspetti da questa opportunità?
        </label>
        <textarea
          id="motivazione"
          name="motivazione"
          rows={4}
          maxLength={2000}
          placeholder="Raccontaci brevemente cosa speri di ottenere..."
          className="textarea"
        />
      </div>

      <div className="mb-3">
        <label className="flex items-center gap-3 text-sm cursor-pointer p-3 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-2)] hover:border-[var(--color-accent)] transition">
          <input
            type="checkbox"
            name="not_robot"
            required
            className="w-5 h-5 accent-[var(--color-accent)] shrink-0"
          />
          <span className="font-medium">Non sono un robot</span>
        </label>
      </div>

      <div className="mb-6">
        <label className="flex items-start gap-2 text-sm text-[var(--color-text-dim)] cursor-pointer">
          <input type="checkbox" name="contatto_ok" required className="mt-1 accent-[var(--color-accent)]" />
          <span>
            Acconsento ad essere contattato per la call conoscitiva{" "}
            <span className="text-[var(--color-accent)]">*</span>
          </span>
        </label>
      </div>

      <SubmitButton label="Prenota call conoscitiva →" />

      <p className="mt-4 text-xs text-center text-[var(--color-text-faint)]">
        Nessuna pressione · Nessun obbligo · La call è davvero gratuita.
      </p>
    </form>
  );
}
