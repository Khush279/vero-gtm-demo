/**
 * Q4 2026 GTM budget proposal. The /budget page renders this verbatim. Each
 * line item carries its own rationale, expected return, and owner so the
 * proposal can be defended top-to-bottom in a single founder meeting without
 * needing a parallel doc.
 *
 * The board ask on slide 9 of data/board-deck.ts is $180k incremental Q4 GTM.
 * Lines here sum to that number. Channel priorities follow the strategy memo
 * (data/strategy.md): outbound + content + partner motion, no paid search,
 * no booths, no US ad spend. The Maple win in data/board-deck.ts is the
 * reason the partner motion gets a real line.
 *
 * Numbers are illustrative but consistent: monthlyAmount × 3 = quarterlyAmount
 * for recurring lines, one-time costs go straight into quarterlyAmount with
 * monthlyAmount set to 0.
 */

export type LineItem = {
  id: string;
  category:
    | "people"
    | "tools"
    | "content"
    | "partnerships"
    | "experiments"
    | "events";
  label: string;
  /** Monthly run-rate. 0 for one-time spend or zero-funded lines. */
  monthlyAmount: number;
  /** Total Q4 spend (3 months). For one-time items, the lump sum. */
  quarterlyAmount: number;
  /** Two sentences. Why the spend, and the alternative considered. */
  rationale: string;
  /** One sentence. Pipeline, ARR, or time-saved expected back. */
  expectedReturn: string;
  owner: string;
  status: "proposed" | "approved" | "stretch";
};

export type Budget = {
  quarter: string;
  totalProposed: number;
  totalApprovedPrior: number;
  intro: string;
  lines: LineItem[];
  guardrails: string[];
};

