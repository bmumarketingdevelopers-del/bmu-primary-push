import { NextResponse } from "next/server";
import { z } from "zod";
import { generateSuggestions } from "@/lib/review-suggestions";
import { getBusiness } from "@/lib/qr-platform";
import { googleReviewUrl } from "@/lib/google-review";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ slug: z.string().min(1) });

/**
 * Public — a customer at a counter has no login. Rate limited per IP so the
 * endpoint can't be used as a free text generator.
 */
export async function POST(req: Request) {
  const limit = rateLimit(`suggest:${clientIp(req)}`, { limit: 8, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const business = await getBusiness(parsed.data.slug);
  if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });

  const { suggestions, provider } = await generateSuggestions({
    businessName: business.name,
    category: business.category,
    city: business.city,
    services: business.services.map((s) => s.name),
  });

  const target = googleReviewUrl({
    mapsUrl: business.gbpUrl,
    businessName: business.name,
    city: business.city,
  });

  return NextResponse.json({
    suggestions,
    provider,
    gbpUrl: target.url,
    linkQuality: target.quality,
  });
}
