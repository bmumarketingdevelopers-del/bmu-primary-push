"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveBusinessProfile, type ProfileState } from "@/app/business/profile/actions";
import { CmsFields } from "@/components/admin/cms-fields";
import { PROFILE_LINK_FIELDS, PROFILE_OFFER_FIELDS, PROFILE_SERVICE_FIELDS } from "@/lib/profile-fields";
import { CATEGORY_TEMPLATES, type SmartProfile } from "@/lib/qr-platform";
import { cn } from "@/lib/utils";
import styles from "./profile-editor.module.css";

const initial: ProfileState = { ok: false, message: null };

export function ProfileEditor({ business }: { business: SmartProfile }) {
  const [state, action, pending] = useActionState(saveBusinessProfile, initial);
  const template = CATEGORY_TEMPLATES[business.category] ?? CATEGORY_TEMPLATES.OTHER;

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="slug" value={business.slug} />

      <Card>
        <CardHeader>
          <CardTitle>Business details</CardTitle>
          <CardDescription>
            This is what someone sees within a second of scanning. Keep the tagline short — it sits
            under the name on a phone screen.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.fieldGrid}>
          <div className={styles.field}>
            <Label htmlFor="name">Business name</Label>
            <Input id="name" name="name" defaultValue={business.name} required />
          </div>
          <div className={styles.field}>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" defaultValue={business.tagline} placeholder="Unisex salon · Indiranagar" />
          </div>
          <div className={cn(styles.field, styles.fieldWide)}>
            <Label htmlFor="about">About</Label>
            <textarea id="about" name="about" rows={3} defaultValue={business.about} className={styles.textarea} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            WhatsApp needs the country code without a plus — <span className={styles.mono}>919845000111</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.fieldGrid}>
          <div className={styles.field}>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={business.phone} />
          </div>
          <div className={styles.field}>
            <Label htmlFor="whatsapp">WhatsApp number</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={business.whatsapp} />
          </div>
          <div className={styles.field}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={business.city} />
          </div>
          <div className={cn(styles.field, styles.fieldWide)}>
            <Label htmlFor="address">Address</Label>
            <textarea id="address" name="address" rows={2} defaultValue={business.address} className={styles.textarea} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews and branding</CardTitle>
          <CardDescription>
            The Google Place ID is what makes the review booster send happy customers to the right
            listing. Find it in your Google Business Profile.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.fieldGrid}>
          <div className={cn(styles.field, styles.fieldWide)}>
            <Label htmlFor="gbpMapsUrl">Google Maps link</Label>
            <Input
              id="gbpMapsUrl"
              name="gbpMapsUrl"
              placeholder="Paste your Google Maps listing link"
            />
            <p className={styles.help}>
              Open your business on Google Maps, tap Share, and paste the link here. We pull the
              Place ID out of it automatically — that&apos;s what makes the review button open the
              review box instead of the listing.
            </p>
          </div>

          <div className={styles.field}>
            <Label htmlFor="gbpPlaceId">Place ID (optional)</Label>
            <Input id="gbpPlaceId" name="gbpPlaceId" placeholder="ChIJ..." />
            <p className={styles.help}>
              Only needed if the link above doesn&apos;t contain one.
            </p>
          </div>
          <div className={styles.field}>
            <Label htmlFor="brandColor">Brand colour</Label>
            <div className={styles.colourRow}>
              <span
                className={styles.brandSwatch}
                style={{ "--brand-color": business.brandColor } as React.CSSProperties}
              />
              <Input id="brandColor" name="brandColor" defaultValue={business.brandColor} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buttons and links</CardTitle>
          <CardDescription>
            Everything a customer can tap. Add, reorder or remove — the public page updates the
            moment you save, and nothing printed needs replacing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CmsFields fields={PROFILE_LINK_FIELDS} value={{ links: business.links }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services and prices</CardTitle>
          <CardDescription>
            Shown as a price list under the buttons. Leave a price empty and it reads as
            &ldquo;on request&rdquo;.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CmsFields fields={PROFILE_SERVICE_FIELDS} value={{ services: business.services }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            Promotions shown near the top of your profile. Removing one takes it down instantly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CmsFields fields={PROFILE_OFFER_FIELDS} value={{ offers: business.offers }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>
            Unpublishing hides the page without breaking anything printed — scans show a
            &ldquo;temporarily unavailable&rdquo; message instead of an error.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.visibility}>
          <label className={styles.publishToggle}>
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={business.isPublished}
              className={styles.checkbox}
            />
            Publish my page at <span className={styles.slug}>/b/{business.slug}</span>
          </label>
          <a
            href={`/b/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className={styles.previewLink}
          >
            <ExternalLink className={styles.previewIcon} /> Preview it
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout template</CardTitle>
          <CardDescription>
            Your category decides which actions appear as big buttons. Change it from Plan &amp;
            billing, or ask support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={styles.templateName}>{template.label}</p>
          <div className={styles.templateActions}>
            {template.primary.map((p) => (
              <span key={p} className={styles.templateAction}>
                {p.replace("_", " ").toLowerCase()}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {state.message && (
        <p className={cn(styles.message, state.ok ? styles.messageOk : styles.messageError)}>
          {state.ok ? <CheckCircle2 className={styles.messageIcon} /> : <AlertCircle className={styles.messageIcon} />}
          {state.message}
        </p>
      )}

      <div className={styles.saveBar}>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
