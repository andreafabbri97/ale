import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Limita il middleware (e quindi la chiamata Supabase auth.getUser su ogni request)
 * SOLO alle route admin. Le pagine pubbliche (Home, /scopri, /collabora, /privacy,
 * /grazie) sono completamente statiche o server-rendered senza auth — non serve
 * refresh session.
 *
 * Performance impact: ~300ms tagliati da ogni page load pubblico.
 */
export const config = {
  matcher: ["/admin/:path*"],
};
