/**
 * Citations registry for the demo. Every number, claim, or competitive read
 * that appears on any surface should resolve back to an entry here. Keeps
 * the demo honest: synthetic data is labeled as such with a day-1 swap
 * plan, public claims point to the public source.
 *
 * Consumed by app/sources/page.tsx. Not imported by any other surface yet
 * (the surfaces themselves cite inline; this page is the consolidated
 * receipts ledger a founder can scan once instead of hunting through pages).
 */

export type SourceCategory =
  | "tam"
  | "competitive"
  | "compliance"
  | "product"
  | "playbook"
  | "synthetic-data";

export type Source = {
  id: string;
  category: SourceCategory;
  /** The exact claim or number being cited. */
  claim: string;
  /** Source name plus year. */
  citation: string;
  /** External URL if public. */
  url?: string;
  /** Demo surfaces using this claim. */
  surface: string[];
  /** Honest caveat (synthetic, illustrative, day-1 swap, etc). */
  caveat?: string;
};

export const CATEGORY_META: Record<
  SourceCategory,
  { label: string; blurb: string }
> = {
  tam: {
    label: "TAM and population",
    blurb: "How big the Ontario family-practice opportunity actually is.",
  },
  competitive: {
    label: "Competitive read",
    blurb: "Public pricing and positioning on the scribes Vero has to beat.",
  },
  compliance: {
    label: "Compliance and procurement",
    blurb: "Why Ontario Health VoR is a 6-to-9 month moat.",
  },
  product: {
    label: "Vero product facts",
    blurb: "Pricing, templates, and differentiators sourced from veroscribe.com.",
  },
  playbook: {
    label: "Playbook benchmarks",
    blurb: "Industry baselines the cadence and timeline assumptions lean on.",
  },
  "synthetic-data": {
    label: "Synthetic data, labeled",
    blurb:
      "What's mocked in this demo and what replaces it on day one at Vero.",
  },
};

export const CATEGORY_ORDER: SourceCategory[] = [
  "tam",
  "competitive",
  "compliance",
  "product",
  "playbook",
  "synthetic-data",
];

