/**
 * The five week-1 GTM experiments. Each one is small enough to ship in a
 * day, instrumented enough to call in 10 days. The cross-references in
 * /strategy.md ("first A/B on subject lines", "EMR-aware template variants",
 * "$59.99/mo vs $720/yr framing") expand into the structured rows below.
 *
 * Recommended run order: 1, 2, 4, 3, 5 — cheapest and highest-confidence
 * tests first so the early reads de-risk the more expensive ones.
 */

export type Experiment = {
  id: string;
  title: string;
  hypothesis: string;
  rationale: string;
  setup: { variantA: string; variantB: string };
  primaryMetric: string;
  guardrailMetrics: string[];
  mde: string;
  sampleSize: string;
  decisionRule: string;
  cost: string;
  duration: string;
  category:
    | "subject-line"
    | "pricing-anchor"
    | "channel-mix"
    | "personalization"
    | "timing";
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp_subject_anchor",
    title: "Pricing anchor in subject line",
    hypothesis:
      "If we anchor on $720/yr instead of $59.99/mo in the subject line, trial-start rate among solo Ontario family physicians lifts by ≥ 15% because annual framing reads as a serious tool decision rather than another monthly subscription.",
    rationale:
      "Clinicians benchmark new tools against CME and licensing fees, both of which are quoted annually. The $720 figure also lands inside the OMA's per-physician CFI line item, which makes the spend feel pre-approved instead of net-new. Cheap to run, no creative cost, and the prior from /pricing analytics is already strong.",
    setup: {
      variantA: "Subject: Vero AI scribe, $59.99/mo for Ontario FPs",
      variantB: "Subject: Vero AI scribe, $720/yr for Ontario FPs",
    },
    primaryMetric: "trial-start rate per send",
    guardrailMetrics: [
      "unsubscribe rate < 0.5%",
      "spam-complaint rate < 0.05%",
      "reply-sentiment net-positive",
    ],
    mde: "≥ 15% relative lift on trial-start",
    sampleSize: "4,200 cohort members per arm (~10 days at current send volume)",
    decisionRule:
      "Ship variant B if it reaches 95% confidence and ≥ 15% relative lift on trial-start. If significant but lift falls below MDE, hold and pair with a body-copy follow-up.",
    cost: "$0 incremental, uses existing send budget",
    duration: "10 days",
    category: "subject-line",
  },
  {
    id: "exp_emr_personalization",
    title: "EMR-named first line",
    hypothesis:
      "If the opening line names the inferred EMR by brand, reply rate in T1 cities (Toronto, Mississauga, Brampton, Hamilton, Ottawa) lifts by ≥ 30% because workflow-specific language signals the sender understands the recipient's day.",
    rationale:
      "The CPSO scrape and clinic enrichment job already infer EMR for roughly 70% of the list. The marginal cost of the variant is one prompt-template branch. If it works, it unlocks the same pattern across every other touch in the cadence and feeds the EMR-aware template work in the day-30 plan.",
    setup: {
      variantA:
        "Hi Dr. Khan, wanted to reach out about Vero, the Canadian-built AI scribe used by 3,000+ clinicians.",
      variantB:
        "Hi Dr. Khan, if you're on Telus PSS, this'll feel familiar. Vero drops a SOAP note straight into your encounter note without the copy-paste step.",
    },
    primaryMetric: "reply rate per send",
    guardrailMetrics: [
      "negative-reply share < 8%",
      "EMR mis-attribution rate < 3% (manual audit on 50 sampled sends)",
      "unsubscribe rate < 0.5%",
    ],
    mde: "≥ 30% relative lift on reply rate",
    sampleSize: "1,500 leads per arm, T1 cities only, EMR confidence ≥ 0.7",
    decisionRule:
      "Ship variant B if it reaches 95% confidence and ≥ 30% relative lift, with mis-attribution audit clean. If mis-attribution > 3%, hold and tighten the EMR inference job before re-running.",
    cost: "$0 incremental send cost, ~2 hrs of prompt-template work",
    duration: "10 days",
    category: "personalization",
  },
  {
    id: "exp_loom_touch_one",
    title: "Loom-personalized touch 1",
    hypothesis:
      "If Day-1 emails to ICP-score ≥ 80 leads embed a 30-second personalized Loom, demo-book rate is 3x the text-only baseline because video raises perceived effort and gets past the form-letter heuristic.",
    rationale:
      "The top-100 leads each represent something like $900 of expected ARR, so a six-hour weekly recording budget is rounding error if the lift holds. This is the only experiment in the set with a real time cost, which is why it runs after the cheaper structural tests have de-risked the cohort definition.",
    setup: {
      variantA:
        "Day-1 text-only email, standard cadence, 110-word body keyed off the EMR and city.",
      variantB:
        "Same body, with a 30-second Loom thumbnail above the signature. Loom names the clinic and the recipient by first name.",
    },
    primaryMetric: "demo-book rate per send",
    guardrailMetrics: [
      "reply rate stays within ±10% of variant A (so we know lift is from booking, not just engagement)",
      "video-open rate > 25% (sanity check on thumbnail rendering)",
      "unsubscribe rate < 0.5%",
    ],
    mde: "≥ 3x relative lift on demo-book rate (200% relative)",
    sampleSize: "100 leads per arm, ICP score ≥ 80, T1 cities",
    decisionRule:
      "Ship variant B for the top-100 cohort if demo-book lift is ≥ 2x with one-tailed 90% confidence. Lower bar than usual because the cost is bounded and the downside is six hours of recording time.",
    cost: "~6 hrs/week of recording time (~$300 in BDR-equivalent labor)",
    duration: "10 days",
    category: "channel-mix",
  },
  {
    id: "exp_send_time",
    title: "Tuesday 7am vs Thursday 11am send time",
    hypothesis:
      "If we send to Family Medicine inboxes at Tue 7am ET instead of Thu 11am ET, open rate lifts by ≥ 20% because FPs triage email before clinic starts rather than mid-clinic when the inbox is already buried.",
    rationale:
      "Send-time is the cheapest variable in the system to test and the answer compounds across every future cadence. The Tuesday-morning prior comes from the OMA's own member-newsletter open data, but Vero's audience skews more solo and rural so it's worth confirming on our own list before locking the cadence.",
    setup: {
      variantA: "Send window: Tuesday 07:00 ET ± 15 minutes",
      variantB: "Send window: Thursday 11:00 ET ± 15 minutes",
    },
    primaryMetric: "open rate per send",
    guardrailMetrics: [
      "reply rate (secondary, must not regress > 10%)",
      "spam-complaint rate < 0.05%",
      "unsubscribe rate < 0.5%",
    ],
    mde: "≥ 20% relative lift on open rate",
    sampleSize: "2,000 leads per arm, Family Medicine specialty, randomized within each city cohort",
    decisionRule:
      "Adopt the winning send window if it reaches 95% confidence and ≥ 20% relative lift on opens, with reply rate within guardrail. If neither arm clears MDE, hold the current Tuesday default.",
    cost: "$0 incremental",
    duration: "10 days (covers two send cycles per arm)",
    category: "timing",
  },
  {
    id: "exp_pipeda_vs_price",
    title: "PIPEDA-leading vs price-leading body",
    hypothesis:
      "If the body lead-in is PIPEDA + Ontario VoR compliance posture instead of the $60/mo price anchor, reply rate among enterprise-curious solo FPs (clinic size ≥ 4 or hospital affiliation) lifts by ≥ 25%, while price-led wins for budget-conscious SMB (solo, no affiliation).",
    rationale:
      "This is a segmentation experiment, not just a copy test. Compliance signal is the only message a hospital-affiliated FP can forward to their privacy officer without rewriting it. The same line drags on a solo FP who just wants to know what it costs. Reading both segments on the same week tells us how to route the cadence by clinic shape.",
    setup: {
      variantA:
        "Lead with: 'Vero is $60/mo for the full product, no per-encounter fees, no annual lock-in.'",
      variantB:
        "Lead with: 'Vero is on the Ontario Health VoR list, fully PIPEDA-compliant, with Canadian data residency. Procurement-ready out of the box.'",
    },
    primaryMetric: "reply rate per send, segmented by clinic shape",
    guardrailMetrics: [
      "unsubscribe rate < 0.5% in both segments",
      "negative-reply share < 8% in both segments",
      "demo-book rate stays directionally aligned with reply rate",
    ],
    mde: "≥ 25% relative lift on reply rate within the winning segment",
    sampleSize: "1,200 leads per arm per segment (4,800 total)",
    decisionRule:
      "Route by segment: ship variant B for clinic size ≥ 4 or hospital-affiliated leads if it clears MDE in that segment, ship variant A for solo unaffiliated leads if it clears MDE there. If neither segment is decisive, hold and re-run with a tighter segmentation rubric.",
    cost: "$0 incremental",
    duration: "12 days (extra runway for the segment split)",
    category: "personalization",
  },
];
