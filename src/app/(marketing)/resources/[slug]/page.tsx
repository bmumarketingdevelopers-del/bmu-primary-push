import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";
import { Badge } from "@/components/ui/badge";
import { POSTS, getPost } from "@/lib/posts-data";
import { cn, formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        lede={post.excerpt}
        breadcrumbs={[
          { href: "/resources", label: "Resources" },
          { href: `/resources/${post.slug}`, label: post.category },
        ]}
      >
        <p className={styles.meta}>
          {post.author} · {formatDate(post.publishedAt)} · {post.readTime}
        </p>
      </PageHero>

      <article className="section">
        <div className="container">
          <div className={styles.article}>
            {post.body.map((block, i) => (
              <Reveal key={i} delay={0}>
                <div>
                  {block.heading && <h2 className={cn("display", styles.blockHeading)}>{block.heading}</h2>}
                  <div className={styles.paragraphs}>
                    {block.paragraphs.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </article>

      <section className={cn("section", styles.moreSection)}>
        <div className="container">
          <Reveal>
            <span className="eyebrow">Keep reading</span>
            <h2 className={cn("sec-title", styles.moreTitle)}>More from the team</h2>
          </Reveal>
          <div className={styles.moreGrid}>
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <Link
                  href={`/resources/${p.slug}`}
                  className={styles.postCard}
                >
                  <Badge variant="secondary" className={styles.postBadge}>{p.category}</Badge>
                  <h3 className={cn("display", styles.postTitle)}>{p.title}</h3>
                  <p className={styles.postExcerpt}>{p.excerpt}</p>
                  <p className={styles.postMeta}>{p.readTime}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
