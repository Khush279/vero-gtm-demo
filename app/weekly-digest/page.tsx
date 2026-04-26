/**
 * /weekly-digest — the Friday-5pm artifact a GTM engineer ships to founders
 * every week. Pure server component. No JS beyond what the rest of the demo
 * already loads. Native <details> for the section accordions so the page
 * stays accessible and works without hydration.
 *
 * The digest is what Adeel and Bill should be able to read in 90 seconds
 * standing in a kitchen: topline, six metrics with sparklines, three charts,
 * a 3-row experiment table, the wins/misses/risks/asks/next sections, and a
 * single forest-tinted CEO callout at the bottom.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Sparkline } from "@/components/sparkline";
import { BarChart, DonutChart, TrendLineChart } from "@/components/digest-charts";
import { DIGEST } from "@/data/weekly-digest";
import type { DigestExperiment, DigestMetric, DigestSection } from "@/data/weekly-digest";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Weekly digest",
  description:
    "The Friday founder-facing digest the GTM engineer would send Adeel and Bill every week. Topline, metrics, charts, experiments, asks, and a one-slide CEO summary.",
};

export default function WeeklyDigestPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Founder-facing artifact · every Friday 5pm"
        title={<>Weekly digest — week 4.</>}
        subtitle="What shipped, what didn't, the asks. The thing Adeel and Bill should be able to read in 90 seconds standing in a kitchen."
      />

      <Hero />

      <MetricGrid metrics={DIGEST.metrics} />

      <ChartsRow />

      <Sections sections={DIGEST.sections} />

      <Experiments experiments={DIGEST.experiments} />

      <CeoCallout body={DIGEST.oneSlideForCEO} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero — weekOf, weekNumber, topline                                 */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="rounded-md border border-border/60 bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Week {String(DIGEST.weekNumber).padStart(2, "0")} · {DIGEST.weekOf}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest-700">
          to: adeel@veroscribe.com, bill@veroscribe.com
        </div>
      </div>
      <h2 className="mt-3 max-w-3xl font-display text-[22px] font-light leading-snug tracking-tight text-foreground md:text-[26px]">
        {DIGEST.topline}
      </h2>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric grid — 6 cells with sparklines                              */
/* ------------------------------------------------------------------ */

function MetricGrid({ metrics }: { metrics: DigestMetric[] }) {
  return (
    <section className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Snapshot · the same six numbers as /metrics
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <MetricCell key={m.label} metric={m} />
        ))}
      </div>
    </section>
  );
}

