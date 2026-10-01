"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CalendarRange,
  Clock,
  Filter,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Inbox,
  LayoutTemplate,
  ListChecks,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemedSelect, type ThemedOption } from "./themed-select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { signOutAction } from "@/app/actions/auth";
import { updateLeadStatus } from "@/app/admin-portal/actions";
import {
  LEAD_FORM_LABELS,
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  type LeadForm,
  type LeadStatus,
  type WebsiteLead,
} from "@/lib/website-lead-types";
import { cn } from "@/lib/utils";
import styles from "./leads-dashboard.module.css";

type LeadStorage = "database" | "file";

const DAY = 24 * 60 * 60 * 1000;

const RANGES = [
  { id: "all", label: "All time", days: null },
  { id: "today", label: "Today", days: 0 },
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "30", label: "Last 30 days", days: 30 },
] as const;
type RangeId = (typeof RANGES)[number]["id"];

const FORM_TABS: { id: LeadForm; hint: string }[] = [
  { id: "quick", hint: "Short form on the home page: name, phone and what they need." },
  { id: "contact", hint: "Full form on /contact: adds email, company, budget and a message." },
];

const STATUS_ICON: Record<LeadStatus, React.ComponentType<{ className?: string }>> = {
  new: Sparkles,
  follow_up: Clock,
  converted: CheckCircle2,
  rejected: XCircle,
};

const STATUS_HINT: Record<LeadStatus, string> = {
  new: "Not reviewed yet",
  follow_up: "In conversation",
  converted: "Became clients",
  rejected: "Not a fit",
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

function inRange(lead: WebsiteLead, range: RangeId) {
  const r = RANGES.find((x) => x.id === range);
  if (!r || r.days === null) return true;
  const t = new Date(lead.createdAt).getTime();
  return r.days === 0 ? t >= startOfToday() : t >= Date.now() - r.days * DAY;
}

const matches = (l: WebsiteLead, q: string) =>
  !q ||
  [l.name, l.phone, l.email, l.company, l.need, l.budget, l.message]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(q));

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return days < 30 ? `${days} d ago` : formatDate(iso).split(",")[0];
}

const digits = (phone: string) => phone.replace(/\D/g, "");
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/* ------------------------------------------------------------------ status control */

const STATUS_OPTIONS: ThemedOption<LeadStatus>[] = LEAD_STATUSES.map((s) => ({
  value: s,
  label: LEAD_STATUS_LABELS[s],
  dotClassName: styles[`dot_${s}`],
}));

const STATUS_FILTER_OPTIONS: ThemedOption<LeadStatus | "all">[] = [
  { value: "all", label: "All statuses" },
  ...STATUS_OPTIONS,
];

const RANGE_OPTIONS: ThemedOption<RangeId>[] = RANGES.map((r) => ({ value: r.id, label: r.label }));

function StatusSelect({
  value,
  onChange,
  align,
}: {
  value: LeadStatus;
  onChange: (s: LeadStatus) => void;
  align?: "start" | "end";
}) {
  return (
    <ThemedSelect
      value={value}
      options={STATUS_OPTIONS}
      onChange={onChange}
      ariaLabel="Review status"
      align={align}
      triggerClassName={cn(styles.statusTrigger, styles[`status_${value}`])}
    />
  );
}

/* ------------------------------------------------------------------ dashboard */

