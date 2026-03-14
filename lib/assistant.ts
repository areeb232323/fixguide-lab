import { z } from "zod";
import { AiChatRequestSchema, AiChatResponseSchema, type AiChatRequest } from "@contracts/schemas";

const AssistantSeedSchema = z.object({
  guides: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      summary: z.string(),
      tags: z.array(z.string()),
      excerpt: z.string(),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      summary: z.string(),
      tags: z.array(z.string()),
      excerpt: z.string(),
      cost_range: z.string(),
    }),
  ),
  notes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      body: z.string(),
      targetType: z.enum(["guide", "project", "comment"]),
    }),
  ),
  officialSources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      topic: z.string(),
    }),
  ),
});

export type AssistantSeed = z.infer<typeof AssistantSeedSchema>;

function score(query: string, text: string, tags: string[] = []) {
  const tokens = query.toLowerCase().split(/\s+/).filter((token) => token.length > 2);
  const haystack = `${text} ${tags.join(" ")}`.toLowerCase();
  return tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
}

function warningsFor(question: string) {
  const lower = question.toLowerCase();
  const warnings: string[] = [];

  if (/(partition|reinstall|erase|dual boot|dual-boot|format|bios|uefi)/.test(lower)) {
    warnings.push("Back up important files and confirm recovery media before changing partitions, reinstalling an OS, or altering BIOS/UEFI settings.");
  }
  if (/(battery|lipo|mains|wall power|high voltage|soldering iron)/.test(lower)) {
    warnings.push("Keep hardware builds in low-voltage territory unless you have an isolation plan, PPE, and a verified shutdown path.");
  }

  return warnings;
}

export function buildAssistantFallback(request: AiChatRequest, seedInput: AssistantSeed) {
  const seed = AssistantSeedSchema.parse(seedInput);
  const query = request.message.toLowerCase();

  const guides = seed.guides
    .map((guide) => ({ ...guide, rank: score(query, `${guide.title} ${guide.summary} ${guide.excerpt}`, guide.tags) }))
    .filter((guide) => guide.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 2);

  const projects = seed.projects
    .map((project) => ({ ...project, rank: score(query, `${project.title} ${project.summary} ${project.excerpt}`, project.tags) }))
    .filter((project) => project.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 2);

  const notes = seed.notes
    .map((note) => ({ ...note, rank: score(query, `${note.title} ${note.body}`) }))
    .filter((note) => note.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 2);

  return AiChatResponseSchema.parse({
    answer_markdown:
      guides.length || projects.length || notes.length
        ? [
            guides.length
              ? `**Guides to open first**\n${guides.map((guide) => `- ${guide.title}: ${guide.summary}`).join("\n")}`
              : null,
            projects.length
              ? `**Relevant projects**\n${projects.map((project) => `- ${project.title} (${project.cost_range}): ${project.summary}`).join("\n")}`
              : null,
            notes.length
              ? `**Community notes worth checking**\n${notes.map((note) => `- ${note.body}`).join("\n")}`
              : null,
          ]
            .filter(Boolean)
            .join("\n\n")
        : "I could not match that question tightly to the current site seed data yet. Try naming the OS, error, or project goal you are working with.",
    citations: [
      ...guides.map((guide) => ({ type: "guide" as const, title: guide.title, url_or_id: `/guides/${guide.slug}` })),
      ...projects.map((project) => ({ type: "project" as const, title: project.title, url_or_id: `/projects/${project.slug}` })),
      ...notes.map((note) => ({ type: "note" as const, title: note.title, url_or_id: note.id })),
      ...seed.officialSources
        .filter((source) => query.includes(source.topic.split(" ")[0]))
        .slice(0, 1)
        .map((source) => ({ type: "official" as const, title: source.title, url_or_id: source.url })),
    ],
    safety_warnings: warningsFor(request.message),
    follow_up_questions: [
      warningsFor(request.message).length ? "Have you already made a verified backup or rollback image?" : null,
      query.includes("budget") ? "What budget ceiling should I optimize around?" : null,
      "Do you want the next three actions only?",
    ].filter(Boolean),
  });
}

export function parseAssistantRequest(input: unknown) {
  return AiChatRequestSchema.parse(input);
}
