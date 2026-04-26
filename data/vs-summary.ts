/**
 * /vs-summary content. The single-screen verdict page that synthesizes
 * /vs-tali, /vs-dax, and /vs-suki into one URL a procurement contact can
 * paste into Slack and have the answer to "where does Vero fit?" inside
 * 30 seconds.
 *
 * Source of truth on every claim is the deeper VsPageContent file for the
 * named competitor. This file is the editorial summary, not new data.
 */

export type CompetitorVerdict = {
  id: "tali" | "dax" | "suki";
  label: string;
  positioning: string;
  whenToPickThem: string;
  whenVeroWins: string;
  monthlyPrice: string;
  veroDelta: string;
  detailHref: string;
};

export type VsSummary = {
  intro: string;
  competitors: CompetitorVerdict[];
  oneVerdict: string;
  buyersGuide: { question: string; answer: string }[];
};

export const SUMMARY: VsSummary = {
  intro:
    "Three competitors, three different buyers. This page collapses the deep comparison pages into one scannable verdict you can send to procurement before the 9am stand-up.",
  competitors: [
    {
      id: "tali",
      label: "Tali AI",
      positioning:
        "Toronto-built Canadian AI scribe, established in the OMA-adjacent conversation, mobile-native with phone support.",
      whenToPickThem:
        "Pick Tali when your clinicians chart from a phone between exam rooms or when your clinic owner only buys software with a phone-line support contract.",
      whenVeroWins:
        "Vero wins on price (5x delta), specialty template breadth (150+ vs ~12), doc upload, Telus PSS coverage, and Ontario VoR.",
      monthlyPrice: "$299/mo",
      veroDelta: "5x cheaper, 12x more templates",
      detailHref: "/vs-tali",
    },
    {
      id: "dax",
      label: "DAX Copilot",
      positioning:
        "Microsoft Nuance ambient scribe sold into US hospital systems on Epic, with deep App Orchard write-back and enterprise security posture.",
      whenToPickThem:
        "Pick DAX if you are a US hospital system on Epic that needs structured write-back into discrete chart fields and a Microsoft enterprise contract.",
      whenVeroWins:
        "Vero wins for any Canadian community clinic. PIPEDA with Canadian PHI residency, Ontario VoR, Telus PSS and OSCAR coverage, doc upload, and a self-serve trial without an SOW.",
      monthlyPrice: "$299 to $399/mo",
      veroDelta: "5x cheaper, built for Canada",
      detailHref: "/vs-dax",
    },
    {
      id: "suki",
      label: "Suki",
      positioning:
        "US-built voice-first ambient scribe with native iOS and Android apps, optimised for clinicians who chart from a phone.",
      whenToPickThem:
        "Pick Suki if your charting motion is voice-only on a phone throughout the day and a native mobile app is the deciding factor.",
      whenVeroWins:
        "Vero wins on price (4x delta), doc upload, specialty breadth, French UI, PIPEDA with Canadian PHI residency, and Ontario VoR.",
      monthlyPrice: "$199 to $299/mo",
      veroDelta: "4x cheaper, reads referral letters",
      detailHref: "/vs-suki",
    },
  ],
  oneVerdict:
    "Vero is the right pick for the Canadian community clinic that needs PIPEDA with PHI in Canada, Ontario Vendor of Record, Telus PSS or OSCAR coverage, doc upload that reads referral letters, and a defensible price the cap table will not flinch at. DAX is the right pick for a US hospital system on Epic that needs structured write-back and Microsoft enterprise compliance. Tali wins for clinicians who chart from a phone today, and Suki wins for voice-first mobile workflows, but neither covers the Canadian community-clinic stack the way Vero does.",
  buyersGuide: [
    {
      question: "Are you a US hospital on Epic that needs structured write-back?",
      answer:
        "Pick DAX. Microsoft Nuance is the gold standard for Epic App Orchard depth and FedRAMP-adjacent compliance. Vero is honest about not matching that depth this quarter.",
    },
    {
      question: "Do your clinicians chart from a phone all day, voice-only?",
      answer:
        "Pick Suki for voice-first US clinicians, or Tali for Canadian clinicians who want a native mobile app today. Vero is web-first with a responsive PWA. A native app is on the roadmap, not on a clinician's device this quarter.",
    },
    {
      question: "Are you a Canadian community clinic on Telus PSS, Accuro, or OSCAR?",
      answer:
        "Pick Vero. None of DAX, Suki, or Tali (in Tali's case, Telus PSS) cover this stack at the same depth. Add doc upload, Ontario VoR, and 150+ specialty templates and the choice writes itself.",
    },
    {
      question: "Does your clinic process referral letters, prior auths, or scanned PDFs?",
      answer:
        "Pick Vero. Vero is the only product on this comparison that ingests documents and writes them into the encounter. Tali, DAX, and Suki are voice-only on the input side.",
    },
    {
      question: "Is your buyer the clinician or a hospital procurement office?",
      answer:
        "Clinician buyer: Vero (self-serve 14-day trial, no credit card, $59.99/mo). Hospital procurement office on Epic: DAX. Hospital procurement office in Ontario looking for a VoR-listed scribe with PIPEDA in Canada: Vero.",
    },
  ],
};

export default SUMMARY;
