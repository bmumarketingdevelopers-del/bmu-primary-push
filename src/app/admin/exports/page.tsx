import { Download, FileSpreadsheet } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import styles from "./page.module.css";

const EXPORT_CARDS = [
  {
    key: "gstr1-b2b",
    title: "GSTR-1 (B2B)",
    description:
      "Invoice-level B2B section in the layout the GST portal expects. Covers everything issued, sent or paid in the period.",
    tag: "Monthly filing",
  },
  {
    key: "gst-summary",
    title: "GST summary",
    description:
      "Taxable value, CGST and SGST split per invoice with a totals row. Easier to reconcile against your books than the GSTR format.",
    tag: "Reconciliation",
  },
  {
    key: "tds-register",
    title: "TDS register",
    description:
      "Section 194J deductions on creator payouts — gross, rate, deducted and net, with PAN against each deductee.",
    tag: "Quarterly",
  },
  {
    key: "client-ledger",
    title: "Client ledger",
    description:
      "Every account with retainer value, manager, health and onboarding date. What your accountant asks for at year end.",
    tag: "Reference",
  },
  {
    key: "ad-spend",
    title: "Ad spend report",
    description:
      "Campaign spend against budget with cost per lead. Spend is billed to client platforms, so this is pass-through, not revenue.",
    tag: "Pass-through",
  },
];

export default function AdminExportsPage() {
  return (
    <>
      <AdminTopbar title="Exports" />
      <div className={styles.page}>
        <PageShell
          title="Financial exports"
          description="CSV downloads for filing and reconciliation. Everything is UTF-8 with a byte-order mark, so Excel opens rupee amounts and names correctly without an import wizard."
        >
          <Card className={styles.warningCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Check before you file</CardTitle>
              <CardDescription>
                These exports assume intra-state supply from Karnataka, so tax splits CGST and SGST at
                9% each. A client registered outside 29 needs IGST at 18% instead. Have your
                accountant verify the first filing before you trust the format.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className={styles.exportGrid}>
            {EXPORT_CARDS.map((e) => (
              <Card key={e.key} className={styles.exportCard}>
                <CardHeader>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIcon}>
                      <FileSpreadsheet className={styles.cardGlyph} strokeWidth={1.8} />
                    </span>
                    <Badge variant="outline">{e.tag}</Badge>
                  </div>
                  <CardTitle className={styles.cardTitle}>{e.title}</CardTitle>
                </CardHeader>
                <CardContent className={styles.cardBody}>
                  <p className={styles.cardDescription}>{e.description}</p>
                  <Button asChild variant="outline" size="sm" className={styles.downloadButton}>
                    <a href={`/api/exports/${e.key}`}>
                      <Download /> Download CSV
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}