const LINES: LineItem[] = [
  {
    id: "people-content-lead",
    category: "people",
    label: "Content lead salary + benefits (Q4 fully loaded)",
    monthlyAmount: 30000,
    quarterlyAmount: 90000,
    rationale:
      "Hire #3 in the 90-day plan, $120k base plus statutory and benefits loaded across Q4. BDR motion is sustainable at 1,040 sequenced FPs/week and content velocity is now the binding constraint.",
    expectedReturn:
      "Two comparison pages and one EMR-aware long-form per month, modeled to add $18k MRR by end of Q1 2027 at current SEO conversion rates.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "people-fractional-designer",
    category: "people",
    label: "Fractional designer (8 hrs/week)",
    monthlyAmount: 4000,
    quarterlyAmount: 12000,
    rationale:
      "Comparison pages and the OntarioMD webinar both need design polish that the eng team should not be carrying. Fractional beats full-time at our volume and gives us a known cost ceiling.",
    expectedReturn:
      "Comparison-page conversion rate lifts from 4.1% to a target 5.5% based on the v1 to v2 redesign of the Tali page in August.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "tools-attio",
    category: "tools",
    label: "Attio team plan (CRM + sequencer)",
    monthlyAmount: 1000,
    quarterlyAmount: 3000,
    rationale:
      "The outbound engine runs on Attio: lead scoring, sequencer, reply-classifier hand-off. Team plan unlocks the API rate limit needed for the EMR-aware template variants and the Slack #gtm webhook.",
    expectedReturn:
      "Keeps the 1,040 sends/week motion alive without manual export workarounds, saving roughly 6 BDR-equivalent hours per week.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "tools-postmark",
    category: "tools",
    label: "Postmark (outbound + inbound parser)",
    monthlyAmount: 667,
    quarterlyAmount: 2000,
    rationale:
      "Carries the cold-send volume and the inbound reply webhook that auto-advances leads to demo_booked. Cheaper per-send than SendGrid at our reputation tier and the inbound parser is the only one I trust at sub-minute latency.",
    expectedReturn:
      "Reply-to-classifier latency stays under 4 minutes business-hours, the threshold above which positive replies cool off.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "tools-soc2",
    category: "tools",
    label: "SOC 2 toolkit (Vanta-class, one-time setup)",
    monthlyAmount: 0,
    quarterlyAmount: 5000,
    rationale:
      "Trillium and Hamilton both flagged SOC 2 in their RFP discovery. We have the controls; we do not have the audit trail packaged the way a hospital procurement office wants to see it. One-time setup, recurring fee picks up in Q1.",
    expectedReturn:
      "Cuts the standard Ontario Health questionnaire response time from 8 hours to 45 minutes and removes one common shortlist blocker.",
    owner: "Adeel",
    status: "proposed",
  },
  {
    id: "tools-meeting-automation",
    category: "tools",
    label: "Meeting-link automation (Cal.com pro)",
    monthlyAmount: 334,
    quarterlyAmount: 1000,
    rationale:
      "Replies that go cold between Friday evening and Monday morning are the single biggest leak in the demo-book funnel. A scheduling tool with smart routing closes that window without adding a human.",
    expectedReturn:
      "Demo-book rate from positive replies lifts from 29% to a target 33% by removing the 2-day scheduling lag.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "content-guest-writers",
    category: "content",
    label: "Guest writers (2 deep comparison pages)",
    monthlyAmount: 2000,
    quarterlyAmount: 6000,
    rationale:
      "Two comparison pages we cannot ship in-house at the depth they need: 'Vero vs Tali for Quebec FPs' (French, with a clinician interview) and 'AI scribe for OSCAR users' (technical, with a workflow walkthrough). Guest bylines also borrow trust.",
    expectedReturn:
      "Each page modeled at 8% of inbound demos by 90 days post-publish, matching the v1 trajectory of the Tali page.",
    owner: "Content lead",
    status: "proposed",
  },
  {
    id: "content-newsletter-swap",
    category: "content",
    label: "Canadian healthtech newsletter sponsorship",
    monthlyAmount: 1000,
    quarterlyAmount: 3000,
    rationale:
      "One paid placement in a 14k-subscriber Canadian healthtech newsletter whose audience overlaps our ICP at roughly 22%. Treat as a swap if they want a guest post in return; cash if not.",
    expectedReturn:
      "Modeled at 40 to 80 net-new demo bookings over Q4 at a blended CAC well under our $720 ACV.",
    owner: "Content lead",
    status: "stretch",
  },
  {
    id: "partnerships-ontariomd-webinar",
    category: "partnerships",
    label: "OntarioMD co-branded webinar (production + promo)",
    monthlyAmount: 2667,
    quarterlyAmount: 8000,
    rationale:
      "Day-90 partner-motion goal from the strategy memo. OntarioMD has the email list for the long-tail solo FPs who never search 'ai medical scribe' and a co-branded webinar borrows their procurement credibility for free.",
    expectedReturn:
      "Target one paid pilot through the partner channel by Day 90 of Q4, modeled at $40k to $80k ARR depending on FHT cluster size.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "partnerships-cfpc-scholarship",
    category: "partnerships",
    label: "CFPC family medicine scholarship sponsorship",
    monthlyAmount: 1667,
    quarterlyAmount: 5000,
    rationale:
      "$5k buys a named scholarship at the College of Family Physicians of Canada. Not a lead-gen channel, a legitimacy channel: every CFPC mention puts Vero in the same sentence as the body that certifies our ICP.",
    expectedReturn:
      "Soft signal, hard outcome: shortens the trust-building stage on enterprise FHT calls where Vero gets compared to the US incumbents.",
    owner: "Adeel",
    status: "proposed",
  },
  {
    id: "experiments-linkedin-paid",
    category: "experiments",
    label: "Paid LinkedIn test (4 weeks, kill criteria pre-written)",
    monthlyAmount: 1334,
    quarterlyAmount: 4000,
    rationale:
      "Organic LinkedIn assists deals more than it originates them. A 4-week paid test isolates whether targeted in-feed ads to FP director titles can move the assist into origination. Kill at end of week 4 if blended CAC exceeds $1,200.",
    expectedReturn:
      "Either a new working channel at sub-$1,200 CAC, or a clean kill that closes the 'should we be on LinkedIn' question for two quarters.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "experiments-loom-pro",
    category: "experiments",
    label: "Loom pro for personalized first touches",
    monthlyAmount: 100,
    quarterlyAmount: 300,
    rationale:
      "The 5-clinic-and-up segment replies to a 30-second personalized Loom at roughly 2.4x the rate they reply to plain text. The cost is a rounding error; the reason it is here is so the line item exists when results are reviewed.",
    expectedReturn:
      "Reply rate for the 5-plus segment lifts from 5.9% to a target 9% on first touch, on roughly 80 sends per week.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "events-zero",
    category: "events",
    label: "Conference booths and event sponsorships",
    monthlyAmount: 0,
    quarterlyAmount: 0,
    rationale:
      "Deliberately zero. OFPC and OMA AGM produce sub-3% lead conversion at $15k per booth; the OntarioMD co-branded webinar reaches a larger and more procurement-relevant audience for half the cost.",
    expectedReturn:
      "Capital reallocated to the partnerships and content lines that already outperform booth ROI by an order of magnitude.",
    owner: "Khush",
    status: "proposed",
  },
  {
    id: "people-recruiter",
    category: "people",
    label: "Recruiter retainer + paid take-homes (content lead search)",
    monthlyAmount: 13567,
    quarterlyAmount: 40700,
    rationale:
      "Specialist healthtech-content recruiter retainer plus paid take-home compensation for the final three candidates. The content lead role has a tight start-date window and we cannot afford to negotiate from a position of cash scarcity.",
    expectedReturn:
      "Reduces time-to-hire from a 9-week median to a target 5 weeks; every week saved is roughly $4.5k in foregone content output.",
    owner: "Khush",
    status: "proposed",
  },
];

