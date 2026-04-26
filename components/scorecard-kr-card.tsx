/**
 * One key-result card on /scorecard. Pure presentational, server-safe. Shows
 * title, leading-vs-lagging chip, target, current value, a 30-day sparkline,
 * a confidence dot, owner, and 1 to 2 sentences of color.
 *
 * Confidence palette tracks the rest of the demo: forest for high, ochre for
 * medium, destructive for low. The sparkline color follows the confidence
 * tone so the card reads as one mood.
 */

import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/sparkline";
import type { ConfidenceLevel, KeyResult } from "@/data/scorecard";

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: "high",
  medium: "medium",
  low: "low",
};

const CONFIDENCE_DOT: Record<ConfidenceLevel, string> = {
  high: "bg-forest-600",
  medium: "bg-ochre-500",
  low: "bg-destructive",
};

const CONFIDENCE_TEXT: Record<ConfidenceLevel, string> = {
  high: "text-forest-700",
  medium: "text-ochre-700",
  low: "text-destructive",
};

const CONFIDENCE_BORDER: Record<ConfidenceLevel, string> = {
  high: "border-forest-300/60",
  medium: "border-ochre-300/60",
  low: "border-destructive/40",
};

const CONFIDENCE_SPARK: Record<ConfidenceLevel, string> = {
  high: "#234738",
  medium: "#7a4c14",
  low: "hsl(var(--destructive))",
};

const TYPE_CHIP: Record<KeyResult["type"], string> = {
  leading: "border-primary/30 bg-primary/5 text-primary",
  lagging: "border-border/70 bg-muted/40 text-muted-foreground",
};

export function ScorecardKrCard({ kr }: { kr: KeyResult }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-md border bg-card p-4 transition-colors",
        CONFIDENCE_BORDER[kr.confidence],
      )}
      aria-label={`Key result: ${kr.title}`}
    >
      {/* Title row + leading/lagging chip */}
      <header className="flex items-start justify-between gap-3">
        <h4 className="font-display text-[15.5px] leading-tight text-foreground">
          {kr.title}
        </h4>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em]",
            TYPE_CHIP[kr.type],
          )}
        >
          {kr.type}
        </span>
      </header>

      {/* Target / current */}
      <div className="space-y-1">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground/80">
          target
        </div>
        <div className="font-mono text-[12px] tabular-nums text-foreground/80">
          {kr.target}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground/80">
            current
          </div>
          <div className="font-mono text-[15px] font-medium tabular-nums text-foreground">
            {kr.current}
          </div>
        </div>
        {kr.trend30d.length >= 2 ? (
          <Sparkline
            values={kr.trend30d}
            width={96}
            height={28}
            strokeColor={CONFIDENCE_SPARK[kr.confidence]}
            fillColor={CONFIDENCE_SPARK[kr.confidence]}
            ariaLabel={`${kr.title} 30-day trend`}
          />
        ) : null}
      </div>

      {/* Confidence + owner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              CONFIDENCE_DOT[kr.confidence],
            )}
          />
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              CONFIDENCE_TEXT[kr.confidence],
            )}
          >
            {CONFIDENCE_LABEL[kr.confidence]} confidence
          </span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          owner · {kr.owner}
        </div>
      </div>

      {/* Notes */}
      <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
        {kr.notes}
      </p>
    </article>
  );
}

export default ScorecardKrCard;
