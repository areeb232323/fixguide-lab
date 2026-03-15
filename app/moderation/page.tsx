import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/site-ui";
import { ModActionButtons } from "@/components/mod-action-buttons";
import { getModerationQueue } from "@/lib/api-client";
import { getAuthUser, canModerate } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moderation — FixGuide Lab",
  description: "Review and manage reported content.",
};

export default async function ModerationPage() {
  const user = await getAuthUser();

  if (!user) redirect("/signin");

  if (!canModerate(user.role)) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Moderation" }]} />
        <div className="py-12 text-center">
          <h1 className="text-2xl font-semibold">Moderator Access Required</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Your current role is <strong>{user.role}</strong>. You need moderator or admin access to view this page.
          </p>
        </div>
      </div>
    );
  }

  const queue = await getModerationQueue();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Moderation" }]} />

      <div>
        <h1 className="text-3xl font-semibold">Moderation Queue</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Review reported content and take appropriate action.
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[var(--muted)]">No pending reports. The queue is clear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((report) => (
            <div key={report.id} className="card-surface rounded-[1.2rem] px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        report.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : report.status === "reviewing"
                            ? "bg-blue-100 text-blue-800"
                            : report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                      {report.reason}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {report.target_type}
                    </span>
                  </div>
                  {report.details && (
                    <p className="text-sm leading-7 text-[var(--muted)]">{report.details}</p>
                  )}
                  <p className="text-xs text-[var(--muted)]">
                    Reported by {report.reporter.display_name} ({report.reporter.role}) on{" "}
                    {formatDate(report.created_at)}
                  </p>
                </div>
                <ModActionButtons
                  reportId={report.id}
                  contentId={report.target_id}
                  contentType={report.target_type}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
