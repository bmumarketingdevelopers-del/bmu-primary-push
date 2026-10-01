/**
 * Seeds a demo agency workspace: one client, projects, leads, QR codes,
 * invoices and site content. Run with: npm run db:seed
 */
import { PrismaClient, Role, ProjectStatus, LeadStatus, LeadSource, InvoiceStatus, QrType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SERVICES = [
  { name: "Performance Marketing", category: "marketing" },
  { name: "Social Media Marketing", category: "marketing" },
  { name: "UGC Content", category: "content" },
  { name: "Drone Shoots", category: "content" },
  { name: "Website Development", category: "development" },
  { name: "WhatsApp Automation", category: "automation" },
  { name: "Local SEO", category: "seo" },
  { name: "AI Product Photography", category: "ai" },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  console.log("Seeding…");

  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { name: s.name },
      update: {},
      create: { name: s.name, slug: slugify(s.name), category: s.category },
    });
  }

  const client = await prisma.client.upsert({
    where: { slug: "atria-living" },
    update: {},
    create: {
      name: "Atria Living",
      slug: "atria-living",
      industry: "Real Estate",
      city: "Bengaluru",
      contactName: "Rohan Shetty",
      contactEmail: "rohan@atrialiving.in",
      monthlyRetainer: 8_500_000,
    },
  });

  // Passwords match src/lib/demo-users.ts so the login page works either way.
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const manager = await prisma.user.upsert({
    where: { email: "admin@bmu.marketing" },
    update: { name: "BMU", passwordHash: hash("bmu-admin") },
    create: {
      email: "admin@bmu.marketing",
      name: "BMU",
      role: Role.OWNER,
      passwordHash: hash("bmu-admin"),
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@bmu.marketing" },
    update: { passwordHash: hash("bmu-manager") },
    create: {
      email: "manager@bmu.marketing",
      name: "Sana Fernandes",
      role: Role.MANAGER,
      passwordHash: hash("bmu-manager"),
    },
  });

  await prisma.user.upsert({
    where: { email: "client@atrialiving.in" },
    update: { passwordHash: hash("bmu-client"), clientId: client.id },
    create: {
      email: "client@atrialiving.in",
      name: "Rohan Shetty",
      role: Role.CLIENT,
      clientId: client.id,
      passwordHash: hash("bmu-client"),
    },
  });

  const creatorUser = await prisma.user.upsert({
    where: { email: "creator@bmu.marketing" },
    update: { passwordHash: hash("bmu-creator") },
    create: {
      email: "creator@bmu.marketing",
      name: "Nandita Prakash",
      role: Role.CREATOR,
      passwordHash: hash("bmu-creator"),
    },
  });

  await prisma.creator.upsert({
    where: { userId: creatorUser.id },
    update: {},
    create: {
      userId: creatorUser.id,
      handle: "@blrfoodwalk",
      city: "Bengaluru",
      categories: ["Food", "Restaurants", "Cafes"],
      followers: 184000,
      avgViews: 62000,
      rateCard: 3_50_000,
      isVerified: true,
      bio: "Bengaluru food and cafe content. Reels-first, one collab a week.",
    },
  });

  const location = await prisma.location.create({
    data: { clientId: client.id, name: "Whitefield sales lounge", city: "Bengaluru" },
  });

  await prisma.project.createMany({
    data: [
      { clientId: client.id, managerId: manager.id, name: "Tower C launch campaign", status: ProjectStatus.IN_PROGRESS, progress: 68 },
      { clientId: client.id, managerId: manager.id, name: "Sales microsite rebuild", status: ProjectStatus.REVIEW, progress: 91 },
      { clientId: client.id, managerId: manager.id, name: "WhatsApp follow-up automation", status: ProjectStatus.DISCOVERY, progress: 15 },
    ],
  });

  await prisma.lead.createMany({
    data: [
      { clientId: client.id, name: "Priya Raghavan", phone: "+919845011223", source: LeadSource.META_ADS, status: LeadStatus.SITE_VISIT, value: 9_50_00_000 },
      { clientId: client.id, name: "Karthik Menon", phone: "+919900188342", source: LeadSource.GOOGLE_ADS, status: LeadStatus.QUALIFIED, value: 7_20_00_000 },
      { clientId: client.id, name: "Sneha Iyer", phone: "+918088821190", source: LeadSource.QR_SCAN, status: LeadStatus.NEW },
    ],
  });

  await prisma.qrCode.createMany({
    data: [
      { clientId: client.id, locationId: location.id, slug: "atria-brochure", label: "Sales lounge — brochure", type: QrType.CATALOGUE, target: "https://atrialiving.in/brochure", scanCount: 6421 },
      { clientId: client.id, locationId: location.id, slug: "atria-review", label: "Review request card", type: QrType.GOOGLE_REVIEW, target: "https://g.page/r/atria/review", scanCount: 3117 },
    ],
  });

  const invoice = await prisma.invoice.create({
    data: {
      clientId: client.id,
      number: "BMU-2026-0184",
      status: InvoiceStatus.SENT,
      subtotal: 85_00_000,
      total: 1_00_30_000,
      notes: "Growth retainer — August",
    },
  });

  await prisma.invoiceItem.create({
    data: { invoiceId: invoice.id, description: "Growth retainer — August", unitPrice: 85_00_000, amount: 85_00_000 },
  });

  await prisma.testimonial.createMany({
    data: [
      { author: "Rohan S.", role: "Sales Head", company: "Residential developer", quote: "They rebuilt our enquiry flow in the first fortnight.", isFeatured: true },
      { author: "Anita K.", role: "Director", company: "Restaurant group", quote: "The QR dashboard settled an argument we had for two years.", isFeatured: true },
    ],
  });

  // One business owner per industry, matching src/lib/demo-users.ts.
  const { BUSINESS_USERS } = await import("../src/lib/demo-users");

  for (const u of BUSINESS_USERS) {
    const biz = await prisma.business.upsert({
      where: { slug: u.clientId! },
      update: {},
      create: {
        slug: u.clientId!,
        name: u.industry ?? u.name,
        category: "OTHER",
        isPublished: true,
      },
    });

    const owner = await prisma.user.upsert({
      where: { email: u.email },
      update: { passwordHash: hash(u.password) },
      create: {
        email: u.email,
        name: u.name,
        role: Role.BUSINESS,
        passwordHash: hash(u.password),
      },
    });

    await prisma.businessMember.upsert({
      where: { businessId_userId: { businessId: biz.id, userId: owner.id } },
      update: {},
      create: { businessId: biz.id, userId: owner.id, role: "OWNER" },
    });
  }

  console.log(`Seeded ${BUSINESS_USERS.length} industry demo accounts.`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
