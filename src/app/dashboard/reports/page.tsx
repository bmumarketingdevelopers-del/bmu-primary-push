import { Download, FileBarChart } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClientReports } from "@/lib/repos/client";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const REPORTS = await getClientReports(user?.clientId);

  return (
    <>
      <Topbar title="Reports" />
      <div className={styles.content}>
        <PageShell
          title="Monthly reports"
          description="One page per month: spend, leads, cost per lead, ranking movement, and what changes next month."
        >
          <div className={styles.reportGrid}>
            {REPORTS.map((r) => (
              <Card key={r.id} className={styles.reportCard}>
                <CardHeader>
                  <span className={styles.reportIcon}>
                    <FileBarChart className={styles.reportGlyph} strokeWidth={1.8} />
                  </span>
                  <CardTitle className={styles.reportTitle}>{r.title}</CardTitle>
                  <p className={styles.reportPeriod}>{r.period}</p>
                </CardHeader>
                <CardContent>
                  <p className={styles.reportSummary}>{r.summary}</p>
                  <Button variant="outline" size="sm" className={styles.downloadButton} disabled title="Report PDFs aren\'t generated yet"><Download /> Download PDF</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}
