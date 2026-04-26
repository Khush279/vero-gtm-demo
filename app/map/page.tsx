/**
 * /map: the table-of-contents page. The top-nav now has 30+ items and a
 * founder skimming the demo needs one screen they can scroll to find any
 * surface. Five groups stacked vertically, each with a kicker, label,
 * blurb, and a 2-column grid of entry cards.
 *
 * Server component. Data lives in data/site-map.ts; rendering is pure
 * mapping over groups and entries.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SiteMapCard } from "@/components/site-map-card";
import { SITE_MAP, SITE_MAP_TOTALS } from "@/data/site-map";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Every surface in the Vero GTM demo on one page. 33 routes grouped into product, plan, competition, receipts, and founder-specific artifacts.",
};

const STATS = [
  { value: SITE_MAP_TOTALS.groups, label: "groups" },
  { value: SITE_MAP_TOTALS.surfaces, label: "surfaces" },
  { value: 4, label: "downloadable artifacts" },
  { value: 1, label: "RAG agent" },
];

export default function MapPage() {
  return (
    <div className="space-y-14">
      <PageHeader
        kicker="Every surface, one screen"
        title={<>The map.</>}
        subtitle="33 routes grouped by what they're for. Use the docs page for guided tours; this page is the index."
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

      {SITE_MAP.map((group) => (
        <section key={group.id} className="space-y-6">
          <header className="space-y-2 border-t border-border/60 pt-8">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              {group.kicker}
            </div>
            <h2 className="font-display text-[28px] font-light leading-[1.05] tracking-tightest text-foreground md:text-[32px]">
              {group.label}.
            </h2>
            <p className="max-w-2xl text-pretty font-serif text-[15px] leading-relaxed text-foreground/85">
              {group.blurb}
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            {group.entries.map((entry) => (
              <SiteMapCard key={entry.href} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
