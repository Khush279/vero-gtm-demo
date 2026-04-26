/**
 * Reference customers shown on /enterprise.
 *
 * Three mocked references that procurement teams at Ontario hospital systems
 * and large clinic groups would actually call before signing. Each entry maps
 * to a real org in data/enterprise.json so the demo stays internally consistent.
 *
 * Pull quotes are written to sound like a real reference call, not marketing
 * copy: every quote contains at least one specific number or named workflow
 * detail. The "won't talk about" list exists because honest references always
 * have limits, and a procurement team that hears those limits up front trusts
 * the rest of the conversation more.
 */

export type ReferenceCustomer = {
  id: string;
  org: string;
  championName: string;
  championTitle: string;
  vintage: string;
  segment: "virtual_care" | "primary_care_network" | "hospital_system" | "specialty";
  pullQuote: string;
  whatTheyTalkAbout: string[];
  whatTheyWontTalkAbout: string[];
  metrics: { label: string; value: string }[];
};

export const REFERENCE_CUSTOMERS: ReferenceCustomer[] = [
  {
    id: "ref_maple",
    org: "Maple",
    championName: "Dr. Hassan Siddiqui",
    championTitle: "Medical Director",
    vintage: "Customer since Q1 2026 · 12-month annual contract",
    segment: "virtual_care",
    pullQuote:
      "The doc-upload feature is the reason we picked Vero over Tali. Our async-care workflow drowns in PDFs from GLP-1 prior auths and Maple's legacy InputHealth notes, and Vero is the only scribe that lets a clinician dictate against an uploaded chart instead of starting blank.",
    whatTheyTalkAbout: [
      "InputHealth integration scope: which fields write back, which still need a copy-paste, and what shipped in the first 30 days versus phase 2",
      "Async-messaging note workflow for GLP-1 follow-ups and general-practice triage at 1,800 providers",
      "How they ran the pilot: 40 clinicians for 21 days, opt-in, weekly NPS pulse, kill-switch criteria written before launch",
      "Training friction at scale: what the onboarding webinar covered and where they had to build their own internal Loom library",
      "Phase 2 rollout to async messaging providers and the change-management sequencing they'd repeat",
    ],
    whatTheyWontTalkAbout: [
      "Final per-clinician pricing, under NDA",
      "Specific weekly encounter volumes by clinician cohort, competitive sensitive",
    ],
    metrics: [
      { label: "Minutes saved per encounter", value: "6.4" },
      { label: "Weekly active clinicians (of 1,800)", value: "1,412" },
      { label: "90-day retention rate", value: "94%" },
    ],
  },
  {
    id: "ref_centric",
    org: "Centric Health",
    championName: "Sarah Bennett",
    championTitle: "Chief Operating Officer",
    vintage: "Customer since Q2 2026 · 2-year term, $74/clinician/month",
    segment: "specialty",
    pullQuote:
      "We signed in 11 weeks from first call, which is unheard of for us. The deciding factor wasn't the product demo, it was that Vero's team turned around our Telus PSS integration spec in 6 business days and pre-filled a 47-question security questionnaire we usually spend a quarter on.",
    whatTheyTalkAbout: [
      "Procurement velocity at a private surgical and rehab network: 11 weeks call to MSA, what they cut out of their normal process",
      "Telus PSS integration build: what Vero shipped, what Centric had to do on their side, where the 6-day SLA was measured from",
      "Contract structure: 2-year term, $74/clinician/month, ramp schedule for the rehab sites",
      "Pre-filled security questionnaire and how their privacy officer reviewed the residency and audit-log answers",
      "ROI math their CFO actually accepted, including the assumptions they pushed back on",
    ],
    whatTheyWontTalkAbout: [
      "Names of the two competing vendors they evaluated, both relationships are still active",
      "Internal margin impact from the deal, not shareable outside the executive team",
    ],
    metrics: [
      { label: "Minutes saved per encounter", value: "5.8" },
      { label: "Weekly active clinicians (of 320)", value: "247" },
      { label: "90-day retention rate", value: "91%" },
    ],
  },
  {
    id: "ref_osler",
    org: "William Osler Health System",
    championName: "Dr. Aisha Khan",
    championTitle: "Chief of Family Medicine",
    vintage: "Brampton FP pilot since Q1 2026 · 12 clinicians, system rollout in scoping",
    segment: "hospital_system",
    pullQuote:
      "We piloted with 12 clinicians at our Brampton family-medicine group. Eight of them stopped charting after dinner within two weeks. The other four needed a different Cerner template for prenatal visits, and Vero shipped it in nine days.",
    whatTheyTalkAbout: [
      "Cerner integration scope at a VoR-eligible hospital system: what writes back, what doesn't, and how the OntarioMD review went",
      "Pilot design for 12 Brampton FPs: success criteria, the after-dinner-charting metric, how they extended into Etobicoke",
      "Custom template turnaround: the 9-day prenatal-visit spec, who owned it on each side",
      "Working with Osler's privacy office on the DPIA and PIPEDA review before pilot expansion",
      "What the system-wide RFP would need to look like to convert the pilot into 880 providers",
    ],
    whatTheyWontTalkAbout: [
      "Pilot pricing, sole-sourced under VoR and not representative of system-wide terms",
      "Comparison data versus other AI scribes, they ran a single-vendor evaluation",
    ],
    metrics: [
      { label: "Minutes saved per encounter", value: "7.1" },
      { label: "Pilot clinicians active at week 12", value: "11/12" },
      { label: "After-hours charting reduction", value: "68%" },
    ],
  },
];
