import { cn } from "@/lib/utils";
import type { MetricSnapshot } from "@/data/metrics-dashboard";
import { Sparkline } from "@/components/sparkline";
import { generateTrend, parseMetricValue } from "@/lib/series";

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

  // Sparkline color tracks the same status palette as the delta line so the
  // strip reads as one mood per cell. We only render it when the value
  // string parses to a number.
  const sparkColor =
    metric.status === "on-track"
      ? "#234738" // forest-700
      : metric.status === "watch"
        ? "#7a4c14" // ochre-700
        : "hsl(var(--destructive))";

  const parsed = parseMetricValue(metric.value);
  const series =
    parsed !== null
      ? generateTrend(parsed * 0.7, parsed, 4, 0.05, metric.label)
      : null;

  return (
    <div className="flex flex-col justify-between gap-2 bg-card p-3">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {metric.label}
      </div>
      <div className="font-display text-[22px] font-light leading-none tracking-tight tabular-nums text-foreground">
        {metric.value}
      </div>
      {series ? (
        <Sparkline
          values={series}
          width={72}
          height={18}
          strokeColor={sparkColor}
          fillColor={sparkColor}
          ariaLabel={`${metric.label} 4-week trend`}
        />
      ) : null}
      <div className="space-y-0.5">
        {metric.deltaFromBaseline ? (
          <div className={cn("text-xs tabular-nums", deltaTone)}>
            {metric.deltaFromBaseline}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground/40">–</div>
        )}
        <div className="font-mono text-[9px] text-muted-foreground/70">
          {metric.source}
        </div>
      </div>
    </div>
  );
}

export default MetricsStrip;
