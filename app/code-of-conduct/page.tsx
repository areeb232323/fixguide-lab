import { Breadcrumbs } from "@/components/site-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct — FixGuide Lab",
  description: "Community guidelines for participating in FixGuide Lab.",
};

export default function CodeOfConductPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Code of Conduct" }]} />

      <div className="mx-auto max-w-3xl space-y-10">
        <section>
          <h1 className="text-3xl font-semibold md:text-4xl">Code of Conduct</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            FixGuide Lab is a welcoming community for learners and makers of all skill
            levels. These guidelines help keep the platform safe, accurate, and helpful
            for everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Be Helpful and Accurate</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[var(--muted)]">
            <li>Share your genuine experience — what worked, what didn&apos;t, and what you&apos;d do differently.</li>
            <li>Include your hardware/software details when reporting results so others can assess relevance.</li>
            <li>If you&apos;re unsure about something, say so. Don&apos;t present guesses as tested facts.</li>
            <li>Cite sources when referencing official documentation or specifications.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Prioritize Safety</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[var(--muted)]">
            <li>Never encourage skipping safety steps or backup procedures.</li>
            <li>Report content that contains dangerous instructions or missing warnings.</li>
            <li>If a guide worked but you noticed a safety gap, mention it in community notes.</li>
            <li>Do not share instructions for bypassing security features, DRM, or licensing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Be Respectful</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[var(--muted)]">
            <li>Treat all community members with respect, regardless of skill level.</li>
            <li>Constructive criticism is welcome; personal attacks are not.</li>
            <li>No harassment, discrimination, or abusive language.</li>
            <li>Remember that beginners today become experts who help others tomorrow.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Prohibited Content</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[var(--muted)]">
            <li>Piracy, license key sharing, or DRM circumvention instructions.</li>
            <li>Malware, exploits, or instructions for unauthorized access.</li>
            <li>Spam, self-promotion, or affiliate links.</li>
            <li>Content that is intentionally misleading or designed to cause harm.</li>
            <li>Personal information of others without their consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Moderation</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            <p>
              Our moderation team reviews reported content and community notes. Actions
              we may take include:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong className="text-[var(--ink)]">Warning</strong> — A note asking you to adjust your behavior.</li>
              <li><strong className="text-[var(--ink)]">Content removal</strong> — Hiding content that violates these guidelines.</li>
              <li><strong className="text-[var(--ink)]">Suspension</strong> — Temporary loss of commenting and voting privileges.</li>
              <li><strong className="text-[var(--ink)]">Ban</strong> — Permanent removal from the community for severe or repeated violations.</li>
            </ul>
            <p>
              If you believe a moderation decision was made in error, you can appeal by
              contacting us through our GitHub repository.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Reporting Violations</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Use the report button on any community note to flag content that violates
            these guidelines. Include a brief explanation of the issue. All reports are
            reviewed by our moderation team within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
