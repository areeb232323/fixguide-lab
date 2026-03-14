import { listGuides } from "@/lib/api-client";
import { Breadcrumbs, SearchBar, ContentCard } from "@/components/site-ui";
import { formatMinutes } from "@/lib/utils";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function GuidesPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.query ?? "";
  const difficulty = params.difficulty;
  const os = params.os;
  const tag = params.tag;
  const page = Number(params.page ?? 1);

  const result = await listGuides({ query, difficulty, os, tag, page } as Parameters<typeof listGuides>[0]);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />

      <div>
        <h1 className="text-3xl font-semibold">Tech Support Guides</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Step-by-step OS migration, dual boot, and troubleshooting guides.
        </p>
      </div>

      <SearchBar
        action="/guides"
        defaultValue={query}
        placeholder="Search guides..."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 text-sm">
        {["Beginner", "Intermediate", "Advanced"].map((d) => (
          <a
            key={d}
            href={`/guides?difficulty=${d}${query ? `&query=${query}` : ""}`}
            className={`rounded-full border px-4 py-2 ${difficulty === d ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"}`}
          >
            {d}
          </a>
        ))}
        {["Windows", "Linux", "macOS", "Any"].map((o) => (
          <a
            key={o}
            href={`/guides?os=${o}${query ? `&query=${query}` : ""}`}
            className={`rounded-full border px-4 py-2 ${os === o ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"}`}
          >
            {o}
          </a>
        ))}
        {(difficulty || os || tag) && (
          <a href="/guides" className="rounded-full border border-[var(--danger)]/20 px-4 py-2 text-[var(--danger)]">
            Clear filters
          </a>
        )}
      </div>

      {/* Results */}
      {result.data.length === 0 ? (
        <p className="py-12 text-center text-[var(--muted)]">No guides match your filters.</p>
      ) : (
        <div className="section-grid md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((guide) => (
            <ContentCard
              key={guide.id}
              href={`/guides/${guide.slug}`}
              kicker={guide.os}
              title={guide.title}
              summary={guide.summary}
              meta={formatMinutes(guide.time_estimate_minutes)}
              status={guide.testing_status}
              difficulty={guide.difficulty}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.total > result.limit && (
        <div className="flex justify-center gap-4 pt-4">
          {page > 1 && (
            <a href={`/guides?page=${page - 1}${query ? `&query=${query}` : ""}`} className="rounded-full border border-[var(--line)] px-5 py-2 text-sm hover:border-[var(--accent)]">
              Previous
            </a>
          )}
          <span className="py-2 text-sm text-[var(--muted)]">
            Page {page} of {Math.ceil(result.total / result.limit)}
          </span>
          {page * result.limit < result.total && (
            <a href={`/guides?page=${page + 1}${query ? `&query=${query}` : ""}`} className="rounded-full border border-[var(--line)] px-5 py-2 text-sm hover:border-[var(--accent)]">
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
