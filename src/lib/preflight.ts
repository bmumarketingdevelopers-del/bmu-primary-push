/**
 * Deployment checks.
 *
 * Runs once at startup. The point is that a misconfigured production deploy
 * announces itself in the logs rather than behaving oddly for a week — a
 * missing RESEND_API_KEY means every booking confirmation silently vanishes,
 * and nobody notices until a customer complains.
 */

type Check = {
  name: string;
  ok: boolean;
  fatal: boolean;
  detail: string;
};

export function runPreflight(): Check[] {
  const prod = process.env.NODE_ENV === "production";
  const checks: Check[] = [];

  const add = (name: string, ok: boolean, fatal: boolean, detail: string) =>
    checks.push({ name, ok, fatal, detail });

  add(
    "DATABASE_URL",
    Boolean(process.env.DATABASE_URL),
    prod,
    "Without it nothing persists — every form validates and discards."
  );

  add(
    "AUTH_SECRET",
    Boolean(process.env.AUTH_SECRET),
    prod,
    "Sessions are signed with a published fallback key otherwise."
  );

  add(
    "NEXT_PUBLIC_APP_URL",
    Boolean(process.env.NEXT_PUBLIC_APP_URL),
    false,
    "QR codes encode this address. Wrong value means printed codes point at localhost."
  );

  add(
    "RESEND_API_KEY",
    Boolean(process.env.RESEND_API_KEY),
    false,
    "Booking confirmations, invoices and reminders are logged instead of sent."
  );

  add(
    "RAZORPAY_KEY_ID",
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    false,
    "Payments run in demo mode — the flow works but no money moves."
  );

  add(
    "R2 storage",
    Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET),
    false,
    "Uploads fall back to pasted URLs; the media library can't accept files."
  );

  // A demo secret in production is the one thing worth shouting about.
  if (prod && process.env.AUTH_SECRET === "dev-only-insecure-secret-change-me") {
    add("AUTH_SECRET is the published default", false, true, "Generate one with `npx auth secret`.");
  }

  return checks;
}

/** Called from instrumentation.ts so it runs once per boot, not per request. */
export function logPreflight() {
  const checks = runPreflight();
  const failed = checks.filter((c) => !c.ok);

  if (failed.length === 0) {
    console.log("[preflight] all integrations configured");
    return;
  }

  const fatal = failed.filter((c) => c.fatal);
  const warn = failed.filter((c) => !c.fatal);

  for (const c of fatal) {
    console.error(`[preflight] MISSING ${c.name} — ${c.detail}`);
  }
  for (const c of warn) {
    console.warn(`[preflight] ${c.name} not set — ${c.detail}`);
  }

  if (fatal.length && process.env.NODE_ENV === "production") {
    console.error(
      `[preflight] ${fatal.length} required setting(s) missing. The app will start but will not work correctly.`
    );
  }
}
