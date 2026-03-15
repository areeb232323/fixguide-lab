import { listProjects } from "@/lib/api-client";
import { Breadcrumbs, SearchBar, ContentCard } from "@/components/site-ui";
import { formatCurrencyRange } from "@/lib/utils";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.query ?? "";
  const difficulty = params.difficulty;
  const costMax = params.costMax;
  const tag = params.tag;
  const page = Number(params.page ?? 1);

  const result = await listProjects({
    query,
    difficulty,
    costMax: costMax ? Number(costMax) : undefined,
    tag,
    page,
  } as Parameters<typeof listProjects>[0]);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />

      <div>
        <h1 className="text-3xl font-semibold">Engineering Projects</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Student-friendly builds with parts lists, wiring diagrams, and test procedures.
        </p>
      </div>

      <SearchBar action="/projects" defaultValue={query} placeholder="Search projects..." />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 text-sm">
        {["Beginner", "Intermediate", "Advanced"].map((d) => {
          const p = new URLSearchParams();
          p.set("difficulty", d);
          if (query) p.set("query", query);
          if (costMax) p.set("costMax", costMax);
          return (
            <a
              key={d}
              href={`/projects?${p}`}
              className={`rounded-full border px-4 py-2 ${difficulty === d ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"}`}
            >
              {d}
            </a>
          );
        })}
        {["25", "50", "100"].map((c) => {
          const p = new URLSearchParams();
          p.set("costMax", c);
          if (query) p.set("query", query);
          if (difficulty) p.set("difficulty", difficulty);
          return (
            <a
              key={c}
              href={`/projects?${p}`}
              className={`rounded-full border px-4 py-2 ${costMax === c ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]"}`}
            >
              Under ${c}
            </a>
          );
        })}
        {(difficulty || costMax || tag) && (
          <a href="/projects" className="rounded-full border border-[var(--danger)]/20 px-4 py-2 text-[var(--danger)]">
            Clear filters
          </a>
        )}
      </div>

      {/* Results */}
      {result.data.length === 0 ? (
        <p className="py-12 text-center text-[var(--muted)]">No projects match your filters.</p>
      ) : (
        <div className="section-grid md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((project) => (
            <ContentCard
              key={project.id}
              href={`/projects/${project.slug}`}
              kicker="Project"
              title={project.title}
              summary={project.summary}
              meta={formatCurrencyRange(project.cost_range_min, project.cost_range_max)}
              status={project.testing_status}
              difficulty={project.difficulty}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.total > result.limit && (() => {
        const base = new URLSearchParams();
        if (query) base.set("query", query);
        if (difficulty) base.set("difficulty", difficulty);
        if (costMax) base.set("costMax", costMax);
        if (tag) base.set("tag", tag);
        const prevParams = new URLSearchParams(base);
        prevParams.set("page", String(page - 1));
        const nextParams = new URLSearchParams(base);
        nextParams.set("page", String(page + 1));
        return (
          <div className="flex justify-center gap-4 pt-4">
            {page > 1 && (
              <a href={`/projects?${prevParams}`} className="rounded-full border border-[var(--line)] px-5 py-2 text-sm hover:border-[var(--accent)]">Previous</a>
            )}
            <span className="py-2 text-sm text-[var(--muted)]">Page {page} of {Math.ceil(result.total / result.limit)}</span>
            {page * result.limit < result.total && (
              <a href={`/projects?${nextParams}`} className="rounded-full border border-[var(--line)] px-5 py-2 text-sm hover:border-[var(--accent)]">Next</a>
            )}
          </div>
        );
      })()}
    </div>
  );
}
