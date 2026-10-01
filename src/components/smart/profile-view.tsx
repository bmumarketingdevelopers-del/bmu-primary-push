"use client";

import * as React from "react";
import Link from "next/link";
import "./profile-motion.css";
import {
  Phone, MessageCircle, Mail, Globe, MapPin, Instagram, Facebook, Youtube,
  Linkedin, Star, CreditCard, CalendarCheck, UtensilsCrossed, BookOpen,
  FileDown, Link2, BadgeCheck, Share2, Check,
} from "lucide-react";
import { CATEGORY_TEMPLATES, whatsappUrl, type LinkType, type SmartProfile } from "@/lib/qr-platform";
import { CORNERS, THEMES, themeVars, type ProfileTheme } from "@/lib/profile-theme";
import { ComplianceStrip } from "./compliance-strip";
import { inr, cn } from "@/lib/utils";
import styles from "./profile-view.module.css";

const ICONS: Record<LinkType, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  PHONE: Phone, WHATSAPP: MessageCircle, EMAIL: Mail, WEBSITE: Globe, DIRECTIONS: MapPin,
  INSTAGRAM: Instagram, FACEBOOK: Facebook, YOUTUBE: Youtube, LINKEDIN: Linkedin,
  GOOGLE_REVIEW: Star, PAYMENT: CreditCard, BOOKING: CalendarCheck,
  MENU: UtensilsCrossed, CATALOGUE: BookOpen, BROCHURE: FileDown, CUSTOM: Link2,
};

function hrefFor(type: LinkType, value: string, businessName: string) {
  switch (type) {
    case "PHONE": return `tel:${value}`;
    case "EMAIL": return `mailto:${value}`;
    case "WHATSAPP":
      return whatsappUrl(value, `Hi ${businessName}, I found you through your QR profile.`);
    default: return value;
  }
}

