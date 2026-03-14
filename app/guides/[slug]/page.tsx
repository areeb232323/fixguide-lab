import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/content";
import { getGuideDetail } from "@/lib/api-client";
import { Breadcrumbs, TestingStatusBadge, DifficultyBadge, DetailMeta, TableOfContents } from "@/components/site-ui";
import { MdxRenderer } from "@/components/mdx-renderer";
import { CommentForm } from "@/components/comment-form";
import { VoteButtons } from "@/components/vote-buttons";
import { ReportDialog } from "@/components/report-dialog";
import { AiChatPanel } from "@/components/ai-chat-panel";
import { formatDate } from "@/lib/utils";
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

  const detail = await getGuideDetail(slug);
  const comments = detail?.comments ?? [];

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

      {/* Community Notes */}
      <section>
        <h2 className="text-2xl font-semibold">Community Notes</h2>
        {comments.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No community notes yet. Be the first to share your experience!</p>
        ) : (
          <div className="mt-4 space-y-4">
            {comments.map((note) => (
              <div key={note.id} className="card-surface rounded-[1.2rem] px-5 py-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold">{note.user_profiles?.display_name ?? "Anonymous"}</span>
                  <span className="text-[var(--muted)]">{formatDate(note.created_at)}</span>
                </div>
                <p className="mt-2 text-sm leading-7">{note.body}</p>
                <div className="mt-3 flex items-center gap-4">
                  <VoteButtons commentId={note.id} initialHelpful={note.helpful_count} initialUnhelpful={note.unhelpful_count} />
                  <ReportDialog contentType="comment" contentId={note.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comment Form */}
      <CommentForm targetType="guide" targetId={guide.id} />

      {/* AI Chat */}
      <AiChatPanel contextId={guide.id} contextType="guide" />
    </div>
  );
}
