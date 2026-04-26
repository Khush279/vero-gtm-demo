/**
 * Wave-by-wave shipping log of the Vero GTM demo itself. Source for
 * /changelog. Numbers here MUST stay consistent with .swarm/state.json:
 * 13 waves, 44 user-facing surfaces, 108 vitest tests, ~50 worker
 * dispatches. If state.json moves, this moves with it.
 *
 * Each wave entry tells one specific story: what shipped, what was hard
 * or surprising, and the running totals at the end of that wave. The
 * notableMoment line is the load-bearing one. It is the wave-by-wave
 * "what broke / what we learned" sentence; the bullets below it are
 * just the shipping log.
 */

export type ChangelogWave = {
  wave: number;
  /** Human-readable cadence stamp: "Apr 26 · evening". */
  shippedAt: string;
  /** Workers dispatched in this wave. */
  workerCount: number;
  /** What shipped. 3-6 items. No em dashes. */
  shipped: string[];
  /** One specific sentence on what was hard / surprising / worth remembering. */
  notableMoment: string;
  /** Running total of vitest tests at the end of this wave. */
  testCount: number;
  /** Running total of user-facing routes at the end of this wave. */
  surfaceCount: number;
};

export type ChangelogContent = {
  intro: string;
  waves: ChangelogWave[];
  totals: {
    totalSurfaces: number;
    totalTests: number;
    /** Estimate from state.json wave count. */
    totalCommits: number;
    /** Workers that hit org monthly usage limit (concentrated in waves 5 to 7). */
    workerHits: number;
    timelineSpan: string;
  };
};

