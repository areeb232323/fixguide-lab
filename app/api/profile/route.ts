import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/guards";
import { cookies } from "next/headers";

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const body = await request.json();
  const displayName = typeof body.display_name === "string" ? body.display_name.trim() : undefined;
  const bio = typeof body.bio === "string" ? body.bio.trim() : undefined;

  if (!displayName && bio === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const updates: Record<string, string> = {};
    if (displayName) updates.display_name = displayName;
    if (bio !== undefined) updates.bio = bio;

    const { error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", authResult.user.id);

    if (error) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
  } else {
    // Demo mode: update the demo-auth cookie with new display_name
    try {
      const cookieStore = await cookies();
      const cookie = cookieStore.get("demo-auth");
      if (cookie?.value) {
        const session = JSON.parse(decodeURIComponent(cookie.value));
        if (displayName) session.display_name = displayName;
        if (bio !== undefined) session.bio = bio;
        const value = encodeURIComponent(JSON.stringify(session));
        cookieStore.set("demo-auth", value, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "lax",
        });
      }
    } catch {
      // Cookie update failed, but the response is still success
    }
  }

  return NextResponse.json({ success: true });
}
