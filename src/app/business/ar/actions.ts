"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";

export type ArState = { ok: boolean; message: string | null };

const schema = z.object({
  slug: z.string().min(1).max(64),
  targetUrl: z.string().url().optional().or(z.literal("")),
  targetMindUrl: z.string().url(),
  targetQuality: z.coerce.number().min(0).max(100),
});

/**
 * Stores the compiled tracking target.
 *
 * Publishing is deliberately not automatic. An experience going live the
 * instant a target compiles would put an untested overlay in front of
 * customers — the owner should point their own phone at the print first.
 */
export async function saveArTarget(_prev: ArState, formData: FormData): Promise<ArState> {
  const user = await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER"]);

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { slug, targetUrl, targetMindUrl, targetQuality } = parsed.data;

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Target compiled and scored ${targetQuality}/100, but nothing was stored — no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const existing = await prisma.arExperience.findUnique({
      where: { slug },
      select: { businessId: true },
    });
    if (!existing) return { ok: false, message: "That experience no longer exists." };

    // A tenant may only touch their own experiences.
    if (user.role === "BUSINESS" && user.clientId) {
      const owned = await prisma.business.findFirst({
        where: { id: existing.businessId, slug: user.clientId },
        select: { id: true },
      });
      if (!owned) return { ok: false, message: "That isn't your experience." };
    }

    await prisma.arExperience.update({
      where: { slug },
      data: {
        targetMindUrl,
        targetQuality,
        ...(targetUrl ? { targetUrl } : {}),
      },
    });

    revalidatePath("/business/ar");
    revalidatePath(`/ar/${slug}`);

    return {
      ok: true,
      message:
        targetQuality < 45
          ? "Saved. Test it on a real print before publishing — this artwork will drift."
          : "Saved. Point your phone at the print to check it, then publish.",
    };
  } catch (err) {
    console.error("[ar] target save failed:", err);
    return { ok: false, message: "Couldn't save that target." };
  }
}

const publishSchema = z.object({ slug: z.string().min(1), next: z.string() });

export async function toggleArPublished(formData: FormData) {
  const user = await requireUser(["BUSINESS", "OWNER", "ADMIN", "MANAGER"]);

  const parsed = publishSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !process.env.DATABASE_URL) return;

  const next = parsed.data.next === "true";

  try {
    const { prisma } = await import("@/lib/prisma");

    // Publishing without a target would open a camera that never tracks.
    if (next) {
      const exp = await prisma.arExperience.findUnique({
        where: { slug: parsed.data.slug },
        select: { targetMindUrl: true },
      });
      if (!exp?.targetMindUrl) return;
    }

    await prisma.arExperience.update({
      where: { slug: parsed.data.slug },
      data: { isPublished: next },
    });

    revalidatePath("/business/ar");
  } catch (err) {
    console.error("[ar] publish toggle failed:", err);
  }
}
