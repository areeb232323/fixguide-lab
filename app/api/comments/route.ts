import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to post a comment" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    if (!body.body?.trim() || !body.target_type || !body.target_id) {
      return NextResponse.json(
        { error: "body, target_type, and target_id are required" },
        { status: 400 },
      );
    }

    // In demo mode comments are accepted but not persisted to a database.
    return NextResponse.json({
      success: true,
      comment: {
        id: `demo-${Date.now()}`,
        body: body.body.trim(),
        target_type: body.target_type,
        target_id: body.target_id,
        author: { id: user.id, display_name: user.display_name },
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
