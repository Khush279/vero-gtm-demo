import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Tour } from "@/data/docs";

/**
 * One tour card on /docs. Pure presentation. Header has a duration chip
 * and an audience chip side by side, then the intent paragraph, then an
 * ordered list of stops. Each stop is a route + a one-line whyHere.
 *
 * Renders external URLs as <a target="_blank">; everything else uses
 * next/link so client-side nav works inside the demo. Stops with a path
 * starting with "/" but containing dynamic segments (eg /api/draft) still
 * use next/link, which is fine for any concrete pathname.
 */
export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-lg border border-border/60 bg-card p-6",
        "transition-colors hover:border-primary/30",
      )}
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip label="duration" value={tour.duration} tone="primary" />
          <Chip label="for" value={tour.audience} tone="muted" />
        </div>
        <p className="text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/85">
          {tour.intent}
        </p>
      </header>

      <ol className="mt-5 space-y-3 border-t border-border/60 pt-5">
        {tour.stops.map((stop, i) => (
          <li key={`${tour.id}-${stop.route}`} className="flex gap-3">
            <span className="shrink-0 select-none pt-0.5 font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <RouteLink route={stop.route} />
              <p className="text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                {stop.whyHere}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default TourCard;

function Chip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 rounded-sm border px-2 py-0.5 text-[11px]",
        tone === "primary"
          ? "border-primary/30 bg-primary/5"
          : "border-border/70 bg-muted/40",
      )}
    >
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-mono tabular-nums text-foreground">{value}</span>
    </span>
  );
}

function RouteLink({ route }: { route: string }) {
  const isExternal = /^https?:\/\//.test(route);
  const className = cn(
    "inline-flex items-center gap-1 break-all font-mono text-[12.5px] text-foreground",
    "transition-colors hover:text-primary",
  );

  if (isExternal) {
    return (
      <a
        href={route}
        target="_blank"
        rel="noreferrer"
        className={cn(className, "underline underline-offset-4 decoration-primary/30 hover:decoration-primary")}
      >
        {route}
        <ExternalArrow />
      </a>
    );
  }

  return (
    <Link
      href={route}
      className={cn(className, "underline underline-offset-4 decoration-primary/30 hover:decoration-primary")}
    >
      {route}
    </Link>
  );
}

function ExternalArrow() {
  return (
    <svg
      viewBox="0 0 12 12"
      width={10}
      height={10}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="opacity-60"
    >
      <path d="M4 8l4-4M5 4h3v3" />
    </svg>
  );
}
