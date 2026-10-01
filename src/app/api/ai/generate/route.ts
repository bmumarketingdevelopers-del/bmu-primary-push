import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { generate, type AiKind } from "@/lib/ai";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  kind: z.enum(["REVIEW_REPLY", "OFFER", "CAPTION", "INSIGHT", "DESCRIPTION"]),
  input: z.record(z.string()),
});

export async function POST(req: Request) {
  const user = await requireUser();

  // Model calls cost money — cap them per user, not just per IP.
  const limit = rateLimit(`ai:${user.id}:${clientIp(req)}`, { limit: 20, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "You're generating quite fast. Give it a minute." },
      { status: 429 }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await generate(parsed.data.kind as AiKind, parsed.data.input);

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.aiGeneration.create({
        data: {
          userId: user.id,
          businessId: user.clientId ?? null,
          kind: parsed.data.kind,
          prompt: JSON.stringify(parsed.data.input).slice(0, 2000),
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
