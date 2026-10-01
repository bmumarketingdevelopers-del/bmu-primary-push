import Link from "next/link";
import {
  ArrowUpRight, FileEdit, FilePlus, Layers, LayoutTemplate, Newspaper,
  Palette, Search, ShoppingBag, Store,
} from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CMS_BLOCKS } from "@/lib/cms/schema";
import { COLLECTIONS } from "@/lib/cms/collections";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

/**
 * One place that answers "where do I change this?" — the CMS was split
 * between blocks and collections, and neither name means anything to someone
 * who just wants to fix a headline.
 */
const AREAS = [
  {
    title: "Build a page",
    icon: FilePlus,
    description: "Create new pages from sections — no code, no deploy. Optionally add them to the menu.",
    href: "/admin/website/pages",
    items: "Page builder",
  },
  {
    title: "Homepage",
    icon: LayoutTemplate,
    description: "Hero, statistics, client logos, testimonials and the FAQ.",
    href: "/admin/cms",
    items: CMS_BLOCKS.filter((b) => b.group === "Home").length + " sections",
  },
  {
    title: "Navigation & theme",
    icon: Palette,
    description: "Header links, the announcement bar, colours, fonts and the footer.",
    href: "/admin/cms/global.navigation",
    items: CMS_BLOCKS.filter((b) => b.group === "Global").length + " sections",
  },
  {
    title: "Services & products",
    icon: Layers,
    description: "The eight services and five software products, each with its own page.",
    href: "/admin/cms/c/services",
    items: "13 pages",
  },
  {
    title: "Industries",
    icon: Store,
    description: "All 27 sector pages — challenges, playbooks and typical results.",
    href: "/admin/cms/c/industries",
    items: "27 pages",
  },
  {
    title: "Work & case studies",
    icon: FileEdit,
    description: "The portfolio grid and full client write-ups.",
    href: "/admin/cms/c/portfolio",
    items: "12 entries",
  },
  {
    title: "Articles",
    icon: Newspaper,
    description: "Everything at /resources. Drafts stay out of the sitemap.",
    href: "/admin/cms/c/posts",
    items: "Blog",
  },
  {
    title: "Store catalogue",
    icon: ShoppingBag,
    description: "Physical QR and NFC products, prices and lead times.",
    href: "/admin/cms/c/store-products",
    items: "8 products",
  },
  {
    title: "SEO",
    icon: Search,
    description: "Default titles, meta description, keywords and the share image.",
    href: "/admin/cms/seo.defaults",
    items: "Site-wide",
  },
];

export default function AdminWebsitePage() {
  return (
    <>
      <AdminTopbar title="Website" />
      <div className={styles.page}>
        <PageShell
          title="Edit the website"
          description="Everything on the public site, grouped by where it appears rather than by how it's stored. Changes go live immediately — there's no deploy step."
          action={
            <Button asChild variant="outline" size="sm">
              <a href="/" target="_blank" rel="noreferrer"><ArrowUpRight /> View live site</a>
            </Button>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Editable sections</p>
              <p className={cn("display", styles.statValue)}>{CMS_BLOCKS.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Content collections</p>
              <p className={cn("display", styles.statValue)}>{COLLECTIONS.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Public pages</p>
              <p className={cn("display", styles.statValue)}>80+</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Deploy needed</p>
              <p className={cn("display", styles.statValue)}>No</p>
            </Card>
          </div>

          <div className={styles.areaGrid}>
            {AREAS.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.title} href={a.href}>
                  <Card className={styles.areaCard}>
                    <CardHeader>
                      <div className={styles.areaHead}>
                        <span className={styles.areaIcon}>
                          <Icon className={styles.areaIconGlyph} strokeWidth={1.8} />
                        </span>
                        <ArrowUpRight className={styles.areaArrow} />
                      </div>
                      <CardTitle className={styles.areaTitle}>{a.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={styles.areaDescription}>{a.description}</p>
                      <Badge variant="outline" className={styles.areaBadge}>{a.items}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <Card className={styles.cardPrimary}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Two things worth knowing</CardTitle>
              <CardDescription>
                <strong>Nothing can render blank.</strong> Every section falls back to a built-in
                default until you save over it, so an empty database or a bad edit never produces an
                empty page — delete your version and the original returns.
                <br /><br />
                <strong>This needs a database.</strong> Without DATABASE_URL the editor validates
                your input and tells you it wasn&apos;t stored. That&apos;s the one thing still
                blocking real use.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
