/**
 * ChangelogWaveCard · pure presentational. One wave entry on /changelog.
 * Layout: a left rail with the big mono "WAVE NN" stamp, and a right
 * column with the timestamp, worker-count chip, ordered shipping list,
 * the italic notableMoment line, and a counter strip with running totals.
 *
 * Server component. No client state, no interactivity. Tone matches
 * /retro and /board-deck: serif body, mono kickers, display-italic for
 * the load-bearing one-liner.
 */

import type { ChangelogWave } from "@/data/changelog";

export function ChangelogWaveCard({ wave }: { wave: ChangelogWave }) {
  return (
    <article className="grid grid-cols-1 gap-x-10 gap-y-6 border-t border-border/60 pt-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr]">
      {/* Left rail: the big mono wave stamp. */}
      <aside className="space-y-2">
        <div className="font-mono text-[36px] font-light leading-none tracking-tight tabular-nums text-foreground md:text-[44px]">
          WAVE
        </div>
        <div className="font-mono text-[44px] font-light leading-none tracking-tight tabular-nums text-ochre-600 md:text-[56px]">
          {String(wave.wave).padStart(2, "0")}
        </div>
        <div className="pt-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {wave.shippedAt}
        </div>
      </aside>

      {/* Right column. */}
      <div className="space-y-5">
        <header className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-forest-700/30 bg-forest-50 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-forest-800 tabular-nums">
            {wave.workerCount} workers
          </span>
          <span className="inline-flex items-center rounded-full border border-border/70 bg-card px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {wave.shipped.length} shipped
          </span>
        </header>

        <ol className="space-y-2.5">
          {wave.shipped.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] gap-x-4 text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/85"
            >
              <span
                aria-hidden
                className="font-mono text-[10.5px] uppercase tracking-[0.2em] tabular-nums text-muted-foreground/80 pt-[5px]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <p className="font-display-italic text-[16.5px] leading-snug tracking-tight text-foreground/90 text-balance md:text-[18px]">
          {wave.notableMoment}
        </p>

        {/* Counter strip: running totals. */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-border/60 pt-4 sm:grid-cols-3">
          <CounterCell
            label="Surfaces"
            value={wave.surfaceCount}
            suffix="live"
          />
          <CounterCell
            label="Tests"
            value={wave.testCount}
            suffix="passing"
          />
          <CounterCell
            label="Workers this wave"
            value={wave.workerCount}
            suffix="dispatched"
          />
        </dl>
      </div>
    </article>
  );
}

function CounterCell({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="space-y-0.5">
      <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="flex items-baseline gap-1.5">
        <span className="font-display text-[20px] font-light leading-none tracking-tight tabular-nums text-foreground">
          {value}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {suffix}
        </span>
      </dd>
    </div>
  );
}

export default ChangelogWaveCard;
