/**
 * /changelog · the meta page. Wave-by-wave shipping log of the demo
 * itself, populated from data/changelog.ts and reconciled with
 * .swarm/state.json. A founder reading this surface sees: 13 waves
 * of fan-out swarm work shipped deliberately in 48 hours, with the
 * version-control discipline visible as a timeline.
 *
 * Server component. No interactivity, no client state.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ChangelogWaveCard } from "@/components/changelog-wave-card";
import { CHANGELOG } from "@/data/changelog";

export const metadata: Metadata = {
  title: "Changelog · how this got built",
  description:
    "Wave-by-wave shipping log of the Vero GTM demo. 13 waves, ~50 worker dispatches, 48 hours. The how-it-got-built is part of how I would build at Vero.",
};

export default function ChangelogPage() {
  const { intro, waves, totals } = CHANGELOG;
  const totalWaves = waves.length;
  // ~50 worker dispatches at ~5 min average each = ~4 worker-hours.
  const workerHours = 4;

  return (
    <div className="space-y-14">
      <PageHeader
        kicker="Wave by wave · the swarm history"
        title={<>How this got built.</>}
        subtitle="13 waves of fan-out swarm work, ~50 worker dispatches, 48 hours. The shipping log of the demo itself, because how I built this is part of how I'd build at Vero."
      />

      {/* Top stats strip: four numbers a founder skims first. */}
      <section
        aria-label="Build totals"
        className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-md border border-border/70 bg-card px-6 py-6 sm:grid-cols-4 md:px-10 md:py-8"
      >
        <TopStat
          label="User surfaces"
          value={totals.totalSurfaces}
          suffix="shipped"
        />
        <TopStat
          label="Vitest tests"
          value={totals.totalTests}
          suffix="passing"
        />
        <TopStat label="Waves" value={totalWaves} suffix="closed clean" />
        <TopStat
          label="Worker-hours"
          value={`~${workerHours}`}
          suffix="dispatched"
        />
      </section>

      <p className="max-w-2xl text-pretty font-serif text-[15px] leading-relaxed text-muted-foreground">
        {intro}
      </p>

      <div className="rule" />

      {/* Vertical timeline of waves. */}
      <section aria-label="Wave-by-wave log" className="space-y-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[24px] font-light leading-tight tracking-tight text-foreground md:text-[28px]">
            The waves.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Oldest first · running totals on the right
          </span>
        </div>

        <div className="space-y-12">
          {waves.map((wave) => (
            <ChangelogWaveCard key={wave.wave} wave={wave} />
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Totals card: the meta numbers + closing line on cadence. */}
      <section
        aria-label="Build totals"
        className="rounded-md border border-forest-700/25 bg-forest-50 px-6 py-9 md:px-10 md:py-12"
      >
        <div className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700/80">
          Totals
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          <TotalCell
            label="Surfaces"
            value={totals.totalSurfaces}
            sub="user-facing routes"
          />
          <TotalCell
            label="Tests"
            value={totals.totalTests}
            sub="vitest passing"
          />
          <TotalCell
            label="Commits"
            value={`~${totals.totalCommits}`}
            sub="estimated from waves"
          />
          <TotalCell
            label="Org limit hits"
            value={totals.workerHits}
            sub="across waves 5 to 7"
          />
          <TotalCell
            label="Span"
            value={totalWaves}
            sub={totals.timelineSpan}
          />
        </dl>

        <p className="mt-9 max-w-2xl text-pretty font-display-italic text-[18px] leading-snug tracking-tight text-forest-900 text-balance md:text-[20px]">
          Cadence: dispatch a wave, watch parallel workers commit against
          isolated routes, reconcile, run typecheck and tests, ship. The
          swarm was the loop; the loop was the discipline.
        </p>
      </section>
    </div>
  );
}

function TopStat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | string;
  suffix: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[36px] font-light leading-none tracking-tightest tabular-nums text-foreground md:text-[44px]">
          {value}
        </span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {suffix}
      </div>
    </div>
  );
}

function TotalCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub: string;
}) {
  return (
    <div className="space-y-1">
      <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-forest-700/80">
        {label}
      </dt>
      <dd className="space-y-0.5">
        <div className="font-display text-[28px] font-light leading-none tracking-tight tabular-nums text-forest-900 md:text-[32px]">
          {value}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest-700/70">
          {sub}
        </div>
      </dd>
    </div>
  );
}
