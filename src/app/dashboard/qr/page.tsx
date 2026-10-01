import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, QrCode } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { ScanTrendChart } from "@/components/dashboard/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClientQrCodes } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import { cn, compactNumber } from "@/lib/utils";
import styles from "./page.module.css";

export default async function QrPage() {
  const user = await getCurrentUser();
  const { data: QR_CODES } = await getClientQrCodes(user?.clientId);

  const total = QR_CODES.reduce((sum, q) => sum + q.scans, 0);
  const active = QR_CODES.filter((q) => q.active).length;

  return (
    <>
      <Topbar title="QR analytics" />
      <div className={styles.content}>
        <PageShell
          title="BMU QR"
          description="Every code you have printed, where it lives and how often it gets scanned. Change a destination without reprinting anything."
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/support">Request a new code</Link>
            </Button>
          }
        >
          <div className={styles.overviewGrid}>
            <Card className={styles.trendCard}>
              <CardHeader>
                <CardTitle>Scans this week</CardTitle>
                <CardDescription>All locations combined. Weekends run highest for site-visit codes.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScanTrendChart />
              </CardContent>
            </Card>

            <div className={styles.statStack}>
              <Card className={styles.statCard}>
                <p className={styles.statLabel}>Total scans, all time</p>
                <p className={cn("display", styles.statValue)}>{compactNumber(total)}</p>
              </Card>
              <Card className={styles.statCard}>
                <p className={styles.statLabel}>Active codes</p>
                <p className={cn("display", styles.statValue)}>{active} / {QR_CODES.length}</p>
              </Card>
            </div>
          </div>

          <Card className={styles.tableCard}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className={styles.numericHead}>Scans</TableHead>
                  <TableHead className={styles.numericHead}>30-day trend</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {QR_CODES.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <span className={styles.codeLabel}>{q.label}</span>
                      <span className={styles.codeId}>{q.id}</span>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{q.type.replace("_", " ")}</Badge></TableCell>
                    <TableCell className={styles.locationCell}>{q.location}</TableCell>
                    <TableCell className={styles.scansCell}>{q.scans.toLocaleString("en-IN")}</TableCell>
                    <TableCell className={styles.trendCell}>
                      <span
                        className={cn(
                          styles.trend,
                          q.trend >= 0 ? styles.trendUp : styles.trendDown
                        )}
                      >
                        {q.trend >= 0 ? <ArrowUpRight className={styles.trendIcon} /> : <ArrowDownRight className={styles.trendIcon} />}
                        {Math.abs(q.trend)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={q.active ? "success" : "outline"}>{q.active ? "Active" : "Paused"}</Badge>
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
