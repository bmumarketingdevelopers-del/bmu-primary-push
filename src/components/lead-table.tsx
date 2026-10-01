"use client";

import * as React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { LeadFilters } from "./lead-filters";
import { LeadDrawer, type TeamOption } from "@/components/admin/lead-drawer";
import { bulkAssign } from "@/app/admin/leads/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, inr, cn } from "@/lib/utils";
import styles from "./lead-table.module.css";

export type LeadLike = {
  id: string;
  name: string;
  phone?: string;
  client?: string;
  message?: string;
  source: string;
  status: string;
  value?: number;
  owner?: string;
  createdAt: string;
};

type SortKey = "createdAt" | "name" | "value" | "status";

/** Filterable, sortable lead table shared by the agency, client and tenant views. */
export function LeadTable({
  leads,
  showClient = false,
  showOwner = false,
  showMessage = false,
  team,
}: {
  leads: LeadLike[];
  showClient?: boolean;
  showOwner?: boolean;
  showMessage?: boolean;
  /** Staff who can own a lead. Omit to hide assignment entirely. */
  team?: TeamOption[];
}) {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState({ from: "", to: "", status: "", source: "" });
  const [sort, setSort] = React.useState<SortKey>("createdAt");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");

  const onChange = React.useCallback((f: typeof filters) => setFilters(f), []);

  const statuses = React.useMemo(() => [...new Set(leads.map((l) => l.status))], [leads]);
  const sources = React.useMemo(() => [...new Set(leads.map((l) => l.source))], [leads]);

  const rows = React.useMemo(() => {
    const filtered = leads.filter((l) => {
      if (filters.from && l.createdAt < filters.from) return false;
      if (filters.to && l.createdAt > filters.to) return false;
      if (filters.status && l.status !== filters.status) return false;
      if (filters.source && l.source !== filters.source) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sort === "value") cmp = (a.value ?? 0) - (b.value ?? 0);
      else if (sort === "name") cmp = a.name.localeCompare(b.name);
      else if (sort === "status") cmp = a.status.localeCompare(b.status);
      else cmp = a.createdAt.localeCompare(b.createdAt);
      return dir === "asc" ? cmp : -cmp;
    });
  }, [leads, filters, sort, dir]);

  function toggle(key: SortKey) {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(key); setDir(key === "name" ? "asc" : "desc"); }
  }

  const SortHead = ({ k, children, className }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => toggle(k)}
        className={cn(styles.sortButton, sort === k && styles.sortActive)}
      >
        {children}
        {sort === k && (dir === "asc" ? <ArrowUp className={styles.sortIcon} /> : <ArrowDown className={styles.sortIcon} />)}
      </button>
    </TableHead>
  );

  return (
    <div className={styles.root}>
      <LeadFilters
        onChange={onChange}
        statuses={statuses}
        sources={sources}
        count={rows.length}
        total={leads.length}
      />

      {team && team.length > 0 && picked.length > 0 && (
        <form
          action={bulkAssign}
          className={styles.bulkBar}
        >
          <input type="hidden" name="ids" value={picked.join(",")} />
          <span className={styles.bulkCount}>
            {picked.length} selected
          </span>
          <select
            name="assignee"
            required
            className={styles.bulkSelect}
          >
            <option value="">Assign to…</option>
            {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <Button type="submit" size="sm">Assign</Button>
          <button
            type="button"
            onClick={() => setPicked([])}
            className={styles.clearSelection}
          >
            Clear selection
          </button>
        </form>
      )}

      <Card className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              {team && (
                <TableHead className={styles.checkHead}>
                  <input
                    type="checkbox"
                    aria-label="Select all shown"
                    checked={picked.length > 0 && picked.length === rows.length}
                    onChange={(e) => setPicked(e.target.checked ? rows.map((r) => r.id) : [])}
                    className={styles.checkbox}
                  />
                </TableHead>
              )}
              <SortHead k="name">Lead</SortHead>
              {showClient && <TableHead>Client</TableHead>}
              <TableHead>Phone</TableHead>
              {showMessage && <TableHead>What they asked</TableHead>}
              <TableHead>Source</TableHead>
              <SortHead k="status">Status</SortHead>
              <SortHead k="value" className={styles.valueHead}>Deal value</SortHead>
              {showOwner && <TableHead>Owner</TableHead>}
              <SortHead k="createdAt">Received</SortHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((l) => (
              <TableRow key={l.id}>
                {team && (
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select ${l.name}`}
                      checked={picked.includes(l.id)}
                      onChange={(e) =>
                        setPicked((p) => (e.target.checked ? [...p, l.id] : p.filter((x) => x !== l.id)))
                      }
                      className={styles.checkbox}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <span className={styles.leadName}>{l.name}</span>
                  <span className={styles.leadId}>{l.id}</span>
                </TableCell>
                {showClient && <TableCell><Badge variant="outline">{l.client}</Badge></TableCell>}
                <TableCell className={styles.metaCell}>{l.phone ?? "—"}</TableCell>
                {showMessage && <TableCell className={styles.messageCell}>{l.message ?? "—"}</TableCell>}
                <TableCell className={styles.metaCell}>
                  {l.source.replace("_", " ")}
                </TableCell>
                <TableCell><StatusBadge status={l.status} /></TableCell>
                <TableCell className={styles.valueCell}>
                  {l.value ? inr(l.value) : "—"}
                </TableCell>
                {showOwner && (
                  <TableCell className={styles.ownerCell}>
                    {l.owner === "Unassigned"
                      ? <Badge variant="warning">Unassigned</Badge>
                      : <span className={styles.ownerName}>{l.owner}</span>}
                  </TableCell>
                )}
                <TableCell className={styles.metaCell}>
                  {formatDate(l.createdAt)}
                </TableCell>
                {team && (
                  <TableCell className={styles.drawerCell}>
                    <LeadDrawer lead={l} team={team} />
                  </TableCell>
                )}
              </TableRow>
            ))}

            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className={styles.emptyCell}>
                  No leads in that range. Widen the dates or clear the filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
