import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/site-ui";
import { ContributeForm } from "@/components/contribute-form";
import { getAuthUser, canContribute } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribute — FixGuide Lab",
  description: "Submit a new guide or project draft to FixGuide Lab.",
};

export default async function ContributePage() {
  const user = await getAuthUser();

  if (!user) redirect("/signin");

  if (!canContribute(user.role)) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contribute" }]} />
        <div className="py-12 text-center">
          <h1 className="text-2xl font-semibold">Contributor Access Required</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Your current role is <strong>{user.role}</strong>. You need contributor, moderator, or admin access to submit content.
          </p>
        </div>
      </div>
    );
  }

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
