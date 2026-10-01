/**
 * Churn detection for QR tenants.
 *
 * The failure this catches is quiet: a standee gets moved behind a plant, or
 * a card goes in a drawer, and scans stop. Nobody complains — they just don't
 * renew nine months later. By then the reason is unrecoverable.
 *
 * Scoring is deliberately weighted toward *recency of use* rather than volume.
 * A small shop scanning twice a week is healthy; a busy restaurant that scanned
 * 4,000 times last quarter and nothing this month is not.
 */

export type HealthSignal = {
  key: string;
  label: string;
  /** Points lost. Higher means more serious. */
  weight: number;
  triggered: boolean;
  /** What to actually do — a flag without an action is just anxiety. */
  action: string;
};

export type TenantHealth = {
  score: number;
  band: "HEALTHY" | "WATCH" | "AT_RISK" | "DORMANT";
  signals: HealthSignal[];
  /** The one thing worth doing first. */
  topAction: string | null;
  daysSinceScan: number;
};

export type HealthInput = {
  daysSinceLastScan: number;
  scansLast30: number;
  scansPrev30: number;
  reviewsLast30: number;
  activeCodes: number;
  profileCompleteness: number;
  unresolvedComplaints: number;
  daysToRenewal: number;
  loggedInLast30: boolean;
};

/**
 * Dormancy is the strongest single signal, so it carries the most weight and
 * is checked at two thresholds — a fortnight is worth a call, a month means
 * the code is almost certainly not where customers are.
 */
export function assessTenant(input: HealthInput): TenantHealth {
  const drop =
    input.scansPrev30 > 0
      ? Math.round(((input.scansLast30 - input.scansPrev30) / input.scansPrev30) * 100)
      : 0;

  const signals: HealthSignal[] = [
    {
      key: "dormant",
      label: `No scans in ${input.daysSinceLastScan} days`,
      weight: 40,
      triggered: input.daysSinceLastScan >= 30,
      action: "Call today. A month of silence usually means the code has been moved or covered.",
    },
    {
      key: "quiet",
      label: `Quiet for ${input.daysSinceLastScan} days`,
      weight: 20,
      triggered: input.daysSinceLastScan >= 14 && input.daysSinceLastScan < 30,
      action: "Check the placement before this becomes a month.",
    },
    {
      key: "falling",
      label: `Scans down ${Math.abs(drop)}% on last month`,
      weight: 15,
      triggered: drop <= -40,
      action: "Ask what changed — new signage, a refit, or a standee that got moved.",
    },
    {
      key: "no-reviews",
      label: "No reviews collected this month",
      weight: 12,
      triggered: input.reviewsLast30 === 0 && input.scansLast30 > 20,
      action: "People are scanning but not reviewing. The ask is happening at the wrong moment.",
    },
    {
      key: "one-code",
      label: "Only one code in use",
      weight: 8,
      triggered: input.activeCodes <= 1,
      action: "A single code is a single point of failure. Add a counter or table placement.",
    },
    {
      key: "incomplete",
      label: `Profile only ${input.profileCompleteness}% complete`,
      weight: 8,
      triggered: input.profileCompleteness < 70,
      action: "Incomplete profiles convert worse — people bounce when what they wanted isn't there.",
    },
    {
      key: "complaints",
      label: `${input.unresolvedComplaints} complaints unanswered`,
      weight: 10,
      triggered: input.unresolvedComplaints > 0,
      action: "These were caught before Google. Left alone, some post publicly anyway.",
    },
    {
      key: "never-logs-in",
      label: "Owner hasn't logged in for a month",
      weight: 10,
      triggered: !input.loggedInLast30,
      action: "Send the numbers to them instead of waiting for them to come and look.",
    },
  ];

  const lost = signals.filter((s) => s.triggered).reduce((t, s) => t + s.weight, 0);
  const score = Math.max(0, 100 - lost);

  /**
   * Bands, not a bare number. "62" means nothing to whoever picks up the
   * phone; "at risk, renewal in 21 days" means something.
   */
  const band: TenantHealth["band"] =
    input.daysSinceLastScan >= 45 ? "DORMANT"
    : score >= 80 ? "HEALTHY"
    : score >= 55 ? "WATCH"
    : "AT_RISK";

  const triggered = signals.filter((s) => s.triggered).sort((a, b) => b.weight - a.weight);

  return {
    score,
    band,
    signals,
    topAction: triggered[0]?.action ?? null,
    daysSinceScan: input.daysSinceLastScan,
  };
}

/**
 * Renewal proximity doesn't change the score — it changes the urgency.
 * A struggling account with eleven months left is a coaching problem; the
 * same account three weeks from renewal is a save-or-lose call this week.
 */
export function urgency(health: TenantHealth, daysToRenewal: number) {
  if (health.band === "HEALTHY") return "none" as const;
  if (daysToRenewal <= 30) return "this-week" as const;
  if (daysToRenewal <= 90) return "this-month" as const;
  return "when-you-can" as const;
}

export const BAND_LABEL: Record<TenantHealth["band"], string> = {
  HEALTHY: "Healthy",
  WATCH: "Watch",
  AT_RISK: "At risk",
  DORMANT: "Dormant",
};
