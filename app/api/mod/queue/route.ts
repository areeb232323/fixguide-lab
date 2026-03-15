import { NextRequest, NextResponse } from "next/server";
import { getModerationQueue } from "@/lib/api-client";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const log = createRequestLogger("GET", "/api/mod/queue");
  log.info("Fetching moderation queue");

  const rl = checkRateLimit(getRateLimitKey(request));
  if (rl) return rl;

  const queue = await getModerationQueue();
  log.info("Queue fetched", { count: queue.length });
  return NextResponse.json({ data: queue, total: queue.length, page: 1, limit: 20 });
}
