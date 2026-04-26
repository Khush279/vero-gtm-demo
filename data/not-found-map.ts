/**
 * Route map shown on the 404 page. Three intent groups so a 404'd visitor
 * can pick the right room quickly. Keep descriptions to one line of serif
 * copy so the cards stay scannable. Update here, not in app/not-found.tsx.
 */

export type NotFoundRoute = {
  href: string;
  description: string;
};

export type NotFoundGroup = {
  label: string;
  kicker: string;
  routes: NotFoundRoute[];
};

export const NOT_FOUND_MAP: NotFoundGroup[] = [
  {
    label: "The product",
    kicker: "What I built",
    routes: [
      {
        href: "/pipeline",
        description: "500 real Ontario family physicians in an Attio-style board.",
      },
      {
        href: "/lead/lead_0042",
        description: "One enriched profile with a four-touch sequence drafted live.",
      },
      {
        href: "/automations",
        description: "Five running jobs with their actual TypeScript source.",
      },
      {
        href: "/enterprise",
        description: "Hospital-system pipeline with a pre-filled VoR template.",
      },
    ],
  },
  {
    label: "The plan",
    kicker: "How week one looks",
    routes: [
      {
        href: "/strategy",
        description: "The 90-day plan and where the wedge is.",
      },
      {
        href: "/timeline",
        description: "Quarter-by-quarter view of the GTM motion.",
      },
      {
        href: "/day1",
        description: "What I ship in the first 24 hours.",
      },
      {
        href: "/metrics",
        description: "The dashboard a founder reads on Monday.",
      },
      {
        href: "/experiments",
        description: "Bets ranked by leverage and time to signal.",
      },
      {
        href: "/playbooks",
        description: "The plays I'd hand a future hire on day 30.",
      },
    ],
  },
  {
    label: "The receipts",
    kicker: "Why you can trust the numbers",
    routes: [
      {
        href: "/sources",
        description: "Every claim in the demo with its public citation.",
      },
      {
        href: "/resources",
        description: "Reading list, vendor docs, and the reg landscape.",
      },
      {
        href: "/case-study",
        description: "The Halton Family Health Team narrative end to end.",
      },
      {
        href: "/vs-tali",
        description: "Where Vero wins against Tali, where it doesn't yet.",
      },
      {
        href: "/vs-dax",
        description: "Vero versus Nuance DAX in the community-clinic wedge.",
      },
      {
        href: "/vs-suki",
        description: "Suki's specialty-first motion and what it cedes.",
      },
      {
        href: "/vs-summary",
        description: "All three competitors on one page, scored honestly.",
      },
      {
        href: "/calculator",
        description: "ROI math any clinic admin can run in two minutes.",
      },
      {
        href: "/objections",
        description: "The fifteen hardest questions and what I'd answer.",
      },
    ],
  },
];
