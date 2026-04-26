import Link from "next/link";
import { NOT_FOUND_MAP } from "@/data/not-found-map";

/**
 * 404 surface. Next.js auto-renders this for any unmatched route.
 *
 * Treated as an editorial moment, not an error. A founder pasting a typo'd
 * URL into Slack should land here and find their way into the right room
 * without going back to the home page. The route map is the point.
 */

export default function NotFound() {
  return (
    <div className="space-y-14 pt-2">
      {/* Centerpiece */}
      <section className="space-y-5 pt-4">
        <div className="font-mono text-[64px] font-light tracking-[0.18em] text-primary/55 md:text-[88px]">
          404
        </div>
        <h1 className="font-display text-[40px] font-light leading-[1.02] tracking-tightest text-foreground md:text-[60px]">
          Wrong room.{" "}
          <span className="font-display-italic text-primary">Right building.</span>
        </h1>
        <div className="max-w-2xl space-y-3 font-serif text-[17px] leading-relaxed text-foreground/85 md:text-[18px]">
          <p>
            That URL doesn&apos;t resolve. Either I haven&apos;t built it yet or the
            link picked up a stray character on its way through Slack.
          </p>
          <p>
            This demo has thirty-one routes. The one you wanted is probably one of
            these.
          </p>
        </div>
      </section>

      {/* Route map */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {NOT_FOUND_MAP.map((group) => (
          <div key={group.label} className="space-y-3">
            <div className="space-y-1 border-b border-border/60 pb-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {group.kicker}
              </div>
              <div className="font-display text-[20px] tracking-tight text-foreground">
                {group.label}
              </div>
            </div>
            <ul className="space-y-2">
              {group.routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="group block rounded-md border border-border/60 bg-card p-3 transition-colors hover:border-primary/30 hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[12px] text-foreground group-hover:text-primary">
                        {route.href}
                      </span>
                      <ArrowIcon className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                    <p className="mt-1 text-pretty font-serif text-[13.5px] leading-snug text-muted-foreground">
                      {route.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Reset */}
      <section className="border-t border-border/60 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display-italic text-[20px] tracking-tight text-primary hover:underline underline-offset-4 decoration-primary/40"
        >
          Or start over
          <ArrowIcon className="opacity-70" />
        </Link>
      </section>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
