"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { decodeFields } from "@/lib/form-decode";
import { PROFILE_LINK_FIELDS, PROFILE_OFFER_FIELDS, PROFILE_SERVICE_FIELDS } from "@/lib/profile-fields";

export type ProfileState = { ok: boolean; message: string | null };

const schema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2, "Business name is required"),
  tagline: z.string().optional(),
  about: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  gbpPlaceId: z.string().optional(),
  gbpMapsUrl: z.string().optional(),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #8BB72C").optional(),
  isPublished: z.string().optional(),
});

export async function saveBusinessProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER"]);

  // Repeaters can't go through Object.fromEntries — decode them separately.
  const links = decodeFields(PROFILE_LINK_FIELDS, formData).links as Record<string, string>[];
  const services = decodeFields(PROFILE_SERVICE_FIELDS, formData).services as Record<string, unknown>[];
  const offers = decodeFields(PROFILE_OFFER_FIELDS, formData).offers as Record<string, string>[];

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { slug, isPublished, gbpMapsUrl, gbpPlaceId, ...rest } = parsed.data;

  // Pull the Place ID out of a pasted Maps link so the owner never has to find it.
  const { extractPlaceId } = await import("@/lib/google-review");
  const resolvedPlaceId = gbpPlaceId?.trim() || (gbpMapsUrl ? extractPlaceId(gbpMapsUrl) : null);

  // A BUSINESS user may only edit their own tenant. Staff can edit any.
  if (user.role === "BUSINESS" && user.clientId && user.clientId !== slug) {
    return { ok: false, message: "You can only edit your own business." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated ${links.length} links, ${services.length} services and ${offers.length} offers — but nothing was stored, because no DATABASE_URL is configured.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const business = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
    if (!business) return { ok: false, message: "That business no longer exists." };

    /**
     * Replace-in-place rather than diffing. Links and services are small,
     * ordered lists where position is part of the meaning, so recreating them
     * inside one transaction is simpler and can't leave a half-saved order.
     */
    await prisma.$transaction([
      prisma.business.update({
        where: { id: business.id },
        data: {
          ...rest,
          email: rest.email || null,
          gbpMapsUrl: gbpMapsUrl?.trim() || null,
          gbpPlaceId: resolvedPlaceId,
          isPublished: isPublished === "on",
        },
      }),

      prisma.profileLink.deleteMany({ where: { businessId: business.id } }),
      prisma.profileLink.createMany({
        data: links
          .filter((l) => l.label && l.value)
          .map((l, i) => ({
            businessId: business.id,
            type: (l.type || "CUSTOM").toUpperCase() as never,
            label: l.label,
            value: l.value,
            sortOrder: i,
          })),
      }),

      prisma.profileService.deleteMany({ where: { businessId: business.id } }),
      prisma.profileService.createMany({
        data: services
          .filter((s) => s.name)
          .map((s, i) => ({
            businessId: business.id,
            name: String(s.name),
            price: s.price === null || s.price === undefined ? null : Number(s.price),
            priceNote: s.note ? String(s.note) : null,
            sortOrder: i,
          })),
      }),

      prisma.offer.deleteMany({ where: { businessId: business.id } }),
      prisma.offer.createMany({
        data: offers
          .filter((o) => o.title)
          .map((o) => ({ businessId: business.id, title: o.title, detail: o.detail || null })),
      }),
    ]);

    // The public profile is cached — clear it so the change shows immediately.
    revalidatePath(`/b/${slug}`);
    revalidatePath("/business/profile");

    return { ok: true, message: "Saved. Your public page is updated." };
  } catch (err) {
    console.error("[business] profile save failed:", err);
    return { ok: false, message: "Couldn't save that. Check the server logs." };
  }
}
