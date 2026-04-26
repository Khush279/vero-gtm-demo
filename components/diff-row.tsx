/**
 * Pure presentational row for the /diff page. Renders one metric's
 * trajectory: name + source, four weekly values, three week-over-week
 * delta chips, and a bulleted annotation list. Server-safe; no hooks,
 * no client state.
 *
 * Tone mapping mirrors the rest of the demo: improving = forest,
 * watch = ochre, regressing = destructive. The chips are mono-cased
 * so they read as data, not as a celebration.
 */

import { cn } from "@/lib/utils";
import type { WeeklyDiff } from "@/data/metric-diffs";

function chipClasses(tone: "improving" | "watch" | "regressing"): string {
  if (tone === "improving") {
    return "border-forest-200 bg-forest-50 text-forest-700";
  }
  if (tone === "watch") {
    return "border-ochre-200 bg-ochre-50 text-ochre-700";
  }
  return "border-destructive/30 bg-destructive/10 text-destructive";
}

export function DiffRow({ diff }: { diff: WeeklyDiff }) {
  return (
    <section className="space-y-4 rounded-md border border-border/60 bg-card p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-[20px] font-light tracking-tight text-foreground">
          {diff.metric}
        </h2>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {diff.source}
        </div>
      </header>

      {/* Weekly value strip */}
      <div className="grid grid-cols-4 gap-px overflow-hidden rounded-sm border border-border/60 bg-border/60">
        {diff.values.map((v) => (
          <div
            key={v.week}
            className="flex flex-col gap-1 bg-card px-3 py-2.5"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Week {v.week}
            </div>
            <div className="font-display text-[22px] font-light leading-none tracking-tight tabular-nums text-foreground">
              {v.value}
            </div>
          </div>
        ))}
      </div>

      {/* WoW delta chips */}
      <div className="flex flex-wrap gap-2">
        {diff.weekOverWeek.map((wow) => (
          <span
            key={`${wow.from}-${wow.to}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tabular-nums",
              chipClasses(wow.tone),
            )}
          >
            <span className="text-[9px] uppercase tracking-[0.18em] opacity-70">
              W{wow.from}
              <span aria-hidden> → </span>
              <span className="sr-only"> to </span>W{wow.to}
            </span>
            <span>{wow.delta}</span>
          </span>
        ))}
      </div>

      {/* Annotations */}
      <ul className="space-y-3 pt-1">
        {diff.annotations.map((a) => (
          <li
            key={a.weekRange}
            className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-primary"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {a.weekRange}
            </div>
            <p className="mt-0.5 font-serif text-[14.5px] leading-relaxed text-foreground/85">
              {a.whatChanged}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DiffRow;
