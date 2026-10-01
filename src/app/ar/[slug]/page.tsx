import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArViewer } from "@/components/ar/ar-viewer";
import { getArExperience } from "@/lib/repos/ar";

/** Camera permission and tracking state make this uncacheable. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getArExperience(slug);
  if (!exp) return { title: "Experience not found" };

  return {
    title: `${exp.name} — ${exp.businessName}`,
    description: "Point your camera at the printed design to see it come alive.",
    // A camera page has nothing useful to offer a search crawler.
    robots: { index: false, follow: false },
  };
}

export default async function ArPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experience = await getArExperience(slug);

  if (!experience || !experience.isPublished) notFound();

  return (
    <main>
      <ArViewer experience={experience} />
    </main>
  );
}
