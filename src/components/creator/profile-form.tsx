"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveCreatorProfile, type ProfileState } from "@/app/creators/profile/actions";
import { cn } from "@/lib/utils";
import styles from "./profile-form.module.css";

const initial: ProfileState = { ok: false, message: null };

export function CreatorProfileForm({
  creator,
}: {
  creator: {
    name: string; handle: string; city?: string; bio?: string;
    categories?: string[]; followers?: number; avgViews?: number;
    rateCard?: number; upiId?: string; panNumber?: string;
  };
}) {
  const [state, action, pending] = React.useActionState(saveCreatorProfile, initial);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.identityGrid}>
        <div className={styles.field}>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={creator.name} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="handle">Handle</Label>
          <Input id="handle" name="handle" required defaultValue={creator.handle} placeholder="@yourhandle" />
        </div>
        <div className={styles.field}>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={creator.city} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="categories">Categories</Label>
          <Input
            id="categories"
            name="categories"
            defaultValue={creator.categories?.join(", ")}
            placeholder="Food, Travel"
          />
          <p className={styles.help}>
            Comma separated. This is what briefs are matched on.
          </p>
        </div>
      </div>

      <div className={styles.field}>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={600}
          defaultValue={creator.bio}
          className={styles.textarea}
        />
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.field}>
          <Label htmlFor="followers">Followers</Label>
          <Input id="followers" name="followers" type="number" defaultValue={creator.followers} />
        </div>
        <div className={styles.field}>
          <Label htmlFor="avgViews">Average views</Label>
          <Input id="avgViews" name="avgViews" type="number" defaultValue={creator.avgViews} />
          <p className={styles.help}>Brands weigh this above follower count.</p>
        </div>
        <div className={styles.field}>
          <Label htmlFor="rateCard">Rate per deliverable (₹)</Label>
          <Input
            id="rateCard"
            name="rateCard"
            type="number"
            defaultValue={creator.rateCard ? creator.rateCard / 100 : undefined}
          />
        </div>
      </div>

      <div className={styles.payoutGrid}>
        <div className={styles.field}>
          <Label htmlFor="upiId">UPI ID</Label>
          <Input id="upiId" name="upiId" defaultValue={creator.upiId} placeholder="you@upi" />
          <p className={styles.help}>Where payouts are sent.</p>
        </div>
        <div className={styles.field}>
          <Label htmlFor="panNumber">PAN</Label>
          <Input id="panNumber" name="panNumber" defaultValue={creator.panNumber} placeholder="ABCDE1234F" />
          <p className={styles.help}>
            Needed for TDS once you pass the annual threshold.
          </p>
        </div>
      </div>

      {state.message && (
        <p className={cn(styles.message, state.ok ? styles.messageOk : styles.messageError)}>
          {state.ok ? <CheckCircle2 className={styles.messageIcon} /> : <AlertCircle className={styles.messageIcon} />}
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save profile"}</Button>
    </form>
  );
}
