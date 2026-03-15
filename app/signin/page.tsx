import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/site-ui";
import { SignInForm } from "@/components/signin-form";
import { getAuthUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — FixGuide Lab",
  description: "Sign in to FixGuide Lab to contribute guides, leave notes, and vote.",
};

export default async function SignInPage() {
  const user = await getAuthUser();
  if (user) redirect("/profile");

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

        <SignInForm />
      </div>
    </div>
  );
}
