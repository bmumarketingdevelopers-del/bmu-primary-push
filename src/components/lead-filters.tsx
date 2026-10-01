"use client";

import * as React from "react";
import { CalendarDays, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "./lead-filters.module.css";

const PRESETS = [
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "ytd", label: "This year", days: 0 },
] as const;

const iso = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Date range plus export. Filtering happens on the client because these lists
 * are small; the export re-applies the same range server-side so a downloaded
 * file always matches what's on screen.
 */
export function LeadFilters({
  onChange,
  statuses = [],
  sources = [],
  count,
  total,
}: {
  onChange: (f: { from: string; to: string; status: string; source: string }) => void;
  statuses?: string[];
  sources?: string[];
  count: number;
  total: number;
}) {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [source, setSource] = React.useState("");
  const [preset, setPreset] = React.useState<string>("");

  React.useEffect(() => {
    onChange({ from, to, status, source });
  }, [from, to, status, source, onChange]);

  function applyPreset(p: (typeof PRESETS)[number]) {
    const now = new Date();
    const start = p.days ? new Date(now.getTime() - p.days * 86_400_000) : new Date(now.getFullYear(), 0, 1);
    setFrom(iso(start));
    setTo(iso(now));
    setPreset(p.key);
  }

  function reset() {
    setFrom(""); setTo(""); setStatus(""); setSource(""); setPreset("");
  }

  const query = new URLSearchParams(
    Object.entries({ from, to, status, source }).filter(([, v]) => v) as [string, string][]
  ).toString();

  const active = Boolean(from || to || status || source);

  return (
    <div className={styles.filters}>
      <div className={styles.presets}>
        <CalendarDays className={styles.presetIcon} />
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p)}
            className={cn(
              styles.preset,
              preset === p.key ? styles.presetActive : styles.presetIdle
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setPreset(""); }}
            className={styles.control}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value); setPreset(""); }}
            className={styles.control}
          />
        </label>

        {statuses.length > 0 && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.control}
            >
              <option value="">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ").toLowerCase()}</option>)}
            </select>
          </label>
        )}

        {sources.length > 0 && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Source</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={styles.control}
            >
              <option value="">All sources</option>
              {sources.map((s) => <option key={s} value={s}>{s.replace("_", " ").toLowerCase()}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.summary}>
          Showing <strong className={styles.count}>{count}</strong> of {total}
          {active && <Badge variant="outline" className={styles.filteredBadge}>Filtered</Badge>}
        </p>

        <div className={styles.actions}>
          {active && (
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              <RotateCcw /> Clear
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <a href={`/api/export/leads${query ? `?${query}` : ""}`}>
              <Download /> Export CSV
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
