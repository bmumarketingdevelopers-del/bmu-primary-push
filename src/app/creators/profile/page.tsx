import { BadgeCheck } from "lucide-react";
import { CreatorTopbar } from "@/components/creator/topbar";
import { PageShell } from "@/components/dashboard/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreatorProfileForm } from "@/components/creator/profile-form";
import { CREATOR_PROFILE } from "@/lib/creator-data";
import { cn, compactNumber } from "@/lib/utils";
import styles from "./page.module.css";

export default function CreatorProfilePage() {
  return (
    <>
      <CreatorTopbar title="Profile" />
      <div className={styles.content}>
        <PageShell
          title="Your profile"
          description="This is what brands see when they filter the marketplace. Accurate reach and a clear no-go list get you better-matched briefs, not fewer."
          action={
            CREATOR_PROFILE.isVerified ? (
              <Badge variant="success" className={styles.verifiedBadge}>
                <BadgeCheck className={styles.verifiedIcon} /> Verified
              </Badge>
            ) : null
          }
        >
          <div className={styles.statGrid}>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Followers</p>
              <p className={cn("display", styles.statValue)}>
                {compactNumber(CREATOR_PROFILE.followers)}
              </p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Average views</p>
              <p className={cn("display", styles.statValue)}>
                {compactNumber(CREATOR_PROFILE.avgViews)}
              </p>
            </Card>
            <Card className={styles.statCard}>
              <p className={styles.statLabel}>Engagement proxy</p>
              <p className={cn("display", styles.statValue)}>
                {Math.round((CREATOR_PROFILE.avgViews / CREATOR_PROFILE.followers) * 100)}%
              </p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Public details</CardTitle>
              <CardDescription>
                Shown to brands browsing the marketplace, and used to match you to briefs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatorProfileForm
                creator={{
                  name: CREATOR_PROFILE.name,
                  handle: CREATOR_PROFILE.handle,
                  city: CREATOR_PROFILE.city,
                  bio: CREATOR_PROFILE.bio,
                  categories: CREATOR_PROFILE.categories,
                  followers: CREATOR_PROFILE.followers,
                  avgViews: CREATOR_PROFILE.avgViews,
                  rateCard: CREATOR_PROFILE.rateCard,
                }}
              />
            </CardContent>
          </Card>
        </PageShell>
      </div>
    </>
  );
}
