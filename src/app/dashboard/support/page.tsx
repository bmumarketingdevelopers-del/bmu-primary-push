import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClientTickets } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const PRIORITY_VARIANT = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "warning",
  URGENT: "destructive",
} as const;

export default async function SupportPage() {
  const user = await getCurrentUser();
  const TICKETS = await getClientTickets(user?.clientId);

  return (
    <>
      <Topbar title="Support" />
      <div className={styles.content}>
        <PageShell
          title="Support tickets"
          description="Raise anything here and it reaches your account manager and the delivery team at once. First response inside four working hours."
          action={<Button size="sm" asChild><Link href="/contact">New ticket</Link></Button>}
        >
          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TICKETS.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className={styles.ticketCell}>{t.id}</TableCell>
                    <TableCell>{t.subject}</TableCell>
                    <TableCell>
                      <Badge variant={PRIORITY_VARIANT[t.priority as keyof typeof PRIORITY_VARIANT]}>
                        {t.priority.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className={styles.updatedCell}>{formatDate(t.updatedAt)}</TableCell>
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
