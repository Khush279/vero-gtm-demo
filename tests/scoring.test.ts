import { describe, expect, it } from "vitest";

import { scoreLead } from "@/lib/scoring";
import type { Lead } from "@/lib/types";

/**
 * Build a Lead with sensible defaults so each test can override only the
 * fields it cares about. The defaults pin every weight to 1.0 (top of the
 * ICP), so the baseline score is 100. Any test that overrides a single
 * field is asserting the multiplicative effect of that single field.
 */
function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_test",
    name: "Dr. Test Subject",
    specialty: "Family Medicine",
    yearRegistered: 2015, // 11 years experience at refYear 2026 -> mid band 1.0
    languages: ["English"],
    city: "Toronto, ON",
    practiceAddress: "Test Clinic, 1 Test St",
    inferredEmr: "oscar",
    segment: "clinic_solo",
    score: 0,
    stage: "new",
    daysInStage: 0,
    nextTouchAt: null,
    lastContactedAt: null,
    nearbyCompetitorPresence: 0,
    source: "cpso_register",
    ...overrides,
  };
}

describe("scoreLead — specialty weights", () => {
  it("scores Family Medicine at the top of the specialty band", () => {
    const score = scoreLead(makeLead({ specialty: "Family Medicine" }));
    expect(score).toBe(100);
  });

  it("scores General Practice at the top of the specialty band", () => {
    const score = scoreLead(makeLead({ specialty: "General Practice" }));
    expect(score).toBe(100);
  });

  it("scores Internal Medicine at the top of the specialty band", () => {
    const score = scoreLead(makeLead({ specialty: "Internal Medicine" }));
    expect(score).toBe(100);
  });

  it("discounts Psychiatry to 0.7 of full ICP weight", () => {
    const score = scoreLead(makeLead({ specialty: "Psychiatry" }));
    expect(score).toBe(70);
  });

  it("discounts Pediatrics to 0.6 of full ICP weight", () => {
    const score = scoreLead(makeLead({ specialty: "Pediatrics" }));
    expect(score).toBe(60);
  });

  it("falls back to 0.4 weight for an unknown specialty", () => {
    const score = scoreLead(makeLead({ specialty: "Dermatology" }));
    expect(score).toBe(40);
  });
});

describe("scoreLead — city tiers", () => {
  it("treats Toronto as a tier-1 city", () => {
    const score = scoreLead(makeLead({ city: "Toronto, ON" }));
    expect(score).toBe(100);
  });

  it("treats Hamilton as a tier-2 city (0.8 weight)", () => {
    const score = scoreLead(makeLead({ city: "Hamilton, ON" }));
    expect(score).toBe(80);
  });

  it("treats unrecognized cities as tier-3 (0.7 weight)", () => {
    const score = scoreLead(makeLead({ city: "Sudbury, ON" }));
    expect(score).toBe(70);
  });
});

describe("scoreLead — experience bands", () => {
  it("penalizes brand-new physicians (year 2024, < 5 years)", () => {
    const score = scoreLead(makeLead({ yearRegistered: 2024 }));
    expect(score).toBe(50);
  });

  it("rewards mid-career physicians (5–15 years)", () => {
    const score = scoreLead(makeLead({ yearRegistered: 2015 }));
    expect(score).toBe(100);
  });

  it("slightly discounts senior physicians (16–25 years)", () => {
    const score = scoreLead(makeLead({ yearRegistered: 2005 }));
    expect(score).toBe(85);
  });

  it("heavily discounts late-career physicians (year 1985, > 25 years)", () => {
    const score = scoreLead(makeLead({ yearRegistered: 1985 }));
    expect(score).toBe(60);
  });
});

describe("scoreLead — segments", () => {
  it("scores solo clinics at full weight", () => {
    const score = scoreLead(makeLead({ segment: "clinic_solo" }));
    expect(score).toBe(100);
  });

  it("scores group clinics at 0.85", () => {
    const score = scoreLead(makeLead({ segment: "clinic_group" }));
    expect(score).toBe(85);
  });

  it("scores specialty groups at 0.7", () => {
    const score = scoreLead(makeLead({ segment: "specialty" }));
    expect(score).toBe(70);
  });

  it("scores enterprise systems at 0.5 (long-cycle, off-wedge)", () => {
    const score = scoreLead(makeLead({ segment: "enterprise" }));
    expect(score).toBe(50);
  });
});

describe("scoreLead — competitor pressure", () => {
  it("rewards leads with no nearby competitors", () => {
    const score = scoreLead(makeLead({ nearbyCompetitorPresence: 0 }));
    expect(score).toBe(100);
  });

  it("discounts 1 nearby competitor to 0.9", () => {
    const score = scoreLead(makeLead({ nearbyCompetitorPresence: 1 }));
    expect(score).toBe(90);
  });

  it("discounts 2 nearby competitors to 0.75", () => {
    const score = scoreLead(makeLead({ nearbyCompetitorPresence: 2 }));
    expect(score).toBe(75);
  });

  it("floors at 0.6 once 3+ competitors are nearby", () => {
    const score3 = scoreLead(makeLead({ nearbyCompetitorPresence: 3 }));
    const score4 = scoreLead(makeLead({ nearbyCompetitorPresence: 4 }));
    expect(score3).toBe(60);
    expect(score4).toBe(60);
  });
});

describe("scoreLead — bounds and determinism", () => {
  it("never returns a score above 100", () => {
    const score = scoreLead(
      makeLead({
        specialty: "Family Medicine",
        city: "Toronto, ON",
        yearRegistered: 2015,
        segment: "clinic_solo",
        nearbyCompetitorPresence: 0,
      }),
    );
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it("never returns a negative score on the worst-case lead", () => {
    const score = scoreLead(
      makeLead({
        specialty: "Dermatology",
        city: "Sudbury, ON",
        yearRegistered: 1985,
        segment: "enterprise",
        nearbyCompetitorPresence: 4,
      }),
    );
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("is deterministic — same input yields same output across runs", () => {
    const lead = makeLead({
      specialty: "Family Medicine",
      city: "Hamilton, ON",
      yearRegistered: 2010,
      segment: "clinic_group",
      nearbyCompetitorPresence: 1,
    });
    const a = scoreLead(lead);
    const b = scoreLead(lead);
    const c = scoreLead({ ...lead });
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it("composes weights multiplicatively (worked example)", () => {
    // 0.7 (psych) * 0.8 (Hamilton) * 1.0 (mid-career) * 0.85 (group) * 0.9 (1 comp) * 100
    // = 0.4284 * 100 = 42.84 -> rounds to 43
    const score = scoreLead(
      makeLead({
        specialty: "Psychiatry",
        city: "Hamilton, ON",
        yearRegistered: 2015,
        segment: "clinic_group",
        nearbyCompetitorPresence: 1,
      }),
    );
    expect(score).toBe(43);
  });
});
