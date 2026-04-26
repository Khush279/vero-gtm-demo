import { describe, expect, it } from "vitest";

import {
  compute,
  buildVendorComparison,
  VERO_PRICE_PER_CLINICIAN,
  TALI_PRICE_PER_CLINICIAN,
  DAX_PRICE_PER_CLINICIAN,
  SUKI_PRICE_PER_CLINICIAN,
  WEEKS_PER_MONTH,
  type CalculatorInputs,
} from "@/lib/calculator";

/**
 * Build a CalculatorInputs object with sensible mid-band defaults that match
 * the slider defaults on /calculator. Tests override only what they need.
 */
function makeInputs(overrides: Partial<CalculatorInputs> = {}): CalculatorInputs {
  return {
    clinicians: 5,
    chartingHoursPerWeek: 7,
    hourlyRate: 200,
    currentScribeCostPerClinician: 0,
    timeSavingsPercent: 50,
    ...overrides,
  };
}

describe("compute — net savings sign", () => {
  it("returns a positive net monthly savings when recaptured time exceeds Vero cost", () => {
    const out = compute(makeInputs());
    expect(out.netMonthlySavings).toBeGreaterThan(0);
    expect(out.netAnnualSavings).toBeGreaterThan(0);
  });

  it("returns a negative net monthly savings when there are no charting hours to recapture", () => {
    const out = compute(makeInputs({ chartingHoursPerWeek: 0 }));
    // No recapture, but Vero still costs money -> net is negative.
    expect(out.recapturedDollarsPerMonth).toBe(0);
    expect(out.netMonthlySavings).toBeLessThan(0);
    expect(out.netMonthlySavings).toBeCloseTo(-(5 * VERO_PRICE_PER_CLINICIAN), 2);
  });

  it("subtracts the current scribe cost from net savings (switching cost)", () => {
    const baseline = compute(makeInputs({ currentScribeCostPerClinician: 0 }));
    const switching = compute(
      makeInputs({ currentScribeCostPerClinician: 300 }),
    );
    // 5 clinicians * $300 = $1500/mo more drag on the switching scenario.
    expect(switching.netMonthlySavings).toBeCloseTo(
      baseline.netMonthlySavings - 5 * 300,
      2,
    );
  });
});

describe("compute — hours saved math", () => {
  it("computes hours saved per clinician per week as charting × savings%", () => {
    const out = compute(
      makeInputs({ chartingHoursPerWeek: 10, timeSavingsPercent: 60 }),
    );
    expect(out.hoursSavedPerClinicianPerWeek).toBeCloseTo(6, 2);
  });

  it("scales hours saved per practice per month by clinicians and 4.33", () => {
    const out = compute(
      makeInputs({
        clinicians: 3,
        chartingHoursPerWeek: 8,
        timeSavingsPercent: 50,
      }),
    );
    // per clinician/week = 4. practice/month = 4 * 3 * 4.33 = 51.96
    expect(out.hoursSavedPerPracticeMonth).toBeCloseTo(
      4 * 3 * WEEKS_PER_MONTH,
      2,
    );
  });
});

describe("compute — ROI multiplier", () => {
  it("annualizes the ROI multiplier as recaptured/year ÷ Vero cost/year", () => {
    const out = compute(makeInputs());
    const annualVero = 5 * VERO_PRICE_PER_CLINICIAN * 12;
    const annualRecaptured = out.recapturedDollarsPerMonth * 12;
    expect(out.annualRoiMultiplier).toBeCloseTo(
      annualRecaptured / annualVero,
      2,
    );
  });

  it("returns 0 ROI multiplier when there are no clinicians (avoids divide by zero)", () => {
    const out = compute(makeInputs({ clinicians: 0 }));
    expect(out.annualRoiMultiplier).toBe(0);
    expect(out.veroMonthlyCost).toBe(0);
  });
});

