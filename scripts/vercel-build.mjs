/**
 * Vercel build: `npm run vercel-build` runs instead of `build` on Vercel.
 *
 * When DATABASE_URL is set, the schema is pushed first so tables like
 * WebsiteLead exist on the very first deploy — no manual `prisma db push`.
 * `db push` refuses changes that would drop data, so a risky schema change
 * fails the build instead of silently deleting rows.
 */
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

run("npx prisma generate");

if (process.env.DATABASE_URL) {
  run("npx prisma db push --skip-generate");
} else {
  console.warn("[vercel-build] DATABASE_URL not set — skipping schema push. Leads won't persist without a database.");
}

run("npx next build");
