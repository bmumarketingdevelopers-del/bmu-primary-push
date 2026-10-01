import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle, ArrowLeft, CheckCircle2, CircleDashed, Clock,
  Download, Flag, PlayCircle, Truck,
} from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PROJECT_TASKS, PROJECT_UPDATES } from "@/lib/admin-data";
import { getProjects } from "@/lib/repos/agency";
import { formatDate, inr, cn } from "@/lib/utils";
import styles from "./page.module.css";

const TASK_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  DONE: CheckCircle2, IN_PROGRESS: PlayCircle, REVIEW: Clock,
  BLOCKED: AlertTriangle, TODO: CircleDashed,
};

const UPDATE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  MILESTONE: Flag, DELIVERY: Truck, BLOCKER: AlertTriangle, NOTE: CircleDashed,
};

export default async function ProjectDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: projects } = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const tasks = PROJECT_TASKS[id] ?? PROJECT_TASKS.default;
  const updates = PROJECT_UPDATES[id] ?? PROJECT_UPDATES.default;

  /**
   * Progress is weighted by task size and derived, not typed. A one-hour task
   * counting the same as a two-week task is what makes a percentage useless.
   */
  const totalWeight = tasks.reduce((s, t) => s + t.weight, 0);
  const doneWeight = tasks.filter((t) => t.status === "DONE").reduce((s, t) => s + t.weight, 0);
  const realProgress = totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0;

  const blocked = tasks.filter((t) => t.status === "BLOCKED");
  const overdue = tasks.filter(
    (t) => t.status !== "DONE" && new Date(t.dueDate).getTime() < Date.now()
  );

  const byDiscipline = Object.values(
    tasks.reduce<Record<string, { discipline: string; total: number; done: number }>>((acc, t) => {
      acc[t.discipline] ??= { discipline: t.discipline, total: 0, done: 0 };
      acc[t.discipline].total += t.weight;
      if (t.status === "DONE") acc[t.discipline].done += t.weight;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const drift = realProgress - project.progress;

  return (
    <>
      <AdminTopbar title={project.name} />
      <div className={styles.page}>
        <PageShell
          title={project.name}
          description={`${project.client} · owned by ${project.owner} · due ${formatDate(project.dueAt)}`}
          action={
            <div className={styles.actions}>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/projects"><ArrowLeft /> All projects</Link>
              </Button>
              <Button asChild size="sm">
                <a href={`/api/projects/${id}/report`}><Download /> Progress report</a>
              </Button>
            </div>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Progress by work done</p>
              <p className={cn("display", styles.statValue)}>{realProgress}%</p>
              <Progress value={realProgress} className={styles.statProgress} />
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Budget</p>
              <p className={cn("display", styles.statValue)}>{inr(project.budget)}</p>
            </Card>
            <Card className={cn(styles.statCard, blocked.length > 0 && styles.cardDanger)}>
              <p className={styles.statLabel}>Blocked</p>
              <p className={cn("display", styles.statValue)}>{blocked.length}</p>
            </Card>
            <Card className={cn(styles.statCard, overdue.length > 0 && styles.cardWarning)}>
              <p className={styles.statLabel}>Past due</p>
              <p className={cn("display", styles.statValue)}>{overdue.length}</p>
            </Card>
          </div>

          {Math.abs(drift) >= 10 && (
            <Card className={styles.cardWarning}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>
                  Reported progress is {Math.abs(drift)} points {drift > 0 ? "behind" : "ahead of"} the work
                </CardTitle>
                <CardDescription>
                  The status field says {project.progress}%; the tasks add up to {realProgress}%.
                  Whichever is wrong, a client is being told one of these numbers.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {blocked.length > 0 && (
            <Card className={styles.cardDanger}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>Blocked work</CardTitle>
                <CardDescription>
                  {blocked.map((t) => t.title).join(" · ")}. Nothing downstream of these moves
                  until they clear.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="disciplines">By service line</TabsTrigger>
              <TabsTrigger value="timeline">Timeline ({updates.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <Card className={styles.tableCard}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Service line</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead className={styles.weightHead}>Weight</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((t) => {
                      const Icon = TASK_ICON[t.status] ?? CircleDashed;
                      const late = t.status !== "DONE" && new Date(t.dueDate).getTime() < Date.now();
                      return (
                        <TableRow key={t.id}>
                          <TableCell>
                            <span className={styles.taskTitle}>
                              <Icon
                                className={cn(
                                  styles.taskIcon,
                                  t.status === "DONE" && styles.taskIconDone,
                                  t.status === "BLOCKED" && styles.taskIconBlocked,
                                  t.status === "IN_PROGRESS" && styles.taskIconActive
                                )}
                              />
                              {t.title}
                            </span>
                          </TableCell>
                          <TableCell><Badge variant="outline">{t.discipline}</Badge></TableCell>
                          <TableCell className={styles.assigneeCell}>{t.assignee}</TableCell>
                          <TableCell className={styles.weightCell}>{t.weight}</TableCell>
                          <TableCell className={cn(styles.dueCell, late ? styles.dueLate : styles.dueOnTime)}>
                            {formatDate(t.dueDate)}
                          </TableCell>
                          <TableCell><StatusBadge status={t.status} /></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="disciplines">
              <Card>
                <CardHeader>
                  <CardTitle>Progress by service line</CardTitle>
                  <CardDescription>
                    Weighted, so a line with one large task doesn&apos;t look the same as one with
                    five small ones.
                  </CardDescription>
                </CardHeader>
                <CardContent className={styles.disciplineList}>
                  {byDiscipline.map((d) => {
                    const pct = Math.round((d.done / d.total) * 100);
                    return (
                      <div key={d.discipline} className={styles.discipline}>
                        <div className={styles.disciplineHead}>
                          <span className={styles.disciplineName}>{d.discipline}</span>
                          <span className={styles.disciplinePct}>{pct}%</span>
                        </div>
                        <Progress value={pct} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>What has happened</CardTitle>
                  <CardDescription>
                    The progress report is built from these entries, so anything not written down
                    here won&apos;t appear in what the client reads.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className={styles.timeline}>
                    {updates.map((u) => {
                      const Icon = UPDATE_ICON[u.kind] ?? CircleDashed;
                      return (
                        <li key={u.id} className={styles.timelineItem}>
                          <span
                            className={cn(
                              styles.timelineDot,
                              u.kind === "BLOCKER" ? styles.timelineDotBlocker : styles.timelineDotDefault
                            )}
                          >
                            <Icon className={styles.timelineIcon} />
                          </span>
                          <div className={styles.timelineHead}>
                            <p className={styles.timelineTitle}>{u.title}</p>
                            <Badge variant={u.kind === "BLOCKER" ? "destructive" : "outline"}>
                              {u.kind.toLowerCase()}
                            </Badge>
                          </div>
                          <p className={styles.timelineBody}>{u.body}</p>
                          <p className={styles.timelineMeta}>
                            {u.author} · {formatDate(u.createdAt)}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </PageShell>
      </div>
    </>
  );
}
