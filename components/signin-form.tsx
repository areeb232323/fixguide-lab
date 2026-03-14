"use client";

export function SignInForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Sign In
      </button>
      <p className="text-center text-xs text-[var(--muted)]">
        Auth is mocked for the MVP. In production, this connects to Supabase Auth.
      </p>
    </form>
  );
}
