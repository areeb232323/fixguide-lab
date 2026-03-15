"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/site-ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Update Password" }]} />

      <div className="mx-auto max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Set New Password</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Enter your new password below.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-semibold">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
