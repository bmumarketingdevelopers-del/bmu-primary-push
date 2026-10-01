import Link from "next/link";
import { AlertTriangle, Building2, IndianRupee, Megaphone, ArrowRight } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { RevenueChart, SpendByClientChart, UtilisationChart } from "@/components/admin/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getAgencyKpis, getApprovals, getClients, getInvoices, getProjects,
} from "@/lib/repos/agency";
import { DataSourceBadge } from "@/components/admin/data-source-badge";
import { formatDate, inr } from "@/lib/utils";
import { HealthBadge } from "@/components/admin/health-badge";
import styles from "./page.module.css";

const ICONS = { IndianRupee, Building2, Megaphone, AlertTriangle };

export default async function AdminOverview() {
  // One round trip each; the repo layer falls back to demo data per query,
  // so a single missing table doesn't blank the whole dashboard.
  const [kpis, invoices, clients, projects, approvals] = await Promise.all([
    getAgencyKpis(),
    getInvoices(),
    getClients(),
    getProjects(),
    getApprovals(),
  ]);

  const AGENCY_KPIS = kpis;
  const ADMIN_PROJECTS = projects.data;

  const overdue = invoices.data.filter((i) => i.status === "OVERDUE");
  const atRisk = clients.data.filter((c) => c.health !== "GOOD");
  const pending = approvals.filter((a) => a.status === "PENDING");

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className={styles.page}>
        <PageShell
          title="Agency dashboard"
          description="Revenue, delivery load and anything that needs a decision today. Figures cover the current month."
          action={<DataSourceBadge source={clients.source} />}
        >
          <div className={styles.kpiGrid}>
            {AGENCY_KPIS.map((k) => (
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

          {/* Attention */}
          <div className={styles.attentionGrid}>
            <Card className={styles.cardDanger}>
              <CardHeader>
                <CardTitle className={styles.attentionTitle}>Overdue invoices</CardTitle>
                <CardDescription>{overdue.length} past due, {inr(overdue.reduce((s, i) => s + i.total, 0))} outstanding.</CardDescription>
              </CardHeader>
              <CardContent className={styles.attentionList}>
                {overdue.map((i) => (
                  <div key={i.number} className={styles.attentionRow}>
                    <span className={styles.attentionName}>{i.client}</span>
                    <span className={styles.attentionAmount}>{inr(i.total)}</span>
                  </div>
                ))}
                <Button asChild variant="ghost" size="sm" className={styles.attentionButton}><Link href="/admin/invoices">Chase these</Link></Button>
              </CardContent>
            </Card>

            <Card className={styles.cardWarning}>
              <CardHeader>
                <CardTitle className={styles.attentionTitle}>Accounts to watch</CardTitle>
                <CardDescription>Health flagged on lead volume against retainer size.</CardDescription>
              </CardHeader>
              <CardContent className={styles.attentionList}>
                {atRisk.map((c) => (
                  <div key={c.id} className={styles.attentionRow}>
                    <span className={styles.attentionName}>{c.name}</span>
                    <HealthBadge health={c.health} />
                  </div>
                ))}
                <Button asChild variant="ghost" size="sm" className={styles.attentionButton}><Link href="/admin/clients">Open clients</Link></Button>
              </CardContent>
            </Card>

            <Card className={styles.cardPrimary}>
              <CardHeader>
                <CardTitle className={styles.attentionTitle}>Waiting on clients</CardTitle>
                <CardDescription>{pending.length} creatives sitting in approval queues.</CardDescription>
              </CardHeader>
              <CardContent className={styles.attentionList}>
                {pending.map((a) => (
                  <div key={a.id} className={styles.attentionRow}>
                    <span className={styles.attentionName}>{a.title}</span>
                    <span className={styles.attentionDate}>{formatDate(a.scheduledFor)}</span>
                  </div>
                ))}
                <Button asChild variant="ghost" size="sm" className={styles.attentionButton}><Link href="/admin/approvals">Nudge them</Link></Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by stream</CardTitle>
              <CardDescription>Retainers, one-off projects and software subscriptions, last six months.</CardDescription>
            </CardHeader>
            <CardContent><RevenueChart /></CardContent>
          </Card>

          <div className={styles.chartGrid}>
            <Card>
              <CardHeader>
                <CardTitle>Ad spend under management</CardTitle>
                <CardDescription>This month, by client. Billed to the platform, not to us.</CardDescription>
              </CardHeader>
              <CardContent><SpendByClientChart /></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Team capacity</CardTitle>
                <CardDescription>Booked hours against available. Over 85% means we shouldn&apos;t sign more this month.</CardDescription>
              </CardHeader>
              <CardContent><UtilisationChart /></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className={styles.projectsHeader}>
              <CardTitle>Projects in flight</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/projects">View all <ArrowRight /></Link>
              </Button>
            </CardHeader>
            <CardContent className={styles.projectsGrid}>
              {ADMIN_PROJECTS.slice(0, 6).map((p) => (
                <div key={p.id} className={styles.project}>
                  <div className={styles.projectHead}>
                    <span className={styles.projectName}>{p.name}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <Progress value={p.progress} />
                  <div className={styles.projectMeta}>
                    <span><Badge variant="outline" className={styles.clientBadge}>{p.client}</Badge>{p.owner}</span>
                    <span>Due {formatDate(p.dueAt)}</span>
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
