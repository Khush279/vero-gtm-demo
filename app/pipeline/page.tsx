/**
 * /pipeline — Attio-style CRM Kanban for Vero's Ontario outbound motion.
 *
 * Server component: imports the seeded LEADS, computes the per-stage roll-up
 * (count + ARR-at-risk weighted by stage convert rate), then hands the array
 * to the client board for filters and drag-and-drop.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PipelineBoard } from "@/components/pipeline-board";
import { LEADS } from "@/data/leads";
import {
  PIPELINE_STAGES,
  type Lead,
  type PipelineStage,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Pipeline",
  description:
    "Attio-style CRM board for 500 Ontario family physicians from the CPSO public register, scored and stage-bucketed with weighted ARR roll-up.",
};

/** Vero list price baseline used in the strategy memo: $720 CAD ARR / seat. */
const ARR_PER_LEAD = 720;

/**
 * Stage-weighted convert rates. Pulled from the plan; these are illustrative
 * for the demo, footnoted as such on the page. The point is showing that the
 * pipeline view exposes ARR-at-risk, not just lead counts.
 */
const STAGE_CONVERT_RATE: Record<PipelineStage, number> = {
  new: 0.02,
  researching: 0.05,
  contacted: 0.08,
  replied: 0.2,
  demo_booked: 0.35,
  trialing: 0.55,
  customer: 1.0,
  closed_lost: 0,
};

function rollUp(leads: Lead[]) {
  const counts: Record<PipelineStage, number> = {
    new: 0,
    researching: 0,
    contacted: 0,
    replied: 0,
    demo_booked: 0,
    trialing: 0,
    customer: 0,
    closed_lost: 0,
  };
  for (const l of leads) counts[l.stage] += 1;
  let arrAtRisk = 0;
  for (const stage of Object.keys(counts) as PipelineStage[]) {
    arrAtRisk += counts[stage] * ARR_PER_LEAD * STAGE_CONVERT_RATE[stage];
  }
  return { counts, arrAtRisk };
}

function fmtCAD(n: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function PipelinePage() {
  const { counts, arrAtRisk } = rollUp(LEADS);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="JD: Architect and own the CRM"
        title={<>The pipeline.</>}
        subtitle="Eight stages, seeded from the CPSO public register. Drag to reassign; state is in-memory so the demo resets on reload. Score, segment, and specialty filters narrow the board the way you'd work it on a Monday."
      />

      {/* Roll-up strip */}
      <div className="rounded-lg border border-border/60 bg-card">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-4 py-4 sm:grid-cols-4 lg:grid-cols-9">
          {PIPELINE_STAGES.map(({ id, label }) => (
            <div key={id} className="min-w-0">
              <div className="truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </div>
              <div className="mt-1 font-display text-[22px] tabular-nums leading-none text-foreground">
                {counts[id].toLocaleString()}
              </div>
              <div className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground/80">
                {(STAGE_CONVERT_RATE[id] * 100).toFixed(0)}% convert
              </div>
            </div>
          ))}
          <div className="min-w-0 border-t border-border/40 pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0 lg:border-l">
            <div className="truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              ARR at risk
            </div>
            <div
              className="mt-1 font-display text-[22px] tabular-nums leading-none text-foreground"
              title="Sum of count × $720 ARR × stage convert rate"
            >
              {fmtCAD(arrAtRisk)}
            </div>
            <div className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground/80">
              ${ARR_PER_LEAD}/seat · weighted
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
          Convert rates illustrative; replace with cohort math from Attio in
          week 1
        </div>
      </div>

      <PipelineBoard leads={LEADS} />
    </div>
  );
}
