/**
 * AI layer with a provider abstraction.
 *
 * If no API key is configured the templates below run instead. They are
 * deliberately decent rather than placeholder — a business on the free tier
 * still gets something usable, and the feature can be demoed offline.
 */

export type AiKind = "REVIEW_REPLY" | "OFFER" | "CAPTION" | "INSIGHT" | "DESCRIPTION";

export type AiResult = {
  output: string;
  provider: "anthropic" | "openai" | "template";
  cached?: boolean;
};

export const aiConfigured = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);

const SYSTEM: Record<AiKind, string> = {
  REVIEW_REPLY:
    "You write replies to customer reviews for Indian small businesses. Be warm, specific and brief — 2 to 3 sentences. Never sound like a template. If the review is negative, acknowledge the specific problem, say what changes, and invite them back once. Never offer refunds or make commitments about money. No emoji.",
  OFFER:
    "You write short promotional offers for Indian small businesses. One headline under 8 words and one line of detail with the terms. Rupee amounts, plain language, no exclamation marks, no hype words like 'amazing' or 'unbeatable'.",
  CAPTION:
    "You write Instagram captions for Indian small businesses. Two or three short lines, one clear call to action, 3 to 5 relevant hashtags at the end. Conversational, not corporate.",
  INSIGHT:
    "You read small business metrics and state what actually changed and what to do about it. Two sentences maximum. Be specific about numbers. Never pad with encouragement.",
  DESCRIPTION:
    "You write menu and service descriptions for Indian businesses. One sentence, under 15 words, focused on what it tastes like or what it does — not adjectives about quality.",
};

/* --------------------------- template fallbacks -------------------------- */

function template(kind: AiKind, input: Record<string, string>): string {
  switch (kind) {
    case "REVIEW_REPLY": {
      const sentiment = (input.sentiment ?? "POSITIVE").toUpperCase();
      const name = input.customerName?.split(" ")[0] ?? "there";
      const business = input.businessName ?? "us";

      if (sentiment === "POSITIVE") {
        return `Thank you, ${name} — glad it went well. We'll pass this on to the team, and we'll see you at ${business} again soon.`;
      }
      return `${name}, thank you for telling us — that isn't the standard we hold ourselves to, and we're looking at it directly. If you're willing, come back and ask for the manager; we'd like the chance to get it right.`;
    }

    case "OFFER": {
      const what = input.subject ?? "our service";
      return `Midweek ${what} at 20% off\nMonday to Thursday before 2pm. Walk-ins welcome, mention this offer at the counter.`;
    }

    case "CAPTION":
      return `${input.subject ?? "Something new this week"}.\nOpen until 9pm, walk in or book ahead.\n\n#bengaluru #localbusiness #supportlocal`;

    case "INSIGHT":
      return `${input.subject ?? "Scans"} moved ${input.change ?? "up"} this period. Worth checking which QR placement drove it before changing anything else.`;

    case "DESCRIPTION":
      return `${input.subject ?? "House special"} — made fresh through the day.`;
  }
}

/* ------------------------------ generation ------------------------------ */

export async function generate(
  kind: AiKind,
  input: Record<string, string>
): Promise<AiResult> {
  const prompt = buildPrompt(kind, input);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "claude-sonnet-4-6",
          max_tokens: 400,
          system: SYSTEM[kind],
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = (data.content ?? [])
          .filter((c: { type: string }) => c.type === "text")
          .map((c: { text: string }) => c.text)
          .join("\n")
          .trim();
        if (text) return { output: text, provider: "anthropic" };
      } else {
        console.warn("[ai] anthropic returned", res.status);
      }
    } catch (err) {
      console.error("[ai] anthropic call failed:", err);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "gpt-4o-mini",
          max_tokens: 400,
          messages: [
            { role: "system", content: SYSTEM[kind] },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return { output: text, provider: "openai" };
      }
    } catch (err) {
      console.error("[ai] openai call failed:", err);
    }
  }

  // No key, or every provider failed. Never leave the user with nothing.
  return { output: template(kind, input), provider: "template" };
}

