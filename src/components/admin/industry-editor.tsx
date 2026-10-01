"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveIndustrySetup, resetIndustry, type IndustryState } from "@/app/admin/industries/actions";
import { KPI_LIBRARY, MODULE_LABEL, type IndustrySetup, type KpiKey, type ModuleKey } from "@/lib/industry-setup";
import { CATEGORY_VOICE } from "@/lib/review-suggestions";
import { cn } from "@/lib/utils";
import styles from "./industry-editor.module.css";

const initial: IndustryState = { ok: false, message: null };
const ALL_MODULES = Object.keys(MODULE_LABEL) as ModuleKey[];
const ALL_KPIS = Object.keys(KPI_LIBRARY) as KpiKey[];

export function IndustryEditor({
  setup,
  slug,
  customised,
}: {
  setup: IndustrySetup | null;
  slug: string;
  customised: boolean;
}) {
  const isNew = slug === "new";
  const [modules, setModules] = React.useState<ModuleKey[]>(setup?.modules ?? ["profile", "review", "whatsapp"]);
  const [kpis, setKpis] = React.useState<KpiKey[]>(setup?.kpis ?? ["views", "reviews", "whatsapp", "leads"]);
  const [state, action, pending] = React.useActionState(saveIndustrySetup, initial);

  const toggleModule = (m: ModuleKey) =>
    setModules((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  /** Exactly four, and the oldest drops off — a fifth card doesn't fit the row. */
  const toggleKpi = (k: KpiKey) =>
    setKpis((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev.slice(-3), k]));

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="slug" value={slug} />
      {modules.map((m) => <input key={m} type="hidden" name={`mod.${m}`} value="on" />)}
      {kpis.map((k) => <input key={k} type="hidden" name={`kpi.${k}`} value="on" />)}

      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
          <CardDescription>
            The category decides the review vocabulary and the default profile template.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.basicsGrid}>
          <div className={styles.field}>
            <Label htmlFor="name">Industry name</Label>
            <Input id="name" name="name" required defaultValue={setup?.name} placeholder="Pet clinics" />
          </div>

          <div className={styles.field}>
            <Label htmlFor="category">Review voice</Label>
            <select
              id="category"
              name="category"
              defaultValue={setup?.category ?? "OTHER"}
              className={styles.select}
            >
              {Object.entries(CATEGORY_VOICE).map(([key, v]) => (
                <option key={key} value={key}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <Label htmlFor="plan">Plan required</Label>
            <select
              id="plan"
              name="plan"
              defaultValue={setup?.plan ?? "BUSINESS"}
              className={styles.select}
            >
              <option value="STARTER">Starter</option>
              <option value="BUSINESS">Business</option>
              <option value="PRO">Pro</option>
            </select>
          </div>

          <div className={styles.field}>
            <Label htmlFor="primaryGoal">What are they trying to increase?</Label>
            <Input id="primaryGoal" name="primaryGoal" required defaultValue={setup?.primaryGoal} placeholder="Appointments booked" />
          </div>

          <div className={cn(styles.field, styles.fieldWide)}>
            <Label htmlFor="heroMetric">Headline metric</Label>
            <Input id="heroMetric" name="heroMetric" required defaultValue={setup?.heroMetric} placeholder="Appointments this month" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile buttons</CardTitle>
          <CardDescription>
            One per line, in order. The first four become the big tiles on the scan page — anything
            after that drops into the secondary list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            name="primaryActions"
            rows={5}
            defaultValue={(setup?.primaryActions ?? []).join("\n")}
            placeholder={"Book appointment\nWhatsApp\nCall\nDirections"}
            className={styles.textarea}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
          <CardDescription>
            What turns on at onboarding. Everything unticked stays hidden from their sidebar —
            that&apos;s what stops the dashboard feeling generic.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.moduleGrid}>
          {ALL_MODULES.map((m) => {
            const on = modules.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggleModule(m)}
                className={cn(styles.moduleOption, on ? styles.moduleOptionOn : styles.moduleOptionOff)}
              >
                {MODULE_LABEL[m]}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className={styles.kpiHeader}>
            <div>
              <CardTitle>Dashboard cards</CardTitle>
              <CardDescription>
                Exactly four, in the order you pick them. Choosing a fifth drops the oldest.
              </CardDescription>
            </div>
            <Badge variant={kpis.length === 4 ? "success" : "warning"}>{kpis.length} of 4</Badge>
          </div>
        </CardHeader>
        <CardContent className={styles.kpiBody}>
          <div className={styles.kpiOrder}>
            {kpis.map((k, i) => (
              <Badge key={k} variant="solid">{i + 1}. {KPI_LIBRARY[k].label}</Badge>
            ))}
          </div>

          <div className={styles.kpiGrid}>
            {ALL_KPIS.map((k) => {
              const on = kpis.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleKpi(k)}
                  className={cn(styles.kpiOption, on ? styles.kpiOptionOn : styles.kpiOptionOff)}
                >
                  <span className={styles.kpiLabel}>{KPI_LIBRARY[k].label}</span>
                  <span className={styles.kpiSub}>{KPI_LIBRARY[k].sub}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hardware kit</CardTitle>
          <CardDescription>What usually ships on the first order. One per line.</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            name="kit"
            rows={4}
            defaultValue={(setup?.kit ?? []).join("\n")}
            placeholder={"Reception standee\nNFC cards\nWindow stickers"}
            className={styles.textarea}
          />
        </CardContent>
      </Card>

      {state.message && (
        <p className={cn(styles.result, state.ok ? styles.resultOk : styles.resultError)}>
          {state.ok ? <CheckCircle2 className={styles.resultIcon} /> : <AlertCircle className={styles.resultIcon} />}
          {state.message}
        </p>
      )}

      <div className={styles.saveBar}>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isNew ? "Create industry" : "Save changes"}
        </Button>

        {customised && !isNew && (
          <Button type="submit" formAction={resetIndustry} variant="outline" size="sm">
            <RotateCcw /> Reset to shipped default
          </Button>
        )}
      </div>
    </form>
  );
}
