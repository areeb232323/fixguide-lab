import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateModActionSchema } from "@contracts/schemas";
import { parseBody } from "@/lib/api-utils";
import { requireRole } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const authResult = await requireRole("moderator", "admin");
  if ("error" in authResult) return authResult.error;
  const { user } = authResult;

  const log = createRequestLogger("POST", "/api/mod/actions", user.id);
  log.info("Creating moderator action");

  const rl = checkRateLimit(getRateLimitKey(request, user.id));
  if (rl) return rl;

  const parsed = await parseBody(request, CreateModActionSchema);
  if ("error" in parsed) return parsed.error;

  const supabase = await createSupabaseServerClient();

  // Insert the moderator action (audit log)
  const { data: action, error: actionError } = await supabase
    .from("moderator_actions")
    .insert({
      moderator_id: user.id,
      report_id: parsed.data.report_id,
      action_type: parsed.data.action_type,
      target_type: parsed.data.target_type,
      target_id: parsed.data.target_id,
      reason: parsed.data.reason,
    })
    .select()
    .single();

  if (actionError) {
    log.error("Failed to create mod action", { dbError: actionError.message });
    return NextResponse.json({ error: "Failed to create action" }, { status: 500 });
  }

  // Apply the action
  const actionType = parsed.data.action_type;
  const targetType = parsed.data.target_type;
  const targetId = parsed.data.target_id;

  if (actionType === "hide_content") {
    const table =
      targetType === "guide"
        ? "guides"
        : targetType === "project"
          ? "projects"
          : "comments";
    await supabase.from(table).update({ hidden: true }).eq("id", targetId);
  } else if (actionType === "restore_content") {
    const table =
      targetType === "guide"
        ? "guides"
        : targetType === "project"
          ? "projects"
          : "comments";
    await supabase.from(table).update({ hidden: false }).eq("id", targetId);
  }

  // If linked to a report, update report status
  if (parsed.data.report_id) {
    const newStatus =
      actionType === "dismiss_report" ? "dismissed" : "resolved";
    await supabase
      .from("reports")
      .update({ status: newStatus })
      .eq("id", parsed.data.report_id);
  }

  log.info("Mod action applied", {
    actionId: action.id,
    actionType,
    targetType,
    targetId,
  });

  return NextResponse.json({ data: action }, { status: 201 });
}
