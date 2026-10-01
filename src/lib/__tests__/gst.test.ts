import { describe, expect, it } from "vitest";
import { isValidGstin, splitGst, stateCodeOf, stateNameOf } from "@/lib/gst";

/**
 * A GSTR-1 filed with the wrong tax split passes validation and surfaces
 * months later as a mismatch notice. These are the rules worth pinning down.
 */

describe("state codes", () => {
  it("reads the state from the first two digits of a GSTIN", () => {
    expect(stateCodeOf("29AABCU9603R1ZX")).toBe("29");
    expect(stateCodeOf("33AAGCS4567U1Z9")).toBe("33");
  });

  it("returns null rather than guessing when there's no GSTIN", () => {
    expect(stateCodeOf(null)).toBeNull();
    expect(stateCodeOf("")).toBeNull();
  });

  it("names the state", () => {
    expect(stateNameOf("29")).toBe("29-Karnataka");
    expect(stateNameOf("27")).toBe("27-Maharashtra");
  });

  it("validates GSTIN format", () => {
    expect(isValidGstin("29AABCU9603R1ZX")).toBe(true);
    expect(isValidGstin("29AABCU9603R1Z")).toBe(false); // too short
    expect(isValidGstin("not a gstin")).toBe(false);
    expect(isValidGstin(null)).toBe(false);
  });
});

describe("intra-state supply", () => {
  it("splits into CGST and SGST, with no IGST", () => {
    const s = splitGst(118000, { recipientGstin: "29AAACA1234M1Z5" });
    expect(s.isInterState).toBe(false);
    expect(s.igst).toBe(0);
    expect(s.cgst + s.sgst).toBeGreaterThan(0);
  });

  it("splits the tax evenly between the two halves", () => {
    const s = splitGst(118000, { recipientGstin: "29AAACA1234M1Z5" });
    expect(Math.abs(s.cgst - s.sgst)).toBeLessThanOrEqual(1);
  });

  it("treats an unknown recipient as intra-state", () => {
    // The conservative assumption for a domestic agency — and it means an
    // invoice with no GSTIN on file doesn't silently become IGST.
    expect(splitGst(118000).isInterState).toBe(false);
  });
});

describe("inter-state supply", () => {
  it("uses a single IGST at the full rate", () => {
    const s = splitGst(118000, { recipientGstin: "27AAGCK4567U1Z9" });
    expect(s.isInterState).toBe(true);
    expect(s.cgst).toBe(0);
    expect(s.sgst).toBe(0);
    expect(s.igst).toBeGreaterThan(0);
  });

  it("charges the same total tax either way — only the split differs", () => {
    const intra = splitGst(118000, { recipientGstin: "29AAACA1234M1Z5" });
    const inter = splitGst(118000, { recipientGstin: "27AAGCK4567U1Z9" });

    expect(intra.cgst + intra.sgst).toBe(inter.igst);
    expect(intra.taxable).toBe(inter.taxable);
  });

  it("reports the recipient's state as the place of supply", () => {
    // Place of supply is the buyer's state, not ours.
    expect(splitGst(118000, { recipientGstin: "33AAGCS4567U1Z9" }).placeOfSupply)
      .toBe("33-Tamil Nadu");
  });
});

describe("rounding", () => {
  it("never loses or invents a paisa", () => {
    for (const total of [1, 99, 100, 11800, 33333, 99999, 118000, 1234567]) {
      const s = splitGst(total, { recipientGstin: "29AAACA1234M1Z5" });
      expect(s.taxable + s.cgst + s.sgst + s.igst).toBe(total);
    }
  });

  it("balances on inter-state invoices too", () => {
    for (const total of [1, 99, 33333, 118000, 1234567]) {
      const s = splitGst(total, { recipientGstin: "27AAGCK4567U1Z9" });
      expect(s.taxable + s.igst).toBe(total);
    }
  });

  it("handles a 5% rate as well as 18%", () => {
    const s = splitGst(105000, { rate: 5, recipientGstin: "29AAACA1234M1Z5" });
    expect(s.taxable).toBe(100000);
    expect(s.cgst + s.sgst).toBe(5000);
  });
});
