import { Breadcrumbs } from "@/components/site-ui";
import { ContributeForm } from "@/components/contribute-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribute — FixGuide Lab",
  description: "Submit a new guide or project draft to FixGuide Lab.",
};

export default function ContributePage() {
  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contribute" }]} />

      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Contribute a Draft</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Submit a new tech support guide or engineering project for community review.
            All submissions start as Draft status.
          </p>
        </div>

        <ContributeForm />
      </div>
    </div>
  );
}
