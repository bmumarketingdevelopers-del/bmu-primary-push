/**
 * Runs once when the server boots, before any request is handled.
 * Next.js calls this automatically.
 */
export async function register() {
  // Edge runtime has no access to most env vars and no console persistence.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { logPreflight } = await import("@/lib/preflight");
  logPreflight();
}
