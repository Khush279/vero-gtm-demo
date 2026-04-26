"use client";

/**
 * DeckKeyboardNav · tiny client island for the /board-deck page.
 *
 * Listens for ArrowLeft / ArrowRight and smooth-scrolls the viewport to the
 * next/prev slide. Also exposes a sticky indicator and a print button as
 * companion components, since all three rely on the same DOM convention
 * (every slide is rendered as a .slide-card in the page route).
 */

import { useEffect, useState } from "react";

const SLIDE_SELECTOR = ".slide-card";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

function getSlides(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR),
  );
}

/**
 * Returns the index of the slide whose top is closest to (but not far below)
 * the current viewport top. Falls back to 0.
 */
function currentSlideIndex(slides: HTMLElement[]): number {
  if (slides.length === 0) return 0;
  const viewportMid = window.scrollY + window.innerHeight * 0.35;
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  slides.forEach((el, i) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = Math.abs(top - viewportMid);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  });
  return best;
}

function scrollToSlide(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top, behavior: "smooth" });
}

export function DeckKeyboardNav() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const slides = getSlides();
      if (slides.length === 0) return;

      const current = currentSlideIndex(slides);
      const next =
        e.key === "ArrowRight"
          ? Math.min(slides.length - 1, current + 1)
          : Math.max(0, current - 1);
      if (next === current) return;

      e.preventDefault();
      scrollToSlide(slides[next]);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}

/**
 * Sticky slide counter in the top-right of the page. Updates as the user
 * scrolls so the indicator always matches the slide closest to the viewport.
 */
export function DeckSlideIndicator({ total }: { total: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function recompute() {
      const slides = getSlides();
      if (slides.length === 0) return;
      setIndex(currentSlideIndex(slides));
    }

    recompute();
    window.addEventListener("scroll", recompute, { passive: true });
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="deck-indicator pointer-events-none fixed right-5 top-5 z-40 rounded-md border border-border/70 bg-background/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 shadow-sm backdrop-blur-sm tabular-nums"
    >
      {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}

/**
 * Print button. Lives in the PageHeader rightSlot. Calls window.print()
 * on click. The page route ships matching @media print rules to keep the
 * deck legible on paper.
 */
export function DeckPrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="deck-print-btn inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-muted"
    >
      <PrintIcon />
      Print this deck
    </button>
  );
}

function PrintIcon() {
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
      <path d="M4 6V2h8v4M4 12H2V6h12v6h-2M4 10h8v4H4z" />
    </svg>
  );
}

export default DeckKeyboardNav;
