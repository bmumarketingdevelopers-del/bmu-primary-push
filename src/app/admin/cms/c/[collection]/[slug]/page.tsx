import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { collectionByKey } from "@/lib/cms/collections";
import { getItem } from "@/lib/cms/items";
import { removeItem } from "@/app/admin/cms/c/actions";
import styles from "./page.module.css";

export default async function CollectionItemPage({
  params,
}: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const def = collectionByKey(collection);
  if (!def) notFound();

  const isNew = slug === "new";
  const item = isNew ? null : await getItem(def.key, slug);
  if (!isNew && !item) notFound();

  const value = (item ?? {}) as Record<string, unknown>;

  return (
    <>
      <AdminTopbar title={def.singular} />
      <div className={styles.page}>
        <PageShell
          title={isNew ? `New ${def.singular.toLowerCase()}` : String(value[def.titleField] ?? slug)}
          description={
            isNew
              ? `Fill this in and it appears on the site as soon as you save.`
              : def.description
          }
          action={
            <div className={styles.actions}>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/cms/c/${def.key}`}><ArrowLeft /> {def.label}</Link>
              </Button>
              {!isNew && def.publicPath && (
                <Button asChild variant="ghost" size="sm">
                  <a href={def.publicPath(slug)} target="_blank" rel="noreferrer">
                    <ExternalLink /> View live
                  </a>
                </Button>
              )}
            </div>
          }
        >
          {!isNew && (
            <div className={styles.meta}>
              <Badge variant="outline" className={styles.keyBadge}>
                {def.key}/{slug}
              </Badge>
              <Badge variant={value.__fromDb ? "default" : "outline"}>
                {value.__fromDb ? "Edited copy" : "Built-in default"}
              </Badge>
            </div>
          )}

          <Card>
            <CardContent className={styles.editorBody}>
              <CollectionEditor collection={def} slug={slug} value={value} />
            </CardContent>
          </Card>

          {!isNew && (
            <Card className={styles.dangerCard}>
              <CardContent className={styles.removeBody}>
                <div>
                  <p className={styles.removeTitle}>Remove this {def.singular.toLowerCase()}</p>
                  <p className={styles.removeNote}>
                    {value.__fromDb
                      ? "Deletes your edited copy. If a built-in version exists it comes back."
                      : "Built-in items can't be deleted, so this hides it from the site instead."}
                  </p>
                </div>
                <form action={removeItem}>
                  <input type="hidden" name="collection" value={def.key} />
                  <input type="hidden" name="slug" value={slug} />
                  <Button type="submit" variant="outline" size="sm" className={styles.removeButton}>
                    <Trash2 /> Remove
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </PageShell>
      </div>
    </>
  );
}
