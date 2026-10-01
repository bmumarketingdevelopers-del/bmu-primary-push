import { describe, expect, it } from "vitest";
import { newVisitorId, visitorKey } from "@/lib/visitors";

/**
 * The identifier has to be stable enough to count repeat visits and useless
 * enough to be worthless if the database leaks.
 */

describe("visitor key", () => {
  it("is stable for the same device at the same business", () => {
    expect(visitorKey("abc123", "salons")).toBe(visitorKey("abc123", "salons"));
  });

  it("differs for the same device at a different business", () => {
    // Otherwise one leaked table would let anyone follow a phone from the
    // salon to the clinic next door.
    expect(visitorKey("abc123", "salons")).not.toBe(visitorKey("abc123", "clinics"));
  });

  it("differs for different devices at the same business", () => {
    expect(visitorKey("abc123", "salons")).not.toBe(visitorKey("xyz789", "salons"));
  });

  it("never contains the raw cookie value", () => {
    const key = visitorKey("abc123", "salons");
    expect(key).not.toContain("abc123");
  });

  it("is fixed length regardless of input", () => {
    expect(visitorKey("a", "salons")).toHaveLength(32);
    expect(visitorKey("a".repeat(500), "salons")).toHaveLength(32);
  });

  it("is not reversible by construction", () => {
    // A hash, not an encoding — the same length out for any length in, and
    // no substring of the input survives.
    const key = visitorKey("distinctive-value-here", "salons");
    expect(key).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("visitor id generation", () => {
  it("produces a different id each time", () => {
    const ids = new Set(Array.from({ length: 50 }, () => newVisitorId()));
    expect(ids.size).toBe(50);
  });

  it("is long enough not to collide by accident", () => {
    // 16 bytes as hex.
    expect(newVisitorId()).toHaveLength(32);
    expect(newVisitorId()).toMatch(/^[0-9a-f]+$/);
  });
});
