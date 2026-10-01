import Link from "next/link";
import { Clapperboard, Eye, IndianRupee, CircleCheck, ArrowRight } from "lucide-react";
import { CreatorTopbar } from "@/components/creator/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { BookingStatus } from "@/components/creator/booking-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BOOKINGS, BRIEFS, CREATOR_KPIS, CREATOR_PROFILE } from "@/lib/creator-data";
import { cn, formatDate, inr } from "@/lib/utils";
import styles from "./page.module.css";

const ICONS = { IndianRupee, Clapperboard, Eye, CircleCheck };

export default function CreatorOverview() {
  const invited = BOOKINGS.filter((b) => b.status === "INVITED");
  const active = BOOKINGS.filter((b) => ["BOOKED", "IN_PRODUCTION", "SUBMITTED"].includes(b.status));

  return (
    <>
      <CreatorTopbar title="Overview" />
      <div className={styles.content}>
        <PageShell
          title={`Hello, ${CREATOR_PROFILE.name.split(" ")[0]}`}
          description="Your briefs, deliverables and payouts. Fees are agreed before you shoot, and payouts run on the 3rd of each month."
        >
          <div className={styles.kpiGrid}>
            {CREATOR_KPIS.map((k) => (
              <StatCard
                key={k.label}
                label={k.label}
                value={k.value}
                delta={k.delta}
                sub={k.sub}
                icon={ICONS[k.icon as keyof typeof ICONS]}
              />
            ))}
          </div>

          {invited.length > 0 && (
            <Card className={styles.invitedCard}>
              <CardHeader className={styles.headerRow}>
                <CardTitle className={styles.invitedTitle}>
                  {invited.length} brief{invited.length > 1 ? "s" : ""} waiting on you
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/creators/briefs">Read them <ArrowRight /></Link>
                </Button>
              </CardHeader>
              <CardContent className={styles.invitedList}>
                {invited.map((b) => (
                  <div
                    key={b.id}
                    className={styles.invitedItem}
                  >
                    <div className={styles.itemText}>
                      <p className={styles.itemTitle}>{b.campaign}</p>
                      <p className={styles.itemMeta}>{b.brand} · {b.deliverables}</p>
                    </div>
                    <span className={cn("display", styles.invitedFee)}>{inr(b.fee)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className={styles.columns}>
            <Card>
              <CardHeader className={styles.headerRow}>
                <CardTitle>In flight</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/creators/bookings">All bookings</Link>
                </Button>
              </CardHeader>
              <CardContent className={styles.activeList}>
                {active.map((b) => (
                  <div key={b.id} className={styles.activeItem}>
                    <div className={styles.itemText}>
                      <p className={styles.itemTitle}>{b.campaign}</p>
                      <p className={styles.itemMeta}>Due {formatDate(b.dueAt)}</p>
                    </div>
                    <BookingStatus status={b.status} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Your rate card</CardTitle></CardHeader>
              <CardContent>
                <p className={cn("display", styles.rate)}>{inr(CREATOR_PROFILE.rateCard)}</p>
                <p className={styles.rateNote}>per deliverable, 30-day usage included</p>
                <div className={styles.categories}>
                  {CREATOR_PROFILE.categories.map((c) => (
                    <Badge key={c} variant="secondary">{c}</Badge>
                  ))}
                </div>
                <Button asChild variant="outline" size="sm" className={styles.profileButton}>
                  <Link href="/creators/profile">Update profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Open briefs</CardTitle></CardHeader>
            <CardContent className={styles.briefList}>
              {BRIEFS.map((b) => (
                <div key={b.id} className={styles.brief}>
                  <div className={styles.briefHead}>
                    <div>
                      <p className={styles.briefCampaign}>{b.campaign}</p>
                      <p className={styles.briefBrand}>{b.brand}</p>
                    </div>
                    <span className={cn("display", styles.briefFee)}>{inr(b.fee)}</span>
                  </div>
                  <p className={styles.briefSummary}>{b.summary}</p>
                  <p className={styles.briefDeadline}>Respond by {formatDate(b.respondBy)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
