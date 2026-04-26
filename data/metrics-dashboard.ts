/**
 * Day-1 dashboard mock for the strategy page. These are the numbers I'd
 * expect to see on a Monday-morning Slack digest if I ran my own playbook
 * against the existing Vero pipeline. WEEK_1 is what's plausible from a
 * standing start; WEEK_4 is what the same engine should produce after one
 * iteration cycle on subject lines + EMR-aware first lines.
 *
 * Sourced from: Attio (touch volume + reply rate), HubSpot (demo + trial
 * conversions), Stripe (paid conversions + ARR), and a small Vercel cron
 * that times first-touch latency. "Mondays only" means the snapshot is cut
 * once per week so the trend line doesn't get noisy.
 */

export type MetricStatus = "on-track" | "watch" | "off-track";

export type MetricSnapshot = {
  label: string;
  value: string;
  /** "+12% vs week 0" — omitted when no baseline exists yet. */
  deltaFromBaseline?: string;
  /** Where the number comes from. Surfaced in the UI so it isn't a vibe. */
  source: string;
  status: MetricStatus;
};

export const WEEK_1_METRICS: MetricSnapshot[] = [
  {
    label: "Weekly send volume",
    value: "212",
    deltaFromBaseline: "+212 vs week 0",
    source: "Attio · Mondays only",
    status: "on-track",
  },
  {
    label: "Reply rate",
    value: "4.7%",
    deltaFromBaseline: "+0.7pt vs Tali baseline",
    source: "Postmark inbound parser",
    status: "on-track",
  },
  {
    label: "Demo book rate",
    value: "26%",
    deltaFromBaseline: "+1pt vs plan",
    source: "HubSpot meetings",
    status: "on-track",
  },
  {
    label: "Trial start rate",
    value: "38%",
    deltaFromBaseline: "−2pt vs plan",
    source: "HubSpot · post-demo",
    status: "watch",
  },
  {
    label: "ARR added",
    value: "$2,160",
    deltaFromBaseline: "+$2,160 vs week 0",
    source: "Stripe · new paid",
    status: "on-track",
  },
  {
    label: "Time-to-first-touch (median)",
    value: "8m",
    deltaFromBaseline: "−42m vs plan",
    source: "Vercel cron · /lead/[id]",
    status: "on-track",
  },
];

export const WEEK_4_METRICS: MetricSnapshot[] = [
  {
    label: "Weekly send volume",
    value: "1,040",
    deltaFromBaseline: "+391% vs week 1",
    source: "Attio · Mondays only",
    status: "on-track",
  },
  {
    label: "Reply rate",
    value: "5.9%",
    deltaFromBaseline: "+1.2pt vs week 1",
    source: "Postmark inbound parser",
    status: "on-track",
  },
  {
    label: "Demo book rate",
    value: "29%",
    deltaFromBaseline: "+3pt vs week 1",
    source: "HubSpot meetings",
    status: "on-track",
  },
  {
    label: "Trial start rate",
    value: "42%",
    deltaFromBaseline: "+4pt vs week 1",
    source: "HubSpot · post-demo",
    status: "on-track",
  },
  {
    label: "ARR added",
    value: "$11,520",
    deltaFromBaseline: "+433% vs week 1",
    source: "Stripe · new paid",
    status: "on-track",
  },
  {
    label: "Time-to-first-touch (median)",
    value: "6m",
    deltaFromBaseline: "−2m vs week 1",
    source: "Vercel cron · /lead/[id]",
    status: "on-track",
  },
];
