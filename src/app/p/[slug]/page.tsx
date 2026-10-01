import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/marketing/site-header";
import { getNavPages } from "@/lib/repos/pages";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PageSections } from "@/components/marketing/page-sections";
import { getCustomPage, getCustomPages } from "@/lib/repos/pages";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const pages = await getCustomPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.subtitle || undefined,
    // Drafts stay out of search results even though the URL works.
    robots: page.isPublished ? undefined : { index: false, follow: false },
  };
}

export default async function CustomPageRoute({
  params,
}: { params: Promise<{ slug: string }> }) {
  const navPages = await getNavPages();
  const { slug } = await params;
  const page = await getCustomPage(slug);
  if (!page) notFound();

  return (
    <>
      <SiteHeader extraPages={navPages} />
      <main>
        {!page.isPublished && (
          <div className={styles.draftBanner}>
            Draft - only people with this link can see it.
          </div>
        )}
        <PageSections sections={page.sections} />
      </main>
      <SiteFooter />
    </>
  );
}
