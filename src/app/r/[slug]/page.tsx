import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ReviewBooster } from "@/components/smart/review-booster";
import { getBusiness } from "@/lib/qr-platform";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leave a review",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) notFound();

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <ReviewBooster
          slug={business.slug}
          name={business.name}
          gbpUrl={business.gbpUrl}
          brandColor={business.brandColor}
        />
        <p className={styles.footer}>
          <Link href={`/b/${business.slug}`} className={styles.businessLink}>
            {business.name}
          </Link>
          {" · Powered by BMU QR"}
        </p>
      </div>
    </main>
  );
}
