import { Breadcrumbs } from "@/components/site-ui";
import { missionPrinciples } from "@/lib/site-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — FixGuide Lab",
  description: "Learn about FixGuide Lab's mission, principles, and the team behind it.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <div className="mx-auto max-w-3xl space-y-10">
        <section>
          <h1 className="text-3xl font-semibold md:text-4xl">About FixGuide Lab</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            FixGuide Lab is a community-driven platform offering verified tech support guides
            and student-friendly engineering projects. Every guide is safety-first,
            source-cited, and community-tested.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            We believe reliable tech support should be free and accessible. Too many guides
            online skip safety steps, lack testing, or push users toward risky procedures
            without proper warnings. FixGuide Lab exists to change that.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Our Principles</h2>
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
        </section>

        <section>
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <p>
              <strong className="text-[var(--ink)]">Guides</strong> cover OS migrations,
              dual-boot setups, BIOS recovery, and troubleshooting. Each guide includes
              safety checklists, step-by-step instructions, and verification procedures.
            </p>
            <p>
              <strong className="text-[var(--ink)]">Projects</strong> are student-friendly
              engineering builds with parts lists, wiring diagrams, budget vs best-value
              pricing, and test procedures.
            </p>
            <p>
              <strong className="text-[var(--ink)]">Community Notes</strong> let verified
              users share their experience, report issues, and vote on helpfulness.
              Content progresses from Draft → Internally Tested → Community Verified.
            </p>
            <p>
              <strong className="text-[var(--ink)]">AI Assistant</strong> helps answer
              questions using verified guide content, always citing sources and flagging
              safety risks.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Testing Status</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            <p>
              <strong className="text-[var(--ink)]">Draft</strong> — Written but not yet
              tested. Use with caution and report any issues.
            </p>
            <p>
              <strong className="text-[var(--ink)]">Internally Tested</strong> — Tested by
              the FixGuide Lab team on at least one hardware/software configuration.
            </p>
            <p>
              <strong className="text-[var(--ink)]">Community Verified</strong> — Successfully
              tested by multiple community members across different setups.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Found an issue? Have a suggestion? Use the community notes on any guide or
            project to share feedback, or reach out via our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
