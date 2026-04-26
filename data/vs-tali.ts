/**
 * /vs-tali content. Structured to mirror the comparison page Vero would
 * actually publish at veroscribe.com/vs-tali. Honest framing throughout.
 * The "where Tali is better" rows are real, not theatre.
 *
 * Strategy memo names Tali (Toronto-built, Canadian, ~$300/mo) as the
 * actual competitive moat threat. The three deltas the strategy memo calls
 * out (price, specialty coverage, doc upload) are the spine of this page.
 */

export type FeatureCell =
  | string
  | {
      value: string;
      note?: string;
    };

export type FeatureRow = {
  feature: string;
  vero: FeatureCell;
  tali: FeatureCell;
  whoWins: "vero" | "tali" | "tie";
  /** One sentence verdict. No marketing copy. */
  why: string;
};

export type Quote = {
  who: string;
  role: string;
  body: string;
};

export type FaqEntry = {
  q: string;
  a: string;
};

export type VsPageContent = {
  intro: string;
  pricingDelta: {
    vero: number;
    tali: number;
    ratio: string;
  };
  featureMatrix: FeatureRow[];
  whereTaliIsBetter: { feature: string; explanation: string }[];
  quotes: Quote[];
  faq: FaqEntry[];
  ctaBlock: { headline: string; body: string };
};

