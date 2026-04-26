/**
 * Quarterly OKR/KR rollup for Q4 2026 GTM. Lifted from the board-deck Q4 plan
 * (slide 8) and grounded in the metrics-dashboard week-13 baseline. Mid-quarter
 * snapshot, week 2 of 13, so confidence ratings are honest about which leading
 * indicators are pointing where.
 *
 * Confidence rubric:
 *   high:   leading indicator is at or above the trajectory needed to land
 *           the KR by quarter close; no blockers logged.
 *   medium: leading indicator is within striking distance but a known blocker
 *           (hire ramp, partner timeline, model quality) still has to clear.
 *   low:    leading indicator is below trajectory or the blocker is the
 *           kind of thing that doesn't move on quarter timelines (a single
 *           named champion, a procurement cycle, a hire that hasn't closed).
 *
 * Rollup confidence is the worst of the four objective-level confidences,
 * because a quarter is only as honest as the bet you're least sure about.
 */

export type ConfidenceLevel = "low" | "medium" | "high";
export type IndicatorType = "leading" | "lagging";

export type KeyResult = {
  id: string;
  title: string;
  type: IndicatorType;
  /** Plain-text target, mono-rendered. e.g. "Sequenced FPs/wk >= 1,200". */
  target: string;
  /** Plain-text current value, mono-rendered. e.g. "Sequenced FPs/wk = 1,040". */
  current: string;
  /** 30-day series for the inline sparkline. Most-recent value last. */
  trend30d: number[];
  confidence: ConfidenceLevel;
  /** "Khush" / "Khush + Adeel" / "Hire #2 (BDR)". Who owns the KR. */
  owner: string;
  /** 1 to 2 sentences of color: WHY confidence is what it is. */
  notes: string;
};

export type ObjectiveCategory =
  | "growth"
  | "enterprise"
  | "team"
  | "product-feedback";

export type Objective = {
  id: string;
  category: ObjectiveCategory;
  title: string;
  /** Single sentence: why this objective matters this quarter. */
  why: string;
  /** 2 to 4 KRs per objective. */
  keyResults: KeyResult[];
};

export type Scorecard = {
  /** "Q4 2026". */
  quarter: string;
  /** "2026-10-13 . week 2 of quarter". Use a separator that isn't an em dash. */
  asOf: string;
  /** Two-sentence intro shown above the objective stack. */
  intro: string;
  objectives: Objective[];
  /** Rollup is the worst of the four objective-level reads. */
  rollupConfidence: ConfidenceLevel;
};

