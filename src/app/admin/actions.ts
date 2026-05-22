"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface AuthResult {
  ok: boolean;
  error?: string;
}

/**
 * Sign-in con email + password.
 * Ritorna {ok: false, error} se fallisce, altrimenti redirect.
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin");

  if (!email || !password) {
    return { ok: false, error: "Email e password obbligatorie." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Messaggio neutro per non fare account enumeration
      return {
        ok: false,
        error: "Credenziali non valide.",
      };
    }
  } catch (err) {
    console.error("Sign-in error:", err);
    return {
      ok: false,
      error: "Errore di connessione. Riprova.",
    };
  }

  revalidatePath("/admin", "layout");
  redirect(redirectTo);
}

/**
 * Logout — distrugge la session e redirect a login.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
