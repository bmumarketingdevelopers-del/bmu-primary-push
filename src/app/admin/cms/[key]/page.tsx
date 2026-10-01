import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { CmsEditor } from "@/components/admin/cms-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { blockByKey, CMS_BLOCKS } from "@/lib/cms/schema";
import { getBlock } from "@/lib/cms";
import styles from "./page.module.css";

export function generateStaticParams() {
  return CMS_BLOCKS.map((b) => ({ key: b.key }));
}

/** Where each block appears, so you can go and look at what you changed. */
const PREVIEW: Record<string, string> = {
  "home.hero": "/",
  "home.stats": "/",
  "home.trusted": "/",
  "home.testimonials": "/",
  "home.faqs": "/",
  "pricing.retainers": "/pricing",
  "contact.details": "/contact",
  "about.story": "/about",
  "global.footer": "/",
  "global.brand": "/",
  "global.announcement": "/",
  "seo.defaults": "/",
};

export default async function CmsBlockPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  const block = blockByKey(decoded);
  if (!block) notFound();

  const value = await getBlock(decoded);
  const preview = PREVIEW[decoded];

  return (
    <>
      <AdminTopbar title={block.label} />
      <div className={styles.page}>
        <PageShell
          title={block.label}
          description={block.description}
          action={
            <div className={styles.actions}>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/cms"><ArrowLeft /> All content</Link>
              </Button>
              {preview && (
                <Button asChild variant="ghost" size="sm">
                  <a href={preview} target="_blank" rel="noreferrer">
                    <ExternalLink /> View live
                  </a>
                </Button>
              )}
            </div>
          }
        >
          <Badge variant="outline" className={styles.keyBadge}>{block.key}</Badge>

          <Card>
            <CardContent className={styles.editorBody}>
              <CmsEditor block={block} value={value} />
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
