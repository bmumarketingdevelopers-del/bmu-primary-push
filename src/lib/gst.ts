/**
 * GST helpers for Indian tax filing.
 *
 * The rules that matter here:
 *  - Intra-state supply splits into CGST + SGST at half the rate each.
 *  - Inter-state supply is a single IGST at the full rate.
 *  - Place of supply is the *recipient's* state, not the supplier's.
 *
 * Getting this wrong doesn't produce a visibly broken file — it produces a
 * GSTR-1 that files cleanly and is wrong, which surfaces months later as a
 * mismatch notice.
 */

/** GST state codes, as they appear in the first two digits of a GSTIN. */
export const STATE_CODES: Record<string, string> = {
  "01": "Jammu and Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana", "07": "Delhi",
  "08": "Rajasthan", "09": "Uttar Pradesh", "10": "Bihar", "11": "Sikkim",
  "12": "Arunachal Pradesh", "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
  "16": "Tripura", "17": "Meghalaya", "18": "Assam", "19": "West Bengal",
  "20": "Jharkhand", "21": "Odisha", "22": "Chhattisgarh", "23": "Madhya Pradesh",
  "24": "Gujarat", "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra", "29": "Karnataka", "30": "Goa", "31": "Lakshadweep",
  "32": "Kerala", "33": "Tamil Nadu", "34": "Puducherry", "35": "Andaman and Nicobar Islands",
  "36": "Telangana", "37": "Andhra Pradesh", "38": "Ladakh",
};

/** Where the agency is registered. Everything is compared against this. */
export const HOME_STATE_CODE = process.env.AGENCY_STATE_CODE ?? "29";
export const AGENCY_GSTIN = process.env.AGENCY_GSTIN ?? "29AABCU9603R1ZX";

export const stateCodeOf = (gstin?: string | null) =>
  gstin && gstin.length >= 2 ? gstin.slice(0, 2) : null;

export const stateNameOf = (code: string | null) =>
  code ? `${code}-${STATE_CODES[code] ?? "Unknown"}` : "";

/** A GSTIN is 15 characters: 2 state + 10 PAN + 3. Format check only. */
export function isValidGstin(gstin?: string | null) {
  if (!gstin) return false;
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/.test(gstin.trim().toUpperCase());
}

export type GstSplit = {
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  isInterState: boolean;
  placeOfSupply: string;
};

/**
 * Reverses a GST-inclusive total into its components.
 *
 * Rounding is done once on the taxable value and the tax is the remainder, so
 * taxable + tax always equals the total exactly. Splitting CGST and SGST
 * independently would drift by a paisa on odd amounts.
 */
export function splitGst(
  total: number,
  opts: { rate?: number; recipientGstin?: string | null; recipientState?: string | null } = {}
): GstSplit {
  const rate = opts.rate ?? 18;
  const taxable = Math.round(total / (1 + rate / 100));
  const tax = total - taxable;

  const recipientCode =
    stateCodeOf(opts.recipientGstin) ??
    (opts.recipientState
      ? Object.entries(STATE_CODES).find(([, n]) => n === opts.recipientState)?.[0] ?? null
      : null);

  // Unknown recipient state is treated as intra-state, matching the agency's
  // own registration — the conservative assumption for a domestic agency.
  const isInterState = Boolean(recipientCode) && recipientCode !== HOME_STATE_CODE;

  if (isInterState) {
    return {
      taxable, cgst: 0, sgst: 0, igst: tax,
      isInterState: true,
      placeOfSupply: stateNameOf(recipientCode),
    };
  }

  const cgst = Math.round(tax / 2);
  return {
    taxable,
    cgst,
    sgst: tax - cgst,
    igst: 0,
    isInterState: false,
    placeOfSupply: stateNameOf(recipientCode ?? HOME_STATE_CODE),
  };
}
