import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to submit a report" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    if (!body.content_type || !body.content_id || !body.reason) {
      return NextResponse.json(
        { error: "content_type, content_id, and reason are required" },
        { status: 400 },
      );
    }

    // In demo mode reports are accepted but not persisted.
    return NextResponse.json({
      success: true,
      report: {
        id: `demo-${Date.now()}`,
        content_type: body.content_type,
        content_id: body.content_id,
        reason: body.reason,
        details: body.details ?? null,
        reporter_id: user.id,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}
