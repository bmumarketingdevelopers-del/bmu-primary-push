/**
 * Google review deep links.
 *
 * IMPORTANT, and worth telling clients plainly: Google does not support
 * pre-filling review text or a star rating through a URL. There is no
 * parameter for it, official or otherwise. Every product that claims to
 * "auto-fill the review" is doing exactly what this does — copying the text
 * to the clipboard and opening the review box for the customer to paste.
 *
 * What we can do reliably:
 *  - open the write-review dialog directly, skipping the listing page
 *  - have the text already on the clipboard so it's one long-press to paste
 *  - remember that the customer chose five stars, so the flow feels finished
 */

/** Pulls a Place ID out of whatever the owner pasted. */
export function extractPlaceId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Already a bare Place ID.
  if (/^ChI[A-Za-z0-9_-]{10,}$/.test(value)) return value;

  const patterns = [
    /[?&]placeid=([^&\s]+)/i,
    /[?&]place_id=([^&\s]+)/i,
    /!1s(ChI[A-Za-z0-9_-]+)/,
    /\/place\/[^/]+\/data=.*?!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i,
  ];

  for (const re of patterns) {
    const m = value.match(re);
    if (m?.[1]) return decodeURIComponent(m[1]);
  }

  return null;
}

/** True for the short links Google hands out from the share sheet. */
export const isShortLink = (url: string) =>
  /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//i.test(url.trim());

export type ReviewTarget = {
  url: string;
  /** How confident we are it opens the review box rather than the listing. */
  quality: "direct" | "listing" | "search";
  note: string;
};

export function googleReviewUrl(opts: {
  placeId?: string | null;
  mapsUrl?: string | null;
  businessName?: string;
  city?: string;
}): ReviewTarget {
  const placeId = opts.placeId || (opts.mapsUrl ? extractPlaceId(opts.mapsUrl) : null);

  if (placeId) {
    return {
      url: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
      quality: "direct",
      note: "Opens the review box straight away.",
    };
  }

  if (opts.mapsUrl?.trim()) {
    return {
      url: opts.mapsUrl.trim(),
      quality: "listing",
      note: "Opens your listing. The customer taps Reviews, then Write a review — one extra step.",
    };
  }

  const q = [opts.businessName, opts.city].filter(Boolean).join(" ");
  return {
    url: `https://www.google.com/maps/search/${encodeURIComponent(q || "business")}`,
    quality: "search",
    note: "No listing connected — this searches Maps by name, which is unreliable.",
  };
}
