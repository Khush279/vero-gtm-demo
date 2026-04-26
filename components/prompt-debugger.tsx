"use client";

/**
 * /prompt-debugger client surface.
 *
 * Mirrors the controls of /lead/[id] but instead of calling the model it
 * shows the exact strings buildPrompt() returns. Token counts and cost
 * estimate use lib/token-estimate.ts so the math is unit-tested.
 *
 * Highlighting is intentionally minimal: {{merge_tokens}} render in ochre,
 * brand assets (Vero, Tali, DAX, PIPEDA, Ontario Health, EMR names, dollar
 * amounts) render in forest. No third-party syntax engine; the prompt is
 * short and the regex is auditable in source.
 */

import { Fragment, useMemo, useState } from "react";

import { buildPrompt, type PromptTone } from "@/lib/prompts";
import {
  estimateCost,
  estimateTokens,
  formatCost,
  MODEL_PRICING,
} from "@/lib/token-estimate";
import type { EmrInferred, Lead, Touch } from "@/lib/types";
import { cn } from "@/lib/utils";

type DebuggerLead = Pick<
  Lead,
  | "id"
  | "name"
  | "specialty"
  | "city"
  | "yearRegistered"
  | "practiceAddress"
  | "inferredEmr"
>;

type LeverageId = Extract<
  Touch["leverage"],
  | "price_anchor"
  | "doc_upload_diff"
  | "ontario_vor"
  | "pipeda_compliance"
  | "peer_adoption"
>;

const TOUCH_DAYS: Array<{ id: number; label: string }> = [
  { id: 1, label: "Day 1" },
  { id: 4, label: "Day 4" },
  { id: 9, label: "Day 9" },
  { id: 16, label: "Day 16" },
];

const LEVERAGE_OPTIONS: Array<{ id: LeverageId; label: string }> = [
  { id: "price_anchor", label: "Price anchor" },
  { id: "doc_upload_diff", label: "Doc upload diff" },
  { id: "ontario_vor", label: "Ontario VoR" },
  { id: "pipeda_compliance", label: "PIPEDA" },
  { id: "peer_adoption", label: "Peer adoption" },
];

const TONE_OPTIONS: Array<{ id: PromptTone; label: string }> = [
  { id: "direct", label: "Direct" },
  { id: "conversational", label: "Conversational" },
  { id: "skeptical", label: "Skeptical" },
];

const ASSUMED_OUTPUT_TOKENS = 100;

/** Brand assets and proper nouns that we tint forest in the rendered prompt. */
const BRAND_PATTERNS: RegExp[] = [
  /\bVero\b/g,
  /\bTali\b/g,
  /\bDAX\b/g,
  /\bPIPEDA\b/g,
  /\bOntario Health\b/g,
  /\bVendor of Record\b/g,
  /\bVoR\b/g,
  /\bOSCAR\b/g,
  /\bTelus PSS\b/g,
  /\bTelus Med Access\b/g,
  /\bAccuro\b/g,
  /\bKroll\b/g,
  /\bEpic(?:\s+SmartPhrases)?\b/g,
  /\bCerner(?:\s+PowerNotes)?\b/g,
  /\bInputHealth\b/g,
  /\bWELL\b/g,
  /\$[0-9]+(?:\.[0-9]+)?(?:[–-][0-9]+(?:\.[0-9]+)?)?\b/g,
  /\bCAD\b/g,
  /\bFHT\b/g,
  /\bOHT\b/g,
  /\bCMIO\b/g,
  /\bSOAP\b/g,
];

const MERGE_TOKEN_PATTERN = /\{\{[a-z_]+\}\}/g;

type AltSystemPrompt = {
  id: string;
  label: string;
  description: string;
  one_liner: string;
};

const ALT_SYSTEM_PROMPTS: AltSystemPrompt[] = [
  {
    id: "json_schema",
    label: "Structured JSON schema",
    description:
      "Swap the freeform JSON instruction for an OpenAI response_format with a strict schema. Removes the 'parse this string' tax.",
    one_liner:
      "response_format: { type: 'json_schema', schema: { subject: string, body: string, leverage: enum } }",
  },
  {
    id: "few_shot",
    label: "Few-shot with two paste-back gold standards",
    description:
      "Prepend two exemplar emails (one Family Med + OSCAR, one Internal Med + Accuro) so the model anchors voice, not just rules.",
    one_liner: "Adds 2 sample touches and 2 sample subjects as assistant turns.",
  },
  {
    id: "voice_distillation",
    label: "Voice distilled from 50 sent emails",
    description:
      "Drop the abstract voice rules. Replace with 6 lines lifted verbatim from Adeel's last 50 outbound emails. Style transfer, not style theory.",
    one_liner: "Cuts ~120 input tokens. Sounds more like the founder, less like a prompt.",
  },
];