export function ProfileView({
  business,
  theme,
  preview = false,
}: {
  business: SmartProfile;
  theme: ProfileTheme;
  /** Preview mode disables outbound navigation inside the editor. */
  preview?: boolean;
}) {
  const template = CATEGORY_TEMPLATES[business.category] ?? CATEGORY_TEMPLATES.OTHER;
  const primary = business.links.filter((l) => template.primary.includes(l.type));
  const secondary = business.links.filter((l) => !template.primary.includes(l.type));

  /**
   * Motion is a CSS class now, not a JavaScript library. The reduced-motion
   * preference is handled in the stylesheet, so nothing here needs to know
   * about it — which also means the animation is correct before hydration.
   */
  const motionClass = `bmu-seq bmu-m-${theme.motion}`;
  const lively = theme.motion === "lively";

  /**
   * Layout flags.
   *
   * Each layout changes structure rather than just spacing — a cover layout
   * has a banner the others don't, a split layout puts the logo beside the
   * name instead of above it. Derived once here so the JSX reads as
   * conditions rather than repeated string comparisons.
   */
  const isCover = theme.layout === "cover";
  const isSplit = theme.layout === "split";
  const isCard = theme.layout === "card";
  const isGradient = theme.layout === "gradient";
  const isMinimal = theme.layout === "minimal";
  const isSpotlight = theme.layout === "spotlight";
  const isEditorial = theme.layout === "editorial";
  const isGrid3 = theme.layout === "grid3";

  /**
   * Button chrome per style. Kept here so every surface stays consistent.
   * The corner radius is data-driven, so it reaches the stylesheet as
   * --btn-radius (set on the root below); the rest is a class per style.
   */
  const buttonRadius = theme.buttons === "pill" ? 999 : theme.buttons === "square" ? 4 : CORNERS[theme.corners].radius;

  function buttonClass(kind: "primary" | "secondary"): string {
    if (kind === "secondary") return styles.btnSecondary;
    switch (theme.buttons) {
      case "soft":
        return styles.btnSoft;
      case "outline":
        return styles.btnOutline;
      case "glass":
        return styles.btnGlass;
      case "raised":
        return styles.btnRaised;
      case "pill":
      case "square":
      default:
        return styles.btnSolid;
    }
  }

  const initials = business.name.slice(0, 2).toUpperCase();

  return (
    <div
      style={{ ...themeVars(theme), "--btn-radius": `${buttonRadius}px` } as React.CSSProperties}
      className={cn(styles.profile, isGradient && styles.gradient)}
    >
      {/* Cover banner */}
      {isCover && (
        <div
          className={cn("bmu-cover", styles.cover)}
          style={{
            "--cover-bg": theme.coverUrl
              ? `center/cover url(${theme.coverUrl})`
              : "linear-gradient(135deg, var(--p-accent), var(--p-text))",
          } as React.CSSProperties}
        >
          <div className={styles.coverFade} />
        </div>
      )}

      <div
        className={cn(motionClass, styles.page, isCover && styles.pageOverCover)}
      >
        <div className={cn(isCard && styles.card)}>
          {/* Identity */}
          <header
            className={cn(
              isSplit ? styles.identitySplit : styles.identityCentered,
              !isCover && styles.identitySpaced
            )}
          >
            <div className={cn("bmu-logo", !isSplit && styles.logoWrapCentered)}>
              <div
                className={cn(
                  styles.logo,
                  isSplit ? styles.logoSmall : styles.logoLarge,
                  isCover && styles.logoOnCover,
                  theme.logoShape === "circle" ? styles.logoCircle : theme.logoShape === "square" ? styles.logoSquare : styles.logoRounded
                )}
                style={{
                  "--logo-bg": theme.logoUrl ? `center/cover url(${theme.logoUrl})` : "var(--p-accent)",
                } as React.CSSProperties}
              >
                {!theme.logoUrl && initials}
              </div>
            </div>

            <div className={cn(isSplit && styles.nameBlockSplit)}>
              <h1
                className={cn(
                  styles.name,
                  !isSplit && styles.nameSpaced,
                  isEditorial ? styles.nameEditorial : styles.nameDefault
                )}
              >
                {business.name}
              </h1>
              <p className={styles.tagline}>{business.tagline}</p>
            </div>

            {business.reviewCount > 0 && !isSplit && (
              <p className={styles.rating}>
                <Star className={styles.ratingStar} />
                <span className={styles.ratingValue}>{business.rating}</span>
                <span className={styles.ratingCount}>· {business.reviewCount.toLocaleString("en-IN")} reviews</span>
              </p>
            )}
          </header>

          {/* Primary actions */}
          {isSpotlight && primary[0] ? (
            <div className={styles.spotlight}>
              <ActionButton link={primary[0]} big businessName={business.name} className={buttonClass("primary")} preview={preview} />
              <div className={styles.spotlightGrid}>
                {primary.slice(1).map((l) => (
                  <ActionButton key={l.label} link={l} compact businessName={business.name} className={buttonClass("secondary")} preview={preview} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className={cn(
                styles.actions,
                isMinimal ? styles.actionsList : isGrid3 ? styles.actionsGrid3 : styles.actionsGrid2
              )}
            >
              {primary.map((l) => (
                <ActionButton
                  key={l.label}
                  link={l}
                  row={isMinimal}
                  compact={isGrid3}
                  businessName={business.name}
                  className={buttonClass("primary")}
                  preview={preview}
                />
              ))}
            </div>
          )}

          {/* Offers */}
          {business.offers.length > 0 && (
            <section className={styles.offers}>
              {business.offers.map((o) => (
                <div
                  key={o.title}
                  className={cn("bmu-offer", styles.offer)}
                >
                  <p className={styles.offerTitle}>{o.title}</p>
                  <p className={styles.offerDetail}>{o.detail}</p>
                </div>
              ))}
            </section>
          )}

          {/* Services */}
          {business.services.length > 0 && (
            <section className={styles.section}>
              <SectionLabel>{template.sections[0] ?? "Services"}</SectionLabel>
              <ul className={styles.services}>
                {business.services.map((s, i) => (
                  <li
                    key={s.name}
                    className={cn(styles.service, i !== 0 && styles.serviceDivided)}
                  >
                    <span className={styles.serviceName}>{s.name}</span>
                    <span className={styles.servicePrice}>
                      {s.price ? `${s.note === "from" ? "from " : ""}${inr(s.price)}` : s.note ?? ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* About */}
          {business.about && (
            <section className={styles.section}>
              <SectionLabel>About</SectionLabel>
              <p className={styles.about}>
                {business.about}
              </p>
            </section>
          )}

          {/* Statutory display. Only renders when something is recorded. */}
          {business.licences && (
            <ComplianceStrip category={business.category} values={business.licences} />
          )}

          {/* Secondary links */}
          {secondary.length > 0 && (
            <section className={styles.secondary}>
              {secondary.map((l) => (
                <ActionButton
                  key={l.label}
                  link={l}
                  row
                  businessName={business.name}
                  className={buttonClass("secondary")}
                  preview={preview}
                />
              ))}
            </section>
          )}

          {/* Review + share */}
          <div className={styles.reviewRow}>
            <TapTarget>
              <Link
                href={preview ? "#" : `/r/${business.slug}`}
                className={cn(styles.reviewLink, buttonClass("secondary"))}
              >
                <Star className={styles.reviewIcon} strokeWidth={1.9} />
                Leave a review
              </Link>
            </TapTarget>
            <ShareButton name={business.name} className={buttonClass("secondary")} />
          </div>

          {business.address && (
            <p className={styles.address}>
              {business.address}
            </p>
          )}
        </div>

        <p className={styles.powered}>
          <BadgeCheck className={styles.poweredIcon} />
          Powered by BMU QR
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={styles.sectionLabel}>
      {children}
    </h2>
  );
}

function TapTarget({ children }: { children: React.ReactNode }) {
  return <div className="bmu-tap-soft">{children}</div>;
}

function ActionButton({
  link, businessName, className, big, compact, row, preview,
}: {
  link: { type: LinkType; label: string; value: string };
  businessName: string;
  /** Button chrome for the current theme style. */
  className: string;
  big?: boolean;
  compact?: boolean;
  row?: boolean;
  preview?: boolean;
}) {
  const Icon = ICONS[link.type] ?? Link2;
  const href = preview ? "#" : hrefFor(link.type, link.value, businessName);

  const shape = big
    ? styles.actionBig
    : compact
      ? styles.actionCompact
      : row
        ? styles.actionRow
        : styles.actionTile;

  return (
    <a
      href={href}
      target={link.value.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={cn("bmu-tap bmu-lift", styles.action, shape, className)}
    >
      <Icon className={big ? styles.actionIconBig : compact ? styles.actionIconCompact : styles.actionIcon} strokeWidth={1.9} />
      {link.label}
    </a>
  );
}

/** Native share where it exists — that's how a profile actually spreads. */
function ShareButton({ name, className }: { name: string; className: string }) {
  const [done, setDone] = React.useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* dismissed */
    }
  }

  return (
    <TapTarget>
      <button onClick={share} aria-label="Share this page" className={cn(styles.share, className)}>
        {done ? <Check className={styles.shareIcon} /> : <Share2 className={styles.shareIcon} />}
      </button>
    </TapTarget>
  );
}
