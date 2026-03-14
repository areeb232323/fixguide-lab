import { z } from "zod";
import {
  CommentSchema,
  CreateCommentSchema,
  CreateModActionSchema,
  CreateReportSchema,
  CreateVoteSchema,
  GuideListQuerySchema,
  GuideSchema,
  PartSchema,
  ProjectListQuerySchema,
  ProjectSchema,
  ReportSchema,
  type CreateComment,
  type CreateModAction,
  type CreateReport,
  type CreateVote,
  type GuideListQuery,
  type ProjectListQuery,
} from "@contracts/schemas";
import { buildAssistantFallback, type AssistantSeed } from "@/lib/assistant";
import { getAllGuides, getAllProjects, getGuideBySlug, getProjectBySlug } from "@/lib/content";
import {
  communityNotes,
  currentProfile,
  getAuthorById,
  getNotesForTarget,
  getPartsForProject,
  getReportsForDashboard,
  officialSources,
} from "@/lib/site-data";
import { formatCurrencyRange, pickExcerpt } from "@/lib/utils";

const userProfilePreviewSchema = z.object({
  display_name: z.string().nullable(),
  avatar_url: z.string().nullable(),
});

export const communityNoteSchema = CommentSchema.extend({
  helpful_count: z.number().int().nonnegative(),
  unhelpful_count: z.number().int().nonnegative(),
  user_profiles: userProfilePreviewSchema,
});

const guideListResponseSchema = z.object({
  data: z.array(GuideSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

const projectListResponseSchema = z.object({
  data: z.array(ProjectSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

const guideDetailResponseSchema = z.object({
  data: GuideSchema,
  comments: z.array(communityNoteSchema),
});

const projectDetailResponseSchema = z.object({
  data: ProjectSchema,
  parts: z.array(PartSchema),
  comments: z.array(communityNoteSchema),
});

const reportDashboardSchema = ReportSchema.extend({
  reporter: z.object({
    id: z.string().uuid(),
    display_name: z.string(),
    role: z.string(),
  }),
});

export async function listGuides(input: Partial<GuideListQuery> = {}) {
  const query = GuideListQuerySchema.parse(input);
  const guides = await getAllGuides();
  const filtered = guides.filter((guide) => {
    if (!guide.published || guide.hidden) return false;
    if (query.difficulty && guide.difficulty !== query.difficulty) return false;
    if (query.os && guide.os !== query.os) return false;
    if (query.tag && !guide.tags.includes(query.tag)) return false;
    if (query.query) {
      const haystack = `${guide.title} ${guide.summary} ${guide.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(query.query.toLowerCase())) return false;
    }
    return true;
  });
  const start = (query.page - 1) * query.limit;

  return guideListResponseSchema.parse({
    data: filtered.slice(start, start + query.limit),
    total: filtered.length,
    page: query.page,
    limit: query.limit,
  });
}

export async function getGuideDetail(slug: string) {
  const guide = await getGuideBySlug(slug);
  if (!guide) return null;

  return guideDetailResponseSchema.parse({
    data: guide,
    comments: getNotesForTarget(guide.id),
  });
}

export async function listProjects(input: Partial<ProjectListQuery> = {}) {
  const query = ProjectListQuerySchema.parse(input);
  const projects = await getAllProjects();
  const filtered = projects.filter((project) => {
    if (!project.published || project.hidden) return false;
    if (query.difficulty && project.difficulty !== query.difficulty) return false;
    if (query.costMax !== undefined && project.cost_range_max > query.costMax) return false;
    if (query.tag && !project.tags.includes(query.tag)) return false;
    if (query.query) {
      const haystack = `${project.title} ${project.summary} ${project.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(query.query.toLowerCase())) return false;
    }
    return true;
  });
  const start = (query.page - 1) * query.limit;

  return projectListResponseSchema.parse({
    data: filtered.slice(start, start + query.limit),
    total: filtered.length,
    page: query.page,
    limit: query.limit,
  });
}

export async function getProjectDetail(slug: string) {
  const project = await getProjectBySlug(slug);
  if (!project) return null;

  return projectDetailResponseSchema.parse({
    data: project,
    parts: getPartsForProject(project.id),
    comments: getNotesForTarget(project.id),
  });
}

export async function getAssistantSeed(): Promise<AssistantSeed> {
  const [guides, projects] = await Promise.all([getAllGuides(), getAllProjects()]);

  return {
    guides: guides.map((guide) => ({
      id: guide.id,
      title: guide.title,
      slug: guide.slug,
      summary: guide.summary,
      tags: guide.tags,
      excerpt: pickExcerpt(guide.rawBody, 180),
    })),
    projects: projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      tags: project.tags,
      excerpt: pickExcerpt(project.rawBody, 180),
      cost_range: formatCurrencyRange(project.cost_range_min, project.cost_range_max),
    })),
    notes: communityNotes.map((note) => ({
      id: note.id,
      title: `Community note from ${note.user_profiles.display_name ?? "member"}`,
      body: note.body,
      targetType: note.target_type,
    })),
    officialSources,
  };
}

export async function getModerationQueue() {
  return getReportsForDashboard().map((report) =>
    reportDashboardSchema.parse({
      ...report,
      reporter: {
        id: report.reporter.id,
        display_name: report.reporter.display_name,
        role: report.reporter.role,
      },
    }),
  );
}

export function previewNewComment(input: CreateComment) {
  const parsed = CreateCommentSchema.parse(input);

  return communityNoteSchema.parse({
    id: "90000000-0000-4000-8000-000000000001",
    body: parsed.body,
    author_id: currentProfile.id,
    target_type: parsed.target_type,
    target_id: parsed.target_id,
    hidden: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    helpful_count: 0,
    unhelpful_count: 0,
    user_profiles: {
      display_name: currentProfile.display_name,
      avatar_url: currentProfile.avatar_url,
    },
  });
}

export function validateVote(input: CreateVote) {
  return CreateVoteSchema.parse(input);
}

export function validateReport(input: CreateReport) {
  return CreateReportSchema.parse(input);
}

export function validateModerationAction(input: CreateModAction) {
  return CreateModActionSchema.parse(input);
}

export async function getAssistantFallbackAnswer(message: string, contextId?: string) {
  const seed = await getAssistantSeed();
  const contextType =
    contextId && seed.guides.some((guide) => guide.id === contextId)
      ? "guide"
      : contextId && seed.projects.some((project) => project.id === contextId)
        ? "project"
        : undefined;

  return buildAssistantFallback(
    {
      message,
      context_id: contextId,
      context_type: contextType,
    },
    seed,
  );
}

export function getProfileForUi() {
  return getAuthorById(currentProfile.id);
}