/**
 * Raw completion with a caller-supplied system prompt. Used where a feature
 * needs full control of the instructions rather than one of the presets.
 */
export async function complete(
  system: string,
  prompt: string,
  maxTokens = 600
): Promise<{ output: string; provider: "anthropic" | "openai" | "none" }> {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "claude-sonnet-4-6",
          max_tokens: maxTokens,
          system,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = (data.content ?? [])
          .filter((c: { type: string }) => c.type === "text")
          .map((c: { text: string }) => c.text)
          .join("\n")
          .trim();
        if (text) return { output: text, provider: "anthropic" };
      }
    } catch (err) {
      console.error("[ai] completion failed:", err);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL ?? "gpt-4o-mini",
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return { output: text, provider: "openai" };
      }
    } catch (err) {
      console.error("[ai] completion failed:", err);
    }
  }

  return { output: "", provider: "none" };
}

function buildPrompt(kind: AiKind, input: Record<string, string>) {
  const lines = Object.entries(input)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return `${lines.join("\n")}\n\nWrite the ${kind.toLowerCase().replace("_", " ")}.`;
}

/* ------------------------- rule-based insights -------------------------- */

/**
 * Insights are computed, not generated. A model inventing a number about
 * someone's business is worse than no insight at all — AI only phrases what
 * the arithmetic already found.
 */
export type Insight = {
  tone: "good" | "warning" | "neutral";
  title: string;
  detail: string;
  action?: string;
};

export function computeInsights(m: {
  scansThisWeek: number;
  scansLastWeek: number;
  positiveReviews: number;
  negativeReviews: number;
  unresolvedNegative: number;
  leads: number;
  leadsLastPeriod: number;
  profileCompleteness: number;
  topAction: string;
}): Insight[] {
  const out: Insight[] = [];
  const scanChange = pct(m.scansThisWeek, m.scansLastWeek);
  const leadChange = pct(m.leads, m.leadsLastPeriod);
  const total = m.positiveReviews + m.negativeReviews;
  const positiveRate = total ? Math.round((m.positiveReviews / total) * 100) : 0;

  out.push({
    tone: scanChange >= 0 ? "good" : "warning",
    title: `Scans ${scanChange >= 0 ? "up" : "down"} ${Math.abs(scanChange)}% on last week`,
    detail: `${m.scansThisWeek.toLocaleString("en-IN")} scans against ${m.scansLastWeek.toLocaleString("en-IN")}.`,
    action: scanChange < 0 ? "Check whether a standee has been moved or covered." : undefined,
  });

  if (m.unresolvedNegative > 0) {
    out.push({
      tone: "warning",
      title: `${m.unresolvedNegative} unhappy customers haven't been called back`,
      detail: "These were caught before Google. Left alone, some post publicly anyway.",
      action: "Call them today — a same-day callback turns most of these around.",
    });
  }

  out.push({
    tone: positiveRate >= 80 ? "good" : "neutral",
    title: `${positiveRate}% of feedback is positive`,
    detail: `${m.positiveReviews} went to Google, ${m.negativeReviews} came to you privately.`,
    action: positiveRate < 70 ? "Look for a pattern in the private feedback before adding more codes." : undefined,
  });

  out.push({
    tone: leadChange >= 0 ? "good" : "warning",
    title: `Leads ${leadChange >= 0 ? "up" : "down"} ${Math.abs(leadChange)}%`,
    detail: `${m.leads} this period. Most people tap "${m.topAction}" first.`,
  });

  if (m.profileCompleteness < 100) {
    out.push({
      tone: "neutral",
      title: `Profile is ${m.profileCompleteness}% complete`,
      detail: "Incomplete profiles get fewer taps per scan — people bounce when the thing they wanted isn't there.",
      action: "Finish the remaining fields.",
    });
  }

  return out;
}

const pct = (now: number, before: number) =>
  before === 0 ? 100 : Math.round(((now - before) / before) * 100);
