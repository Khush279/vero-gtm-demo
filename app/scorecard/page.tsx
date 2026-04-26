import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ObjectiveSection } from "@/components/objective-section";
import { SCORECARD } from "@/data/scorecard";
import type { ConfidenceLevel } from "@/data/scorecard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Scorecard",
  description:
    "Q4 2026 OKR/KR rollup. Four objectives, twelve key results, confidence ratings calibrated against the leading indicators.",
};

/**
 * /scorecard. Quarterly OKR/KR rollup. Server component, pure presentation
 * over data/scorecard.ts. The page is the receipt for "this person runs
 * ops": real objectives, real key results, leading vs lagging indicators,
 * and a confidence rating per KR with the reason it's that level.
 */

const ROLLUP_DOT: Record<ConfidenceLevel, string> = {
  high: "bg-forest-600",
  medium: "bg-ochre-500",
  low: "bg-destructive",
};

const ROLLUP_TEXT: Record<ConfidenceLevel, string> = {
  high: "text-forest-700",
  medium: "text-ochre-700",
  low: "text-destructive",
};

const ROLLUP_BORDER: Record<ConfidenceLevel, string> = {
  high: "border-forest-300/60 bg-forest-50",
  medium: "border-ochre-200/80 bg-ochre-50",
  low: "border-destructive/30 bg-destructive/5",
};

export default function ScorecardPage() {
  const krCount = SCORECARD.objectives.reduce(
    (n, o) => n + o.keyResults.length,
    0,
  );

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Quarterly OKR rollup · mid-Q4"
        title={<>The scorecard.</>}
        subtitle="Four objectives. Twelve key results. Confidence ratings calibrated to where the leading indicators actually point."
      />

      {/* Meeting frame strip */}
      <section
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 rounded-md border px-5 py-4",
          ROLLUP_BORDER[SCORECARD.rollupConfidence],
        )}
        aria-label="Quarter, as-of date, and rollup confidence"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Frame label="Quarter" value={SCORECARD.quarter} />
          <Frame label="As of" value={SCORECARD.asOf} />
          <Frame label="Objectives" value={`${SCORECARD.objectives.length}`} />
          <Frame label="Key results" value={`${krCount}`} />
        </div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "inline-block h-2.5 w-2.5 rounded-full",
              ROLLUP_DOT[SCORECARD.rollupConfidence],
            )}
          />
          <span
            className={cn(
              "font-mono text-[10.5px] uppercase tracking-[0.2em]",
              ROLLUP_TEXT[SCORECARD.rollupConfidence],
            )}
          >
            rollup · {SCORECARD.rollupConfidence} confidence
          </span>
        </div>
      </section>

      <p className="max-w-3xl font-serif text-[15.5px] leading-relaxed text-foreground/85">
        {SCORECARD.intro}
      </p>

      {/* Objectives stack */}
      <div className="space-y-8">
        {SCORECARD.objectives.map((objective, idx) => (
          <ObjectiveSection
            key={objective.id}
            objective={objective}
            index={idx}
          />
        ))}
      </div>

      {/* How I rate confidence */}
      <section className="rounded-md border border-border/60 bg-muted/20 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          How I rate confidence
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <RubricRow
            tone="high"
            title="High"
            body="Leading indicator is at or above the trajectory needed to land the KR by quarter close. No blockers logged."
          />
          <RubricRow
            tone="medium"
            title="Medium"
            body="Leading indicator is within striking distance, but a known blocker (a hire ramp, a partner timeline, a model in eval) still has to clear before the KR is safe."
          />
          <RubricRow
            tone="low"
            title="Low"
            body="Leading indicator is below trajectory, or the blocker is the kind of thing that doesn't move on quarter timelines: a single named champion, a procurement cycle, a hire that hasn't closed."
          />
        </div>
        <p className="mt-5 max-w-3xl font-serif text-[14px] leading-relaxed text-muted-foreground">
          The rollup is the worst of the four objective-level reads. A quarter
          is only as honest as the bet you&apos;re least sure about, and burying a
          medium under three highs is how scorecards stop being useful.
        </p>
      </section>
    </div>
  );
}

function Frame({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground/80">
        {label}
      </span>
      <span className="font-mono text-[12.5px] tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

function RubricRow({
  tone,
  title,
  body,
}: {
  tone: ConfidenceLevel;
  title: string;
  body: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn("inline-block h-2 w-2 rounded-full", ROLLUP_DOT[tone])}
        />
        <span
          className={cn(
            "font-mono text-[10.5px] uppercase tracking-[0.2em]",
            ROLLUP_TEXT[tone],
          )}
        >
          {title}
        </span>
      </div>
      <p className="text-pretty text-[13.5px] leading-relaxed text-foreground/85">
        {body}
      </p>
    </div>
  );
}
