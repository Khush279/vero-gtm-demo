/**
 * Multi-touch attribution math.
 *
 * Pure functions that take an array of `Touch` records (channel + timestamp,
 * one per marketing interaction on a closed-won deal) and return a weight
 * allocation: how much of the deal each channel "earned" under a given model.
 *
 * Four models are supported:
 *   first-touch  — 100% credit to the first channel that ever touched the deal
 *   last-touch   — 100% credit to the last channel before close
 *   linear       — equal credit split across every touch (deduped per channel)
 *   time-decay   — exponential decay anchored on the close date; later touches
 *                  earn more weight than earlier ones (7-day half-life)
 *
 * The output is a Record<ChannelId, number> where the values sum to 1.0
 * (within floating-point tolerance) for any deal that has at least one touch.
 * A deal with zero touches returns an all-zero record.
 *
 * Server-safe, no React, no DOM.
 */

import type { ChannelId } from "@/data/channel-mix";

export type Touch = {
  channel: ChannelId;
  /** Days before the close date. 0 = day of close, 14 = two weeks before. */
  daysBeforeClose: number;
};

export type AttributionModel = "first-touch" | "last-touch" | "linear" | "time-decay";

/** Empty allocation — every channel at zero. Used as a fold seed. */
function emptyAllocation(): Record<ChannelId, number> {
  return {
    outbound_email: 0,
    seo_content: 0,
    linkedin: 0,
    partner: 0,
    paid_search: 0,
    direct: 0,
  };
}

/**
 * Allocate a single deal's worth of credit (1.0) across channels under the
 * chosen model. The function returns an *allocation*, not an attributed
 * dollar value — multiply by the deal's value at the call site.
 */
export function attribute(
  touches: Touch[],
  model: AttributionModel,
): Record<ChannelId, number> {
  const out = emptyAllocation();
  if (!touches || touches.length === 0) return out;

  // Sort chronologically: largest daysBeforeClose first (oldest touch),
  // smallest last (closest to close). We always work with this canonical
  // ordering so the caller can pass touches in any order.
  const sorted = [...touches].sort((a, b) => b.daysBeforeClose - a.daysBeforeClose);

  if (model === "first-touch") {
    out[sorted[0].channel] = 1;
    return out;
  }

  if (model === "last-touch") {
    out[sorted[sorted.length - 1].channel] = 1;
    return out;
  }

  if (model === "linear") {
    // Equal credit per touch. Repeat touches on the same channel each get
    // their own slice — that's intentional: a channel that touched the deal
    // 3 times should outweigh one that only touched once.
    const share = 1 / sorted.length;
    for (const t of sorted) {
      out[t.channel] += share;
    }
    return out;
  }

  // time-decay: weight = 0.5 ^ (daysBeforeClose / halfLifeDays)
  const halfLifeDays = 7;
  const weights = sorted.map((t) =>
    Math.pow(0.5, t.daysBeforeClose / halfLifeDays),
  );
  const total = weights.reduce((s, w) => s + w, 0) || 1;
  for (let i = 0; i < sorted.length; i++) {
    out[sorted[i].channel] += weights[i] / total;
  }
  return out;
}

/**
 * Attribute a list of deals (each with a value) and return the total dollar
 * attribution per channel. Convenience wrapper around `attribute`.
 */
export function attributeDeals(
  deals: { value: number; touches: Touch[] }[],
  model: AttributionModel,
): Record<ChannelId, number> {
  const total = emptyAllocation();
  for (const d of deals) {
    const alloc = attribute(d.touches, model);
    for (const k of Object.keys(alloc) as ChannelId[]) {
      total[k] += alloc[k] * d.value;
    }
  }
  return total;
}

/**
 * 30 fake closed-won deals with realistic touch sequences. Used by the
 * /channel-mix page to show how the same underlying data shifts under each
 * model. Outbound + SEO content dominate first-touch; LinkedIn and direct
 * shift up under last-touch; partner is small but high-AOV.
 */
