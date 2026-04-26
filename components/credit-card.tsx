/**
 * One acknowledgement entry on /credit. Pure presentational, server
 * component, no interactivity. Layout: name in font-display 16px on top,
 * url chip in mono small caps with ↗ glyph if external, italic serif
 * "why" sentence below in 13.5px.
 */

import type { CreditEntry } from "@/data/credit";

export function CreditCard({ entry }: { entry: CreditEntry }) {
  return (
    <article className="space-y-2 border-t border-border/60 pt-4 first:border-t-0 first:pt-0 md:border-t-0 md:pt-0">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <h3 className="font-display text-[16px] leading-tight tracking-tight text-foreground">
          {entry.name}
        </h3>
        {entry.url ? <UrlChip url={entry.url} /> : null}
      </header>
      <p className="font-display-italic text-[13.5px] leading-relaxed text-foreground/85">
        {entry.why}
      </p>
    </article>
  );
}

function UrlChip({ url }: { url: string }) {
  const display = displayHost(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-baseline gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary/60"
    >
      <span>{display}</span>
      <span aria-hidden className="text-[9.5px] text-muted-foreground/80">
        {"↗"}
      </span>
    </a>
  );
}

function displayHost(url: string): string {
  try {
    const u = new URL(url);
    return u.host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default CreditCard;
