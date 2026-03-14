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
  const log = createRequestLogger("GET", `/api/projects/${slug}`, user?.id);
  log.info("Fetching project by slug");

  const rl = checkRateLimit(getRateLimitKey(request, user?.id));
  if (rl) return rl;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .eq("hidden", false)
    .single();

  if (error || !data) {
    log.warn("Project not found", { slug });
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Fetch parts and comments in parallel
  const [partsResult, commentsResult] = await Promise.all([
    supabase
      .from("parts")
      .select("*")
      .eq("project_id", data.id)
      .order("name"),
    supabase
      .from("comments")
      .select("*, user_profiles(display_name, avatar_url)")
      .eq("target_type", "project")
      .eq("target_id", data.id)
      .eq("hidden", false)
      .order("created_at", { ascending: true }),
  ]);

  log.info("Project fetched", { projectId: data.id });
  return NextResponse.json({
    data,
    parts: partsResult.data ?? [],
    comments: commentsResult.data ?? [],
  });
}
