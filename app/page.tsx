import { listGuides, listProjects } from "@/lib/api-client";
import { SearchBar, ContentCard } from "@/components/site-ui";
import { missionPrinciples, quickPrompts } from "@/lib/site-data";
import { formatMinutes, formatCurrencyRange } from "@/lib/utils";

export default async function Home() {
  const [guides, projects] = await Promise.all([
    listGuides(),
    listProjects(),
  ]);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          FixGuide Lab
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Verified tech support guides and student engineering projects.
          Safety-first, community-tested, source-cited.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar
            action="/guides"
            placeholder="Search guides, projects, sensors, or parts..."
          />
        </div>
      </section>

      {/* Quick AI Prompts */}
      <section className="flex flex-wrap justify-center gap-3">
        {quickPrompts.map((prompt) => (
          <span
            key={prompt}
            className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)]"
          >
            {prompt}
          </span>
        ))}
      </section>

      {/* Featured Guides */}
      <section>
        <h2 className="text-2xl font-semibold">Tech Support Guides</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Step-by-step OS migration, dual boot, and troubleshooting guides with
          safety checklists.
        </p>
        <div className="section-grid mt-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.data.slice(0, 3).map((guide) => (
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
      </section>

      {/* Featured Projects */}
      <section>
        <h2 className="text-2xl font-semibold">Engineering Projects</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Student-friendly builds with parts lists, wiring diagrams, and test
          procedures.
        </p>
        <div className="section-grid mt-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.data.slice(0, 3).map((project) => (
            <ContentCard
              key={project.id}
              href={`/projects/${project.slug}`}
              kicker="Project"
              title={project.title}
              summary={project.summary}
              meta={formatCurrencyRange(
                project.cost_range_min,
                project.cost_range_max,
              )}
              status={project.testing_status}
              difficulty={project.difficulty}
            />
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="card-surface mx-auto max-w-3xl rounded-[1.8rem] px-8 py-8">
        <h2 className="text-xl font-semibold">Our Principles</h2>
        <ul className="mt-4 space-y-3">
          {missionPrinciples.map((principle) => (
            <li
              key={principle}
              className="flex gap-3 text-sm leading-7 text-[var(--muted)]"
            >
              <span className="mt-1 text-[var(--accent)]">&#10003;</span>
              {principle}
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <a
            href="https://discord.gg/esbDdmuX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Join our Discord
          </a>
        </div>
      </section>
    </div>
  );
}
