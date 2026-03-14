import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const user = await getAuthUser();
  const log = createRequestLogger("GET", `/api/guides/${slug}`, user?.id);
  log.info("Fetching guide by slug");

  const rl = checkRateLimit(getRateLimitKey(request, user?.id));
  if (rl) return rl;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .eq("hidden", false)
    .single();

  if (error || !data) {
    log.warn("Guide not found", { slug });
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  // Fetch comments for this guide
  const { data: comments } = await supabase
    .from("comments")
    .select("*, user_profiles(display_name, avatar_url)")
    .eq("target_type", "guide")
    .eq("target_id", data.id)
    .eq("hidden", false)
    .order("created_at", { ascending: true });

  log.info("Guide fetched", { guideId: data.id });
  return NextResponse.json({ data, comments: comments ?? [] });
}
