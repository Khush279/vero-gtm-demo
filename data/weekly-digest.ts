/**
 * Friday-5pm founder-facing digest. The mock GTM engineer ships this every
 * week to Adeel + Bill so they can read the state of the engine in 90 seconds
 * standing in a kitchen. Numbers continue from /metrics (week 4 snapshot) so
 * the surfaces line up.
 *
 * All trends are 4-point series produced by lib/series.generateTrend, seeded
 * by the metric label so renders are stable. Prose is em-dash-free.
 */

import { generateTrend } from "@/lib/series";

export type DigestSection = {
  id: string;
  heading: string;
  /** Markdown-lite. Bullets are lines beginning with "- ". Bold is **bold**. */
  body: string;
};

export type DigestMetric = {
  label: string;
  value: string;
  trend: number[];
  deltaText: string;
  status: "on-track" | "watch" | "off-track";
};

export type DigestExperiment = {
  name: string;
  status: "running" | "decided" | "paused";
  result?: string;
  nextAction: string;
};

export type WeeklyDigest = {
  weekOf: string;
  weekNumber: number;
  topline: string;
  metrics: DigestMetric[];
  experiments: DigestExperiment[];
  sections: DigestSection[];
  oneSlideForCEO: string;
};

/**
 * generateTrend produces 4 points: start near `start`, ends pinned at `end`,
 * with deterministic jitter seeded by the metric label.
 */
function trend(start: number, end: number, label: string): number[] {
  return generateTrend(start, end, 4, 0.06, label);
}

export const DIGEST: WeeklyDigest = {
  weekOf: "Apr 20 → Apr 24",
  weekNumber: 4,
  topline:
    "ARR added cleared $11.5k for the first time and reply rate held above 5.5% for the third straight week. The bottleneck is now slot density on the demo calendar, not top-of-funnel volume.",

  metrics: [
    {
      label: "Weekly send volume",
      value: "1,040",
      trend: trend(820, 1040, "Weekly send volume"),
      deltaText: "+27% vs last week",
      status: "on-track",
    },
    {
      label: "Reply rate",
      value: "5.9%",
      trend: trend(5.4, 5.9, "Reply rate"),
      deltaText: "+0.3pt vs last week",
      status: "on-track",
    },
    {
      label: "Demo book rate",
      value: "29%",
      trend: trend(26, 29, "Demo book rate"),
      deltaText: "+1pt vs last week",
      status: "on-track",
    },
    {
      label: "Trial start rate",
      value: "42%",
      trend: trend(38, 42, "Trial start rate"),
      deltaText: "+2pt vs last week",
      status: "on-track",
    },
    {
      label: "ARR added",
      value: "$11,520",
      trend: trend(7200, 11520, "ARR added"),
      deltaText: "+60% vs last week",
      status: "on-track",
    },
    {
      label: "Time-to-first-touch (median)",
      value: "6m",
      trend: trend(8, 6, "Time-to-first-touch (median)"),
      deltaText: "−2m vs last week",
      status: "on-track",
    },
  ],

  experiments: [
    {
      name: "Subject line: $720/yr vs $59.99/mo",
      status: "decided",
      result:
        "Annual framing won by 18% on trial-start rate at p=0.04. Rolled to 100% of solo FP cohort Wednesday.",
      nextAction:
        "Port the same anchor to the LinkedIn first-touch DM. Read in 7 days.",
    },
    {
      name: "EMR-aware first line (OSCAR vs Accuro vs PS Suite)",
      status: "running",
      result:
        "Day 4 of 10. Reply rate on the OSCAR variant is +1.4pt over control. Accuro and PS Suite still inside noise.",
      nextAction:
        "Hold to day 10 before calling. If OSCAR holds, ship that variant and keep the other two in test for another cycle.",
    },
    {
      name: "Wed 7am vs Tue 11am send time",
      status: "paused",
      result:
        "Paused after 3 days. Tue 11am leaked into a CMA newsletter blast and the inbox-noise confound got worse, not better.",
      nextAction:
        "Restart next Mon with Wed 7am vs Thu 7am so neither variant collides with the newsletter cadence.",
    },
  ],

  sections: [
    {
      id: "wins",
      heading: "Wins",
      body:
        "- **ARR added crossed $11.5k**, the first week the engine paid for itself by Friday rather than by the end of the month.\n- **Demo-to-trial conversion hit 42%** on a base of 19 demos. The post-demo trigger that fires the trial link inside 15 minutes is doing real work.\n- **Subject-line A/B called early.** Annual anchor wins by 18% on trial-start. Rolled to 100% of the solo FP cohort on Wednesday.\n- **Toronto cohort reply rate hit 7.2%**, the first city above 7%. The EMR-aware opener is compounding on a denser ICP.",
    },
    {
      id: "misses",
      heading: "Misses",
      body:
        "- **Hamilton + London cohorts underperformed.** Reply rate sat at 3.9% and 3.4%, a full point below plan. Likely an ICP mismatch in the CPSO pull, not a copy problem.\n- **Trial-to-paid lag widened to 11 days** (median), up from 8. Two prospects cited integrations review on the OSCAR side. Worth a call with Adeel on whether we ship a one-pager for IT teams.\n- **One unsubscribe from a known reference customer.** Sent a hand-written apology, kept the relationship. Adding a suppression rule so reference accounts are excluded from cold sequences automatically.",
    },
    {
      id: "risks",
      heading: "Risks I am watching",
      body:
        "- **Calendar density.** Two demo requests got pushed to the following week because the slot grid was full by Tuesday. If volume keeps growing we are leaving demos on the floor.\n- **Postmark inbound parser misses ~3% of replies** when prospects reply from a different address than the one we sent to. Workaround in place. Permanent fix needs a thread-id match.\n- **CPSO pull staleness.** Source data is 6 weeks old. A small but non-zero share of leads have moved practices. Refresh queued for next Monday.",
    },
    {
      id: "asks",
      heading: "Asks",
      body:
        "- **Adeel:** 30 minutes Monday to walk through the integrations one-pager draft for the OSCAR side. Two trial-stage prospects are blocked on it.\n- **Bill:** intro to the Hamilton FHO contact you mentioned on the Apr 12 call. The Hamilton cohort is the weakest reply-rate city and a warm path in fixes the data faster than another A/B.\n- **Both:** thumbs up or down on bumping the weekly send target from 1,000 to 1,500 once the calendar slot grid expands. Default is yes unless either of you flags a reason.",
    },
    {
      id: "next-week",
      heading: "Next week",
      body:
        "- Ship the integrations one-pager (Monday) and pin it in the post-demo trigger.\n- Restart the send-time test (Wed 7am vs Thu 7am) on the full ICP.\n- Refresh the CPSO pull and re-score the Hamilton + London cohorts.\n- Open a second demo slot grid (Wednesday afternoons) so calendar density stops being the binding constraint.\n- Draft the LinkedIn first-touch sequence using the winning subject-line anchor. Ship by Friday.",
    },
  ],

  oneSlideForCEO:
    "- **Engine paid for itself by Friday.** $11,520 ARR added, reply rate 5.9%, 19 demos booked.\n- **Pricing anchor decided.** Annual framing wins by 18%. Rolled to 100% of the solo FP cohort.\n- **Bottleneck moved from volume to slot density.** Two demos pushed a week because the calendar was full. Fix is a second slot grid, not more sends.\n- **Two asks:** 30 min with Adeel on the OSCAR integrations one-pager, and a warm intro from Bill into the Hamilton FHO.",
};

export default DIGEST;
