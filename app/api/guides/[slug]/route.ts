import { NextRequest, NextResponse } from "next/server";
import { getGuideDetail } from "@/lib/api-client";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const log = createRequestLogger("GET", `/api/guides/${slug}`);
  log.info("Fetching guide by slug");

  const rl = checkRateLimit(getRateLimitKey(request));
  if (rl) return rl;

  try {
    const detail = await getGuideDetail(slug);
    if (!detail) {
      log.warn("Guide not found", { slug });
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    log.info("Guide fetched", { guideId: detail.data.id });
    return NextResponse.json(detail);
  } catch (err) {
    log.error("Failed to fetch guide", { error: String(err) });
    return NextResponse.json({ error: "Failed to fetch guide" }, { status: 500 });
  }
}
