import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client per uso lato BROWSER (Client Components).
 * Usa la anon key, soggetto a Row Level Security.
 *
 * Vedi nota typing in `./server.ts`.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
