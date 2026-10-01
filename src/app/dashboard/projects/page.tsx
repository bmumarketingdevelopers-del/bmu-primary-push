import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getClientProjects } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  const { data: PROJECTS } = await getClientProjects(user?.clientId);

  return (
    <>
      <Topbar title="Projects" />
      <div className={styles.content}>
        <PageShell
          title="Projects"
          description="Everything in flight, who owns it and when it lands. Progress updates when a milestone is signed off."
        >
          <div className={styles.projectGrid}>
            {PROJECTS.map((p) => (
              <Card key={p.id} className={styles.projectCard}>
                <CardHeader className={styles.projectHeader}>
                  <div>
                    <CardTitle className={styles.projectTitle}>{p.name}</CardTitle>
                    <p className={styles.projectMeta}>{p.id} · {p.manager}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </CardHeader>
                <CardContent className={styles.projectBody}>
                  <div className={styles.progressBlock}>
                    <div className={styles.progressHead}>
                      <span className={styles.progressLabel}>Progress</span>
                      <span className={styles.progressValue}>{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} />
                  </div>
                  <div className={styles.services}>
                    {p.services.map((s) => (
                      <Badge key={s} variant="outline">{s}</Badge>
                    ))}
                  </div>
                  <p className={styles.due}>Due {formatDate(p.dueAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}
