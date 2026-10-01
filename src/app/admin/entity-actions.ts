"use server";

import { revalidatePath } from "next/cache";
import { requireStaff, requireUser } from "@/lib/session";
import { decodeFields } from "@/lib/form-decode";
import { entityByKey } from "@/lib/entities/registry";

export type EntityState = { ok: boolean; message: string | null; id?: string };

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

const rupeesToPaise = (v: unknown) =>
  v === null || v === undefined || v === "" ? null : Math.round(Number(v) * 100);

const yes = (v: unknown) => String(v ?? "").toLowerCase().startsWith("y");

/**
 * Shapes decoded form data into what each Prisma model expects.
 *
 * Kept in one place because the money and boolean conversions are exactly
 * where per-entity code drifts — one form storing rupees and another storing
 * paise is a bug you find in an invoice.
 */
async function toPrismaData(key: string, data: Record<string, unknown>) {
  switch (key) {
    case "client":
      return {
        name: String(data.name),
        slug: slugify(String(data.slug || data.name)),
        industry: String(data.industry || "Other"),
        city: String(data.city || "") || null,
        website: String(data.website || "") || null,
        contactName: String(data.contactName || "") || null,
        contactEmail: String(data.contactEmail || "") || null,
        contactPhone: String(data.contactPhone || "") || null,
        gstin: String(data.gstin || "") || null,
        monthlyRetainer: rupeesToPaise(data.monthlyRetainer),
      };

    case "project":
      return {
        name: String(data.name),
        clientId: String(data.clientId),
        description: String(data.description || "") || null,
        status: (String(data.status || "DISCOVERY").toUpperCase()) as never,
        progress: Number(data.progress || 0),
        budget: rupeesToPaise(data.budget),
        startDate: data.startDate ? new Date(String(data.startDate)) : null,
        dueDate: data.dueDate ? new Date(String(data.dueDate)) : null,
      };

    case "campaign":
      return {
        name: String(data.name),
        clientId: String(data.clientId),
        platform: String(data.platform || "meta"),
        status: (String(data.status || "DRAFT").toUpperCase()) as never,
        budget: rupeesToPaise(data.budget),
        spend: rupeesToPaise(data.spend) ?? 0,
        startDate: data.startDate ? new Date(String(data.startDate)) : null,
        endDate: data.endDate ? new Date(String(data.endDate)) : null,
      };

    case "invoice": {
      const subtotal = rupeesToPaise(data.subtotal) ?? 0;
      const taxRate = Number(data.taxRate || 18);
      return {
        number: String(data.number),
        clientId: String(data.clientId),
        status: (String(data.status || "DRAFT").toUpperCase()) as never,
        subtotal,
        taxRate,
        // Total is derived — never trust a total typed by hand.
        total: Math.round(subtotal * (1 + taxRate / 100)),
        dueAt: data.dueAt ? new Date(String(data.dueAt)) : null,
        notes: String(data.notes || data.description || "") || null,
      };
    }

    case "partner":
      return {
        name: String(data.name),
        slug: slugify(String(data.slug || data.name)),
        type: (String(data.type || "AGENCY").toUpperCase()) as never,
        contactName: String(data.contactName || "") || null,
        contactEmail: String(data.contactEmail || "") || null,
        contactPhone: String(data.contactPhone || "") || null,
        city: String(data.city || "") || null,
        brandName: String(data.brandName || "") || null,
        customDomain: String(data.customDomain || "") || null,
        primaryColor: String(data.primaryColor || "#8BB72C"),
        commissionPct: Number(data.commissionPct || 20),
        wholesaleDiscountPct: Number(data.wholesaleDiscountPct || 30),
        hideBmuBranding: yes(data.hideBmuBranding),
      };

    case "storeProduct":
      return {
        name: String(data.name),
        slug: slugify(String(data.slug || data.name)),
        category: String(data.category || "CARD").toUpperCase(),
        tech: String(data.tech || "QR").toUpperCase(),
        description: String(data.description || "") || null,
        price: rupeesToPaise(data.price) ?? 0,
        compareAt: rupeesToPaise(data.compareAt),
        features: (data.features as string[]) ?? [],
      };

    case "post":
      return {
        title: String(data.title),
        slug: slugify(String(data.slug || data.title)),
        excerpt: String(data.excerpt || "") || null,
        body: String(data.body || ""),
        tags: (data.tags as string[]) ?? [],
        isPublished: yes(data.isPublished),
        publishedAt: yes(data.isPublished) ? new Date() : null,
      };

    case "business": {
      const { extractPlaceId } = await import("@/lib/google-review");
      const maps = String(data.gbpMapsUrl || "");
      return {
        name: String(data.name),
        slug: slugify(String(data.slug || data.name)),
        category: (String(data.category || "OTHER").toUpperCase()) as never,
        tagline: String(data.tagline || "") || null,
        about: String(data.about || "") || null,
        phone: String(data.phone || "") || null,
        whatsapp: String(data.whatsapp || "") || null,
        email: String(data.email || "") || null,
        address: String(data.address || "") || null,
        city: String(data.city || "") || null,
        gbpMapsUrl: maps || null,
        gbpPlaceId: maps ? extractPlaceId(maps) : null,
      };
    }

    case "creator":
      return {
        handle: String(data.handle),
        city: String(data.city || "") || null,
        categories: (data.categories as string[]) ?? [],
        followers: Number(data.followers || 0),
        avgViews: Number(data.avgViews || 0),
        rateCard: rupeesToPaise(data.rateCard),
        bio: String(data.bio || "") || null,
        isVerified: yes(data.isVerified),
      };

    default:
      return data;
  }
}

