"use client";

import { useState } from "react";

interface CommentFormProps {
  targetType: "guide" | "project";
  targetId: string;
}

export function CommentForm({ targetType, targetId }: CommentFormProps) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), target_type: targetType, target_id: targetId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Failed to post comment (${res.status})`);
      }

      setBody("");
      setStatus("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="comment-body" className="block text-sm font-semibold">
        Add a community note
      </label>
      <textarea
        id="comment-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your experience, tips, or issues you encountered..."
        rows={4}
        className="w-full resize-y rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm leading-7 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        disabled={status === "submitting"}
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!body.trim() || status === "submitting"}
          className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Posting..." : "Post Note"}
        </button>
        {status === "success" && (
          <span className="text-sm text-green-700">Note posted! Refresh to see it.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-[var(--danger)]">{errorMessage}</span>
        )}
      </div>
    </form>
  );
}
