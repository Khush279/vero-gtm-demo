"use client";

/**
 * One experiment card on /experiments. Collapsed by default; the header row
 * shows index, title, category pill, primary metric, and duration. Expanded,
 * the card walks through hypothesis, rationale, the two variants side-by-side,
 * the guardrail and decision-rule block, and the cost line.
 *
 * The list wrapper at the bottom of this file owns the "Run order" toggle so
 * the page itself can stay a server component. Each card stays oblivious to
 * position; reordering happens in the parent and React keys keep the
 * expand/collapse state attached to the right experiment.
 */

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Experiment } from "@/data/experiments";

const CATEGORY_LABEL: Record<Experiment["category"], string> = {
  "subject-line": "subject line",
  "pricing-anchor": "pricing anchor",
  "channel-mix": "channel mix",
  personalization: "personalization",
  timing: "timing",
};

export type ExperimentCardProps = {
  experiment: Experiment;
  index: number;
};

export function ExperimentCard({ experiment, index }: ExperimentCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={cn(
        "rounded-lg border border-border/60 bg-card transition-colors",
        "hover:border-primary/30",
        open && "border-primary/40",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-6 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="font-display text-[19px] leading-tight text-foreground">
              {experiment.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 font-mono uppercase tracking-[0.14em] text-muted-foreground">
                {CATEGORY_LABEL[experiment.category]}
              </span>
              <span className="font-mono uppercase tracking-[0.14em] text-muted-foreground/80">
                {experiment.primaryMetric}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground/70">
                · {experiment.duration}
              </span>
            </div>
          </div>
        </div>
        <span
          aria-hidden
          className={cn(
            "mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/70 font-mono text-[11px] text-muted-foreground transition-transform",
            open && "rotate-45 border-primary/50 text-primary",
          )}
        >
          +
        </span>
      </button>

      {open ? (
        <div className="space-y-6 border-t border-border/60 px-5 py-5">
          <Section label="Hypothesis">
            <p className="text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/90">
              {experiment.hypothesis}
            </p>
          </Section>

          <Section label="Why run it">
            <p className="text-pretty text-[13.5px] leading-relaxed text-muted-foreground">
              {experiment.rationale}
            </p>
          </Section>

          <Section label="Variants">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <VariantBlock arm="A · control" body={experiment.setup.variantA} />
              <VariantBlock
                arm="B · test"
                body={experiment.setup.variantB}
                accent
              />
            </div>
          </Section>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Section label="Primary metric">
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/8 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                {experiment.primaryMetric}
              </span>
            </Section>
            <Section label="Minimum detectable effect">
              <p className="font-mono text-[12.5px] tabular-nums text-foreground/85">
                {experiment.mde}
              </p>
            </Section>
            <Section label="Sample size">
              <p className="font-mono text-[12.5px] tabular-nums text-foreground/85">
                {experiment.sampleSize}
              </p>
            </Section>
            <Section label="Cost">
              <p className="font-mono text-[12.5px] text-foreground/85">
                {experiment.cost}
              </p>
            </Section>
          </div>

          <Section label="Guardrails">
            <ul className="space-y-1">
              {experiment.guardrailMetrics.map((g) => (
                <li
                  key={g}
                  className="flex items-start gap-2 text-[13px] text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60"
                  />
                  <span className="font-mono tabular-nums">{g}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section label="Decision rule">
            <div className="flex items-start gap-2.5 rounded-md border border-forest-500/30 bg-forest-50/60 px-3.5 py-2.5">
              <CheckIcon />
              <p className="text-pretty text-[13.5px] leading-relaxed text-forest-900">
                {experiment.decisionRule}
              </p>
            </div>
          </Section>

          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              {experiment.id}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              duration · {experiment.duration}
            </span>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default ExperimentCard;

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function VariantBlock({
  arm,
  body,
  accent = false,
}: {
  arm: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border/70 bg-background",
        accent && "border-ochre-300/60",
      )}
    >
      <div
        className={cn(
          "border-b border-border/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em]",
          accent ? "bg-ochre-50 text-ochre-700" : "bg-muted/40 text-muted-foreground",
        )}
      >
        Variant {arm}
      </div>
      <pre className="whitespace-pre-wrap break-words px-3.5 py-3 font-mono text-[12px] leading-relaxed text-foreground/85">
        {body}
      </pre>
    </div>
  );
}

/**
 * Recommended sequencing: subject-line anchor first (cheapest, highest prior),
 * then EMR personalization (unlocks every later cadence), then send-time
 * (zero-cost structural read), then the Loom touch (real labor cost so it
 * benefits from the earlier reads), then the segmentation experiment (most
 * complex, biggest payoff if it works).
 */
const RUN_ORDER_IDS = [
  "exp_subject_anchor",
  "exp_emr_personalization",
  "exp_send_time",
  "exp_loom_touch_one",
  "exp_pipeda_vs_price",
];

export function ExperimentList({ experiments }: { experiments: Experiment[] }) {
  const [mode, setMode] = useState<"original" | "run-order">("original");

  const ordered = useMemo(() => {
    if (mode === "original") return experiments;
    const rank = new Map(RUN_ORDER_IDS.map((id, idx) => [id, idx]));
    return [...experiments].sort((a, b) => {
      const ra = rank.get(a.id) ?? 99;
      const rb = rank.get(b.id) ?? 99;
      return ra - rb;
    });
  }, [experiments, mode]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {experiments.length} experiments · {mode === "run-order" ? "sequenced cheapest first" : "as drafted"}
        </div>
        <div
          role="radiogroup"
          aria-label="Sort order"
          className="inline-flex overflow-hidden rounded-full border border-border/70 bg-background"
        >
          <ToggleButton
            label="As drafted"
            active={mode === "original"}
            onClick={() => setMode("original")}
          />
          <ToggleButton
            label="Run order"
            active={mode === "run-order"}
            onClick={() => setMode("run-order")}
          />
        </div>
      </div>
      <div className="space-y-3">
        {ordered.map((experiment, idx) => (
          <ExperimentCard
            key={experiment.id}
            experiment={experiment}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
        active
          ? "bg-ochre-100 text-ochre-800"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      aria-hidden
      className="mt-0.5 shrink-0 text-forest-600"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