export function PromptDebugger({ leads }: { leads: DebuggerLead[] }) {
  const defaultLeadId = leads[0]?.id ?? "";

  const [leadId, setLeadId] = useState<string>(defaultLeadId);
  const [touchDay, setTouchDay] = useState<number>(1);
  const [leverage, setLeverage] = useState<LeverageId>("price_anchor");
  const [tone, setTone] = useState<PromptTone>("direct");

  const lead = useMemo(
    () => leads.find((l) => l.id === leadId) ?? leads[0],
    [leads, leadId],
  );

  const messages = useMemo(() => {
    if (!lead) return null;
    // buildPrompt expects a full Lead. The debugger only carries the fields
    // that affect the prompt; pad the rest with safe defaults so we don't
    // duplicate the source-of-truth shape.
    const fullLead: Lead = {
      ...lead,
      languages: ["English"],
      segment: "clinic_solo",
      score: 0,
      stage: "new",
      daysInStage: 0,
      nextTouchAt: null,
      lastContactedAt: null,
      nearbyCompetitorPresence: 0,
      source: "cpso_register",
    };
    return buildPrompt(fullLead, touchDay, leverage, tone);
  }, [lead, touchDay, leverage, tone]);

  const stats = useMemo(() => {
    const sysTok = estimateTokens(messages?.system ?? "");
    const usrTok = estimateTokens(messages?.user ?? "");
    const inputTok = sysTok + usrTok;
    const outputTok = ASSUMED_OUTPUT_TOKENS;
    const cost = estimateCost(inputTok, outputTok, "gpt-4o-mini");
    return { sysTok, usrTok, inputTok, outputTok, cost };
  }, [messages]);

  if (!lead || !messages) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-8 text-center">
        <p className="text-[14px] text-muted-foreground">
          No leads available to debug against.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <LeadPicker
            leads={leads}
            value={leadId}
            onChange={setLeadId}
          />
          <RadioRow
            label="Touch day"
            options={TOUCH_DAYS.map((d) => ({ id: String(d.id), label: d.label }))}
            value={String(touchDay)}
            onChange={(v) => setTouchDay(Number(v))}
          />
          <RadioRow
            label="Leverage point"
            options={LEVERAGE_OPTIONS.map((l) => ({ id: l.id, label: l.label }))}
            value={leverage}
            onChange={(v) => setLeverage(v as LeverageId)}
          />
          <RadioRow
            label="Tone"
            options={TONE_OPTIONS.map((t) => ({ id: t.id, label: t.label }))}
            value={tone}
            onChange={(v) => setTone(v as PromptTone)}
          />
        </div>
      </div>

      {/* Two-column prompts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PromptColumn
          role="system"
          label="System message"
          subLabel="Voice rules, brand guardrails, output contract."
          content={messages.system}
          tokens={stats.sysTok}
        />
        <PromptColumn
          role="user"
          label="User message"
          subLabel="Per-lead context. The only thing that varies per touch."
          content={messages.user}
          tokens={stats.usrTok}
        />
      </div>

      {/* Stat strip */}
      <StatStrip stats={stats} />

      {/* Alt-prompts */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[20px] tracking-tight text-foreground">
            What if we tweaked the system prompt?
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            three production-tested alternatives
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ALT_SYSTEM_PROMPTS.map((alt) => (
            <AltCard key={alt.id} alt={alt} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function LeadPicker({
  leads,
  value,
  onChange,
}: {
  leads: DebuggerLead[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Lead
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border border-border bg-background px-3 py-2 text-[13.5px] text-foreground focus:outline-none focus:ring-2 focus:ring-forest-400"
      >
        {leads.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name} · {l.specialty} · {l.city} · {emrLabel(l.inferredEmr)}
          </option>
        ))}
      </select>
    </label>
  );
}

function RadioRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ id: string; label: string }>;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] transition-colors",
                active
                  ? "bg-forest-700 text-forest-50"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PromptColumn({
  role,
  label,
  subLabel,
  content,
  tokens,
}: {
  role: "system" | "user";
  label: string;
  subLabel: string;
  content: string;
  tokens: number;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            role: {role}
          </div>
          <div className="font-display text-[16px] tracking-tight text-foreground">
            {label}
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">{subLabel}</div>
        </div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          ~{tokens} tok
        </div>
      </header>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 font-mono text-[12.5px] leading-[1.6] text-foreground">
        {tintPrompt(content)}
      </pre>
    </article>
  );
}

