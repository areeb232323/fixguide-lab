"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/site-ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/components/toast-provider";

export default function ProfileEditPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/signin");
          return;
        }
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("display_name, bio")
          .eq("id", user.id)
          .single();
        if (profile) {
          setDisplayName(profile.display_name ?? "");
          setBio(profile.bio ?? "");
        }
      } catch {
        // Supabase not configured — redirect
        router.push("/profile");
      } finally {
        setPageLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: displayName, bio }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update");
      }

      addToast("Profile updated!", "success");
      router.push("/profile");
      router.refresh();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Profile", href: "/profile" }, { label: "Edit" }]} />
        <div className="py-12 text-center text-sm text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Profile", href: "/profile" }, { label: "Edit" }]} />

      <div className="mx-auto max-w-md space-y-8">
        <h1 className="text-3xl font-semibold">Edit Profile</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="displayName" className="block text-sm font-semibold">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--surface)]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
