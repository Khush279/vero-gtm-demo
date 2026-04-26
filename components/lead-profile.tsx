/**
 * Pure presentational profile card for a single lead. Server-rendered.
 * Mirrors the editorial pattern: mono small-caps section labels, display
 * type for the headline value, serif for prose. No interactivity here —
 * the right-hand SequencePane owns all of that.
 */

import { cn } from "@/lib/utils";
import {
  EMR_LABELS,
  PIPELINE_STAGES,
  SEGMENT_LABELS,
  type Lead,
} from "@/lib/types";

const REFERENCE_YEAR = 2026;

function stageLabel(stage: Lead["stage"]): string {
  return PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

function competitorNote(count: number): string {
  if (count <= 0) return "No Tali / Heidi mentions within 5km. Green-field market.";
  if (count === 1) return `1 Tali / Heidi mention within 5km. Light competitive pressure.`;
  if (count === 2) return `2 Tali / Heidi mentions within 5km. Moderate competitive pressure.`;
  return `${count} Tali / Heidi mentions within 5km. Competitive pressure: high.`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </div>
  );
}

export function LeadProfile({ lead }: { lead: Lead }) {
  const yearsInPractice = Math.max(0, REFERENCE_YEAR - lead.yearRegistered);
  const stageBadgeTone =
    lead.stage === "customer" || lead.stage === "trialing"
      ? "bg-forest-100 text-forest-800 ring-forest-200"
      : lead.stage === "closed_lost"
        ? "bg-muted text-muted-foreground ring-border"
        : lead.stage === "demo_booked" || lead.stage === "replied"
          ? "bg-ochre-100 text-ochre-800 ring-ochre-200"
          : "bg-secondary text-secondary-foreground ring-border";

  return (
    <article className="relative rounded-2xl border border-border/70 bg-card p-7 shadow-sm">
      {/* Stage badge top-right */}
      <span
        className={cn(
          "absolute right-5 top-5 inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ring-1",
          stageBadgeTone,
        )}
      >
        {stageLabel(lead.stage)}
      </span>

      <div className="space-y-2 pr-24">
        <SectionLabel>Profile</SectionLabel>
        <h2 className="font-display text-[26px] leading-tight tracking-tight text-foreground">
          {lead.name}
        </h2>
        <p className="text-[14px] text-muted-foreground">
          {lead.specialty} · registered {lead.yearRegistered} ·{" "}
          <span className="text-foreground">{yearsInPractice}</span> yrs in practice
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <SectionLabel>Languages</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {lead.languages.length === 0 ? (
              <span className="text-[13px] text-muted-foreground">Not listed</span>
            ) : (
              lead.languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11.5px] text-secondary-foreground"
                >
                  {lang}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <SectionLabel>Segment</SectionLabel>
          <div className="text-[13.5px] text-foreground">
            {SEGMENT_LABELS[lead.segment]}
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <SectionLabel>Practice address</SectionLabel>
          <div className="text-[13.5px] text-foreground">{lead.practiceAddress}</div>
          <div className="text-[12.5px] text-muted-foreground">{lead.city}</div>
        </div>

        <div className="space-y-2">
          <SectionLabel>Inferred EMR</SectionLabel>
          <div className="text-[13.5px] text-foreground">{EMR_LABELS[lead.inferredEmr]}</div>
          <div className="text-[11.5px] text-muted-foreground">
            heuristic from clinic name + region
          </div>
        </div>

        <div className="space-y-2">
          <SectionLabel>ICP score</SectionLabel>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[28px] leading-none tracking-tight text-forest-700">
              {lead.score}
            </span>
            <span className="text-[12px] text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-border/60 pt-5">
        <SectionLabel>Nearby competitors</SectionLabel>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[20px] leading-none tracking-tight text-foreground">
            {lead.nearbyCompetitorPresence}
          </span>
          <span className="text-[12px] text-muted-foreground">within ~5km</span>
        </div>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          {competitorNote(lead.nearbyCompetitorPresence)}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>source · CPSO public register</span>
        <span>id · {lead.id}</span>
      </div>
    </article>
  );
}

export default LeadProfile;
