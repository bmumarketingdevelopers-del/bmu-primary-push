import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/smart/profile-view";
import { getBusiness, DEMO_BUSINESSES } from "@/lib/qr-platform";
import { getProfileTheme } from "@/lib/repos/theme";
import { trackVisit } from "@/lib/visitor-cookie";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBusiness(slug);
  if (!b) return { title: "Business not found" };

  return {
    title: `${b.name} — ${b.tagline}`,
    description: b.about || b.tagline,
    openGraph: { title: b.name, description: b.about || b.tagline, type: "profile" },
  };
}

export function generateStaticParams() {
  return DEMO_BUSINESSES.map((b) => ({ slug: b.slug }));
}

export default async function BusinessProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ t?: string; c?: string }>;
}) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business || !business.isPublished) notFound();

  const sp = await searchParams;
  const theme = await getProfileTheme(slug, business.category);

  /**
   * Counts the visit and tells us whether this device has been here before.
   * Deliberately not awaited into anything the page needs — the profile
   * renders whether or not this succeeds.
   */
  await trackVisit(slug, sp?.c ?? sp?.t ?? null);

  return (
    <main>
      <ProfileView business={business} theme={theme} />
    </main>
  );
}
