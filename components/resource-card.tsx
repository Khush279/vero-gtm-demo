/**
 * One downloadable artefact card on /resources. Server component. The click
 * is a real anchor tag with a `download` attribute pointing at a static file
 * in /public, no client state. Top: title (font-display) + filetype mono pill.
 * Middle: description, what's-inside ordered list, best-for label. Bottom:
 * file size + the actual download button.
 */

import { cn } from "@/lib/utils";
import type { Resource } from "@/data/resources";

const FILETYPE_LABEL: Record<Resource["fileType"], string> = {
  md: "markdown",
  csv: "csv",
  json: "json",
};

export type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col gap-5 rounded-lg border border-border/60 bg-card p-5 transition-colors",
        "hover:border-primary/30",
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="font-display text-[22px] leading-tight tracking-tight text-foreground">
            {resource.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {resource.description}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-md border border-border/70 bg-background px-2.5 py-1",
            "font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground",
          )}
          title={`${FILETYPE_LABEL[resource.fileType]} file`}
        >
          .{resource.fileType}
        </span>
      </header>

      <div className="rounded-md border border-border/60 bg-muted/30 p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          What&apos;s inside
        </div>
        <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-foreground/90">
          {resource.whatItContains.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="shrink-0 pt-0.5 font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
          best for
        </span>
        <span className="text-[12px] text-foreground/85">{resource.bestFor}</span>
      </div>

      <footer className="flex items-center justify-between border-t border-border/60 pt-4">
        <div className="flex flex-col gap-0.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="tracking-[0.05em] normal-case text-muted-foreground/80">
            {resource.filename}
          </span>
          <span className="tabular-nums">{formatBytes(resource.bytesEstimate)}</span>
        </div>
        <a
          href={resource.downloadHref}
          download={resource.filename}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-[12.5px] font-medium text-primary-foreground",
            "transition-opacity hover:opacity-90",
          )}
        >
          <DownloadIcon /> Download
        </a>
      </footer>
    </article>
  );
}

export default ResourceCard;

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={12}
      height={12}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 2v9M4 7l4 4 4-4M3 14h10" />
    </svg>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 100) return `${kb.toFixed(1)} KB`;
  return `${Math.round(kb)} KB`;
}
