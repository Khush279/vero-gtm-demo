/**
 * Prompt builders for the four-touch outbound sequence.
 *
 * Three tones are supported. They share a common system prompt that hard-codes
 * the brand voice rules (no em dashes, no "synergy", capped length, single
 * specific ask, specialty- and EMR-aware).
 */

import { EMR_LABELS, type EmrInferred, type Lead, type Touch } from "@/lib/types";

export type PromptTone = "direct" | "conversational" | "skeptical";

export type PromptMessages = {
  system: string;
  user: string;
};

const TONE_GUIDANCE: Record<PromptTone, string> = {
  direct:
    "Tone: direct and operational. Short sentences. Lead with the dollar number or hour count. No throat-clearing, no pleasantries beyond a one-line opener.",
  conversational:
    "Tone: warm peer-to-peer. Sound like another clinician's friend who happens to know the tooling space. Allowed to reference the city or a clinic-name detail once.",
  skeptical:
    "Tone: anti-pitch. Acknowledge that the inbox is full of AI scribe vendors, then earn the next 30 seconds by naming one specific reason Vero is different from Tali or DAX for this clinician. No hedging.",
};

const LEVERAGE_NOTES = {
  price_anchor:
    "Price anchor: Vero is $59.99–89/mo CAD per clinician. Tali is roughly $300/mo. Frame the delta as hours of admin time bought back per month, not as a discount.",
  doc_upload_diff:
    "Doc-upload differentiator: Vero accepts uploaded clinical documents (referral letters, lab PDFs, prior notes) and incorporates them into the encounter summary. Tali and DAX do not. This matters most for FPs running complex follow-ups.",
  pipeda_compliance:
    "PIPEDA compliance: Canadian data residency, no PHI leaves Canadian-hosted infrastructure. Mention only if the clinician is at a hospital-affiliated or FHT setting where privacy review is part of vendor selection.",
  ontario_vor:
    "Ontario Health Vendor of Record: Vero is on the VoR list, which removes 6–9 months of procurement friction for any Ontario hospital or FHT. Use only when the recipient is part of an FHT, OHT, or hospital network.",
  peer_adoption:
    "Peer adoption: thousands of providers across North America. Reference one nearby cohort if plausible (e.g. 'three clinics on Bloor are running it now') without naming individuals.",
  specialty_template:
    "Specialty templates: Vero ships 150+ specialty-specific note templates. Reference the lead's specialty by name and one note type they actually write (SOAP, consult letter, periodic health, mental-status exam, etc.).",
  ehr_specific:
    "EHR-specific: name the inferred EMR and reference the integration story. For OSCAR mention the community plug-in path. For Telus PSS mention paste-back into the SOAP template. For Accuro mention the Kroll integration. Never bluff specifics you don't have.",
} as const;

function specialtyHook(specialty: string): string {
  if (/family|general practice/i.test(specialty)) return "periodic health visits and complex chronic-care follow-ups";
  if (/internal medicine/i.test(specialty)) return "consult letters and discharge summaries";
  if (/psychiatr/i.test(specialty)) return "mental status exams and structured intake notes";
  if (/paediatric|pediatric/i.test(specialty)) return "well-baby visits and parent-facing summaries";
  return "your daily encounter notes";
}

function emrHook(emr: EmrInferred): string {
  switch (emr) {
    case "telus_pss":
      return "paste-back into your Telus PSS SOAP template";
    case "telus_med_access":
      return "the Med Access encounter workflow";
    case "accuro":
      return "Accuro charting plus the Kroll meds context";
    case "oscar":
      return "the OSCAR community plug-in path";
    case "epic":
      return "Epic SmartPhrases for clinician sign-off";
    case "cerner":
      return "Cerner PowerNotes";
    case "input_health":
      return "the WELL / InputHealth chart";
    case "unknown":
      return "your current charting flow";
  }
}

function touchSlot(day: number): string {
  switch (day) {
    case 1:
      return "first-touch cold email. Earn the open with the subject line and earn the click with the first sentence.";
    case 4:
      return "second touch. Different angle from Day 1, not a 'bumping this up' note.";
    case 9:
      return "third touch. Drop in a concrete proof point or a 1-line social proof from a nearby clinician.";
    case 16:
      return "break-up note. Polite, no guilt, leave the door open. Single sentence ask.";
    default:
      return "follow-up touch.";
  }
}

const SHARED_RULES = [
  "Hard cap: 90 words for the body, not counting subject or signature.",
  "No em dashes anywhere. Use a comma, period, or 'and' instead.",
  "No exclamation points.",
  "Do not use the words 'synergy' or 'leverage' as a verb.",
  "End with exactly one specific ask: a 15-minute demo. Use the placeholder {{calendly_link}} for the URL.",
  "Sign as 'Khush, Vero'.",
  "Output strict JSON with keys: subject (string), body (string). No markdown, no preamble.",
];

export function buildPrompt(
  lead: Lead,
  touchDay: number,
  leverage: Touch["leverage"],
  tone: PromptTone,
): PromptMessages {
  const emrLabel = EMR_LABELS[lead.inferredEmr] ?? "your current EMR";
  const yearsExp = Math.max(0, 2026 - lead.yearRegistered);

  const system = [
    "You are an outbound copy generator for Vero, a Canadian AI medical scribe priced at $59.99–89 CAD per month per clinician.",
    "You write to one Ontario clinician at a time. The recipient is busy, has seen at least one Tali AI ad this week, and will give you about four seconds.",
    TONE_GUIDANCE[tone],
    "Voice rules:",
    ...SHARED_RULES.map((r) => `- ${r}`),
  ].join("\n");

  const user = [
    `Recipient: ${lead.name}, ${lead.specialty}, ${lead.city}.`,
    `Years in practice: ${yearsExp}.`,
    `Practice context: ${lead.practiceAddress}.`,
    `Inferred EMR: ${emrLabel}. Reference it once, naturally.`,
    `Touch slot: Day ${touchDay} (${touchSlot(touchDay)}).`,
    `Leverage point for this touch: ${leverage}.`,
    LEVERAGE_NOTES[leverage],
    `Specialty hook to weave in: ${specialtyHook(lead.specialty)} via ${emrHook(lead.inferredEmr)}.`,
    "",
    "Write the email now. Return strict JSON: { \"subject\": \"...\", \"body\": \"...\" }.",
  ].join("\n");

  return { system, user };
}
