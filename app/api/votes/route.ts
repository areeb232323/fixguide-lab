import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateVoteSchema } from "@contracts/schemas";
import { parseBody } from "@/lib/api-utils";
import { requireAuth } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const log = createRequestLogger("POST", "/api/votes", user.id);
  log.info("Upserting vote");

  const rl = checkRateLimit(getRateLimitKey(request, user.id));
  if (rl) return rl;

  const parsed = await parseBody(request, CreateVoteSchema);
  if ("error" in parsed) return parsed.error;

  const supabase = await createSupabaseServerClient();

  // Upsert: if user already voted on this target, update; otherwise insert
  const { data, error } = await supabase
    .from("votes")
    .upsert(
      {
        user_id: user.id,
        target_type: parsed.data.target_type,
        target_id: parsed.data.target_id,
        value: parsed.data.value,
      },
      { onConflict: "user_id,target_type,target_id" },
    )
    .select()
    .single();

  if (error) {
    log.error("Failed to upsert vote", { dbError: error.message });
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }

  log.info("Vote saved", { voteId: data.id, value: data.value });
  return NextResponse.json({ data });
}
