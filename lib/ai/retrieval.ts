import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { AiCitation } from "@contracts/schemas";

interface RetrievalResult {
  context: string;
  citations: AiCitation[];
}

/**
 * Retrieve relevant guides, projects, and community notes
 * for the AI assistant to use as context.
 */
export async function retrieveContext(
  query: string,
  contextType?: string,
  contextId?: string,
): Promise<RetrievalResult> {
  const supabase = createSupabaseAdmin();
  const citations: AiCitation[] = [];
  const contextParts: string[] = [];

  // If a specific guide/project is referenced, fetch it first
  if (contextType && contextId) {
    const table = contextType === "guide" ? "guides" : "projects";
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("id", contextId)
      .single();

    if (data) {
      contextParts.push(
        `--- Referenced ${contextType}: ${data.title} ---\n${data.content_markdown}\n`,
      );
      citations.push({
        type: contextType as "guide" | "project",
        title: data.title,
        url_or_id: `/${table}/${data.slug}`,
      });
    }
  }

  // Search guides by text similarity
  const { data: guides } = await supabase
    .from("guides")
    .select("id, slug, title, summary, content_markdown, tags")
    .eq("published", true)
    .eq("hidden", false)
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .limit(3);

  if (guides) {
    for (const g of guides) {
      // Skip if already included as context
      if (contextId && g.id === contextId) continue;
      contextParts.push(
        `--- Guide: ${g.title} ---\nSummary: ${g.summary}\n${g.content_markdown.slice(0, 1000)}\n`,
      );
      citations.push({
        type: "guide",
        title: g.title,
        url_or_id: `/guides/${g.slug}`,
      });
    }
  }

  // Search projects by text similarity
  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, summary, content_markdown, tags, cost_range_min, cost_range_max")
    .eq("published", true)
    .eq("hidden", false)
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
    .limit(3);

  if (projects) {
    for (const p of projects) {
      if (contextId && p.id === contextId) continue;
      contextParts.push(
        `--- Project: ${p.title} ($${p.cost_range_min}-$${p.cost_range_max}) ---\nSummary: ${p.summary}\n${p.content_markdown.slice(0, 1000)}\n`,
      );
      citations.push({
        type: "project",
        title: p.title,
        url_or_id: `/projects/${p.slug}`,
      });
    }
  }

  // Search relevant community notes
  const { data: notes } = await supabase
    .from("comments")
    .select("id, body, target_type, target_id")
    .eq("hidden", false)
    .ilike("body", `%${query}%`)
    .limit(3);

  if (notes) {
    for (const n of notes) {
      contextParts.push(`--- Community note ---\n${n.body}\n`);
      citations.push({
        type: "note",
        title: `Community note on ${n.target_type}`,
        url_or_id: n.id,
      });
    }
  }

  // Fetch official sources for citation
  const { data: officialSources } = await supabase
    .from("official_sources")
    .select("title, url, topic");

  if (officialSources) {
    const relevant = officialSources.filter(
      (s) =>
        query.toLowerCase().includes(s.topic.toLowerCase()) ||
        s.topic.toLowerCase().split("-").some((t: string) => query.toLowerCase().includes(t)),
    );
    for (const s of relevant) {
      citations.push({
        type: "official",
        title: s.title,
        url_or_id: s.url,
      });
    }
  }

  return {
    context: contextParts.join("\n\n") || "No specific content found in our database for this query.",
    citations,
  };
}
