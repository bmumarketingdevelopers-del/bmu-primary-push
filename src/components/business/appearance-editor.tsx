"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, ImageUp, Loader2, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileView } from "@/components/smart/profile-view";
import { saveAppearance, type AppearanceState } from "@/app/business/appearance/actions";
import {
  BUTTONS, CORNERS, FONTS, LAYOUTS, MOTIONS, THEMES, contrastRatio,
  type ButtonKey, type CornerKey, type FontKey, type LayoutKey, type MotionKey,
  type ProfileTheme, type ThemeKey,
} from "@/lib/profile-theme";
import type { SmartProfile } from "@/lib/qr-platform";
import { cn } from "@/lib/utils";
import styles from "./appearance-editor.module.css";

const initial: AppearanceState = { ok: false, message: null };

const LOGO_SHAPE_CLASS = {
  circle: styles.logoShapeCircle,
  rounded: styles.logoShapeRounded,
  square: styles.logoShapeSquare,
} as const;

export function AppearanceEditor({
  business,
  theme: saved,
}: {
  business: SmartProfile;
  theme: ProfileTheme;
}) {
  const [theme, setTheme] = React.useState<ProfileTheme>(saved);
  const [state, action, pending] = React.useActionState(saveAppearance, initial);

  const set = <K extends keyof ProfileTheme>(key: K, value: ProfileTheme[K]) =>
    setTheme((t) => ({ ...t, [key]: value }));

  return (
    <div className={styles.editor}>
      {/* Controls */}
      <form action={action} className={styles.form}>
        <input type="hidden" name="slug" value={business.slug} />
        <input type="hidden" name="themeKey" value={theme.theme} />
        <input type="hidden" name="fontKey" value={theme.font} />
        <input type="hidden" name="layoutKey" value={theme.layout} />
        <input type="hidden" name="buttonStyle" value={theme.buttons} />
        <input type="hidden" name="motionLevel" value={theme.motion} />
        <input type="hidden" name="brandColor" value={theme.accent ?? THEMES[theme.theme].accent} />
        <input type="hidden" name="logoUrl" value={theme.logoUrl ?? ""} />
        <input type="hidden" name="coverUrl" value={theme.coverUrl ?? ""} />
        <input type="hidden" name="headingFont" value={theme.headingFont ?? theme.font} />
        <input type="hidden" name="corners" value={theme.corners} />
        <input type="hidden" name="logoShape" value={theme.logoShape ?? "rounded"} />
        <input type="hidden" name="bgColor" value={theme.bg ?? THEMES[theme.theme].bg} />
        <input type="hidden" name="surfaceColor" value={theme.surface ?? THEMES[theme.theme].surface} />
        <input type="hidden" name="textColor" value={theme.text ?? THEMES[theme.theme].text} />

        {/* Colours */}
        <Card>
          <CardHeader>
            <CardTitle>Colours</CardTitle>
            <CardDescription>
              Start from a scheme, then change any colour to anything you like. We measure the
              contrast and warn you rather than stopping you — it&apos;s your brand.
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.cardStack}>
            <div className={styles.themeGrid}>
              {(Object.keys(THEMES) as ThemeKey[]).filter((k) => k !== "custom").map((k) => {
                const t = THEMES[k];
                const on = theme.theme === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() =>
                      setTheme((prev) => ({
                        ...prev, theme: k, accent: t.accent, bg: t.bg, surface: t.surface, text: t.text,
                      }))
                    }
                    className={cn(styles.themeOption, on ? styles.themeOptionOn : styles.themeOptionOff)}
                  >
                    <span
                      className={styles.swatch}
                      style={{
                        "--swatch-bg": t.bg,
                        "--swatch-accent": t.accent,
                        "--swatch-text": t.text,
                      } as React.CSSProperties}
                    >
                      <span className={styles.swatchAccent} />
                      <span className={styles.swatchText} />
                    </span>
                    <span className={styles.themeLabel}>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.colourGrid}>
              <ColourField label="Accent" value={theme.accent ?? THEMES[theme.theme].accent} onChange={(v) => setTheme((p) => ({ ...p, accent: v, theme: "custom" }))} help="Buttons, highlights, the star badge." />
              <ColourField label="Background" value={theme.bg ?? THEMES[theme.theme].bg} onChange={(v) => setTheme((p) => ({ ...p, bg: v, theme: "custom" }))} help="The page behind everything." />
              <ColourField label="Cards" value={theme.surface ?? THEMES[theme.theme].surface} onChange={(v) => setTheme((p) => ({ ...p, surface: v, theme: "custom" }))} help="Service list and secondary buttons." />
              <ColourField label="Text" value={theme.text ?? THEMES[theme.theme].text} onChange={(v) => setTheme((p) => ({ ...p, text: v, theme: "custom" }))} help="Headings and body copy." />
            </div>

            <ContrastCheck
              text={theme.text ?? THEMES[theme.theme].text}
              bg={theme.bg ?? THEMES[theme.theme].bg}
              accent={theme.accent ?? THEMES[theme.theme].accent}
            />
          </CardContent>
        </Card>

        {/* Logo and cover */}
        <Card>
          <CardHeader>
            <CardTitle>Logo and cover</CardTitle>
            <CardDescription>
              Square logo, at least 400×400. The cover only shows on the Cover layout.
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.imageGrid}>
            <ImageField
              label="Logo"
              value={theme.logoUrl}
              onChange={(url) => set("logoUrl", url)}
              hint="Square works best"
            />
            <ImageField
              label="Cover image"
              value={theme.coverUrl}
              onChange={(url) => set("coverUrl", url)}
              hint="Wide, 1600×600"
            />
          </CardContent>
        </Card>

        {/* Typeface */}
        <Card>
          <CardHeader>
            <CardTitle>Typeface</CardTitle>
            <CardDescription>Pick what suits the trade, not what you like most.</CardDescription>
          </CardHeader>
          <CardContent className={styles.cardStack}>
            <FontPicker label="Body text" value={theme.font} onChange={(k) => set("font", k)} />
            <FontPicker
              label="Headings"
              value={theme.headingFont ?? theme.font}
              onChange={(k) => set("headingFont", k)}
              help="Pairing a serif heading with a sans body is the safest way to look considered."
            />
          </CardContent>
        </Card>

        {/* Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Layout</CardTitle>
            <CardDescription>How the page is arranged around your main actions.</CardDescription>
          </CardHeader>
          <CardContent className={styles.layoutGrid}>
            {(Object.keys(LAYOUTS) as LayoutKey[]).map((k) => (
              <Option
                key={k}
                on={theme.layout === k}
                onClick={() => set("layout", k)}
                title={LAYOUTS[k].label}
                note={LAYOUTS[k].note}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shape</CardTitle>
            <CardDescription>Corner rounding across the page, and how your logo is cropped.</CardDescription>
          </CardHeader>
          <CardContent className={styles.shapeGrid}>
            <div className={styles.group}>
              <Label>Corners</Label>
              <div className={styles.cornerGrid}>
                {(Object.keys(CORNERS) as CornerKey[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => set("corners", k)}
                    className={cn(
                      styles.shapeOption,
                      styles.cornerOption,
                      theme.corners === k ? styles.selected : styles.unselected
                    )}
                    style={{
                      "--corner-radius": `${Math.min(CORNERS[k].radius, 20)}px`,
                      "--corner-sample-radius": `${Math.min(CORNERS[k].radius, 12)}px`,
                    } as React.CSSProperties}
                  >
                    <span className={cn(styles.shapeSample, styles.cornerSample)} />
                    {CORNERS[k].label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <Label>Logo shape</Label>
              <div className={styles.logoShapeGrid}>
                {(["circle", "rounded", "square"] as const).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => set("logoShape", shape)}
                    className={cn(
                      styles.shapeOption,
                      styles.logoShapeOption,
                      (theme.logoShape ?? "rounded") === shape
                        ? styles.selected
                        : styles.unselected
                    )}
                  >
                    <span className={cn(styles.shapeSample, LOGO_SHAPE_CLASS[shape])} />
                    {shape}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons and motion */}
        <div className={styles.optionsGrid}>
          <Card>
            <CardHeader><CardTitle className={styles.cardTitle}>Button style</CardTitle></CardHeader>
            <CardContent className={styles.optionList}>
              {(Object.keys(BUTTONS) as ButtonKey[]).map((k) => (
                <Option
                  key={k}
                  on={theme.buttons === k}
                  onClick={() => set("buttons", k)}
                  title={BUTTONS[k].label}
                  note={BUTTONS[k].note}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={styles.cardTitle}>Motion</CardTitle>
              <CardDescription>
                Anyone with reduced motion turned on sees the still version regardless.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.optionList}>
              {(Object.keys(MOTIONS) as MotionKey[]).map((k) => (
                <Option
                  key={k}
                  on={theme.motion === k}
                  onClick={() => set("motion", k)}
                  title={MOTIONS[k].label}
                  note={MOTIONS[k].note}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {state.message && (
          <p className={cn(styles.message, state.ok ? styles.messageOk : styles.messageError)}>
            {state.ok ? <CheckCircle2 className={styles.messageIcon} /> : <AlertCircle className={styles.messageIcon} />}
            {state.message}
          </p>
        )}

        <div className={styles.saveBar}>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save appearance"}
          </Button>
        </div>
      </form>

      {/* Live preview */}
      <div className={styles.preview}>
        <p className={styles.previewLabel}>
          <Smartphone className={styles.previewLabelIcon} /> Live preview
        </p>
        <div className={styles.phoneFrame}>
          <div className={cn("scroll-thin", styles.phoneScreen)}>
            <ProfileView business={business} theme={theme} preview />
          </div>
        </div>
        <p className={styles.previewNote}>
          Scroll inside the frame. Links are disabled here so you don&apos;t leave the editor.
        </p>
      </div>
    </div>
  );
}

function Option({ on, onClick, title, note }: { on: boolean; onClick: () => void; title: string; note: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(styles.option, on ? styles.selected : styles.unselected)}
    >
      <span className={cn(styles.radio, on ? styles.radioOn : styles.radioOff)}>
        {on && <span className={styles.radioDot} />}
      </span>
      <span>
        <span className={styles.optionTitle}>{title}</span>
        <span className={styles.optionNote}>{note}</span>
      </span>
    </button>
  );
}

/** Uploads straight to R2 via a presigned URL, same as the media library. */
function ImageField({
  label, value, onChange, hint,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  hint: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? "Upload refused"); return; }
      if (data.configured === false) { setError("Storage isn't configured yet — paste a URL instead."); return; }

      const put = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) { setError("Storage rejected the file"); return; }

      onChange(data.publicUrl ?? "");
    } catch {
      setError("Network error during upload");
    }
    setBusy(false);
  }

  return (
    <div className={styles.field}>
      <Label>{label}</Label>

      {value ? (
        <div className={styles.imagePreview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className={styles.imagePreviewImg} />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Remove ${label}`}
            className={styles.removeImage}
          >
            <X className={styles.removeImageIcon} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={styles.upload}
        >
          {busy ? <Loader2 className={cn(styles.uploadIcon, styles.spinning)} /> : <ImageUp className={styles.uploadIcon} />}
          <span className={styles.uploadHint}>{busy ? "Uploading…" : hint}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="or paste an image URL" />
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}


function ColourField({
  label, value, onChange, help,
}: { label: string; value: string; onChange: (v: string) => void; help: string }) {
  return (
    <div className={styles.field}>
      <Label>{label}</Label>
      <div className={styles.colourRow}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.colourPicker}
          aria-label={`${label} colour`}
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className={styles.hexInput} />
      </div>
      <p className={styles.colourHelp}>{help}</p>
    </div>
  );
}

/** Measured, not guessed — 4.5 is the WCAG threshold for body text. */
function ContrastCheck({ text, bg, accent }: { text: string; bg: string; accent: string }) {
  const body = contrastRatio(text, bg);
  const button = contrastRatio(accent, bg);

  const row = (label: string, ratio: number, threshold: number) => {
    const ok = ratio >= threshold;
    return (
      <div className={styles.contrastRow}>
        <span className={styles.contrastLabel}>{label}</span>
        <span className={cn(styles.contrastRatio, ok ? styles.contrastPass : styles.contrastFail)}>
          {ratio}:1 {ok ? "· fine" : "· hard to read"}
        </span>
      </div>
    );
  };

  return (
    <div className={styles.contrast}>
      {row("Text on background", body, 4.5)}
      {row("Accent on background", button, 3)}
      {(body < 4.5 || button < 3) && (
        <p className={styles.contrastWarning}>
          Low contrast is readable on a desk and invisible on a phone in sunlight — which is where
          these pages are actually opened.
        </p>
      )}
    </div>
  );
}

function FontPicker({
  label, value, onChange, help,
}: { label: string; value: FontKey; onChange: (k: FontKey) => void; help?: string }) {
  const groups = ["Sans", "Serif", "Display"] as const;

  return (
    <div className={styles.group}>
      <Label>{label}</Label>
      {help && <p className={styles.fontHelp}>{help}</p>}

      {groups.map((g) => (
        <div key={g}>
          <p className={styles.fontCategory}>{g}</p>
          <div className={styles.fontGrid}>
            {(Object.keys(FONTS) as FontKey[])
              .filter((k) => FONTS[k].category === g)
              .map((k) => {
                const f = FONTS[k];
                const on = value === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => onChange(k)}
                    className={cn(styles.fontOption, on ? styles.selected : styles.unselected)}
                  >
                    <span
                      className={styles.fontSample}
                      style={{ "--sample-font": f.stack } as React.CSSProperties}
                    >
                      {f.label}
                    </span>
                    <span className={styles.fontNote}>{f.note}</span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
