import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/guards";

export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;

  const body = await request.json();
  const displayName = typeof body.display_name === "string" ? body.display_name.trim() : undefined;
  const bio = typeof body.bio === "string" ? body.bio.trim() : undefined;

  if (!displayName && bio === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

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

  return NextResponse.json({ success: true });
}
