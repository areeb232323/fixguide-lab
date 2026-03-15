import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, canModerate } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!canModerate(user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.report_id || !body.action_type) {
      return NextResponse.json(
        { error: "report_id and action_type are required" },
        { status: 400 },
      );
    }

    // In demo mode actions are accepted but not persisted.
    return NextResponse.json({
      success: true,
      action: {
        id: `demo-${Date.now()}`,
        report_id: body.report_id,
        action_type: body.action_type,
        moderator_id: user.id,
        reason: body.reason ?? "",
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
