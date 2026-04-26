import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MetricsStrip } from "@/components/metrics-strip";
import { DeltaTable } from "@/components/delta-table";
import { WEEK_1_METRICS, WEEK_4_METRICS } from "@/data/metrics-dashboard";

export const metadata: Metadata = {
  title: "Metrics",
  description:
    "Week 1 and week 4 of the GTM engine, side by side, with the delta column and a short note on what moved each number.",
};

/**
 * /metrics: trajectory view. /strategy already shows the week-1 strip; this
 * page pairs it with week 4 so the founder reading along can see the second
 * derivative, not just the snapshot. Numbers are illustrative and the
 * annotation panel underneath explains which weeks 2-3 work caused which
 * week-4 movement.
 *
 * Server component. Pure presentation over the dashboard data module.
 */

type Annotation = {
  metric: string;
  note: string;
};

const ANNOTATIONS: Annotation[] = [
  {
    metric: "Reply rate +1.2pt",
    note: "EMR-native first-line variant rolled out in week 3 to the top-30 ICP cohort. Subject-line A/B in week 2 narrowed the field to two winners; the EMR-aware opener compounded on top of that.",
  },
  {
    metric: "Weekly send volume +391%",
    note: "Sequence builder hardened in week 2 so a single operator can queue a full ICP slice in one sitting. Week 3 added the Attio-to-Postmark bridge that removes the manual export step.",
  },
  {
    metric: "Demo book rate +3pt",
    note: "Calendar slot density doubled mid-week 3 once the inbound parser started auto-tagging replies as demo-intent. Fewer threads sitting overnight, fewer leads cooling off.",
  },
  {
    metric: "Trial start rate +4pt",
    note: "Post-demo trigger added in week 2 sends the trial provisioning link inside fifteen minutes of the call ending. Week 3 follow-up template references the exact pain the prospect named on the demo.",
  },
  {
    metric: "Time-to-first-touch −2m",
    note: "Vercel cron interval cut from 10m to 5m in week 2. Week 3 added the lead-scoring shortcut so high-fit signups skip the queue and get the first reply almost instantly.",
  },
];

export default function MetricsPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="JD: Reporting · pipeline math · attribution"
        title={<>The dashboard.</>}
        subtitle="Week 1 and week 4 of the GTM engine running at projected cadence. Numbers are illustrative. Day-1 work is wiring this to live Attio + Stripe + Search Console pulls."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <MetricsStrip caption="Week 1 · standing start" metrics={WEEK_1_METRICS} />
        <MetricsStrip caption="Week 4 · one iteration in" metrics={WEEK_4_METRICS} />
      </div>

      <DeltaTable week1={WEEK_1_METRICS} week4={WEEK_4_METRICS} />

      <section className="space-y-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          What changed and why
        </div>
        <div className="rounded-md border border-border/60 bg-card p-6">
          <ul className="space-y-4">
            {ANNOTATIONS.map((a) => (
              <li
                key={a.metric}
                className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-primary"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
                  {a.metric}
                </div>
                <p className="mt-1 font-serif text-[15px] leading-relaxed text-foreground/85">
                  {a.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <p className="max-w-2xl font-serif text-[14px] leading-relaxed text-muted-foreground">
          The point of this page is the second derivative. A founder reading
          the strategy memo can see the week-1 numbers and squint. A founder
          reading this page can see whether the engine is accelerating, and
          which specific change in weeks 2 and 3 paid for the movement.
        </p>
      </section>
    </div>
  );
}
