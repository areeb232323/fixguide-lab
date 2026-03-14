export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (!remainder) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainder} min`;
}

export function formatCurrencyRange(min: number, max: number) {
  if (min === max) {
    return `$${min}`;
  }

  return `$${min}-$${max}`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function estimateReadTime(markdown: string) {
  const words = markdown.replace(/[#>*`[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 180));
}

export interface TocItem {
  depth: 2 | 3;
  text: string;
  id: string;
}

export function extractHeadings(markdown: string) {
  const headings: TocItem[] = [];

  for (const line of markdown.split("\n")) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const depth = match[1] === "##" ? 2 : 3;
    const text = match[2].replace(/[`*_]/g, "").trim();

    headings.push({
      depth,
      text,
      id: slugify(text),
    });
  }

  return headings;
}

export function pickExcerpt(markdown: string, maxLength = 180) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`[\]()_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}
