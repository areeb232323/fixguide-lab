"use client";

import { useState } from "react";

interface ModActionButtonsProps {
  reportId: string;
  contentId: string;
  contentType: string;
}

export function ModActionButtons({ reportId, contentId, contentType }: ModActionButtonsProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState("");

  async function handleAction(actionType: string) {
    setStatus("loading");
    try {
      const res = await fetch("/api/mod/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          content_type: contentType,
          content_id: contentId,
          action_type: actionType,
          reason: `Moderation action: ${actionType}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Action failed (${res.status})`);
      }

      setResult(`Action "${actionType}" applied.`);
      setStatus("done");
    } catch (err) {
      setResult(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "done") {
    return <span className="text-xs text-green-700">{result}</span>;
  }

  if (status === "error") {
    return <span className="text-xs text-[var(--danger)]">{result}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleAction("hide_content")}
        disabled={status === "loading"}
        className="rounded-full border border-[var(--danger)]/30 px-3 py-1 text-xs text-[var(--danger)] transition hover:bg-red-50 disabled:opacity-50"
      >
        Hide
      </button>
      <button
        type="button"
        onClick={() => handleAction("warn_user")}
        disabled={status === "loading"}
        className="rounded-full border border-[var(--warning)]/30 px-3 py-1 text-xs text-[var(--warning-strong)] transition hover:bg-amber-50 disabled:opacity-50"
      >
        Warn
      </button>
      <button
        type="button"
        onClick={() => handleAction("dismiss_report")}
        disabled={status === "loading"}
        className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)] transition hover:bg-stone-100 disabled:opacity-50"
      >
        Dismiss
      </button>
    </div>
  );
}
