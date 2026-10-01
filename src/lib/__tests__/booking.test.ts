import { describe, expect, it } from "vitest";
import { generateSlots, toMinutes } from "@/lib/booking";
import type { BookableService, BookedRange, Staff } from "@/lib/booking";

/**
 * Double-booking is the failure that loses a salon a customer, so the overlap
 * and buffer rules get the most attention here.
 */

const service: BookableService = {
  id: "s1", name: "Haircut", duration: 45, bufferAfter: 15, price: 45000,
};

/** Empty serviceIds means "can do anything". */
const meena: Staff = {
  id: "st1", name: "Meena", role: "Stylist", serviceIds: [],
  availability: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
    dayOfWeek, startTime: "10:00", endTime: "13:00",
  })),
};

// A Wednesday, far enough ahead that lead time never interferes.
const DATE = "2026-09-16";
const NOW = new Date("2026-09-01T09:00:00");

const booking = (start: string, end: string, staffId = "st1"): BookedRange => ({
  staffId,
  startsAt: `${DATE}T${start}:00`,
  endsAt: `${DATE}T${end}:00`,
});

describe("slot generation", () => {
  it("only offers slots that finish before closing", () => {
    const slots = generateSlots({ date: DATE, service, staff: [meena], booked: [], now: NOW });
    expect(slots.length).toBeGreaterThan(0);

    const block = service.duration + service.bufferAfter; // 60 minutes
    for (const s of slots) {
      expect(toMinutes(s.time)).toBeGreaterThanOrEqual(toMinutes("10:00"));
      expect(toMinutes(s.time) + block).toBeLessThanOrEqual(toMinutes("13:00"));
    }
  });

  it("returns nothing on a day nobody works", () => {
    // 2026-09-20 is a Sunday; availability covers Monday to Friday only.
    const slots = generateSlots({ date: "2026-09-20", service, staff: [meena], booked: [], now: NOW });
    expect(slots).toHaveLength(0);
  });

  it("removes a slot that overlaps an existing booking", () => {
    const free = generateSlots({ date: DATE, service, staff: [meena], booked: [], now: NOW });
    const taken = generateSlots({
      date: DATE, service, staff: [meena], now: NOW,
      booked: [booking("10:00", "11:00")],
    });

    expect(taken.length).toBeLessThan(free.length);
    expect(taken.some((s) => s.time === "10:00")).toBe(false);
  });

  it("blocks the buffer as well as the appointment itself", () => {
    // A 45-minute service plus a 15-minute buffer occupies an hour. A booking
    // recorded as 10:00–10:45 must still block 10:15 and 10:30 — the next
    // customer can't arrive before the chair is free.
    const slots = generateSlots({
      date: DATE, service, staff: [meena], now: NOW,
      booked: [booking("10:00", "10:45")],
    });

    expect(slots.some((s) => s.time === "10:15")).toBe(false);
    expect(slots.some((s) => s.time === "10:30")).toBe(false);
  });

  it("still offers the time when another staff member is free", () => {
    const farhan: Staff = { ...meena, id: "st2", name: "Farhan" };
    const slots = generateSlots({
      date: DATE, service, staff: [meena, farhan], now: NOW,
      booked: [booking("10:00", "11:00", "st1")],
    });

    // Meena is busy, Farhan isn't — the slot survives, attributed to Farhan.
    const ten = slots.find((s) => s.time === "10:00");
    expect(ten?.staffId).toBe("st2");
  });

  it("offers each time once, however many staff are free", () => {
    const farhan: Staff = { ...meena, id: "st2", name: "Farhan" };
    const slots = generateSlots({ date: DATE, service, staff: [meena, farhan], booked: [], now: NOW });
    const times = slots.map((s) => s.time);

    expect(new Set(times).size).toBe(times.length);
  });

  it("skips staff who don't offer the service", () => {
    const colourist: Staff = { ...meena, id: "st3", serviceIds: ["s2"] };
    const slots = generateSlots({ date: DATE, service, staff: [colourist], booked: [], now: NOW });

    expect(slots).toHaveLength(0);
  });

  it("hides slots inside the lead time when booking for today", () => {
    const slots = generateSlots({
      date: DATE, service, staff: [meena], booked: [],
      now: new Date(`${DATE}T10:00:00`),
      leadTimeMinutes: 60,
    });

    expect(slots.every((s) => toMinutes(s.time) >= toMinutes("11:00"))).toBe(true);
  });

  it("steps by the requested interval", () => {
    const slots = generateSlots({
      date: DATE, service, staff: [meena], booked: [], now: NOW, stepMinutes: 30,
    });

    for (const s of slots) {
      expect(toMinutes(s.time) % 30).toBe(0);
    }
  });

  it("ignores bookings belonging to a different day", () => {
    const other: BookedRange = {
      staffId: "st1",
      startsAt: "2026-09-17T10:00:00",
      endsAt: "2026-09-17T11:00:00",
    };
    const slots = generateSlots({ date: DATE, service, staff: [meena], booked: [other], now: NOW });

    expect(slots.some((s) => s.time === "10:00")).toBe(true);
  });
});