export const SAMPLE_DEALS: { id: string; value: number; touches: Touch[] }[] = [
  // Outbound-led, SEO assist — the bread-and-butter motion.
  { id: "d-001", value: 14400, touches: [
    { channel: "outbound_email", daysBeforeClose: 38 },
    { channel: "seo_content", daysBeforeClose: 22 },
    { channel: "direct", daysBeforeClose: 9 },
    { channel: "outbound_email", daysBeforeClose: 4 },
  ]},
  { id: "d-002", value: 12000, touches: [
    { channel: "outbound_email", daysBeforeClose: 31 },
    { channel: "seo_content", daysBeforeClose: 18 },
    { channel: "outbound_email", daysBeforeClose: 5 },
  ]},
  { id: "d-003", value: 16800, touches: [
    { channel: "outbound_email", daysBeforeClose: 45 },
    { channel: "linkedin", daysBeforeClose: 30 },
    { channel: "seo_content", daysBeforeClose: 12 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},
  { id: "d-004", value: 10800, touches: [
    { channel: "outbound_email", daysBeforeClose: 26 },
    { channel: "outbound_email", daysBeforeClose: 12 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},
  { id: "d-005", value: 21600, touches: [
    { channel: "seo_content", daysBeforeClose: 52 },
    { channel: "outbound_email", daysBeforeClose: 33 },
    { channel: "seo_content", daysBeforeClose: 14 },
    { channel: "direct", daysBeforeClose: 6 },
  ]},

  // SEO-led inbound. Clinician finds a comparison post, books a demo.
  { id: "d-006", value: 14400, touches: [
    { channel: "seo_content", daysBeforeClose: 19 },
    { channel: "direct", daysBeforeClose: 4 },
  ]},
  { id: "d-007", value: 12000, touches: [
    { channel: "seo_content", daysBeforeClose: 24 },
    { channel: "seo_content", daysBeforeClose: 10 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},
  { id: "d-008", value: 18000, touches: [
    { channel: "seo_content", daysBeforeClose: 41 },
    { channel: "linkedin", daysBeforeClose: 22 },
    { channel: "direct", daysBeforeClose: 5 },
  ]},
  { id: "d-009", value: 9600, touches: [
    { channel: "seo_content", daysBeforeClose: 16 },
    { channel: "direct", daysBeforeClose: 1 },
  ]},
  { id: "d-010", value: 13200, touches: [
    { channel: "seo_content", daysBeforeClose: 28 },
    { channel: "outbound_email", daysBeforeClose: 14 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},
  { id: "d-011", value: 14400, touches: [
    { channel: "seo_content", daysBeforeClose: 33 },
    { channel: "seo_content", daysBeforeClose: 18 },
    { channel: "direct", daysBeforeClose: 4 },
  ]},
  { id: "d-012", value: 16800, touches: [
    { channel: "seo_content", daysBeforeClose: 49 },
    { channel: "outbound_email", daysBeforeClose: 23 },
    { channel: "linkedin", daysBeforeClose: 11 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},

  // LinkedIn-led. Founder posts get traction, peer DMs follow.
  { id: "d-013", value: 12000, touches: [
    { channel: "linkedin", daysBeforeClose: 21 },
    { channel: "outbound_email", daysBeforeClose: 9 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},
  { id: "d-014", value: 14400, touches: [
    { channel: "linkedin", daysBeforeClose: 28 },
    { channel: "seo_content", daysBeforeClose: 13 },
    { channel: "direct", daysBeforeClose: 4 },
  ]},
  { id: "d-015", value: 10800, touches: [
    { channel: "linkedin", daysBeforeClose: 17 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},

  // Partner-led. Small count, big AOV (clinic networks, EMR resellers).
  { id: "d-016", value: 36000, touches: [
    { channel: "partner", daysBeforeClose: 42 },
    { channel: "seo_content", daysBeforeClose: 18 },
    { channel: "direct", daysBeforeClose: 5 },
  ]},
  { id: "d-017", value: 48000, touches: [
    { channel: "partner", daysBeforeClose: 36 },
    { channel: "outbound_email", daysBeforeClose: 19 },
    { channel: "direct", daysBeforeClose: 4 },
  ]},
  { id: "d-018", value: 28800, touches: [
    { channel: "partner", daysBeforeClose: 24 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},

  // Outbound mix continued, with LinkedIn assists.
  { id: "d-019", value: 13200, touches: [
    { channel: "outbound_email", daysBeforeClose: 22 },
    { channel: "linkedin", daysBeforeClose: 11 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},
  { id: "d-020", value: 12000, touches: [
    { channel: "outbound_email", daysBeforeClose: 18 },
    { channel: "outbound_email", daysBeforeClose: 8 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},
  { id: "d-021", value: 16800, touches: [
    { channel: "outbound_email", daysBeforeClose: 41 },
    { channel: "seo_content", daysBeforeClose: 26 },
    { channel: "linkedin", daysBeforeClose: 12 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},
  { id: "d-022", value: 14400, touches: [
    { channel: "outbound_email", daysBeforeClose: 29 },
    { channel: "seo_content", daysBeforeClose: 14 },
    { channel: "direct", daysBeforeClose: 4 },
  ]},
  { id: "d-023", value: 10800, touches: [
    { channel: "outbound_email", daysBeforeClose: 19 },
    { channel: "outbound_email", daysBeforeClose: 7 },
  ]},

  // Direct/word-of-mouth. Clinician told by a peer, types in the URL.
  { id: "d-024", value: 9600, touches: [
    { channel: "direct", daysBeforeClose: 14 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},
  { id: "d-025", value: 12000, touches: [
    { channel: "direct", daysBeforeClose: 11 },
    { channel: "seo_content", daysBeforeClose: 5 },
    { channel: "direct", daysBeforeClose: 1 },
  ]},

  // SEO + LinkedIn cross-pollination.
  { id: "d-026", value: 14400, touches: [
    { channel: "seo_content", daysBeforeClose: 32 },
    { channel: "linkedin", daysBeforeClose: 14 },
    { channel: "direct", daysBeforeClose: 4 },
  ]},
  { id: "d-027", value: 12000, touches: [
    { channel: "linkedin", daysBeforeClose: 23 },
    { channel: "seo_content", daysBeforeClose: 10 },
    { channel: "direct", daysBeforeClose: 2 },
  ]},

  // Outbound, single-touch fast-close.
  { id: "d-028", value: 9600, touches: [
    { channel: "outbound_email", daysBeforeClose: 8 },
    { channel: "direct", daysBeforeClose: 1 },
  ]},

  // SEO + outbound, longer cycle.
  { id: "d-029", value: 18000, touches: [
    { channel: "seo_content", daysBeforeClose: 56 },
    { channel: "outbound_email", daysBeforeClose: 28 },
    { channel: "seo_content", daysBeforeClose: 12 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},

  // Partner + LinkedIn, mid-AOV.
  { id: "d-030", value: 21600, touches: [
    { channel: "partner", daysBeforeClose: 31 },
    { channel: "linkedin", daysBeforeClose: 14 },
    { channel: "direct", daysBeforeClose: 3 },
  ]},
];
