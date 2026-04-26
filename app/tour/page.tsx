import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { IndexEntry } from "@/components/index-entry";
import { INDEX_TOUR } from "@/data/index-tour";
import { SITE_MAP_TOTALS } from "@/data/site-map";

/**
 * /tour: the ultra-condensed, ranked walkthrough. Twelve surfaces in
 * interview order, optimized for the eight-minute board-member or mentor
 * skim.
 *
 * Different from /map (the full 33-route catalog) and different from /docs
 * (three tours sized by reading budget). This is the one ranked list a
 * founder hands over when there is no time to browse.
 *
 * Server component. Data lives in data/index-tour.ts; rendering is pure
 * mapping over entries.
 *
 * Route is /tour not /index because /index would collide with the Next.js
 * routing convention for the root segment.
 */

export const metadata: Metadata = {
  title: "Tour",
  description:
    "Twelve highest-ROI surfaces in the Vero GTM demo, ranked in interview order. The eight-minute walkthrough for a board member or mentor.",
};

const STATS = [
  { value: SITE_MAP_TOTALS.surfaces + 8, label: "surfaces in demo" },
  { value: INDEX_TOUR.entries.length, label: "top-ranked picks" },
  { value: INDEX_TOUR.totalEstimatedTime, label: "estimated read" },
];

export default function TourPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="If you only have 8 minutes"
        title={<>Twelve surfaces, ranked.</>}
        subtitle="The shortest path through the demo. Different from the map (every route grouped) and the docs (three tours by length). This is the one list, ordered the way a founder would walk a board member through it."
      />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-border/60 bg-card px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">
        {STATS.map((s, i) => (
          <span key={s.label} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className="text-muted-foreground/40">
                ·
              </span>
            ) : null}
            <span className="tabular-nums text-foreground">{s.value}</span>
            <span>{s.label}</span>
          </span>
        ))}
      </div>

      <p className="max-w-2xl text-pretty font-serif text-[16px] leading-relaxed text-foreground/85">
        {INDEX_TOUR.intro}
      </p>

      <ol className="space-y-4">
        {INDEX_TOUR.entries.map((entry) => (
          <li key={entry.href}>
            <IndexEntry entry={entry} />
          </li>
        ))}
      </ol>

      <aside
        className={cnCallout()}
        aria-label="Closing note"
      >
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700">
          The closer
        </div>
        <p className="font-serif text-[15.5px] leading-relaxed text-foreground/90">
          {INDEX_TOUR.closer}
        </p>
      </aside>
    </div>
  );
}

/**
 * Forest-tinted callout for the closer. Inlined helper so the page file
 * stays a single render unit.
 */
function cnCallout() {
  return [
    "space-y-2 rounded-lg border border-forest-200 bg-forest-50/70 px-6 py-5",
    "dark:border-forest-800/60 dark:bg-forest-900/20",
  ].join(" ");
}
