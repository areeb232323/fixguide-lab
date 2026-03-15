"use client";

import { useRouter } from "next/navigation";
import { clearDemoSession } from "@/lib/demo-auth";

const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    }

    // Always clear demo session cookie
    clearDemoSession();

    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={className ?? "text-sm text-[var(--muted)] transition hover:text-[var(--accent)]"}
    >
      Sign Out
    </button>
  );
}
