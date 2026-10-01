import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { generate } from "@/lib/ai";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  kind: z.enum(["REVIEW_REPLY", "OFFER", "CAPTION", "INSIGHT", "DESCRIPTION"]),
  prompt: z.string().min(3).max(4000),
});

export async function POST(req: Request) {
  const user = await requireUser();

  // Generation costs money per call, so it needs a ceiling even behind auth.
  const limit = rateLimit(`ai:${user.id ?? clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That's a lot of generating. Give it a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Give it something to work with." }, { status: 400 });
  }

  const result = await generate(parsed.data.kind, { subject: parsed.data.prompt });

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.aiRequest.create({
        data: {
          userId: user.id,
          kind: parsed.data.kind,
          prompt: parsed.data.prompt,
          output: result.output,
          provider: result.provider,
        },
      });
    } catch (err) {
      console.error("[ai] usage not logged:", err);
    }
  }

  return NextResponse.json(result);
}
