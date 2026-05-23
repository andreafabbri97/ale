import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Helper de-duplicato per ottenere lo user corrente all'interno di una request.
 *
 * Senza `cache()`: il layout chiama `auth.getUser()` + la page la chiama di nuovo
 * = 2 round-trip Supabase per ogni navigazione admin.
 *
 * Con `cache()`: React de-duplica le chiamate con gli stessi argomenti
 * nella stessa request, riducendo a 1 sola chiamata effettiva.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Recupera il profilo collaborator dell'utente loggato. De-duplicato come getCurrentUser.
 */
export const getCurrentCollaborator = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("collaborators")
    .select("email, full_name, is_admin, ref_code, rank")
    .eq("id", user.id)
    .single();

  return data as
    | {
        email: string;
        full_name: string;
        is_admin: boolean;
        ref_code: string;
        rank: string;
      }
    | null;
});
