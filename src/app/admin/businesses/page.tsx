import { ExternalLink, QrCode, Star } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { Pagination } from "@/components/admin/pagination";
import { pageFrom, paginate } from "@/lib/repos/db";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORY_TEMPLATES, QR_KINDS, allDemoBusinesses } from "@/lib/qr-platform";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import styles from "./page.module.css";

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;

  const businesses = await allDemoBusinesses();
  const { rows, meta } = paginate(businesses, pageFrom(sp));

  return (
    <>
      <AdminTopbar title="QR businesses" />
      <div className={styles.page}>
        <PageShell
          title="BMU QR tenants"
          description="Every business with a smart profile — one demo tenant per industry. Each gets a public page at /b/{slug}, a review flow at /r/{slug}, and its own dynamic QR codes."
          action={<EntityDialog entity="business" label="New business" />}
        >
          <Card className={styles.highlightCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Phase 1 of the QR platform</CardTitle>
              <CardDescription>
                Smart profiles, industry templates, the sentiment-routed review booster and dynamic QR
                are live. Menus and ordering, the booking engine, loyalty, the mini-site builder and
                the AI layer are scoped in the schema but not yet built.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className={styles.numericHead}>Rating</TableHead>
                  <TableHead>Public page</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((b) => (
                  <TableRow key={b.slug}>
                    <TableCell>
                      <span className={styles.businessName}>{b.name}</span>
                      <span className={styles.tagline}>{b.tagline}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {CATEGORY_TEMPLATES[b.category]?.label ?? b.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.mutedCell}>{b.city}</TableCell>
                    <TableCell className={styles.ratingCell}>
                      <span className={styles.rating}>
                        <Star className={styles.ratingStar} />
                        {b.rating}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/b/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.publicLink}
                      >
                        /b/{b.slug}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.isPublished ? "success" : "outline"}>
                        {b.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.actionCell}>
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/r/${b.slug}`} target="_blank" rel="noreferrer">
                          <Star /> Review flow
                        </a>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/b/${b.slug}`} target="_blank" rel="noreferrer">
                          <ExternalLink /> Open
                        </a>
                      </Button>
                      <RowActions
                        entity="business"
                        record={b as unknown as Record<string, unknown>}
                        toggleField="isPublished"
                        toggleValue={b.isPublished}
                        toggleLabels={["Unpublish", "Publish"]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination meta={meta} basePath="/admin/businesses" label="businesses" />
          </Card>

          <div className={styles.kindGrid}>
            {Object.entries(QR_KINDS).map(([group, kinds]) => (
              <Card key={group}>
                <CardHeader>
                  <span className={styles.kindIcon}>
                    <QrCode className={styles.kindGlyph} strokeWidth={1.8} />
                  </span>
                  <CardTitle className={styles.kindTitle}>{group} QR types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={styles.kindList}>
                    {kinds.map((k) => (
                      <li key={k.kind} className={styles.kindItem}>
                        <p className={styles.kindLabel}>{k.label}</p>
                        <p className={styles.kindHelp}>{k.help}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Industry templates</CardTitle>
              <CardDescription>
                Each category leads with different actions. A salon opens on booking; a restaurant
                opens on the menu. This is set per business, not chosen by the customer.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.templateGrid}>
              {Object.entries(CATEGORY_TEMPLATES).map(([key, t]) => (
                <div key={key} className={styles.template}>
                  <p className={styles.templateLabel}>{t.label}</p>
                  <div className={styles.templateActions}>
                    {t.primary.map((p) => (
                      <Badge key={p} variant="outline" className={styles.templateBadge}>
                        {p.replace("_", " ").toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
