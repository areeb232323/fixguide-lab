import { Breadcrumbs } from "@/components/site-ui";
import { getProfileForUi } from "@/lib/api-client";
import { communityNotes } from "@/lib/site-data";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — FixGuide Lab",
  description: "Your FixGuide Lab profile and activity.",
};

export default function ProfilePage() {
  const profile = getProfileForUi();
  const userNotes = profile
    ? communityNotes.filter((n) => n.author_id === profile.id)
    : [];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />

      <div className="mx-auto max-w-2xl space-y-8">
        {profile ? (
          <>
            {/* Profile Card */}
            <div className="card-surface rounded-[1.5rem] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xl font-semibold text-[var(--accent-strong)]">
                  {(profile.display_name ?? "?")[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
                  <p className="text-sm text-[var(--muted)]">Role: {profile.role}</p>
                  {profile.bio && (
                    <p className="mt-1 text-sm text-[var(--muted)]">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* User's Notes */}
            <section>
              <h2 className="text-xl font-semibold">Your Community Notes</h2>
              {userNotes.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  You haven&apos;t posted any community notes yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {userNotes.map((note) => (
                    <div key={note.id} className="card-surface rounded-[1.2rem] px-5 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                          {note.target_type}
                        </span>
                        <span className="text-[var(--muted)]">{formatDate(note.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-7">{note.body}</p>
                      <div className="mt-2 flex gap-4 text-xs text-[var(--muted)]">
                        <span>Helpful: {note.helpful_count}</span>
                        <span>Unhelpful: {note.unhelpful_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="py-12 text-center">
            <h1 className="text-2xl font-semibold">Not Signed In</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <a href="/signin" className="text-[var(--accent)] underline">Sign in</a> to view your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
