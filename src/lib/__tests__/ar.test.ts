import { describe, expect, it } from "vitest";
import { adviseTarget, arUrl, AR_CONTENT, VERDICT_COPY } from "@/lib/ar";

const good = {
  featurePoints: 900,
  flatAreaRatio: 0.2,
  hasRepeatingPattern: false,
  widthPx: 1200,
  heightPx: 1600,
};

/**
 * The scoring exists to stop someone printing 5,000 flyers that won't track.
 * Being wrong in the permissive direction is the expensive failure.
 */

describe("target advice", () => {
  it("passes busy, high-resolution artwork", () => {
    const a = adviseTarget(good);
    expect(a.verdict).toBe("GOOD");
    expect(a.reasons).toHaveLength(0);
  });

  it("rejects artwork with almost no detail", () => {
    // A logo centred on white — the most common thing someone tries.
    const a = adviseTarget({ ...good, featurePoints: 60, flatAreaRatio: 0.85 });
    expect(a.verdict).toBe("POOR");
    expect(a.reasons.join(" ")).toContain("flat colour");
  });

  it("penalises a repeating pattern enough to drop it out of GOOD", () => {
    const plain = adviseTarget(good);
    const repeated = adviseTarget({ ...good, hasRepeatingPattern: true });

    expect(repeated.score).toBeLessThan(plain.score);
    expect(repeated.verdict).not.toBe("GOOD");
    expect(repeated.reasons.join(" ")).toContain("repeat");
  });

  it("warns about low resolution", () => {
    const a = adviseTarget({ ...good, widthPx: 300, heightPx: 400 });
    expect(a.reasons.join(" ")).toContain("resolution");
  });

  it("uses the shorter side for the resolution check", () => {
    // A wide banner: 2000x300 is still too short to track well.
    const a = adviseTarget({ ...good, widthPx: 2000, heightPx: 300 });
    expect(a.reasons.join(" ")).toContain("resolution");
  });

  it("never scores below zero however bad the artwork", () => {
    const a = adviseTarget({
      featurePoints: 0,
      flatAreaRatio: 1,
      hasRepeatingPattern: true,
      widthPx: 100,
      heightPx: 100,
    });
    expect(a.score).toBe(0);
    expect(a.verdict).toBe("POOR");
  });

  it("gives a middling score to borderline artwork rather than passing it", () => {
    // 200 feature points is workable but not safe — it must not read as GOOD,
    // because GOOD is what someone acts on before a print run.
    const a = adviseTarget({ ...good, featurePoints: 200 });
    expect(a.verdict).toBe("USABLE");
    expect(a.reasons.join(" ")).toContain("drift");
  });

  it("attaches an explanation to every deduction", () => {
    const a = adviseTarget({ ...good, featurePoints: 50, hasRepeatingPattern: true, widthPx: 200, heightPx: 200 });
    expect(a.score).toBeLessThan(100);
    expect(a.reasons.length).toBeGreaterThanOrEqual(3);
  });
});

describe("copy and config", () => {
  it("has copy for every verdict", () => {
    for (const v of ["GOOD", "USABLE", "POOR"] as const) {
      expect(VERDICT_COPY[v].length).toBeGreaterThan(10);
    }
  });

  it("tells a POOR target not to print", () => {
    expect(VERDICT_COPY.POOR.toLowerCase()).toContain("before printing");
  });

  it("describes every content type", () => {
    for (const key of ["VIDEO", "IMAGE", "MODEL"] as const) {
      expect(AR_CONTENT[key].note.length).toBeGreaterThan(10);
      expect(AR_CONTENT[key].accept.length).toBeGreaterThan(0);
    }
  });

  it("builds an absolute AR url", () => {
    expect(arUrl("menu-card")).toMatch(/\/ar\/menu-card$/);
    expect(arUrl("menu-card")).toMatch(/^https?:\/\//);
  });
});
