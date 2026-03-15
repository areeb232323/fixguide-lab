"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContributeForm() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [contentType, setContentType] = useState("guide");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Title is required");
      setStatus("error");
      return;
    }
    if (!summary.trim()) {
      setErrorMessage("Summary is required");
      setStatus("error");
      return;
    }
    if (!body.trim()) {
      setErrorMessage("Content is required");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    // Simulate submission delay
    setTimeout(() => {
      setStatus("success");
    }, 800);
  }

  if (status === "success") {
    return (
      <div className="space-y-4 rounded-[1.2rem] border border-green-600/20 bg-green-50 px-6 py-8 text-center">
        <div className="text-3xl">&#10003;</div>
        <h3 className="text-lg font-semibold text-green-800">Draft Submitted!</h3>
        <p className="text-sm leading-7 text-green-700">
          Your {contentType} draft &ldquo;{title}&rdquo; has been submitted for review.
          Our moderation team will review it and provide feedback.
        </p>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setSummary("");
            setBody("");
            setTags("");
            setContentType("guide");
            setDifficulty("Beginner");
            setStatus("idle");
          }}
          className="mt-2 rounded-full border border-green-600/30 px-6 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {status === "error" && errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Content Type */}
      <fieldset>
        <legend className="text-sm font-semibold">Content Type</legend>
        <div className="mt-2 flex gap-4">
          {(["Guide", "Project"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="content_type"
                value={type.toLowerCase()}
                checked={contentType === type.toLowerCase()}
                onChange={(e) => setContentType(e.target.value)}
                className="h-4 w-4 border-[var(--line)] text-[var(--accent)]"
              />
              {type}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., How to Set Up a Raspberry Pi Media Server"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-semibold">
          Summary
        </label>
        <textarea
          id="summary"
          rows={2}
          required
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief description of what this guide/project covers..."
          className="mt-1 w-full resize-y rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label htmlFor="difficulty" className="block text-sm font-semibold">
          Difficulty
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-semibold">
          Content (Markdown)
        </label>
        <textarea
          id="body"
          rows={12}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"## Prerequisites\n\n- Item 1\n- Item 2\n\n## Steps\n\n1. First step...\n2. Second step..."}
          className="mt-1 w-full resize-y rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 font-mono text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-semibold">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., raspberry-pi, media-server, linux"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Submit Draft"}
      </button>
      <p className="text-center text-xs text-[var(--muted)]">
        Submissions are reviewed by moderators before publication.
      </p>
    </form>
  );
}
