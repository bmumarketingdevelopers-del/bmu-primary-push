import { Frown, Meh, Smile, Phone } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEEDBACK } from "@/lib/business-data";
import { cn, formatDate } from "@/lib/utils";
import styles from "./page.module.css";

const SENTIMENT = {
  POSITIVE: { label: "Sent to Google", icon: Smile, variant: "success" },
  NEUTRAL: { label: "Okay", icon: Meh, variant: "warning" },
  NEGATIVE: { label: "Not satisfied", icon: Frown, variant: "destructive" },
} as const;

export default function BusinessReviewsPage() {
  const positive = FEEDBACK.filter((f) => f.sentiment === "POSITIVE").length;
  const priv = FEEDBACK.filter((f) => f.sentiment !== "POSITIVE");
  const openItems = priv.filter((f) => !f.isResolved);
  const rate = Math.round((positive / FEEDBACK.length) * 100);

  return (
    <>
      <BusinessTopbar title="Reviews" />
      <div className={styles.page}>
        <PageShell
          title="Reviews & feedback"
          description="Happy customers go straight to Google. Everyone else lands here instead of on your public listing — so you get the chance to fix it first."
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Routed to Google</p>
              <p className={cn("display", styles.statValue, styles.positiveValue)}>{positive}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Caught privately</p>
              <p className={cn("display", styles.statValue)}>{priv.length}</p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Positive rate</p>
              <p className={cn("display", styles.statValue)}>{rate}%</p>
            </Card>
          </div>

          {openItems.length > 0 && (
            <Card className={styles.waitingCard}>
              <CardHeader>
                <CardTitle className={styles.calloutTitle}>{openItems.length} waiting on you</CardTitle>
                <CardDescription>
                  A callback within a day turns most of these around. Left alone, some end up on
                  Google anyway.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className={styles.feedbackList}>
            {FEEDBACK.map((f) => {
              const s = SENTIMENT[f.sentiment];
              const Icon = s.icon;
              return (
                <Card key={f.id}>
                  <CardContent className={styles.feedbackContent}>
                    <div className={styles.feedbackRow}>
                      <div className={styles.feedbackMain}>
                        <span className={styles.sentimentIcon}>
                          <Icon className={styles.sentimentGlyph} strokeWidth={1.8} />
                        </span>
                        <div className={styles.feedbackBody}>
                          <div className={styles.badges}>
                            <Badge variant={s.variant}>{s.label}</Badge>
                            {f.isResolved && <Badge variant="outline">Resolved</Badge>}
                          </div>
                          <p className={styles.comment}>
                            {f.comment ?? (
                              <span className={styles.noComment}>
                                No comment — this customer tapped Excellent and went to Google.
                              </span>
                            )}
                          </p>
                          <p className={styles.byline}>
                            {f.name ?? "Anonymous"} · {formatDate(f.createdAt)}
                          </p>
                        </div>
                      </div>

                      {f.phone && !f.isResolved && (
                        <Button asChild variant="outline" size="sm">
                          <a href={`tel:${f.phone.replace(/\s/g, "")}`}>
                            <Phone /> Call back
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </PageShell>
      </div>
    </>
  );
}
