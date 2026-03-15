/**
 * Demo auth utilities — client-side only.
 * For server-side reading, see demo-auth-server.ts.
 */

const COOKIE_NAME = "demo-auth";

export interface DemoSession {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

/**
 * Set demo auth cookie (client-side only).
 */
export function setDemoSession(session: DemoSession): void {
  const value = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${COOKIE_NAME}=${value};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax`;
}

/**
 * Clear demo auth cookie (client-side only).
 */
export function clearDemoSession(): void {
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`;
}

/**
 * Generate a deterministic UUID-like ID from an email for demo purposes.
 */
export function generateDemoId(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash + email.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `d${hex.slice(0, 7)}-demo-4000-8000-${hex.padEnd(12, "0").slice(0, 12)}`;
}