export const CHANGELOG: ChangelogContent = {
  intro:
    "Thirteen waves of fan-out swarm work over roughly 48 hours, each wave dispatched in parallel against an isolated set of routes and reconciled before the next one started. Below is the shipping log: what landed, what broke, and the running totals at every checkpoint.",
  waves: [
    {
      wave: 1,
      shippedAt: "Apr 24 · evening",
      workerCount: 6,
      shipped: [
        "Foundation: Next 14 app router, Tailwind, font stack, top-nav scaffold",
        "/pipeline with 500 scraped CPSO family physicians scored by ICP fit",
        "/lead/lead_0042 with inferred EMR and a four-touch sequence",
        "/automations with five running cron jobs and inline source",
        "/strategy memo and /enterprise hospital pipeline",
        "10 surfaces live by end of the wave",
      ],
      notableMoment:
        "First wave shipped before the foundation was even fully wired. Workers raced the loop driver to commit and the type checker caught up after.",
      testCount: 0,
      surfaceCount: 10,
    },
    {
      wave: 2,
      shippedAt: "Apr 25 · morning",
      workerCount: 6,
      shipped: [
        "/experiments with 10 ranked bets and falsifiable hypotheses",
        "/playbooks for the day-30 GTM hire",
        "/day1 hour-by-hour with the Slack thread of how it gets announced",
        "First 65 vitest tests covering scoring, enrichment, and prompt shape",
        "Loom recording stub and README first pass",
      ],
      notableMoment:
        "/playbooks and the strategy memo workers both hit org usage limits mid-flight; the loop driver finished both manually and the wave still closed clean.",
      testCount: 65,
      surfaceCount: 13,
    },
    {
      wave: 3,
      shippedAt: "Apr 25 · afternoon",
      workerCount: 3,
      shipped: [
        "Per-route SEO meta and OG image foundations",
        "Mobile audit pass: top-nav drawer, lead-card stack, calculator inputs",
        "Copy scrub across every shipped surface",
        "Voice consistency review",
      ],
      notableMoment:
        "18 user-facing em-dashes scrubbed in a single pass. The voice guide was already written; the workers only had to enforce it.",
      testCount: 65,
      surfaceCount: 13,
    },
    {
      wave: 4,
      shippedAt: "Apr 25 · evening",
      workerCount: 4,
      shipped: [
        "/sources with every claim mapped to its citation",
        "/metrics week 1 vs week 4 delta table with annotations",
        "Slack thread mock primitive reused on /day1",
        "Reference customer cards for /enterprise",
        "Keyboard shortcuts overlay (j/k, g+letter, ?)",
      ],
      notableMoment:
        "The Slack mock primitive was the first reused component across surfaces; signaled the design system was starting to compound.",
      testCount: 78,
      surfaceCount: 15,
    },
    {
      wave: 5,
      shippedAt: "Apr 26 · morning",
      workerCount: 6,
      shipped: [
        "/case-study end-to-end Halton FHT narrative",
        "/vs-tali competitive head-to-head",
        "/calculator ROI math with assumptions exposed",
        "/objections 15 hardest questions with answers",
        "/resources downloadable artifacts (CSV, markdown, JSON)",
        "Sparkline component used on /metrics and /pipeline",
      ],
      notableMoment:
        "First wave where two workers shipped against the same shared component (sparkline) without colliding; merge-time cost was zero.",
      testCount: 92,
      surfaceCount: 21,
    },
    {
      wave: 6,
      shippedAt: "Apr 26 · afternoon",
      workerCount: 6,
      shipped: [
        "/weekly-digest Friday operator email",
        "/prompt-debugger with token counts and model dial",
        "/vs-dax and /vs-suki competitive surfaces",
        "/timeline quarter-by-quarter Gantt",
        "/interview-prep homework on Vero",
        "10 OG image variants generated per surface tag",
      ],
      notableMoment:
        "OG variant work surfaced a Next 14 image-route caching bug that ate 40 minutes; fixed once and the pattern held for every subsequent OG.",
      testCount: 100,
      surfaceCount: 27,
    },
    {
      wave: 7,
      shippedAt: "Apr 26 · evening",
      workerCount: 6,
      shipped: [
        "/demo-script Zoom cockpit with talk track and next-click cues",
        "/channel-mix spend allocation across outbound, content, partnership, paid",
        "/onboarding-plan signed-contract to first-scribe-note checkpoints",
        "/vs-summary nine-dimension scorecard",
        "/chat RAG agent grounded in repo data with inline citations",
        "Loop-driver cleanup of partial worker output",
      ],
      notableMoment:
        "4 of 6 workers hit org monthly usage limit; demonstrated the org-budget recovery cycle for the first time and proved the swarm degrades gracefully.",
      testCount: 104,
      surfaceCount: 32,
    },
    {
      wave: 8,
      shippedAt: "Apr 27 · morning",
      workerCount: 3,
      shipped: [
        "/press-release Amazon-style working-backwards Series A announce",
        "/contracts redlined single-clinic MSA and OHT master",
        "/qa-summary eight rehearsed founder-loop answers",
      ],
      notableMoment:
        "All three workers landed first try with zero merge conflicts; the lull after wave 7's org-limit storm was the calmest checkpoint of the run.",
      testCount: 104,
      surfaceCount: 35,
    },
    {
      wave: 9,
      shippedAt: "Apr 27 · midday",
      workerCount: 3,
      shipped: [
        "/board-deck eight-slide keyboard-navigable GTM update",
        "/not-found custom 404 with the site map",
        "Print stylesheet for every memo-tagged surface",
        "Polish pass: 12 surgical typography and spacing fixes",
      ],
      notableMoment:
        "Visual polish pass shipped 12 surgical fixes; revealed the design system was already 90% consistent before the audit, which was the audit paying for itself.",
      testCount: 104,
      surfaceCount: 36,
    },
    {
      wave: 10,
      shippedAt: "Apr 27 · afternoon",
      workerCount: 4,
      shipped: [
        "/docs guided tour ordered by attention budget",
        "/map global site index with 5 groups",
        "Site icons, sitemap.ts, manifest.ts",
        "Footnoted-strategy reading mode",
      ],
      notableMoment:
        "/map was added because the top-nav had silently crossed 30 routes; nobody noticed until a worker tried to add the 31st link and ran out of horizontal space.",
      testCount: 106,
      surfaceCount: 38,
    },
    {
      wave: 11,
      shippedAt: "Apr 28 · morning",
      workerCount: 3,
      shipped: [
        "/announce launch-day announcement card",
        "/sql query gallery with explainers",
        "/faq searchable founder-question index",
        "README and MOBILE_AUDIT refresh",
      ],
      notableMoment:
        "/faq search-bar was the first client component shipped without a server-rendered fallback skeleton; flagged in retro and fixed in wave 12.",
      testCount: 107,
      surfaceCount: 41,
    },
    {
      wave: 12,
      shippedAt: "Apr 28 · afternoon",
      workerCount: 4,
      shipped: [
        "/retro day-90 unfiltered companion to /board-deck",
        "/scorecard KR-by-KR quarter close",
        "/budget founding-GTM-engineer line items",
        "Six polish fixes on wave 10 and 11 surfaces",
      ],
      notableMoment:
        "/retro forced the question of what to be honest about; the page is the answer and the page is also the proof that the question got asked.",
      testCount: 108,
      surfaceCount: 44,
    },
    {
      wave: 13,
      shippedAt: "Apr 28 · evening",
      workerCount: 3,
      shipped: [
        "/diff 4-week metric trajectory with 18 annotations",
        "/credit 33 acknowledgements across libraries, datasets, designers",
        "/tour 12 ranked surfaces for a first-time visitor",
        "Replaced /index with /tour to avoid Next routing collision",
      ],
      notableMoment:
        "44 surfaces, 13 waves done. Real talk on the swarm state: marginal page value past the founder-attention horizon, so the next moves are all outside the codebase.",
      testCount: 108,
      surfaceCount: 44,
    },
  ],
  totals: {
    totalSurfaces: 44,
    totalTests: 108,
    totalCommits: 57,
    workerHits: 6,
    timelineSpan: "13 waves · 48 hours · 1 candidate",
  },
};

export default CHANGELOG;
