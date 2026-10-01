import Link from "next/link";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProjects } from "@/lib/repos/agency";
import { DataSourceBadge } from "@/components/admin/data-source-badge";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { getClients } from "@/lib/repos/agency";
import { formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

const COLUMNS = ["DISCOVERY", "IN_PROGRESS", "REVIEW", "LIVE", "PAUSED"] as const;

export default async function AdminProjectsPage() {
  const { data: ADMIN_PROJECTS, source } = await getProjects();
  const { data: clients } = await getClients();
  const clientOptions = clients.map((c) => ({ value: c.slug, label: c.name }));

  return (
    <>
      <AdminTopbar title="Projects" />
      <div className={styles.page}>
        <PageShell
          title="Delivery board"
          description="Every project across every account, grouped by stage. Progress moves when a milestone is signed off, not when someone feels optimistic."
          action={
            <div className={styles.actions}>
              <DataSourceBadge source={source} />
              <EntityDialog entity="project" options={{ clientId: clientOptions }} />
            </div>
          }
        >
          <div className={styles.board}>
            {COLUMNS.map((col) => {
              const items = ADMIN_PROJECTS.filter((p) => p.status === col);
              return (
                <div key={col} className={styles.column}>
                  <div className={styles.columnHead}>
                    <StatusBadge status={col} />
                    <span className={styles.columnCount}>{items.length}</span>
                  </div>
                  {items.map((p) => (
                    <Card key={p.id} className={styles.projectCard}>
                      <div className={styles.projectHead}>
                        <Link
                          href={`/admin/projects/${p.id}`}
                          className={styles.projectLink}
                        >
                          {p.name}
                        </Link>
                        <RowActions entity="project" record={p} />
                      </div>
                      <Badge variant="outline" className={styles.clientBadge}>{p.client}</Badge>
                      <div className={styles.progress}>
                        <Progress value={p.progress} />
                        <div className={styles.progressMeta}>
                          <span>{p.progress}%</span>
                          <span>{inr(p.budget)}</span>
                        </div>
                      </div>
                      <p className={styles.projectFooter}>
                        {p.owner} · due {formatDate(p.dueAt)}
                      </p>
                    </Card>
                  ))}
                  {items.length === 0 && (
                    <p className={styles.emptyColumn}>
                      Nothing here
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </PageShell>
      </div>
    </>
  );
}
