import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectListQuerySchema } from "@contracts/schemas";
import { parseQuery } from "@/lib/api-utils";
import { getAuthUser } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  const log = createRequestLogger("GET", "/api/projects", user?.id);
  log.info("Listing projects");

  const rl = checkRateLimit(getRateLimitKey(request, user?.id));
  if (rl) return rl;

  const parsed = parseQuery(request.url, ProjectListQuerySchema);
  if ("error" in parsed) return parsed.error;

  const { query, difficulty, costMax, tag, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const supabase = await createSupabaseServerClient();

  let q = supabase
    .from("projects")
    .select("*", { count: "exact" })
    .eq("published", true)
    .eq("hidden", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (query) {
    q = q.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
  }
  if (difficulty) {
    q = q.eq("difficulty", difficulty);
  }
  if (costMax !== undefined) {
    q = q.lte("cost_range_max", costMax);
  }
  if (tag) {
    q = q.contains("tags", [tag]);
  }

  const { data, error, count } = await q;

  if (error) {
    log.error("DB error listing projects", { dbError: error.message });
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  log.info("Projects listed", { count });
  return NextResponse.json({ data, total: count, page, limit });
}
