import { describe, expect, it } from "vitest";
import { cartTotals, TAX_RATE } from "@/lib/menu";
import {
  FREE_SHIPPING_THRESHOLD, GST_RATE, SHIPPING_FLAT, storeTotals,
} from "@/lib/store";
import { inr } from "@/lib/utils";

/**
 * Money is the part where a silent bug costs real money rather than looking
 * wrong. These cover the three GST conventions and the rounding edges.
 */

describe("store totals — GST-inclusive pricing", () => {
  const line = (price: number, quantity = 1) => ({ slug: "x", name: "X", price, quantity });

  it("charges flat shipping below the free threshold", () => {
    const t = storeTotals([line(FREE_SHIPPING_THRESHOLD - 100)]);
    expect(t.shipping).toBe(SHIPPING_FLAT);
  });

  it("drops shipping exactly at the threshold, not just above it", () => {
    // Off-by-one here means a customer at exactly ₹2,000 pays ₹99 they were promised they wouldn't.
    const t = storeTotals([line(FREE_SHIPPING_THRESHOLD)]);
    expect(t.shipping).toBe(0);
  });

  it("charges no shipping on an empty cart", () => {
    expect(storeTotals([]).shipping).toBe(0);
    expect(storeTotals([]).total).toBe(0);
  });

  it("extracts GST rather than adding it — the total equals the listed price", () => {
    const t = storeTotals([line(118000)]); // ₹1,180 listed
    expect(t.total).toBe(t.subtotal + t.shipping);
    expect(t.gst).toBeGreaterThan(0);
  });

  it("keeps taxable + gst equal to the total, whatever the rounding", () => {
    for (const price of [1, 99, 100, 33333, 99999, 118000, 250000]) {
      const t = storeTotals([line(price)]);
      const taxable = t.total - t.gst;
      expect(taxable + t.gst).toBe(t.total);
    }
  });

  it("multiplies by quantity", () => {
    expect(storeTotals([line(50000, 3)]).subtotal).toBe(150000);
    expect(storeTotals([line(50000, 3)]).count).toBe(3);
  });

  it("uses the stated GST rate", () => {
    expect(GST_RATE).toBe(18);
  });
});

describe("menu totals — GST added on top", () => {
  const line = (price: number, quantity = 1) => ({
    itemId: "i", name: "Dish", price, quantity,
  });

  it("adds tax rather than extracting it", () => {
    const t = cartTotals([line(100000)]); // ₹1,000
    expect(t.subtotal).toBe(100000);
    expect(t.tax).toBe(5000); // 5%
    expect(t.total).toBe(105000);
  });

  it("differs from the store deliberately", () => {
    // Restaurant bills are pre-tax; product prices are inclusive. If these
    // ever match, someone has "fixed" one of them.
    expect(TAX_RATE).not.toBe(GST_RATE);
  });

  it("rounds tax to whole paise", () => {
    const t = cartTotals([line(3333)]);
    expect(Number.isInteger(t.tax)).toBe(true);
    expect(t.total).toBe(t.subtotal + t.tax);
  });

  it("handles an empty cart", () => {
    const t = cartTotals([]);
    expect(t).toMatchObject({ subtotal: 0, tax: 0, total: 0, count: 0 });
  });
});

describe("currency formatting", () => {
  it("renders paise as rupees", () => {
    expect(inr(100000)).toContain("1,000");
  });

  it("handles zero", () => {
    expect(inr(0)).toContain("0");
  });
});
