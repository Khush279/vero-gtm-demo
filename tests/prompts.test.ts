import { describe, expect, it } from "vitest";

import { buildPrompt, type PromptTone } from "@/lib/prompts";
import type { Lead } from "@/lib/types";

function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_test",
    name: "Dr. Avery Khan",
    specialty: "Family Medicine",
    yearRegistered: 2014,
    languages: ["English"],
    city: "Toronto, ON",
    practiceAddress: "Bloor West Clinic, 200 Bloor St W",
    inferredEmr: "oscar",
    segment: "clinic_solo",
    score: 88,
    stage: "new",
    daysInStage: 0,
    nextTouchAt: null,
    lastContactedAt: null,
    nearbyCompetitorPresence: 0,
    source: "cpso_register",
    ...overrides,
  };
}

describe("buildPrompt — tone branches", () => {
  const lead = makeLead();
  const tones: PromptTone[] = ["direct", "conversational", "skeptical"];

  it("produces distinct system prompts per tone", () => {
    const systems = tones.map(
      (t) => buildPrompt(lead, 1, "price_anchor", t).system,
    );
    const unique = new Set(systems);
    expect(unique.size).toBe(tones.length);
  });

  it("hard-codes the direct tone guidance when tone is 'direct'", () => {
    const { system } = buildPrompt(lead, 1, "price_anchor", "direct");
    expect(system).toMatch(/direct and operational/i);
  });

  it("hard-codes the conversational tone guidance when tone is 'conversational'", () => {
    const { system } = buildPrompt(lead, 1, "price_anchor", "conversational");
    expect(system).toMatch(/warm peer-to-peer/i);
  });

  it("hard-codes the skeptical tone guidance when tone is 'skeptical'", () => {
    const { system } = buildPrompt(lead, 1, "price_anchor", "skeptical");
    expect(system).toMatch(/anti-pitch/i);
  });
});

describe("buildPrompt — lead context appears in the user prompt", () => {
  it("names the lead's specialty, city, and EMR by label", () => {
    const lead = makeLead({
      specialty: "Internal Medicine",
      city: "Hamilton, ON",
      inferredEmr: "accuro",
    });
    const { user } = buildPrompt(lead, 4, "specialty_template", "direct");
    expect(user).toContain("Internal Medicine");
    expect(user).toContain("Hamilton, ON");
    expect(user).toContain("Accuro EMR");
  });

  it("references the lead's practice address verbatim", () => {
    const lead = makeLead({
      practiceAddress: "Sunnyside FHT, 1 Roncesvalles Ave",
    });
    const { user } = buildPrompt(lead, 1, "peer_adoption", "conversational");
    expect(user).toContain("Sunnyside FHT, 1 Roncesvalles Ave");
  });

  it("includes the lead's name in the user prompt", () => {
    const lead = makeLead({ name: "Dr. Priya Shah" });
    const { user } = buildPrompt(lead, 1, "price_anchor", "direct");
    expect(user).toContain("Dr. Priya Shah");
  });
});

describe("buildPrompt — leverage point references the right Vero asset", () => {
  const lead = makeLead();

  it("price_anchor surfaces the $59.99 Vero price", () => {
    const { user } = buildPrompt(lead, 1, "price_anchor", "direct");
    expect(user).toContain("$59.99");
  });

  it("doc_upload_diff surfaces PDFs / uploaded documents", () => {
    const { user } = buildPrompt(lead, 4, "doc_upload_diff", "direct");
    expect(user).toMatch(/PDF|document/i);
  });

  it("ontario_vor surfaces the Vendor of Record / VoR program", () => {
    const { user } = buildPrompt(lead, 9, "ontario_vor", "direct");
    expect(user).toMatch(/Vendor of Record|VoR/);
  });

  it("pipeda_compliance surfaces PIPEDA by name", () => {
    const { user } = buildPrompt(lead, 16, "pipeda_compliance", "direct");
    expect(user).toContain("PIPEDA");
  });
});

describe("buildPrompt — output bounds and structure", () => {
  it("keeps system + user under 4000 chars (single touch fits in a small context)", () => {
    const lead = makeLead({
      practiceAddress:
        "An exceptionally long practice name that includes many descriptors, " +
        "Suite 1234, 9999 Some Very Long Street Name West",
    });
    for (const tone of ["direct", "conversational", "skeptical"] as PromptTone[]) {
      const { system, user } = buildPrompt(lead, 1, "ehr_specific", tone);
      expect(system.length + user.length).toBeLessThan(4000);
    }
  });

  it("returns both a non-empty system and user message", () => {
    const { system, user } = buildPrompt(
      makeLead(),
      1,
      "price_anchor",
      "direct",
    );
    expect(system.length).toBeGreaterThan(0);
    expect(user.length).toBeGreaterThan(0);
  });

  it("instructs the model to return strict JSON with subject and body keys", () => {
    const { user, system } = buildPrompt(
      makeLead(),
      1,
      "price_anchor",
      "direct",
    );
    const combined = `${system}\n${user}`;
    expect(combined).toMatch(/subject/);
    expect(combined).toMatch(/body/);
    expect(combined).toMatch(/JSON/i);
  });

  it("forbids em dashes via the shared voice rules", () => {
    const { system } = buildPrompt(
      makeLead(),
      1,
      "price_anchor",
      "conversational",
    );
    expect(system).toMatch(/No em dashes/i);
  });
});