export const SCORECARD: Scorecard = {
  quarter: "Q4 2026",
  asOf: "2026-10-13 · week 2 of quarter",
  intro:
    "Four objectives, twelve key results, calibrated against where the leading indicators actually point. The rollup is medium because the team objective is medium: hire #2 hasn't closed yet, and pipeline + partner motion can't replace one full-time BDR if that slot stays open past week 6.",
  rollupConfidence: "medium",
  objectives: [
    {
      id: "obj_growth",
      category: "growth",
      title: "$200k new MRR through outbound + content",
      why: "Outbound is the only channel where we set the volume dial. Hitting the $200k number is what funds the content lead hire and the second BDR slot.",
      keyResults: [
        {
          id: "kr_growth_send_volume",
          title: "Weekly send volume to FP cohort",
          type: "leading",
          target: "Sequenced FPs/wk >= 1,200",
          current: "Sequenced FPs/wk = 1,040",
          trend30d: [
            860, 870, 880, 905, 920, 935, 950, 945, 960, 980, 985, 1000, 1010,
            1020, 1030, 1025, 1035, 1040, 1040, 1045, 1040, 1042, 1040, 1038,
            1040, 1040, 1041, 1040, 1040, 1040,
          ],
          confidence: "high",
          owner: "Khush",
          notes:
            "1,040/wk is steady from week 13 of Q3. The path to 1,200 is hire #2 onboarding plus a tighter Attio-to-Postmark queue we already have on the board for week 4.",
        },
        {
          id: "kr_growth_reply_rate",
          title: "Reply rate baseline (rolling 4-wk)",
          type: "leading",
          target: "Reply rate >= 6.0% blended",
          current: "Reply rate = 5.9% blended",
          trend30d: [
            4.8, 4.9, 5.0, 5.1, 5.2, 5.3, 5.4, 5.4, 5.5, 5.6, 5.6, 5.7, 5.7,
            5.8, 5.8, 5.9, 5.9, 5.9, 5.8, 5.9, 5.9, 5.9, 5.9, 5.9, 5.9, 5.9,
            5.9, 5.9, 5.9, 5.9,
          ],
          confidence: "high",
          owner: "Khush",
          notes:
            "EMR-aware first-line variant carried us from 4.7% to 5.9% over Q3. The OSCAR variant shipping in week 5 is the obvious next 0.3pt. Beating Tali's 2.1% public benchmark by 3x is the line we don't drop below.",
        },
        {
          id: "kr_growth_demo_book",
          title: "Demo-book conversion off replies",
          type: "leading",
          target: "Demo-book rate >= 30%",
          current: "Demo-book rate = 29%",
          trend30d: [
            26, 26, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 28, 29,
            29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
          ],
          confidence: "medium",
          owner: "Khush + Adeel",
          notes:
            "29% is good. The 30% line needs the reply-classifier in production so positive replies route to a human in 4 minutes instead of 40. Model is in eval, not prod, which is the only reason this isn't high.",
        },
        {
          id: "kr_growth_paid_conversion",
          title: "New MRR closed-won",
          type: "lagging",
          target: "$200k new MRR by Dec 31",
          current: "$23k new MRR week 2",
          trend30d: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 20, 21, 21, 22, 22, 22, 23, 23, 23,
          ],
          confidence: "medium",
          owner: "Khush + Adeel",
          notes:
            "On-pace for $138k linear, which clears the $130k FP-outbound floor but needs the Trillium close (lagging KR under enterprise) to hit $200k. Two bets, one number.",
        },
      ],
    },
    {
      id: "obj_enterprise",
      category: "enterprise",
      title: "1 closed enterprise contract + 2 systems in late-stage negotiation",
      why: "The Ontario VoR moat compounds the more we use it. Locking one multi-site system this quarter is the insurance policy if the VoR program is restructured under the next provincial budget.",
      keyResults: [
        {
          id: "kr_ent_outreach",
          title: "VoR-eligible institutions in active outreach",
          type: "leading",
          target: "Active outreach >= 12 systems",
          current: "Active outreach = 9 systems",
          trend30d: [
            3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9,
            9, 9, 9, 9, 9, 9, 9,
          ],
          confidence: "high",
          owner: "Khush",
          notes:
            "Trillium, Hamilton, Niagara, Centric, Osler all in motion plus four newer adds. The Ontario Health VoR list of eligible buyers is finite, which is what makes a 12-system target reachable on a quarter timeline.",
        },
        {
          id: "kr_ent_rfp_win",
          title: "RFP win rate (responded to closed-won)",
          type: "lagging",
          target: "RFP win rate >= 33% (1 of 3)",
          current: "RFP win rate = 0% (0 of 1)",
          trend30d: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
          ],
          confidence: "medium",
          owner: "Khush + Adeel",
          notes:
            "Only Trillium has an RFP on the table this quarter, and it lands in week 8. One win clears the KR, but the sample size is the sample size. Hamilton's RFP issues in Q1 2027.",
        },
        {
          id: "kr_ent_named_champion",
          title: "Named champion conversion (intro to demo)",
          type: "leading",
          target: "Named-champion to demo >= 60%",
          current: "Named-champion to demo = 50%",
          trend30d: [
            33, 33, 33, 40, 40, 40, 40, 43, 43, 43, 43, 43, 50, 50, 50, 50, 50,
            50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
          ],
          confidence: "low",
          owner: "Khush + Adeel",
          notes:
            "Named champions are 6 to 9 month relationships, not 13-week sprints. We have 4 of them, two are dragging. The Sacha Bhatia intro from the board (if it lands) is the asymmetric move that fixes the rate.",
        },
      ],
    },
    {
      id: "obj_team",
      category: "team",
      title: "Hire #2 (BDR) onboarded and ramping at week 8",
      why: "The send-volume KR caps at ~1,200/wk solo. Without a second BDR sequencing alongside, growth flattens in November and the $200k MRR target slips into Q1.",
      keyResults: [
        {
          id: "kr_team_pipeline",
          title: "BDR candidate pipeline",
          type: "leading",
          target: "Final-round candidates >= 3",
          current: "Final-round candidates = 2",
          trend30d: [
            0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2,
          ],
          confidence: "medium",
          owner: "Khush + Adeel",
          notes:
            "Two strong finals from Tali and Plooto alumni networks. Need a third for triangulation; the OCFP-physician-with-sales-instinct profile we want is rare and the search has been running 5 weeks.",
        },
        {
          id: "kr_team_first_send",
          title: "Time-to-first-send for new hire",
          type: "leading",
          target: "First send <= Day 5 of start",
          current: "Onboarding doc rev 3 shipped",
          trend30d: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
            1, 1, 1, 1, 2, 2, 3,
          ],
          confidence: "high",
          owner: "Khush",
          notes:
            "Onboarding plan is the same one I used myself in Q3: Day 1 access provisioning, Day 2 sequence-builder shadow, Day 3 first-50-sends review with me, Day 5 solo. Three rev cycles in, ready to ship.",
        },
        {
          id: "kr_team_week4_nps",
          title: "Week-4 NPS from new hire",
          type: "lagging",
          target: "Week-4 NPS >= 9",
          current: "N/A (hire not started)",
          trend30d: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
          ],
          confidence: "low",
          owner: "Khush",
          notes:
            "Can't measure what hasn't started. Confidence is low because every week the hire slips, the week-4 read slips with it, and a sub-9 NPS in this seat is a re-hire signal that derails the whole quarter.",
        },
      ],
    },
    {
      id: "obj_product_feedback",
      category: "product-feedback",
      title: "GTM team contributes 5 product changes from customer signal",
      why: "Outbound replies and demo transcripts are the highest-density product-feedback stream Vero has. A founder pattern-matches a GTM hire on whether the loop closes. This KR is how we prove it does.",
      keyResults: [
        {
          id: "kr_pf_interviews",
          title: "Customer interviews shipped per week",
          type: "leading",
          target: "Customer interviews/wk >= 4",
          current: "Customer interviews/wk = 3",
          trend30d: [
            1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 3, 3, 3, 3, 3, 3,
          ],
          confidence: "medium",
          owner: "Khush",
          notes:
            "Three interviews/wk is the steady state I can hit solo. The fourth requires hire #2 to take a slice, which lands the Team objective squarely on the critical path for this one too.",
        },
        {
          id: "kr_pf_issues_filed",
          title: "Product issues filed with provenance",
          type: "leading",
          target: "Issues filed/qtr >= 12 (with quote + lead ID)",
          current: "Issues filed = 4",
          trend30d: [
            0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4,
            4, 4, 4, 4, 4, 4, 4,
          ],
          confidence: "high",
          owner: "Khush",
          notes:
            "4 issues in 2 weeks, on-pace for 26 by quarter end. The provenance template (customer quote + lead ID + EMR cohort) is what makes them ship-rate-able instead of vibes.",
        },
        {
          id: "kr_pf_ship_rate",
          title: "Ship rate of GTM-sourced asks",
          type: "lagging",
          target: "Shipped >= 5 of 12 (>= 42%)",
          current: "Shipped = 1 of 4 (25%)",
          trend30d: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
          ],
          confidence: "medium",
          owner: "Khush + Adeel",
          notes:
            "1 of 4 shipped (the GLP-1 prior-auth template). The other three are queued behind the reply-classifier work. Engineering capacity is the constraint, not the quality of the asks. Adeel and I review priority weekly.",
        },
      ],
    },
  ],
};

export default SCORECARD;
