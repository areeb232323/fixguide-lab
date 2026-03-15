"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function SignInForm({ initialMode = "signin" }: { initialMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        setSuccess("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/profile");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!supabaseUrl) {
    return (
      <div className="card-surface rounded-[1.2rem] px-5 py-6 text-center">
        <p className="text-sm font-semibold">Supabase not configured</p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          To enable authentication, add <code className="rounded bg-stone-200 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-stone-200 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables.
          See the README for setup instructions.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {mode === "signup" && (
        <div>
          <label htmlFor="displayName" className="block text-sm font-semibold">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
          />
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

      <div>
        <label htmlFor="password" className="block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? mode === "signup"
            ? "Creating account..."
            : "Signing in..."
          : mode === "signup"
            ? "Create Account"
            : "Sign In"}
      </button>

      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setSuccess("");
          }}
          className="underline hover:text-[var(--accent)]"
        >
          {mode === "signin"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>

        {mode === "signin" && (
          <a href="/auth/reset-password" className="underline hover:text-[var(--accent)]">
            Forgot password?
          </a>
        )}
      </div>
    </form>
  );
}
