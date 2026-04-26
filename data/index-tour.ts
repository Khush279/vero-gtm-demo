/**
 * /tour content. The ultra-condensed top-12 list, ranked in interview order.
 *
 * Different from /map (33 routes grouped by purpose) and different from
 * /docs (three tours sized by reading budget). This page answers a single
 * question: if a founder forwards this URL to a board member or a mentor
 * with eight minutes to spare, which twelve surfaces should they click and
 * in what order?
 *
 * Order is cross-checked against data/demo-script.ts, the live talk track
 * already validated for the call. Edit copy here, not in the route.
 */

export type IndexEntry = {
  /** 1 through 12, used for the big mono numeral and the ordering. */
  rank: number;
  /** Internal route. Passes straight to next/link. */
  href: string;
  /** Surface title. Sentence case, no trailing punctuation. */
  title: string;
  /** The one sentence Khush would Slack to a friend handing this URL over. */
  pitchLine: string;
  /** One sentence on why this surface ranks where it does. */
  whyHere: string;
  /** Plain-English read-time on the chip beside the title. */
  estimatedTimeOnPage: string;
};

export type IndexTour = {
  /** Two-sentence framing, rendered above the list. */
  intro: string;
  /** Exactly twelve entries, ranked one through twelve. */
  entries: IndexEntry[];
  /** One sentence to close the list. Renders inside the forest callout. */
  closer: string;
  /** Total reading budget across all twelve stops. */
  totalEstimatedTime: string;
};

export const INDEX_TOUR: IndexTour = {
  intro:
    "Twelve surfaces, ranked. If you only have eight minutes for this demo, click them in this order.",

  entries: [
    {
      rank: 1,
      href: "/",
      title: "Home",
      pitchLine:
        "Two paragraphs framed at Adeel and Bill, then a grid that maps every JD bullet to a real surface in this repo.",
      whyHere:
        "Open here so the framing carries through every later click. The cover letter sets the why before any of the receipts land.",
      estimatedTimeOnPage: "30s",
    },
    {
      rank: 2,
      href: "/case-study",
      title: "Case study",
      pitchLine:
        "Dr. Yasmin Raza, twenty-eight days from cold outreach to signed pilot, with the actual artifacts that moved each stage.",
      whyHere:
        "Second click because a closed-won narrative is the fastest way to prove the engine produces revenue, not just activity.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 3,
      href: "/pipeline",
      title: "Pipeline",
      pitchLine:
        "Five hundred real Ontario family physicians from the CPSO register, scored by ICP fit, bucketed into eight stages.",
      whyHere:
        "Once they trust one closed lead, the next question is volume. The board view answers that without scrolling.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 4,
      href: "/lead/lead_0042",
      title: "Lead profile",
      pitchLine:
        "One enriched profile with inferred EMR and a four-touch sequence drafted live by gpt-4o-mini, leverage point per email.",
      whyHere:
        "The unit a clinician-facing rep works from. Drilling into one card is how you prove the data goes deep, not wide.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 5,
      href: "/automations",
      title: "Automations",
      pitchLine:
        "Five running cron jobs with their actual TypeScript visible inline, the page that separates a GTM engineer from a RevOps hire.",
      whyHere:
        "This is the receipt for the engineering claim. View source on the CPSO scraper makes the JD bullet concrete.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 6,
      href: "/strategy",
      title: "Strategy",
      pitchLine:
        "The 30/60/90 memo with sixteen footnotes, the wedge thesis, and the metric I would be fired for missing.",
      whyHere:
        "Once the engine is proven real, the question becomes where to point it. The memo answers that with a date attached.",
      estimatedTimeOnPage: "2 min",
    },
    {
      rank: 7,
      href: "/vs-tali",
      title: "vs Tali",
      pitchLine:
        "The honest fifteen-row comparison Vero would publish tomorrow, including the rows where Tali still wins.",
      whyHere:
        "Every primary-care prospect already knows Tali. Showing the comparison without flinching is how you earn the call.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 8,
      href: "/calculator",
      title: "Calculator",
      pitchLine:
        "ROI math any clinic admin can run in two minutes, with the assumptions exposed and the per-physician dollar figure spelled out.",
      whyHere:
        "Strategy and competition land better when the buyer can plug in their own numbers. This is the handoff to procurement.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 9,
      href: "/board-deck",
      title: "Board deck",
      pitchLine:
        "The eight-slide GTM update I would present at the first board meeting after joining, keyboard-navigable like a real deck.",
      whyHere:
        "Shows I think about the loop after the work, not just the work. Founders read this and picture me reporting to them.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 10,
      href: "/retro",
      title: "Retro",
      pitchLine:
        "A day-90 honest retrospective written before day one, with the misses called out by name and the lessons booked.",
      whyHere:
        "Anyone can plan. Pre-writing the retro is how you signal you will tell the team the truth when the plan slips.",
      estimatedTimeOnPage: "1 min",
    },
    {
      rank: 11,
      href: "/qa-summary",
      title: "Q&A summary",
      pitchLine:
        "Five takeaways on one page, the leave-behind a founder can forward to a partner who missed the call.",
      whyHere:
        "If they only remember five sentences from the demo, this is which five. Built as the print-friendly recap.",
      estimatedTimeOnPage: "30s",
    },
    {
      rank: 12,
      href: "/sources",
      title: "Sources",
      pitchLine:
        "Every claim across the demo mapped to its public citation, with synthetic data labeled and a day-1 plan for swapping each mock to live.",
      whyHere:
        "Close the loop. The whole demo is auditable, and this is the page that proves it before any number gets challenged.",
      estimatedTimeOnPage: "1 min",
    },
  ],

  closer:
    "Twelve clicks, eight minutes, one engine. The other twenty-nine surfaces are at /map when you want to keep going.",

  totalEstimatedTime: "8-10 min",
};
