"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Guides", href: "/guides" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Safety", href: "/safety" },
  { label: "Contribute", href: "/contribute" },
  { label: "Moderation", href: "/moderation" },
  { label: "Profile", href: "/profile" },
  { label: "Sign In", href: "/signin" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--ink)]"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <nav
          className="absolute left-0 right-0 top-full border-b border-[var(--line)] bg-[var(--bg)] px-5 py-4"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
