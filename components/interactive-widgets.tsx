"use client";

import { useEffect, useState } from "react";
import { cn, slugify } from "@/lib/utils";

export function StepList({ items, storageKey }: { items: string[]; storageKey: string }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as boolean[];
      if (Array.isArray(parsed) && parsed.length === items.length) {
        setChecked(parsed);
      }
    } catch {}
  }, [items.length, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={`${storageKey}-${index}`} className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <label className="flex cursor-pointer gap-3 text-sm leading-7">
            <input
              checked={checked[index] ?? false}
              onChange={() => setChecked((current) => current.map((value, idx) => (idx === index ? !value : value)))}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-[var(--line)] text-[var(--accent)]"
            />
            <span>{item}</span>
          </label>
        </li>
      ))}
    </ol>
  );
}

export function PartsList({
  parts,
}: {
  parts: Array<{ id: string; name: string; description: string; price_budget: number; price_best: number }>;
}) {
  const [mode, setMode] = useState<"budget" | "best">("budget");

  return (
    <div className="rounded-[1.3rem] border border-[var(--line)] bg-white/75 p-5">
      <div className="mb-5 flex gap-2">
        {(["budget", "best"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setMode(option)}
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold capitalize",
              mode === option ? "bg-[var(--accent)] text-white" : "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
            )}
          >
            {option === "budget" ? "Budget build" : "Best value"}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {parts.map((part) => (
          <li key={part.id} className="rounded-2xl border border-[var(--line)] px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{part.name}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{part.description}</p>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold">
                ${mode === "budget" ? part.price_budget : part.price_best}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ImageGallery({
  images,
}: {
  images: Array<{ src: string; alt: string; caption: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {images.map((image) => (
        <figure key={image.src} className="overflow-hidden rounded-[1.3rem] border border-[var(--line)] bg-white/75">
          <img alt={image.alt} src={image.src} className="h-56 w-full object-cover" />
          <figcaption className="px-4 py-3 text-sm leading-6 text-[var(--muted)]">{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-[1.3rem] border border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
        <span>Command block</span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
          type="button"
          className="rounded-full border border-slate-700 px-3 py-1 text-[11px] tracking-[0.18em] text-slate-200"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6"><code>{children}</code></pre>
    </div>
  );
}

export function headingId(text: string) {
  return slugify(text);
}
