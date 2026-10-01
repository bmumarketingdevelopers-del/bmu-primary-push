import { BadgeCheck } from "lucide-react";
import { AdminTopbar } from "@/components/admin/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CREATORS } from "@/lib/admin-data";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { cn, compactNumber, initials, inr } from "@/lib/utils";
import styles from "./page.module.css";

export default function AdminCreatorsPage() {
  return (
    <>
      <AdminTopbar title="Creators" />
      <div className={styles.page}>
        <PageShell
          title="Creator roster"
          description="Vetted creators for UGC and influencer campaigns. Rates are per deliverable and exclude usage rights beyond 30 days."
          action={<EntityDialog entity="creator" label="Add creator" />}
        >
          <div className={styles.creatorGrid}>
            {CREATORS.map((c) => (
              <Card key={c.id} className={styles.creatorCard}>
                <CardContent className={styles.creatorBody}>
                  <div className={styles.profile}>
                    <Avatar className={styles.avatar}>
                      <AvatarFallback>{initials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div className={styles.profileText}>
                      <div className={styles.handleRow}>
                        <p className={styles.handle}>{c.handle}</p>
                        {c.verified && <BadgeCheck className={styles.verifiedIcon} />}
                      </div>
                      <p className={styles.location}>{c.name} · {c.city}</p>
                      <Badge variant="secondary" className={styles.categoryBadge}>{c.category}</Badge>
                    </div>
                  </div>

                  <dl className={styles.stats}>
                    <div>
                      <dt className={styles.statLabel}>Followers</dt>
                      <dd className={cn("display", styles.statValue)}>{compactNumber(c.followers)}</dd>
                    </div>
                    <div>
                      <dt className={styles.statLabel}>Avg views</dt>
                      <dd className={cn("display", styles.statValue)}>{compactNumber(c.avgViews)}</dd>
                    </div>
                    <div>
                      <dt className={styles.statLabel}>Rate</dt>
                      <dd className={cn("display", styles.statValue)}>{inr(c.rate)}</dd>
                    </div>
                  </dl>

                  <div className={styles.actions}>
                    <Button variant="outline" size="sm" className={styles.bookButton} disabled title="Campaigns were removed from the panel">Book for a campaign</Button>
                    <RowActions
                      entity="creator"
                      record={c as unknown as Record<string, unknown>}
                      toggleField="isVerified"
                      toggleValue={c.verified}
                      toggleLabels={["Remove verified", "Mark verified"]}
                    />
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
