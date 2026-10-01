"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QR_ACCOUNTS } from "@/lib/admin-data";
import { formatDate, cn } from "@/lib/utils";
import styles from "./qr-accounts-table.module.css";

type SortKey = "createdAt" | "name" | "scans" | "codes" | "plan";

const PLAN_ORDER = ["Free", "Starter", "Business", "Pro", "Enterprise"];

/** Every tenant, sortable and filterable — the account list the brief asked for. */
export function QrAccountsTable() {
  const [query, setQuery] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [plan, setPlan] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("createdAt");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");

  const countries = [...new Set(QR_ACCOUNTS.map((a) => a.country))].sort();
  const plans = [...new Set(QR_ACCOUNTS.map((a) => a.plan))]
    .sort((a, b) => PLAN_ORDER.indexOf(a) - PLAN_ORDER.indexOf(b));

  const rows = React.useMemo(() => {
    const filtered = QR_ACCOUNTS.filter((a) => {
      if (country && a.country !== country) return false;
      if (plan && a.plan !== plan) return false;
      if (from && a.createdAt < from) return false;
      if (to && a.createdAt > to) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!`${a.name} ${a.slug} ${a.city} ${a.country}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sort === "scans") cmp = a.scans - b.scans;
      else if (sort === "codes") cmp = a.codes - b.codes;
      else if (sort === "name") cmp = a.name.localeCompare(b.name);
      else if (sort === "plan") cmp = PLAN_ORDER.indexOf(a.plan) - PLAN_ORDER.indexOf(b.plan);
      else cmp = a.createdAt.localeCompare(b.createdAt);
      return dir === "asc" ? cmp : -cmp;
    });
  }, [query, country, plan, from, to, sort, dir]);

  function toggle(k: SortKey) {
    if (sort === k) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(k); setDir(k === "name" ? "asc" : "desc"); }
  }

  const SortHead = ({ k, children, className }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => toggle(k)}
        className={cn(styles.sortButton, sort === k && styles.sortButtonActive)}
      >
        {children}
        {sort === k && (dir === "asc" ? <ArrowUp className={styles.sortIcon} /> : <ArrowDown className={styles.sortIcon} />)}
      </button>
    </TableHead>
  );

  return (
    <div className={styles.wrapper}>
      <Card className={styles.filters}>
        <div className={styles.filterGrid}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search accounts by name, slug or city"
              type="search"
              placeholder="Search name, slug or city"
              className={styles.searchInput}
            />
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={styles.select}
          >
            <option value="">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className={styles.select}
          >
            <option value="">All plans</option>
            {plans.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <div className={styles.dateRange}>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Joined from"
              className={styles.dateInput}
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Joined to"
              className={styles.dateInput}
            />
          </div>
        </div>

        <p className={styles.count}>
          Showing <strong className={styles.countValue}>{rows.length}</strong> of {QR_ACCOUNTS.length} accounts
        </p>
      </Card>

      <Card className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead k="name">Business</SortHead>
              <TableHead>Location</TableHead>
              <SortHead k="plan">Plan</SortHead>
              <SortHead k="codes" className={styles.alignRight}>Codes</SortHead>
              <SortHead k="scans" className={styles.alignRight}>Scans</SortHead>
              <SortHead k="createdAt">Joined</SortHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <span className={styles.businessName}>{a.name}</span>
                  <span className={styles.businessSlug}>/b/{a.slug}</span>
                </TableCell>
                <TableCell className={styles.mutedCell}>
                  {a.city}
                  <span className={styles.country}>{a.country}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={a.plan === "Free" ? "outline" : a.plan === "Pro" ? "default" : "secondary"}>
                    {a.plan}
                  </Badge>
                </TableCell>
                <TableCell className={styles.alignRight}>{a.codes}</TableCell>
                <TableCell className={styles.scansCell}>{a.scans.toLocaleString("en-IN")}</TableCell>
                <TableCell className={styles.mutedCell}>{formatDate(a.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={a.isActive ? "success" : "outline"}>{a.isActive ? "Live" : "Dormant"}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className={styles.emptyCell}>
                  No accounts match those filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