function StatStrip({
  stats,
}: {
  stats: {
    sysTok: number;
    usrTok: number;
    inputTok: number;
    outputTok: number;
    cost: number;
  };
}) {
  const pricing = MODEL_PRICING["gpt-4o-mini"];
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[20px] tracking-tight text-foreground">
          Token + cost math.
        </h2>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          gpt-4o-mini · ${pricing.input.toFixed(2)}/1M in · ${pricing.output.toFixed(2)}/1M out
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-5">
        <Stat label="System" value={`${stats.sysTok}`} unit="tokens" />
        <Stat label="User" value={`${stats.usrTok}`} unit="tokens" />
        <Stat
          label="Estimated output"
          value={`${stats.outputTok}`}
          unit="tokens (~80 words)"
        />
        <Stat
          label="Total"
          value={`${stats.inputTok + stats.outputTok}`}
          unit="tokens"
        />
        <Stat label="Cost per touch" value={formatCost(stats.cost)} unit="USD" />
      </div>
      <p className="mt-3 font-mono text-[10.5px] leading-[1.7] text-muted-foreground">
        Tokens are estimated chars / 4 with whitespace coalescing. Output assumed at 100 tokens (one ~80-word body plus a subject line). At 500 leads × 4 touches = 2,000 calls per cycle, this prompt costs roughly {formatCost(stats.cost * 2000)} per full sequence run.
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-card p-4">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-[24px] leading-none tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{unit}</div>
    </div>
  );
}

function AltCard({ alt }: { alt: AltSystemPrompt }) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Variant
      </div>
      <h3 className="font-display text-[17px] leading-snug tracking-tight text-foreground">
        {alt.label}
      </h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {alt.description}
      </p>
      <pre className="rounded-md bg-muted/50 px-3 py-2 font-mono text-[11px] leading-[1.5] text-foreground/80 whitespace-pre-wrap break-words">
        {alt.one_liner}
      </pre>
      <div className="mt-auto pt-1">
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700 hover:text-forest-800"
        >
          test this in production →
        </button>
      </div>
    </article>
  );
}

/* ---------------- helpers ---------------- */

function emrLabel(emr: EmrInferred): string {
  switch (emr) {
    case "telus_pss":
      return "Telus PSS";
    case "telus_med_access":
      return "Telus Med Access";
    case "accuro":
      return "Accuro";
    case "oscar":
      return "OSCAR";
    case "epic":
      return "Epic";
    case "cerner":
      return "Cerner";
    case "input_health":
      return "InputHealth";
    case "unknown":
      return "Unknown EMR";
  }
}

/**
 * Tokenize the prompt string into a list of (text, kind) spans where kind is
 * "merge", "brand", or "plain". We do this by collecting every match position
 * across all patterns, sorting, then walking once. Overlap protection is
 * handled by skipping any match that starts inside a region we already
 * claimed.
 */
type Span = { start: number; end: number; kind: "merge" | "brand" };

function tintPrompt(content: string): React.ReactNode {
  const spans: Span[] = [];

  // Merge tokens first (highest priority).
  const mergeMatches = Array.from(content.matchAll(MERGE_TOKEN_PATTERN));
  for (const match of mergeMatches) {
    if (match.index === undefined) continue;
    spans.push({
      start: match.index,
      end: match.index + match[0].length,
      kind: "merge",
    });
  }

  // Brand assets.
  for (const re of BRAND_PATTERNS) {
    const brandMatches = Array.from(content.matchAll(re));
    for (const match of brandMatches) {
      if (match.index === undefined) continue;
      spans.push({
        start: match.index,
        end: match.index + match[0].length,
        kind: "brand",
      });
    }
  }

  spans.sort((a, b) => a.start - b.start);

  const claimed: Span[] = [];
  for (const s of spans) {
    const last = claimed[claimed.length - 1];
    if (last && s.start < last.end) continue;
    claimed.push(s);
  }

  const out: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const s of claimed) {
    if (s.start > cursor) {
      out.push(
        <Fragment key={`p-${key++}`}>{content.slice(cursor, s.start)}</Fragment>,
      );
    }
    const text = content.slice(s.start, s.end);
    if (s.kind === "merge") {
      out.push(
        <span
          key={`m-${key++}`}
          className="rounded-sm bg-ochre-100 px-0.5 text-ochre-800"
        >
          {text}
        </span>,
      );
    } else {
      out.push(
        <span key={`b-${key++}`} className="font-medium text-forest-700">
          {text}
        </span>,
      );
    }
    cursor = s.end;
  }
  if (cursor < content.length) {
    out.push(<Fragment key={`p-${key++}`}>{content.slice(cursor)}</Fragment>);
  }
  return <>{out}</>;
}

export default PromptDebugger;
