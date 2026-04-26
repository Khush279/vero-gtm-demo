/**
 * The eight objections every Canadian family physician raises in the first
 * call. Each response references Vero's actual positioning (PIPEDA, Canadian
 * data residency in ca-central-1, doc-upload, $59.99 price point, 9-day
 * custom template SLA) so the rep on the phone has something concrete to
 * say instead of marketing copy.
 *
 * Surfaced in two places: /objections (standalone) and at the bottom of
 * /lead/[id] (in compact mode).
 */

export type Objection = {
  id: string;
  category:
    | "privacy"
    | "cost"
    | "workflow"
    | "accuracy"
    | "trust"
    | "switching";
  /** The objection as the physician would phrase it on the phone. */
  prompt: string;
  /** Scripted response, conversational, 2-4 sentences. */
  response: string;
  /** Optional concrete proof to drop in if the doc pushes back further. */
  proofPoint?: string;
  /** Question to ask back to keep the conversation moving. */
  followUpAsk: string;
};

export const OBJECTIONS: Objection[] = [
  {
    id: "obj_audio_storage",
    category: "privacy",
    prompt: "Where does the audio go? Is it stored?",
    response:
      "Audio stays in Canadian data centres on AWS ca-central-1, never crosses the border. We retain it for 30 days for your own QA, then it is permanently deleted. Encrypted at rest, audited under PIPEDA, and the full compliance stack ships to your privacy lead before pilot.",
    proofPoint:
      "PIPEDA-aligned DPIA + ca-central-1 residency letter, both available pre-pilot.",
    followUpAsk:
      "Does your clinic have a privacy officer who needs to sign off, or is that something you handle yourself?",
  },
  {
    id: "obj_already_paying_emr",
    category: "cost",
    prompt: "I'm already paying for the EMR. Why do I need this on top?",
    response:
      "Your EMR is the system of record. Vero is the thing that gets you out of the chart at 6pm instead of 9pm. At $59.99 a month it pays for itself the first week you stop charting on weekends, and it writes back into the EMR you already pay for so the workflow stays one screen.",
    proofPoint: "$59.99 / month, flat. No per-encounter fees, no setup charge.",
    followUpAsk:
      "Roughly how many hours a week are you spending on charting after clinic closes?",
  },
  {
    id: "obj_i_dictate",
    category: "workflow",
    prompt: "I dictate. I don't need transcription.",
    response:
      "Dictation gets you the words. Vero gets you the SOAP note, the billing codes, and the patient instructions, all structured and dropped into the right fields. Most of the docs we onboard kept their dictation tool for letters and use Vero for visit notes, because the structure is what saves the time, not the transcription.",
    followUpAsk:
      "When you dictate, are you still going back in to format and code, or is someone else doing that for you?",
  },
  {
    id: "obj_meds_wrong",
    category: "accuracy",
    prompt: "What if it gets the meds wrong?",
    response:
      "Every note is a draft until you sign it. Meds, doses, and frequencies are flagged in the note for explicit review before you push to the EMR, and the audio is right there in the timeline if you want to verify what was said. Nothing writes back without your signature.",
    proofPoint:
      "Med fields are highlighted in the draft and require an explicit click to accept.",
    followUpAsk:
      "What is your current process for catching dictation errors? Vero would slot in there.",
  },
  {
    id: "obj_hallucinate",
    category: "trust",
    prompt: "I've seen these AI tools hallucinate. How do I know it won't?",
    response:
      "Vero only writes from the audio it heard. If the patient did not say it, it does not appear in the note, and we run a grounding check against the transcript before the draft renders. You can also upload your own clinic protocols and reference docs so the language matches how you already practice.",
    proofPoint:
      "Doc-upload feature lets you ground notes against your own protocols, not a generic LLM prior.",
    followUpAsk:
      "Want me to send a 5-minute Loom of the grounding step so you can see it before pilot?",
  },
  {
    id: "obj_already_on_competitor",
    category: "switching",
    prompt: "I'm already on Tali / Heidi / Suki. What's the migration look like?",
    response:
      "Migration is mostly a settings export. We ingest your custom templates, your macros, and your preferred note structure, and you run both tools side by side for a week so the comparison is yours, not ours. Most physicians make the call after 5 to 7 visits.",
    proofPoint:
      "Side-by-side pilot week is standard. No contract until after the comparison.",
    followUpAsk:
      "What is the one thing your current scribe does well that I should make sure Vero matches?",
  },
  {
    id: "obj_cpso_license",
    category: "privacy",
    prompt: "What about CPSO complaints? Is my license at risk if it makes a mistake?",
    response:
      "You sign the note, so you own the note. Vero is positioned as a drafting tool, same as a medical scribe, and the CPSO guidance on AI scribes from 2024 treats it that way. We provide audit logs of every edit and the original audio for 30 days so if a complaint ever lands, you have the evidence chain.",
    proofPoint:
      "Per-note audit log + 30-day audio retention, exportable on demand for College inquiries.",
    followUpAsk:
      "Have you reviewed CPSO's AI scribe guidance yet, or is that something you would want me to walk through?",
  },
  {
    id: "obj_specialty_template",
    category: "workflow",
    prompt:
      "My specialty templates won't be there. I do prenatal / palliative / mental health.",
    response:
      "Specialty templates are the most common ask, so we built a 9-day custom template SLA. You send us 3 to 5 of your existing notes, we tune the structure to match, and you have it live before pilot week ends. Prenatal, palliative, and mental health are all templates we have shipped before.",
    proofPoint:
      "9-day custom template SLA. We have prior templates for prenatal, palliative, MSK, and CBT-style mental health visits.",
    followUpAsk:
      "Could you send me a sample note (de-identified) so I can scope the template build for you this week?",
  },
];

/**
 * Default subset for compact mode (lead-detail page). Picked for breadth:
 * one objection per category-cluster, weighted toward the ones that come
 * up first in a discovery call.
 */
export const COMPACT_OBJECTION_IDS: string[] = [
  "obj_audio_storage",
  "obj_already_paying_emr",
  "obj_i_dictate",
  "obj_hallucinate",
  "obj_already_on_competitor",
];
