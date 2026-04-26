/**
 * /retro · the day-90 retrospective Khush would write at the end of his
 * first quarter as founding GTM engineer.
 *
 * Sister surface to /board-deck. Same quarter, different audience. The
 * board deck is the polished version; this is the unfiltered one. Hits,
 * misses, surprises, and a five-bullet list of what changes in Q4.
 *
 * Server component. No interactivity, no client state.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { RetroItem } from "@/components/retro-item";
import { RETRO } from "@/data/retro";

export const metadata: Metadata = {
  title: "Day-90 retro",
  description:
    "The retro I'd write at the end of quarter one as Vero's founding GTM engineer. Brutal where the strategy memo was confident, specific where the board deck was diplomatic.",
};

export default function RetroPage() {
  const {
    intro,
    oneLineSummary,
    hits,
    misses,
    surprises,
    whatChangesNextQuarter,
  } = RETRO;

  return (
    <div className="space-y-14">
      <PageHeader
        kicker="Day 90 · honest retrospective"
        title={<>What I shipped, what I missed.</>}
        subtitle="The retro I'd write at end of quarter one. Brutal where the strategy memo was confident. Specific where the board deck was diplomatic."
      />

      {/* Frame: the two-sentence intro, set in serif so it reads like prose. */}
      <p className="max-w-2xl text-pretty font-serif text-[15px] leading-relaxed text-muted-foreground">
        {intro}
      </p>

      {/* One-line summary callout. Forest tint, big italic display type. */}
      <section
        aria-label="One-line summary"
        className="rounded-md border border-forest-700/25 bg-forest-50 px-6 py-9 md:px-10 md:py-12"
      >
        <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700/80">
          The one line
        </div>
        <p className="font-display-italic text-[24px] leading-[1.25] tracking-tight text-forest-900 text-balance md:text-[28px]">
          {oneLineSummary}
        </p>
      </section>

      <div className="rule" />

      {/* Hits + Misses, two columns on desktop. Hits forest, misses ochre. */}
      <section
        aria-label="Hits and misses"
        className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2"
      >
        <ColumnHeader
          accent="forest"
          label="Hits"
          count={hits.length}
          description="Things that landed inside the quarter."
        />
        <ColumnHeader
          accent="ochre"
          label="Misses"
          count={misses.length}
          description="Things that slipped, got killed, or quietly stopped happening."
        />

        <div className="space-y-10">
          {hits.map((item, i) => (
            <RetroItem key={item.id} item={item} column="hits" index={i} />
          ))}
        </div>

        <div className="space-y-10">
          {misses.map((item, i) => (
            <RetroItem key={item.id} item={item} column="misses" index={i} />
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* Surprises · three cards in a row. */}
      <section aria-label="Surprises" className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[24px] font-light leading-tight tracking-tight text-foreground md:text-[28px]">
            Surprises.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Three things I didn&apos;t expect to learn
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {surprises.map((s, i) => (
            <article
              key={i}
              className="flex flex-col gap-4 rounded-lg border border-border/70 bg-card p-6 shadow-sm"
            >
              <div className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")} · Observation
              </div>
              <p className="font-display text-[18px] leading-snug tracking-tight text-foreground text-balance">
                {s.observation}
              </p>
              <div className="border-t border-border/60 pt-4">
                <div className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
                  What it means
                </div>
                <p className="text-pretty font-serif text-[14px] leading-relaxed text-foreground/85">
                  {s.meaning}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* What changes next quarter · numbered list, ochre numerals. */}
      <section aria-label="What changes next quarter" className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[24px] font-light leading-tight tracking-tight text-foreground md:text-[28px]">
            What changes next quarter.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Five concrete shifts
          </span>
        </div>

        <ol className="space-y-6">
          {whatChangesNextQuarter.map((bullet, i) => (
            <li
              key={i}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 md:gap-x-8"
            >
              <span
                aria-hidden
                className="font-display text-[44px] font-light leading-none tracking-tightest tabular-nums text-ochre-500 md:text-[52px]"
              >
                {i + 1}
              </span>
              <p className="max-w-2xl self-center text-pretty font-serif text-[15.5px] leading-relaxed text-foreground/90 md:text-[16px]">
                {bullet}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ColumnHeader({
  accent,
  label,
  count,
  description,
}: {
  accent: "forest" | "ochre";
  label: string;
  count: number;
  description: string;
}) {
  const dotColor =
    accent === "forest" ? "bg-forest-500" : "bg-ochre-400";
  const labelColor =
    accent === "forest" ? "text-forest-800" : "text-ochre-800";
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`inline-block h-2 w-2 rounded-full ${dotColor}`}
        />
        <h2
          className={`font-display text-[28px] font-light leading-tight tracking-tight md:text-[32px] ${labelColor}`}
        >
          {label}.
        </h2>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
          {count} items
        </span>
      </div>
      <p className="text-pretty text-[13.5px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
