/**
 * Per-channel ROI inputs for /channel-mix.
 *
 * The ChannelData rows are the "ground truth" the page renders into cards
 * (cost, raw pipeline, attributed close-won, CAC, sparkline). The attribution
 * model picker re-runs the math in lib/attribution.ts against the same touch
 * dataset to show how each channel's share of close-won revenue shifts.
 *
 * Numbers are illustrative. Outbound + SEO content carry the motion; paid
 * search is intentionally zero (per the strategy memo, Vero is not running
 * paid acquisition); partner is small but high-AOV; direct is brand traffic
 * that mostly reflects upstream channel work landing.
 *
 * Closed-won values here are deliberately *raw* (not yet model-attributed) so
 * the page can show the swing between the cards and the attribution-modelled
 * stacked bar below. The two views answering different questions is the
 * point of the surface.
 */

import { generateTrend } from "@/lib/series";

export type ChannelId =
  | "outbound_email"
  | "seo_content"
  | "linkedin"
  | "partner"
  | "paid_search"
  | "direct";

export type Recommendation = "double-down" | "watch" | "cut";

export type ChannelData = {
  id: ChannelId;
  label: string;
  costPerMonth: number;
  pipelineGenerated: number; // CAD, last 30 days
  closedWonAttributed: number; // CAD, last 30 days, last-touch baseline
  visitsLast30: number;
  trend30d: number[]; // 30 daily values for sparkline
  cac: number; // attributed CAC at last-touch baseline
  recommendation: Recommendation;
  notes: string;
};

export type AttributionModel =
  | "first-touch"
  | "last-touch"
  | "linear"
  | "time-decay";

export const ATTRIBUTION_MODELS: {
  id: AttributionModel;
  label: string;
  description: string;
}[] = [
  {
    id: "first-touch",
    label: "First-touch",
    description:
      "100% credit to the channel that first introduced the deal. Best for measuring top-of-funnel demand creation.",
  },
  {
    id: "last-touch",
    label: "Last-touch",
    description:
      "100% credit to the final channel before close. Industry default; underweights the work that built awareness.",
  },
  {
    id: "linear",
    label: "Linear",
    description:
      "Equal credit across every touch in the deal. Honest but blurs which channel actually moved the deal forward.",
  },
  {
    id: "time-decay",
    label: "Time-decay",
    description:
      "Exponential weight toward later touches with a 7-day half-life. Closest to how a sales team actually feels deal momentum.",
  },
];

/**
 * 6 channels, populated to match Vero's actual GTM posture from the strategy
 * memo: outbound and content carry the motion; partner is small but mighty;
 * paid search is parked (zeroed out everywhere); direct is downstream brand.
 */
export const CHANNELS: ChannelData[] = [
  {
    id: "outbound_email",
    label: "Outbound email",
    costPerMonth: 4800,
    pipelineGenerated: 186000,
    closedWonAttributed: 92400,
    visitsLast30: 1240,
    trend30d: generateTrend(28, 52, 30, 0.18, "outbound-email-30d"),
    cac: 156,
    recommendation: "double-down",
    notes:
      "Highest pipeline generator. Reply rates climbing as the Ontario FP segmentation tightens. Add a Quebec sequence in week 3.",
  },
  {
    id: "seo_content",
    label: "SEO content",
    costPerMonth: 3200,
    pipelineGenerated: 168000,
    closedWonAttributed: 81600,
    visitsLast30: 18420,
    trend30d: generateTrend(520, 740, 30, 0.12, "seo-content-30d"),
    cac: 118,
    recommendation: "double-down",
    notes:
      "Cheapest CAC, longest half-life. The Tali comparison page alone drives 12% of demos. Three new posts queued in /analytics.",
  },
  {
    id: "linkedin",
    label: "LinkedIn (organic)",
    costPerMonth: 1400,
    pipelineGenerated: 48000,
    closedWonAttributed: 22800,
    visitsLast30: 1180,
    trend30d: generateTrend(34, 41, 30, 0.22, "linkedin-30d"),
    cac: 184,
    recommendation: "watch",
    notes:
      "Founder posts assist deals more than they originate them. Keep posting; do not spend more on it until the assist value is measurable.",
  },
  {
    id: "partner",
    label: "Partner / referral",
    costPerMonth: 900,
    pipelineGenerated: 132000,
    closedWonAttributed: 84000,
    visitsLast30: 86,
    trend30d: generateTrend(2, 5, 30, 0.4, "partner-30d"),
    cac: 64,
    recommendation: "double-down",
    notes:
      "Small touch volume, ~3x the AOV. Two clinic-network partners closed in March. Build a formal referral program in Q2.",
  },
  {
    id: "paid_search",
    label: "Paid search",
    costPerMonth: 0,
    pipelineGenerated: 0,
    closedWonAttributed: 0,
    visitsLast30: 0,
    trend30d: generateTrend(0, 0, 30, 0, "paid-search-30d"),
    cac: 0,
    recommendation: "cut",
    notes:
      "Not running. The strategy memo holds: SEO already wins the comparison queries and paid CAC for healthcare SaaS in Canada is 3-4x LTV-safe levels. Revisit only if SEO ranks slip.",
  },
  {
    id: "direct",
    label: "Direct / brand",
    costPerMonth: 0,
    pipelineGenerated: 38400,
    closedWonAttributed: 26400,
    visitsLast30: 4310,
    trend30d: generateTrend(124, 168, 30, 0.14, "direct-30d"),
    cac: 0,
    recommendation: "watch",
    notes:
      "Mostly downstream of outbound and content; clinicians type the URL after a peer mentions it. Treat as a health signal, not a channel to invest in directly.",
  },
];

/**
 * Recommendation chip styling lives next to the data so /channel-mix and any
 * future surface (dashboard pill, slack digest) stay visually consistent.
 */
export const RECOMMENDATION_LABEL: Record<Recommendation, string> = {
  "double-down": "Double down",
  watch: "Watch",
  cut: "Cut",
};

export const CHANNEL_BAR_COLORS: Record<ChannelId, string> = {
  outbound_email: "#234738", // forest-700
  seo_content: "#3d7457", // forest-500
  linkedin: "#609476", // forest-400
  partner: "#8eb89a", // forest-300
  paid_search: "#bf801f", // ochre-500
  direct: "#dfb35a", // ochre-300
};
