/**
 * Demo accounts so the app is usable before a database exists.
 *
 * Used only when DATABASE_URL is unset or the users table can't be reached.
 * Once you run `npm run db:seed`, real rows take over and these are ignored.
 * Delete this file before production.
 */
import type { AppRole } from "./roles";
import { INDUSTRY_SETUPS } from "./industry-setup";
import { DEMO_INDUSTRY_BUSINESSES } from "./demo-businesses";

export type DemoUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: AppRole;
  /** For BUSINESS users this is the tenant slug they own. */
  clientId: string | null;
  /** Grouping for the login picker. */
  group: "Agency" | "Client" | "Creator" | "Business";
  industry?: string;
};

/** Agency staff, one client and one creator. */
export const CORE_USERS: DemoUser[] = [
  { id: "demo-owner", email: "admin@bmu.marketing", name: "BMU", password: "bmu-admin", role: "OWNER", clientId: null, group: "Agency" },
  { id: "demo-manager", email: "manager@bmu.marketing", name: "Sana Fernandes", password: "bmu-manager", role: "MANAGER", clientId: null, group: "Agency" },
  { id: "demo-creator", email: "creator@bmu.marketing", name: "Nandita Prakash", password: "bmu-creator", role: "CREATOR", clientId: null, group: "Creator" },
  { id: "demo-client", email: "client@atrialiving.in", name: "Rohan Shetty", password: "bmu-client", role: "CLIENT", clientId: "C-014", group: "Client" },
];

/** Owner names per industry, so the dashboard greeting isn't generic. */
const OWNER_NAMES: Record<string, string> = {
  "real-estate": "Rohan Shetty", builders: "Girish Kamath", architects: "Aditya Kulkarni",
  "interior-designers": "Anvi Menon", restaurants: "Imran Sheikh", cafes: "Nikhil Rao",
  hotels: "Priya Raghavan", resorts: "Kiran Shetty", travel: "Deepa Suresh",
  hospitals: "Dr. Verma", clinics: "Dr. Sneha Iyer", doctors: "Dr. Anjali Rao",
  schools: "Lakshmi Prasad", colleges: "Ramesh Hegde", education: "Vikram Desai",
  gyms: "Arjun Bhat", "fitness-centers": "Rhea D'Souza", salons: "Meena Rao",
  "beauty-brands": "Ishita Reddy", jewellery: "Kanaka Devi", retail: "Suresh Babu",
  ecommerce: "Meera Varma", automobile: "Sameer Ali", finance: "Nithya Krishnan",
  manufacturing: "Prakash Jain", ngos: "Fatima Sheikh", startups: "Karthik Menon",
};

/**
 * One business owner per industry, generated from the setups so a new
 * industry gets a working login automatically.
 * Password is the same for all of them — these are demo accounts, and 27
 * different passwords would just mean 27 things to look up.
 */
export const BUSINESS_USERS: DemoUser[] = INDUSTRY_SETUPS.map((setup) => {
  const business = DEMO_INDUSTRY_BUSINESSES.find((b) => b.slug === setup.slug);
  return {
    id: `demo-biz-${setup.slug}`,
    email: `owner@${setup.slug}.demo`,
    name: OWNER_NAMES[setup.slug] ?? `${setup.name} owner`,
    password: "bmu-demo",
    role: "BUSINESS" as AppRole,
    clientId: setup.slug,
    group: "Business" as const,
    industry: business?.name ?? setup.name,
  };
});

/** Kept so the credentials printed in earlier docs still work. */
const LEGACY_ALIASES: DemoUser[] = [
  { id: "demo-biz-salons", email: "owner@abcsalon.in", name: "Meena Rao", password: "bmu-business", role: "BUSINESS", clientId: "salons", group: "Business", industry: "ABC Salon" },
];

export const DEMO_USERS: DemoUser[] = [...CORE_USERS, ...BUSINESS_USERS, ...LEGACY_ALIASES];

/**
 * Whether to offer the demo accounts on the login screen.
 *
 * Shown in development regardless of whether a database is connected — the
 * seed creates these same accounts with these same passwords, so hiding the
 * list once Postgres arrives just means hunting for credentials. Never shown
 * in production, where these accounts should not exist at all.
 */
export const isDemoMode = () => process.env.NODE_ENV !== "production";
