import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@contracts/enums";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Get the authenticated user from the request. Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    role: (profile?.role as UserRole) ?? "user",
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
