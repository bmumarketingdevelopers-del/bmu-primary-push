import { Plus, Tag } from "lucide-react";
import { BusinessTopbar } from "@/components/business/topbar";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowActions } from "@/components/admin/row-actions";
import { BUSINESS_OFFERS } from "@/lib/business-data";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export default function BusinessOffersPage() {
  return (
    <>
      <BusinessTopbar title="Offers" />
      <div className={styles.page}>
        <PageShell
          title="Offers"
          description="Active offers show on your public profile inside a dashed box. Turning one off removes it instantly — no reprint."
          action={<EntityDialog entity="offer" label="New offer" />}
        >
          <div className={styles.offerGrid}>
            {BUSINESS_OFFERS.map((o) => (
              <Card key={o.id} className={o.isActive ? styles.activeCard : undefined}>
                <CardHeader className={styles.offerHeader}>
                  <div className={styles.offerIntro}>
                    <span className={styles.offerIcon}>
                      <Tag className={styles.offerGlyph} strokeWidth={1.8} />
                    </span>
                    <div>
                      <CardTitle className={styles.offerTitle}>{o.title}</CardTitle>
                      <p className={styles.offerDetail}>{o.detail}</p>
                    </div>
                  </div>
                  <Badge variant={o.isActive ? "success" : "outline"}>
                    {o.isActive ? "Live" : "Ended"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className={styles.offerStats}>
                    {o.code && (
                      <span className={styles.stat}>
                        Code <span className={styles.code}>{o.code}</span>
                      </span>
                    )}
                    <span className={styles.stat}>
                      <span className={styles.claims}>{o.claims}</span> claimed
                    </span>
                    {o.endsAt && (
                      <span className={styles.stat}>Ends {formatDate(o.endsAt)}</span>
                    )}
                  </div>
                  <div className={styles.offerActions}>
                    <RowActions entity="offer" record={o as unknown as Record<string, unknown>} />
                    <RowActions entity="offer" record={o as unknown as Record<string, unknown>} />
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