export const SOURCES: Source[] = [
  // ---------- TAM ----------
  {
    id: "tam-cihi-fp-ontario",
    category: "tam",
    claim: "14,200 family physicians in Ontario.",
    citation: "CIHI, Physicians in Canada 2024",
    url: "https://www.cihi.ca/en/physicians",
    surface: ["/strategy", "/pipeline", "/"],
  },
  {
    id: "tam-ocfp-without-fp",
    category: "tam",
    claim: "6.5M Ontarians without a family doctor.",
    citation: "OCFP Practice Profile Survey, 2026",
    url: "https://www.ontariofamilyphysicians.ca/",
    surface: ["/strategy", "/"],
  },
  {
    id: "tam-cpso-reachable",
    category: "tam",
    claim:
      "~10,500 Ontario FPs reachable via the CPSO public register (subset of CIHI's 14,200).",
    citation: "CPSO Public Register, 2026",
    url: "https://www.cpso.on.ca/Public-Register/Doctor-Search",
    surface: ["/strategy", "/pipeline", "/automations"],
  },

  // ---------- COMPETITIVE ----------
  {
    id: "comp-tali-pricing",
    category: "competitive",
    claim: "Tali AI public pricing is approximately $300/month.",
    citation: "tali.ai pricing page, 2026",
    url: "https://tali.ai/pricing",
    surface: ["/strategy", "/playbooks", "/analytics"],
  },
  {
    id: "comp-dax-pricing",
    category: "competitive",
    claim: "DAX Copilot list pricing $200 to $400 per clinician per month.",
    citation: "Microsoft Nuance public docs, 2025",
    url: "https://www.nuance.com/healthcare/dragon-ambient-experience.html",
    surface: ["/strategy", "/enterprise"],
  },

  // ---------- COMPLIANCE ----------
  {
    id: "comp-ohealth-vor",
    category: "compliance",
    claim:
      "Ontario Health Vendor of Record status grants 6 to 9 months of procurement bypass for FHTs, OHTs, and hospital-affiliated clinics.",
    citation: "Vero Scribe blog, Ontario Health VoR announcement",
    url: "https://veroscribe.com/blog",
    surface: ["/strategy", "/enterprise", "/playbooks"],
  },
  {
    id: "comp-oha-rfp",
    category: "compliance",
    claim:
      "Ontario Hospital Association RFP processes typically run 8 hour security questionnaires. The day-60 RFP-response generator targets cutting that to 45 minutes.",
    citation: "OHA procurement guidance, 2025",
    url: "https://www.oha.com/",
    surface: ["/enterprise", "/strategy"],
  },

  // ---------- PRODUCT ----------
  {
    id: "prod-pricing",
    category: "product",
    claim: "Vero pricing $59.99 to $89 per clinician per month.",
    citation: "veroscribe.com pricing page, 2026",
    url: "https://veroscribe.com/pricing",
    surface: ["/strategy", "/playbooks", "/", "/analytics"],
  },
  {
    id: "prod-templates",
    category: "product",
    claim: "Vero ships 150+ specialty note templates.",
    citation: "veroscribe.com product page, 2026",
    url: "https://veroscribe.com/",
    surface: ["/strategy", "/playbooks"],
  },
  {
    id: "prod-doc-upload",
    category: "product",
    claim:
      "Vero ingests referral letters and PDF documents into the note. Tali does not ship this; it is the hardest-to-copy product wedge.",
    citation: "veroscribe.com blog, comparison posts",
    url: "https://veroscribe.com/blog",
    surface: ["/strategy", "/playbooks", "/analytics"],
  },
  {
    id: "prod-paid-providers",
    category: "product",
    claim: "5,000+ paying providers across North America.",
    citation: "Vero internal, cited in JD and public pages",
    url: "https://veroscribe.com/",
    surface: ["/strategy", "/"],
    caveat: "Replace with live Stripe ARR pull on day 1.",
  },

  // ---------- PLAYBOOK ----------
  {
    id: "play-cadence",
    category: "playbook",
    claim:
      "Day 1, 4, 9, 16 four-touch cadence for FP cold outbound. Sits at the median of B2B SaaS outbound benchmarks.",
    citation: "Outreach.io and Apollo.io public outbound benchmarks, 2024 to 2025",
    url: "https://www.outreach.io/resources",
    surface: ["/playbooks", "/lead", "/strategy"],
  },
  {
    id: "play-rfp-sprint",
    category: "playbook",
    claim:
      "10-day RFP sprint timeline with day-by-day deliverables. Modeled on CMS and OHA enterprise procurement standards.",
    citation: "CMS contracting guidance and OHA procurement standards",
    url: "https://www.cms.gov/about-cms/contracting-with-cms",
    surface: ["/playbooks", "/enterprise"],
  },
  {
    id: "play-funnel-conversions",
    category: "playbook",
    claim:
      "25% reply-to-demo, 40% demo-to-trial, 50% trial-to-paid as conservative floor assumptions in the 90-day funnel.",
    citation: "B2B SaaS outbound benchmarks, OpenView 2024 SaaS Benchmarks",
    url: "https://openviewpartners.com/2024-saas-benchmarks-report/",
    surface: ["/strategy", "/pipeline", "/analytics"],
    caveat:
      "Floor assumptions. Re-baseline against Vero's own funnel after 200 sends in week 1.",
  },

  // ---------- SYNTHETIC DATA (clearly labeled) ----------
  {
    id: "synth-leads",
    category: "synthetic-data",
    claim:
      "500-lead seed in /pipeline and /lead. Generated by a deterministic Mulberry32 PRNG with a fixed seed; not a real CPSO scrape.",
    citation: "data/leads.json, this repo",
    surface: ["/pipeline", "/lead", "/automations"],
    caveat:
      "Day 1 swap: run scripts/scrape-cpso.ts at 1 req/sec to write a real 10,500-row register pull.",
  },
  {
    id: "synth-enterprise",
    category: "synthetic-data",
    claim:
      "10-account enterprise pipeline with mocked org names, champion contacts, and stage progression.",
    citation: "data/enterprise.json, this repo",
    surface: ["/enterprise"],
    caveat:
      "Day 1 swap: import the live Attio enterprise board, replace mocked champions with real CPSO+LinkedIn matches.",
  },
  {
    id: "synth-seo-traffic",
    category: "synthetic-data",
    claim:
      "Per-page organic clicks per month, average position, and CTR on /analytics.",
    citation: "Illustrative figures, not Search Console data",
    surface: ["/analytics"],
    caveat:
      "Day 1 swap: pull the last 90 days from Search Console for veroscribe.com.",
  },
  {
    id: "synth-funnel-attribution",
    category: "synthetic-data",
    claim:
      "First-touch source breakdown and per-step funnel conversion percentages on /analytics.",
    citation: "Illustrative figures, demo only",
    surface: ["/analytics"],
    caveat:
      "Day 1 swap: pull from the production GA4 + Stripe + Attio join once access is granted.",
  },
];
