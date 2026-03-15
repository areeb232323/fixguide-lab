import { NextRequest, NextResponse } from "next/server";
import { AiChatRequestSchema } from "@contracts/schemas";
import type { AiChatResponse } from "@contracts/schemas";
import { parseBody } from "@/lib/api-utils";
import { getAuthUser } from "@/lib/auth";
import { createRequestLogger } from "@/lib/logger";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { checkSafety } from "@/lib/ai/safety";
import { retrieveContext } from "@/lib/ai/retrieval";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  const log = createRequestLogger("POST", "/api/ai/chat", user?.id);
  log.info("AI chat request");

  // Rate limit: stricter for AI endpoint
  const rl = checkRateLimit(getRateLimitKey(request, user?.id), "ai");
  if (rl) return rl;

  const parsed = await parseBody(request, AiChatRequestSchema);
  if ("error" in parsed) return parsed.error;

  const { message, context_type, context_id } = parsed.data;

  // ---- Safety gate ----
  const safety = checkSafety(message);

  if (safety.blocked) {
    log.warn("AI request blocked by safety gate", { message: message.slice(0, 100) });
    const response: AiChatResponse = {
      answer_markdown:
        "I'm unable to help with that request. It involves activities that go against our safety policy (bypassing licensing, creating malicious software, etc.). Please ask something else!",
      citations: [],
      safety_warnings: safety.warnings,
      follow_up_questions: [
        "What tech support topic can I help you with?",
        "Would you like help finding a beginner project?",
      ],
    };
    return NextResponse.json(response);
  }

  // ---- Retrieval ----
  let context = "No specific content found in our database for this query.";
  let citations: AiChatResponse["citations"] = [];

  try {
    const retrieval = await retrieveContext(message, context_type, context_id);
    context = retrieval.context;
    citations = retrieval.citations;
  } catch {
    log.warn("Retrieval failed, using fallback");
  }

  // ---- Generate response ----
  // In production, this would call an LLM API (e.g., Anthropic Claude).
  // For MVP, we build a structured response from retrieved context.
  const response = generateMvpResponse(message, context, citations, safety.warnings);

  log.info("AI chat response generated", {
    citationCount: response.citations.length,
    warningCount: response.safety_warnings.length,
  });

  return NextResponse.json(response);
}

/**
 * MVP response generator using retrieved context.
 * Replace with actual LLM call in production.
 */
function generateMvpResponse(
  question: string,
  context: string,
  citations: AiChatResponse["citations"],
  safetyWarnings: string[],
): AiChatResponse {
  const lowerQ = question.toLowerCase();

  // Generate contextual answer
  let answer: string;

  if (context.includes("No specific content found")) {
    answer =
      "I couldn't find specific content in our guides or projects matching your question. " +
      "Try browsing our [guides](/guides) or [projects](/projects) pages, or rephrase your question.";
  } else {
    answer =
      "Based on our guides and community knowledge, here's what I found:\n\n" +
      context.split("---")
        .filter((s) => s.trim())
        .map((section) => {
          const lines = section.trim().split("\n");
          const title = lines[0]?.trim() || "Info";
          return `**${title}**\n${lines.slice(1).join("\n").trim().slice(0, 500)}`;
        })
        .slice(0, 3)
        .join("\n\n---\n\n");
  }

  // Generate follow-up questions based on topic
  const followUps: string[] = [];
  if (lowerQ.includes("linux") || lowerQ.includes("windows")) {
    followUps.push("Do you need help with dual-booting?");
    followUps.push("Would you like a backup checklist before migrating?");
  }
  if (lowerQ.includes("arduino") || lowerQ.includes("project")) {
    followUps.push("What's your budget for this project?");
    followUps.push("Would you like to see similar beginner projects?");
  }
  if (lowerQ.includes("temperature") || lowerQ.includes("sensor")) {
    followUps.push("Do you want to add data logging to this project?");
  }
  if (followUps.length === 0) {
    followUps.push(
      "Would you like more detail on any of these topics?",
      "Can I help you find a specific guide or project?",
    );
  }

  return {
    answer_markdown: answer,
    citations,
    safety_warnings: safetyWarnings,
    follow_up_questions: followUps.slice(0, 3),
  };
}
