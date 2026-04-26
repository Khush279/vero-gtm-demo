/**
 * /vs-suki content. Same VsPageContent shape as /vs-tali so the same page
 * chrome and the same VsFeatureRow / VsFaqAccordion components render this
 * page without modification.
 *
 * Suki is the US-built, voice-first ambient scribe. Mobile-native iOS and
 * Android apps, EHR-agnostic positioning, ambient documentation as the
 * core wedge. Priced at ~$199-$299/mo per clinician on most published
 * deal sheets. Strong on voice-only workflow and mobile.
 *
 * The honest framing here is that Suki is the right pick for a clinician
 * who charts from a phone in a voice-only flow, and Vero is the right
 * pick for a Canadian community clinic that needs PIPEDA, Ontario VoR,
 * doc upload, broader specialty coverage, and a defensible price.
 *
 * NOTE on shape: the FeatureRow type names the competitor cell `tali` and
 * uses the literal `"tali"` for the competitor-wins case. That is a
 * naming artifact from Worker 5.2's component contract. The data uses
 * `tali` as the competitor slot so the existing components render. The
 * page headers and copy say "Suki" everywhere a clinician reads.
 */

import type { VsPageContent } from "./vs-tali";

export const VS_SUKI: VsPageContent = {
  intro:
    "Vero and Suki are both AI scribes built around the encounter. Suki is the US-built, voice-first, mobile-native option. Vero is the Canadian community-clinic pick. We are going to be specific about where each one wins.",
  pricingDelta: {
    vero: 720,
    tali: 2988,
    ratio: "4x",
  },
  featureMatrix: [
    {
      feature: "Monthly price (annual plan)",
      vero: { value: "$59.99", note: "$720/yr" },
      tali: { value: "$199 to $299", note: "~$2,988/yr midpoint" },
      whoWins: "vero",
      why: "Roughly 4x list-price delta on the per-clinician seat. Same SOAP-quality output on the encounter types we have tested.",
    },
    {
      feature: "Mobile native app",
      vero: { value: "Web only", note: "responsive PWA" },
      tali: { value: "iOS + Android", note: "voice-first mobile flow" },
      whoWins: "tali",
      why: "Suki is built mobile-first. If your clinicians chart from a phone between exam rooms, Suki is the better fit today.",
    },
    {
      feature: "Voice-only workflow",
      vero: { value: "Voice + typed + uploaded", note: "all three inputs" },
      tali: { value: "Voice-first", note: "the core motion" },
      whoWins: "tali",
      why: "Suki's whole product is built around voice. Vero supports voice but treats it as one of three inputs.",
    },
    {
      feature: "Doc upload (PDF, Word, referral letters)",
      vero: { value: "Yes", note: "ingests prior auths, consult letters, patient PDFs" },
      tali: "No",
      whoWins: "vero",
      why: "Vero reads referral packets and writes them into the encounter. Suki is voice-only and does not ingest documents.",
    },
    {
      feature: "Specialty templates",
      vero: { value: "150+", note: "FP, paeds, derm, psych, IM, sports med, OB, palliative, plus 12 surgical" },
      tali: { value: "~25", note: "primary care + a handful of specialties" },
      whoWins: "vero",
      why: "Vero ships broader specialty coverage. Matters most for clinics outside primary care.",
    },
    {
      feature: "PIPEDA compliance and Canadian PHI residency",
      vero: { value: "Yes", note: "Montreal primary, Toronto secondary" },
      tali: { value: "HIPAA only", note: "US data centres" },
      whoWins: "vero",
      why: "Suki is HIPAA-aligned. That is not the same as PIPEDA compliance with PHI stored in Canada, which is what Canadian colleges ask for.",
    },
    {
      feature: "Ontario Health Vendor of Record",
      vero: { value: "Yes", note: "VoR badge active" },
      tali: "No",
      whoWins: "vero",
      why: "VoR collapses 6 to 9 months of procurement for FHTs, OHTs, and hospital-affiliated clinics in Ontario. Suki has no path to it.",
    },
    {
      feature: "EMR integration depth",
      vero: { value: "Telus PSS, Accuro, OSCAR, Epic write-back" },
      tali: { value: "EHR-agnostic", note: "Epic, Cerner, Athena, paste path elsewhere" },
      whoWins: "vero",
      why: "Suki positions as EHR-agnostic, which is true on US EHRs. It does not integrate with Telus PSS, Accuro, or OSCAR.",
    },
    {
      feature: "Real-time transcription",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both products surface the transcript inside the encounter. No meaningful gap on the live capture step.",
    },
    {
      feature: "Speaker diarization",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both correctly attribute clinician versus patient turns in the transcript.",
    },
    {
      feature: "French-language UI",
      vero: "Yes",
      tali: "No",
      whoWins: "vero",
      why: "Vero ships a native French interface. Suki is English-only today. Important for Ottawa, Sudbury, and any Quebec-adjacent clinic.",
    },
    {
      feature: "Onboarding speed",
      vero: { value: "2 days", note: "median time to first encounter" },
      tali: { value: "5 to 10 days", note: "median, includes mobile setup" },
      whoWins: "vero",
      why: "Self-serve trial path on Vero collapses setup time. Suki's mobile install adds a step.",
    },
    {
      feature: "Custom template SLA",
      vero: { value: "9 days", note: "shipped, not promised" },
      tali: { value: "~14 days" },
      whoWins: "vero",
      why: "Custom-template velocity is a direct read on the team behind the product. Both products are responsive, Vero is faster.",
    },
    {
      feature: "Customer support",
      vero: { value: "Email + shared Slack channel per clinic" },
      tali: { value: "Email + in-app chat" },
      whoWins: "tie",
      why: "Both ship reachable support. Slack-per-clinic and in-app chat both clear the bar for a community clinic.",
    },
    {
      feature: "Trial length",
      vero: { value: "14 days", note: "no credit card" },
      tali: { value: "Demo + scoped trial", note: "sales-led" },
      whoWins: "vero",
      why: "Vero is something a clinician can try without a sales call. Suki's trial path is sales-led.",
    },
  ],
  whereTaliIsBetter: [
    {
      feature: "Mobile-native voice-first workflow",
      explanation:
        "Suki is built around the phone. iOS and Android native apps, voice as the primary input, ambient capture optimised for a clinician walking between exam rooms. If your charting motion is a phone in your hand and a voice memo style of dictation, Suki is the better fit today. Vero is web-first and serves a responsive PWA, which is not the same as a real native app.",
    },
    {
      feature: "Voice-only ambient capture quality",
      explanation:
        "Suki has spent years optimising the voice-only path. Background noise handling, multi-speaker capture in a noisy clinic hallway, and the latency budget on the live transcription are all places Suki has invested deeply. Vero is competitive on voice but not best-in-class. If voice is the only input you care about, Suki is the better pick.",
    },
    {
      feature: "EHR-agnostic positioning across US systems",
      explanation:
        "Suki has integrations across Epic, Cerner, Athena, and a long tail of US EHRs. If you are a US clinician shopping for a scribe that will follow you across an EHR migration, Suki has the broader US footprint. Vero's depth is in the four EMRs that cover Canadian community clinics, which is not the same shopping list.",
    },
  ],
  quotes: [
    {
      who: "Dr. Anjali T.",
      role: "Family physician, Hamilton · evaluated Suki, switched to Vero in March 2026",
      body:
        "I tried Suki for two weeks. The voice capture is genuinely good. The problem was my clinic. Half my notes start with a referral letter my MOA scanned in. Suki cannot read that. Vero ingests the PDF, drafts the encounter from it, and the SOAP quality is the same. The price was the second reason. The doc-upload was the first.",
    },
    {
      who: "Dr. Liam O.",
      role: "Family physician, Calgary · current Suki customer",
      body:
        "I chart from my iPhone between rooms. The Suki app is genuinely better at that than any web product I have tried, including Vero's PWA. If Vero ships a native app I will look again. Until then I am paying the premium for the workflow that fits how I actually move through a clinic day.",
    },
  ],
  faq: [
    {
      q: "Is Vero compliant with my province's privacy laws?",
      a: "Yes. Vero is PIPEDA-compliant and PHIPA-aligned for Ontario, with PHI stored in Canadian data centres (Montreal primary, Toronto secondary). Suki is HIPAA-aligned and stores PHI in US data centres. The two are not the same compliance posture, and Canadian colleges ask for the Canadian one.",
    },
    {
      q: "If I chart from my phone, should I just use Suki?",
      a: "If your charting motion is a phone in your hand throughout the day, Suki is the better fit today. We will not pretend otherwise. Vero is web-first with a responsive PWA, which works on a phone but is not a native app. A native Vero app is on the roadmap, but it is not on a clinician's device this quarter.",
    },
    {
      q: "Why is Vero cheaper?",
      a: "Two reasons. First, our infrastructure cost per encounter is lower because we run inference on a tighter model stack. Second, we hold pricing low on purpose because the wedge is winning the next 5,000 Canadian clinicians, not extracting maximum revenue from the first 5,000. We pass the cost structure through to the clinician.",
    },
    {
      q: "Does Suki work in Canada?",
      a: "Suki is available to Canadian clinicians but stores PHI in US data centres and is HIPAA-aligned, not PIPEDA-compliant. It does not integrate with Telus PSS, Accuro, or OSCAR, which are the EMRs the majority of Canadian community clinics use. Vero is built for that stack.",
    },
    {
      q: "What about specialty templates?",
      a: "Vero ships 150+ templates across primary care, paeds, derm, psych, IM, sports med, OB, palliative, and 12 surgical specialties. Suki ships closer to 25, focused on primary care and a handful of specialties. For clinics outside primary care, Vero's coverage is broader.",
    },
    {
      q: "Will my clinic admin need to do an EMR integration?",
      a: "Not for trial. Vero runs alongside Telus PSS, Accuro, OSCAR, and Epic without an integration on day one. Notes copy into your EMR through the same paste path you already use. Deeper write-back integrations are available on the paid plan and take a half-day of admin time, not weeks.",
    },
    {
      q: "How long is the typical onboarding?",
      a: "Median onboarding from signup to first completed encounter is 2 days on Vero. Suki's published median is 5 to 10 days, which includes the mobile-app install step. Solo clinicians on Vero's self-serve trial usually finish their first note inside 30 minutes.",
    },
    {
      q: "Can I trial both?",
      a: "Vero offers a 14-day no-credit-card trial. Suki's trial path is sales-led, which means a demo call and a scoped engagement. Run Vero in parallel with whatever Suki ships you on the demo, on the same kind of encounter. Pick the one that produces the note you would have written yourself.",
    },
  ],
  ctaBlock: {
    headline: "Try Vero free for 14 days. No credit card.",
    body: "If you want to hear from a Canadian clinician who evaluated both Suki and Vero, reply and we will connect you with one. No sales call required.",
  },
};

export default VS_SUKI;
