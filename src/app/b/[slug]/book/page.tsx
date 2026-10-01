import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookingFlow } from "@/components/smart/booking-flow";
import { getBusiness } from "@/lib/qr-platform";
import { bookableDates, demoBookings, generateSlots, getBookingSetup, type Slot } from "@/lib/booking";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBusiness(slug);
  return { title: b ? `Book at ${b.name}` : "Book", robots: { index: false } };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business || !business.isPublished) notFound();

  const { services, staff } = await getBookingSetup(slug);
  const dates = bookableDates(staff);

  /**
   * Slots for every offered date are computed once on the server. The flow is
   * then instant when someone taps between days — which matters, because this
   * is opened on mobile data outside a shop.
   */
  const slotsByDate: Record<string, Slot[]> = {};
  for (const d of dates) {
    for (const service of services) {
      const key = `${d.date}`;
      if (!slotsByDate[key]) {
        slotsByDate[key] = generateSlots({
          date: d.date,
          service,
          staff,
          booked: demoBookings(d.date),
        });
      }
    }
  }

  return (
    <main className={styles.main}>
      <BookingFlow
        slug={business.slug}
        businessName={business.name}
        brandColor={business.brandColor}
        services={services}
        dates={dates}
        slotsByDate={slotsByDate}
      />

      <p className={styles.footer}>
        <Link href={`/b/${business.slug}`} className={styles.businessLink}>
          {business.name}
        </Link>
        {" · Powered by BMU QR"}
      </p>
    </main>
  );
}
