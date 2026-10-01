import { Gift, Plus, Repeat } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CONTACTS, LOYALTY_LEDGER, LOYALTY_PROGRAM, LOYALTY_REWARDS } from "@/lib/business-data";
import { formatDate, cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessLoyaltyPage() {
  const outstanding = LOYALTY_PROGRAM.pointsIssued - LOYALTY_PROGRAM.pointsRedeemed;
  const redemptionRate = Math.round((LOYALTY_PROGRAM.pointsRedeemed / LOYALTY_PROGRAM.pointsIssued) * 100);

  return (
    <>
      <BusinessTopbar title="Loyalty" />
      <div className={styles.page}>
        <PageShell
          title="Loyalty"
          description="Points accrue automatically when a customer is recognised at checkout. Redemption happens at the counter — staff confirm it in one tap."
          action={<EntityDialog entity="loyaltyReward" label="New reward" />}
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Members</p>
              <p className={cn("display", styles.statValue)}>{LOYALTY_PROGRAM.members}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Points issued</p>
              <p className={cn("display", styles.statValue)}>
                {LOYALTY_PROGRAM.pointsIssued.toLocaleString("en-IN")}
              </p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Outstanding balance</p>
              <p className={cn("display", styles.statValue)}>{outstanding.toLocaleString("en-IN")}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Redemption rate</p>
              <p className={cn("display", styles.statValue)}>{redemptionRate}%</p>
            </Card>
          </div>

          <Card className={styles.liabilityCard}>
            <CardHeader>
              <CardTitle className={styles.calloutTitle}>Outstanding points are a liability</CardTitle>
              <CardDescription>
                {outstanding.toLocaleString("en-IN")} unredeemed points is roughly{" "}
                ₹{Math.round(outstanding).toLocaleString("en-IN")} of future discount you&apos;ve already
                promised. Expiry is set to {LOYALTY_PROGRAM.expiryMonths} months, which keeps it from
                compounding forever.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className={styles.detailGrid}>
            <Card>
              <CardHeader>
                <CardTitle className={styles.iconTitle}>
                  <Repeat className={styles.titleIcon} /> How points are earned
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.earningContent}>
                <div className={styles.earningRule}>
                  <p className={cn("display", styles.earningRate)}>1 point per ₹100 spent</p>
                  <p className={styles.earningNote}>
                    Points expire {LOYALTY_PROGRAM.expiryMonths} months after they&apos;re earned.
                  </p>
                </div>
                <div className={styles.earningActions}>
                  <Button variant="outline" size="sm" disabled title="Not built yet">Change earning rate</Button>
                  <Button variant="ghost" size="sm" disabled title="Not built yet">Switch to punch card</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={styles.iconTitle}>
                  <Gift className={styles.titleIcon} /> Rewards
                </CardTitle>
                <CardDescription>What customers can trade points for.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.rewardList}>
                  {LOYALTY_REWARDS.map((r) => (
                    <div key={r.id} className={styles.reward}>
                      <div>
                        <p className={cn(styles.rewardTitle, !r.isActive && styles.rewardEnded)}>
                          {r.title}
                        </p>
                        <p className={styles.rewardMeta}>
                          {r.pointsCost} points · redeemed {r.redeemed} times
                        </p>
                      </div>
                      <Badge variant={r.isActive ? "success" : "outline"}>
                        {r.isActive ? "Live" : "Ended"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Members closest to a reward</CardTitle>
              <CardDescription>
                A nudge on WhatsApp when someone is one visit away works better than a discount.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.memberList}>
              {CONTACTS.map((c) => {
                const target = 200;
                const progress = Math.min(100, Math.round((c.points / target) * 100));
                return (
                  <div key={c.id} className={styles.member}>
                    <div className={styles.memberRow}>
                      <span className={styles.memberName}>{c.name}</span>
                      <span className={styles.memberPoints}>
                        {c.points} / {target} points
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className={styles.tableCard}>
            <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className={styles.numericHead}>Points</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LOYALTY_LEDGER.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className={styles.customerCell}>{t.customer}</TableCell>
                    <TableCell>
                      <Badge variant={t.kind === "REDEEM" ? "warning" : t.kind === "ADJUST" ? "outline" : "success"}>
                        {t.kind.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(styles.pointsCell, t.points < 0 ? styles.pointsSpent : styles.pointsEarned)}>
                      {t.points > 0 ? "+" : ""}{t.points}
                    </TableCell>
                    <TableCell className={styles.noteCell}>{t.note}</TableCell>
                    <TableCell className={styles.whenCell}>
                      {formatDate(t.createdAt)}
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
