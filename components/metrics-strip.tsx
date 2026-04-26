import { cn } from "@/lib/utils";
import type { MetricSnapshot } from "@/data/metrics-dashboard";

/**
 * Dense 6-cell metric strip used at the top of the strategy page. Each cell
 * is small and quiet on its own; the strip reads as one number row, not as a
 * dashboard. Status drives the delta tone: on-track in forest, watch in
 * ochre, off-track in destructive.
 */
export function MetricsStrip({
  metrics,
  caption,
}: {
  metrics: MetricSnapshot[];
  caption?: string;
}) {
  return (
    <section className="space-y-3">
      {caption ? (
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {caption}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <Cell key={m.label} metric={m} />
        ))}
      </div>
    </section>
  );
}

function Cell({ metric }: { metric: MetricSnapshot }) {
  const deltaTone =
    metric.status === "on-track"
      ? "text-forest-700"
      : metric.status === "watch"
        ? "text-ochre-700"
        : "text-destructive";
  return (
    <div className="flex flex-col justify-between gap-2 bg-card p-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {metric.label}
      </div>
      <div className="font-display text-[22px] font-light leading-none tracking-tight tabular-nums text-foreground">
        {metric.value}
      </div>
      <div className="space-y-0.5">
        {metric.deltaFromBaseline ? (
          <div className={cn("text-xs tabular-nums", deltaTone)}>
            {metric.deltaFromBaseline}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground/40">—</div>
        )}
        <div className="font-mono text-[9px] text-muted-foreground/70">
          {metric.source}
        </div>
      </div>
    </div>
  );
}

export default MetricsStrip;
