import { describe, expect, it } from "vitest";

import { enrichLead, inferEmr, inferNearbyCompetitors } from "@/lib/enrich";
import type { Lead } from "@/lib/types";

function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_test",
    name: "Dr. Test Subject",
    specialty: "Family Medicine",
    yearRegistered: 2015,
    languages: ["English"],
    city: "Toronto, ON",
    practiceAddress: "Test Clinic, 1 Test St",
    inferredEmr: "unknown",
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

describe("inferEmr — branch coverage", () => {
  it("detects Telus PSS from explicit Telus mention", () => {
    expect(inferEmr("Telus clinic, 1 Yonge", "Toronto, ON")).toBe("telus_pss");
    expect(inferEmr("PS Suite practice", "Toronto, ON")).toBe("telus_pss");
  });

  it("detects Telus Med Access by exact substring", () => {
    expect(inferEmr("Med Access shop, 22 Queen St", "Toronto, ON")).toBe(
      "telus_med_access",
    );
  });

  it("infers Telus PSS from FHT / OHT signals", () => {
    expect(inferEmr("Toronto Family Health Team, 1 King St", "Toronto, ON")).toBe(
      "telus_pss",
    );
    expect(
      inferEmr("Brampton Ontario Health Team, 562 Bovaird Dr W", "Brampton, ON"),
    ).toBe("telus_pss");
    expect(inferEmr("Some FHT branch", "Mississauga, ON")).toBe("telus_pss");
  });

  it("infers Accuro from medical centre / wellness centre naming", () => {
    expect(inferEmr("Mississauga Wellness Centre, 1427 Burnhamthorpe", "Mississauga, ON")).toBe(
      "accuro",
    );
    expect(inferEmr("Yonge Medical Centre, 517 Sheppard Ave E", "Toronto, ON")).toBe(
      "accuro",
    );
    expect(inferEmr("Riverside Medical Group, 22 King", "Ottawa, ON")).toBe("accuro");
  });

  it("infers Epic for hospital and academic addresses", () => {
    expect(inferEmr("Mount Sinai Hospital, 600 University Ave", "Toronto, ON")).toBe(
      "epic",
    );
    expect(inferEmr("UHN Toronto General, 200 Elizabeth", "Toronto, ON")).toBe("epic");
    expect(inferEmr("Academic Family Practice, 100 College St", "Toronto, ON")).toBe(
      "epic",
    );
  });

  it("infers Cerner for regional health / LHIN signals", () => {
    expect(inferEmr("Central LHIN office, 1 Hwy 7", "Markham, ON")).toBe("cerner");
    expect(inferEmr("Northern Regional Health, 100 Pine", "Sudbury, ON")).toBe(
      "cerner",
    );
  });

  it("infers InputHealth for walk-in / WELL signals", () => {
    expect(inferEmr("Walk-in clinic, 88 Bloor St", "Toronto, ON")).toBe("input_health");
    expect(inferEmr("WELL Health practice, 3 Yonge", "Toronto, ON")).toBe("input_health");
  });

  it("infers OSCAR for downtown Toronto small clinics with suite/clinic naming", () => {
    expect(inferEmr("Suite 304, 50 Carlton St", "Toronto, ON")).toBe("oscar");
    expect(inferEmr("Bloor West Clinic, 200 Bloor", "Toronto, ON")).toBe("oscar");
  });

  it("falls through to unknown when nothing matches", () => {
    expect(inferEmr("Some Office, 1 Random Rd", "Sudbury, ON")).toBe("unknown");
  });
});

describe("inferNearbyCompetitors", () => {
  it("is deterministic for the same (city, address) pair", () => {
    const a = inferNearbyCompetitors("Toronto, ON", "Bloor West Clinic, 200 Bloor");
    const b = inferNearbyCompetitors("Toronto, ON", "Bloor West Clinic, 200 Bloor");
    expect(a).toBe(b);
  });

  it("clamps the result into the 0..4 range", () => {
    for (let i = 0; i < 50; i += 1) {
      const n = inferNearbyCompetitors(
        i % 2 === 0 ? "Toronto, ON" : "Sudbury, ON",
        `Clinic ${i}, ${i} Street`,
      );
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(4);
    }
  });
});

describe("enrichLead", () => {
  it("fills in inferredEmr when it is unknown", () => {
    const lead = makeLead({
      inferredEmr: "unknown",
      practiceAddress: "Mount Sinai Hospital, 600 University Ave",
      city: "Toronto, ON",
    });
    const enriched = enrichLead(lead);
    expect(enriched.inferredEmr).toBe("epic");
  });

  it("does not clobber an already-set inferredEmr", () => {
    const lead = makeLead({
      inferredEmr: "accuro",
      practiceAddress: "Mount Sinai Hospital, 600 University Ave",
      city: "Toronto, ON",
    });
    const enriched = enrichLead(lead);
    expect(enriched.inferredEmr).toBe("accuro");
  });

  it("is idempotent on a fully enriched lead", () => {
    const lead = makeLead({
      inferredEmr: "oscar",
      nearbyCompetitorPresence: 2,
      practiceAddress: "Suite 304, 50 Carlton St",
      city: "Toronto, ON",
    });
    const once = enrichLead(lead);
    const twice = enrichLead(once);
    expect(twice).toEqual(once);
  });

  it("returns a fresh object rather than mutating the input", () => {
    const lead = makeLead({
      inferredEmr: "unknown",
      practiceAddress: "Mount Sinai Hospital, 600 University Ave",
      city: "Toronto, ON",
    });
    const enriched = enrichLead(lead);
    expect(enriched).not.toBe(lead);
    expect(lead.inferredEmr).toBe("unknown");
  });
});
