import { describe, expect, it } from "vitest";
import { extractPlaceId, googleReviewUrl, isShortLink } from "@/lib/google-review";
import { contrastRatio, readableOn, resolveTheme } from "@/lib/profile-theme";

/**
 * The review link decides whether a customer lands on the review box or on a
 * listing page they then have to navigate. It's the difference between a
 * review and an abandoned tab.
 */

describe("Place ID extraction", () => {
  it("accepts a bare Place ID", () => {
    expect(extractPlaceId("ChIJN1t_tDeuEmsRUsoyG83frY4")).toBe("ChIJN1t_tDeuEmsRUsoyG83frY4");
  });

  it("pulls one out of a placeid query parameter", () => {
    const url = "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4";
    expect(extractPlaceId(url)).toBe("ChIJN1t_tDeuEmsRUsoyG83frY4");
  });

  it("pulls one out of a maps data URL", () => {
    const url = "https://www.google.com/maps/place/Cafe/@12.9,77.6,17z/data=!3m1!4b1!1sChIJN1t_tDeuEmsRUsoyG83frY4";
    expect(extractPlaceId(url)).toBe("ChIJN1t_tDeuEmsRUsoyG83frY4");
  });

  it("returns null for junk rather than a wrong ID", () => {
    expect(extractPlaceId("")).toBeNull();
    expect(extractPlaceId("not a url")).toBeNull();
    expect(extractPlaceId("https://example.com")).toBeNull();
  });

  it("recognises the short links Google's share sheet produces", () => {
    expect(isShortLink("https://maps.app.goo.gl/abc123")).toBe(true);
    expect(isShortLink("https://www.google.com/maps/place/X")).toBe(false);
  });
});

describe("review URL quality", () => {
  it("builds a direct write-review link when a Place ID is known", () => {
    const t = googleReviewUrl({ placeId: "ChIJabc123" });
    expect(t.quality).toBe("direct");
    expect(t.url).toContain("writereview");
  });

  it("falls back to the listing when only a maps URL is known", () => {
    const t = googleReviewUrl({ mapsUrl: "https://maps.app.goo.gl/xyz" });
    expect(t.quality).toBe("listing");
  });

  it("falls back to a name search as a last resort, and says so", () => {
    const t = googleReviewUrl({ businessName: "ABC Salon", city: "Bengaluru" });
    expect(t.quality).toBe("search");
    // The note must warn that this one is unreliable.
    expect(t.note.toLowerCase()).toContain("unreliable");
  });

  it("never returns an empty URL", () => {
    expect(googleReviewUrl({}).url.length).toBeGreaterThan(0);
  });
});

describe("profile theme contrast", () => {
  it("scores black on white as maximum contrast", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });

  it("scores identical colours as no contrast", () => {
    expect(contrastRatio("#8BB72C", "#8BB72C")).toBeCloseTo(1, 1);
  });

  it("picks readable text for a given background", () => {
    expect(readableOn("#121F2F")).toBe("#FFFFFF");
    expect(readableOn("#F8F7F4")).toBe("#111111");
  });

  it("gives each industry a starting theme", () => {
    expect(resolveTheme("SALON").theme).not.toBe(resolveTheme("GYM").theme);
  });

  it("lets a saved value override the industry default", () => {
    const t = resolveTheme("SALON", { theme: "midnight" });
    expect(t.theme).toBe("midnight");
  });
});
