import { describe, expect, it } from "vitest";

import leadsJson from "@/data/leads.json";
import {
  PIPELINE_STAGES,
  SEGMENT_LABELS,
  EMR_LABELS,
  type Lead,
} from "@/lib/types";

const leads = leadsJson as Lead[];

const VALID_STAGES = new Set(PIPELINE_STAGES.map((s) => s.id));
const VALID_SEGMENTS = new Set(Object.keys(SEGMENT_LABELS));
const VALID_EMRS = new Set(Object.keys(EMR_LABELS));

describe("leads.json — shape and volume", () => {
  it("contains exactly 500 entries (the seeded demo size)", () => {
    expect(leads.length).toBe(500);
  });

  it("uses lead_NNNN id format with zero-padded four-digit numbers", () => {
    const idPattern = /^lead_\d{4}$/;
    for (const lead of leads) {
      expect(lead.id).toMatch(idPattern);
    }
  });

  it("has globally unique IDs (no dupes from the seed script)", () => {
    const ids = new Set(leads.map((l) => l.id));
    expect(ids.size).toBe(leads.length);
  });
});

describe("leads.json — enum integrity", () => {
  it("uses only declared PipelineStage values", () => {
    for (const lead of leads) {
      expect(VALID_STAGES.has(lead.stage)).toBe(true);
    }
  });

  it("uses only declared Segment values", () => {
    for (const lead of leads) {
      expect(VALID_SEGMENTS.has(lead.segment)).toBe(true);
    }
  });

  it("uses only declared EmrInferred values", () => {
    for (const lead of leads) {
      expect(VALID_EMRS.has(lead.inferredEmr)).toBe(true);
    }
  });

  it("represents every pipeline stage at least once (Kanban demos need full columns)", () => {
    const seen = new Set(leads.map((l) => l.stage));
    for (const { id } of PIPELINE_STAGES) {
      expect(seen.has(id)).toBe(true);
    }
  });
});

describe("leads.json — score distribution", () => {
  it("keeps every score within the 0..100 ICP band", () => {
    for (const lead of leads) {
      expect(lead.score).toBeGreaterThanOrEqual(0);
      expect(lead.score).toBeLessThanOrEqual(100);
      expect(Number.isInteger(lead.score)).toBe(true);
    }
  });

  it("has a roughly Gaussian-shaped mean in the 40..70 band (no extreme skew)", () => {
    const mean = leads.reduce((acc, l) => acc + l.score, 0) / leads.length;
    expect(mean).toBeGreaterThanOrEqual(40);
    expect(mean).toBeLessThanOrEqual(70);
  });

  it("has nontrivial variance (not all scores collapsed to one value)", () => {
    const mean = leads.reduce((acc, l) => acc + l.score, 0) / leads.length;
    const variance =
      leads.reduce((acc, l) => acc + (l.score - mean) ** 2, 0) / leads.length;
    const stddev = Math.sqrt(variance);
    expect(stddev).toBeGreaterThan(5);
  });
});
