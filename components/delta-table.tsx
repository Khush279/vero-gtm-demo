import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricSnapshot, MetricStatus } from "@/data/metrics-dashboard";

/**
 * Editorial delta table. Pairs each WEEK_1 row with its WEEK_4 counterpart,
 * computes the delta from the printed values, and tags whether the move is
 * an improvement based on a per-metric BETTER_DIRECTION lookup. Numbers are
 * tabular and mono so the column reads as one block, not as six independent
 * lines.
 *
 * The "improvement" call is intentional, not derived: time-to-first-touch
 * gets lower-is-better, every other metric in the current dashboard gets
 * higher-is-better. Status chip is sourced from the WEEK_4 snapshot.
 */

type Direction = "up" | "down";

/**
 * Per-metric "which way is good." Hard-coded so the table never has to guess.
 * If a new metric label is added to the dashboard data, default to "up".
 */
const BETTER_DIRECTION: Record<string, Direction> = {
  "Weekly send volume": "up",
  "Reply rate": "up",
  "Demo book rate": "up",
  "Trial start rate": "up",
  "ARR added": "up",
  "Time-to-first-touch (median)": "down",
};

/**
 * Parse the leading numeric portion of a metric value string. Strips $, %,
 * commas, and trailing unit letters like "m" (minutes). Returns null for
 * values we can't parse so the row falls back to a flat dash.
 */
function parseNumeric(raw: string): number | null {
  const cleaned = raw.replace(/[$,]/g, "").trim();
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Detect the unit suffix so the delta we render matches the source value.
 * "$11,520" → "$"; "5.9%" → "%"; "8m" → "m"; "212" → "".
 */
function detectUnit(raw: string): { prefix: string; suffix: string } {
  const prefix = raw.startsWith("$") ? "$" : "";
  const suffixMatch = raw.match(/[a-zA-Z%]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : "";
  return { prefix, suffix };
}

function formatDelta(week1: string, week4: string): {
  text: string;
  rawSign: "pos" | "neg" | "flat";
} {
  const a = parseNumeric(week1);
  const b = parseNumeric(week4);
  if (a === null || b === null) return { text: "–", rawSign: "flat" };
  const diff = b - a;
  if (diff === 0) return { text: "0", rawSign: "flat" };
  const { prefix, suffix } = detectUnit(week4);
  const sign = diff > 0 ? "+" : "−";
  const absVal = Math.abs(diff);
  // Keep one decimal if either input had one; otherwise integer.
  const hasDecimal = /\./.test(week1) || /\./.test(week4);
  const formatted = hasDecimal
    ? absVal.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    : absVal.toLocaleString("en-US");
  return {
    text: `${sign}${prefix}${formatted}${suffix}`,
    rawSign: diff > 0 ? "pos" : "neg",
  };
}

function statusChipClasses(status: MetricStatus): string {
  if (status === "on-track") {
    return "border-forest-200 bg-forest-50 text-forest-700";
  }
  if (status === "watch") {
    return "border-ochre-200 bg-ochre-50 text-ochre-700";
  }
  return "border-destructive/30 bg-destructive/10 text-destructive";
}

function statusLabel(status: MetricStatus): string {
  if (status === "on-track") return "on track";
  if (status === "watch") return "watch";
  return "off track";
}

export function DeltaTable({
  week1,
  week4,
}: {
  week1: MetricSnapshot[];
  week4: MetricSnapshot[];
}) {
  // Pair by label. WEEK_1 is the source of truth for ordering; if a label is
  // missing on the WEEK_4 side, render a dash row rather than dropping it.
  const week4ByLabel = new Map(week4.map((m) => [m.label, m]));

  return (
    <section className="space-y-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Week 1 to week 4 · delta
      </div>
      <div className="overflow-hidden rounded-md border border-border/60 bg-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <Th className="w-[34%]">Metric</Th>
              <Th className="w-[14%] text-right">Week 1</Th>
              <Th className="w-[14%] text-right">Week 4</Th>
              <Th className="w-[18%] text-right">Delta</Th>
              <Th className="w-[20%] text-right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {week1.map((w1) => {
              const w4 = week4ByLabel.get(w1.label);
              const direction = BETTER_DIRECTION[w1.label] ?? "up";
              const delta = w4
                ? formatDelta(w1.value, w4.value)
                : { text: "–", rawSign: "flat" as const };

              const isImprovement =
                delta.rawSign === "flat"
                  ? null
                  : direction === "up"
                    ? delta.rawSign === "pos"
                    : delta.rawSign === "neg";

              const deltaTone =
                isImprovement === null
                  ? "text-muted-foreground"
                  : isImprovement
                    ? "text-forest-700"
                    : "text-destructive";

              const Arrow =
                delta.rawSign === "pos"
                  ? ArrowUp
                  : delta.rawSign === "neg"
                    ? ArrowDown
                    : Minus;

              const status = w4?.status ?? w1.status;

              return (
                <tr
                  key={w1.label}
                  className="border-b border-border/40 last:border-b-0 align-top"
                >
                  <td className="px-4 py-3">
                    <div className="text-[13px] text-foreground">
                      {w1.label}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground/70">
                      {w4?.source ?? w1.source}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[13px] tabular-nums text-foreground">
                    {w1.value}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[13px] tabular-nums text-foreground">
                    {w4?.value ?? "–"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div
                      className={cn(
                        "inline-flex items-center justify-end gap-1 font-mono text-[13px] tabular-nums",
                        deltaTone,
                      )}
                    >
                      <Arrow className="h-3 w-3" strokeWidth={2.25} />
                      <span>{delta.text}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                        statusChipClasses(status),
                      )}
                    >
                      {statusLabel(status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="font-mono text-[10px] text-muted-foreground/70">
        Source attributions per row are the same upstream pulls used by the
        live strip: Attio, Postmark, HubSpot, Stripe, and the Vercel cron.
      </p>
    </section>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export default DeltaTable;
