import { NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Simple in-memory rate limiter (per-process; sufficient for MVP).
// Replace with Redis or Upstash for production multi-instance deployments.
const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Maximum requests in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

const DEFAULTS: Record<string, RateLimitConfig> = {
  ai: { limit: 10, windowSeconds: 60 },
  auth: { limit: 20, windowSeconds: 60 },
  api: { limit: 60, windowSeconds: 60 },
};

/**
 * Check rate limit for a given key (e.g., IP or user ID).
 * Returns null if within limits, or a 429 NextResponse if exceeded.
 */
export function checkRateLimit(
  key: string,
  tier: "ai" | "auth" | "api" = "api",
): NextResponse | null {
  cleanup();

  const config = DEFAULTS[tier];
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
    return null;
  }

  entry.count++;
  if (entry.count > config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      },
    );
  }

  return null;
}

/**
 * Get a rate-limit key from the request (uses x-forwarded-for or fallback).
 */
export function getRateLimitKey(
  request: Request,
  userId?: string,
): string {
  if (userId) return `user:${userId}`;
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `ip:${ip}`;
}
