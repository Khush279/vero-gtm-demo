/**
 * One entry card on /map. Server component, pure presentation, the whole
 * card is one anchor so the click target is generous. Hover lifts the
 * border to primary and underlines the title; nothing else moves.
 *
 * Layout: title (font-display 18px) on top, serif description below,
 * footer row with the route in mono small-caps and the optional surface
 * tag chip on the right.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SiteMapEntry } from "@/data/site-map";

const KIND_LABEL: Record<SiteMapEntry["ja"], string> = {
  "demo-only": "demo",
  page: "page",
  downloadable: "download",
  api: "live agent",
};

export function SiteMapCard({ entry }: { entry: SiteMapEntry }) {
  return (
    <Link
      href={entry.href}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-lg border border-border/60 bg-card p-5 transition-colors",
        "hover:border-primary/40 hover:bg-card/80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[18px] leading-tight tracking-tight text-foreground group-hover:underline group-hover:decoration-primary/50 group-hover:underline-offset-4">
          {entry.title}
        </h3>
        {entry.surfaceTag ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-sm border border-border/70 bg-background px-2 py-0.5",
              "font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground",
            )}
          >
            {entry.surfaceTag}
          </span>
        ) : null}
      </div>

      <p className="text-pretty font-serif text-[13.5px] leading-relaxed text-foreground/85">
        {entry.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {entry.href}
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {KIND_LABEL[entry.ja]}
        </span>
      </div>
    </Link>
  );
}

export default SiteMapCard;
