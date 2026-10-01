/**
 * Booking engine.
 *
 * The interesting part is slot generation: opening hours minus breaks, minus
 * time off, minus what's already booked, stepped by the service duration and
 * clipped so nothing runs past closing.
 */

export type BookableService = {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  bufferAfter: number;
  price?: number; // paise
  depositAmount?: number;
};

export type Staff = {
  id: string;
  name: string;
  role?: string;
  serviceIds: string[]; // empty = can do anything
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    breakStart?: string;
    breakEnd?: string;
  }[];
};

export type BookedRange = { staffId: string; startsAt: string; endsAt: string };

export type Slot = { time: string; staffId: string; staffName: string };

/* ----------------------------- time helpers ----------------------------- */

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const prettyTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
  aStart < bEnd && bStart < aEnd;

/* --------------------------- slot generation ---------------------------- */

export function generateSlots({
  date,
  service,
  staff,
  booked,
  stepMinutes = 15,
  leadTimeMinutes = 60,
  now = new Date(),
}: {
  date: string; // YYYY-MM-DD
  service: BookableService;
  staff: Staff[];
  booked: BookedRange[];
  stepMinutes?: number;
  leadTimeMinutes?: number;
  now?: Date;
}): Slot[] {
  const day = new Date(`${date}T00:00:00`).getDay();
  const isToday = date === now.toISOString().slice(0, 10);
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + leadTimeMinutes : 0;

  const block = service.duration + service.bufferAfter;
  const slots: Slot[] = [];
  const seen = new Set<string>();

  for (const person of staff) {
    // Staff who don't offer this service can't be offered for it.
    if (person.serviceIds.length && !person.serviceIds.includes(service.id)) continue;

    const shift = person.availability.find((a) => a.dayOfWeek === day);
    if (!shift) continue;

    const open = toMinutes(shift.startTime);
    const close = toMinutes(shift.endTime);
    const breakStart = shift.breakStart ? toMinutes(shift.breakStart) : null;
    const breakEnd = shift.breakEnd ? toMinutes(shift.breakEnd) : null;

    const theirBookings = booked
      .filter((b) => b.staffId === person.id && b.startsAt.startsWith(date))
      .map((b) => ({
        start: toMinutes(b.startsAt.slice(11, 16)),
        end: toMinutes(b.endsAt.slice(11, 16)),
      }));

    for (let start = open; start + block <= close; start += stepMinutes) {
      const end = start + block;

      if (start < earliest) continue;
      if (breakStart !== null && breakEnd !== null && overlaps(start, end, breakStart, breakEnd)) continue;
      if (theirBookings.some((b) => overlaps(start, end, b.start, b.end))) continue;

      const time = toTime(start);
      // One entry per time — whoever is free first gets offered.
      const key = time;
      if (seen.has(key)) continue;
      seen.add(key);

      slots.push({ time, staffId: person.id, staffName: person.name });
    }
  }

  return slots.sort((a, b) => a.time.localeCompare(b.time));
}

/** The next 14 days, excluding days nobody works. */
export function bookableDates(staff: Staff[], days = 14, from = new Date()) {
  const workingDays = new Set(staff.flatMap((s) => s.availability.map((a) => a.dayOfWeek)));
  const out: { date: string; label: string; weekday: string }[] = [];

  for (let i = 0; i < days * 2 && out.length < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    if (!workingDays.has(d.getDay())) continue;

    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    });
  }
  return out;
}

