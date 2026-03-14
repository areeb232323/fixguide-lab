import Link from "next/link";
import { DifficultyEnum, TestingStatusEnum, type Difficulty, type TestingStatus } from "@contracts/enums";
import { cn, formatCurrencyRange, formatDate, formatMinutes } from "@/lib/utils";

const statusTone: Record<TestingStatus, string> = {
  Draft: "bg-stone-200 text-stone-800",
  InternallyTested: "bg-teal-100 text-teal-900",
  CommunityVerified: "bg-emerald-100 text-emerald-900",
};

const difficultyTone: Record<Difficulty, string> = {
  Beginner: "bg-emerald-100 text-emerald-900",
  Intermediate: "bg-amber-100 text-amber-900",
  Advanced: "bg-rose-100 text-rose-900",
};

export function TestingStatusBadge({ status }: { status: TestingStatus }) {
  TestingStatusEnum.parse(status);
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide", statusTone[status])}>{status}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  DifficultyEnum.parse(difficulty);
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide", difficultyTone[difficulty])}>{difficulty}</span>;
}

export function MetaBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium text-[var(--muted)]">
      <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--ink)]">{label}</span>
      <span>{value}</span>
    </span>
  );
}

export function SearchBar({ action, defaultValue, name = "query", placeholder }: { action: string; defaultValue?: string; name?: string; placeholder: string }) {
  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row">
      <input
        aria-label={placeholder}
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-2xl border border-[var(--line)] bg-white/85 px-4 py-3 text-sm shadow-sm"
      />
      <button className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]">
        Search
      </button>
    </form>
  );
}

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? <Link href={item.href} className="hover:text-[var(--accent)]">{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {index < items.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function WarningCallout({
  title,
  tone = "warning",
  children,
}: {
  title: string;
  tone?: "warning" | "danger";
  children: React.ReactNode;
}) {
  const className =
    tone === "danger"
      ? "border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--ink)]"
      : "border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--ink)]";

  return (
    <aside className={cn("rounded-[1.2rem] border px-5 py-4", className)}>
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]">{title}</p>
      <div className="space-y-3 text-sm leading-7">{children}</div>
    </aside>
  );
}

export function TableOfContents({ items }: { items: Array<{ id: string; text: string; depth: 2 | 3 }> }) {
  return (
    <nav aria-label="Table of contents" className="card-surface sticky top-24 rounded-[1.25rem] p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">On this page</p>
      <ol className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-4 text-[var(--muted)]" : ""}>
            <a href={`#${item.id}`} className="hover:text-[var(--accent)]">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ContentCard({
  href,
  kicker,
  title,
  summary,
  meta,
  status,
  difficulty,
}: {
  href: string;
  kicker: string;
  title: string;
  summary: string;
  meta: string;
  status: TestingStatus;
  difficulty: Difficulty;
}) {
  return (
    <Link href={href} className="card-surface block rounded-[1.5rem] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)]/30">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{kicker}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <TestingStatusBadge status={status} />
        <DifficultyBadge difficulty={difficulty} />
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{summary}</p>
      <p className="mt-5 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{meta}</p>
    </Link>
  );
}

export function DetailMeta({
  minutes,
  cost,
  reviewed,
}: {
  minutes?: number;
  cost?: { min: number; max: number };
  reviewed?: string | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {minutes ? <MetaBadge label="Time" value={formatMinutes(minutes)} /> : null}
      {cost ? <MetaBadge label="Cost" value={formatCurrencyRange(cost.min, cost.max)} /> : null}
      {reviewed ? <MetaBadge label="Reviewed" value={formatDate(reviewed)} /> : null}
    </div>
  );
}
