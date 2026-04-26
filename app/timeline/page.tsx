import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { TimelineGantt } from "@/components/timeline-gantt";
import {
  LANE_DESCRIPTION,
  LANE_LABEL,
  MILESTONES,
  type Lane,
  type Milestone,
} from "@/data/timeline";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "The 90-day GTM plan rendered as a four-lane gantt. Outbound, content, enterprise, hire #2. Every milestone, every dependency, every metric.",
};

/**
 * /timeline. Server component.
 *
 * The /strategy page is the prose memo. /timeline is the same plan as a
 * scannable visual: four swimlanes (outbound, content, enterprise, hire),
 * 90-day x-axis, weekly tick marks, Day-30 and Day-60 phase guides, and a
 * per-week card list underneath for the detail.
 *
 * No chart library. The chart is a pure inline SVG shipped from
 * components/timeline-gantt.tsx.
 */

export default function TimelinePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        kicker="The 90-day plan as a chart"
        title={<>The runway, scheduled.</>}
        subtitle="Every milestone, every dependency, every metric. Click a milestone to see the detail; lanes color-coded for scan."
      />

      <TimelineGantt milestones={MILESTONES} />

      <Legend />

      <WeeklyBreakdown milestones={MILESTONES} />
    </div>
  );
}

/* --------------------------------- Legend -------------------------------- */

function Legend() {
  const items = [
    {
      label: "Solid bar = planned or shipped",
      detail:
        "Filled lane color is a committed milestone with a clear owner and a date.",
    },
    {
      label: "Dashed border = in progress",
      detail:
        "Started but not done. Reply rate, RFP turnaround, content drafts in flight.",
    },
    {
      label: "Diagonal stripe = blocked",
      detail:
        "Waiting on something external. VoR confirmation, OntarioMD partnership review.",
    },
    {
      label: "Vertical guides = phase boundaries",
      detail:
        "Day 30 and Day 60 are the strategy-memo checkpoints. The targets at each gate are in /strategy.",
    },
  ];
  return (
    <section className="rounded-lg border border-border/60 bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[18px] tracking-tight text-foreground">
          What you&apos;re looking at.
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Legend
        </span>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex gap-3 rounded-md border border-border/40 bg-background/60 p-3"
          >
            <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <div className="space-y-0.5">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground">
                {it.label}
              </div>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                {it.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ----------------------------- Weekly breakdown -------------------------- */

/** Group milestones into named week-buckets so the list reads as a memo,
 * not a flat dump. Buckets are inclusive on both ends. */
const WEEK_BUCKETS: { label: string; startDay: number; endDay: number }[] = [
  { label: "Week 1", startDay: 1, endDay: 7 },
  { label: "Week 2–3", startDay: 8, endDay: 21 },
  { label: "Week 4 (Day 30)", startDay: 22, endDay: 30 },
  { label: "Weeks 5–6", startDay: 31, endDay: 45 },
  { label: "Weeks 7–8 (Day 60)", startDay: 46, endDay: 60 },
  { label: "Weeks 9–10", startDay: 61, endDay: 75 },
  { label: "Weeks 11–13 (Day 90)", startDay: 76, endDay: 90 },
];

function WeeklyBreakdown({ milestones }: { milestones: Milestone[] }) {
  const buckets = WEEK_BUCKETS.map((b) => ({
    ...b,
    items: milestones.filter(
      (m) => m.startDay >= b.startDay && m.startDay <= b.endDay,
    ),
  })).filter((b) => b.items.length > 0);

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[22px] tracking-tight text-foreground">
          Milestones by week.
        </h2>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {milestones.length} total
        </span>
      </div>

      <div className="space-y-6">
        {buckets.map((b) => (
          <div key={b.label} className="space-y-3">
            <div className="flex items-baseline gap-3 border-b border-border/60 pb-2">
              <span className="font-display text-[15px] tracking-tight text-foreground">
                {b.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Day {b.startDay}–{b.endDay} · {b.items.length} item
                {b.items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {b.items.map((m) => (
                <MilestoneCard key={m.id} milestone={m} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note: lane descriptions, since the gantt's lane labels are
          terse. */}
      <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          The four lanes
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {(Object.keys(LANE_LABEL) as Lane[]).map((lane) => (
            <li key={lane} className="flex items-start gap-3">
              <LaneSwatch lane={lane} />
              <div>
                <div className="font-display text-[14px] tracking-tight text-foreground">
                  {LANE_LABEL[lane]}
                </div>
                <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                  {LANE_DESCRIPTION[lane]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <article className="rounded-md border border-border/60 bg-card p-4 transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between gap-2">
        <LaneChip lane={milestone.lane} />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Day {milestone.startDay}–{milestone.endDay}
        </span>
      </div>
      <h3 className="mt-2 font-display text-[15px] leading-tight tracking-tight text-foreground">
        {milestone.title}
      </h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/80">
        {milestone.description}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <StatusBadge status={milestone.status} />
        {milestone.metric ? (
          <span className="font-mono text-[10.5px] text-muted-foreground">
            <span className="uppercase tracking-[0.16em]">Target</span> ·{" "}
            <span className="text-foreground/85">{milestone.metric}</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}

function LaneChip({ lane }: { lane: Lane }) {
  const cls = cn(
    "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
    lane === "outbound" && "bg-forest-200 text-forest-800 border-forest-300/60",
    lane === "content" && "bg-ochre-100 text-ochre-700 border-ochre-300/60",
    lane === "enterprise" &&
      "bg-primary text-primary-foreground border-primary/40",
    lane === "hire" && "bg-secondary text-secondary-foreground border-border/60",
  );
  return <span className={cls}>{LANE_LABEL[lane]}</span>;
}

function LaneSwatch({ lane }: { lane: Lane }) {
  const cls = cn(
    "mt-1 h-3 w-3 shrink-0 rounded-sm border",
    lane === "outbound" && "bg-forest-400 border-forest-500",
    lane === "content" && "bg-ochre-400 border-ochre-500",
    lane === "enterprise" && "bg-primary border-primary",
    lane === "hire" && "bg-secondary border-border/60",
  );
  return <span aria-hidden className={cls} />;
}

function StatusBadge({ status }: { status: Milestone["status"] }) {
  const map: Record<
    Milestone["status"],
    { label: string; className: string }
  > = {
    planned: {
      label: "Planned",
      className: "bg-muted text-muted-foreground border border-border/60",
    },
    "in-progress": {
      label: "In progress",
      className:
        "bg-background text-primary border border-primary/40 border-dashed",
    },
    shipped: {
      label: "Shipped",
      className: "bg-forest-200 text-forest-800 border border-forest-300/60",
    },
    blocked: {
      label: "Blocked",
      className: "bg-destructive/10 text-destructive border border-destructive/30",
    },
  };
  const s = map[status];
  return (
    <span
      className={cn(
        "rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        s.className,
      )}
    >
      {s.label}
    </span>
  );
}
