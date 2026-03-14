import Link from "next/link";
import { SearchBar } from "@/components/site-ui";
import { MobileNav } from "@/components/mobile-nav";

const navItems = [
  { label: "Guides", href: "/guides" },
  { label: "Projects", href: "/projects" },
  { label: "Contribute", href: "/contribute" },
  { label: "Moderation", href: "/moderation" },
  { label: "Profile", href: "/profile" },
];

export function SiteHeader() {
  return (
    <header className="page-shell sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(245,240,227,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="text-xl font-semibold tracking-[0.08em] text-[var(--ink)]">
            FixGuide Lab
          </Link>
          <nav aria-label="Primary" className="hidden gap-5 text-sm text-[var(--muted)] md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[var(--accent)]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="w-full max-w-xl">
          <SearchBar action="/guides" placeholder="Search migration guides, drivers, sensors, or parts" />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="page-shell mx-auto mt-20 max-w-7xl px-5 pb-12 pt-10 text-sm text-[var(--muted)]">
      <div className="card-surface rounded-[1.8rem] px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Safety first</p>
            <p className="mt-3 leading-7">Destructive OS steps always assume data-loss risk. Hardware builds stay low-voltage by default.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Browse</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/guides" className="hover:text-[var(--accent)]">Guides</Link></li>
              <li><Link href="/projects" className="hover:text-[var(--accent)]">Projects</Link></li>
              <li><Link href="/safety" className="hover:text-[var(--accent)]">Safety policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">Community</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/code-of-conduct" className="hover:text-[var(--accent)]">Code of conduct</Link></li>
              <li><Link href="/signin" className="hover:text-[var(--accent)]">Sign in</Link></li>
              <li><Link href="/contribute" className="hover:text-[var(--accent)]">Submit a draft</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
