import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { DifficultyEnum, OsEnum, TestingStatusEnum } from "@contracts/enums";
import { GuideSchema, ProjectSchema } from "@contracts/schemas";
import { estimateReadTime, extractHeadings, type TocItem } from "@/lib/utils";

const baseFrontmatterSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1).max(300),
  summary: z.string().min(1).max(1000),
  difficulty: DifficultyEnum,
  time_estimate_minutes: z.number().int().positive(),
  tags: z.array(z.string()).min(1),
  testing_status: TestingStatusEnum,
  last_reviewed_date: z.string().datetime().nullable(),
  author_id: z.string().uuid(),
  published: z.boolean().default(true),
  hidden: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  kicker: z.string().min(1).max(120),
  cover: z.string().min(1),
});

const guideFrontmatterSchema = baseFrontmatterSchema.extend({
  os: OsEnum,
});

const projectFrontmatterSchema = baseFrontmatterSchema.extend({
  cost_range_min: z.number().nonnegative(),
  cost_range_max: z.number().nonnegative(),
  project_type: z.string().min(1).max(120),
});

export type GuideContent = z.infer<typeof GuideSchema> & {
  collection: "guide";
  rawBody: string;
  headings: TocItem[];
  kicker: string;
  cover: string;
  estimated_read_minutes: number;
};

export type ProjectContent = z.infer<typeof ProjectSchema> & {
  collection: "project";
  rawBody: string;
  headings: TocItem[];
  kicker: string;
  cover: string;
  project_type: string;
  estimated_read_minutes: number;
};

async function readCollection<TFrontmatter extends z.ZodRawShape>(
  directory: string,
  schema: z.ZodObject<TFrontmatter>,
) {
  const absoluteDirectory = path.join(process.cwd(), "src", "content", directory);

  let entries;
  try {
    entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });
  } catch {
    // Directory missing (e.g., not bundled in serverless). Return empty.
    return [];
  }

  const results = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    try {
      const filePath = path.join(absoluteDirectory, entry.name);
      const source = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(source);
      results.push({
        frontmatter: schema.parse(data),
        rawBody: content.trim(),
      });
    } catch {
      // Skip files that fail to parse rather than crash the entire collection
    }
  }
  return results;
}

export const getAllGuides = cache(async () => {
  const collection = await readCollection("guides", guideFrontmatterSchema);

  return collection
    .map(({ frontmatter, rawBody }) => {
      const baseGuide = GuideSchema.parse({
        ...frontmatter,
        content_markdown: rawBody,
      });

      return {
        ...baseGuide,
        collection: "guide" as const,
        rawBody,
        headings: extractHeadings(rawBody),
        kicker: frontmatter.kicker,
        cover: frontmatter.cover,
        estimated_read_minutes: estimateReadTime(rawBody),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
});

export const getGuideBySlug = cache(async (slug: string) => {
  const guides = await getAllGuides();
  return guides.find((guide) => guide.slug === slug) ?? null;
});

export const getAllProjects = cache(async () => {
  const collection = await readCollection("projects", projectFrontmatterSchema);

  return collection
    .map(({ frontmatter, rawBody }) => {
      const baseProject = ProjectSchema.parse({
        ...frontmatter,
        content_markdown: rawBody,
      });

      return {
        ...baseProject,
        collection: "project" as const,
        rawBody,
        headings: extractHeadings(rawBody),
        kicker: frontmatter.kicker,
        cover: frontmatter.cover,
        project_type: frontmatter.project_type,
        estimated_read_minutes: estimateReadTime(rawBody),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
});

export const getProjectBySlug = cache(async (slug: string) => {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});
