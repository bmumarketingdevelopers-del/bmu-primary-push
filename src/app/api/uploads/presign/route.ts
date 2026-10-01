import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import {
  ALLOWED_TYPES, MAX_UPLOAD_BYTES, buildKey, presignUpload, storageConfigured,
} from "@/lib/storage";

const schema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  size: z.number().int().positive(),
  clientSlug: z.string().optional(),
});

export async function POST(req: Request) {
  // Tenants upload their own logo and cover, so BUSINESS is allowed here.
  const user = await requireUser(["OWNER", "ADMIN", "MANAGER", "STAFF", "BUSINESS"]);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { filename, contentType, size, clientSlug } = parsed.data;

  // Validate before signing — a signed URL is permission to write to your bucket.
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: `${contentType} isn't an allowed file type.` }, { status: 415 });
  }
  if (size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Files must be under 25 MB." }, { status: 413 });
  }

  if (!storageConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "Storage isn't configured. Add the R2_* variables to .env.",
    });
  }

  try {
    const key = buildKey(filename, clientSlug);
    const signed = await presignUpload(key, contentType);

    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import("@/lib/prisma");
        await prisma.mediaAsset.create({
          data: {
            key,
            url: signed.publicUrl ?? key,
            filename,
            mimeType: contentType,
            sizeBytes: size,
            uploadedById: user.id,
          },
        });
      } catch (err) {
        console.error("[uploads] asset row not written:", err);
      }
    }

    return NextResponse.json({ configured: true, ...signed });
  } catch (err) {
    console.error("[uploads] presign failed:", err);
    return NextResponse.json({ error: "Could not prepare the upload" }, { status: 502 });
  }
}
