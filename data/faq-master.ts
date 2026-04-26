/**
 * /faq content. The single index that aggregates the FAQs scattered across
 * /docs, /objections, /vs-tali, /vs-dax, /vs-suki, and /interview-prep into
 * one organized lookup. Distilled, not copy-pasted: questions that appear
 * in multiple sources are merged, language is simplified, and every entry
 * links back to the surface where it lives in deeper context.
 *
 * Six categories: Pricing, Compliance, Workflow, Sales process, About this
 * demo, Vero the company.
 */

export type FaqEntry = {
  /** Stable id for React keys and anchor targets. */
  id: string;
  /** Question phrased the way a buyer (or reviewer) would actually ask it. */
  question: string;
  /** 1-3 sentences. Distilled, not the verbatim source answer. */
  answer: string;
  /** Where to send the reader for the deeper treatment. */
  sourceSurface: string;
  /** Lowercase tags for the search filter. */
  tags: string[];
};

export type FaqCategory = {
  id: string;
  label: string;
  description: string;
  entries: FaqEntry[];
};

export const MASTER_FAQ: FaqCategory[] = [
  {
    id: "pricing",
    label: "Pricing",
    description:
      "What Vero costs, how the math compares to Tali, Suki, and DAX, and why the wedge is priced the way it is.",
    entries: [
      {
        id: "price-monthly",
        question: "What does Vero cost per clinician?",
        answer:
          "$59.99 a month flat, or $720 a year on the annual plan. No per-encounter fees, no setup charge, no claw-back if you cancel.",
        sourceSurface: "/objections",
        tags: ["pricing", "cost", "annual", "monthly"],
      },
      {
        id: "price-vs-tali",
        question: "Why is Vero so much cheaper than Tali?",
        answer:
          "Two reasons. Infrastructure cost per encounter is lower because Vero runs inference on a tighter model stack, and pricing is held low on purpose to win the next 5,000 Canadian clinicians instead of extracting maximum revenue from the first 5,000.",
        sourceSurface: "/vs-tali",
        tags: ["pricing", "tali", "competitor"],
      },
      {
        id: "price-vs-dax",
        question: "Why is DAX so much more expensive?",
        answer:
          "DAX is sold into hospital systems with enterprise contracts, dedicated implementation teams, and 24x7 support, and it carries the Microsoft Nuance brand premium. Vero is built and priced for the community clinic, not the hospital system.",
        sourceSurface: "/vs-dax",
        tags: ["pricing", "dax", "competitor", "enterprise"],
      },
      {
        id: "price-vs-suki",
        question: "How does Vero compare to Suki on price?",
        answer:
          "Suki lists at $199 to $299 a month per clinician, roughly a 4x delta on the per-seat rate. Same SOAP-quality output on the encounter types tested.",
        sourceSurface: "/vs-suki",
        tags: ["pricing", "suki", "competitor"],
      },
      {
        id: "price-roi",
        question: "What's the ROI math on $59.99 a month?",
        answer:
          "Most family physicians spend 3 to 5 hours a week charting after clinic closes. Vero pays for itself the first week a clinician stops charting on weekends, and the spend is roughly the cost of a coffee subscription.",
        sourceSurface: "/objections",
        tags: ["pricing", "roi", "value"],
      },
      {
        id: "price-contract",
        question: "Is there a long-term contract?",
        answer:
          "No. Month-to-month or annual at the customer's choice. Cancel any time, no claw-back, no early-termination fee. The data is yours either way.",
        sourceSurface: "/vs-tali",
        tags: ["pricing", "contract", "cancellation"],
      },
      {
        id: "price-on-top-of-emr",
        question: "I'm already paying for the EMR. Why pay for Vero on top?",
        answer:
          "The EMR is the system of record. Vero is the thing that gets a clinician out of the chart at 6pm instead of 9pm. It writes back into the EMR you already pay for, so the workflow stays one screen.",
        sourceSurface: "/objections",
        tags: ["pricing", "emr", "workflow"],
      },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    description:
      "PIPEDA, PHIPA, Ontario Health VoR, audit logs, data residency, and the CPSO posture on AI scribes.",
    entries: [
      {
        id: "comp-pipeda",
        question: "Is Vero compliant with my province's privacy laws?",
        answer:
          "Yes. PIPEDA-compliant and PHIPA-aligned for Ontario, with PHI stored in Canadian data centres (Montreal primary, Toronto secondary). Inference runs on Canadian-hosted endpoints.",
        sourceSurface: "/vs-tali",
        tags: ["compliance", "pipeda", "phipa", "privacy", "residency"],
      },
      {
        id: "comp-audio-storage",
        question: "Where does the audio go? Is it stored?",
        answer:
          "Audio stays on AWS ca-central-1 and never crosses the border. Retained 30 days for clinic QA, then permanently deleted. Encrypted at rest and audited under PIPEDA.",
        sourceSurface: "/objections",
        tags: ["compliance", "privacy", "audio", "residency", "aws"],
      },
      {
        id: "comp-cpso",
        question: "What about CPSO complaints? Is my licence at risk?",
        answer:
          "The clinician signs the note, so the clinician owns the note. Vero is positioned as a drafting tool, same as a medical scribe, and the CPSO 2024 AI scribe guidance treats it that way. Per-note audit logs and 30-day audio retention provide the evidence chain if a complaint ever lands.",
        sourceSurface: "/objections",
        tags: ["compliance", "cpso", "licence", "audit"],
      },
      {
        id: "comp-vor",
        question: "What is the Ontario Health Vendor of Record badge?",
        answer:
          "VoR is a procurement shortcut that collapses 6 to 9 months of evaluation for FHTs, OHTs, and hospital-affiliated clinics in Ontario. Vero carries it. Tali, Suki, and DAX do not.",
        sourceSurface: "/vs-tali",
        tags: ["compliance", "vor", "procurement", "ontario"],
      },
      {
        id: "comp-baa",
        question: "Does Vero offer a BAA?",
        answer:
          "BAAs are the US/HIPAA construct. The Canadian equivalent is a PIPEDA-aligned DPIA plus a ca-central-1 residency letter, both available pre-pilot. For US customers operating cross-border, a BAA is also available.",
        sourceSurface: "/objections",
        tags: ["compliance", "baa", "hipaa", "dpia"],
      },
      {
        id: "comp-vs-dax-residency",
        question: "How does Vero's compliance posture compare to DAX?",
        answer:
          "DAX is HIPAA-aligned with a BAA and stores PHI in US data centres. That is not the same as PIPEDA compliance with PHI stored in Canada, which is what Canadian colleges ask for.",
        sourceSurface: "/vs-dax",
        tags: ["compliance", "dax", "residency", "competitor"],
      },
      {
        id: "comp-audit-logs",
        question: "Are there audit logs for every edit?",
        answer:
          "Yes. Per-note audit log of every edit, plus 30-day audio retention, exportable on demand for College inquiries or internal QA.",
        sourceSurface: "/objections",
        tags: ["compliance", "audit", "logs"],
      },
    ],
  },
  {
    id: "workflow",
    label: "Workflow",
    description:
      "EMR integration, dictation versus scribing, specialty templates, doc upload, and how Vero fits a clinic day.",
    entries: [
      {
        id: "work-emr-integration",
        question: "Will my clinic admin need to do an EMR integration?",
        answer:
          "Not for trial. Vero runs alongside Telus PSS, Accuro, OSCAR, and Epic on day one through the same paste path you already use. Deeper write-back integrations are available on the paid plan and take a half-day of admin time, not weeks.",
        sourceSurface: "/vs-tali",
        tags: ["workflow", "emr", "integration", "onboarding"],
      },
      {
        id: "work-dictation",
        question: "I dictate. Why do I need a scribe?",
        answer:
          "Dictation gets you the words. Vero gets you the SOAP note, billing codes, and patient instructions, all structured and dropped into the right fields. Most onboarded docs keep dictation for letters and use Vero for visit notes.",
        sourceSurface: "/objections",
        tags: ["workflow", "dictation", "soap"],
      },
      {
        id: "work-specialty-templates",
        question: "Does Vero have templates for my specialty?",
        answer:
          "Vero ships 150+ templates across primary care, paeds, derm, psych, IM, sports med, OB, palliative, and 12 surgical specialties. If yours is not in the library, the custom template SLA is 9 days from sample notes to live template.",
        sourceSurface: "/vs-tali",
        tags: ["workflow", "templates", "specialty"],
      },
      {
        id: "work-doc-upload",
        question: "Can Vero read referral letters and PDFs?",
        answer:
          "Yes. Vero ingests prior auths, consult letters, and patient PDFs and writes them into the encounter. This is the doc-upload feature that Tali, Suki, and DAX do not ship.",
        sourceSurface: "/vs-tali",
        tags: ["workflow", "doc-upload", "referral", "pdf"],
      },
      {
        id: "work-meds-accuracy",
        question: "What if Vero gets the meds wrong?",
        answer:
          "Every note is a draft until the clinician signs it. Meds, doses, and frequencies are flagged for explicit review before the draft pushes to the EMR, and the source audio is in the timeline if a clinician wants to verify what was said.",
        sourceSurface: "/objections",
        tags: ["workflow", "accuracy", "meds", "safety"],
      },
      {
        id: "work-hallucination",
        question: "How do I know it won't hallucinate?",
        answer:
          "Vero only writes from the audio it heard. A grounding check runs against the transcript before the draft renders, and clinics can upload their own protocols so the language matches how they already practice.",
        sourceSurface: "/objections",
        tags: ["workflow", "accuracy", "hallucination", "trust"],
      },
      {
        id: "work-mobile",
        question: "Does Vero have a mobile app?",
        answer:
          "Web-only today, served as a responsive PWA. A native app is on the roadmap, not on a clinician's device this quarter. Clinicians who chart from a phone between rooms today are better served by Suki or Tali.",
        sourceSurface: "/vs-suki",
        tags: ["workflow", "mobile", "ios", "android"],
      },
      {
        id: "work-french",
        question: "Is the UI available in French?",
        answer:
          "Yes. Native French interface ships with the product. Important for Ottawa, Sudbury, and any Quebec-adjacent clinic. Suki is English-only today; DAX reaches French through a separate translation step.",
        sourceSurface: "/vs-suki",
        tags: ["workflow", "french", "language", "ui"],
      },
      {
        id: "work-real-time",
        question: "Is the transcription real-time?",
        answer:
          "Yes. Live transcript surfaces inside 2 seconds of speech. Note generation is 4 to 6 seconds on the average 12-minute encounter, which matters at end of day, not in the room.",
        sourceSurface: "/vs-tali",
        tags: ["workflow", "transcription", "real-time", "latency"],
      },
    ],
  },
  {
    id: "sales-process",
    label: "Sales process",
    description:
      "Trial path, RFP and procurement, references, switching from another scribe, and how a clinic actually buys.",
    entries: [
      {
        id: "sales-trial",
        question: "How long is the trial and do I need a credit card?",
        answer:
          "14 days, no credit card. Self-serve. Most solo clinicians finish their first note inside 30 minutes of signing up.",
        sourceSurface: "/vs-tali",
        tags: ["sales", "trial", "self-serve"],
      },
      {
        id: "sales-onboarding",
        question: "How long is onboarding from signup to first encounter?",
        answer:
          "Median is 2 days. Solo clinicians on the self-serve path usually finish their first note in 30 minutes. Tali's published median is 7 days, Suki is 5 to 10, DAX is 30 to 60 as a hospital-system rollout.",
        sourceSurface: "/vs-tali",
        tags: ["sales", "onboarding", "timeline"],
      },
      {
        id: "sales-switching",
        question: "I'm on Tali, Heidi, or Suki. What's the migration look like?",
        answer:
          "Migration is mostly a settings export. Vero ingests custom templates, macros, and preferred note structure. Most physicians run both side by side for a week and decide after 5 to 7 visits. Past notes stay in the EMR where they already live; no PHI moves between vendors.",
        sourceSurface: "/objections",
        tags: ["sales", "switching", "migration", "competitor"],
      },
      {
        id: "sales-references",
        question: "Can I talk to a current customer?",
        answer:
          "Yes. Named clinicians are visible publicly on the comparison pages, and the team will connect you with one in your city on request. No procurement call required to get on the phone.",
        sourceSurface: "/vs-tali",
        tags: ["sales", "references", "customers"],
      },
      {
        id: "sales-rfp",
        question: "Does Vero have an RFP response ready for procurement?",
        answer:
          "Yes. Pre-filled Ontario Health VoR questionnaire response and a 1-page SOC2 plain-language summary. The RFP-response generator on /enterprise drafts the rest from Vero's security docs in under 45 minutes.",
        sourceSurface: "/interview-prep",
        tags: ["sales", "rfp", "procurement", "enterprise"],
      },
      {
        id: "sales-trial-vs-pilot",
        question: "Why does DAX require a pilot when Vero offers a trial?",
        answer:
          "Different motion. DAX is sold as a hospital-system enterprise rollout with a scoped SOW, which is appropriate at that scale. Vero is sold as a self-serve trial because the buyer is a solo or small-group clinic that does not need to involve procurement.",
        sourceSurface: "/vs-dax",
        tags: ["sales", "trial", "pilot", "dax"],
      },
      {
        id: "sales-side-by-side",
        question: "Can I trial Vero and Tali in parallel?",
        answer:
          "Yes, and we recommend it. Both offer 14-day no-credit-card trials. Run them in parallel for one week each on the same kind of encounter, and pick the one that produces the note you would have written yourself.",
        sourceSurface: "/vs-tali",
        tags: ["sales", "trial", "side-by-side", "competitor"],
      },
      {
        id: "sales-emr-cohort",
        question: "If I run Epic, should I just use DAX?",
        answer:
          "If you are a hospital system on Epic that needs structured write-back into discrete chart fields, DAX is the better pick today. If you are a community clinic on Epic, Telus PSS, Accuro, or OSCAR, Vero is the right scope and the right price.",
        sourceSurface: "/vs-dax",
        tags: ["sales", "epic", "dax", "emr"],
      },
    ],
  },
  {
    id: "about-demo",
    label: "About this demo",
    description:
      "What is real versus mocked in the GTM demo, why no live email send, and how to run it locally.",
    entries: [
      {
        id: "demo-real-vs-mock",
        question: "What's real and what's mocked in this demo?",
        answer:
          "Real: the lead corpus, scoring function, prompts, OpenAI integration, Attio API client, page routing, and the build-time source reader on /automations. Mocked: the enterprise-system pipeline (clearly labelled), the analytics numbers (illustrative, with citations on /sources), and the inbound reply parser.",
        sourceSurface: "/docs",
        tags: ["demo", "mocked", "real"],
      },
      {
        id: "demo-no-send",
        question: "Why is there no live email send?",
        answer:
          "The leads are real Ontario family physicians scraped from the CPSO public register, and sending unsolicited mail to them would betray the trust the register exists under. Drafts render, send buttons work in the UI, nothing leaves the box.",
        sourceSurface: "/docs",
        tags: ["demo", "email", "ethics"],
      },
      {
        id: "demo-leads-real",
        question: "Are the leads real?",
        answer:
          "Yes. 500 Ontario family physicians scraped from the CPSO public register at one request per second, attribution preserved, only fields the register itself displays publicly. EMR inference is mine, scored from clinic size and region against EMR market share data cited in /sources.",
        sourceSurface: "/docs",
        tags: ["demo", "leads", "cpso", "data"],
      },
      {
        id: "demo-metrics-source",
        question: "Where do the numbers in /metrics come from?",
        answer:
          "Projections, not history. Send-volume baseline is what one founder running the play could realistically push in week one, and reply rates are conservative against industry benchmarks for cold clinical outreach. Every assumption is annotated on the page itself.",
        sourceSurface: "/docs",
        tags: ["demo", "metrics", "projections"],
      },
      {
        id: "demo-ai-written",
        question: "Did you use AI to write this?",
        answer:
          "Strategy memo, landing-page cover letter, per-lead email logic, and every page of editorial copy were written by Khush. Claude was a pair programmer for boilerplate around shadcn primitives and the source-viewer token highlighter. The voice and the calls are his.",
        sourceSurface: "/docs",
        tags: ["demo", "ai", "writing"],
      },
      {
        id: "demo-run-locally",
        question: "Can I run this locally?",
        answer:
          "Yes, in three commands. Clone the repo, npm install, npm run dev. The OPENAI_API_KEY is optional; without it /api/draft returns a cached payload with the same shape as a live response so the demo never breaks for a reviewer.",
        sourceSurface: "/docs",
        tags: ["demo", "local", "setup"],
      },
      {
        id: "demo-source-code",
        question: "Where's the source code?",
        answer:
          "github.com/Khush279/vero-gtm-demo. tsconfig is strict, server components by default, types in lib/types.ts, scoring in lib/scoring.ts. Day-2 todos are in the README under The honest gaps.",
        sourceSurface: "/docs",
        tags: ["demo", "source", "github"],
      },
      {
        id: "demo-production-arch",
        question: "Is this the production architecture?",
        answer:
          "No. State is in-memory JSON because at 48 hours a database was debt not worth underwriting. Day-2 plan is Postgres for the lead corpus with a daily CPSO refresh cron, streamed OpenAI drafts, and Attio as the system of record with webhook-driven two-way sync.",
        sourceSurface: "/docs",
        tags: ["demo", "architecture", "production"],
      },
      {
        id: "demo-many-surfaces",
        question: "Why so many surfaces?",
        answer:
          "The JD lists ten things a Founding GTM Engineer is responsible for. For each one there is a surface a founder can click into and see how it would actually be built. A shorter demo would have proven the candidate can write a memo. This one proves the candidate can ship the engine the memo describes.",
        sourceSurface: "/docs",
        tags: ["demo", "scope", "surfaces"],
      },
    ],
  },
  {
    id: "vero-company",
    label: "Vero the company",
    description:
      "About the founders, customer count, where Vero is growing, and the wedge into Canadian family medicine.",
    entries: [
      {
        id: "company-founders",
        question: "Who are the founders?",
        answer:
          "Adeel (CEO) and Bill (CTO). Adeel runs commercial and the Canadian-clinician relationships; Bill runs product and engineering. Vero is hiring its founding GTM engineer to build the outbound and content engine alongside the existing inbound brand.",
        sourceSurface: "/interview-prep",
        tags: ["company", "founders", "team"],
      },
      {
        id: "company-customers",
        question: "How many clinicians are using Vero?",
        answer:
          "5,000+ paying providers as of early 2026. The constraint is no longer 'do clinicians want this' but 'how fast can the next 5,000 find out it exists.'",
        sourceSurface: "/interview-prep",
        tags: ["company", "customers", "growth"],
      },
      {
        id: "company-wedge",
        question: "Why family medicine and not specialty groups?",
        answer:
          "14,200 Ontario FPs is the largest single physician segment in the province, with the highest pain-per-visit on charting and the shortest procurement path. 6.5M Ontarians without a family doctor (OCFP 2026) is making this a top-3 political issue. Specialty groups are the expansion lane, not the wedge.",
        sourceSurface: "/strategy",
        tags: ["company", "wedge", "family-medicine", "ontario"],
      },
      {
        id: "company-where-growing",
        question: "Where is Vero growing fastest?",
        answer:
          "Ontario family practice is the primary wedge, with the strongest momentum in the GTA, Hamilton, Ottawa, and Mississauga. Page-1 rankings on 14 of 20 highest-intent Canadian queries, and a healthy referral motion inside OCFP-adjacent communities.",
        sourceSurface: "/strategy",
        tags: ["company", "growth", "ontario", "geography"],
      },
      {
        id: "company-canada-first",
        question: "Why Canada first instead of the US?",
        answer:
          "PIPEDA, PHIPA, and the Ontario Health VoR badge are a 6-to-9-month procurement bypass that no US scribe carries. Canadian community clinics cannot buy DAX or Suki without a US-data-residency exception. Vero owns the segment by being the only product positioned for it.",
        sourceSurface: "/strategy",
        tags: ["company", "canada", "strategy", "moat"],
      },
      {
        id: "company-roadmap",
        question: "What's the product roadmap?",
        answer:
          "Native iOS and Android apps, deeper Epic write-back, expanded specialty template library beyond 150, and an in-product clinic-admin assistant grounded on the strategy memo and the leads corpus. The native app is the most-asked roadmap item.",
        sourceSurface: "/vs-suki",
        tags: ["company", "roadmap", "product"],
      },
      {
        id: "company-where-tali-wins",
        question: "Where is Tali honestly better than Vero?",
        answer:
          "Native iOS and Android apps, phone support for clinic owners, and brand recognition inside the OMA newsletter circuit. Vero is closing each gap, but it does not pretend they are not real this quarter.",
        sourceSurface: "/vs-tali",
        tags: ["company", "tali", "honest", "competitor"],
      },
    ],
  },
];

/**
 * Helper: flat list of every entry, used by the search filter.
 */
export function getAllEntries(): (FaqEntry & { categoryId: string; categoryLabel: string })[] {
  return MASTER_FAQ.flatMap((category) =>
    category.entries.map((entry) => ({
      ...entry,
      categoryId: category.id,
      categoryLabel: category.label,
    }))
  );
}

/**
 * Helper: filter entries by a free-text query. Case-insensitive substring
 * match across question, answer, tags, and category label. Used by the
 * server-side search on /faq.
 */
export function filterEntries(
  query: string | undefined
): { category: FaqCategory; entries: FaqEntry[] }[] {
  const q = (query ?? "").trim().toLowerCase();
  if (!q) {
    return MASTER_FAQ.map((category) => ({ category, entries: category.entries }));
  }
  return MASTER_FAQ.map((category) => {
    const matched = category.entries.filter((entry) => {
      const haystack = [
        entry.question,
        entry.answer,
        category.label,
        ...entry.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    return { category, entries: matched };
  }).filter((bucket) => bucket.entries.length > 0);
}
