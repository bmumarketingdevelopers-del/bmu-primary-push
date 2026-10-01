"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";

export type ProfileState = { ok: boolean; message: string | null };

const schema = z.object({
  name: z.string().min(2, "Your name is required"),
  handle: z.string().min(2, "Your handle is required"),
  city: z.string().optional(),
  bio: z.string().max(600, "Keep the bio under 600 characters").optional(),
  categories: z.string().optional(),
  followers: z.coerce.number().min(0).optional(),
  avgViews: z.coerce.number().min(0).optional(),
  rateCard: z.coerce.number().min(0).optional(),
  upiId: z.string().optional(),
  panNumber: z.string().optional(),
});

/**
 * A creator editing their own profile.
 *
 * Rate card is in rupees here and paise in the database — a creator typing
 * 12000 means twelve thousand rupees, and storing that literally would quote
 * every brand ₹120.
 */
export async function saveCreatorProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser(["CREATOR", "OWNER", "ADMIN"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { categories, rateCard, name, ...rest } = parsed.data;

  const data = {
    ...rest,
    categories: (categories ?? "").split(",").map((c) => c.trim()).filter(Boolean),
    rateCard: rateCard ? Math.round(rateCard * 100) : null,
  };

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated — ${data.categories.length} categories. Not stored: no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    await prisma.user.update({ where: { id: user.id }, data: { name } });

    await prisma.creator.upsert({
      where: { userId: user.id },
      update: data,
      create: { userId: user.id, ...data },
    });

    revalidatePath("/creators/profile");
    revalidatePath("/admin/creators");

    return { ok: true, message: "Saved. Brands see this when matching briefs." };
  } catch (err) {
    console.error("[creator] profile save failed:", err);
    return { ok: false, message: "Couldn't save that. Try again." };
  }
}
