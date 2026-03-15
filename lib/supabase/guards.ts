/**
 * Check whether Supabase environment variables are configured.
 * Used to gracefully degrade when running without a Supabase project.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
