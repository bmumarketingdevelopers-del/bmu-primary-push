import { Download } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataSourceBadge } from "@/components/admin/data-source-badge";
import { Pagination } from "@/components/admin/pagination";
import { pageFrom, paginate } from "@/lib/repos/db";
import { getClients, getInvoices } from "@/lib/repos/agency";
import { NewInvoiceDialog, InvoiceRowActions } from "@/components/admin/invoice-actions";
import { RowActions } from "@/components/admin/row-actions";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;

  const [{ data: ADMIN_INVOICES, source }, { data: clients }] = await Promise.all([
    getInvoices(), getClients(),
  ]);

  // Receivables ageing — the number that decides whether you chase today.
  const today = Date.now();
  const bucketOf = (dueAt: string) => {
    const late = Math.floor((today - new Date(dueAt).getTime()) / 86_400_000);
    if (late <= 0) return "current";
    if (late <= 30) return "d30";
    if (late <= 60) return "d60";
    return "d60plus";
  };

  const unpaid = ADMIN_INVOICES.filter((i) => i.status !== "PAID" && i.status !== "VOID");

  // Ageing totals cover every invoice; the table pages.
  const { rows, meta } = paginate(ADMIN_INVOICES, pageFrom(sp));
  const ageing = unpaid.reduce<Record<string, { count: number; value: number }>>((acc, i) => {
    const k = bucketOf(i.dueAt);
    acc[k] ??= { count: 0, value: 0 };
    acc[k].count += 1;
    acc[k].value += i.total;
    return acc;
  }, {});

  const outstanding = unpaid.reduce((s, i) => s + i.total, 0);
  const over60 = ageing.d60plus?.value ?? 0;
  const clientOptions = clients.map((c) => ({ value: c.slug, label: c.name }));

  const sum = (statuses: string[]) =>
    ADMIN_INVOICES.filter((i) => statuses.includes(i.status)).reduce((s, i) => s + i.total, 0);

  return (
    <>
      <AdminTopbar title="Invoices" />
      <div className={styles.page}>
        <PageShell
          title="Billing"
          description="Retainer and project invoices across all accounts. Razorpay links stay live on sent invoices until payment clears."
          action={
            <div className={styles.actions}>
              <DataSourceBadge source={source} />
              <NewInvoiceDialog clients={clients.map((c) => ({ id: c.id, name: c.name }))} />
            </div>
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Collected this month</p>
              <p className={cn("display", styles.statValue)}>{inr(sum(["PAID"]))}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Awaiting payment</p>
              <p className={cn("display", styles.statValue)}>{inr(sum(["SENT"]))}</p>
            </Card>
            <Card className={cn(styles.statCard, styles.cardDanger)}>
              <p className={styles.statLabel}>Overdue</p>
              <p className={cn("display", styles.statValue, styles.statValueDanger)}>{inr(sum(["OVERDUE"]))}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>In draft</p>
              <p className={cn("display", styles.statValue)}>{inr(sum(["DRAFT"]))}</p>
            </Card>
          </div>

          <div className={styles.statGrid}>
            {[
              { key: "current", label: "Not yet due", tone: "" },
              { key: "d30", label: "1–30 days late", tone: styles.cardWarning },
              { key: "d60", label: "31–60 days late", tone: styles.cardWarning },
              { key: "d60plus", label: "60+ days late", tone: styles.cardDanger },
            ].map((b) => (
              <Card key={b.key} className={cn(styles.statCard, ageing[b.key]?.count ? b.tone : "")}>
                <p className={styles.statLabel}>{b.label}</p>
                <p className={cn("display", styles.ageingValue)}>
                  {inr(ageing[b.key]?.value ?? 0)}
                </p>
                <p className={styles.ageingCount}>
                  {ageing[b.key]?.count ?? 0} invoice{(ageing[b.key]?.count ?? 0) === 1 ? "" : "s"}
                </p>
              </Card>
            ))}
          </div>

          {over60 > 0 && (
            <Card className={styles.cardDanger}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>{inr(over60)} is more than 60 days late</CardTitle>
                <CardDescription>
                  Recovery rates fall sharply past this point — an invoice that&apos;s been ignored
                  for two months rarely gets paid by sending a third copy of it. Worth a call, and
                  worth deciding whether work continues while it&apos;s outstanding.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className={styles.amountHead}>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((i) => (
                  <TableRow key={i.number}>
                    <TableCell className={styles.numberCell}>{i.number}</TableCell>
                    <TableCell><Badge variant="outline">{i.client}</Badge></TableCell>
                    <TableCell className={styles.dateCell}>{formatDate(i.issuedAt)}</TableCell>
                    <TableCell className={styles.dateCell}>{formatDate(i.dueAt)}</TableCell>
                    <TableCell className={styles.amountCell}>{inr(i.total)}</TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell className={styles.actionsCell}>
                      {i.status === "DRAFT" ? null : (
                        <Button asChild variant="ghost" size="sm">
                          <a href={`/api/invoices/${i.number}/pdf`}><Download /> PDF</a>
                        </Button>
                      )}
                      <InvoiceRowActions
                        invoice={{
                          id: String((i as unknown as { id?: string }).id ?? i.number),
                          number: i.number,
                          status: i.status,
                          total: i.total,
                          amountPaid: (i as unknown as { amountPaid?: number }).amountPaid ?? 0,
                        }}
                      />
                      <RowActions
                        entity="invoice"
                        record={i as unknown as Record<string, unknown>}
                        options={{ clientId: clientOptions }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination meta={meta} basePath="/admin/invoices" label="invoices" />
          </Card>
        </PageShell>
      </div>
    </>
  );
}
