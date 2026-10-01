"use server";

import { z } from "zod";
import { bookingReference, getBookingSetup, toMinutes, generateSlots, demoBookings } from "@/lib/booking";
import { getBusiness } from "@/lib/qr-platform";
import { actionIp, rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

export type BookingState = {
  ok: boolean;
  message: string | null;
  reference?: string;
};

const schema = z.object({
  slug: z.string().min(1),
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(2, "Please give your name"),
  phone: z.string().min(8, "A phone number is needed to confirm"),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function createBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  /**
   * Four a minute from one address. Enforced here rather than in a helper —
   * the helper existed but was never called, so bookings were unlimited.
   */
  const limit = rateLimit(`booking:${await actionIp()}`, { limit: 4, windowMs: 60_000 });
  if (!limit.ok) {
    return { ok: false, message: "Too many booking attempts. Wait a minute and try again." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const b = parsed.data;
  const business = await getBusiness(b.slug);
  if (!business) return { ok: false, message: "That business is no longer taking bookings." };

  const { services, staff } = await getBookingSetup(b.slug);
  const service = services.find((s) => s.id === b.serviceId);
  if (!service) return { ok: false, message: "That service is no longer available." };

  /**
   * Re-check availability on the server. The slot list the customer saw could
   * be minutes old, and two people can pick the same time simultaneously —
   * trusting the submitted slot is how you double-book a stylist.
   */
  const stillFree = generateSlots({
    date: b.date,
    service,
    staff,
    booked: process.env.DATABASE_URL ? await bookedFor(b.slug, b.date) : demoBookings(b.date),
  }).some((s) => s.time === b.time);

  if (!stillFree) {
    return { ok: false, message: "That slot was taken while you were filling this in. Pick another." };
  }

  const reference = bookingReference();
  const startMinutes = toMinutes(b.time);
  const startsAt = new Date(`${b.date}T${b.time}:00`);
  const endsAt = new Date(`${b.date}T00:00:00`);
  endsAt.setMinutes(startMinutes + service.duration);

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const row = await prisma.business.findUnique({ where: { slug: b.slug }, select: { id: true } });
      if (row) {
        await prisma.booking.create({
          data: {
            businessId: row.id,
            serviceId: b.serviceId,
            staffId: b.staffId,
            reference,
            customerName: b.name,
            customerPhone: b.phone,
            customerEmail: b.email || null,
            notes: b.notes || null,
            startsAt,
            endsAt,
            status: "CONFIRMED",
          },
        });
      }
    } catch (err) {
      console.error("[booking] write failed:", err);
      return { ok: false, message: "Couldn't save that booking. Please call instead." };
    }
  } else {
    console.info(`[booking] ${b.slug} ${reference}: ${b.name} · ${b.date} ${b.time} · ${service.name}`);
  }

  if (b.email) {
    await sendEmail({
      to: b.email,
      subject: `Booking confirmed — ${business.name}`,
      html: `<p>Hello ${b.name},</p>
             <p>Your <strong>${service.name}</strong> at ${business.name} is confirmed for
             <strong>${b.date} at ${b.time}</strong>.</p>
             <p>Reference: <strong>${reference}</strong></p>
             <p>${business.address}</p>
             <p>Need to change it? Call ${business.phone}.</p>`,
    });
  }

  return { ok: true, message: null, reference };
}

async function bookedFor(slug: string, date: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
    if (!row) return [];

    const bookings = await prisma.booking.findMany({
      where: {
        businessId: row.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        startsAt: { gte: new Date(`${date}T00:00:00`), lt: new Date(`${date}T23:59:59`) },
      },
      select: { staffId: true, startsAt: true, endsAt: true },
    });

    return bookings.map((x) => ({
      staffId: x.staffId ?? "",
      startsAt: x.startsAt.toISOString().slice(0, 16),
      endsAt: x.endsAt.toISOString().slice(0, 16),
    }));
  } catch {
    return [];
  }
}


