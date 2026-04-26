/**
 * /experiments — five week-1 GTM experiments, each instrumented enough to
 * call in 10 days. Server component; the only interactive bit (the run-order
 * toggle and the per-card collapse) lives inside ExperimentList, which is a
 * client component.
 *
 * Cross-references the strategy memo: subject-line, EMR personalization, and
 * pricing-framing experiments expand the bullets in /strategy.md into
 * structured, runnable test plans.
 */

import { EXPERIMENTS } from "@/data/experiments";
import { ExperimentList } from "@/components/experiment-card";
import { PageHeader } from "@/components/page-header";

export default function ExperimentsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Ship · measure · refine"
        title={<>Five experiments. Week one.</>}
        subtitle="Each one is small enough to ship in a day, instrumented enough to call in 10 days."
      />

      <TotalsRow />

      <ExperimentList experiments={EXPERIMENTS} />
    </div>
  );
}

function TotalsRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      <span>
        <span className="tabular-nums text-foreground">5</span> experiments
      </span>
      <span aria-hidden className="text-muted-foreground/40">·</span>
      <span>
        <span className="tabular-nums text-foreground">~$300</span> incremental cost
      </span>
      <span aria-hidden className="text-muted-foreground/40">·</span>
      <span>
        <span className="tabular-nums text-foreground">6 weeks</span> of cadence to run sequentially
      </span>
    </div>
  );
}