function MetricCell({ metric }: { metric: DigestMetric }) {
  const tone =
    metric.status === "on-track"
      ? "text-forest-700"
      : metric.status === "watch"
        ? "text-ochre-700"
        : "text-destructive";
  const stroke =
    metric.status === "on-track"
      ? "#234738"
      : metric.status === "watch"
        ? "#7a4c14"
        : "hsl(var(--destructive))";
  return (
    <div className="flex flex-col justify-between gap-2 bg-card p-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {metric.label}
      </div>
      <div className="font-display text-[22px] font-light leading-none tracking-tight tabular-nums text-foreground">
        {metric.value}
      </div>
      <Sparkline
        values={metric.trend}
        width={72}
        height={18}
        strokeColor={stroke}
        fillColor={stroke}
        ariaLabel={`${metric.label} 4-week trend`}
      />
      <div className={cn("text-xs tabular-nums", tone)}>{metric.deltaText}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Charts row — bar, donut, trend line                                */
/* ------------------------------------------------------------------ */

function ChartsRow() {
  return (
    <section className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Three charts · cohort, channel, trajectory
      </div>
      <div className="grid gap-4 rounded-md border border-border/60 bg-card p-4 md:grid-cols-3 md:p-6">
        <div className="flex justify-center">
          <BarChart />
        </div>
        <div className="flex justify-center border-t border-border/40 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <DonutChart />
        </div>
        <div className="flex justify-center border-t border-border/40 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <TrendLineChart />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections — collapsible wins/misses/risks/asks/next                 */
/* ------------------------------------------------------------------ */

function Sections({ sections }: { sections: DigestSection[] }) {
  return (
    <section className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        The narrative · click to expand
      </div>
      <div className="overflow-hidden rounded-md border border-border/60 bg-card">
        {sections.map((s, i) => (
          <details
            key={s.id}
            open={i < 2}
            className="group border-b border-border/50 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] font-medium leading-snug text-foreground">
                  {s.heading}
                </span>
              </div>
              <span
                aria-hidden
                className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              >
                <svg
                  viewBox="0 0 12 12"
                  width={12}
                  height={12}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 4.5 6 7.5 9 4.5" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 pl-[3.25rem] pr-10">
              <MarkdownLite text={s.body} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/**
 * Renders the markdown-lite section bodies. Splits on newlines, treats lines
 * starting with "- " as bullets, and inlines **bold** spans. Intentionally
 * tiny so the digest data shape stays simple and there is no markdown lib in
 * the bundle.
 */
function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const bullets = lines.filter((l) => l.trimStart().startsWith("- "));
  const isAllBullets = bullets.length === lines.length && lines.length > 0;

  if (isAllBullets) {
    return (
      <ul className="space-y-2">
        {lines.map((line, i) => (
          <li
            key={i}
            className="relative pl-4 text-pretty text-[13.5px] leading-relaxed text-foreground/85 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-forest-500"
          >
            {renderInline(line.replace(/^\s*-\s+/, ""))}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2 text-pretty text-[13.5px] leading-relaxed text-foreground/85">
      {lines.map((line, i) =>
        line.trimStart().startsWith("- ") ? (
          <div
            key={i}
            className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-forest-500"
          >
            {renderInline(line.replace(/^\s*-\s+/, ""))}
          </div>
        ) : (
          <p key={i}>{renderInline(line)}</p>
        ),
      )}
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  // Split on **bold** markers, keep delimiters via a capturing group.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* ------------------------------------------------------------------ */
/*  Experiments — tight 3-row table                                    */
/* ------------------------------------------------------------------ */

function Experiments({ experiments }: { experiments: DigestExperiment[] }) {
  return (
    <section className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Experiments in flight
      </div>
      <div className="overflow-hidden rounded-md border border-border/60 bg-card">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <th className="px-4 py-2.5 font-normal">Experiment</th>
              <th className="px-4 py-2.5 font-normal">Status</th>
              <th className="px-4 py-2.5 font-normal">Result so far</th>
              <th className="px-4 py-2.5 font-normal">Next action</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((e) => (
              <tr
                key={e.name}
                className="border-b border-border/40 align-top last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {e.name}
                </td>
                <td className="px-4 py-3">
                  <ExperimentStatus status={e.status} />
                </td>
                <td className="px-4 py-3 text-foreground/80">
                  {e.result ?? <span className="text-muted-foreground">·</span>}
                </td>
                <td className="px-4 py-3 text-foreground/80">{e.nextAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ExperimentStatus({ status }: { status: DigestExperiment["status"] }) {
  const tone =
    status === "running"
      ? "bg-forest-100 text-forest-700"
      : status === "decided"
        ? "bg-secondary text-secondary-foreground"
        : "bg-ochre-100 text-ochre-700";
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em]",
        tone,
      )}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  CEO callout — forest-tinted one-slide                              */
/* ------------------------------------------------------------------ */

function CeoCallout({ body }: { body: string }) {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\s*-\s+/, ""));
  return (
    <section className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        One slide for the CEO
      </div>
      <div className="rounded-md border border-forest-300/60 bg-forest-50 p-6 md:p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest-700">
          If Adeel only reads four bullets
        </div>
        <ul className="mt-4 space-y-3">
          {lines.map((line, i) => (
            <li
              key={i}
              className="relative pl-5 font-serif text-[15px] leading-relaxed text-forest-900 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-forest-700"
            >
              {renderInline(line)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
