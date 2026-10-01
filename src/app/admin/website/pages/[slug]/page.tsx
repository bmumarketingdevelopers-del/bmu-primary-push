import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { PageBuilder } from "@/components/admin/page-builder";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCustomPage } from "@/lib/repos/pages";
import { deletePage } from "@/app/admin/website/pages/actions";
import styles from "./page.module.css";

export default async function PageEditor({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isNew = slug === "new";
  const page = isNew ? null : await getCustomPage(slug);
  if (!isNew && !page) notFound();

  return (
    <>
      <AdminTopbar title={isNew ? "New page" : (page?.title ?? "Page")} />
      <div className={styles.page}>
        <PageShell
          title={isNew ? "New page" : `Editing ${page?.title}`}
          description="Add sections, reorder them, and publish when it reads right. Changes go live immediately."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/website/pages"><ArrowLeft /> All pages</Link>
            </Button>
          }
        >
          <PageBuilder page={page} />

          {!isNew && page && (
            <Card className={styles.dangerCard}>
              <CardContent className={styles.dangerZone}>
                <div>
                  <p className={styles.dangerTitle}>Delete this page</p>
                  <p className={styles.dangerText}>
                    Anyone linking to /p/{page.slug} will get a 404. There&apos;s no undo.
                  </p>
                </div>
                <form action={deletePage}>
                  <input type="hidden" name="slug" value={page.slug} />
                  <Button type="submit" variant="outline" size="sm" className={styles.deleteButton}>
                    <Trash2 /> Delete
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
