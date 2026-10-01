import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CONTACTS } from "@/lib/business-data";
import { cn, formatDate, initials } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessCustomersPage() {
  const repeat = CONTACTS.filter((c) => c.visits > 1).length;

  return (
    <>
      <BusinessTopbar title="Customers" />
      <div className={styles.page}>
        <PageShell
          title="Customers"
          description="Built automatically from scans, leads, reviews and offer claims. Nobody has to type anything in."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Known customers</p>
              <p className={cn("display", styles.statValue)}>{CONTACTS.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Repeat visitors</p>
              <p className={cn("display", styles.statValue)}>{repeat}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Loyalty points issued</p>
              <p className={cn("display", styles.statValue)}>
                {CONTACTS.reduce((s, c) => s + c.points, 0).toLocaleString("en-IN")}
              </p>
            </Card>
          </div>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle>Contact list</CardTitle>
              <CardDescription>
                Points accrue at 1 per ₹100 spent. Redemption is on the Pro plan.
              </CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className={styles.numericHead}>Visits</TableHead>
                  <TableHead className={styles.numericHead}>Points</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CONTACTS.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className={styles.customer}>
                        <Avatar className={styles.avatar}>
                          <AvatarFallback className={styles.avatarFallback}>{initials(c.name)}</AvatarFallback>
                        </Avatar>
                        <span className={styles.customerName}>{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className={styles.phoneCell}>{c.phone}</TableCell>
                    <TableCell className={styles.visitsCell}>{c.visits}</TableCell>
                    <TableCell className={styles.pointsCell}>{c.points}</TableCell>
                    <TableCell>
                      <div className={styles.tags}>
                        {c.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className={styles.lastSeenCell}>
                      {formatDate(c.lastSeen)}
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
