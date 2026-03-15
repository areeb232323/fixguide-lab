"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/site-ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reset Password" }]} />

      <div className="mx-auto max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Reset Password</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-center text-sm text-green-700">
            Check your email for a password reset link. You can close this page.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-center text-xs text-[var(--muted)]">
              <a href="/signin" className="underline hover:text-[var(--accent)]">Back to sign in</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
