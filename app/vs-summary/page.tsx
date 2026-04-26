/**
 * /vs-summary. The single-screen verdict synthesizing /vs-tali, /vs-dax,
 * and /vs-suki. The URL a procurement contact pastes into Slack to get
 * the answer to "where does Vero fit in the landscape?" without reading
 * three separate comparison pages.
 *
 * Server component. No JS required. Three-card grid for the competitor
 * verdicts, one tinted callout for the unified verdict, native
 * details/summary accordion for the 5-question buyer's guide.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SUMMARY } from "@/data/vs-summary";

export const metadata: Metadata = {
  title: "Vero vs Tali, DAX, Suki",
  description:
    "One scannable verdict across the three competitor comparison pages. Where Vero fits, where each competitor wins, and a 5-question buyer's guide for procurement.",
};

export default function VsSummaryPage() {
  const { intro, competitors, oneVerdict, buyersGuide } = SUMMARY;

  return (
    <div className="space-y-14">
      <PageHeader
        kicker="The competitive landscape, in one screen"
        title={<>Vero vs Tali &middot; DAX &middot; Suki.</>}
        subtitle="One scannable view. Each competitor has a deep page. This page is what to send to procurement when they ask 'where does Vero fit?'"
      />

      {/* Intro paragraph */}
      <section>
        <p className="max-w-2xl font-serif text-[16px] leading-relaxed text-foreground/85">
          {intro}
        </p>
      </section>

      {/* 3-column competitor verdict grid */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Three competitors, three buyers
          </div>
          <div className="font-mono text-[10.5px] text-muted-foreground/80">
            Forest = Vero wins · Ochre = pick them
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {competitors.map((c) => (
            <article
              key={c.id}
              className="flex flex-col gap-4 rounded-lg border border-border/60 bg-card p-5"
            >
              <header className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[22px] font-light tracking-tight text-foreground">
                    {c.label}
                  </h2>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {c.monthlyPrice}
                  </span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-foreground/80">
                  {c.positioning}
                </p>
              </header>

              <div className="inline-flex w-fit items-center rounded-full border border-primary/25 bg-forest-50/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-forest-700">
                {c.veroDelta}
              </div>

              <div className="space-y-3 border-t border-border/50 pt-4">
                <div className="space-y-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
                    Vero wins when
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground/85">
                    {c.whenVeroWins}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre-700">
                    Pick {c.label} when
                  </div>
                  <p className="text-[13px] leading-relaxed text-foreground/85">
                    {c.whenToPickThem}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Link
                  href={c.detailHref}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary hover:opacity-80"
                >
                  Read the full comparison
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* The unified verdict */}
      <section className="space-y-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          The unified verdict
        </div>
        <div className="rounded-lg border border-primary/25 bg-forest-50/60 p-7 md:p-9">
          <p className="font-serif text-[16.5px] leading-relaxed text-foreground/90 md:text-[17.5px]">
            {oneVerdict}
          </p>
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-700/80">
            Paste this into Slack
          </p>
        </div>
      </section>

      {/* 5-question buyer's guide */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            5-question buyer&apos;s guide
          </div>
          <div className="font-mono text-[10.5px] text-muted-foreground/80">
            Click to expand
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-border/60 bg-card">
          <ul className="divide-y divide-border/60">
            {buyersGuide.map((item, i) => (
              <li key={item.question}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-baseline gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
                    <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif text-[15px] leading-snug text-foreground/90">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-[14px] text-muted-foreground/70 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pl-[3.25rem] pr-12">
                    <p className="text-[13.5px] leading-relaxed text-foreground/80">
                      {item.answer}
                    </p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
