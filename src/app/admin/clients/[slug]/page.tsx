import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { HealthBadge } from "@/components/admin/health-badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLIENT_DETAIL_EXTRAS } from "@/lib/admin-data";
import { getClients, getInvoices, getLeads, getProjects } from "@/lib/repos/agency";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default async function ClientDetailPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [clients, projectsResult, leadsResult, invoicesResult] = await Promise.all([
    getClients(), getProjects(), getLeads(), getInvoices(),
  ]);

  const client = clients.data.find((c) => c.slug === slug);
  if (!client) notFound();

  const extras = CLIENT_DETAIL_EXTRAS[slug];
  const projects = projectsResult.data.filter((p) => p.client === client.name);
  const leads = leadsResult.data.filter((l) => l.client === client.name);
  const invoices = invoicesResult.data.filter((i) => i.client === client.name);

  /**
   * Account economics. Lifetime billed is what the relationship is actually
   * worth — a large retainer that started last month is a different
   * conversation from a small one running four years.
   */
  const monthsActive = Math.max(
    1,
    Math.round((Date.now() - new Date(client.onboardedAt).getTime()) / (30 * 86_400_000))
  );
  const lifetimeBilled = invoices.filter((i) => i.status !== "VOID").reduce((s, i) => s + i.total, 0);
  const outstanding = invoices
    .filter((i) => i.status !== "PAID" && i.status !== "VOID")
    .reduce((s, i) => s + i.total, 0);
  const overdue = invoices.filter((i) => i.status === "OVERDUE");
  const projectValue = projects.reduce((s, p) => s + p.budget, 0);
  const avgMonthly = Math.round(lifetimeBilled / monthsActive);
  const ratio = client.retainer ? Math.round((avgMonthly / client.retainer) * 100) : 0;

  return (
    <>
      <AdminTopbar title={client.name} />
      <div className={styles.page}>
        <PageShell
          title={client.name}
          description={`${client.industry} · ${client.city} · ${client.plan} retainer · managed by ${client.manager}`}
          action={
            <div className={styles.actions}>
              <HealthBadge health={client.health} />
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/clients">All clients</Link>
              </Button>
            </div>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Monthly retainer</p>
              <p className={cn("display", styles.statValue)}>{inr(client.retainer)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Leads this month</p>
              <p className={cn("display", styles.statValue)}>{client.leadsThisMonth}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Live projects</p>
              <p className={cn("display", styles.statValue)}>{projects.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Client since</p>
              <p className={cn("display", styles.statValue)}>{formatDate(client.onboardedAt)}</p>
            </Card>
          </div>

          {overdue.length > 0 && (
            <Card className={styles.dangerCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>
                  {inr(overdue.reduce((s, i) => s + i.total, 0))} overdue on this account
                </CardTitle>
                <CardDescription>
                  Worth settling before the next scope conversation — a renewal discussion held
                  over unpaid invoices tends to go badly for both sides.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Tabs defaultValue="overview">
            <TabsList className={styles.tabList}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
              <TabsTrigger value="billing">Billing ({invoices.length})</TabsTrigger>
              <TabsTrigger value="commercials">Commercials</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className={styles.tabStack}>
              <div className={styles.overviewGrid}>
                <Card>
                  <CardHeader><CardTitle className={styles.panelTitle}>Primary contact</CardTitle></CardHeader>
                  <CardContent className={styles.contactBody}>
                    <p className={styles.contactName}>{extras?.contact ?? "Not recorded"}</p>
                    <p className={styles.contactDetail}>{extras?.email ?? "—"}</p>
                    <p className={styles.contactDetail}>{extras?.phone ?? "—"}</p>

                  </CardContent>
                </Card>

                <Card className={styles.scopeCard}>
                  <CardHeader><CardTitle className={styles.panelTitle}>Scope &amp; notes</CardTitle></CardHeader>
                  <CardContent className={styles.scopeBody}>
                    {extras?.services?.length ? (
                      <div className={styles.services}>
                        {extras.services.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                      </div>
                    ) : (
                      <p className={styles.emptyNote}>No scope recorded.</p>
                    )}
                    {extras?.notes && (
                      <p className={styles.notes}>{extras.notes}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects */}
            <TabsContent value="projects">
              <Card className={styles.tableCard}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead className={styles.progressHead}>Progress</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className={styles.numericHead}>Budget</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <Link href={`/admin/projects/${p.id}`} className={styles.projectLink}>
                            {p.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Progress value={p.progress} />
                          <span className={styles.progressLabel}>{p.progress}%</span>
                        </TableCell>
                        <TableCell className={styles.ownerCell}>{p.owner}</TableCell>
                        <TableCell className={styles.amountCell}>{inr(p.budget)}</TableCell>
                        <TableCell className={styles.dateCell}>
                          {formatDate(p.dueAt)}
                        </TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                      </TableRow>
                    ))}
                    {projects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className={styles.emptyCell}>
                          No projects on this account yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Leads */}
            <TabsContent value="leads">
              <Card className={styles.tableCard}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className={styles.numericHead}>Value</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Received</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className={styles.leadName}>{l.name}</TableCell>
                        <TableCell className={styles.sourceCell}>
                          {l.source.replace("_", " ")}
                        </TableCell>
                        <TableCell><StatusBadge status={l.status} /></TableCell>
                        <TableCell className={styles.amountCell}>
                          {l.value ? inr(l.value) : "—"}
                        </TableCell>
                        <TableCell className={styles.ownerCell}>{l.owner}</TableCell>
                        <TableCell className={styles.dateCell}>
                          {formatDate(l.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {leads.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className={styles.emptyCell}>
                          No leads recorded for this client.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Billing */}
            <TabsContent value="billing">
              <Card className={styles.tableCard}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead className={styles.numericHead}>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((i) => (
                      <TableRow key={i.number}>
                        <TableCell className={styles.invoiceNumber}>{i.number}</TableCell>
                        <TableCell className={styles.dateCell}>
                          {formatDate(i.issuedAt)}
                        </TableCell>
                        <TableCell className={styles.dateCell}>
                          {formatDate(i.dueAt)}
                        </TableCell>
                        <TableCell className={styles.totalCell}>
                          {inr(i.total)}
                        </TableCell>
                        <TableCell><StatusBadge status={i.status} /></TableCell>
                      </TableRow>
                    ))}
                    {invoices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className={styles.emptyCell}>
                          Nothing invoiced yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Commercials */}
            <TabsContent value="commercials" className={styles.tabStack}>
              <div className={styles.statGrid}>
                <Card className={styles.statCard}>
                  <p className={styles.statLabel}>Lifetime billed</p>
                  <p className={cn("display", styles.statValue)}>{inr(lifetimeBilled)}</p>
                  <p className={styles.statNote}>over {monthsActive} months</p>
                </Card>
                <Card className={styles.statCard}>
                  <p className={styles.statLabel}>Average per month</p>
                  <p className={cn("display", styles.statValue)}>{inr(avgMonthly)}</p>
                  <p className={styles.statNote}>
                    against a {inr(client.retainer)} retainer
                  </p>
                </Card>
                <Card className={cn(styles.statCard, outstanding > 0 && styles.warningCard)}>
                  <p className={styles.statLabel}>Outstanding</p>
                  <p className={cn("display", styles.statValue)}>{inr(outstanding)}</p>
                </Card>
                <Card className={styles.statCard}>
                  <p className={styles.statLabel}>Project value in flight</p>
                  <p className={cn("display", styles.statValue)}>{inr(projectValue)}</p>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Retainer against actual billing</CardTitle>
                  <CardDescription>
                    Billing consistently above the retainer means project work is carrying the
                    account — good revenue, but it stops the month someone else wins the next
                    project. Consistently below usually means unbilled scope.
                  </CardDescription>
                </CardHeader>
                <CardContent className={styles.ratioBody}>
                  <div className={styles.ratioRow}>
                    <span>Average billing vs retainer</span>
                    <span className={styles.ratioValue}>{ratio}%</span>
                  </div>
                  <Progress value={Math.min(100, ratio)} />
                  <p className={styles.ratioNote}>
                    {ratio > 130
                      ? "Project-heavy. Worth converting some of this into the retainer."
                      : ratio < 80
                        ? "Below the retainer — check whether work is being delivered but not billed."
                        : "Tracking close to the agreed retainer."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </PageShell>
      </div>
    </>
  );
}
