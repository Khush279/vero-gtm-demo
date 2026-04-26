/**
 * /docs content. A first-time-visitor walkthrough that frames how to read
 * the demo. Different from the README (engineers reading source) and
 * different from / (the cover letter). This page answers a single question:
 * "I have N minutes, what should I look at?"
 *
 * Three tours, one legend, one FAQ. Update copy here, not in the route file.
 */

export type TourStop = {
  /** Internal route or external URL. Pass straight to next/link. */
  route: string;
  /** Single sentence on why this stop is worth the click right now. */
  whyHere: string;
};

export type Tour = {
  /** Stable id used as React key and anchor target. */
  id: "3-minute" | "10-minute" | "engineer-deep";
  /** Plain-English duration. Shown on the chip. */
  duration: string;
  /** Who this tour is built for. Shown on the chip. */
  audience: string;
  /** One sentence framing for the tour. Renders below the chips. */
  intent: string;
  /** Ordered route stops. Four to seven each, one sentence per stop. */
  stops: TourStop[];
};

export type LegendItem = {
  /** Visual sample as plain text. The page renders it in the right typography. */
  glyph: string;
  /** What the glyph means and where it appears. */
  meaning: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type DocsContent = {
  intro: string;
  tours: Tour[];
  legend: LegendItem[];
  faq: FaqItem[];
};

export const DOCS: DocsContent = {
  intro:
    "This is a 48-hour interview demo, not a product. Pick a tour by how much time you have and follow the stops in order; every surface is calibrated to a JD bullet from Vero's Founding GTM Engineer posting.",

  tours: [
    {
      id: "3-minute",
      duration: "3 minutes",
      audience: "Founder skim",
      intent:
        "For Adeel, or anyone forwarding the URL into a hiring thread. Four stops that prove the work is real and the strategy is mine.",
      stops: [
        {
          route: "/",
          whyHere:
            "The cover letter. Two paragraphs framed at Adeel and Bill, then a six-tile grid that maps every JD bullet to a surface in this repo.",
        },
        {
          route: "/pipeline",
          whyHere:
            "500 real Ontario family physicians from the CPSO public register, scored against an ICP I derived from Vero's positioning, bucketed into stages.",
        },
        {
          route: "/lead/lead_0042",
          whyHere:
            "One enriched profile with inferred EMR and a four-touch sequence drafted live by gpt-4o-mini. This is what a clinician would actually receive.",
        },
        {
          route: "/strategy",
          whyHere:
            "The 30/60/90 memo. Where Vero is, why family practice in Ontario is the wedge, and what I would ship week by week.",
        },
      ],
    },
    {
      id: "10-minute",
      duration: "10 minutes",
      audience: "Founder full read",
      intent:
        "Eight stops covering the surfaces that prove the JD bullets end to end, from pipeline build through enterprise procurement and the analytics layer.",
      stops: [
        {
          route: "/",
          whyHere:
            "Start at the cover letter so the framing carries through every later surface.",
        },
        {
          route: "/pipeline",
          whyHere:
            "The CRM bullet. ICP scoring, stage transitions, filters by city and specialty, all wired to the same in-memory data model the rest of the demo reads from.",
        },
        {
          route: "/lead/lead_0042",
          whyHere:
            "The lifecycle-flows bullet. A four-touch sequence drafted live, leverage point per email, written for a real clinician at 6:47pm.",
        },
        {
          route: "/automations",
          whyHere:
            "The scripts-and-integrations bullet. Five running jobs, each with a View source expander reading the actual TypeScript off disk.",
        },
        {
          route: "/enterprise",
          whyHere:
            "The enterprise bullet. Hospital-system pipeline, named champions, and a pre-filled Ontario Health VoR questionnaire response.",
        },
        {
          route: "/analytics",
          whyHere:
            "The GA and Search Console bullet. Top-10 organic pages, three keyword bets, funnel attribution by source, and the one A/B test I would ship in week one.",
        },
        {
          route: "/case-study",
          whyHere:
            "The Halton Family Health Team narrative end to end, written as the artifact a sales engineer would hand a champion before the procurement call.",
        },
        {
          route: "/strategy",
          whyHere:
            "Close on the 30/60/90 memo so the demo lands as a plan, not just a portfolio.",
        },
      ],
    },
    {
      id: "engineer-deep",
      duration: "20 minutes",
      audience: "Bill",
      intent:
        "For the engineering co-founder. The surfaces that show I can ship the GTM stack itself, not just operate inside one someone else built.",
      stops: [
        {
          route: "/automations",
          whyHere:
            "Read the source for two or three of the jobs. The viewer renders the actual file off disk so what you read is what runs.",
        },
        {
          route: "/prompt-debugger",
          whyHere:
            "The prompts that draft the sequence emails, with knobs to swap variables and a side-by-side diff between drafts. Shows how I would let a non-engineer iterate without touching code.",
        },
        {
          route: "/chat",
          whyHere:
            "A small RAG surface over the strategy memo and the leads corpus. Demonstrates the retrieval shape I would use for the in-product clinic-admin assistant.",
        },
        {
          route: "/api/draft",
          whyHere:
            "The route that drafts a sequence. Reads from lib/prompts.ts and lib/scoring.ts, falls back to a cached payload when OPENAI_API_KEY is unset so the demo never breaks for a reviewer.",
        },
        {
          route: "/sources",
          whyHere:
            "Every external claim in the demo with its public citation, so you can audit the data layer before trusting any of the surfaces it feeds.",
        },
        {
          route: "https://github.com/Khush279/vero-gtm-demo",
          whyHere:
            "The repo. tsconfig is strict, server components by default, types in lib/types.ts, scoring in lib/scoring.ts. Day-2 todos are in the README under The honest gaps.",
        },
      ],
    },
  ],

  legend: [
    {
      glyph: "JD: Architect and own the CRM",
      meaning:
        "Mono small-caps kicker above every page title. Each one names the JD bullet that surface answers. If a page does not have a JD kicker it is supporting material, not a primary surface.",
    },
    {
      glyph: "Forest green",
      meaning:
        "Primary brand colour. Used for active state, link underlines, the strategy markers in the memo, and success status dots on /automations.",
    },
    {
      glyph: "Ochre",
      meaning:
        "Accent. Used for in-flight status (running jobs, draft pending), merge tokens like {{firstName}} inside email templates, and warm highlights inside the source viewer.",
    },
    {
      glyph: "Muted grey",
      meaning:
        "Secondary copy and metadata. Captions, timestamps, kickers, and the line counts beside View source headers all sit in muted grey so the eye lands on the editorial copy first.",
    },
    {
      glyph: "Sparkline",
      meaning:
        "Tiny inline trend on /analytics and /metrics. Reads as direction first, magnitude second. Hover for the underlying numbers.",
    },
    {
      glyph: "Status dot",
      meaning:
        "Six-pixel circle on /automations. Forest is success, ochre and pulsing is running, red is error. Always paired with a mono uppercase label so it is not colour-only.",
    },
    {
      glyph: "Score chip",
      meaning:
        "ICP score on lead cards in /pipeline and /lead/[id]. Two digits, mono tabular, derived in lib/scoring.ts from city, specialty, EMR signal, and clinic size.",
    },
    {
      glyph: "View source",
      meaning:
        "Button on /automations and /prompt-debugger that expands a dark mono pre block with the actual file contents. The line count next to the path is read at build time, not faked.",
    },
  ],

  faq: [
    {
      q: "Why no live email send?",
      a: "Because the leads are real physicians scraped from a public register, and sending unsolicited mail to them would betray the trust the register exists under. Every draft renders, every send button works in the UI, and nothing leaves the box. The day-1 production version would gate sends behind double opt-in or a partner intro through OntarioMD.",
    },
    {
      q: "Are the leads real?",
      a: "Yes. Five hundred Ontario family physicians scraped from the CPSO public register at one request per second, attribution preserved, only fields the register itself displays publicly. The clinic addresses, specialties, and graduation years are real. EMR inference is mine, scored from clinic size and region against the EMR market share data cited in /sources.",
    },
    {
      q: "Where do the numbers in /metrics come from?",
      a: "They are projections, not history. The send-volume baseline is what one founder running the play could realistically push in week one, and the reply rates are conservative against industry benchmarks for cold clinical outreach. Every assumption is annotated on the page itself, and /sources lists the citations behind the benchmarks.",
    },
    {
      q: "Did you use AI to write this?",
      a: "I wrote the strategy memo, the cover letter on the landing, the per-lead email logic, and every page of editorial copy. I used Claude as a pair programmer for the boilerplate around shadcn primitives and the source-viewer token highlighter. The voice and the calls are mine, and I would not send anything from this demo I have not personally read line by line.",
    },
    {
      q: "Can I run this locally?",
      a: "Yes, in three commands. Clone the repo, npm install, npm run dev. The OPENAI_API_KEY is optional; without it /api/draft returns a cached payload with the same shape as a live response so the demo never breaks for a reviewer who has not set up keys. Full instructions are in the README.",
    },
    {
      q: "What's mocked vs real?",
      a: "Real: the lead corpus, the scoring function, the prompts, the OpenAI integration, the Attio API client, the page routing, the build-time source reader on /automations. Mocked: the enterprise-system pipeline (clearly labeled), the analytics numbers (illustrative, with citations on /sources), and the inbound reply parser (a button, not a real Postmark listener). Day-1 work to harden each is in /day1.",
    },
    {
      q: "Why so many surfaces?",
      a: "The JD lists ten things a Founding GTM Engineer is responsible for, and for each one I wanted a surface a founder could click into and see how I would actually build it. A shorter demo would have proven I can write a memo. This one proves I can ship the engine the memo describes.",
    },
    {
      q: "Is this the production architecture?",
      a: "No. State is in-memory JSON because at 48 hours a database is debt I was not willing to underwrite. The day-2 plan is Postgres for the lead corpus with a daily CPSO refresh cron, streamed OpenAI drafts instead of buffered, the automation source viewer generated from the repo at build time, and Attio as the system of record with a webhook listener for two-way sync.",
    },
  ],
};
