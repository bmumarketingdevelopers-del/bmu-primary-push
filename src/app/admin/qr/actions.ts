"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/session";
import { slugify } from "@/lib/qr";

export type QrActionState = { ok: boolean; message: string | null };

const targetSchema = z.object({
  id: z.string().min(1),
  target: z.string().url("Enter a full URL, including https://"),
  label: z.string().min(2, "Give the code a label"),
});

const createSchema = z.object({
  clientId: z.string().min(1),
  label: z.string().min(2, "Give the code a label"),
  type: z.string().min(1),
  target: z.string().url("Enter a full URL, including https://"),
  password: z.string().optional(),
});

const demoNote = "Saved in this session only — no DATABASE_URL is configured.";

export async function updateQrTarget(_prev: QrActionState, formData: FormData): Promise<QrActionState> {
  await requireStaff();

  const parsed = targetSchema.safeParse({
    id: formData.get("id"),
    target: formData.get("target"),
    label: formData.get("label"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: demoNote };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.qrCode.update({
      where: { id: parsed.data.id },
      data: { target: parsed.data.target, label: parsed.data.label },
    });
    revalidatePath("/admin/qr");
    return { ok: true, message: "Updated. Printed codes now point to the new destination." };
  } catch (err) {
    console.error("[qr] update failed:", err);
    return { ok: false, message: "Couldn't save that. Check the server logs." };
  }
}

export async function toggleQrActive(id: string, isActive: boolean) {
  await requireStaff();
  if (!process.env.DATABASE_URL) return;

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.qrCode.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/qr");
  } catch (err) {
    console.error("[qr] toggle failed:", err);
  }
}

export async function createQrCode(_prev: QrActionState, formData: FormData): Promise<QrActionState> {
  await requireStaff();

  const parsed = createSchema.safeParse({
    clientId: formData.get("clientId"),
    label: formData.get("label"),
    type: formData.get("type"),
    target: formData.get("target"),
    password: formData.get("password") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  if (!process.env.DATABASE_URL) {
    return { ok: true, message: demoNote };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const base = slugify(parsed.data.label);
    // Slugs are printed on physical material, so collisions must be impossible.
    const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;

    await prisma.qrCode.create({
      data: {
        clientId: parsed.data.clientId,
        label: parsed.data.label,
        slug,
        type: parsed.data.type as never,
        target: parsed.data.target,
        password: parsed.data.password || null,
      },
    });
    revalidatePath("/admin/qr");
    return { ok: true, message: `Created. The printable code lives at /q/${slug}.` };
  } catch (err) {
    console.error("[qr] create failed:", err);
    return { ok: false, message: "Couldn't create that code. Check the server logs." };
  }
}
