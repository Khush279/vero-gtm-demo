/**
 * RetroItem · pure presentational. One line item inside the Hits or Misses
 * column on /retro. Renders the original promise (display-italic), a verdict
 * chip tinted by outcome, the narrative of what actually happened (serif),
 * and a small mono-kicker block with the do-over.
 *
 * Tone matches /retro: brutal where /board-deck is diplomatic. The chip
 * colors lean forest for shipped, ochre for shipped-late, muted-red for
 * missed, and a flat slate for killed (because killed is a decision, not
 * a failure).
 */

import type { RetroItem as RetroItemData, Verdict } from "@/data/retro";
import { cn } from "@/lib/utils";

const VERDICT_LABEL: Record<Verdict, string> = {
  shipped: "Shipped",
  "shipped-late": "Shipped late",
  missed: "Missed",
  killed: "Killed",
};

const VERDICT_CHIP: Record<Verdict, string> = {
  shipped:
    "border-forest-700/30 bg-forest-100/70 text-forest-800",
  "shipped-late":
    "border-ochre-500/40 bg-ochre-50 text-ochre-800",
  missed:
    "border-red-600/30 bg-red-50 text-red-800",
  killed:
    "border-slate-500/30 bg-slate-100 text-slate-700",
};

export type RetroItemProps = {
  item: RetroItemData;
  /**
   * "hits" leans forest, "misses" leans ochre. Drives the index pill and
   * left-rule color so the columns read at a glance even if you skim.
   */
  column: "hits" | "misses";
  index: number;
};

export function RetroItem({ item, column, index }: RetroItemProps) {
  const accent = column === "hits" ? "forest" : "ochre";

  return (
    <article
      className={cn(
        "space-y-3 border-l-2 pl-5",
        accent === "forest"
          ? "border-forest-300/70"
          : "border-ochre-300/70",
      )}
    >
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            "font-mono text-[10.5px] uppercase tracking-[0.22em] tabular-nums",
            accent === "forest" ? "text-forest-600" : "text-ochre-600",
          )}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.2em]",
            VERDICT_CHIP[item.verdict],
          )}
        >
          {VERDICT_LABEL[item.verdict]}
        </span>
      </div>

      <p className="font-display-italic text-[18px] leading-snug tracking-tight text-foreground/90 text-balance md:text-[19px]">
        {item.promise}
      </p>

      <p className="text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/85">
        {item.whatHappened}
      </p>

      <div className="space-y-1.5 pt-1">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
          What I&apos;d do different
        </div>
        <p className="text-pretty font-serif text-[13.5px] leading-relaxed text-muted-foreground">
          {item.whatIdDoDifferent}
        </p>
      </div>
    </article>
  );
}

export default RetroItem;
