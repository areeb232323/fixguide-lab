import { NextRequest, NextResponse } from "next/server";
import { listGuides } from "@/lib/api-client";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const log = createRequestLogger("GET", "/api/guides");
  log.info("Listing guides");

  const rl = checkRateLimit(getRateLimitKey(request));
  if (rl) return rl;

  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? undefined;
  const difficulty = url.searchParams.get("difficulty") ?? undefined;
  const os = url.searchParams.get("os") ?? undefined;
  const tag = url.searchParams.get("tag") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 20);

  try {
    const result = await listGuides({ query, difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced" | undefined, os: os as "Windows" | "Linux" | "macOS" | "Any" | undefined, tag, page, limit });
    log.info("Guides listed", { total: result.total });
    return NextResponse.json(result);
  } catch (err) {
    log.error("Failed to list guides", { error: String(err) });
    return NextResponse.json({ error: "Failed to list guides" }, { status: 500 });
  }
}
