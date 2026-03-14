import { describe, it, expect } from "vitest";
import { canModerate, canContribute } from "../lib/auth";
import type { UserRole } from "../packages/contracts/src/enums";

describe("canModerate", () => {
  it("returns true for moderator", () => {
    expect(canModerate("moderator")).toBe(true);
  });

  it("returns true for admin", () => {
    expect(canModerate("admin")).toBe(true);
  });

  it("returns false for contributor", () => {
    expect(canModerate("contributor")).toBe(false);
  });

  it("returns false for user", () => {
    expect(canModerate("user")).toBe(false);
  });

  it("returns false for guest", () => {
    expect(canModerate("guest")).toBe(false);
  });
});

describe("canContribute", () => {
  it("returns true for contributor", () => {
    expect(canContribute("contributor")).toBe(true);
  });

  it("returns true for moderator", () => {
    expect(canContribute("moderator")).toBe(true);
  });

  it("returns true for admin", () => {
    expect(canContribute("admin")).toBe(true);
  });

  it("returns false for user", () => {
    expect(canContribute("user")).toBe(false);
  });

  it("returns false for guest", () => {
    expect(canContribute("guest")).toBe(false);
  });
});

describe("role hierarchy coverage", () => {
  const roles: UserRole[] = ["guest", "user", "contributor", "moderator", "admin"];

  it("every role is either contributor or not", () => {
    for (const role of roles) {
      expect(typeof canContribute(role)).toBe("boolean");
    }
  });

  it("moderators are always contributors", () => {
    for (const role of roles) {
      if (canModerate(role)) {
        expect(canContribute(role)).toBe(true);
      }
    }
  });
});
