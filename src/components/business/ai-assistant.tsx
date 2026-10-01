"use client";

import * as React from "react";
import { Copy, RefreshCw, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AiKind } from "@/lib/ai";
import styles from "./ai-assistant.module.css";

type Tool = {
  kind: AiKind;
  value: string;
  label: string;
  description: string;
  fields: { name: string; label: string; placeholder?: string; type?: "text" | "textarea" | "select"; options?: string[] }[];
};

const TOOLS: Tool[] = [
  {
    kind: "REVIEW_REPLY",
    value: "reply",
    label: "Reply to a review",
    description: "Paste what a customer wrote and get a reply you can post as-is or edit.",
    fields: [
      { name: "review", label: "What they wrote", type: "textarea", placeholder: "Waited 40 minutes past my appointment and nobody said anything." },
      { name: "sentiment", label: "Tone of the review", type: "select", options: ["POSITIVE", "NEGATIVE"] },
      { name: "customerName", label: "Their name", placeholder: "Sridhar" },
      { name: "businessName", label: "Your business", placeholder: "ABC Salon" },
    ],
  },
  {
    kind: "OFFER",
    value: "offer",
    label: "Write an offer",
    description: "A headline and terms you can put on your profile in a minute.",
    fields: [
      { name: "subject", label: "What's the offer for?", placeholder: "Weekday haircuts" },
      { name: "constraint", label: "Any conditions?", placeholder: "Before 2pm, Monday to Thursday" },
      { name: "businessName", label: "Your business", placeholder: "ABC Salon" },
    ],
  },
  {
    kind: "CAPTION",
    value: "caption",
    label: "Instagram caption",
    description: "Caption plus hashtags for a post about your business.",
    fields: [
      { name: "subject", label: "What's the post about?", placeholder: "New bridal package" },
      { name: "businessName", label: "Your business", placeholder: "ABC Salon" },
      { name: "city", label: "City", placeholder: "Bengaluru" },
    ],
  },
  {
    kind: "DESCRIPTION",
    value: "description",
    label: "Menu or service line",
    description: "One-line descriptions for things on your menu or service list.",
    fields: [
      { name: "subject", label: "Item name", placeholder: "Dal makhani" },
      { name: "detail", label: "Anything notable?", placeholder: "Cooked twelve hours" },
    ],
  },
];

export function AiAssistant({ configured }: { configured: boolean }) {
  return (
    <Tabs defaultValue="reply" className={styles.tabs}>
      <TabsList className={styles.tabList}>
        {TOOLS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
        ))}
      </TabsList>

      {TOOLS.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          <ToolPanel tool={t} configured={configured} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ToolPanel({ tool, configured }: { tool: Tool; configured: boolean }) {
  const [output, setOutput] = React.useState<string | null>(null);
  const [provider, setProvider] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function run(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const input: Record<string, string> = {};
    tool.fields.forEach((f) => {
      input[f.name] = String(form.get(f.name) ?? "");
    });

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: tool.kind, input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't generate that.");
      } else {
        setOutput(data.output);
        setProvider(data.provider);
      }
    } catch {
      setError("Network problem. Try again.");
    }
    setPending(false);
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={styles.panel}>
      <Card>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>{tool.label}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={run} className={styles.form}>
            {tool.fields.map((f) => (
              <div key={f.name} className={styles.field}>
                <Label htmlFor={`${tool.value}-${f.name}`}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <textarea
                    id={`${tool.value}-${f.name}`}
                    name={f.name}
                    rows={4}
                    placeholder={f.placeholder}
                    className={styles.textarea}
                  />
                ) : f.type === "select" ? (
                  <select
                    id={`${tool.value}-${f.name}`}
                    name={f.name}
                    className={styles.select}
                  >
                    {f.options?.map((o) => (
                      <option key={o} value={o}>{o === "POSITIVE" ? "Happy" : "Unhappy"}</option>
                    ))}
                  </select>
                ) : (
                  <Input id={`${tool.value}-${f.name}`} name={f.name} placeholder={f.placeholder} />
                )}
              </div>
            ))}

            <Button type="submit" disabled={pending} className={styles.generate}>
              {pending ? <RefreshCw className={styles.spinning} /> : <Sparkles />}
              {pending ? "Writing…" : "Generate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className={output ? styles.draftCardFilled : undefined}>
        <CardHeader className={styles.draftHeader}>
          <div>
            <CardTitle className={styles.cardTitle}>Draft</CardTitle>
            <CardDescription>Read it before you post it. It&apos;s a starting point, not a decision.</CardDescription>
          </div>
          {provider && (
            <Badge variant={provider === "template" ? "outline" : "default"}>
              {provider === "template" ? "Offline mode" : provider}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <p className={styles.error}>{error}</p>
          )}

          {!output && !error && (
            <p className={styles.empty}>
              {configured
                ? "Fill the form and hit generate."
                : "No AI key configured — you'll still get a usable draft from the built-in templates."}
            </p>
          )}

          {output && (
            <>
              <p className={styles.output}>
                {output}
              </p>
              <Button variant="outline" size="sm" className={styles.copy} onClick={copy}>
                {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
