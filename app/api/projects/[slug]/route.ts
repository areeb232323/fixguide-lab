import { NextRequest, NextResponse } from "next/server";
import { getProjectDetail } from "@/lib/api-client";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const log = createRequestLogger("GET", `/api/projects/${slug}`);
  log.info("Fetching project by slug");

  const rl = checkRateLimit(getRateLimitKey(request));
  if (rl) return rl;

  try {
    const detail = await getProjectDetail(slug);
    if (!detail) {
      log.warn("Project not found", { slug });
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    log.info("Project fetched", { projectId: detail.data.id });
    return NextResponse.json(detail);
  } catch (err) {
    log.error("Failed to fetch project", { error: String(err) });
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
