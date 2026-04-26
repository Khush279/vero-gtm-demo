/**
 * One row on /sources. Editorial layout: serif claim, mono citation with
 * optional external link, small forest pills for the demo surfaces that
 * use this claim, italic muted caveat below if present.
 *
 * Server component, no interactivity. Pure presentation of one Source.
 */

import Link from "next/link";
import type { Source } from "@/data/sources";

export function SourceRow({ source }: { source: Source }) {
  return (
    <article className="grid grid-cols-1 gap-4 border-t border-border/60 py-5 md:grid-cols-[1.6fr,1fr]">
      <div className="space-y-2">
        <p className="font-serif text-[16px] leading-relaxed text-foreground/95">
          {source.claim}
        </p>
        {source.caveat ? (
          <p className="font-display-italic text-[13px] leading-relaxed text-muted-foreground">
            {source.caveat}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <Citation citation={source.citation} url={source.url} />
        {source.surface.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {source.surface.map((s) => (
              <SurfaceChip key={s} surface={s} />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Citation({ citation, url }: { citation: string; url?: string }) {
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-baseline gap-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-foreground/80 underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary/60"
      >
        <span>{citation}</span>
        <span aria-hidden className="text-[10px] text-muted-foreground">
          {"↗"}
        </span>
      </a>
    );
  }
  return (
    <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
      {citation}
    </span>
  );
}

function SurfaceChip({ surface }: { surface: string }) {
  return (
    <Link
      href={surface}
      className="inline-flex items-center rounded-sm border border-forest-200 bg-forest-50 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-forest-700 transition-colors hover:border-forest-400 hover:bg-forest-100 hover:text-forest-800"
    >
      {surface}
    </Link>
  );
}

export default SourceRow;
