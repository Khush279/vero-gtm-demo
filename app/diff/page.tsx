import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { DiffRow } from "@/components/diff-row";
import { Sparkline } from "@/components/sparkline";
import { WEEKLY_DIFFS } from "@/data/metric-diffs";

export const metadata: Metadata = {
  title: "Diff",
  description:
    "Week-over-week trajectory for the same six metrics on /metrics. Each move annotated where the cause is known.",
};

/**
 * /diff: zooms /metrics in by one zoom level. /metrics shows W1 vs W4
 * endpoints; this page lays out W1 -> W2 -> W3 -> W4 with the operator
 * notes that explain why the curve bends where it does.
 *
 * Top: dense 6-cell strip of trajectory sparklines so the founder gets
 * the shape in one glance. Below: a stacked section per metric with the
 * weekly values, three WoW chips, and the annotation list.
 *
 * Server component. Reads from /data/metric-diffs.ts. No client JS.
 */

function statusStrokeForTrajectory(values: { numeric: number | null }[], metric: string): string {
  // Use forest by default; switch to ochre if any WoW move is in the wrong
  // direction. Time-to-first-touch is lower-is-better; everything else is
  // higher-is-better.
  const lowerIsBetter = metric === "Time-to-first-touch (median)";
  const nums = values
    .map((v) => v.numeric)
    .filter((n): n is number => n !== null);
  let hasRegression = false;
  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i] - nums[i - 1];
    if (lowerIsBetter ? diff > 0 : diff < 0) {
      hasRegression = true;
      break;
    }
  }
  return hasRegression ? "#7a4c14" /* ochre-700 */ : "#234738" /* forest-700 */;
}

export default function DiffPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Week-over-week trajectory"
        title={<>The diff.</>}
        subtitle="Same metrics as /metrics, zoomed in by week. Each move annotated where the cause is known."
      />

      {/* Trajectory strip: one tiny 4-week sparkline per metric */}
      <section className="space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Trajectory · W1 to W4
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 sm:grid-cols-3 lg:grid-cols-6">
          {WEEKLY_DIFFS.map((d) => {
            const series = d.values
              .map((v) => v.numeric)
              .filter((n): n is number => n !== null);
            const stroke = statusStrokeForTrajectory(d.values, d.metric);
            const last = d.values[d.values.length - 1];
            return (
              <div
                key={d.metric}
                className="flex flex-col justify-between gap-2 bg-card p-3"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {d.metric}
                </div>
                <div className="font-display text-[18px] font-light leading-none tracking-tight tabular-nums text-foreground">
                  {last.value}
                </div>
                {series.length >= 2 ? (
                  <Sparkline
                    values={series}
                    width={84}
                    height={20}
                    strokeColor={stroke}
                    fillColor={stroke}
                    ariaLabel={`${d.metric} W1 to W4 trajectory`}
                  />
                ) : (
                  <div aria-hidden className="h-5 w-[84px]" />
                )}
                <div className="font-mono text-[9px] text-muted-foreground/70">
                  W1 {d.values[0].value}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stacked per-metric sections */}
      <section className="space-y-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          What changed and why · per metric
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {WEEKLY_DIFFS.map((d) => (
            <DiffRow key={d.metric} diff={d} />
          ))}
        </div>
      </section>

      <p className="max-w-2xl font-serif text-[14px] leading-relaxed text-muted-foreground">
        /metrics answers &ldquo;did the engine move?&rdquo; This page answers
        the next question: which week did each move happen, and what shipped
        that week to cause it. The annotations are the load-bearing content;
        the numbers are just the receipts.
      </p>
    </div>
  );
}
