import { describe, it, expect } from "vitest";
import {
  cn,
  slugify,
  formatMinutes,
  formatCurrencyRange,
  formatDate,
  estimateReadTime,
  extractHeadings,
  pickExcerpt,
} from "@/lib/utils";

describe("cn (classname merge)", () => {
  it("merges class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditionals", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("handles undefined", () => {
    expect(cn("a", undefined, "b")).toBe("a b");
  });
});

describe("slugify", () => {
  it("converts text to kebab-case slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces special characters with hyphens", () => {
    expect(slugify("What's up?")).toBe("what-s-up");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a --- b")).toBe("a-b");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  --hello-- ")).toBe("hello");
  });
});

describe("formatMinutes", () => {
  it("formats short durations", () => {
    expect(formatMinutes(30)).toBe("30 min");
  });

  it("formats durations over an hour", () => {
    expect(formatMinutes(90)).toBe("1 hr 30 min");
  });

  it("formats exact hours", () => {
    expect(formatMinutes(120)).toBe("2 hr");
  });
});

describe("formatCurrencyRange", () => {
  it("formats a range", () => {
    expect(formatCurrencyRange(10, 50)).toBe("$10-$50");
  });

  it("formats same value", () => {
    expect(formatCurrencyRange(25, 25)).toBe("$25");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    const result = formatDate("2026-03-01T00:00:00.000Z");
    expect(result).toContain("2026");
  });

  it("returns Unscheduled for null", () => {
    expect(formatDate(null)).toBe("Unscheduled");
  });
});

describe("estimateReadTime", () => {
  it("estimates based on word count", () => {
    const words = Array(500).fill("word").join(" ");
    const minutes = estimateReadTime(words);
    expect(minutes).toBeGreaterThanOrEqual(3);
  });

  it("returns minimum of 3 for very short text", () => {
    expect(estimateReadTime("hello")).toBe(3);
  });
});

describe("extractHeadings", () => {
  it("extracts h2 and h3 headings from markdown", () => {
    const md = `# Title\n## Section One\nContent\n### Sub Section\n## Section Two`;
    const headings = extractHeadings(md);
    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({ depth: 2, text: "Section One", id: "section-one" });
    expect(headings[1]).toEqual({ depth: 3, text: "Sub Section", id: "sub-section" });
    expect(headings[2]).toEqual({ depth: 2, text: "Section Two", id: "section-two" });
  });

  it("returns empty array for no headings", () => {
    expect(extractHeadings("Just text")).toEqual([]);
  });
});

describe("pickExcerpt", () => {
  it("truncates long text", () => {
    const long = Array(100).fill("word").join(" ");
    const excerpt = pickExcerpt(long, 20);
    expect(excerpt.endsWith("...")).toBe(true);
    expect(excerpt.length).toBeLessThanOrEqual(23);
  });

  it("returns short text as-is", () => {
    expect(pickExcerpt("short", 100)).toBe("short");
  });
});
