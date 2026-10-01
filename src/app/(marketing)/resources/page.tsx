import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { POSTS } from "@/lib/posts-data";
import { cn, formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Resources",
  description: "Notes on lead response times, local search, AI imagery and what a marketing report should actually say.",
};

export default function ResourcesPage() {
  const [featured, ...rest] = POSTS;

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Things we've learned running campaigns"
        lede="Written by the people doing the work, not a content team. Practical where we can be, honest where we can't."
        breadcrumbs={[{ href: "/resources", label: "Resources" }]}
      />

      <section className="section">
        <div className="container">
          <Reveal>
            <Link
              href={`/resources/${featured.slug}`}
              className={styles.featured}
            >
              <div className={styles.featuredVisual}>
                <Badge className={styles.featuredBadge}>{featured.category}</Badge>
                <h2 className={cn("display", styles.featuredTitle)}>{featured.title}</h2>
              </div>
              <div className={styles.featuredBody}>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <p className={styles.featuredMeta}>
                  {featured.author} · {formatDate(featured.publishedAt)} · {featured.readTime}
                </p>
                <p className={styles.featuredMore}>
                  Read it <span className={styles.arrow}>→</span>
                </p>
              </div>
            </Link>
          </Reveal>

          <div className={styles.postGrid}>
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <Link
                  href={`/resources/${p.slug}`}
                  className={styles.postCard}
                >
                  <Badge variant="secondary" className={styles.postBadge}>{p.category}</Badge>
                  <h3 className={cn("display", styles.postTitle)}>{p.title}</h3>
                  <p className={styles.postExcerpt}>{p.excerpt}</p>
                  <p className={styles.postMeta}>
                    {formatDate(p.publishedAt)} · {p.readTime}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Rather talk it through?"
        body="Most of what's written here started as a conversation with a client. Book a call and we'll apply it to your numbers."
      />
    </>
  );
}
