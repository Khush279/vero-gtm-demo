import { describe, expect, it } from "vitest";

import {
  attribute,
  attributeDeals,
  SAMPLE_DEALS,
  type Touch,
} from "@/lib/attribution";

/**
 * Tests for the multi-touch attribution module. Every model returns a
 * Record<ChannelId, number>; the values should sum to ~1.0 for any deal
 * that has at least one touch, and ~0.0 for an empty deal.
 */

const EPSILON = 1e-9;

function sumAlloc(alloc: Record<string, number>): number {
  return Object.values(alloc).reduce((s, v) => s + v, 0);
}

describe("attribute — first-touch model", () => {
  it("gives 100% credit to the first (oldest) channel", () => {
    const touches: Touch[] = [
      { channel: "outbound_email", daysBeforeClose: 30 },
      { channel: "linkedin", daysBeforeClose: 12 },
      { channel: "direct", daysBeforeClose: 2 },
    ];
    const out = attribute(touches, "first-touch");
    expect(out.outbound_email).toBe(1);
    expect(out.linkedin).toBe(0);
    expect(out.direct).toBe(0);
    expect(sumAlloc(out)).toBeCloseTo(1, 9);
  });

  it("ignores the input order and uses chronology", () => {
    // Same touches, different array order; result should be identical.
    const touches: Touch[] = [
      { channel: "direct", daysBeforeClose: 2 },
      { channel: "outbound_email", daysBeforeClose: 30 },
      { channel: "linkedin", daysBeforeClose: 12 },
    ];
    const out = attribute(touches, "first-touch");
    expect(out.outbound_email).toBe(1);
  });
});

describe("attribute — last-touch model", () => {
  it("gives 100% credit to the last (newest) channel", () => {
    const touches: Touch[] = [
      { channel: "outbound_email", daysBeforeClose: 30 },
      { channel: "linkedin", daysBeforeClose: 12 },
      { channel: "direct", daysBeforeClose: 2 },
    ];
    const out = attribute(touches, "last-touch");
    expect(out.direct).toBe(1);
    expect(out.outbound_email).toBe(0);
    expect(sumAlloc(out)).toBeCloseTo(1, 9);
  });
});

describe("attribute — linear model", () => {
  it("distributes credit evenly across every touch (incl. duplicates)", () => {
    const touches: Touch[] = [
      { channel: "outbound_email", daysBeforeClose: 30 },
      { channel: "outbound_email", daysBeforeClose: 12 },
      { channel: "direct", daysBeforeClose: 2 },
    ];
    const out = attribute(touches, "linear");
    // Two outbound touches + one direct -> 2/3 vs 1/3.
    expect(out.outbound_email).toBeCloseTo(2 / 3, 9);
    expect(out.direct).toBeCloseTo(1 / 3, 9);
    expect(sumAlloc(out)).toBeCloseTo(1, 9);
  });
});

describe("attribute — time-decay model", () => {
  it("weights later touches more heavily than earlier ones", () => {
    // Same channel for first vs same channel for last; the late touch wins.
    const touches: Touch[] = [
      { channel: "outbound_email", daysBeforeClose: 28 },
      { channel: "linkedin", daysBeforeClose: 1 },
    ];
    const out = attribute(touches, "time-decay");
    expect(out.linkedin).toBeGreaterThan(out.outbound_email);
    expect(sumAlloc(out)).toBeCloseTo(1, 6);
  });

  it("uses a 7-day half-life: a touch 7 days earlier earns half the weight", () => {
    const touches: Touch[] = [
      { channel: "outbound_email", daysBeforeClose: 7 },
      { channel: "linkedin", daysBeforeClose: 0 },
    ];
    const out = attribute(touches, "time-decay");
    // weights: 0.5 and 1; total = 1.5 -> 1/3 and 2/3.
    expect(out.outbound_email).toBeCloseTo(1 / 3, 9);
    expect(out.linkedin).toBeCloseTo(2 / 3, 9);
  });
});

describe("attribute — degenerate inputs", () => {
  it("returns an all-zero record for an empty touch list", () => {
    const out = attribute([], "linear");
    expect(sumAlloc(out)).toBe(0);
    for (const v of Object.values(out)) {
      expect(v).toBe(0);
    }
  });

  it("gives 100% to a single touch under every model", () => {
    const touches: Touch[] = [{ channel: "partner", daysBeforeClose: 5 }];
    for (const model of [
      "first-touch",
      "last-touch",
      "linear",
      "time-decay",
    ] as const) {
      const out = attribute(touches, model);
      expect(out.partner).toBeCloseTo(1, 9);
      expect(sumAlloc(out)).toBeCloseTo(1, 6);
    }
  });

  it("is deterministic across repeat calls with the same input", () => {
    const touches: Touch[] = [
      { channel: "seo_content", daysBeforeClose: 22 },
      { channel: "outbound_email", daysBeforeClose: 8 },
      { channel: "direct", daysBeforeClose: 1 },
    ];
    const a = attribute(touches, "time-decay");
    const b = attribute(touches, "time-decay");
    expect(a).toEqual(b);
  });
});

describe("attributeDeals — aggregates per-deal allocations into dollars", () => {
  it("sums per-channel attribution across the full sample-deals corpus", () => {
    const totals = attributeDeals(SAMPLE_DEALS, "linear");
    const dealValueSum = SAMPLE_DEALS.reduce((s, d) => s + d.value, 0);
    const channelSum = sumAlloc(totals);
    // Every deal in the sample has at least one touch, so the channel
    // totals should sum to the deal value total within float tolerance.
    expect(channelSum).toBeGreaterThan(0);
    expect(Math.abs(channelSum - dealValueSum)).toBeLessThan(EPSILON * dealValueSum + 1e-3);
  });

  it("shifts more dollars onto outbound_email under first-touch than last-touch", () => {
    const first = attributeDeals(SAMPLE_DEALS, "first-touch");
    const last = attributeDeals(SAMPLE_DEALS, "last-touch");
    expect(first.outbound_email).toBeGreaterThan(last.outbound_email);
  });
});

describe("SAMPLE_DEALS — sanity checks on the seeded corpus", () => {
  it("ships at least 5 sample deals (the page renders this list)", () => {
    expect(SAMPLE_DEALS.length).toBeGreaterThanOrEqual(5);
  });

  it("gives every sample deal a positive value and at least one touch", () => {
    for (const d of SAMPLE_DEALS) {
      expect(d.value).toBeGreaterThan(0);
      expect(d.touches.length).toBeGreaterThan(0);
    }
  });
});
