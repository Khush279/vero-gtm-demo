import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { TourCard } from "@/components/tour-card";
import { DOCS } from "@/data/docs";

export const metadata: Metadata = {
  title: "How to read this",
  description:
    "First-time-visitor walkthrough for the Vero GTM demo. Three tours by time budget, plus a legend for the visual language and a FAQ on what is real vs mocked.",
};

/**
 * /docs — start-here page for visitors who have just been forwarded the URL.
 *
 * Different from / (the cover letter) and different from the README (for
 * engineers reading the source). This page answers a single question: I have
 * N minutes, what should I look at? Three tours sized 3 / 10 / 20 minutes,
 * a legend for the visual language, and a FAQ on what is real vs mocked.
 *
 * Server component. The FAQ uses native <details> so it works without JS.
 */

export default function DocsPage() {
  return (
    <div className="space-y-14">
      <PageHeader
        kicker="Start here"
        title={<>How to read this.</>}
        subtitle="Pick a tour by how much time you have. Each surface in the demo is calibrated to a JD bullet. The legend below explains the visual language."
      />

      <p className="max-w-3xl text-pretty font-serif text-[16px] leading-relaxed text-foreground/85">
        {DOCS.intro}
      </p>

      {/* Three tours, side by side on desktop, stacked on mobile. */}
      <section className="space-y-5">
        <SectionHeader
          kicker="Three tours"
          title="Pick by time budget"
          aside="3 · 10 · 20 minutes"
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {DOCS.tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* Legend: visual conventions used across the demo. */}
      <section className="space-y-5">
        <SectionHeader
          kicker="Legend"
          title="The visual language"
          aside="Conventions repeat across surfaces"
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
          {DOCS.legend.map((item) => (
            <div key={item.glyph} className="flex flex-col gap-2 bg-card p-5">
              <LegendGlyph glyph={item.glyph} />
              <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
                {item.meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ: native details/summary so it works without JS. */}
      <section className="space-y-5">
        <SectionHeader
          kicker="FAQ"
          title="The questions everyone asks"
          aside="Click to expand"
        />
        <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
          {DOCS.faq.map((item, i) => (
            <details
              key={item.q}
              className="group border-b border-border/50 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
                <div className="flex min-w-0 items-baseline gap-3">
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] font-medium leading-snug text-foreground">
                    {item.q}
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
              <div className="px-5 pb-5 pl-[3.25rem] pr-10">
                <p className="text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/85">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  kicker,
  title,
  aside,
}: {
  kicker: string;
  title: string;
  aside?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="space-y-1">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {kicker}
        </div>
        <h2 className="font-display text-[22px] tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {aside ? (
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {aside}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Render a legend glyph in its native typography so the entry reads as the
 * thing it is describing, not a label for it. JD kickers render as mono
 * small-caps; colour names render as a swatch + label; everything else is
 * a small editorial title.
 */
function LegendGlyph({ glyph }: { glyph: string }) {
  if (glyph.startsWith("JD:")) {
    return (
      <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {glyph}
      </span>
    );
  }
  if (glyph === "Forest green") {
    return (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="inline-block h-3 w-3 rounded-sm bg-forest-500" />
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  if (glyph === "Ochre") {
    return (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="inline-block h-3 w-3 rounded-sm bg-ochre-400" />
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  if (glyph === "Muted grey") {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-3 w-3 rounded-sm border border-border bg-muted"
        />
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  if (glyph === "Status dot") {
    return (
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-forest-500" />
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  if (glyph === "Score chip") {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex items-center rounded-sm border border-border/70 bg-background px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-foreground"
        >
          87
        </span>
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  if (glyph === "View source") {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex items-center rounded-md border border-border/70 bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/80"
        >
          View source
        </span>
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  if (glyph === "Sparkline") {
    return (
      <span className="inline-flex items-center gap-2">
        <svg
          viewBox="0 0 40 12"
          width={40}
          height={12}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="text-forest-500"
        >
          <path d="M0 9 L8 7 L14 8 L20 5 L26 6 L32 3 L40 1" />
        </svg>
        <span className="font-display text-[15px] tracking-tight text-foreground">
          {glyph}
        </span>
      </span>
    );
  }
  return (
    <span className="font-display text-[15px] tracking-tight text-foreground">
      {glyph}
    </span>
  );
}
