import { Breadcrumbs } from "@/components/site-ui";
import { SignInForm } from "@/components/signin-form";
import { getProfileForUi } from "@/lib/api-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — FixGuide Lab",
  description: "Sign in to FixGuide Lab to contribute guides, leave notes, and vote.",
};

export default function SignInPage() {
  const profile = getProfileForUi();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sign In" }]} />

      <div className="mx-auto max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Sign In</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to contribute guides, leave community notes, and vote on content.
          </p>
        </div>

        {/* Mock current profile display */}
        {profile && (
          <div className="card-surface rounded-[1.2rem] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Current mock profile
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                {(profile.display_name ?? "?")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{profile.display_name}</p>
                <p className="text-xs text-[var(--muted)]">{profile.role}</p>
              </div>
            </div>
          </div>
        )}

        <SignInForm />
      </div>
    </div>
  );
}
