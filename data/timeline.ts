/**
 * data/timeline.ts
 *
 * The 30/60/90 plan as a structured dataset. The /strategy page renders this
 * as prose; /timeline renders it as a horizontal gantt with swimlanes.
 *
 * Days are 1-indexed against "Day 1 of the role." Lanes are the four
 * GTM workstreams the strategy memo carves out: outbound (the engine),
 * content (the brand SEO motion), enterprise (the VoR-driven hospital lane),
 * and hire (when to hire #2 and what shape).
 */

export type Lane = "outbound" | "content" | "enterprise" | "hire";

export type Status = "planned" | "in-progress" | "shipped" | "blocked";

export type Milestone = {
  id: string;
  lane: Lane;
  title: string;
  /** Inclusive start day, 1..90. */
  startDay: number;
  /** Inclusive end day, 1..90. */
  endDay: number;
  status: Status;
  /** One sentence. Shows in tooltip and the weekly card list. */
  description: string;
  /** Other milestone ids this depends on. Used for the dep-arc in the chart. */
  dependencies?: string[];
  /** Optional success metric. e.g. "1k FPs/wk sequenced". */
  metric?: string;
};

export const LANE_ORDER: Lane[] = [
  "outbound",
  "content",
  "enterprise",
  "hire",
];

export const LANE_LABEL: Record<Lane, string> = {
  outbound: "Outbound",
  content: "Content",
  enterprise: "Enterprise",
  hire: "Hire #2",
};

export const LANE_DESCRIPTION: Record<Lane, string> = {
  outbound: "The sequenced-FP engine. Volume, reply rate, classifier.",
  content: "Comparison pages and partner webinars. SEO and brand.",
  enterprise: "VoR-eligible institutions. RFPs and procurement.",
  hire: "Scope and sign the second GTM hire.",
};

