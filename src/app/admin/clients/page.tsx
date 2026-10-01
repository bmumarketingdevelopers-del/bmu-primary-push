import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { HealthBadge } from "@/components/admin/health-badge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClients } from "@/lib/repos/agency";
import { DataSourceBadge } from "@/components/admin/data-source-badge";
import { Pagination } from "@/components/admin/pagination";
import { pageFrom, paginate } from "@/lib/repos/db";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;

  const { data: CLIENTS, source } = await getClients();

  // Summary figures cover every client; the table shows one page at a time.
  const mrr = CLIENTS.reduce((s, c) => s + c.retainer, 0);
  const { rows, meta } = paginate(CLIENTS, pageFrom(sp));

  return (
    <>
      <AdminTopbar title="Clients" />
      <div className={styles.page}>
        <PageShell
          title="Clients"
          description="Every account, who owns it and how it's tracking. Health is flagged automatically on lead volume against retainer size."
          action={
            <div className={styles.actions}>
              <DataSourceBadge source={source} />
              <EntityDialog entity="client" />
            </div>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Combined MRR</p>
              <p className={cn("display", styles.statValue)}>{inr(mrr)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Active accounts</p>
              <p className={cn("display", styles.statValue)}>{CLIENTS.filter((c) => c.isActive).length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Average retainer</p>
              <p className={cn("display", styles.statValue)}>{inr(Math.round(mrr / CLIENTS.length))}</p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className={styles.numericHead}>Retainer</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead className={styles.numericHead}>Leads (mo)</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`/admin/clients/${c.slug}`} className={styles.clientLink}>
                        {c.name}
                      </Link>
                      <span className={styles.clientMeta}>{c.id} · {c.city}</span>
                    </TableCell>
                    <TableCell className={styles.mutedCell}>{c.industry}</TableCell>
                    <TableCell><Badge variant="secondary">{c.plan}</Badge></TableCell>
                    <TableCell className={styles.retainerCell}>{inr(c.retainer)}</TableCell>
                    <TableCell className={styles.managerCell}>{c.manager}</TableCell>
                    <TableCell className={styles.leadsCell}>{c.leadsThisMonth}</TableCell>
                    <TableCell><HealthBadge health={c.health} /></TableCell>
                    <TableCell className={styles.dateCell}>{formatDate(c.onboardedAt)}</TableCell>
                    <TableCell>
                      <div className={styles.rowActions}>
                        <Link href={`/admin/clients/${c.slug}`} aria-label={`Open ${c.name}`} className={styles.openLink}>
                          <ArrowUpRight className={styles.openIcon} />
                        </Link>
                        <RowActions
                          entity="client"
                          record={c as unknown as Record<string, unknown>}
                          toggleField="isActive"
                          toggleValue={c.isActive}
                          toggleLabels={["Deactivate", "Reactivate"]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination meta={meta} basePath="/admin/clients" label="clients" />
          </Card>
        </PageShell>
      </div>
    </>
  );
}
