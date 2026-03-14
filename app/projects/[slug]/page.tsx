import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";
import { getProjectDetail } from "@/lib/api-client";
import { Breadcrumbs, TestingStatusBadge, DifficultyBadge, DetailMeta, TableOfContents } from "@/components/site-ui";
import { MdxRenderer } from "@/components/mdx-renderer";
import { AiChatPanel } from "@/components/ai-chat-panel";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return { title: `${project.title} — FixGuide Lab`, description: project.summary };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const detail = await getProjectDetail(slug);
  const parts = detail?.parts ?? [];

  const budgetTotal = parts.reduce((sum, p) => sum + p.price_budget, 0);
  const bestTotal = parts.reduce((sum, p) => sum + p.price_best, 0);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.title }]} />

      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-2">
          <TestingStatusBadge status={project.testing_status} />
          <DifficultyBadge difficulty={project.difficulty} />
        </div>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{project.title}</h1>
        <p className="mt-3 text-lg leading-8 text-[var(--muted)]">{project.summary}</p>
        <div className="mt-4">
          <DetailMeta
            minutes={project.time_estimate_minutes}
            cost={{ min: project.cost_range_min, max: project.cost_range_max }}
            reviewed={project.last_reviewed_date}
          />
        </div>
      </div>

      {/* Content + TOC */}
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div className="space-y-10">
          <MdxRenderer source={project.rawBody} />

          {/* Parts Table */}
          {parts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold">Parts List</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-left text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      <th className="py-3 pr-4">Part</th>
                      <th className="py-3 pr-4">Description</th>
                      <th className="py-3 pr-4 text-right">Budget</th>
                      <th className="py-3 text-right">Best Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part) => (
                      <tr key={part.id} className="border-b border-[var(--line)]">
                        <td className="py-3 pr-4 font-medium">{part.name}</td>
                        <td className="py-3 pr-4 text-[var(--muted)]">{part.description}</td>
                        <td className="py-3 pr-4 text-right">${part.price_budget}</td>
                        <td className="py-3 text-right">${part.price_best}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="py-3" colSpan={2}>Total</td>
                      <td className="py-3 text-right">${budgetTotal}</td>
                      <td className="py-3 text-right">${bestTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {project.headings.length > 0 && (
          <aside className="hidden lg:block">
            <TableOfContents items={project.headings} />
          </aside>
        )}
      </div>

      {/* AI Chat */}
      <AiChatPanel contextId={project.id} contextType="project" />
    </div>
  );
}
