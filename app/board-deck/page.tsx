/**
 * /board-deck · a mocked first board update for Vero, presented at end of
 * Khush's first 90 days as founding GTM engineer.
 *
 * Layout: 16:9 slides stacked vertically, generous spacing, sticky slide
 * counter top-right, keyboard arrows nav between slides. Print stylesheet
 * removes chrome so window.print() yields one slide per page.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SlideCard } from "@/components/slide-card";
import {
  DeckKeyboardNav,
  DeckSlideIndicator,
  DeckPrintButton,
} from "@/components/deck-keyboard-nav";
import { DECK } from "@/data/board-deck";

export const metadata: Metadata = {
  title: "Board deck",
  description:
    "What I'd present to Vero's board after 90 days as founding GTM engineer. Mocked Q3 update covering wins, misses, pipeline, the Maple close, the Q4 plan, and the ask.",
};

export default function BoardDeckPage() {
  const total = DECK.slides.length;

  return (
    <div className="space-y-10">
      {/* Sticky slide counter and keyboard handler */}
      <DeckSlideIndicator total={total} />
      <DeckKeyboardNav />

      <PageHeader
        kicker="Q3 board update · mocked"
        title={<>Slide deck.</>}
        subtitle={
          <>
            What I&apos;d present to Vero&apos;s board after 90 days as founding
            GTM engineer. Press &rarr; and &larr; to navigate, or scroll.
          </>
        }
        rightSlot={<DeckPrintButton />}
      />

      {/* Meeting frame: a small mono strip echoing the deck.preamble */}
      <section
        aria-label="Meeting frame"
        className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm"
      >
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {DECK.forMeeting} · {DECK.presenter}
        </div>
        <p className="mt-2 max-w-3xl font-serif text-[15px] leading-relaxed text-foreground/85">
          {DECK.preamble}
        </p>
      </section>

      {/* Slides · each rendered as a 16:9 card, generous vertical spacing */}
      <section aria-label="Slides" className="deck-slides space-y-10 md:space-y-14">
        {DECK.slides.map((slide) => (
          <SlideCard key={slide.id} slide={slide} total={total} />
        ))}
      </section>

      {/* Print rules: hide chrome, force one slide per page */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0.4in; }
          body { background: white !important; }
          .deck-indicator,
          .deck-print-btn,
          nav,
          header > *:not(:first-child) { display: none !important; }
          .deck-slides { gap: 0 !important; }
          .deck-slides > * {
            page-break-after: always;
            break-after: page;
            box-shadow: none !important;
            border-color: rgba(0,0,0,0.15) !important;
          }
          .deck-slides > *:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
