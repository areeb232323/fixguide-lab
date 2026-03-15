import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.comment_id || typeof body.is_helpful !== "boolean") {
      return NextResponse.json(
        { error: "comment_id and is_helpful are required" },
        { status: 400 },
      );
    }

    // In demo mode votes are accepted but not persisted.
    // The client already does optimistic updates so the UI reflects the vote.
    return NextResponse.json({ success: true, demo: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 },
    );
  }
}
