import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferingDetail } from "@/components/marketing/offering-detail/offering-detail";
import { SERVICE_PAGES, getOfferingPage } from "@/lib/service-pages-data";

type Params = Promise<{ slug: string; offering: string }>;

export function generateStaticParams() {
  return SERVICE_PAGES.flatMap((s) =>
    (s.detail?.offerings ?? []).filter((o) => o.detail).map((o) => ({ slug: s.slug, offering: o.slug })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, offering } = await params;
  const page = getOfferingPage(slug, offering);
  if (!page) return {};
  return { title: `${page.offering.title} - ${page.service.title}`, description: page.offering.body };
}

export default async function OfferingPage({ params }: { params: Params }) {
  const { slug, offering } = await params;
  const page = getOfferingPage(slug, offering);
  if (!page) notFound();

  return <OfferingDetail service={page.service} offering={page.offering} />;
}
