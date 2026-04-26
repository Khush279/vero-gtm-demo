import { describe, expect, it } from "vitest";

import { generateTrend, parseMetricValue } from "@/lib/series";

describe("generateTrend", () => {
  it("produces exactly N points", () => {
    const series = generateTrend(10, 100, 4);
    expect(series).toHaveLength(4);
    const series12 = generateTrend(0, 50, 12);
    expect(series12).toHaveLength(12);
  });

  it("pins the first value to start and the last value to end", () => {
    const series = generateTrend(50, 200, 6);
    expect(series[0]).toBe(50);
    expect(series[series.length - 1]).toBe(200);
  });

  it("keeps interior points within a reasonable jitter band of the linear path", () => {
    const start = 0;
    const end = 100;
    const series = generateTrend(start, end, 8, 0.05, "shape-test");
    // With 5% noise on a span of 100, jitter should be at most ±5. Allow a
    // small slack for the linear baseline and rounding.
    for (let i = 1; i < series.length - 1; i++) {
      const t = i / (series.length - 1);
      const linear = start + (end - start) * t;
      expect(Math.abs(series[i] - linear)).toBeLessThanOrEqual(10);
    }
  });

  it("is deterministic — same inputs and seed yield identical output", () => {
    const a = generateTrend(10, 80, 6, 0.05, "weekly-send");
    const b = generateTrend(10, 80, 6, 0.05, "weekly-send");
    expect(a).toEqual(b);
  });

  it("gives different shapes for different seeds (same endpoints)", () => {
    const a = generateTrend(10, 80, 6, 0.1, "alpha");
    const b = generateTrend(10, 80, 6, 0.1, "beta");
    // Endpoints match, interior shape should differ.
    expect(a[0]).toBe(b[0]);
    expect(a[a.length - 1]).toBe(b[b.length - 1]);
    const interiorA = a.slice(1, -1).join(",");
    const interiorB = b.slice(1, -1).join(",");
    expect(interiorA).not.toBe(interiorB);
  });

  it("handles edge cases (zero or one point)", () => {
    expect(generateTrend(5, 50, 0)).toEqual([]);
    expect(generateTrend(5, 50, 1)).toEqual([50]);
  });
});

describe("parseMetricValue", () => {
  it("parses dollars with commas", () => {
    expect(parseMetricValue("$11,520")).toBe(11520);
    expect(parseMetricValue("$2,160")).toBe(2160);
  });

  it("parses percent strings", () => {
    expect(parseMetricValue("5.9%")).toBe(5.9);
    expect(parseMetricValue("38%")).toBe(38);
  });

  it("parses durations like '8m'", () => {
    expect(parseMetricValue("8m")).toBe(8);
    expect(parseMetricValue("42m")).toBe(42);
  });

  it("parses plain numbers with comma grouping", () => {
    expect(parseMetricValue("1,040")).toBe(1040);
    expect(parseMetricValue("212")).toBe(212);
  });

  it("preserves negative signs (ASCII and unicode minus)", () => {
    expect(parseMetricValue("-2pt")).toBe(-2);
    expect(parseMetricValue("−2m")).toBe(-2);
  });

  it("returns null for unparseable strings", () => {
    expect(parseMetricValue("on track")).toBeNull();
    expect(parseMetricValue("")).toBeNull();
    expect(parseMetricValue("--")).toBeNull();
  });
});

describe("series helpers — determinism end-to-end", () => {
  it("parseMetricValue + generateTrend reproduce the same sparkline input", () => {
    const value = "$11,520";
    const parsed = parseMetricValue(value);
    expect(parsed).not.toBeNull();
    const a = generateTrend(parsed! * 0.7, parsed!, 4, 0.05, "ARR added");
    const b = generateTrend(parsed! * 0.7, parsed!, 4, 0.05, "ARR added");
    expect(a).toEqual(b);
  });
});
