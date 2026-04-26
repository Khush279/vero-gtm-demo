/**
 * A single FAQ row. Native <details>/<summary> so it works with no JS.
 * Pure presentational. Pulls a question, an answer, and the surface where
 * the deeper version of this answer lives, and renders the surface link in
 * muted mono so the eye lands on the editorial copy first.
 */
import Link from "next/link";
import type { FaqEntry as FaqEntryType } from "@/data/faq-master";

export function FaqEntry({
  entry,
  index,
}: {
  entry: FaqEntryType;
  index: number;
}) {
  const isExternal = entry.sourceSurface.startsWith("http");
  return (
    <details
      id={entry.id}
      className="group border-b border-border/50 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[14px] font-medium leading-snug text-foreground">
            {entry.question}
          </span>
        </div>
        <span
          aria-hidden
          className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        >
          <svg
            viewBox="0 0 12 12"
            width={12}
            height={12}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 4.5 6 7.5 9 4.5" />
          </svg>
        </span>
      </summary>
      <div className="space-y-3 px-5 pb-5 pl-[3.25rem] pr-10">
        <p className="text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/85">
          {entry.answer}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Deeper context
          </span>
          {isExternal ? (
            <a
              href={entry.sourceSurface}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
            >
              {entry.sourceSurface}
            </a>
          ) : (
            <Link
              href={entry.sourceSurface}
              className="font-mono text-[11px] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
            >
              {entry.sourceSurface}
            </Link>
          )}
          {entry.tags.length ? (
            <span className="flex flex-wrap items-center gap-1.5">
              {entry.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border/60 bg-muted/30 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </details>
  );
}
