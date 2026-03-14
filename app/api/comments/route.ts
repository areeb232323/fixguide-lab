import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateCommentSchema } from "@contracts/schemas";
import { parseBody } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const log = createRequestLogger("POST", "/api/comments", user.id);
  log.info("Creating comment");

  const rl = checkRateLimit(getRateLimitKey(request, user.id));
  if (rl) return rl;

  const parsed = await parseBody(request, CreateCommentSchema);
  if ("error" in parsed) return parsed.error;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      body: parsed.data.body,
      author_id: user.id,
      target_type: parsed.data.target_type,
      target_id: parsed.data.target_id,
    })
    .select()
    .single();

  if (error) {
    log.error("Failed to create comment", { dbError: error.message });
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }

  log.info("Comment created", { commentId: data.id });
  return NextResponse.json({ data }, { status: 201 });
}
