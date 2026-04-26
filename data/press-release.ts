/**
 * Mock launch press release for /press-release.
 *
 * The conceit: this is what Vero would send when the founding GTM engineer
 * hire closes. It's the meta-move from the candidate's side, written as if
 * the announcement is already real. Headline puts Khush's name in the lede;
 * body and quotes are em-dash-free, no AI tells, no "thrilled."
 *
 * Numbers are anchored to /data/strategy.md so a founder reading both
 * surfaces sees the same positioning twice.
 */

export type Quote = { who: string; role: string; body: string };

export type PressRelease = {
  headline: string;
  subhead: string;
  /** "Toronto, ON · April 28, 2026" */
  dateline: string;
  /** ~6 paragraphs. */
  body: string[];
  /** 3 quotes: Adeel, Bill, Khush. */
  quotes: Quote[];
  /** "About Vero" boilerplate, ~3 sentences. */
  about: string;
  contact: { name: string; email: string };
  factsAtAGlance: { label: string; value: string }[];
};

export const PRESS_RELEASE: PressRelease = {
  headline:
    "Vero hires founding GTM Engineer to scale Canadian AI scribe across primary care",
  subhead:
    "Toronto-based Vero brings on Khush Agarwala to take its AI medical scribe from 5,000 paying providers to 25,000 over the next 18 months, with Ontario family medicine as the wedge.",
  dateline: "Toronto, ON · April 28, 2026",
  body: [
    // 1. Lede
    "Vero, the Canadian AI medical scribe used by 5,000+ clinicians across North America, today announced that Khush Agarwala has joined the company as founding GTM engineer. Agarwala, a Toronto-based growth and automation builder, will own the systems and content motion that get Vero in front of the next 20,000 primary care providers in Canada and the US. He starts immediately.",

    // 2. Why now
    "The hire lands in the middle of a Canadian primary care supply crunch that has put 6.5 million Ontarians on a waitlist for a family doctor. Provincial regulators, the OMA, and rostered patients are all pushing family physicians to take on more volume, with after-clinic charting eating two hours of every workday. Vero solves the charting load at $59.99 per month, roughly a fifth of the price of the US incumbents. The product fit is settled. The next constraint is reach: most of the 14,200 family physicians in Ontario alone have never typed 'AI medical scribe' into a search bar, which means inbound and content cannot carry the next leg of growth on their own. Outbound, built like software, can.",

    // 3. What changes
    "Agarwala's mandate spans three lanes. First, an outbound engine sourced from the CPSO public register, segmented by EMR cohort and clinic size, sequenced with EMR-aware first lines and reply-classifier routing. Second, a content motion expansion that takes Vero from 14 page-1 Canadian queries to ownership of every comparison query in the category, starting with Vero vs Tali. Third, an enterprise lane that turns the Ontario Health Vendor of Record badge into closed contracts with FHTs, OHTs, and hospital-affiliated clinics that no US competitor can credibly bid against.",

    // 4. Founder context
    "Vero was founded in 2024 by Adeel Khan, a practicing physician, and Bill Yu, the company's CTO. In two years they have shipped 150+ specialty templates, secured Ontario Health VoR status (a 6-to-9-month procurement head-start over every US competitor), and built a product that ranks page-1 on 14 of the 20 highest-intent Canadian scribe queries. The company is profitable, growing, and Canadian-built end-to-end on PIPEDA-compliant infrastructure.",

    // 5. The 90-day plan
    "Inside the first 90 days, Agarwala will stand up sequenced outbound to 4,000 verified Ontario family physicians at a Day 1, 4, 9, 16 cadence, ship five SEO comparison pages anchored on the Vero vs Tali price and specialty deltas, and submit Vero into active procurement with three hospital systems via a one-page RFP-response generator built on the company's existing security documentation. The plan targets $200k in new monthly recurring revenue through the GTM engine by Day 90, with hire #2 scoped and onboarded before the quarter closes.",

    // 6. Closing
    "Vero is hiring across engineering, clinical, and growth as it scales from 5,000 to 25,000 providers. Open roles and the company's strategy memo are available at veroscribe.com/careers. The next product update, including doc-upload-into-EMR for Telus PSS and OSCAR, ships in May.",
  ],
  quotes: [
    {
      who: "Adeel Khan, MD",
      role: "Co-founder and CEO, Vero",
      body: "I see what burnout is doing to my colleagues every week I'm in clinic. We built Vero to give that time back, and we have proof now that it works at scale. Bringing Khush on means the next 20,000 clinicians who need this product are going to hear about it on a timeline that matches the urgency of the problem, not the comfort of a sales-floor build.",
    },
    {
      who: "Bill Yu",
      role: "Co-founder and CTO, Vero",
      body: "The reason this hire matters for engineering is that Khush thinks about GTM the way we think about product. Lead scoring as a pure function. Reply classification as a model in production with a feedback loop. Sequence cadence as code we can ship and revert. He unlocks an entire surface of the company we have been wanting to build with the same rigor as the scribe itself.",
    },
    {
      who: "Khush Agarwala",
      role: "Founding GTM Engineer, Vero",
      body: "Six and a half million Ontarians don't have a family doctor, and the ones who do are charting until 9pm. Vero is already the cheapest, fastest, most Canadian answer to that problem. The job is to make sure every clinician who could use it knows it exists, and to do that without burning brand or unit economics. That's a real problem, with a finite TAM, in a market I want to live in. So I'm here.",
    },
  ],
  about:
    "Vero is the Canadian AI medical scribe trusted by 5,000+ clinicians across North America. The product is HIPAA and PIPEDA compliant, holds Ontario Health Vendor of Record status, and ships 150+ specialty templates at $59.99 per month on annual or $89 per month on monthly. Vero is based in Toronto and was founded in 2024 by Adeel Khan, MD and Bill Yu.",
  contact: {
    name: "Khush Agarwala, Founding GTM Engineer",
    email: "press@veroscribe.com",
  },
  factsAtAGlance: [
    { label: "Pricing", value: "$59.99/mo (annual) or $89/mo" },
    { label: "Providers served", value: "5,000+ across North America" },
    { label: "Compliance", value: "HIPAA + PIPEDA + Ontario Health VoR" },
    { label: "Specialty templates", value: "150+" },
    { label: "Founded", value: "2024 by Adeel Khan, MD and Bill Yu" },
  ],
};
