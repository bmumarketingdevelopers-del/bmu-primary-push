import Link from "next/link";
import { IndianRupee, Megaphone, QrCode, Users, ArrowRight } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ChannelSplitChart, CplChart, FunnelChart, LeadsTrendChart } from "@/components/dashboard/charts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CHANNEL_SPLIT, CURRENT_CLIENT, CURRENT_USER, KPIS } from "@/lib/dashboard-data";
import { getClientApprovals, getClientProjects } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import { DataSourceBadge } from "@/components/admin/data-source-badge";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const ICONS = { Users, IndianRupee, Megaphone, QrCode };

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  const [projects, APPROVALS] = await Promise.all([
    getClientProjects(user?.clientId),
    getClientApprovals(user?.clientId),
  ]);
  const PROJECTS = projects.data;

  return (
    <>
      <Topbar title="Overview" />
      <div className={styles.content}>
        <PageShell
          title={`Good to see you, ${CURRENT_USER.name.split(" ")[0]}`}
          description={`${CURRENT_CLIENT.name} · ${CURRENT_CLIENT.plan} · account manager ${CURRENT_CLIENT.manager}. Figures below cover the current month.`}
          action={
            <div className={styles.headerActions}>
              <DataSourceBadge source={projects.source} />
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/reports">
                  Download July report <ArrowRight />
                </Link>
              </Button>
            </div>
          }
        >
          <div className={styles.kpiGrid}>
            {KPIS.map((k) => (
              <StatCard
                key={k.label}
                label={k.label}
                value={k.value}
                delta={k.delta}
                sub={k.sub}
                inverse={k.inverse}
                icon={ICONS[k.icon as keyof typeof ICONS]}
              />
            ))}
          </div>

          <div className={styles.trendGrid}>
            <Card className={styles.trendCard}>
              <CardHeader>
                <CardTitle>Leads over six months</CardTitle>
                <CardDescription>Form fills, calls and WhatsApp enquiries, deduplicated by phone number.</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadsTrendChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Where leads came from</CardTitle>
                <CardDescription>This month, by channel.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChannelSplitChart />
                <ul className={styles.channelList}>
                  {CHANNEL_SPLIT.map((c) => (
                    <li key={c.name} className={styles.channel}>
                      <span
                        className={styles.swatch}
                        style={{ "--swatch": c.color } as React.CSSProperties}
                      />
                      <span className={styles.channelName}>{c.name}</span>
                      <span className={styles.channelValue}>{c.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className={styles.pairGrid}>
            <Card>
              <CardHeader>
                <CardTitle>Pipeline this month</CardTitle>
                <CardDescription>Every lead that entered the funnel, by furthest stage reached.</CardDescription>
              </CardHeader>
              <CardContent>
                <FunnelChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per lead</CardTitle>
                <CardDescription>Blended across Meta and Google. Lower is better.</CardDescription>
              </CardHeader>
              <CardContent>
                <CplChart />
              </CardContent>
            </Card>
          </div>

          <div className={styles.pairGrid}>
            <Card>
              <CardHeader className={styles.headerRow}>
                <CardTitle>Active projects</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/projects">View all</Link>
                </Button>
              </CardHeader>
              <CardContent className={styles.projectList}>
                {PROJECTS.slice(0, 4).map((p) => (
                  <div key={p.id} className={styles.project}>
                    <div className={styles.projectHead}>
                      <span className={styles.projectName}>{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <Progress value={p.progress} />
                    <div className={styles.projectMeta}>
                      <span>{p.manager}</span>
                      <span>Due {formatDate(p.dueAt)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={styles.headerRow}>
                <CardTitle>Waiting on your approval</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/approvals">Review</Link>
                </Button>
              </CardHeader>
              <CardContent className={styles.approvalList}>
                {APPROVALS.map((a) => (
                  <div
                    key={a.id}
                    className={styles.approval}
                  >
                    <div className={styles.approvalText}>
                      <p className={styles.approvalTitle}>{a.title}</p>
                      <p className={styles.approvalMeta}>
                        {a.type} · goes live {formatDate(a.scheduledFor)}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </PageShell>
      </div>
    </>
  );
}