export const MILESTONES: Milestone[] = [
  /* ----------------------------- Outbound (6) ---------------------------- */
  {
    id: "ob-attio",
    lane: "outbound",
    title: "Stand up Attio pipeline",
    startDay: 1,
    endDay: 3,
    status: "shipped",
    description:
      "500 CPSO-sourced Ontario FPs imported, scored, and segmented in Attio with a recalc job so rubric tweaks ship without redeploys.",
    metric: "500 leads, scored",
  },
  {
    id: "ob-first-50",
    lane: "outbound",
    title: "First 50 hand-reviewed sends",
    startDay: 3,
    endDay: 7,
    status: "in-progress",
    description:
      "First 50 sequenced touches go out with a human approving every draft. Calibrates the AI before volume turns on.",
    dependencies: ["ob-attio"],
    metric: "50 sends, 5 demos booked",
  },
  {
    id: "ob-1k-week",
    lane: "outbound",
    title: "1k FPs/wk reached",
    startDay: 8,
    endDay: 30,
    status: "planned",
    description:
      "Sustainable 1,000 sequenced FPs per week, ~50 per business day per BDR-equivalent. AI drafts, a human approves.",
    dependencies: ["ob-first-50"],
    metric: "1,000 FPs/wk sustained",
  },
  {
    id: "ob-emr-variants",
    lane: "outbound",
    title: "EMR-aware variants live",
    startDay: 24,
    endDay: 30,
    status: "planned",
    description:
      "Template variants reference each clinician's EMR by name (OSCAR, Telus PSS, Accuro). Doubles the workflow-aware signal.",
    dependencies: ["ob-1k-week"],
    metric: "+30% reply lift target",
  },
  {
    id: "ob-classifier",
    lane: "outbound",
    title: "Reply classifier in prod",
    startDay: 45,
    endDay: 60,
    status: "planned",
    description:
      "Replaces the regex stub with a fine-tuned classifier that routes positive replies to a human within 4 minutes business-hours.",
    dependencies: ["ob-1k-week"],
    metric: "<4 min route time",
  },
  {
    id: "ob-touch-cron",
    lane: "outbound",
    title: "Automate touch-due cron",
    startDay: 50,
    endDay: 65,
    status: "planned",
    description:
      "Cron job that schedules touch 2/3/4 by cadence (Day 1/4/9/16) without a human queueing the next send.",
    dependencies: ["ob-classifier"],
    metric: "0 manual sequence pushes",
  },

  /* ----------------------------- Content (3) ----------------------------- */
  {
    id: "ct-vs-tali",
    lane: "content",
    title: "Vero vs Tali comparison page",
    startDay: 5,
    endDay: 15,
    status: "in-progress",
    description:
      "Honest side-by-side comparison page. Opens with the price delta and a 40-second doc-upload demo; targets the 'tali ai review' query.",
    metric: "Page-1 within 30 days",
  },
  {
    id: "ct-seo-pages",
    lane: "content",
    title: "5 SEO comparison pages live",
    startDay: 16,
    endDay: 45,
    status: "planned",
    description:
      "Vero pricing for Ontario FPs, PIPEDA-compliant AI scribe, AI scribe for OSCAR users, AI scribe for FHTs, plus the Tali page.",
    dependencies: ["ct-vs-tali"],
    metric: "5 pages indexed",
  },
  {
    id: "ct-ontariomd-webinar",
    lane: "content",
    title: "OntarioMD co-branded webinar",
    startDay: 60,
    endDay: 90,
    status: "planned",
    description:
      "Co-branded webinar with OntarioMD or OCFP. Lands the long-tail solo FPs not on LinkedIn at zero CAC.",
    metric: "1 webinar shipped",
  },

  /* --------------------------- Enterprise (4) ---------------------------- */
  {
    id: "en-vor-list",
    lane: "enterprise",
    title: "VoR-eligible institutions list",
    startDay: 1,
    endDay: 7,
    status: "shipped",
    description:
      "Catalog every Ontario FHT, OHT, and hospital-affiliated clinic where the VoR badge bypasses procurement. Scored by VoR overlap.",
    metric: "40+ institutions catalogued",
  },
  {
    id: "en-rfp-1",
    lane: "enterprise",
    title: "First hospital RFP response",
    startDay: 10,
    endDay: 25,
    status: "in-progress",
    description:
      "Pre-fill the standard Ontario Health questionnaire from Vero's security docs. Cuts an 8-hour task to 45 minutes.",
    dependencies: ["en-vor-list"],
    metric: "1 RFP submitted",
  },
  {
    id: "en-procurement-3",
    lane: "enterprise",
    title: "3 systems in active procurement",
    startDay: 40,
    endDay: 60,
    status: "planned",
    description:
      "Trillium, Hamilton Health Sciences, and Niagara Health on the VoR overlap. Each in active questionnaire or pilot scoping.",
    dependencies: ["en-rfp-1"],
    metric: "3 active deals",
  },
  {
    id: "en-first-close",
    lane: "enterprise",
    title: "First closed enterprise contract",
    startDay: 75,
    endDay: 90,
    status: "planned",
    description:
      "One Trillium-shaped deal closed-won. Targets $80k ARR and proves the VoR-bypass motion is real revenue.",
    dependencies: ["en-procurement-3"],
    metric: "$80k ARR signed",
  },

  /* ------------------------------- Hire (2) ------------------------------ */
  {
    id: "hr-scope",
    lane: "hire",
    title: "Scope hire #2 (BDR vs content)",
    startDay: 60,
    endDay: 75,
    status: "planned",
    description:
      "Read is BDR first because content is already healthy. Write the JD, define the 30/60/90, run 5 first-rounds.",
    metric: "5 candidates shortlisted",
  },
  {
    id: "hr-offer",
    lane: "hire",
    title: "Sign offer",
    startDay: 80,
    endDay: 90,
    status: "planned",
    description:
      "Offer signed by Day 90 so the second GTM hire is onboarding before the next quarter starts.",
    dependencies: ["hr-scope"],
    metric: "1 offer accepted",
  },
];

/** Total days on the timeline. Hardcoded so axis math is simple. */
export const TOTAL_DAYS = 90;

/** Where the 30 and 60 day vertical guides sit. */
export const PHASE_MARKERS: { day: number; label: string }[] = [
  { day: 30, label: "Day 30" },
  { day: 60, label: "Day 60" },
];
