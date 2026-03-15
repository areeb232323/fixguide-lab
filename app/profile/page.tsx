import Link from "next/link";
import { Breadcrumbs } from "@/components/site-ui";
import { getAuthUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — FixGuide Lab",
  description: "Your FixGuide Lab profile and activity.",
};

export default async function ProfilePage() {
  const user = await getAuthUser();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />

      <div className="mx-auto max-w-2xl space-y-8">
        {user ? (
          <>
            {/* Profile Card */}
            <div className="card-surface rounded-[1.5rem] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xl font-semibold text-[var(--accent-strong)]">
                  {user.display_name[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{user.display_name}</h1>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/profile/edit"
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface)]"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Activity placeholder */}
            <section>
              <h2 className="text-xl font-semibold">Your Activity</h2>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Community notes and activity will appear here once the feature is connected to the database.
              </p>
            </section>
          </>
        ) : (
          <div className="py-12 text-center">
            <h1 className="text-2xl font-semibold">Not Signed In</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <Link href="/signin" className="text-[var(--accent)] underline">Sign in</Link> to view your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
