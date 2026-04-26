/**
 * /resources page data. Five downloadable artefacts a founder could hand the
 * second hire on day one. Each entry is paired with a real file shipped from
 * /public/resources/files so the download button actually delivers the bytes.
 *
 * Why it exists: founders read demos and quietly ask "but can they hand me
 * something I can paste into a doc tomorrow?" These files answer yes.
 */

export type Resource = {
  id: string;
  category: "playbook" | "template" | "spreadsheet" | "spec";
  title: string;
  description: string;
  fileType: "md" | "csv" | "json";
  filename: string;
  downloadHref: string;
  bytesEstimate: number;
  whatItContains: string[];
  bestFor: string;
};

export const RESOURCES: Resource[] = [
  {
    id: "icp-scoring-rubric",
    category: "spreadsheet",
    title: "ICP scoring rubric",
    description:
      "The exact weight table that turns a CPSO row into a 0 to 100 ICP score. Drop into Sheets, edit the weights, recalc the pipeline.",
    fileType: "csv",
    filename: "icp-scoring-rubric.csv",
    downloadHref: "/resources/files/icp-scoring-rubric.csv",
    bytesEstimate: 1743,
    whatItContains: [
      "5 dimensions: specialty, city tier, experience band, segment, competitor pressure",
      "Weight ranges (0.4 to 1.0) with the matching scoring band per dimension",
      "Plain-language label for every band so a non-engineer can edit it",
      "Final score formula in row 1 so the math is auditable",
    ],
    bestFor: "Day-1 lead scoring without writing code",
  },
  {
    id: "4-touch-sequence-playbook",
    category: "playbook",
    title: "4-touch cold sequence playbook",
    description:
      "The Day 1, 4, 9, 16 cadence written as an operating manual. Pre-flight, full email bodies with merge tokens, reply routing, weekly rollup.",
    fileType: "md",
    filename: "4-touch-sequence-playbook.md",
    downloadHref: "/resources/files/4-touch-sequence-playbook.md",
    bytesEstimate: 7824,
    whatItContains: [
      "5-point pre-flight checklist (CASL basis, suppression, From identity, hand-review, EMR inference)",
      "Four full email bodies with merge tokens and operator notes",
      "Reply classifier routing rules (positive, OOO, negative, unsubscribe, bounce)",
      "Weekly rollup spec with the qualitative signal sales reads on Tuesdays",
    ],
    bestFor: "Solo BDR running 1,000 sends a week without burning the brand",
  },
  {
    id: "rfp-response-template",
    category: "template",
    title: "RFP response template",
    description:
      "Six pre-filled answer blocks for the Ontario Health VSQ and most hospital procurement questionnaires. Paste, swap names, ship.",
    fileType: "md",
    filename: "rfp-response-template.md",
    downloadHref: "/resources/files/rfp-response-template.md",
    bytesEstimate: 8724,
    whatItContains: [
      "PIPEDA, data residency, BAA, audit logging, SOC 2, security questionnaire",
      "Each block 2 to 4 sentences, calibrated to Vero's real positioning",
      "Cover letter and capability matrix scaffolding",
      "Honest framing on the SOC 2 Type II gap (procurement reviewers reward candour)",
    ],
    bestFor: "10-day hospital RFP sprint, FHT or hospital-affiliated clinic",
  },
  {
    id: "week-1-dashboard-spec",
    category: "spec",
    title: "Week-1 dashboard spec",
    description:
      "JSON schema for the Monday-morning Slack digest. Metric labels, sources, status thresholds. Hand to whoever builds the production dashboard.",
    fileType: "json",
    filename: "week-1-dashboard-spec.json",
    downloadHref: "/resources/files/week-1-dashboard-spec.json",
    bytesEstimate: 5600,
    whatItContains: [
      "6 metric definitions: send volume, reply rate, demo book, trial start, ARR added, time-to-first-touch",
      "Source system per metric (Attio, Postmark, HubSpot, Stripe, Vercel cron)",
      "On-track, watch, off-track threshold values for each",
      "Cadence and delivery channel (#gtm, Mondays 8a Eastern)",
    ],
    bestFor: "Engineer wiring the production dashboard from real data",
  },
  {
    id: "lead-enrichment-field-map",
    category: "spreadsheet",
    title: "Lead enrichment field map",
    description:
      "How a row from the CPSO public register becomes a Lead in Attio. Source field, target field, transformation, required flag.",
    fileType: "csv",
    filename: "lead-enrichment-field-map.csv",
    downloadHref: "/resources/files/lead-enrichment-field-map.csv",
    bytesEstimate: 3020,
    whatItContains: [
      "20 field mappings across CPSO register, Lead type, and Attio attributes",
      "Transformation rules for city tier, experience band, EMR inference",
      "Required vs nullable per target so the importer fails loud",
      "Notes on the two fields that must be hand-reviewed before send",
    ],
    bestFor: "Importer or Zapier-equivalent that loads CPSO rows into Attio",
  },
];
