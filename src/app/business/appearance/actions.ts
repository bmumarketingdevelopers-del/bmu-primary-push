"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";

export type AppearanceState = { ok: boolean; message: string | null };

const schema = z.object({
  slug: z.string().min(1),
  themeKey: z.string().min(1),
  fontKey: z.string().min(1),
  layoutKey: z.string().min(1),
  buttonStyle: z.string().min(1),
  motionLevel: z.string().min(1),
  brandColor: z.string().optional(),
  headingFont: z.string().optional(),
  corners: z.string().optional(),
  logoShape: z.string().optional(),
  bgColor: z.string().optional(),
  surfaceColor: z.string().optional(),
  textColor: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  coverUrl: z.string().url().optional().or(z.literal("")),
});

export async function saveAppearance(
  _prev: AppearanceState,
  formData: FormData
): Promise<AppearanceState> {
  const user = await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { slug, logoUrl, coverUrl, ...rest } = parsed.data;

  if (user.role === "BUSINESS" && user.clientId && user.clientId !== slug) {
    return { ok: false, message: "You can only change your own profile." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: "Looks right — but nothing was stored, because no DATABASE_URL is configured.",
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.business.update({
      where: { slug },
      data: { ...rest, logoUrl: logoUrl || null, coverUrl: coverUrl || null },
    });

    revalidatePath(`/b/${slug}`);
    revalidatePath("/business/appearance");
    return { ok: true, message: "Saved. Your profile looks like this now." };
  } catch (err) {
    console.error("[appearance] save failed:", err);
    return { ok: false, message: "Couldn't save that. Check the server logs." };
  }
}
