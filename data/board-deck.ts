/**
 * Mocked first board update for Vero, presented at the end of Khush's first
 * 90 days as founding GTM engineer. The framing matters: a board audience
 * isn't the founder audience. Adeel and Bill already know the playbook; the
 * board needs the quarter compressed into ten slides, with a clear ask.
 *
 * Numbers ladder up from data/metrics-dashboard.ts (week-1 vs week-13 cohort)
 * and data/strategy.md (the 90-day plan that produced them). The named
 * customer story uses Maple, the closed-won account in data/enterprise.json
 * and the most fully-rendered reference in data/reference-customers.ts.
 */

export type SlideLayout = "title" | "split" | "metrics" | "narrative" | "ask";

export type Slide = {
  id: string;
  number: number;
  /** "TLDR" / "Wins" / "Pipeline" / etc. */
  kicker: string;
  title: string;
  /** Either a paragraph or "•"-prefixed bullets. */
  body: string;
  /** Speaker notes shown below in a muted block. */
  notes?: string;
  layout?: SlideLayout;
};

export type BoardDeck = {
  forMeeting: string;
  presenter: string;
  preamble: string;
  slides: Slide[];
};

export const DECK: BoardDeck = {
  forMeeting: "Q3 board update · 2026-08-30",
  presenter: "Khush Agarwala · Founding GTM Engineer",
  preamble:
    "Ninety days in. The job was to convert Vero's Ontario VoR moat and content lead into a measurable outbound engine without breaking unit economics. This deck is the receipt for that quarter and the case for what gets funded next.",
  slides: [
    {
      id: "slide_title",
      number: 1,
      kicker: "Q3 board update",
      title: "GTM, ninety days in.",
      body: "Vero · Q3 2026 board meeting · August 30, 2026.\nPresenter: Khush Agarwala, Founding GTM Engineer.\nDeck length: 10 slides, 12 minutes, 8 minutes for questions.",
      notes:
        "Open by saying I'll keep the deck to twelve minutes so we have time for the ask on slide nine. Read the room before diving into TLDR.",
      layout: "title",
    },
    {
      id: "slide_tldr",
      number: 2,
      kicker: "TLDR",
      title: "The quarter in three lines.",
      body:
        "• Outbound went from a standing start to 1,040 sequenced FPs/week, replies 5.9%, ARR added $11.5k/week by week 13. Floor of the strategy memo math, hit early.\n• Closed Maple as the first named virtual-care logo at $720k ARR. Reference customer for Felix and KixCare conversations now in flight.\n• Two channels killed in-quarter (LinkedIn DMs, paid search test). Capital reallocated to the partner motion with OntarioMD before it became a sunk cost.",
      notes:
        "If a board member only reads one slide it should be this one. Numbers tie to the dashboard pack in the appendix.",
      layout: "narrative",
    },
    {
      id: "slide_numbers",
      number: 3,
      kicker: "The numbers",
      title: "Week 1 versus week 13.",
      body:
        "• Weekly send volume: 212 to 1,040 (+391%). Source: Attio Mondays-only snapshot.\n• Reply rate: 4.7% to 5.9% (+1.2pt). Source: Postmark inbound parser.\n• Demo book rate: 26% to 29% (+3pt). Source: HubSpot meetings.\n• Trial start rate: 38% to 42% (+4pt). Source: HubSpot post-demo.\n• ARR added per week: $2,160 to $11,520 (+433%). Source: Stripe new paid.\n• Time-to-first-touch median: 8m to 6m. Source: Vercel cron on /lead/[id].",
      notes:
        "Every metric on this slide has a source. If a board member challenges any of them, point at the dashboard tab in the data room rather than defending verbally.",
      layout: "metrics",
    },
    {
      id: "slide_wins",
      number: 4,
      kicker: "Wins",
      title: "Three things that went right.",
      body:
        "• Maple closed Q1 carry-over. 1,800-provider virtual-care network on a 12-month contract, $720k ARR, doc-upload feature was the deciding factor over Tali. Reference customer activated.\n• 'Vero vs Tali' comparison page hit page-1 of Google for the comparison query in 41 days. Drives 18% of demo bookings now, zero paid spend.\n• Hire #2 onboarded on Day 78. BDR-equivalent is sequencing 600 FPs/week solo by Day 90, freeing me to ship the reply-classifier and the Telus PSS template variants.",
      notes:
        "Wins slide is where I name names. Every win has a person attached. Adeel will appreciate that I'm not hoarding credit on the Maple close.",
      layout: "split",
    },
    {
      id: "slide_misses",
      number: 5,
      kicker: "Misses",
      title: "Two bets that didn't earn the next dollar.",
      body:
        "• LinkedIn DM channel killed Day 52. 2x reply rate held, but demo-book rate was 0.5x of email and Sales Navigator seat cost did not pencil at our send volume. Reallocated to a partner motion with OntarioMD that is already producing warmer leads at lower CAC.\n• Paid Google search experiment killed Day 67. $4,200 burn, 11 trials, 3 paid, blended CAC of $1,400 against an ACV of $720. Content covers the same intent at one fifth the cost. Memo says revisit Day 120 if ARR needs lift.",
      notes:
        "Lead with the misses on purpose. Boards trust founders who kill their own experiments. Both kills happened before the loss compounded, which is the actual point.",
      layout: "split",
    },
    {
      id: "slide_pipeline",
      number: 6,
      kicker: "Pipeline",
      title: "Enterprise pipeline by stage.",
      body:
        "• Discovery: 2 accounts, $4.0M unweighted, $200k weighted at 5%.\n• Qualified: 1 account (Osler), $620k unweighted, $93k weighted at 15%.\n• RFP issued: 1 account (Hamilton), $980k unweighted, $294k weighted at 30%.\n• RFP response: 1 account (Trillium), $1.45M unweighted, $653k weighted at 45%.\n• Shortlisted: 1 account (Niagara), $380k unweighted, $228k weighted at 60%.\n• Negotiation: 1 account (Centric), $230k unweighted, $173k weighted at 75%.\n• Closed-won this quarter: Maple, $720k ARR landed.\nWeighted enterprise pipeline: $1.64M. FP outbound run-rate: $54k MRR ($648k ARR).",
      notes:
        "Stage weights match the public enterprise SaaS standard. Nothing inflated. If asked, walk through the Niagara French-language tie-breaker as the live example.",
      layout: "metrics",
    },
    {
      id: "slide_customer",
      number: 7,
      kicker: "The customer",
      title: "How Maple chose Vero.",
      body:
        "Maple is a 1,800-provider Canadian virtual-care network. They evaluated three scribes through Q4 2025. Tali led on brand. Vero won on one feature: doc-upload. Async-care drowns in PDFs (GLP-1 prior auths, legacy InputHealth notes), and Vero is the only scribe that lets a clinician dictate against an uploaded chart instead of starting blank. Pilot ran 40 clinicians, 21 days, opt-in, kill-switch criteria written before launch. Outcome: 6.4 minutes saved per encounter, 1,412 of 1,800 weekly active by Day 90, 94% retention. Phase 2 rolling out to async-messaging providers in Q4. Dr. Hassan Siddiqui is now a reference for Felix and KixCare conversations.",
      notes:
        "If a board member asks one customer question, this is the answer. Hassan agreed to take one reference call per month. Don't burn that on a tire-kicker.",
      layout: "narrative",
    },
    {
      id: "slide_q4",
      number: 8,
      kicker: "Q4 plan",
      title: "Four bets for the next ninety days.",
      body:
        "• Trillium close. RFP response submitted, security questionnaire returned in 9 days. Target close: Day 60 of Q4 at $1.45M ARR.\n• Reply-classifier model in production. Replaces the regex stub, routes positive replies to a human within 4 minutes business-hours. Pays for itself in a week at current reply volume.\n• Partner motion with OntarioMD and OCFP scaled. One co-branded webinar shipped, target: 1 paid pilot through the partner channel by Day 90.\n• Hire #3 scoped: content lead. BDR motion is sustainable now, content velocity is the new constraint. Target start: Day 75 of Q4.",
      notes:
        "Four bets is the limit. If one board member tries to add a fifth, push back: the team is six people, not sixty. The hire scoping conversation is the real meat here.",
      layout: "split",
    },
    {
      id: "slide_ask",
      number: 9,
      kicker: "The ask",
      title: "Two specific things from the board.",
      body:
        "1. Warm intro to Dr. Sacha Bhatia at Women's College Hospital. WCH runs the Institute for Health System Solutions and Virtual Care, sits on the Ontario Health Digital Excellence advisory, and is the highest-leverage second VoR-tier reference we don't have. One board member has worked with him directly.\n2. Approval for $180k incremental Q4 GTM budget, ringfenced. $120k for content lead salary plus tooling, $60k for one paid OntarioMD partnership pilot. Payback modeled at 11 months on the FP outbound funnel, 6 months if the partnership pilot lands one FHT cluster.",
      notes:
        "These are the only two asks. If the meeting runs long, drop everything else before you drop these. Sacha is the unlock, the budget is the throughput.",
      layout: "ask",
    },
    {
      id: "slide_risks",
      number: 10,
      kicker: "Risks",
      title: "Three risks, ranked by severity.",
      body:
        "• Severe: Tali raises a Series A and triples outbound spend in Ontario. Mitigation: lock comparison-page rankings, ship two more EMR-aware variants (OSCAR, Accuro), book the OCFP webinar before they do. Defense costs $25k, attack costs Tali $2M+.\n• Moderate: Ontario Health VoR program is restructured under the next provincial budget, March 2027. Mitigation: convert one VoR-eligible system (Trillium or Hamilton) to closed-won before the structure changes. Today's Trillium close is the insurance policy.\n• Watch: founder bandwidth on enterprise deals. Adeel is the technical close on every >$500k deal. Mitigation: shadow him on the next two, take Niagara solo, document the playbook by Day 60.",
      notes:
        "Risks slide is the trust-building slide. If I sound confident about the ranking, the board will trust the rest of the plan. The Adeel-bandwidth one is the diplomatic phrasing of a real bottleneck.",
      layout: "narrative",
    },
    {
      id: "slide_close",
      number: 11,
      kicker: "Closing",
      title: "One sentence.",
      body:
        "Quarter one was about proving the engine runs; quarter two is about proving it scales without me holding the wheel.",
      notes:
        "End on this. Don't add a thank-you slide. The line is the thank-you.",
      layout: "title",
    },
  ],
};
