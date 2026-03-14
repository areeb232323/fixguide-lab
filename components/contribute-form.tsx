"use client";

export function ContributeForm() {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                defaultChecked={type === "Guide"}
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
          placeholder="e.g., raspberry-pi, media-server, linux"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Submit Draft
      </button>
      <p className="text-center text-xs text-[var(--muted)]">
        Submissions are reviewed by moderators before publication.
        This form is a mock for the MVP.
      </p>
    </form>
  );
}
