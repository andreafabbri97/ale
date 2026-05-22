import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase client per uso lato SERVER (Server Components, Server Actions, Route Handlers).
 * Gestisce la session via cookie HTTPOnly.
 *
 * Nota typing: NON tipizziamo con `<Database>` perché il generic di @supabase/ssr
 * confonde TypeScript con i nostri Insert/Update types custom (errori "never[]"
 * a livello di mutation). I tipi del risultato delle query li castiamo localmente
 * dove serve usando i Row types in `./types.ts`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chiamato da Server Component: ignora — il middleware refreshera la session.
          }
        },
      },
    },
  );
}

/**
 * Supabase client con privilegi di SERVICE_ROLE.
 * Usare con cautela — bypassa Row Level Security.
 * Usato per: inserimento anonimo di lead, operazioni di sistema.
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op: l'admin client non gestisce session
        },
      },
    },
  );
}
