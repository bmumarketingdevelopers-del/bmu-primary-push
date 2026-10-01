import { Lightbulb, Sparkles, TriangleAlert } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { AiAssistant } from "@/components/business/ai-assistant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiConfigured, computeInsights } from "@/lib/ai";
import { cn } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessAiPage() {
  const configured = aiConfigured();

  /** Real arithmetic on real figures — the model only ever phrases these. */
  const insights = computeInsights({
    scansThisWeek: 3842,
    scansLastWeek: 3140,
    positiveReviews: 186,
    negativeReviews: 32,
    unresolvedNegative: 2,
    leads: 74,
    leadsLastPeriod: 77,
    profileCompleteness: 78,
    topAction: "WhatsApp",
  });

  const TONE = {
    good: { ring: styles.goodCard, icon: Lightbulb, color: styles.goodIcon },
    warning: { ring: styles.warningCard, icon: TriangleAlert, color: styles.warningIcon },
    neutral: { ring: styles.neutralCard, icon: Lightbulb, color: styles.neutralIcon },
  };

  return (
    <>
      <BusinessTopbar title="AI assistant" />
      <div className={styles.page}>
        <PageShell
          title="AI assistant"
          description="Drafts review replies, offers and captions. Everything it writes is a draft — read it before it goes out with your name on it."
          action={
            <Badge variant={configured ? "success" : "outline"}>
              {configured ? "AI connected" : "Offline templates"}
            </Badge>
          }
        >
          <section className={styles.weekSection}>
            <h2 className={cn("display", styles.weekTitle)}>
              <Sparkles className={styles.weekIcon} /> This week
            </h2>

            <div className={styles.insightGrid}>
              {insights.map((i) => {
                const t = TONE[i.tone];
                const Icon = t.icon;
                return (
                  <Card key={i.title} className={cn(styles.insightCard, t.ring)}>
                    <CardContent className={styles.insightContent}>
                      <Icon className={cn(styles.insightIcon, t.color)} strokeWidth={1.9} />
                      <p className={styles.insightTitle}>{i.title}</p>
                      <p className={styles.insightDetail}>{i.detail}</p>
                      {i.action && (
                        <p className={styles.insightAction}>
                          {i.action}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className={styles.noteCard}>
              <CardHeader>
                <CardTitle className={styles.noteTitle}>Why these are computed, not generated</CardTitle>
                <CardDescription>
                  Every number above comes from your own data by arithmetic. A model inventing a
                  statistic about your business would be worse than no insight at all, so AI is only
                  ever used to phrase things — never to work them out.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          <section className={styles.writeSection}>
            <h2 className={cn("display", styles.writeTitle)}>Write something</h2>
            <AiAssistant configured={configured} />
          </section>
        </PageShell>
      </div>
    </>
  );
}
