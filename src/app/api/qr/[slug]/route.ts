import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { qrUrl, resolveQr } from "@/lib/qr";

/**
 * Printable QR image for a code.
 *   /api/qr/{slug}          -> SVG
 *   /api/qr/{slug}?f=png    -> PNG at 1024px, for print
 *   /api/qr/{slug}?d=1      -> forces a download
 *
 * The image encodes /q/{slug} and nothing else, so it does NOT require the
 * code to exist yet. That matters: standees get printed before a destination
 * is chosen, and a 404 here would block generating artwork for a brand-new
 * code. If the slug is unknown the image still works — scanning it lands on
 * the "code not found" page until someone points it somewhere.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const clean = slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 64);
  if (!clean) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  const url = new URL(req.url);
  const format = url.searchParams.get("f") === "png" ? "png" : "svg";
  const download = url.searchParams.get("d") === "1";
  const size = Math.min(2048, Math.max(256, Number(url.searchParams.get("size")) || 0)) || undefined;

  // Only used for the filename, so a missing record is not a failure.
  const code = await resolveQr(clean).catch(() => null);
  const label = code?.slug ?? clean;

  const options = {
    errorCorrectionLevel: "H" as const,
    margin: 2,
    color: { dark: "#121F2F", light: "#FFFFFF" },
  };

  const disposition = download ? `attachment; filename="${label}.${format}"` : "inline";

  try {
    if (format === "png") {
      const buffer = await QRCode.toBuffer(qrUrl(clean), { ...options, width: size ?? 1024 });
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": disposition,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const svg = await QRCode.toString(qrUrl(clean), { ...options, type: "svg", width: size ?? 512 });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[qr] image generation failed:", err);
    return NextResponse.json({ error: "Could not generate that code" }, { status: 500 });
  }
}
