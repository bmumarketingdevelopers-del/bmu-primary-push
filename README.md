# BMU.Marketing

A digital marketing agency site and a multi-tenant QR/NFC business platform in
one Next.js application.

**86 pages · 85 Prisma models · six role surfaces**

---

## Getting it running

You need Node 20+ and a PostgreSQL database. [Neon](https://neon.tech) or
[Supabase](https://supabase.com) both give you one free in about two minutes.

```bash
npm install
cp .env.example .env
```

Open `.env` and set two values:

```
DATABASE_URL="postgresql://…?sslmode=require"
AUTH_SECRET="…"
```

Generate the secret with `npx auth secret`. Everything else in `.env` is
optional — the app degrades gracefully without it and tells you what's missing
at startup.

```bash
npx prisma db push     # creates the tables
npm run db:seed        # demo agency, clients, 27 QR tenants
npm run dev
```

Open http://localhost:3000

### Signing in

| Email | Password | Lands on |
|---|---|---|
| `admin@bmu.marketing` | `bmu-admin` | `/admin` |
| `manager@bmu.marketing` | `bmu-manager` | `/admin` |
| `client@atrialiving.in` | `bmu-client` | `/dashboard` |
| `creator@bmu.marketing` | `bmu-creator` | `/creators` |

Plus one business owner per industry — `owner@salons.demo`,
`owner@restaurants.demo`, `owner@doctors.demo` and so on for all 27 slugs in
`src/lib/industry-setup.ts`. All use the password **`bmu-demo`**.

The login screen lists them with a search box. It appears in development only.

---

## What's in here

### Public site
Marketing pages for 8 services, 5 products and 27 industries, plus portfolio,
case studies, pricing, blog, a hardware store with checkout, and a partner
programme page.

### Review collection — and why it isn't gated

Every customer sees the public Google link, whatever they say about their
visit. Sentiment decides what we *offer* — happy customers get drafted text
they can edit, unhappy ones get a private feedback form — but it never decides
who is allowed to post publicly.

That distinction is the whole thing. Routing only positive customers to Google
is review gating; it breaches Google's policy, and enforcement can strip every
review from a listing. On a platform serving hundreds of client listings, one
penalty would be unrecoverable. Asking everyone and collecting private
feedback alongside is the version that's both safe and effective.

### Smart QR platform
Every business gets a public profile at `/b/{slug}` with a fully customisable
appearance — 15 colour schemes with unrestricted colour pickers, 16 fonts,
10 layouts, 7 button styles and 6 motion presets, all editable from the tenant
dashboard with a live phone preview.

Also: dynamic QR codes at `/q/{slug}` that can be repointed without reprinting,
a sentiment-routed review flow at `/r/{slug}`, table-QR menus with ordering,
and an appointment booking engine.

### Augmented reality

Printed artwork becomes a video surface. A customer points their phone camera
at a flyer, card or menu at `/ar/{slug}` and content plays locked to the print,
tracking as they move — no app install.

Engine is MindAR: open source, browser-based, no per-view licence fee. The
paid alternatives track better on difficult artwork but charge per scan, which
doesn't survive a ₹1,499 subscription. It loads from a CDN on that route only,
so the smart profile stays light.

**Two things decide whether it works**, and both are settled before printing:
the artwork needs distinctive detail — photographs and texture track well,
flat colour and repeating patterns don't — and a compiled tracking target has
to be generated from the artwork. Uploading the image alone gives the camera
nothing to recognise.

### Four dashboards
- **`/admin`** — 20 sections: clients, projects, leads, invoices, approvals,
  QR businesses, industry setups, store, partners, media, blog, team, access
  control, website editor and page builder
- **`/dashboard`** — client view: projects, leads, QR analytics, approvals,
  invoices, reports, support
- **`/business`** — QR tenant: profile, appearance, QR codes, reviews, leads,
  customers, offers, loyalty, menu, orders, bookings, staff, locations, AI
  assistant, billing
- **`/creators`** — creator portal: briefs, bookings, payouts, profile

---

## How things work

### The repository layer
Pages don't import demo data directly. They call a repository in
`src/lib/repos/`, which tries Postgres and falls back to demo data:

```ts
const { data: CLIENTS, source } = await getClients();
```

`src/lib/repos/db.ts` decides. If `DATABASE_URL` is unset, Postgres is
unreachable, **or the table is empty on a fresh install**, the demo set is
returned. That last case matters — a newly pushed schema has no rows, and a
dashboard of zeroes looks broken rather than new.

Converted pages show a **Live data** or **Demo data** badge, so a page reading
demo data never looks identical to one reading production.

Lists are capped at 500 rows (`LIST_LIMIT`) and the larger admin tables
paginate at 25 via `?page=`. Summary figures still compute across the full set
— an ageing panel that silently meant "on this page" would be worse than none.

### The CMS
Three layers, all editable at `/admin/website`:

- **Blocks** — one-off sections like the hero, footer, navigation and theme
- **Collections** — repeatable content: services, products, industries,
  portfolio, case studies, articles, store products, team
- **Page builder** — build entirely new pages at `/p/{slug}` from 13 section
  types. Optionally add them to the site menu.

Everything falls back to a built-in default until you save over it, so a bad
edit or an empty database never produces a blank page.

### Industry setups
`src/lib/industry-setup.ts` defines what each of the 27 industries gets on
day one: which profile buttons lead, which of 16 modules turn on, the four
dashboard KPIs, the plan required and the hardware kit. Editable at
`/admin/industries`.

A salon has no Menu in its sidebar; a restaurant has no Locations at Starter.
Showing every module to everyone is what makes a product feel bloated.

---

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run typecheck    # tsc, no emit
npm run check        # typecheck + lint
npm run db:push      # sync schema without a migration
npm run db:migrate   # create a migration
npm run db:seed      # demo data
npm run db:studio    # browse the database
npm run test         # unit tests
npm run test:watch   # tests, re-running on change
```

Tests cover the logic where a silent bug costs money: GST across the three
different conventions, shipping thresholds, and appointment slot generation
including buffer overlap and double-booking. Run `npm install` first — vitest
is a new dependency.

---

## Tenant isolation

`src/lib/tenant-scope.ts` is how one client is kept out of another's data.

```ts
const tenant = await requireTenant();
prisma.lead.findMany({ where: scoped(tenant) });
```

`scoped()` only accepts a `TenantContext`, and the only way to get one is
`requireTenant()`, which resolves the signed-in user's own business — or, for
agency staff, the account they're supporting. So forgetting to scope a query
is a type error rather than a silent leak.

For lookups by a user-supplied id, `assertOwned(row, tenant)` checks the row
actually belongs to them before it's returned or written. A row fetched by id
alone is not yet proven to be theirs.

## Before going live

**Required:**

- [ ] `AUTH_SECRET` set — production throws at boot without it
- [ ] `NEXT_PUBLIC_APP_URL` set to your real domain — **QR codes encode this
      address**, so getting it wrong means printing codes that point at
      localhost
- [ ] Delete `src/lib/demo-users.ts` and its branch in `src/auth.ts`

Demo accounts are already blocked in production by a `NODE_ENV` guard, but
deleting the file removes the possibility entirely.

**Worth doing:**

- [ ] Set `AGENCY_GSTIN` and `AGENCY_STATE_CODE` in your environment — the
      exports default to a Karnataka placeholder
- [ ] Record each client's GSTIN. Place of supply and the CGST/SGST vs IGST
      split are derived from it; a client with none is billed as intra-state
- [ ] Still worth an accountant's eye on the first GSTR-1, but inter-state
      is now handled rather than assumed away
- [ ] Move rate limiting to Redis before running more than one instance —
      it's in-memory, so each instance enforces its own allowance
- [ ] Add a Content-Security-Policy once you can test Razorpay checkout
      against it (deliberately absent; an untested CSP breaks payments)
- [ ] Replace placeholder content in `src/lib/content.ts` — the client names,
      statistics and testimonials are invented

`/api/health` reports every integration's state and lists anything unset with
its actual consequence. The same checks log once at startup via
`src/lib/preflight.ts`.

---

## Deployment

**Vercel** — push to GitHub, import, add the environment variables, then run
`DATABASE_URL=… npx prisma db push` once against production.

**Docker** — `docker compose up --build`. Postgres and the app, port 3000,
with a healthcheck at `/api/health`.

---

## Known gaps

Honest list of what isn't built:

- **Marketing analytics** — campaign tracking, SEO rankings and the social
  scheduler were removed at the client's request
- **Public API** — internal routes work; no API keys, docs or rate tiers
- **Mobile OTP login** — email and password only
- **Cashfree and Stripe** — Razorpay only
- **Report PDFs** and **integration setup** — buttons are visibly disabled
  with a tooltip rather than silently doing nothing
#   P r o j e c t - m a i n 1 - i n t e r n  
 