/** Entities a tenant owns and may create for themselves. */
const TENANT_ENTITIES = new Set([
  "offer", "loyaltyReward", "menuItem", "outlet", "qrCampaign", "profileService",
  "staffCode", "arExperience",
]);

export async function saveEntity(_prev: EntityState, formData: FormData): Promise<EntityState> {
  const requestedKey = String(formData.get("__entity") ?? "");

  // A business owner can manage their own menu and offers, but nothing agency-side.
  const user = TENANT_ENTITIES.has(requestedKey)
    ? await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER", "STAFF"])
    : await requireStaff();

  const key = requestedKey;
  const id = String(formData.get("__id") ?? "");
  const def = entityByKey(key);
  if (!def) return { ok: false, message: "Unknown record type." };

  const decoded = decodeFields(def.fields, formData);

  const titleValue = decoded[def.titleField];
  if (!titleValue || String(titleValue).trim().length < 2) {
    return { ok: false, message: `${def.singular} needs a ${def.titleField}.` };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated. ${def.singular} "${titleValue}" wasn't stored — no DATABASE_URL is configured.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const data = await toPrismaData(key, decoded);
    const model = (prisma as unknown as Record<string, {
      create: (a: unknown) => Promise<{ id: string }>;
      update: (a: unknown) => Promise<{ id: string }>;
    }>)[def.model!];

    const record = id
      ? await model.update({ where: { id }, data })
      : await model.create({ data });

    // Creators and businesses need a login alongside the record.
    if (key === "creator" && !id && decoded.email) {
      await prisma.user.upsert({
        where: { email: String(decoded.email).toLowerCase() },
        update: { name: String(decoded.name || decoded.handle) },
        create: {
          email: String(decoded.email).toLowerCase(),
          name: String(decoded.name || decoded.handle),
          role: "CREATOR",
        },
      });
    }

    if (key === "business" && !id && decoded.ownerEmail) {
      const owner = await prisma.user.upsert({
        where: { email: String(decoded.ownerEmail).toLowerCase() },
        update: { name: String(decoded.ownerName || "Owner") },
        create: {
          email: String(decoded.ownerEmail).toLowerCase(),
          name: String(decoded.ownerName || "Owner"),
          role: "BUSINESS",
        },
      });
      await prisma.businessMember.create({
        data: { businessId: record.id, userId: owner.id, role: "OWNER" },
      });
    }

    for (const path of def.revalidate) revalidatePath(path);

    return {
      ok: true,
      id: record.id,
      message: id ? `${def.singular} updated.` : `${def.singular} created.`,
    };
  } catch (err) {
    console.error(`[entity] ${key} save failed:`, err);
    const message = err instanceof Error && err.message.includes("Unique")
      ? "Something with that name or slug already exists."
      : "Couldn't save that. Check the server logs.";
    return { ok: false, message };
  }
}

export async function deleteEntity(formData: FormData) {
  await requireStaff();

  const key = String(formData.get("__entity") ?? "");
  const id = String(formData.get("__id") ?? "");
  const def = entityByKey(key);
  if (!def?.model || !id || !process.env.DATABASE_URL) return;

  try {
    const { prisma } = await import("@/lib/prisma");
    const model = (prisma as unknown as Record<string, { delete: (a: unknown) => Promise<unknown> }>)[def.model];
    await model.delete({ where: { id } });
    for (const path of def.revalidate) revalidatePath(path);
  } catch (err) {
    console.error(`[entity] ${key} delete failed:`, err);
  }
}

/**
 * Flips a boolean column — publish, activate, hide.
 *
 * Separate from saveEntity because a one-field change shouldn't have to pass
 * every other field's validation. Half the "hide this" buttons in the brief
 * were failing for exactly that reason.
 */
export async function toggleEntity(formData: FormData) {
  await requireStaff();

  const key = String(formData.get("__entity") ?? "");
  const id = String(formData.get("__id") ?? "");
  const field = String(formData.get("__field") ?? "isActive");
  const next = String(formData.get("__next") ?? "true") === "true";

  const def = entityByKey(key);
  if (!def?.model || !id) return;

  if (!process.env.DATABASE_URL) {
    console.info(`[entity] would set ${key}.${field} = ${next} on ${id}`);
    return;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const model = (prisma as unknown as Record<string, {
      update: (a: unknown) => Promise<unknown>;
    }>)[def.model];

    const data: Record<string, unknown> = { [field]: next };
    // Publishing should stamp a date, or the article sorts to the bottom.
    if (field === "isPublished") data.publishedAt = next ? new Date() : null;

    await model.update({ where: { id }, data });
    for (const path of def.revalidate) revalidatePath(path);
  } catch (err) {
    console.error(`[entity] ${key} toggle failed:`, err);
  }
}
