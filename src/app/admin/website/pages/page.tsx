import Link from "next/link";
import { ExternalLink, FileText, Plus } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomPages } from "@/lib/repos/pages";
import { cn, formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export default async function AdminPagesList() {
  const pages = await getCustomPages({ includeDrafts: true });
  const live = pages.filter((p) => p.isPublished).length;

  return (
    <>
      <AdminTopbar title="Pages" />
      <div className={styles.page}>
        <PageShell
          title="Pages"
          description="Build new pages from sections — headings, text, images, features, quotes, FAQs and calls to action. No code, no deploy."
          action={
            <Button asChild size="sm">
              <Link href="/admin/website/pages/new"><Plus /> New page</Link>
            </Button>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Pages built</p>
              <p className={cn("display", styles.statValue)}>{pages.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Live</p>
              <p className={cn("display", styles.statValue)}>{live}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>In the menu</p>
              <p className={cn("display", styles.statValue)}>
                {pages.filter((p) => p.navLabel).length}
              </p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className={styles.sectionsHead}>Sections</TableHead>
                  <TableHead>In menu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((p) => (
                  <TableRow key={p.slug}>
                    <TableCell>
                      <span className={styles.pageName}>
                        <FileText className={styles.pageIcon} />
                        {p.title}
                      </span>
                    </TableCell>
                    <TableCell className={styles.addressCell}>/p/{p.slug}</TableCell>
                    <TableCell className={styles.sectionsCell}>{p.sections.length}</TableCell>
                    <TableCell className={styles.menuCell}>{p.navLabel || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={p.isPublished ? "success" : "outline"}>
                        {p.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.updatedCell}>
                      {formatDate(p.updatedAt.slice(0, 10))}
                    </TableCell>
                    <TableCell className={styles.actionsCell}>
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer"><ExternalLink /> View</a>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/website/pages/${p.slug}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className={styles.emptyCell}>
                      No pages yet. Build the first one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.cardPrimary}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why sections rather than a blank canvas</CardTitle>
              <CardDescription>
                Each section renders with the site&apos;s own type scale, spacing and colours, so
                anything built here still looks like the rest of the site. A free rich-text box with
                a font picker gives more freedom and reliably produces pages that look like they
                came from somewhere else.
              </CardDescription>
            </CardHeader>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
