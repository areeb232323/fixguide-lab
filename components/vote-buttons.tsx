"use client";

import { useState } from "react";

interface VoteButtonsProps {
  commentId: string;
  initialHelpful: number;
  initialUnhelpful: number;
}

export function VoteButtons({ commentId, initialHelpful, initialUnhelpful }: VoteButtonsProps) {
  const [helpful, setHelpful] = useState(initialHelpful);
  const [unhelpful, setUnhelpful] = useState(initialUnhelpful);
  const [voted, setVoted] = useState<"helpful" | "unhelpful" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVote(isHelpful: boolean) {
    if (loading) return;

    const newVote = isHelpful ? "helpful" : "unhelpful";
    if (voted === newVote) return;

    setLoading(true);

    // Optimistic update
    const prevHelpful = helpful;
    const prevUnhelpful = unhelpful;
    const prevVoted = voted;

    if (voted === "helpful") setHelpful((h) => h - 1);
    if (voted === "unhelpful") setUnhelpful((u) => u - 1);
    if (isHelpful) setHelpful((h) => h + 1);
    else setUnhelpful((u) => u + 1);
    setVoted(newVote);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: commentId, is_helpful: isHelpful }),
      });

      if (!res.ok) {
        // Revert on failure
        setHelpful(prevHelpful);
        setUnhelpful(prevUnhelpful);
        setVoted(prevVoted);
      }
    } catch {
      setHelpful(prevHelpful);
      setUnhelpful(prevUnhelpful);
      setVoted(prevVoted);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3 text-xs">
      <button
        type="button"
        onClick={() => handleVote(true)}
        disabled={loading}
        className={`flex items-center gap-1 rounded-full border px-3 py-1 transition ${
          voted === "helpful"
            ? "border-green-600/30 bg-green-50 text-green-700"
            : "border-[var(--line)] text-[var(--muted)] hover:border-green-600/30 hover:text-green-700"
        }`}
        aria-label={`Mark helpful (${helpful})`}
      >
        <span aria-hidden="true">&#9650;</span> Helpful {helpful}
      </button>
      <button
        type="button"
        onClick={() => handleVote(false)}
        disabled={loading}
        className={`flex items-center gap-1 rounded-full border px-3 py-1 transition ${
          voted === "unhelpful"
            ? "border-red-600/30 bg-red-50 text-red-700"
            : "border-[var(--line)] text-[var(--muted)] hover:border-red-600/30 hover:text-red-700"
        }`}
        aria-label={`Mark unhelpful (${unhelpful})`}
      >
        <span aria-hidden="true">&#9660;</span> Unhelpful {unhelpful}
      </button>
    </div>
  );
}
