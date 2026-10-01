import { NextResponse } from "next/server";
import { runPreflight } from "@/lib/preflight";
import { emailConfigured } from "@/lib/email";
import { paymentsConfigured } from "@/lib/payments";
import { storageConfigured } from "@/lib/storage";

export const dynamic = "force-dynamic";

/**
 * Deployment health check. Returns 200 whenever the app can serve traffic —
 * an unconfigured integration is reported, not treated as a failure, because
 * the app degrades gracefully without any of them. Only a configured-but-broken
 * database is a real outage.
 */
export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
    auth: process.env.AUTH_SECRET ? "configured" : "using-dev-fallback",
    email: emailConfigured() ? "configured" : "not-configured",
    payments: paymentsConfigured() ? "configured" : "demo-mode",
    storage: storageConfigured() ? "configured" : "not-configured",
  };

  let healthy = true;

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "ok";
    } catch {
      checks.database = "unreachable";
      healthy = false;
    }
  } else {
    checks.database = "not-configured";
  }

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "1.0.0",
      checks,
      // Anything missing that would make the app behave oddly rather than fail.
      warnings: runPreflight().filter((c) => !c.ok).map((c) => ({
        setting: c.name,
        required: c.fatal,
        impact: c.detail,
      })),
    },
    { status: healthy ? 200 : 503 }
  );
}
