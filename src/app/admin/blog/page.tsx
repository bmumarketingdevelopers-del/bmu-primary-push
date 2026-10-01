import { Pencil } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BLOG_POSTS, BLOG_TOP_POSTS } from "@/lib/admin-data";
import { BlogTrafficChart } from "@/components/admin/section-charts";
import { Card as UiCard, CardContent as UiCardContent, CardDescription as UiCardDescription, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from "@/components/ui/card";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const STATUS_VARIANT = {
  PUBLISHED: "success",
  DRAFT: "outline",
  REVIEW: "warning",
} as const;

export default function AdminBlogPage() {
  return (
    <>
      <AdminTopbar title="Blog & CMS" />
      <div className={styles.page}>
        <PageShell
          title="Resources"
          description="Articles published to /resources. Drafts and items in review stay out of the sitemap until published."
          action={<EntityDialog entity="post" label="New article" />}
        >
          <div className={styles.chartGrid}>
            <UiCard>
              <UiCardHeader>
                <UiCardTitle>Traffic</UiCardTitle>
                <UiCardDescription>
                  Views against people who reached the end. The gap is what tells you whether the
                  opening paragraph is working.
                </UiCardDescription>
              </UiCardHeader>
              <UiCardContent><BlogTrafficChart /></UiCardContent>
            </UiCard>

            <UiCard>
              <UiCardHeader>
                <UiCardTitle>Best performing</UiCardTitle>
                <UiCardDescription>Ranked by leads, not views.</UiCardDescription>
              </UiCardHeader>
              <UiCardContent className={styles.topList}>
                {BLOG_TOP_POSTS.map((p) => (
                  <div key={p.title} className={styles.topPost}>
                    <p className={styles.topTitle}>{p.title}</p>
                    <p className={styles.topMeta}>
                      {p.views.toLocaleString("en-IN")} views · {p.avgTime} average ·{" "}
                      <strong className={styles.topLeads}>{p.leads} leads</strong>
                    </p>
                  </div>
                ))}
              </UiCardContent>
            </UiCard>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className={styles.numericHead}>Views</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {BLOG_POSTS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className={styles.titleCell}>
                      <span className={styles.postTitle}>{p.title}</span>
                      <span className={styles.postId}>{p.id}</span>
                    </TableCell>
                    <TableCell className={styles.authorCell}>{p.author}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[p.status as keyof typeof STATUS_VARIANT]}>
                        {p.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className={styles.viewsCell}>
                      {p.views ? p.views.toLocaleString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className={styles.dateCell}>{formatDate(p.updatedAt)}</TableCell>
                    <TableCell className={styles.actionCell}>
                      <RowActions
                        entity="post"
                        record={p as unknown as Record<string, unknown>}
                        toggleField="isPublished"
                        toggleValue={p.status === "PUBLISHED"}
                        toggleLabels={["Unpublish", "Publish"]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