export function LeadsDashboard({
  leads,
  storage,
  loadError,
  userName,
}: {
  leads: WebsiteLead[];
  storage: LeadStorage;
  loadError: boolean;
  userName: string;
}) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [view, setView] = useState<"leads" | "review">("leads");
  const [tab, setTab] = useState<LeadForm>("quick");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeId>("all");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [reviewForm, setReviewForm] = useState<LeadForm | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Optimistic status changes, shown until the refreshed server data catches up
  const [overrides, setOverrides] = useState<Record<string, LeadStatus>>({});
  const [flash, setFlash] = useState<{ tone: "ok" | "error"; text: string; details?: string[] } | null>(null);

  const items = useMemo(
    () => leads.map((l) => (overrides[l.id] ? { ...l, status: overrides[l.id] } : l)),
    [leads, overrides],
  );
  const selected = items.find((l) => l.id === selectedId) ?? null;

  const byForm = useMemo(
    () => ({ quick: items.filter((l) => l.form === "quick"), contact: items.filter((l) => l.form === "contact") }),
    [items],
  );

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      byForm[tab].filter(
        (l) => inRange(l, range) && (statusFilter === "all" || l.status === statusFilter) && matches(l, q),
      ),
    [byForm, tab, range, statusFilter, q],
  );

  const reviewPool = useMemo(
    () => items.filter((l) => (reviewForm === "all" || l.form === reviewForm) && matches(l, q)),
    [items, reviewForm, q],
  );

  const countBy = (status: LeadStatus, pool = items) => pool.filter((l) => l.status === status).length;
  const todayCount = items.filter((l) => inRange(l, "today")).length;
  const decided = countBy("converted") + countBy("rejected");
  const conversion = decided ? Math.round((countBy("converted") / decided) * 100) : null;
  const firstName = userName.split(/[\s@]/)[0];
  const filtered = q !== "" || range !== "all" || statusFilter !== "all";

  const stats = [
    { label: "Total leads", value: items.length, note: `${todayCount} today`, icon: Users, tone: "ink" },
    { label: "Awaiting review", value: countBy("new"), note: "Status: New", icon: Sparkles, tone: "plain" },
    { label: "Follow up", value: countBy("follow_up"), note: "In conversation", icon: Clock, tone: "amber" },
    {
      label: "Converted",
      value: countBy("converted"),
      note: conversion === null ? "No decisions yet" : `${conversion}% of decided leads`,
      icon: CheckCircle2,
      tone: "green",
    },
  ] as const;

  async function changeStatus(lead: WebsiteLead, status: LeadStatus) {
    if (lead.status === status) return;
    const previous = lead.status;
    setOverrides((o) => ({ ...o, [lead.id]: status }));
    const res = await updateLeadStatus(lead.id, status);
    if (!res.ok) {
      setOverrides((o) => ({ ...o, [lead.id]: previous }));
      setFlash({ tone: "error", text: res.error ?? "Couldn't save the status." });
      return;
    }
    router.refresh();
  }

  return (
    <div className={styles.shell}>
      {/* ---------- top bar ---------- */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <Logo href="/admin-portal" className={styles.logo} />
            <span className={styles.portalTag}>Admin portal</span>
          </div>
          <div className={styles.topActions}>
            <ThemeToggle className={styles.themeToggle} />
            <Link href="/" className={styles.topLink} target="_blank">
              <ExternalLink aria-hidden="true" />
              <span>View website</span>
            </Link>
            <span className={styles.user} title={userName}>
              <span className={styles.avatar} aria-hidden="true">
                {initials(userName) || "A"}
              </span>
              <span className={styles.userName}>{userName}</span>
            </span>
            <form action={signOutAction}>
              <button type="submit" className={styles.signOut}>
                <LogOut aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* ---------- heading ---------- */}
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Website leads</p>
            <h1 className={cn("display", styles.title)}>Welcome back, {firstName}</h1>
            <p className={styles.lede}>Everyone who reached out through the website, and where each one stands.</p>
          </div>
          <div className={styles.headActions}>
            <a href="/api/admin-portal/leads/export" className={styles.excelButton} download>
              <Download aria-hidden="true" />
              Export Excel
            </a>
            <button
              type="button"
              onClick={() => startRefresh(() => router.refresh())}
              disabled={refreshing}
              className={styles.refresh}
              aria-label="Refresh"
            >
              <RefreshCw aria-hidden="true" className={cn(refreshing && styles.spinning)} />
            </button>
          </div>
        </div>

        {flash && (
          <div className={cn(styles.notice, flash.tone === "error" ? styles.noticeError : styles.noticeOk)} role="status">
            <div>
              <p>{flash.text}</p>
              {flash.details && flash.details.length > 0 && (
                <ul className={styles.noticeList}>
                  {flash.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
            <button type="button" onClick={() => setFlash(null)} className={styles.noticeClose} aria-label="Dismiss">
              <X />
            </button>
          </div>
        )}
        {loadError && (
          <p className={cn(styles.notice, styles.noticeError)} role="alert">
            Couldn&apos;t load leads from the database. Check the connection and that the WebsiteLead table exists
            (run <code>npm run db:push</code>).
          </p>
        )}
        {!loadError && storage === "file" && (
          <p className={styles.notice}>
            No database connected — leads are saved to <code>.data/website-leads.json</code> on this machine. Set{" "}
            <code>DATABASE_URL</code> and run <code>npm run db:push</code> before going live.
          </p>
        )}

        {/* ---------- stats ---------- */}
        <section className={styles.stats} aria-label="Summary">
          {stats.map((s) => (
            <div key={s.label} className={cn(styles.stat, styles[`stat_${s.tone}`])}>
              <span className={styles.statIcon} aria-hidden="true">
                <s.icon />
              </span>
              <p className={styles.statLabel}>{s.label}</p>
              <p className={cn("display", styles.statValue)} suppressHydrationWarning>
                {s.value}
              </p>
              <p className={styles.statNote} suppressHydrationWarning>
                {s.note}
              </p>
            </div>
          ))}
        </section>

        {/* ---------- view switch ---------- */}
        <div className={styles.viewSwitch} role="tablist" aria-label="View">
          <button
            type="button"
            role="tab"
            aria-selected={view === "leads"}
            className={cn(styles.viewButton, view === "leads" && styles.viewActive)}
            onClick={() => setView("leads")}
          >
            <FileSpreadsheet aria-hidden="true" /> Leads by form
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "review"}
            className={cn(styles.viewButton, view === "review" && styles.viewActive)}
            onClick={() => setView("review")}
          >
            <ListChecks aria-hidden="true" /> Review
          </button>
        </div>

        {view === "leads" ? (
          <section className={styles.panel}>
            <div className={styles.tabs} role="tablist" aria-label="Lead source">
              {FORM_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={cn(styles.tab, tab === t.id && styles.tabActive)}
                  onClick={() => setTab(t.id)}
                >
                  {t.id === "quick" ? <LayoutTemplate aria-hidden="true" /> : <Mail aria-hidden="true" />}
                  {LEAD_FORM_LABELS[t.id]}
                  <span className={styles.tabCount}>{byForm[t.id].length}</span>
                </button>
              ))}
            </div>

            <div className={styles.toolbar}>
              <p className={styles.tabHint}>{FORM_TABS.find((t) => t.id === tab)!.hint}</p>
              <div className={styles.controls}>
                <label className={styles.search}>
                  <Search aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={tab === "quick" ? "Search name, phone, need…" : "Search name, email, company…"}
                    aria-label="Search leads"
                  />
                </label>
                <ThemedSelect
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={setStatusFilter}
                  ariaLabel="Status"
                  icon={<Filter aria-hidden="true" />}
                />
                <ThemedSelect
                  value={range}
                  options={RANGE_OPTIONS}
                  onChange={setRange}
                  ariaLabel="Date range"
                  align="end"
                  icon={<CalendarRange aria-hidden="true" />}
                />
              </div>
            </div>

            {visible.length === 0 ? (
              <EmptyState
                title={filtered ? "No leads match" : "No leads yet"}
                text={
                  filtered
                    ? "Try a different search, status or date range."
                    : tab === "quick"
                      ? "Submissions from the form on the landing page will appear here."
                      : "Submissions from the contact page form will appear here."
                }
              />
            ) : (
              <>
                {/* Tablet & desktop: table */}
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Lead</th>
                        <th>Phone</th>
                        {tab === "contact" && <th>Company</th>}
                        {tab === "contact" && <th>Budget</th>}
                        <th>Needs</th>
                        <th>Received</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((l) => (
                        <tr key={l.id} onClick={() => setSelectedId(l.id)} className={styles.row}>
                          <td>
                            <div className={styles.leadCell}>
                              <span className={styles.leadAvatar} aria-hidden="true">
                                {initials(l.name)}
                              </span>
                              <div className={styles.leadText}>
                                <button type="button" className={styles.leadName} onClick={() => setSelectedId(l.id)}>
                                  {l.name}
                                </button>
                                {tab === "contact" && l.email && <span className={styles.leadSub}>{l.email}</span>}
                              </div>
                            </div>
                          </td>
                          <td className={styles.nowrap}>
                            <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} className={styles.phone}>
                              {l.phone}
                            </a>
                          </td>
                          {tab === "contact" && <td>{l.company ?? <span className={styles.dim}>—</span>}</td>}
                          {tab === "contact" && (
                            <td className={styles.nowrap}>{l.budget ?? <span className={styles.dim}>—</span>}</td>
                          )}
                          <td>
                            {l.need ? <span className={styles.chip}>{l.need}</span> : <span className={styles.dim}>—</span>}
                          </td>
                          <td className={styles.nowrap}>
                            <span className={styles.when} title={formatDate(l.createdAt)} suppressHydrationWarning>
                              {timeAgo(l.createdAt)}
                            </span>
                          </td>
                          <td>
                            <StatusSelect value={l.status} onChange={(s) => changeStatus(l, s)} align="end" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Phones: cards */}
                <ul className={styles.cards}>
                  {visible.map((l) => (
                    <li key={l.id}>
                      <LeadCard lead={l} onOpen={() => setSelectedId(l.id)} onStatus={(s) => changeStatus(l, s)} />
                    </li>
                  ))}
                </ul>

                <p className={styles.count}>
                  Showing {visible.length} of {byForm[tab].length}
                </p>
              </>
            )}
          </section>
        ) : (
          /* ---------- review board ---------- */
          <section className={styles.review}>
            <div className={styles.reviewBar}>
              <div className={styles.segment} role="group" aria-label="Form">
                {(["all", "quick", "contact"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={reviewForm === f}
                    className={cn(styles.segmentButton, reviewForm === f && styles.segmentActive)}
                    onClick={() => setReviewForm(f)}
                  >
                    {f === "all" ? "Both forms" : f === "quick" ? "Landing page" : "Contact page"}
                  </button>
                ))}
              </div>
              <label className={cn(styles.search, styles.reviewSearch)}>
                <Search aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search leads…"
                  aria-label="Search leads"
                />
              </label>
            </div>

            <div className={styles.board}>
              {LEAD_STATUSES.map((status) => {
                const Icon = STATUS_ICON[status];
                const column = reviewPool.filter((l) => l.status === status);
                return (
                  <div key={status} className={cn(styles.column, styles[`column_${status}`])}>
                    <div className={styles.columnHead}>
                      <span className={styles.columnIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      <div>
                        <p className={styles.columnTitle}>{LEAD_STATUS_LABELS[status]}</p>
                        <p className={styles.columnHint}>{STATUS_HINT[status]}</p>
                      </div>
                      <span className={styles.columnCount}>{column.length}</span>
                    </div>
                    {column.length === 0 ? (
                      <p className={styles.columnEmpty}>No leads here</p>
                    ) : (
                      <ul className={styles.columnList}>
                        {column.map((l) => (
                          <li key={l.id}>
                            <LeadCard
                              lead={l}
                              showForm
                              onOpen={() => setSelectedId(l.id)}
                              onStatus={(s) => changeStatus(l, s)}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ---------- lead detail ---------- */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent side="right" className={styles.sheet}>
          {selected && (
            <>
              <div className={styles.detailHead}>
                <span className={cn(styles.leadAvatar, styles.detailAvatar)} aria-hidden="true">
                  {initials(selected.name)}
                </span>
                <div>
                  <SheetTitle className={styles.detailName}>{selected.name}</SheetTitle>
                  <SheetDescription className={styles.detailSource}>
                    {LEAD_FORM_LABELS[selected.form]} · {formatDate(selected.createdAt)}
                  </SheetDescription>
                </div>
              </div>

              <div className={styles.detailStatus}>
                <p className={styles.detailStatusLabel}>Review status</p>
                <div className={styles.statusButtons} role="group" aria-label="Review status">
                  {LEAD_STATUSES.map((s) => {
                    const Icon = STATUS_ICON[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={selected.status === s}
                        onClick={() => changeStatus(selected, s)}
                        className={cn(styles.statusButton, selected.status === s && styles[`status_${s}`])}
                      >
                        <Icon aria-hidden="true" />
                        {LEAD_STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
                {selected.statusUpdatedAt && (
                  <p className={styles.detailStatusMeta}>Updated {formatDate(selected.statusUpdatedAt)}</p>
                )}
              </div>

              <div className={styles.detailActions}>
                <a href={`tel:${selected.phone}`} className={styles.actionPrimary}>
                  <Phone aria-hidden="true" /> Call
                </a>
                <a
                  href={`https://wa.me/${digits(selected.phone).length === 10 ? "91" : ""}${digits(selected.phone)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.action}
                >
                  <MessageCircle aria-hidden="true" /> WhatsApp
                </a>
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className={styles.action}>
                    <Mail aria-hidden="true" /> Email
                  </a>
                )}
              </div>

              <dl className={styles.details}>
                <DetailRow icon={Phone} label="Phone" value={selected.phone} />
                <DetailRow icon={Mail} label="Email" value={selected.email} />
                <DetailRow icon={Building2} label="Company" value={selected.company} />
                <DetailRow icon={Wallet} label="Monthly budget" value={selected.budget} />
                <DetailRow icon={LayoutTemplate} label="Needs" value={selected.need} />
                <DetailRow icon={ExternalLink} label="Submitted from" value={selected.page} />
                <DetailRow icon={ArrowUpRight} label="Came from" value={selected.referrer} />
              </dl>

              {selected.message && (
                <div className={styles.message}>
                  <p className={styles.messageLabel}>Message</p>
                  <p className={styles.messageText}>{selected.message}</p>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function LeadCard({
  lead,
  showForm,
  onOpen,
  onStatus,
}: {
  lead: WebsiteLead;
  showForm?: boolean;
  onOpen: () => void;
  onStatus: (s: LeadStatus) => void;
}) {
  return (
    <div className={styles.card}>
      <button type="button" className={styles.cardMain} onClick={onOpen}>
        <span className={styles.cardTop}>
          <span className={styles.leadAvatar} aria-hidden="true">
            {initials(lead.name)}
          </span>
          <span className={styles.leadText}>
            <span className={styles.cardName}>{lead.name}</span>
            <span className={styles.leadSub}>{lead.phone}</span>
          </span>
          <span className={styles.when} suppressHydrationWarning>
            {timeAgo(lead.createdAt)}
          </span>
        </span>
        {(showForm || lead.need || lead.company) && (
          <span className={styles.cardMeta}>
            {showForm && (
              <span className={cn(styles.formBadge, lead.form === "contact" && styles.formBadgeContact)}>
                {lead.form === "quick" ? "Landing page" : "Contact page"}
              </span>
            )}
            {lead.need && <span className={styles.chip}>{lead.need}</span>}
            {lead.company && <span className={styles.leadSub}>{lead.company}</span>}
          </span>
        )}
      </button>
      <div className={styles.cardFoot}>
        <StatusSelect value={lead.status} onChange={onStatus} align="end" />
      </div>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon} aria-hidden="true">
        <Inbox />
      </span>
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyText}>{text}</p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className={styles.detailRow}>
      <dt>
        <Icon className={styles.detailIcon} />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
