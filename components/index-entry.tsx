/**
 * One row on /tour. Pure presentation. The whole row is an anchor so the
 * click target matches the visual width.
 *
 * Layout: a big mono numeral on the left (alternating ochre and forest by
 * parity), then the title and time chip stacked over the italic pitch line
 * and the small mono kicker plus body for whyHere. Hover lifts the border
 * to primary and underlines the title; nothing else moves.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { IndexEntry as IndexEntryType } from "@/data/index-tour";

export function IndexEntry({ entry }: { entry: IndexEntryType }) {
  const accent = entry.rank % 2 === 1 ? "text-ochre-500" : "text-forest-500";
  const padded = String(entry.rank).padStart(2, "0");

  return (
    <Link
      href={entry.href}
      className={cn(
        "group flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-6 transition-colors",
        "hover:border-primary/40 hover:bg-card/80",
        "md:flex-row md:items-start md:gap-6",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "shrink-0 select-none font-display text-[32px] font-light leading-none tabular-nums tracking-tight",
          accent,
        )}
      >
        {padded}
      </span>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <h3 className="font-display text-[22px] font-light leading-tight tracking-tight text-foreground group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4">
            {entry.title}
          </h3>
          <span
            className={cn(
              "inline-flex items-center rounded-sm border border-border/70 bg-background px-2 py-0.5",
              "font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
            )}
          >
            {entry.estimatedTimeOnPage}
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {entry.href}
          </span>
        </div>

        <p className="font-serif text-[15px] italic leading-relaxed text-foreground/85">
          {entry.pitchLine}
        </p>

        <div className="space-y-1.5 border-t border-border/50 pt-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Why this rank
          </div>
          <p className="text-pretty text-[13.5px] leading-relaxed text-muted-foreground">
            {entry.whyHere}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default IndexEntry;
