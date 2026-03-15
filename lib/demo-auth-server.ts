import { cookies } from "next/headers";
import type { AuthUser } from "@/lib/auth";

const COOKIE_NAME = "demo-auth";

/**
 * Read demo auth session from cookie (server-side only).
 * Returns null if no demo session exists.
 */
export async function getDemoUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const session = JSON.parse(decodeURIComponent(cookie.value));
    return {
      id: session.id,
      email: session.email,
      display_name: session.display_name,
      role: session.role as AuthUser["role"],
    };
  } catch {
    return null;
  }
}