const TOTAL = LINES.reduce((sum, l) => sum + l.quarterlyAmount, 0);

export const BUDGET: Budget = {
  quarter: "Q4 2026",
  totalProposed: TOTAL,
  totalApprovedPrior: 92000,
  intro:
    "Incremental Q4 GTM ask. Every line has rationale, expected return, and an owner. The events line is in the table at $0 on purpose; the guardrails below are not. Read both before you sign.",
  lines: LINES,
  guardrails: [
    "No paid Google search. Content already wins the comparison queries at one fifth the CAC. Revisit only if SEO ranks slip below page 1 for the Tali query.",
    "No conference booths. OFPC and OMA AGM produce sub-3% lead conversion at $15k each; the OntarioMD webinar wins on cost and on volume.",
    "No US expansion ad spend. The Ontario VoR moat does not travel and 32 paying Ontario FPs beat 100 cold Texas demos. US conversation reopens after Trillium closes.",
    "No custom dev for one-off integrations. If a prospect wants a bespoke EMR connector outside our top six, the answer is a Q1 roadmap conversation, not a Q4 line item.",
    "No second-product exploration funded out of GTM. Doc-upload v2 and template-marketplace are product calls and live on Adeel's budget if they ship at all this quarter.",
  ],
};

/**
 * Tiny formatter the page imports so it does not have to rebuild the same
 * Intl object on every render.
 */
export const BUDGET_CURRENCY_FMT = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export const CATEGORY_LABEL: Record<LineItem["category"], string> = {
  people: "People",
  tools: "Tools",
  content: "Content",
  partnerships: "Partnerships",
  experiments: "Experiments",
  events: "Events",
};

/**
 * Forest for productive, ochre for "watch", muted for events (zero-funded).
 * Mirrors the chip palette in /channel-mix so the demo reads as one product.
 */
export const CATEGORY_TONE: Record<LineItem["category"], string> = {
  people: "border-forest-200 bg-forest-50 text-forest-700",
  tools: "border-forest-200 bg-forest-50 text-forest-700",
  content: "border-forest-200 bg-forest-50 text-forest-700",
  partnerships: "border-forest-200 bg-forest-50 text-forest-700",
  experiments: "border-ochre-200 bg-ochre-50 text-ochre-700",
  events: "border-border/70 bg-muted/40 text-muted-foreground",
};

export const STATUS_TONE: Record<LineItem["status"], string> = {
  proposed: "border-forest-200 bg-forest-50 text-forest-700",
  approved: "border-forest-200 bg-forest-50 text-forest-700",
  stretch: "border-ochre-200 bg-ochre-50 text-ochre-700",
};
