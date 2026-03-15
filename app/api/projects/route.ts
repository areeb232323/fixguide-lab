import { NextRequest, NextResponse } from "next/server";
import { listProjects } from "@/lib/api-client";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const log = createRequestLogger("GET", "/api/projects");
  log.info("Listing projects");

  const rl = checkRateLimit(getRateLimitKey(request));
  if (rl) return rl;

  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? undefined;
  const difficulty = url.searchParams.get("difficulty") ?? undefined;
  const costMax = url.searchParams.get("costMax") ? Number(url.searchParams.get("costMax")) : undefined;
  const tag = url.searchParams.get("tag") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 20);

  try {
    const result = await listProjects({ query, difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced" | undefined, costMax, tag, page, limit });
    log.info("Projects listed", { total: result.total });
    return NextResponse.json(result);
  } catch (err) {
    log.error("Failed to list projects", { error: String(err) });
    return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
  }
}
