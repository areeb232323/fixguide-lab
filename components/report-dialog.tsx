"use client";

import { useState } from "react";

const REASONS = [
  { value: "inaccurate", label: "Inaccurate information" },
  { value: "unsafe", label: "Missing safety warning" },
  { value: "spam", label: "Spam or self-promotion" },
  { value: "harassment", label: "Harassment or abuse" },
  { value: "other", label: "Other" },
] as const;

interface ReportDialogProps {
  contentType: "guide" | "project" | "comment";
  contentId: string;
}

export function ReportDialog({ contentType, contentId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: contentType,
          content_id: contentId,
          reason,
          details: details.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Failed to submit report (${res.status})`);
      }

      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-[var(--danger)]"
      >
        Report
      </button>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-600/20 bg-green-50 px-4 py-3 text-sm text-green-700">
        Report submitted. Our moderation team will review it within 48 hours.
        <button
          type="button"
          onClick={() => { setOpen(false); setStatus("idle"); setReason(""); setDetails(""); }}
          className="ml-3 underline"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/80 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Report Content</h4>
        <button
          type="button"
          onClick={() => { setOpen(false); setStatus("idle"); }}
          className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
          aria-label="Close report form"
        >
          &#10005;
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <fieldset>
          <legend className="text-xs font-semibold text-[var(--muted)]">Reason</legend>
          <div className="mt-2 space-y-2">
            {REASONS.map((r) => (
              <label key={r.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-4 w-4 border-[var(--line)] text-[var(--accent)]"
                />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Optional: add more details..."
          rows={2}
          className="w-full resize-y rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
          disabled={status === "submitting"}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!reason || status === "submitting"}
            className="rounded-full bg-[var(--danger)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting..." : "Submit Report"}
          </button>
          {status === "error" && (
            <span className="text-sm text-[var(--danger)]">{errorMessage}</span>
          )}
        </div>
      </form>
    </div>
  );
}
