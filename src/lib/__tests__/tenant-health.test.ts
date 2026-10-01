import { describe, expect, it } from "vitest";
import { assessTenant, urgency, type HealthInput } from "@/lib/tenant-health";

const healthy: HealthInput = {
  daysSinceLastScan: 1,
  scansLast30: 1200,
  scansPrev30: 1150,
  reviewsLast30: 30,
  activeCodes: 6,
  profileCompleteness: 100,
  unresolvedComplaints: 0,
  daysToRenewal: 200,
  loggedInLast30: true,
};

describe("scoring", () => {
  it("scores a busy, recently used account as healthy", () => {
    const h = assessTenant(healthy);
    expect(h.band).toBe("HEALTHY");
    expect(h.score).toBe(100);
    expect(h.topAction).toBeNull();
  });

  it("penalises silence more than any other single signal", () => {
    const quiet = assessTenant({ ...healthy, daysSinceLastScan: 31 });
    const incomplete = assessTenant({ ...healthy, profileCompleteness: 40 });

    // Dormancy is the signal that predicts churn; it must dominate.
    expect(quiet.score).toBeLessThan(incomplete.score);
  });

  it("catches a busy account that has gone quiet", () => {
    // The case a volume-based score would miss entirely: huge historical
    // numbers, nothing this month.
    const h = assessTenant({
      ...healthy,
      daysSinceLastScan: 50,
      scansLast30: 2,
      scansPrev30: 4000,
    });

    expect(h.band).toBe("DORMANT");
    expect(h.topAction).toContain("Call today");
  });

  it("does not flag a low-volume account that is still being used", () => {
    // A village shop scanning twice a week is fine.
    const h = assessTenant({
      ...healthy,
      scansLast30: 9,
      scansPrev30: 8,
      reviewsLast30: 1,
      daysSinceLastScan: 2,
    });
    expect(h.band).toBe("HEALTHY");
  });

  it("never scores below zero", () => {
    const worst = assessTenant({
      daysSinceLastScan: 200,
      scansLast30: 0,
      scansPrev30: 5000,
      reviewsLast30: 0,
      activeCodes: 1,
      profileCompleteness: 10,
      unresolvedComplaints: 9,
      daysToRenewal: 5,
      loggedInLast30: false,
    });
    expect(worst.score).toBeGreaterThanOrEqual(0);
    expect(worst.band).toBe("DORMANT");
  });

  it("gives every triggered signal an action", () => {
    const h = assessTenant({ ...healthy, daysSinceLastScan: 40, unresolvedComplaints: 2 });
    for (const s of h.signals.filter((x) => x.triggered)) {
      expect(s.action.length).toBeGreaterThan(10);
    }
  });
});

describe("signals", () => {
  it("flags scans that fell sharply even when the total is still decent", () => {
    const h = assessTenant({ ...healthy, scansLast30: 400, scansPrev30: 1200 });
    expect(h.signals.find((s) => s.key === "falling")?.triggered).toBe(true);
  });

  it("does not flag a small dip", () => {
    const h = assessTenant({ ...healthy, scansLast30: 1000, scansPrev30: 1150 });
    expect(h.signals.find((s) => s.key === "falling")?.triggered).toBe(false);
  });

  it("flags scanning without reviewing, but only above a volume floor", () => {
    const busy = assessTenant({ ...healthy, reviewsLast30: 0, scansLast30: 200 });
    const tiny = assessTenant({ ...healthy, reviewsLast30: 0, scansLast30: 3 });

    expect(busy.signals.find((s) => s.key === "no-reviews")?.triggered).toBe(true);
    // Three scans and no reviews is not a problem worth calling about.
    expect(tiny.signals.find((s) => s.key === "no-reviews")?.triggered).toBe(false);
  });

  it("handles a brand-new account with no history", () => {
    const h = assessTenant({ ...healthy, scansPrev30: 0, scansLast30: 40 });
    // No previous month means no drop — not a 100% collapse.
    expect(h.signals.find((s) => s.key === "falling")?.triggered).toBe(false);
  });
});

describe("urgency", () => {
  it("stays silent for a healthy account near renewal", () => {
    expect(urgency(assessTenant(healthy), 10)).toBe("none");
  });

  it("escalates a struggling account close to renewal", () => {
    const h = assessTenant({ ...healthy, daysSinceLastScan: 35 });
    expect(urgency(h, 20)).toBe("this-week");
    expect(urgency(h, 200)).toBe("when-you-can");
  });
});
