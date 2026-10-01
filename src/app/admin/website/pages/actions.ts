"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaff } from "@/lib/session";
import type { PageSection } from "@/lib/page-builder";

export type PageState = { ok: boolean; message: string | null };

const schema = z.object({
  slug: z.string().min(1, "The page needs a URL"),
  title: z.string().min(1, "The page needs a title"),
  subtitle: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  navLabel: z.string().optional(),
  navOrder: z.coerce.number().default(100),
  isPublished: z.string().optional(),
  sections: z.string(),
});

const RESERVED = [
  "admin", "dashboard", "business", "creators", "login", "api", "store",
  "services", "products", "industries", "portfolio", "pricing", "about",
  "contact", "resources", "case-studies", "partners", "b", "r", "q", "o", "p",
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

export async function savePage(_prev: PageState, formData: FormData): Promise<PageState> {
  const user = await requireStaff();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const { sections: raw, isPublished, navOrder, ...rest } = parsed.data;
  const slug = slugify(rest.slug || rest.title);

  // Custom pages live under /p/, so a clash is only possible with another page.
  if (RESERVED.includes(slug)) {
    return { ok: false, message: `"${slug}" is reserved. Pick a different address.` };
  }

  let sections: PageSection[];
  try {
    sections = JSON.parse(raw);
    if (!Array.isArray(sections)) throw new Error("not an array");
  } catch {
    return { ok: false, message: "The page content couldn't be read. Try reloading the editor." };
  }

  if (sections.length === 0) {
    return { ok: false, message: "Add at least one section before saving." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      ok: true,
      message: `Validated: ${sections.length} sections at /p/${slug}. Not stored — no DATABASE_URL.`,
    };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.customPage.upsert({
      where: { slug },
      update: {
        ...rest, slug, navOrder,
        sections: sections as never,
        isPublished: isPublished === "on",
        updatedBy: user.id,
      },
      create: {
        ...rest, slug, navOrder,
        sections: sections as never,
        isPublished: isPublished === "on",
        updatedBy: user.id,
      },
    });

    revalidatePath(`/p/${slug}`);
    revalidatePath("/", "layout");
    revalidatePath("/admin/website/pages");

    return {
      ok: true,
      message: isPublished === "on"
        ? `Saved and live at /p/${slug}.`
        : `Saved as a draft. Tick publish to put it live.`,
    };
  } catch (err) {
    console.error("[pages] save failed:", err);
    return { ok: false, message: "Couldn't save that page." };
  }
}

export async function deletePage(formData: FormData) {
  await requireStaff();
  const slug = String(formData.get("slug") ?? "");
  if (!slug || !process.env.DATABASE_URL) return;

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.customPage.delete({ where: { slug } });
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("[pages] delete failed:", err);
  }
  redirect("/admin/website/pages");
}
