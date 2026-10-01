import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Eye, EyeOff, Pencil, Plus } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COLLECTIONS, collectionByKey } from "@/lib/cms/collections";
import { getCollection } from "@/lib/cms/items";
import { togglePublished } from "@/app/admin/cms/c/actions";
import styles from "./page.module.css";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.key }));
}

export default async function CollectionListPage({
  params,
}: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const def = collectionByKey(collection);
  if (!def) notFound();

  const items = await getCollection(def.key, { includeDrafts: true });

  return (
    <>
      <AdminTopbar title={def.label} />
      <div className={styles.page}>
        <PageShell
          title={def.label}
          description={def.description}
          action={
            <div className={styles.actions}>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/cms"><ArrowLeft /> All content</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/admin/cms/c/${def.key}/new`}><Plus /> New {def.singular.toLowerCase()}</Link>
              </Button>
            </div>
          }
        >
          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{def.singular}</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const slug = String(item.slug);
                  const published = item.__published !== false;
                  return (
                    <TableRow key={slug}>
                      <TableCell className={styles.titleCell}>
                        {String(item[def.titleField] ?? slug)}
                      </TableCell>
                      <TableCell className={styles.slugCell}>{slug}</TableCell>
                      <TableCell>
                        <Badge variant={item.__fromDb ? "default" : "outline"}>
                          {item.__fromDb ? "Edited" : "Built-in"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={published ? "success" : "outline"}>
                          {published ? "Live" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className={styles.actionCell}>
                        <form action={togglePublished} className={styles.toggleForm}>
                          <input type="hidden" name="collection" value={def.key} />
                          <input type="hidden" name="slug" value={slug} />
                          <input type="hidden" name="next" value={String(!published)} />
                          <Button type="submit" variant="ghost" size="sm">
                            {published ? <EyeOff /> : <Eye />}
                            {published ? "Hide" : "Show"}
                          </Button>
                        </form>

                        {def.publicPath && (
                          <Button asChild variant="ghost" size="sm">
                            <a href={def.publicPath(slug)} target="_blank" rel="noreferrer">
                              <ExternalLink /> View
                            </a>
                          </Button>
                        )}

                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/cms/c/${def.key}/${slug}`}><Pencil /> Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          <p className={styles.footnote}>
            Built-in items ship with the app. Editing one creates a saved copy that takes over —
            the original stays as a fallback, so a bad edit can be undone by deleting the copy.
          </p>
        </PageShell>
      </div>
    </>
  );
}