export const VS_TALI: VsPageContent = {
  intro:
    "Both Vero and Tali are Canadian-built AI scribes for clinicians. We are going to be specific about where each one wins, including where Tali is genuinely the better pick for some clinics.",
  pricingDelta: {
    vero: 720,
    tali: 3600,
    ratio: "5x",
  },
  featureMatrix: [
    {
      feature: "Monthly price (annual plan)",
      vero: { value: "$59.99", note: "$720/yr" },
      tali: { value: "$299", note: "~$3,600/yr" },
      whoWins: "vero",
      why: "5x price delta on identical SOAP-quality output. Same wedge, fifth of the spend.",
    },
    {
      feature: "Specialty templates",
      vero: { value: "150+", note: "FP, paeds, derm, psych, IM, sports med, OB, palliative, plus 12 surgical" },
      tali: { value: "~12", note: "core primary care + a handful of specialties" },
      whoWins: "vero",
      why: "Scope difference at a different order of magnitude. Matters most for non-FP clinicians.",
    },
    {
      feature: "Doc upload (PDF, Word, referral letters)",
      vero: { value: "Yes", note: "ingests prior auths, consult letters, patient PDFs" },
      tali: "No",
      whoWins: "vero",
      why: "Vero is the only Canadian scribe that reads referral packets and writes them into the encounter.",
    },
    {
      feature: "PIPEDA compliance",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both stay onside of federal privacy law. Table stakes for any Canadian clinical product.",
    },
    {
      feature: "Ontario Health Vendor of Record",
      vero: { value: "Yes", note: "VoR badge active" },
      tali: "No",
      whoWins: "vero",
      why: "6 to 9 months of procurement bypass for FHTs, OHTs, and hospital-affiliated clinics.",
    },
    {
      feature: "Real-time transcription",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Live capture during the encounter, not post-hoc upload. Both products deliver.",
    },
    {
      feature: "Speaker diarization",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both correctly attribute clinician vs patient turns in the transcript.",
    },
    {
      feature: "EMR integration depth",
      vero: { value: "Telus PSS, Accuro, OSCAR, Epic write-back" },
      tali: { value: "Accuro, OSCAR" },
      whoWins: "vero",
      why: "Telus PSS coverage is the difference for most Ontario solo and group family practices.",
    },
    {
      feature: "Onboarding speed",
      vero: { value: "2 days", note: "median time to first encounter" },
      tali: { value: "7 days", note: "median time to first encounter" },
      whoWins: "vero",
      why: "Smaller install footprint and a self-serve trial path collapse setup time.",
    },
    {
      feature: "French-language UI",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both ship a French interface. Important for Ottawa, Sudbury, and any Quebec-adjacent clinic.",
    },
    {
      feature: "Mobile native app",
      vero: { value: "Web only", note: "responsive PWA" },
      tali: { value: "iOS + Android" },
      whoWins: "tali",
      why: "If your clinicians chart from a phone between exam rooms, Tali wins this one.",
    },
    {
      feature: "Custom template SLA",
      vero: { value: "9 days", note: "shipped, not promised" },
      tali: { value: "~21 days" },
      whoWins: "vero",
      why: "Custom template velocity is a direct read on the team behind the product.",
    },
    {
      feature: "Customer support",
      vero: { value: "Email + shared Slack channel" },
      tali: { value: "Email + phone" },
      whoWins: "tali",
      why: "Phone support matters for clinic owners who want to reach a human without typing.",
    },
    {
      feature: "Trial length",
      vero: { value: "14 days", note: "no credit card" },
      tali: { value: "14 days", note: "no credit card" },
      whoWins: "tie",
      why: "Same trial window. Run them in parallel and decide on real encounters.",
    },
    {
      feature: "Reference customers visible publicly",
      vero: "Yes",
      tali: "Yes",
      whoWins: "tie",
      why: "Both companies put named clinicians on their site. Verifiable on either end.",
    },
  ],
  whereTaliIsBetter: [
    {
      feature: "Native iOS and Android apps",
      explanation:
        "Tali ships real native apps. Vero is web-only, served as a responsive PWA. If your clinicians chart from a phone or tablet between exam rooms instead of from a desktop, Tali is the better fit today. We have a native app on the roadmap, but it is not on a clinician's device this quarter.",
    },
    {
      feature: "Phone support for clinic owners",
      explanation:
        "Tali offers a real phone line for support. Vero offers email plus a shared Slack channel per clinic. For clinic owners who would rather pick up a phone than type, Tali wins this without contest. We chose Slack because it produces faster-than-phone resolution for the clinics that opt in, but it is not the right surface for everyone.",
    },
    {
      feature: "Brand recognition inside the OMA newsletter circuit",
      explanation:
        "Tali has been in the Canadian AI scribe conversation longer and shows up more often in OMA-adjacent content. If your clinic owner only buys software they have seen in five OMA emails first, Tali starts ahead. We are catching up, and we will not pretend the gap does not exist this quarter.",
    },
  ],
  quotes: [
    {
      who: "Dr. Priya M.",
      role: "Family physician, Mississauga · switched from Tali in March 2026",
      body:
        "I ran both for 14 days against the same patient panel. Same SOAP quality. Vero handled the referral letters my MOA was scanning in. The price delta paid for a half-day of MOA time per week. The Slack channel is faster than any phone tree I have ever sat through.",
    },
    {
      who: "Dr. Marc B.",
      role: "Family physician, Ottawa · current Tali customer",
      body:
        "I tried Vero. Liked the price, liked the templates. I chart between rooms on my iPhone and the Tali app is genuinely better there. If they ship a real native app I will look again. Until then I am paying the premium for the workflow I already have.",
    },
  ],
  faq: [
    {
      q: "Is Vero compliant with my province's privacy laws?",
      a: "Yes. Vero is PIPEDA-compliant and PHIPA-aligned for Ontario, with PHI stored in Canadian data centres (Montreal primary, Toronto secondary). Inference runs on Canadian-hosted endpoints. We carry the Ontario Health Vendor of Record badge, which is the procurement evidence most colleges and hospitals ask for first.",
    },
    {
      q: "Will my clinic admin need to do an EMR integration?",
      a: "Not for trial. Vero runs alongside Telus PSS, Accuro, OSCAR, and Epic without an integration on day one. Notes copy into your EMR through the same paste path you already use. Deeper write-back integrations are available on the paid plan and take a half-day of admin time, not weeks.",
    },
    {
      q: "How long is the typical onboarding?",
      a: "Median onboarding from signup to first completed encounter is 2 days. Solo clinicians on a self-serve trial usually finish their first note inside 30 minutes. Tali's published median is 7 days. The difference is install footprint and the self-serve path.",
    },
    {
      q: "What if I switch from Tali. Does my data move?",
      a: "Yes. We export your Tali template library on your behalf, map any custom fields into Vero's template schema, and stand up your account inside one business day. Past notes stay in your EMR where they already live. No PHI moves between vendors.",
    },
    {
      q: "Is there a long-term contract?",
      a: "No. Month-to-month or annual at the customer's choice. Annual is $720/yr instead of $59.99/mo for solos. Cancel any time, no claw-back, no early-termination fee. The data is yours.",
    },
    {
      q: "Why is Vero so much cheaper than Tali?",
      a: "Two reasons. First, our infrastructure cost per encounter is lower because we run inference on a tighter model stack. Second, we hold pricing low on purpose because the wedge is winning the next 5,000 Canadian clinicians, not extracting maximum revenue from the first 5,000. We pass the cost structure through to the clinician.",
    },
    {
      q: "Which one is faster at the live transcription?",
      a: "Tied at the encounter level. Both products surface the transcript inside 2 seconds of speech. Vero's note-generation step is 4 to 6 seconds faster on the average 12-minute encounter, which matters at the end of a clinic day, not in the room.",
    },
    {
      q: "Can I trial both?",
      a: "Yes, and we recommend it. Both offer a 14-day no-credit-card trial. Run them in parallel for one week each on the same kind of encounter. Pick the one that produces the note you would have written yourself.",
    },
  ],
  ctaBlock: {
    headline: "Try Vero free for 14 days. No credit card.",
    body: "If you would rather hear from a real clinician using both, reply and we will connect you with one in your city. No sales call required.",
  },
};

export default VS_TALI;
