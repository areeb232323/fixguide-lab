import { z } from "zod";
import {
  TestingStatusEnum,
  DifficultyEnum,
  UserRoleEnum,
  ReportReasonEnum,
  ReportStatusEnum,
  ModActionTypeEnum,
  ContentTypeEnum,
  OsEnum,
} from "./enums";

// ---------- User Profile ----------

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  display_name: z.string().min(1).max(100),
  role: UserRoleEnum,
  avatar_url: z.string().url().nullable(),
  bio: z.string().max(500).nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

// ---------- Guide ----------

export const GuideSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  summary: z.string().max(1000),
  content_markdown: z.string(),
  difficulty: DifficultyEnum,
  time_estimate_minutes: z.number().int().positive(),
  os: OsEnum,
  tags: z.array(z.string()),
  testing_status: TestingStatusEnum,
  last_reviewed_date: z.string().datetime().nullable(),
  author_id: z.string().uuid(),
  published: z.boolean(),
  hidden: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Guide = z.infer<typeof GuideSchema>;

export const GuideListQuerySchema = z.object({
  query: z.string().optional(),
  difficulty: DifficultyEnum.optional(),
  os: OsEnum.optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type GuideListQuery = z.infer<typeof GuideListQuerySchema>;

// ---------- Project ----------

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  summary: z.string().max(1000),
  content_markdown: z.string(),
  difficulty: DifficultyEnum,
  time_estimate_minutes: z.number().int().positive(),
  cost_range_min: z.number().nonnegative(),
  cost_range_max: z.number().nonnegative(),
  tags: z.array(z.string()),
  testing_status: TestingStatusEnum,
  last_reviewed_date: z.string().datetime().nullable(),
  author_id: z.string().uuid(),
  published: z.boolean(),
  hidden: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectListQuerySchema = z.object({
  query: z.string().optional(),
  difficulty: DifficultyEnum.optional(),
  costMax: z.coerce.number().nonnegative().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type ProjectListQuery = z.infer<typeof ProjectListQuerySchema>;

// ---------- Part ----------

export const PartSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(500),
  price_budget: z.number().nonnegative(),
  price_best: z.number().nonnegative(),
  url: z.string().url().nullable(),
  project_id: z.string().uuid(),
  created_at: z.string().datetime(),
});
export type Part = z.infer<typeof PartSchema>;

// ---------- Comment / Note ----------

export const CommentSchema = z.object({
  id: z.string().uuid(),
  body: z.string().min(1).max(5000),
  author_id: z.string().uuid(),
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  hidden: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const CreateCommentSchema = z.object({
  body: z.string().min(1).max(5000),
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
});
export type CreateComment = z.infer<typeof CreateCommentSchema>;

// ---------- Vote ----------

export const VoteSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
  created_at: z.string().datetime(),
});
export type Vote = z.infer<typeof VoteSchema>;

export const CreateVoteSchema = z.object({
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
});
export type CreateVote = z.infer<typeof CreateVoteSchema>;

// ---------- Verification / BuildLog ----------

export const VerificationLogSchema = z.object({
  id: z.string().uuid(),
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  author_id: z.string().uuid(),
  notes: z.string().max(5000),
  photo_urls: z.array(z.string().url()),
  verified: z.boolean(),
  created_at: z.string().datetime(),
});
export type VerificationLog = z.infer<typeof VerificationLogSchema>;

// ---------- Report ----------

export const ReportSchema = z.object({
  id: z.string().uuid(),
  reporter_id: z.string().uuid(),
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  reason: ReportReasonEnum,
  details: z.string().max(2000),
  status: ReportStatusEnum,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Report = z.infer<typeof ReportSchema>;

export const CreateReportSchema = z.object({
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  reason: ReportReasonEnum,
  details: z.string().max(2000),
});
export type CreateReport = z.infer<typeof CreateReportSchema>;

// ---------- Moderator Action ----------

export const ModeratorActionSchema = z.object({
  id: z.string().uuid(),
  moderator_id: z.string().uuid(),
  report_id: z.string().uuid().nullable(),
  action_type: ModActionTypeEnum,
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  reason: z.string().max(2000),
  created_at: z.string().datetime(),
});
export type ModeratorAction = z.infer<typeof ModeratorActionSchema>;

export const CreateModActionSchema = z.object({
  report_id: z.string().uuid().nullable(),
  action_type: ModActionTypeEnum,
  target_type: ContentTypeEnum,
  target_id: z.string().uuid(),
  reason: z.string().min(1).max(2000),
});
export type CreateModAction = z.infer<typeof CreateModActionSchema>;

// ---------- AI Assistant ----------

export const AiChatRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  context_type: ContentTypeEnum.optional(),
  context_id: z.string().uuid().optional(),
});
export type AiChatRequest = z.infer<typeof AiChatRequestSchema>;

export const AiCitationSchema = z.object({
  type: z.enum(["guide", "project", "note", "official"]),
  title: z.string(),
  url_or_id: z.string(),
});
export type AiCitation = z.infer<typeof AiCitationSchema>;

export const AiChatResponseSchema = z.object({
  answer_markdown: z.string(),
  citations: z.array(AiCitationSchema),
  safety_warnings: z.array(z.string()),
  follow_up_questions: z.array(z.string()),
});
export type AiChatResponse = z.infer<typeof AiChatResponseSchema>;

// ---------- Assistant Feedback ----------

export const AssistantFeedbackSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  conversation_id: z.string().uuid().nullable(),
  thumbs_up: z.boolean(),
  reason: z.string().max(1000).nullable(),
  created_at: z.string().datetime(),
});
export type AssistantFeedback = z.infer<typeof AssistantFeedbackSchema>;
