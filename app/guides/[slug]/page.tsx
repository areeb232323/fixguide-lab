import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/content";
import { Breadcrumbs, TestingStatusBadge, DifficultyBadge, DetailMeta, TableOfContents } from "@/components/site-ui";
import { MdxRenderer } from "@/components/mdx-renderer";
import { AiChatPanel } from "@/components/ai-chat-panel";
import { CommentForm } from "@/components/comment-form";
import { ReportDialog } from "@/components/report-dialog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };
  return { title: `${guide.title} — FixGuide Lab`, description: guide.summary };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: guide.title }]} />

      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-2">
          <TestingStatusBadge status={guide.testing_status} />
          <DifficultyBadge difficulty={guide.difficulty} />
        </div>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{guide.title}</h1>
        <p className="mt-3 text-lg leading-8 text-[var(--muted)]">{guide.summary}</p>
        <div className="mt-4">
          <DetailMeta minutes={guide.time_estimate_minutes} reviewed={guide.last_reviewed_date} />
        </div>
      </div>

      {/* Content + TOC */}
      <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <MdxRenderer source={guide.rawBody} />
        </div>

        {guide.headings.length > 0 && (
          <aside className="hidden lg:block">
            <TableOfContents items={guide.headings} />
          </aside>
        )}
      </div>

      {/* Community */}
      <section className="space-y-6 border-t border-[var(--line)] pt-8">
        <h2 className="text-xl font-semibold">Community Notes</h2>
        <CommentForm targetType="guide" targetId={guide.id} />
        <div className="pt-2">
          <ReportDialog contentType="guide" contentId={guide.id} />
        </div>
      </section>

      {/* AI Chat */}
      <AiChatPanel contextId={guide.id} contextType="guide" />
    </div>
  );
}
