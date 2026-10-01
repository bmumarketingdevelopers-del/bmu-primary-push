import { describe, expect, it } from "vitest";
import { complianceFor, complianceGaps, complianceScore } from "@/lib/compliance";

describe("what each trade must display", () => {
  it("requires FSSAI of a restaurant", () => {
    const states = complianceFor("RESTAURANT", {});
    expect(states.find((s) => s.key === "fssaiNumber")?.required).toBe(true);
  });

  it("does not require FSSAI of a salon", () => {
    const states = complianceFor("SALON", {});
    expect(states.find((s) => s.key === "fssaiNumber")).toBeUndefined();
  });

  it("requires RERA of a developer", () => {
    expect(complianceFor("REAL_ESTATE", {}).find((s) => s.key === "reraNumber")?.required).toBe(true);
  });

  it("requires a drug licence of a hospital but not a gym", () => {
    expect(complianceFor("HOSPITAL", {}).some((s) => s.key === "drugLicence" && s.required)).toBe(true);
    expect(complianceFor("GYM", {}).some((s) => s.key === "drugLicence")).toBe(false);
  });

  it("falls back sensibly for an unknown category", () => {
    expect(complianceFor("SOMETHING_NEW", {}).length).toBeGreaterThan(0);
  });
});

describe("gaps and scoring", () => {
  it("reports a missing required number as a gap", () => {
    const gaps = complianceGaps(complianceFor("RESTAURANT", { gstNumber: "29AABCU9603R1ZX" }));
    expect(gaps.map((g) => g.key)).toContain("fssaiNumber");
  });

  it("scores fully when everything required is present", () => {
    const states = complianceFor("RESTAURANT", {
      fssaiNumber: "11223344556677",
      gstNumber: "29AABCU9603R1ZX",
    });
    expect(complianceScore(states)).toBe(100);
    expect(complianceGaps(states)).toHaveLength(0);
  });

  it("scores 100 for a trade with no obligations rather than zero", () => {
    // Dividing by nothing must not produce a failing score for a business
    // that has nothing to display.
    expect(complianceScore(complianceFor("FREELANCER", {}))).toBe(100);
  });

  it("ignores optional extras when scoring", () => {
    const states = complianceFor("SALON", {
      gstNumber: "29AABCU9603R1ZX",
      otherLicence: "Trade licence 4421",
    });
    expect(complianceScore(states)).toBe(100);
  });
});

describe("format checks are advisory", () => {
  it("flags a malformed number without hiding it", () => {
    const state = complianceFor("RESTAURANT", { fssaiNumber: "123" })
      .find((s) => s.key === "fssaiNumber")!;

    expect(state.present).toBe(true);   // still displayed
    expect(state.looksValid).toBe(false); // but flagged
  });

  it("accepts a correctly formatted FSSAI number", () => {
    const state = complianceFor("RESTAURANT", { fssaiNumber: "11223344556677" })
      .find((s) => s.key === "fssaiNumber")!;
    expect(state.looksValid).toBe(true);
  });

  it("treats a licence with no pattern as always valid", () => {
    const state = complianceFor("HOSPITAL", { drugLicence: "anything at all" })
      .find((s) => s.key === "drugLicence")!;
    expect(state.looksValid).toBe(true);
  });

  it("ignores surrounding whitespace", () => {
    const state = complianceFor("RESTAURANT", { fssaiNumber: "  11223344556677  " })
      .find((s) => s.key === "fssaiNumber")!;
    expect(state.present).toBe(true);
    expect(state.looksValid).toBe(true);
  });
});
