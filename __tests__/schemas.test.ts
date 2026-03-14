import { describe, it, expect } from "vitest";
import {
  GuideListQuerySchema,
  ProjectListQuerySchema,
  CreateCommentSchema,
  CreateVoteSchema,
  CreateReportSchema,
  CreateModActionSchema,
  AiChatRequestSchema,
  AiChatResponseSchema,
} from "../packages/contracts/src/schemas";

describe("GuideListQuerySchema", () => {
  it("accepts valid query params", () => {
    const result = GuideListQuerySchema.safeParse({
      query: "linux",
      difficulty: "Beginner",
      os: "Linux",
      page: "1",
      limit: "10",
    });
    expect(result.success).toBe(true);
  });

  it("applies defaults for missing page/limit", () => {
    const result = GuideListQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("rejects invalid difficulty", () => {
    const result = GuideListQuerySchema.safeParse({ difficulty: "Expert" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid OS", () => {
    const result = GuideListQuerySchema.safeParse({ os: "FreeBSD" });
    expect(result.success).toBe(false);
  });

  it("coerces string page/limit to numbers", () => {
    const result = GuideListQuerySchema.safeParse({ page: "3", limit: "15" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(15);
    }
  });

  it("rejects limit > 50", () => {
    const result = GuideListQuerySchema.safeParse({ limit: "100" });
    expect(result.success).toBe(false);
  });
});

describe("ProjectListQuerySchema", () => {
  it("accepts valid params with costMax", () => {
    const result = ProjectListQuerySchema.safeParse({
      costMax: "50",
      difficulty: "Intermediate",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.costMax).toBe(50);
    }
  });

  it("rejects negative costMax", () => {
    const result = ProjectListQuerySchema.safeParse({ costMax: "-10" });
    expect(result.success).toBe(false);
  });
});

describe("CreateCommentSchema", () => {
  it("accepts valid comment", () => {
    const result = CreateCommentSchema.safeParse({
      body: "Great guide!",
      target_type: "guide",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty body", () => {
    const result = CreateCommentSchema.safeParse({
      body: "",
      target_type: "guide",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid target_type", () => {
    const result = CreateCommentSchema.safeParse({
      body: "test",
      target_type: "article",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID", () => {
    const result = CreateCommentSchema.safeParse({
      body: "test",
      target_type: "guide",
      target_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});

describe("CreateVoteSchema", () => {
  it("accepts upvote (+1)", () => {
    const result = CreateVoteSchema.safeParse({
      target_type: "comment",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      value: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts downvote (-1)", () => {
    const result = CreateVoteSchema.safeParse({
      target_type: "guide",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      value: -1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects value of 0", () => {
    const result = CreateVoteSchema.safeParse({
      target_type: "guide",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      value: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects value of 2", () => {
    const result = CreateVoteSchema.safeParse({
      target_type: "guide",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      value: 2,
    });
    expect(result.success).toBe(false);
  });
});

describe("CreateReportSchema", () => {
  it("accepts valid report", () => {
    const result = CreateReportSchema.safeParse({
      target_type: "comment",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      reason: "spam",
      details: "This is spam content",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid reason", () => {
    const result = CreateReportSchema.safeParse({
      target_type: "comment",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      reason: "boring",
      details: "test",
    });
    expect(result.success).toBe(false);
  });
});

describe("CreateModActionSchema", () => {
  it("accepts valid mod action", () => {
    const result = CreateModActionSchema.safeParse({
      report_id: "550e8400-e29b-41d4-a716-446655440000",
      action_type: "hide_content",
      target_type: "comment",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      reason: "Violates community guidelines",
    });
    expect(result.success).toBe(true);
  });

  it("accepts null report_id", () => {
    const result = CreateModActionSchema.safeParse({
      report_id: null,
      action_type: "warn_user",
      target_type: "guide",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      reason: "Inaccurate safety info",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty reason", () => {
    const result = CreateModActionSchema.safeParse({
      report_id: null,
      action_type: "hide_content",
      target_type: "comment",
      target_id: "550e8400-e29b-41d4-a716-446655440000",
      reason: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("AiChatRequestSchema", () => {
  it("accepts message with context", () => {
    const result = AiChatRequestSchema.safeParse({
      message: "How do I install Linux?",
      context_type: "guide",
      context_id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("accepts message without context", () => {
    const result = AiChatRequestSchema.safeParse({
      message: "What beginner project should I try?",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = AiChatRequestSchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });
});

describe("AiChatResponseSchema", () => {
  it("validates full response shape", () => {
    const result = AiChatResponseSchema.safeParse({
      answer_markdown: "Here is the answer.",
      citations: [
        { type: "guide", title: "Linux Guide", url_or_id: "/guides/linux" },
      ],
      safety_warnings: ["Back up your data first!"],
      follow_up_questions: ["Need more detail?"],
    });
    expect(result.success).toBe(true);
  });
});
