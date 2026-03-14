import { z } from "zod";

export const TestingStatusEnum = z.enum([
  "Draft",
  "InternallyTested",
  "CommunityVerified",
]);
export type TestingStatus = z.infer<typeof TestingStatusEnum>;

export const DifficultyEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const UserRoleEnum = z.enum([
  "guest",
  "user",
  "contributor",
  "moderator",
  "admin",
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const ReportReasonEnum = z.enum([
  "inaccurate",
  "unsafe",
  "spam",
  "harassment",
  "other",
]);
export type ReportReason = z.infer<typeof ReportReasonEnum>;

export const ReportStatusEnum = z.enum([
  "pending",
  "reviewing",
  "resolved",
  "dismissed",
]);
export type ReportStatus = z.infer<typeof ReportStatusEnum>;

export const ModActionTypeEnum = z.enum([
  "hide_content",
  "warn_user",
  "ban_user",
  "dismiss_report",
  "edit_content",
  "restore_content",
]);
export type ModActionType = z.infer<typeof ModActionTypeEnum>;

export const ContentTypeEnum = z.enum(["guide", "project", "comment"]);
export type ContentType = z.infer<typeof ContentTypeEnum>;

export const OsEnum = z.enum(["Windows", "Linux", "macOS", "Any"]);
export type Os = z.infer<typeof OsEnum>;
