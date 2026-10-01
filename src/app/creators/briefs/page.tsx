import { Check, X } from "lucide-react";
import { CreatorTopbar } from "@/components/creator/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BriefActions } from "@/components/creator/brief-actions";
import { BRIEFS } from "@/lib/creator-data";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function CreatorBriefsPage() {
  return (
    <>
      <CreatorTopbar title="Briefs" />
      <div className={styles.content}>
        <PageShell
          title="Open briefs"
          description="Read the whole thing before accepting — the must-include list is what the brand signs off against, so a missed item means a reshoot."
        >
          <div className={styles.briefGrid}>
            {BRIEFS.map((b) => (
              <Card key={b.id}>
                <CardHeader className={styles.briefHeader}>
                  <div>
                    <CardTitle className={styles.briefTitle}>{b.campaign}</CardTitle>
                    <p className={styles.briefMeta}>{b.brand} · {b.id}</p>
                  </div>
                  <span className={cn("display", styles.briefFee)}>{inr(b.fee)}</span>
                </CardHeader>

                <CardContent className={styles.briefBody}>
                  <p className={styles.briefSummary}>{b.summary}</p>

                  <div>
                    <p className={styles.listLabel}>
                      Must include
                    </p>
                    <ul className={styles.checklist}>
                      {b.mustInclude.map((m) => (
                        <li key={m} className={styles.checkItem}>
                          <Check className={styles.mustIcon} />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className={styles.listLabel}>
                      Avoid
                    </p>
                    <ul className={styles.checklist}>
                      {b.avoid.map((a) => (
                        <li key={a} className={styles.checkItem}>
                          <X className={styles.avoidIcon} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.briefFooter}>
                    <BriefActions
                      brief={{
                        id: b.id,
                        title: `${b.brand} — ${b.campaign}`,
                        fee: b.fee,
                        dueAt: b.respondBy,
                      }}
                    />
                    <Badge variant="warning" className={styles.deadlineBadge}>
                      Respond by {formatDate(b.respondBy)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageShell>
      </div>
    </>
  );
}
