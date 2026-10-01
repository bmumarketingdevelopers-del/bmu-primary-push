import { Building2, Globe, Handshake, Percent } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PARTNERS, PARTNER_PAYOUTS } from "@/lib/business-data";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

const TYPE = { AGENCY: "default", RESELLER: "secondary", FRANCHISE: "info" } as const;

export default function AdminPartnersPage() {
  const active = PARTNERS.filter((p) => p.isActive);
  const totalClients = active.reduce((s, p) => s + p.clients, 0);
  const partnerMrr = active.reduce((s, p) => s + p.mrr, 0);
  const owed = PARTNER_PAYOUTS.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.commission, 0);

  return (
    <>
      <AdminTopbar title="Partners" />
      <div className={styles.page}>
        <PageShell
          title="Partners & white label"
          description="Agencies, resellers and franchise groups selling BMU QR under their own brand. They own the client relationship; we own the platform."
          action={<EntityDialog entity="partner" label="Add partner" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Active partners</p>
              <p className={cn("display", styles.statValue)}>{active.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Businesses via partners</p>
              <p className={cn("display", styles.statValue)}>{totalClients}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Partner-sourced MRR</p>
              <p className={cn("display", styles.statValue)}>{inr(partnerMrr)}</p>
            </Card>
            <Card className={cn(styles.statCard, owed > 0 && styles.cardWarning)}>
              <p className={styles.statLabel}>Commission owed</p>
              <p className={cn("display", styles.statValue)}>{inr(owed)}</p>
            </Card>
          </div>

          <Card className={styles.cardPrimary}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Why this channel matters</CardTitle>
              <CardDescription>
                {totalClients} businesses came through {active.length} partners — more than direct sales,
                acquired without our own sales cost. The tradeoff is that partners own the relationship,
                so churn on a partner account takes their whole book with it.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <Handshake className={styles.titleIcon} /> Partner accounts
              </CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className={styles.numericHead}>Clients</TableHead>
                  <TableHead className={styles.numericHead}>MRR</TableHead>
                  <TableHead className={styles.numericHead}>Commission</TableHead>
                  <TableHead>White label</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {PARTNERS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className={styles.partnerName}>{p.name}</span>
                      <span className={styles.partnerId}>{p.id}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={TYPE[p.type as keyof typeof TYPE]}>{p.type.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className={styles.mutedCell}>{p.city}</TableCell>
                    <TableCell className={styles.clientsCell}>{p.clients}</TableCell>
                    <TableCell className={styles.moneyCell}>{inr(p.mrr)}</TableCell>
                    <TableCell className={styles.commissionRateCell}>
                      {p.commissionPct}%
                    </TableCell>
                    <TableCell>
                      {p.whiteLabel ? (
                        <span className={styles.whiteLabelDomain}>
                          <Globe className={styles.whiteLabelIcon} />
                          {p.domain}
                        </span>
                      ) : (
                        <span className={styles.coBranded}>Co-branded</span>
                      )}
                    </TableCell>
                    <TableCell className={styles.actionsCell}>
                      <RowActions
                        entity="partner"
                        record={p as unknown as Record<string, unknown>}
                        toggleField="isActive"
                        toggleValue={p.isActive}
                        toggleLabels={["Pause partner", "Reactivate"]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader>
              <CardTitle className={styles.sectionTitle}>
                <Percent className={styles.titleIcon} /> Commission payouts
              </CardTitle>
              <CardDescription>Calculated monthly on collected revenue, not on invoiced revenue.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className={styles.numericHead}>Gross</TableHead>
                  <TableHead className={styles.numericHead}>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PARTNER_PAYOUTS.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className={styles.payoutPartnerCell}>{p.partner}</TableCell>
                    <TableCell className={styles.dateCell}>{p.period}</TableCell>
                    <TableCell className={styles.moneyCell}>{inr(p.gross)}</TableCell>
                    <TableCell className={styles.commissionCell}>{inr(p.commission)}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "PAID" ? "success" : "warning"}>{p.status.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell className={styles.dateCell}>
                      {p.paidAt ? formatDate(p.paidAt) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={cn(styles.sectionTitle, styles.calloutTitle)}>
                <Building2 className={styles.titleIcon} /> White-label setup
              </CardTitle>
              <CardDescription>
                A white-label partner points a CNAME at us and their clients never see BMU branding.
                Their logo, their colour, their domain — same platform underneath.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className={styles.dnsSnippet}>
{`qr.northline.in.   CNAME   partners.bmu.marketing.

Then in the partner record set:
  customDomain      qr.northline.in
  brandName         Northline QR
  primaryColor      #1F6FEB
  hideBmuBranding   true`}
              </pre>
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
