import { Download } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayInvoiceButton } from "@/components/pay-invoice-button";
import { CURRENT_USER } from "@/lib/dashboard-data";
import { getClientInvoices } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  const { data: INVOICES } = await getClientInvoices(user?.clientId);

  const outstanding = INVOICES
    .filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <>
      <Topbar title="Invoices" />
      <div className={styles.content}>
        <PageShell
          title="Invoices"
          description="Retainer and project billing. Pay by UPI, NEFT or card — the payment link on each invoice stays live until it clears."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Outstanding</p>
              <p className={cn("display", styles.statValue)}>{inr(outstanding)}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Paid this financial year</p>
              <p className={cn("display", styles.statValue)}>₹6.72L</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Next invoice</p>
              <p className={cn("display", styles.statValue)}>1 Sep</p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>For</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className={styles.amountHead}>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {INVOICES.map((i) => (
                  <TableRow key={i.number}>
                    <TableCell className={styles.numberCell}>{i.number}</TableCell>
                    <TableCell className={styles.descriptionCell}>{i.description}</TableCell>
                    <TableCell className={styles.dateCell}>{formatDate(i.issuedAt)}</TableCell>
                    <TableCell className={styles.dateCell}>{formatDate(i.dueAt)}</TableCell>
                    <TableCell className={styles.amountCell}>{inr(i.total)}</TableCell>
                    <TableCell><StatusBadge status={i.status} /></TableCell>
                    <TableCell className={styles.actionCell}>
                      {i.status === "SENT" || i.status === "OVERDUE" ? (
                        <PayInvoiceButton
                          invoiceNumber={i.number}
                          amount={i.total}
                          payerName={CURRENT_USER.name}
                          payerEmail={CURRENT_USER.email}
                        />
                      ) : (
                        <Button asChild variant="ghost" size="sm">
                          <a href={`/api/invoices/${i.number}/pdf`}><Download /> PDF</a>
                        </Button>
                      )}
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
