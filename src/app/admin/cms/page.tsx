import Link from "next/link";
import { ArrowUpRight, FileEdit, Layers } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CMS_BLOCKS, CMS_GROUPS } from "@/lib/cms/schema";
import { COLLECTIONS, COLLECTION_GROUPS } from "@/lib/cms/collections";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function CmsIndexPage() {
  return (
    <>
      <AdminTopbar title="Site content" />
      <div className={styles.page}>
        <PageShell
          title="Site content"
          description="Everything on the public site that isn't a service, product or article. Edit here and the change is live — no deploy, no code."
        >
          <Card className={styles.highlightCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>How this works</CardTitle>
              <CardDescription>
                Each block falls back to a built-in default until you save it, so the site is never
                blank. Saving clears the page cache immediately. Without a database configured, the
                editor validates your input and tells you it wasn&apos;t stored.
              </CardDescription>
            </CardHeader>
          </Card>

          {COLLECTION_GROUPS.map((group) => {
            const items = COLLECTIONS.filter((c) => c.group === group);
            if (!items.length) return null;

            return (
              <section key={group} className={styles.group}>
                <h3 className={cn("display", styles.groupTitle)}>{group} collections</h3>
                <div className={styles.cardGrid}>
                  {items.map((c) => (
                    <Link key={c.key} href={`/admin/cms/c/${c.key}`}>
                      <Card className={styles.linkCard}>
                        <CardHeader>
                          <div className={styles.cardTop}>
                            <span className={styles.cardIcon}>
                              <Layers className={styles.cardGlyph} strokeWidth={1.8} />
                            </span>
                            <ArrowUpRight className={styles.cardArrow} />
                          </div>
                          <CardTitle className={styles.cardTitle}>{c.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={styles.cardDescription}>{c.description}</p>
                          <Badge variant="outline" className={styles.keyBadge}>{c.key}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {CMS_GROUPS.map((group) => {
            const blocks = CMS_BLOCKS.filter((b) => b.group === group);
            if (!blocks.length) return null;

            return (
              <section key={group} className={styles.group}>
                <h3 className={cn("display", styles.groupTitle)}>{group} blocks</h3>
                <div className={styles.cardGrid}>
                  {blocks.map((b) => (
                    <Link key={b.key} href={`/admin/cms/${encodeURIComponent(b.key)}`}>
                      <Card className={styles.linkCard}>
                        <CardHeader>
                          <div className={styles.cardTop}>
                            <span className={styles.cardIcon}>
                              <FileEdit className={styles.cardGlyph} strokeWidth={1.8} />
                            </span>
                            <ArrowUpRight className={styles.cardArrow} />
                          </div>
                          <CardTitle className={styles.cardTitle}>{b.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={styles.cardDescription}>{b.description}</p>
                          <Badge variant="outline" className={styles.keyBadge}>{b.key}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </PageShell>
      </div>
    </>
  );
}
