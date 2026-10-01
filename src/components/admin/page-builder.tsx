"use client";

import * as React from "react";
import {
  AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Copy, ExternalLink,
  Eye, Plus, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { savePage, type PageState } from "@/app/admin/website/pages/actions";
import {
  SECTION_GROUPS, SECTION_TYPES, sectionByType,
  type PageSection, type SectionType,
} from "@/lib/page-builder";
import type { Field } from "@/lib/cms/schema";
import type { CustomPage } from "@/lib/repos/pages";
import { cn } from "@/lib/utils";
import styles from "./page-builder.module.css";

const initial: PageState = { ok: false, message: null };
const newId = () => Math.random().toString(36).slice(2, 9);

/**
 * The page builder.
 *
 * Sections are held in React state and posted as one JSON field. That keeps
 * reordering and deleting instant, and means a half-built page is never
 * written — the whole thing saves or none of it does.
 */
export function PageBuilder({ page }: { page: CustomPage | null }) {
  const [sections, setSections] = React.useState<PageSection[]>(page?.sections ?? []);
  const [state, action, pending] = React.useActionState(savePage, initial);
  const [addOpen, setAddOpen] = React.useState(false);

  function add(type: SectionType) {
    setSections((s) => [...s, { id: newId(), type, data: {} }]);
    setAddOpen(false);
  }

  function update(id: string, key: string, value: unknown) {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, data: { ...sec.data, [key]: value } } : sec)));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    setSections((s) => {
      const copy = [...s];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  const remove = (id: string) => setSections((s) => s.filter((sec) => sec.id !== id));
  const duplicate = (id: string) =>
    setSections((s) => {
      const i = s.findIndex((sec) => sec.id === id);
      if (i === -1) return s;
      const copy = [...s];
      copy.splice(i + 1, 0, { ...s[i], id: newId() });
      return copy;
    });

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />

      <Card>
        <CardHeader>
          <CardTitle>Page settings</CardTitle>
          <CardDescription>
            The address is permanent once you share it — changing it later breaks any link
            already out there.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.settingsGrid}>
          <div className={styles.field}>
            <Label htmlFor="title">Page title</Label>
            <Input id="title" name="title" required defaultValue={page?.title} placeholder="Why BMU" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="slug">Address</Label>
            <div className={styles.slugRow}>
              <span className={styles.slugPrefix}>/p/</span>
              <Input id="slug" name="slug" required defaultValue={page?.slug} placeholder="why-bmu" />
            </div>
          </div>
          <div className={cn(styles.field, styles.fieldWide)}>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" defaultValue={page?.subtitle ?? ""} />
          </div>

          <div className={styles.field}>
            <Label htmlFor="navLabel">Show in the menu as</Label>
            <Input id="navLabel" name="navLabel" defaultValue={page?.navLabel ?? ""} placeholder="Leave empty to hide" />
          </div>
          <div className={styles.field}>
            <Label htmlFor="navOrder">Menu position</Label>
            <Input id="navOrder" name="navOrder" type="number" defaultValue={page?.navOrder ?? 100} />
          </div>

          <div className={styles.field}>
            <Label htmlFor="metaTitle">SEO title</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={page?.metaTitle ?? ""} />
          </div>
          <div className={styles.field}>
            <Label htmlFor="metaDesc">SEO description</Label>
            <Input id="metaDesc" name="metaDesc" defaultValue={page?.metaDesc ?? ""} />
          </div>

          <label className={cn(styles.publishToggle, styles.fieldWide)}>
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={page?.isPublished}
              className={styles.checkbox}
            />
            <span className={styles.publishLabel}>
              Publish this page
              <span className={styles.publishHint}>
                Unpublished pages are only reachable by people who know the address.
              </span>
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className={styles.sections}>
        {sections.map((section, index) => {
          const def = sectionByType(section.type);
          if (!def) return null;

          return (
            <Card key={section.id}>
              <CardHeader className={styles.sectionHeader}>
                <div>
                  <CardTitle className={styles.sectionTitle}>
                    <Badge variant="outline">{index + 1}</Badge>
                    {def.label}
                  </CardTitle>
                  <CardDescription className={styles.sectionDescription}>{def.description}</CardDescription>
                </div>
                <div className={styles.sectionTools}>
                  <Button type="button" variant="ghost" size="sm" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => move(index, 1)} disabled={index === sections.length - 1} aria-label="Move down">
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => duplicate(section.id)} aria-label="Duplicate">
                    <Copy />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(section.id)} aria-label="Remove" className={styles.removeButton}>
                    <Trash2 />
                  </Button>
                </div>
              </CardHeader>

              {def.fields.length > 0 && (
                <CardContent className={styles.sectionFields}>
                  {def.fields.map((field) => (
                    <SectionField
                      key={field.name}
                      field={field}
                      value={section.data[field.name]}
                      onChange={(v) => update(section.id, field.name, v)}
                    />
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}

        {sections.length === 0 && (
          <Card className={styles.emptyCard}>
            <p className={styles.emptyText}>
              An empty page. Add your first section below.
            </p>
          </Card>
        )}
      </div>

      {/* Add section */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className={styles.addButton}>
            <Plus /> Add a section
          </Button>
        </DialogTrigger>

        <DialogContent className={styles.addDialog}>
          <DialogHeader>
            <DialogTitle>Add a section</DialogTitle>
            <DialogDescription>
              Each one renders with the site&apos;s own type and spacing, so a page built here
              can&apos;t drift away from the rest of the site.
            </DialogDescription>
          </DialogHeader>

          <div className={styles.typeGroups}>
            {SECTION_GROUPS.map((group) => (
              <div key={group}>
                <p className={styles.groupLabel}>
                  {group}
                </p>
                <div className={styles.typeGrid}>
                  {SECTION_TYPES.filter((s) => s.group === group).map((s) => (
                    <button
                      key={s.type}
                      type="button"
                      onClick={() => add(s.type)}
                      className={styles.typeOption}
                    >
                      <span className={styles.typeLabel}>{s.label}</span>
                      <span className={styles.typeDescription}>{s.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {state.message && (
        <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
          {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
          {state.message}
        </p>
      )}

      <div className={styles.saveBar}>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save page"}
        </Button>
        <span className={styles.sectionCount}>
          {sections.length} section{sections.length === 1 ? "" : "s"}
        </span>
        {page?.slug && (
          <Button asChild variant="ghost" size="sm" className={styles.previewButton}>
            <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer">
              <Eye /> Preview <ExternalLink />
            </a>
          </Button>
        )}
      </div>
    </form>
  );
}

/** Controlled inputs, because sections live in state rather than the DOM. */
function SectionField({
  field, value, onChange,
}: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  if (field.type === "list") {
    const text = Array.isArray(value) ? (value as string[]).join("\n") : "";
    return (
      <div className={styles.field}>
        <Label>{field.label}</Label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => onChange(e.target.value.split("\n").filter((l) => l.trim()))}
          className={styles.textarea}
        />
        {field.help && <p className={styles.help}>{field.help}</p>}
      </div>
    );
  }

  if (field.type === "repeater" && field.fields) {
    const rows = (Array.isArray(value) ? value : []) as Record<string, string>[];
    return (
      <div className={styles.repeater}>
        <Label>{field.label}</Label>
        {rows.map((row, i) => (
          <div key={i} className={styles.repeaterRow}>
            <div className={styles.repeaterRowHeader}>
              <span className={styles.repeaterRowLabel}>Item {i + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.removeButton}
                onClick={() => onChange(rows.filter((_, j) => j !== i))}
              >
                <Trash2 />
              </Button>
            </div>
            {field.fields!.map((sub) => (
              <div key={sub.name} className={styles.subField}>
                <Label className={styles.subLabel}>{sub.label}</Label>
                {sub.type === "textarea" ? (
                  <textarea
                    rows={2}
                    value={row[sub.name] ?? ""}
                    onChange={(e) =>
                      onChange(rows.map((r, j) => (j === i ? { ...r, [sub.name]: e.target.value } : r)))
                    }
                    className={styles.textareaCompact}
                  />
                ) : (
                  <Input
                    value={row[sub.name] ?? ""}
                    onChange={(e) =>
                      onChange(rows.map((r, j) => (j === i ? { ...r, [sub.name]: e.target.value } : r)))
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, {}])}>
          <Plus /> Add item
        </Button>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={styles.field}>
        <Label>{field.label}</Label>
        <textarea
          rows={3}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={styles.textarea}
        />
        {field.help && <p className={styles.help}>{field.help}</p>}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <Label>{field.label}</Label>
      <Input
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.help && <p className={styles.help}>{field.help}</p>}
    </div>
  );
}
