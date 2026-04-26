import { describe, expect, it } from "vitest";

import {
  estimateCost,
  estimateTokens,
  formatCost,
  MODEL_PRICING,
} from "@/lib/token-estimate";

describe("estimateTokens: empty + whitespace", () => {
  it("returns 0 for an empty string", () => {
    expect(estimateTokens("")).toBe(0);
  });

  it("returns 0 for a whitespace-only string", () => {
    expect(estimateTokens("   \n\n\t  ")).toBe(0);
  });
});

describe("estimateTokens: normalization", () => {
  it("collapses runs of whitespace before counting", () => {
    // "abcd efgh" is 9 chars, ceil(9/4) = 3.
    const single = estimateTokens("abcd efgh");
    // Same content with multi-space and newlines should match.
    const padded = estimateTokens("abcd     \n\n   efgh");
    expect(single).toBe(3);
    expect(padded).toBe(single);
  });

  it("trims leading and trailing whitespace before counting", () => {
    expect(estimateTokens("   hello   ")).toBe(estimateTokens("hello"));
  });
});

describe("estimateTokens: multi-paragraph counting", () => {
  it("counts the collapsed length of multi-paragraph prose", () => {
    const text = [
      "First paragraph about the lead.",
      "",
      "Second paragraph naming the EMR.",
      "",
      "Third paragraph with the specific ask.",
    ].join("\n");
    // After collapsing: 31 + 1 + 32 + 1 + 38 = 103 chars; ceil(103/4) = 26.
    const collapsedLen = text.replace(/\s+/g, " ").trim().length;
    expect(estimateTokens(text)).toBe(Math.ceil(collapsedLen / 4));
  });

  it("scales roughly linearly with content length", () => {
    const short = "a".repeat(40);
    const long = "a".repeat(400);
    expect(estimateTokens(long)).toBeGreaterThan(estimateTokens(short) * 9);
    expect(estimateTokens(long)).toBeLessThanOrEqual(estimateTokens(short) * 11);
  });
});

describe("estimateCost: model-specific math", () => {
  it("computes gpt-4o-mini cost at $0.15/$0.60 per 1M", () => {
    // 1M input + 1M output tokens => 0.15 + 0.60 = 0.75 USD.
    const cost = estimateCost(1_000_000, 1_000_000, "gpt-4o-mini");
    expect(cost).toBeCloseTo(0.75, 6);
  });

  it("defaults to gpt-4o-mini when the model arg is omitted", () => {
    const explicit = estimateCost(1000, 100, "gpt-4o-mini");
    const defaulted = estimateCost(1000, 100);
    expect(defaulted).toBe(explicit);
  });

  it("scales with model price tier (gpt-4o > gpt-4o-mini)", () => {
    const mini = estimateCost(1000, 100, "gpt-4o-mini");
    const full = estimateCost(1000, 100, "gpt-4o");
    expect(full).toBeGreaterThan(mini);
  });

  it("returns 0 for zero tokens regardless of model", () => {
    for (const model of Object.keys(MODEL_PRICING) as Array<
      keyof typeof MODEL_PRICING
    >) {
      expect(estimateCost(0, 0, model)).toBe(0);
    }
  });

  it("computes a realistic per-call cost for a 700/100 token sequence touch", () => {
    // 700 input + 100 output on gpt-4o-mini:
    // input: 700/1e6 * 0.15 = 0.000105
    // output: 100/1e6 * 0.6  = 0.00006
    // total: 0.000165
    const cost = estimateCost(700, 100, "gpt-4o-mini");
    expect(cost).toBeCloseTo(0.000165, 9);
  });
});

describe("formatCost: display helpers", () => {
  it("formats sub-millicent costs at 6dp", () => {
    expect(formatCost(0.000165)).toBe("$0.000165");
  });

  it("formats sub-dollar costs at 4dp", () => {
    expect(formatCost(0.4)).toBe("$0.4000");
  });

  it("formats dollar-and-up costs at 2dp", () => {
    expect(formatCost(12.345)).toBe("$12.35");
  });
});
