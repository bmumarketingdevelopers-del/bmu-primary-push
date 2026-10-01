import Link from "next/link";
import { Check } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENT_SUBSCRIPTION, PLANS } from "@/lib/business-data";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessBillingPage() {
  return (
    <>
      <BusinessTopbar title="Plan & billing" />
      <div className={styles.page}>
        <PageShell
          title="Plan & billing"
          description="Billed yearly. Changing plan takes effect immediately and we pro-rate the difference."
        >
          <Card className={styles.subscriptionCard}>
            <CardHeader>
              <div className={styles.subscriptionRow}>
                <div>
                  <CardTitle>You&apos;re on the Business plan</CardTitle>
                  <CardDescription>
                    {inr(CURRENT_SUBSCRIPTION.amount)} a year · renews {formatDate(CURRENT_SUBSCRIPTION.renewsAt)}
                  </CardDescription>
                </div>
                <Badge variant="success">{CURRENT_SUBSCRIPTION.status.toLowerCase()}</Badge>
              </div>
            </CardHeader>
          </Card>

          <div className={styles.planGrid}>
            {PLANS.map((p) => {
              const current = p.tier === CURRENT_SUBSCRIPTION.tier;
              return (
                <Card
                  key={p.tier}
                  className={cn(
                    styles.planCard,
                    p.popular && !current && styles.planPopular,
                    current && styles.planCurrent
                  )}
                >
                  <CardHeader>
                    <div className={styles.planHead}>
                      <CardTitle className={styles.planName}>{p.name}</CardTitle>
                      {p.popular && !current && <Badge>Popular</Badge>}
                      {current && <Badge variant="solid">Current</Badge>}
                    </div>
                    <p className={cn("display", styles.planPrice)}>
                      {p.price === 0 ? "Free" : inr(p.price)}
                      {p.price > 0 && (
                        <span className={cn(styles.pricePeriod, current ? styles.periodOnCurrent : styles.mutedText)}>
                          {" "}/year
                        </span>
                      )}
                    </p>
                    <p className={cn(styles.planQuota, current ? styles.detailOnCurrent : styles.mutedText)}>
                      {p.qr}
                    </p>
                  </CardHeader>
                  <CardContent className={styles.planContent}>
                    <ul className={cn(styles.features, current ? styles.detailOnCurrent : styles.mutedText)}>
                      {p.features.map((f) => (
                        <li key={f} className={styles.feature}>
                          <Check className={styles.featureIcon} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={current ? "ghostLight" : p.popular ? "default" : "outline"}
                      size="sm"
                      disabled={current}
                      className={styles.planButton}
                    >
                      {current ? "Your plan" : p.price === 0 ? "Downgrade" : "Switch to this"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={styles.productsTitle}>Physical products</CardTitle>
              <CardDescription>
                NFC cards, standees and stickers are ordered separately from the subscription. Each
                one arrives pre-linked to a code in your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild><Link href="/store">Browse the store</Link></Button>
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
