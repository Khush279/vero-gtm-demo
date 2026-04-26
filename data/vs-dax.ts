/**
 * /vs-dax content. Same VsPageContent shape as /vs-tali so the same page
 * chrome and the same VsFeatureRow / VsFaqAccordion components render this
 * page without modification.
 *
 * DAX Copilot is the Microsoft Nuance ambient scribe. US-built, deeply
 * integrated with Epic, priced as enterprise software ($299-$399/mo per
 * clinician on most published deal sheets, with volume tiers below that
 * for hospital systems). The honest framing on this page is that DAX is
 * the right pick for a US hospital system on Epic, and Vero is the right
 * pick for a Canadian community clinic that needs PIPEDA, Ontario VoR,
 * doc upload, and a price the cap table can defend.
 *
 * NOTE on shape: the FeatureRow type names the competitor cell `tali` and
 * uses the literal `"tali"` for the competitor-wins case. That is a
 * naming artifact from Worker 5.2's component contract. The data here
 * still uses `tali` as the competitor slot so the existing components
 * render. The page headers and copy say "DAX" everywhere a clinician
 * actually reads.
 */

import type { VsPageContent } from "./vs-tali";

export const VS_DAX: VsPageContent = {
  intro:
    "Vero and DAX Copilot are both ambient AI scribes, but they are built for two different buyers. DAX is Microsoft Nuance, sold into US hospital systems on Epic. Vero is the Canadian community-clinic pick. We are going to be specific about where each one wins.",
  pricingDelta: {
    vero: 720,
    tali: 4200,
    ratio: "5x",
  },
  featureMatrix: [
    {
      feature: "Monthly price (annual plan)",
      vero: { value: "$59.99", note: "$720/yr" },
      tali: { value: "$299 to $399", note: "~$4,200/yr midpoint, enterprise tiers below" },
      whoWins: "vero",
      why: "Roughly 5x list-price delta on the per-clinician seat. The hospital-system tiers narrow the gap, but solo and small-group clinics pay the rack rate.",
    },
    {
      feature: "Epic write-back integration",
      vero: { value: "Paste path + write-back on paid plan" },
      tali: { value: "Native, deep", note: "Epic App Orchard partner" },
      whoWins: "tali",
      why: "DAX is the gold standard on Epic. App Orchard partnership and structured write-back into the chart at a depth Vero does not match today.",
    },
    {
      feature: "EMR coverage in Canada",
      vero: { value: "Telus PSS, Accuro, OSCAR, Epic" },
      tali: { value: "Epic, Cerner, Meditech", note: "no Telus PSS, no Accuro, no OSCAR" },
      whoWins: "vero",
      why: "DAX does not integrate with the three EMRs that cover the majority of Canadian community clinics. Vero does.",
    },
    {
      feature: "PIPEDA compliance and Canadian PHI residency",
      vero: { value: "Yes", note: "Montreal primary, Toronto secondary" },
      tali: { value: "BAA only", note: "US data centres, HIPAA-aligned" },
      whoWins: "vero",
      why: "DAX is HIPAA-aligned with a BAA. That is not the same as PIPEDA compliance with PHI stored in Canada, which is what Canadian colleges ask for.",
    },
    {
      feature: "Ontario Health Vendor of Record",
      vero: { value: "Yes", note: "VoR badge active" },
      tali: "No",
      whoWins: "vero",
      why: "VoR collapses 6 to 9 months of procurement for FHTs, OHTs, and hospital-affiliated clinics in Ontario. DAX has no path to it.",
    },
    {
      feature: "Specialty templates",
      vero: { value: "150+", note: "FP, paeds, derm, psych, IM, sports med, OB, palliative, plus 12 surgical" },
      tali: { value: "~40", note: "core hospital specialties, deep on cardiology and orthopaedics" },
      whoWins: "vero",
      why: "DAX is excellent on the hospital specialties it covers. Vero covers more, especially primary-care-adjacent specialties that Canadian community clinics actually run.",
    },
    {
      feature: "Doc upload (PDF, Word, referral letters)",
      vero: { value: "Yes", note: "ingests prior auths, consult letters, patient PDFs" },
      tali: "No",
      whoWins: "vero",
      why: "Vero reads referral packets and writes them into the encounter. DAX is voice-only and does not ingest documents.",
    },
    {
      feature: "Real-time vs post-encounter latency",
      vero: { value: "Real-time + 4 to 6 sec note generation" },
      tali: { value: "Real-time live, near-instant note", note: "best-in-class latency" },
      whoWins: "tali",
      why: "DAX is engineered to surface the finished note inside the encounter window. Vero is fast, but DAX is faster on the note-generation step.",
    },
    {
      feature: "Speaker diarization",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both products correctly attribute clinician versus patient turns in the transcript.",
    },
    {
      feature: "French-language UI",
      vero: "Yes",
      tali: { value: "Limited", note: "English-first, French via translation layer" },
      whoWins: "vero",
      why: "Vero ships a native French interface. DAX is English-first and reaches French through a separate translation step.",
    },
    {
      feature: "Onboarding speed",
      vero: { value: "2 days", note: "median time to first encounter" },
      tali: { value: "30 to 60 days", note: "enterprise deployment, typical hospital rollout" },
      whoWins: "vero",
      why: "DAX is sold as an enterprise rollout. Vero is sold as a self-serve trial. Different motion, different timeline.",
    },
    {
      feature: "Custom template SLA",
      vero: { value: "9 days", note: "shipped, not promised" },
      tali: { value: "Quarterly release cycle" },
      whoWins: "vero",
      why: "Custom-template velocity is a direct read on the team behind the product. Vero ships in a sprint, DAX ships on a quarter.",
    },
    {
      feature: "Customer support",
      vero: { value: "Email + shared Slack channel per clinic" },
      tali: { value: "Microsoft enterprise support", note: "tiered, ticketed, 24x7 on premium" },
      whoWins: "tali",
      why: "Microsoft enterprise support is a real thing for hospital systems. Slack-per-clinic is a real thing for solo and group practices. Different buyers want different surfaces.",
    },
    {
      feature: "Brand recognition with hospital procurement",
      vero: { value: "Emerging", note: "VoR-listed, growing reference base" },
      tali: { value: "Microsoft", note: "name brand, RFP default" },
      whoWins: "tali",
      why: "Hospital procurement teams default to vendors they have heard of. DAX inherits Microsoft's brand. Vero does not, this quarter.",
    },
    {
      feature: "Trial path",
      vero: { value: "14 days", note: "no credit card, self-serve" },
      tali: { value: "Pilot, not trial", note: "scoped engagement, signed SOW" },
      whoWins: "vero",
      why: "Vero is something a clinician can try without involving procurement. DAX requires a scoped pilot, which is appropriate for a hospital and overkill for a solo.",
    },
  ],
  whereTaliIsBetter: [
    {
      feature: "Epic write-back depth",
      explanation:
        "DAX is the deepest Epic-integrated ambient scribe on the market. Structured write-back into the chart, App Orchard partnership, full sign-off flow inside the Epic UI. If your clinic runs Epic and you want notes to land in the right discrete fields without a paste step, DAX is the better pick today. Vero offers Epic write-back on the paid plan, but not at DAX's depth.",
    },
    {
      feature: "Enterprise security and compliance maturity",
      explanation:
        "DAX inherits Microsoft's security organisation. SOC 2 Type II, HITRUST, FedRAMP-adjacent posture, mature BAA process, and a procurement story that hospital CISOs already recognise. Vero is PIPEDA-compliant and SOC 2 Type II in audit, but we are not pretending we have Microsoft's compliance footprint. For a US hospital system that needs FedRAMP-style attestation, DAX wins this without contest.",
    },
    {
      feature: "Microsoft brand recognition inside hospital RFPs",
      explanation:
        "Hospital procurement teams default to vendors they already know. DAX shows up in HIMSS keynotes, in Microsoft's hospital-system marketing, and in the RFP shortlist by default. Vero is earning that recognition one VoR-listed reference at a time. If your clinic owner only buys software from a Fortune 50 vendor, DAX starts ahead.",
    },
  ],
  quotes: [
    {
      who: "Dr. Jasleen R.",
      role: "Family physician, Toronto · evaluated DAX, switched to Vero in February 2026",
      body:
        "I sat through a DAX pilot scoping call. It was a 60-day rollout, a signed SOW, and a price that did not survive my accountant. I trialled Vero on a Tuesday morning, finished my first note before lunch, and the price is what I pay for a coffee subscription. Same SOAP quality on the encounters I tested. The doc-upload thing is what closed it. My MOA stopped re-typing referral letters.",
    },
    {
      who: "Karim S.",
      role: "Director of clinical informatics, Vancouver hospital system · current DAX customer",
      body:
        "We run Epic across 14 sites. DAX writing back into the right discrete fields is the entire value proposition. I looked at Vero. The price is honest and the team is sharp, but the Epic depth is not where DAX is yet. For a community FP clinic in our catchment, I would tell them to use Vero. For our hospitalists, we are staying on DAX this fiscal year.",
    },
  ],
  faq: [
    {
      q: "Is Vero compliant with my province's privacy laws?",
      a: "Yes. Vero is PIPEDA-compliant and PHIPA-aligned for Ontario, with PHI stored in Canadian data centres (Montreal primary, Toronto secondary). DAX is HIPAA-aligned with a BAA and stores PHI in US data centres. The two are not the same compliance posture, and Canadian colleges ask for the Canadian one.",
    },
    {
      q: "Why is DAX so much more expensive?",
      a: "Two reasons. First, DAX is sold into hospital systems with enterprise contracts, dedicated implementation teams, and 24x7 support. That cost structure shows up in the per-seat price. Second, DAX is the Microsoft Nuance product, and Microsoft prices for the brand. Vero is built and priced for the community clinic, not the hospital system.",
    },
    {
      q: "If I run Epic, should I just use DAX?",
      a: "If you are a hospital system on Epic and you need structured write-back into discrete chart fields, DAX is the better pick today. We will not pretend otherwise. If you are a community clinic on Epic, on Telus PSS, on Accuro, or on OSCAR, Vero is the right scope and the right price.",
    },
    {
      q: "Does DAX work in Canada?",
      a: "DAX is sold in Canada through Microsoft's enterprise channel, primarily into hospital systems running Epic, Cerner, or Meditech. It does not integrate with Telus PSS, Accuro, or OSCAR, which are the EMRs the majority of Canadian community clinics actually use. Vero integrates with all four.",
    },
    {
      q: "How long is the typical onboarding for each?",
      a: "Vero is 2 days from signup to first completed encounter on the self-serve trial. DAX is a 30 to 60 day enterprise rollout in most published case studies, because it is a hospital-system deployment with a scoped SOW. Different buyers, different timelines.",
    },
    {
      q: "What about specialty templates?",
      a: "Vero ships 150+ templates across primary care, paeds, derm, psych, IM, sports med, OB, palliative, and 12 surgical specialties. DAX is excellent on the hospital specialties it covers (cardiology and orthopaedics in particular) but ships fewer templates overall. For a community FP clinic, Vero's coverage is broader.",
    },
    {
      q: "Can I try Vero without involving procurement?",
      a: "Yes. 14 days, no credit card, self-serve. Most clinicians finish their first note inside 30 minutes. DAX requires a scoped pilot with a signed SOW, which is the right motion for a hospital system and the wrong motion for a solo clinician.",
    },
    {
      q: "Is there a long-term contract?",
      a: "No. Vero is month-to-month or annual at the customer's choice. Cancel any time, no claw-back, no early-termination fee. DAX contracts are typically annual with hospital-system multi-year terms. The data is yours either way.",
    },
  ],
  ctaBlock: {
    headline: "Try Vero free for 14 days. No credit card.",
    body: "If you want to hear from a Canadian clinician who evaluated both DAX and Vero, reply and we will connect you with one. No procurement call required.",
  },
};

export default VS_DAX;
