import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuView } from "@/components/smart/menu-view";
import { getBusiness } from "@/lib/qr-platform";
import { getMenu, DEMO_TABLES } from "@/lib/menu";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBusiness(slug);
  return { title: b ? `Menu — ${b.name}` : "Menu", robots: { index: false } };
}

export default async function MenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { slug } = await params;
  const { t } = await searchParams;

  const business = await getBusiness(slug);
  if (!business || !business.isPublished) notFound();

  const categories = await getMenu(slug);
  // ?t=saffron-t7 comes from the QR printed on that table.
  const table = DEMO_TABLES.find((x) => x.qrCode === t)?.label;

  return (
    <main className={styles.main}>
      <MenuView
        slug={business.slug}
        businessName={business.name}
        whatsapp={business.whatsapp}
        brandColor={business.brandColor}
        table={table}
        categories={categories}
      />
    </main>
  );
}
