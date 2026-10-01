import crypto from "crypto";

/**
 * Cloudflare R2 via the S3 API. Optional — without credentials the uploader
 * reports that storage isn't configured rather than failing silently.
 */
export const storageConfigured = () =>
  Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET
  );

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml",
  "video/mp4", "video/quicktime",
  "application/pdf",
];

/** Predictable, collision-proof key: client/yyyy-mm/uuid.ext */
export function buildKey(filename: string, clientSlug = "shared") {
  const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "bin";
  const month = new Date().toISOString().slice(0, 7);
  return `${clientSlug}/${month}/${crypto.randomUUID()}.${ext}`;
}

export async function presignUpload(key: string, contentType: string) {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
  const publicUrl = process.env.R2_PUBLIC_URL
    ? `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`
    : null;

  return { uploadUrl, publicUrl, key };
}
