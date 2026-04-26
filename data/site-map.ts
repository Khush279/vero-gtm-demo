/**
 * Source of truth for /map, the global site index. The top-nav has crossed
 * 30 routes and a founder skimming the demo needs one screen they can scroll
 * to find any surface. Keep descriptions to one specific sentence about what
 * lives at the route, not what it is. No em dashes anywhere.
 *
 * Edit here, not in app/map/page.tsx.
 */

export type SiteMapEntry = {
  href: string;
  title: string;
  description: string;
  ja: "demo-only" | "page" | "downloadable" | "api";
  surfaceTag?: string;
};

export type SiteMapGroup = {
  id: string;
  label: string;
  kicker: string;
  blurb: string;
  entries: SiteMapEntry[];
};

export const SITE_MAP: SiteMapGroup[] = [
  {
    id: "product",
    label: "The product",
    kicker: "What I'd build with you",
    blurb:
      "The surfaces a founder demos to a champion in the first ten minutes. Every one of these is wired to real data or a working agent, not a screenshot.",
    entries: [
      {
        href: "/pipeline",
        title: "Pipeline",
        description:
          "500 real Ontario family physicians scraped from the CPSO register, scored by ICP fit and bucketed into a five-stage Attio-style board.",
        ja: "page",
        surfaceTag: "interactive",
      },
      {
        href: "/lead/lead_0042",
        title: "Lead profile",
        description:
          "One enriched FP profile with inferred EMR, a four-touch sequence drafted live by gpt-4o-mini, and the leverage point called out per email.",
        ja: "page",
        surfaceTag: "interactive",
      },
      {
        href: "/case-study",
        title: "Case study",
        description:
          "End-to-end Halton Family Health Team narrative from cold outreach to signed pilot, with the artifacts that moved each stage forward.",
        ja: "page",
        surfaceTag: "narrative",
      },
      {
        href: "/automations",
        title: "Automations",
        description:
          "Five running cron jobs with their actual TypeScript source visible inline, the page that separates GTM engineers from RevOps.",
        ja: "page",
        surfaceTag: "interactive",
      },
      {
        href: "/chat",
        title: "Chat",
        description:
          "RAG agent answering questions about Vero's GTM grounded in this repo's data, citations rendered inline so you can see what it pulled from.",
        ja: "api",
        surfaceTag: "live agent",
      },
      {
        href: "/prompt-debugger",
        title: "Prompts",
        description:
          "Sequence-drafter prompt with token counts, model dial, and a side-by-side run so a founder can A/B the wording before shipping.",
        ja: "page",
        surfaceTag: "interactive",
      },
      {
        href: "/calculator",
        title: "Calculator",
        description:
          "ROI math any clinic admin can run in two minutes, with the assumptions exposed and the per-physician dollar figure spelled out.",
        ja: "page",
        surfaceTag: "interactive",
      },
    ],
  },
  {
    id: "plan",
    label: "The plan",
    kicker: "How week one looks",
    blurb:
      "Strategy artifacts a founder reads before deciding how to spend the first ninety days. Every page commits to a specific bet with a specific date attached.",
    entries: [
      {
        href: "/strategy",
        title: "Strategy",
        description:
          "The 90-day plan and where the wedge is, with the operating cadence and the metric I'd be fired for missing.",
        ja: "page",
        surfaceTag: "memo",
      },
      {
        href: "/day1",
        title: "Day 1",
        description:
          "What I ship in the first 24 hours, hour by hour, with the Slack thread of how I'd announce each piece to the team.",
        ja: "page",
        surfaceTag: "narrative",
      },
      {
        href: "/timeline",
        title: "Timeline",
        description:
          "Quarter-by-quarter Gantt view of the GTM motion across hiring, channel, content, and partnership tracks.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/experiments",
        title: "Experiments",
        description:
          "Ten bets ranked by leverage and time to signal, each with the falsifiable hypothesis and the kill criteria.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/playbooks",
        title: "Playbooks",
        description:
          "The plays I'd hand a future GTM hire on day 30, written so they can run them solo without me in the room.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/onboarding-plan",
        title: "Onboarding",
        description:
          "Customer onboarding plan from signed contract to first scribe note, mapped to the human checkpoints that earn renewal.",
        ja: "page",
        surfaceTag: "static",
      },
    ],
  },
  {
    id: "competition",
    label: "The competition",
    kicker: "Where Vero wins, where it doesn't yet",
    blurb:
      "Honest head-to-heads against the three competitors a primary-care prospect will already be evaluating. No selective comparisons, no cherry-picked feature grids.",
    entries: [
      {
        href: "/vs-tali",
        title: "vs Tali",
        description:
          "Where Vero wins against Tali on EMR coverage and Canadian data residency, where Tali still wins on installed base.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/vs-dax",
        title: "vs DAX",
        description:
          "Vero versus Nuance DAX in the community-clinic wedge, with the per-seat math that makes DAX unaffordable below 50 providers.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/vs-suki",
        title: "vs Suki",
        description:
          "Suki's specialty-first motion and the family-medicine ground it cedes by going after orthopedics and cardiology in the US.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/vs-summary",
        title: "vs Summary",
        description:
          "All three competitors on one page scored across nine dimensions, with the dimension Vero loses on called out in red.",
        ja: "page",
        surfaceTag: "static",
      },
    ],
  },
  {
    id: "receipts",
    label: "The receipts",
    kicker: "Why you can trust the numbers",
    blurb:
      "Proof and grounding for every claim in the demo. If a page anywhere shows a number, this is where you find the citation behind it.",
    entries: [
      {
        href: "/sources",
        title: "Sources",
        description:
          "Every claim across the demo mapped to its public citation, with synthetic data labeled and a day-1 plan for swapping each mock to live.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/resources",
        title: "Resources",
        description:
          "Five downloadable artifacts you can hand the second hire on day one, served as real CSV, markdown, and JSON files from /public.",
        ja: "downloadable",
        surfaceTag: "downloads",
      },
      {
        href: "/metrics",
        title: "Metrics",
        description:
          "Week 1 versus week 4 of the GTM engine side by side, with the delta column annotated by which weeks 2 and 3 changes moved each line.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/channel-mix",
        title: "Channel mix",
        description:
          "Spend allocation across outbound, content, partnership, and paid for the first two quarters, with payback period per dollar.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/analytics",
        title: "Analytics",
        description:
          "Top-10 organic pages, three keyword bets, funnel attribution by source, and one A/B test I would ship inside week one.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/weekly-digest",
        title: "Weekly digest",
        description:
          "The Friday operator email a founder reads in two minutes, charts inline, ending with the one decision the team needs from them.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/objections",
        title: "Objections",
        description:
          "The fifteen hardest questions a Canadian primary-care buyer asks, each with the answer I would give and the proof point behind it.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/enterprise",
        title: "Enterprise",
        description:
          "Hospital-system pipeline with named champions and a pre-filled Ontario Health Vendor of Record response template ready to send.",
        ja: "page",
        surfaceTag: "narrative",
      },
    ],
  },
  {
    id: "founders",
    label: "For the founders",
    kicker: "Interview-specific artifacts",
    blurb:
      "Built for Adeel and Bill specifically, not a generic portfolio. The pages here exist because the interview process asked for them.",
    entries: [
      {
        href: "/",
        title: "Home",
        description:
          "Cover letter framed as one viewport, scannable in 30 seconds, with a grid linking out to every other surface in the demo.",
        ja: "page",
        surfaceTag: "landing",
      },
      {
        href: "/docs",
        title: "Docs",
        description:
          "Guided tour of the demo for first-time visitors, ordered by what to read in 5 minutes, 15 minutes, or a full sit-down.",
        ja: "page",
        surfaceTag: "tour",
      },
      {
        href: "/qa-summary",
        title: "Q&A summary",
        description:
          "The eight questions I expect Adeel and Bill to ask in the loop, with the one-paragraph answer rehearsed in writing.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/interview-prep",
        title: "Interview prep",
        description:
          "My homework on Vero before the call: founders' backgrounds, the YC batch context, and the questions I'm bringing to them.",
        ja: "page",
        surfaceTag: "static",
      },
      {
        href: "/press-release",
        title: "Press release",
        description:
          "The Amazon-style working-backwards announcement for Vero's Series A, written as if shipping it eighteen months from now.",
        ja: "page",
        surfaceTag: "narrative",
      },
      {
        href: "/contracts",
        title: "Contracts",
        description:
          "Two redlined pilot agreements: a single-clinic MSA and an Ontario Health Team master, both in the language procurement uses.",
        ja: "page",
        surfaceTag: "narrative",
      },
      {
        href: "/board-deck",
        title: "Board deck",
        description:
          "The eight-slide GTM update I would present at the first board meeting after joining, keyboard-navigable like a real deck.",
        ja: "page",
        surfaceTag: "interactive",
      },
      {
        href: "/demo-script",
        title: "Demo script",
        description:
          "The cockpit I'd use to demo Vero on a Zoom call, with the talk track scripted and the next click highlighted at every step.",
        ja: "page",
        surfaceTag: "interactive",
      },
      {
        href: "/candor",
        title: "Candor",
        description:
          "What I'd say if we were already on the team. Found, not pushed. Not in the top nav.",
        ja: "page",
        surfaceTag: "static",
      },
    ],
  },
];

export const SITE_MAP_TOTALS = {
  groups: SITE_MAP.length,
  surfaces: SITE_MAP.reduce((sum, g) => sum + g.entries.length, 0),
  downloadable: SITE_MAP.reduce(
    (sum, g) => sum + g.entries.filter((e) => e.ja === "downloadable").length,
    0,
  ),
  agents: SITE_MAP.reduce(
    (sum, g) => sum + g.entries.filter((e) => e.ja === "api").length,
    0,
  ),
};
