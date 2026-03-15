import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./guards";

/**
 * Service-role client for server-side operations that bypass RLS.
 * Only use in trusted server contexts (API routes, server actions).
 * Returns null when Supabase is not configured.
 */
export function createSupabaseAdmin() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
