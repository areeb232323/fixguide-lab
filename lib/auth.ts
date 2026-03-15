import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/guards";
import { getDemoUser } from "@/lib/demo-auth-server";
import type { UserRole } from "@contracts/enums";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  display_name: string;
}

/**
 * Get the authenticated user from the request. Returns null if not authenticated.
 * Falls back to demo auth cookie when Supabase is not configured.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    // Fall back to demo auth when Supabase isn't set up
    return getDemoUser();
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    role: (profile?.role as UserRole) ?? "user",
    display_name: (profile?.display_name as string) ?? user.email?.split("@")[0] ?? "User",
  };
}

/**
 * Require authentication. Returns 401 if not logged in.
 */
export async function requireAuth(): Promise<
  { user: AuthUser } | { error: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }
  return { user };
}

/**
 * Require one of the given roles. Returns 403 if role doesn't match.
 */
export async function requireRole(
  ...roles: UserRole[]
): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const result = await requireAuth();
  if ("error" in result) return result;

  if (!roles.includes(result.user.role)) {
    return {
      error: NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      ),
    };
  }
  return result;
}

/**
 * Check if a user role can perform moderation actions.
 */
export function canModerate(role: UserRole): boolean {
  return role === "moderator" || role === "admin";
}

/**
 * Check if a user role can create content (guides, projects).
 */
export function canContribute(role: UserRole): boolean {
  return role === "contributor" || role === "moderator" || role === "admin";
}