describe("compute — vendor comparison strip", () => {
  it("anchors Vero ratio at 1 and scales the others by their per-clinician price", () => {
    const out = compute(makeInputs({ clinicians: 5 }));
    const byName = Object.fromEntries(
      out.vendorComparison.map((v) => [v.name, v]),
    );
    expect(byName.Vero.ratioVsVero).toBe(1);
    expect(byName.Tali.ratioVsVero).toBeCloseTo(
      TALI_PRICE_PER_CLINICIAN / VERO_PRICE_PER_CLINICIAN,
      2,
    );
    expect(byName.DAX.ratioVsVero).toBeCloseTo(
      DAX_PRICE_PER_CLINICIAN / VERO_PRICE_PER_CLINICIAN,
      2,
    );
    expect(byName.Suki.ratioVsVero).toBeCloseTo(
      SUKI_PRICE_PER_CLINICIAN / VERO_PRICE_PER_CLINICIAN,
      2,
    );
  });

  it("computes annual cost as 12× monthly for every vendor", () => {
    const out = compute(makeInputs({ clinicians: 4 }));
    for (const v of out.vendorComparison) {
      expect(v.annualCost).toBeCloseTo(v.monthlyCost * 12, 2);
    }
  });

  it("reports DAX's annual premium vs Vero correctly", () => {
    const clinicians = 10;
    const out = compute(makeInputs({ clinicians }));
    const dax = out.vendorComparison.find((v) => v.name === "DAX")!;
    const expectedPremium =
      clinicians * (DAX_PRICE_PER_CLINICIAN - VERO_PRICE_PER_CLINICIAN) * 12;
    expect(dax.annualPremiumVsVero).toBeCloseTo(expectedPremium, 2);
  });
});

describe("compute — edge cases", () => {
  it("zero clinicians produces zero costs and zero recaptured dollars", () => {
    const out = compute(makeInputs({ clinicians: 0 }));
    expect(out.veroMonthlyCost).toBe(0);
    expect(out.currentScribeMonthlyCost).toBe(0);
    expect(out.recapturedDollarsPerMonth).toBe(0);
    expect(out.hoursSavedPerPracticeMonth).toBe(0);
    expect(out.netMonthlySavings).toBe(0);
    expect(out.netAnnualSavings).toBe(0);
  });

  it("zero charting hours zeroes out hours saved but still accrues Vero cost", () => {
    const out = compute(makeInputs({ chartingHoursPerWeek: 0 }));
    expect(out.hoursSavedPerClinicianPerWeek).toBe(0);
    expect(out.hoursSavedPerPracticeMonth).toBe(0);
    expect(out.recapturedDollarsPerMonth).toBe(0);
    expect(out.veroMonthlyCost).toBeCloseTo(5 * VERO_PRICE_PER_CLINICIAN, 2);
  });

  it("max-slider scenario produces a large positive ROI", () => {
    // Top of every slider: 50 clinicians, 15 hr/wk, $400/hr, 70% savings.
    const out = compute(
      makeInputs({
        clinicians: 50,
        chartingHoursPerWeek: 15,
        hourlyRate: 400,
        currentScribeCostPerClinician: 0,
        timeSavingsPercent: 70,
      }),
    );
    // 50 * 15 * 0.7 * 4.33 * 400 ≈ $909k/mo recaptured, minus ~$3k Vero.
    expect(out.netMonthlySavings).toBeGreaterThan(900_000);
    expect(out.annualRoiMultiplier).toBeGreaterThan(100);
  });

  it("clamps negative-looking inputs to zero rather than producing negative outputs", () => {
    const out = compute({
      clinicians: -3,
      chartingHoursPerWeek: -5,
      hourlyRate: -100,
      currentScribeCostPerClinician: -200,
      timeSavingsPercent: -10,
    });
    expect(out.veroMonthlyCost).toBe(0);
    expect(out.recapturedDollarsPerMonth).toBe(0);
    expect(out.hoursSavedPerClinicianPerWeek).toBe(0);
    expect(out.netMonthlySavings).toBe(0);
  });
});

describe("buildVendorComparison — direct call", () => {
  it("returns four vendors in Vero-first order", () => {
    const strip = buildVendorComparison(5);
    expect(strip.map((v) => v.name)).toEqual(["Vero", "Tali", "DAX", "Suki"]);
  });

  it("falls back to per-clinician ratio when clinicians is 0", () => {
    const strip = buildVendorComparison(0);
    const byName = Object.fromEntries(strip.map((v) => [v.name, v]));
    expect(byName.Vero.monthlyCost).toBe(0);
    expect(byName.DAX.ratioVsVero).toBeCloseTo(
      DAX_PRICE_PER_CLINICIAN / VERO_PRICE_PER_CLINICIAN,
      2,
    );
  });
});
