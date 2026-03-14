import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const authResult = await requireRole("moderator", "admin");
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const log = createRequestLogger("GET", "/api/mod/queue", user.id);
  log.info("Fetching moderation queue");

  const rl = checkRateLimit(getRateLimitKey(request, user.id));
  if (rl) return rl;

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
  const offset = (page - 1) * limit;

  const supabase = await createSupabaseServerClient();

  const { data, error, count } = await supabase
    .from("reports")
    .select("*, user_profiles!reporter_id(display_name)", { count: "exact" })
    .eq("status", status)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    log.error("DB error fetching queue", { dbError: error.message });
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  log.info("Queue fetched", { count, status });
  return NextResponse.json({ data, total: count, page, limit });
}
