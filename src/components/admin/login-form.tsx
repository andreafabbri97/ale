"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/app/admin/actions";

interface AuthState {
  ok: boolean;
  error?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary btn-block btn-lg">
      {pending ? "Accesso in corso..." : "Accedi →"}
    </button>
  );
}

interface LoginFormProps {
  redirect?: string;
}

export function LoginForm({ redirect }: LoginFormProps) {
  const [state, formAction] = useActionState<AuthState | null, FormData>(
    async (_prev, formData) => signIn(formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-5">
      {redirect && <input type="hidden" name="redirect" value={redirect} />}

      {state?.error && (
        <div
          role="alert"
          className="p-3 rounded-lg border border-[var(--color-danger)] bg-[rgba(231,76,60,0.1)] text-sm"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className="input"
          placeholder="tu@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />

      <p className="text-xs text-[var(--color-text-faint)] text-center pt-2">
        Per ottenere un account contatta l&apos;amministratore.
      </p>
    </form>
  );
}