export function bookingReference() {
  return `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/* ------------------------------ demo data ------------------------------- */

export const DEMO_SERVICES: Record<string, BookableService[]> = {
  "abc-salon": [
    { id: "sv-1", name: "Haircut & styling", description: "Wash, cut and blow dry", duration: 45, bufferAfter: 10, price: 45000 },
    { id: "sv-2", name: "Hair colour", description: "Global or root touch-up", duration: 120, bufferAfter: 15, price: 180000, depositAmount: 50000 },
    { id: "sv-3", name: "Facial", description: "Deep cleanse and massage", duration: 60, bufferAfter: 10, price: 120000 },
    { id: "sv-4", name: "Bridal trial", description: "Full look with consultation", duration: 180, bufferAfter: 30, price: 1500000, depositAmount: 300000 },
  ],
  "saffron-co": [
    { id: "sv-t2", name: "Table for 2", duration: 90, bufferAfter: 15 },
    { id: "sv-t4", name: "Table for 4", duration: 90, bufferAfter: 15 },
    { id: "sv-t8", name: "Large group (8+)", description: "We'll call to confirm", duration: 120, bufferAfter: 20 },
  ],
};

const weekdayShift = (start: string, end: string, breakStart?: string, breakEnd?: string) =>
  [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({ dayOfWeek, startTime: start, endTime: end, breakStart, breakEnd }));

export const DEMO_STAFF: Record<string, Staff[]> = {
  "abc-salon": [
    {
      id: "st-1", name: "Meena Rao", role: "Senior stylist · colour specialist",
      serviceIds: [],
      availability: weekdayShift("10:00", "19:00", "14:00", "14:45"),
    },
    {
      id: "st-2", name: "Farhan Q.", role: "Stylist",
      serviceIds: ["sv-1", "sv-3"],
      availability: weekdayShift("11:00", "20:00", "15:00", "15:30"),
    },
    {
      id: "st-3", name: "Latha S.", role: "Beauty therapist",
      serviceIds: ["sv-3", "sv-4"],
      availability: [0, 2, 4, 6].map((dayOfWeek) => ({
        dayOfWeek, startTime: "10:00", endTime: "17:00",
      })),
    },
  ],
  "saffron-co": [
    {
      id: "st-r1", name: "Dining room", role: "Main floor",
      serviceIds: [],
      availability: [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
        dayOfWeek, startTime: "12:00", endTime: "22:30",
      })),
    },
  ],
};

/** Pre-filled bookings so the demo shows realistic gaps rather than a blank grid. */
export function demoBookings(date: string): BookedRange[] {
  return [
    { staffId: "st-1", startsAt: `${date}T11:00`, endsAt: `${date}T12:00` },
    { staffId: "st-1", startsAt: `${date}T16:30`, endsAt: `${date}T18:45` },
    { staffId: "st-2", startsAt: `${date}T12:30`, endsAt: `${date}T13:30` },
    { staffId: "st-3", startsAt: `${date}T13:00`, endsAt: `${date}T14:10` },
  ];
}

export async function getBookingSetup(slug: string) {
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const business = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
      if (business) {
        const [services, staff] = await Promise.all([
          prisma.bookableService.findMany({
            where: { businessId: business.id, isActive: true },
            orderBy: { sortOrder: "asc" },
          }),
          prisma.businessStaff.findMany({
            where: { businessId: business.id, isBookable: true },
            include: { availability: true },
            orderBy: { sortOrder: "asc" },
          }),
        ]);

        return {
          services: services.map((s) => ({
            id: s.id, name: s.name, description: s.description ?? undefined,
            duration: s.duration, bufferAfter: s.bufferAfter,
            price: s.price ?? undefined, depositAmount: s.depositAmount ?? undefined,
          })),
          staff: staff.map((p) => ({
            id: p.id, name: p.name, role: p.role ?? undefined, serviceIds: p.serviceIds,
            availability: p.availability.map((a) => ({
              dayOfWeek: a.dayOfWeek, startTime: a.startTime, endTime: a.endTime,
              breakStart: a.breakStart ?? undefined, breakEnd: a.breakEnd ?? undefined,
            })),
          })),
        };
      }
    } catch (err) {
      console.warn("[booking] database unreachable, using demo setup:", err);
    }
  }

  // Any industry without hand-written slots falls back to a generic
  // one-resource setup built from its own service list, so /book never 404s.
  if (DEMO_SERVICES[slug]) {
    return { services: DEMO_SERVICES[slug], staff: DEMO_STAFF[slug] ?? DEMO_STAFF["abc-salon"] };
  }

  const { industryBusinessBySlug } = await import("./demo-businesses");
  const business = industryBusinessBySlug(slug);

  if (business) {
    const services: BookableService[] = business.services.slice(0, 4).map((s, i) => ({
      id: `gen-${i}`,
      name: s.name,
      duration: 45,
      bufferAfter: 10,
      price: s.price,
    }));

    const staff: Staff[] = [
      {
        id: "gen-staff",
        name: business.name,
        role: "Available slots",
        serviceIds: [],
        availability: [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
          dayOfWeek, startTime: "10:00", endTime: "19:00",
        })),
      },
    ];

    return { services: services.length ? services : DEMO_SERVICES["abc-salon"], staff };
  }

  return { services: DEMO_SERVICES["abc-salon"], staff: DEMO_STAFF["abc-salon"] };
}
