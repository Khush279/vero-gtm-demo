/**
 * The 15 questions Adeel and Bill are most likely to ask during the interview,
 * each structured for delivery in real time. Not a script to read; a framework
 * to answer from. Categories match the rough flow of a founder-led interview:
 * fit, strategy, execution, concerns, compensation.
 *
 * Surfaced on /interview-prep. Pure data, no runtime work.
 */

export type InterviewQuestion = {
  id: string;
  category: "fit" | "strategy" | "execution" | "compensation" | "concerns";
  asker: "adeel" | "bill" | "either";
  /** The question phrased the way they would ask it. */
  question: string;
  /** One sentence on how to structure the answer. */
  framework: string;
  /** 3-5 bullets, the actual content. Specific, with numbers and references. */
  keyPoints: string[];
  /** Which surface in this demo backs the answer. */
  evidenceFromDemo: string;
  /** What they will likely ask next. */
  potentialFollowUp: string;
  /** Common mistake to NOT make. */
  redFlagToAvoid: string;
};

export const QUESTIONS: InterviewQuestion[] = [
  {
    id: "q01-why-vero",
    category: "fit",
    asker: "either",
    question: "Why Vero?",
    framework:
      "Anchor on a thesis (Canada-first wins this category), then show why Vero specifically is the company executing it.",
    keyPoints: [
      "The Ontario Health VoR badge is a 6-to-9-month procurement bypass no US scribe has, and the moat compounds the more it gets used.",
      "Content motion is already healthy: page-1 rankings on 14 of 20 highest-intent Canadian queries. That is the hardest part of GTM and it is solved.",
      "Pricing at $59.99 to $89 sits 70% under Suki, DAX, and Abridge, which makes the wedge customer (the solo Ontario FP) buyable today, not in two years.",
      "5,000+ paying providers means the constraint is no longer 'do clinicians want this.' It is 'how fast can the next 5,000 find out it exists.' That is the work I want to do.",
      "Personal: I live in Toronto, the buyer is my neighbour, and the policy tailwind around 6.5M Ontarians without a family doctor is a once-per-decade tailwind I want to ride.",
    ],
    evidenceFromDemo: "/strategy and /vs-tali",
    potentialFollowUp:
      "If you believe Canada-first wins, when do we go to the US?",
    redFlagToAvoid:
      "Generic 'I love the mission' opener. Founders hear it 40 times a week. Lead with a thesis and a number.",
  },
  {
    id: "q02-next-1m-arr",
    category: "strategy",
    asker: "adeel",
    question: "Where's the next $1M ARR?",
    framework:
      "Bottoms-up math from a knowable TAM. Show the model, then show the assumptions you'd test in week one.",
    keyPoints: [
      "TAM: 14,200 Ontario family physicians (CIHI 2024), of whom ~10,500 are reachable via the CPSO public register. Finite, knowable, segmentable.",
      "Funnel: 16,000 sequenced touches at 4% reply, 25% demo-book from reply, 40% trial start, 50% paid conversion. That is 32 paying clinicians per quarter from outbound alone, on top of inbound.",
      "At a $720 ACV that is $23k in 90 days as a floor. A 6% reply rate (achievable with EMR-aware first lines and price-anchor framing) doubles it.",
      "Stacked with one enterprise contract at $80k ARR (Trillium-class, riding the VoR badge through procurement) and the comparison-page SEO uplift, the path to $1M is 4 quarters of this engine compounding.",
      "The whole model is in /pipeline and /strategy. Every step is measured so we know which assumption to break first.",
    ],
    evidenceFromDemo: "/strategy 90-day funnel math, /pipeline lead scoring",
    potentialFollowUp:
      "Which conversion rate are you least confident in, and how do you de-risk it in week one?",
    redFlagToAvoid:
      "Hand-waving with 'a few hundred clinicians.' Founders want to see the model, not a vibe.",
  },
  {
    id: "q03-wedge-vs-tali",
    category: "strategy",
    asker: "adeel",
    question: "What's the wedge that beats Tali?",
    framework:
      "Three concrete deltas, ranked by what closes deals fastest. Then the content brief that makes them visible.",
    keyPoints: [
      "Price: Vero at $74 average vs Tali at $300/month. That is a 4x delta the buyer feels in the first conversation.",
      "Specialty coverage: Vero ships 150+ templates, Tali markets ~12. For a multi-specialty clinic shopping both, this kills the deal in Vero's favour.",
      "Doc upload: Vero ingests referral letters and PDFs, Tali does not. For an FP doing chart prep on 30 patients a day, this is the feature they didn't know they were allowed to ask for.",
      "Plus VoR: Vero has the Ontario Health Vendor of Record badge. Tali does not trade on it the way Vero can. For any FHT or hospital-affiliated clinic, that is the procurement shortcut.",
      "By August, every Toronto clinician searching 'tali ai review' should land on a Vero comparison page that opens with the price delta and a 40-second doc-upload demo. That is the brief.",
    ],
    evidenceFromDemo: "/vs-tali full feature comparison",
    potentialFollowUp:
      "What if Tali drops their price tomorrow? Where does the wedge go?",
    redFlagToAvoid:
      "Trash-talking Tali. They are a real company with a real product. Beat them on the deltas, not on the dunk.",
  },
  {
    id: "q04-rip-attio",
    category: "execution",
    asker: "bill",
    question:
      "What's your take on the existing CRM stack? Should we rip Attio?",
    framework:
      "Default to keep-and-extend, not rip-and-replace. Show you've thought about migration cost honestly.",
    keyPoints: [
      "Probably keep Attio. It is good enough for a 1-to-3-person GTM team, the data model is flexible, and a migration eats 4 to 6 weeks of pipeline-building time we cannot afford right now.",
      "The gaps to fix are at the edges, not the core: closed-loop attribution per touch, EMR-cohort tags as first-class fields, and a sequencer that writes back into Attio cleanly.",
      "The thing I would build alongside Attio (not replace) is a thin internal lead-state service that owns the scoring rubric and re-runs on rubric changes. So a scoring tweak does not require a CRM admin or a redeploy.",
      "Revisit the rip question at $5M ARR or hire #5, whichever comes first. By then we will know what we need from the CRM and whether HubSpot or a Salesforce-class tool is worth the migration tax.",
      "Concrete check I would run week 1: pull 30 days of Attio data, find the 3 fields most often left blank, and decide whether the gap is tooling or process. Most of the time it is process.",
    ],
    evidenceFromDemo: "/pipeline and /day1 (Attio import in week 1 plan)",
    potentialFollowUp:
      "What does your day-1 lead-state service look like as code?",
    redFlagToAvoid:
      "Coming in hot with 'you should rip everything.' That is what a junior engineer says. Founders want someone who respects sunk infrastructure.",
  },
  {
    id: "q05-week-1-sequence",
    category: "execution",
    asker: "bill",
    question: "Walk me through how you'd ship the first outbound sequence in week 1.",
    framework:
      "Day-by-day plan with named artifacts. Show that 'week 1' is real, not a slogan.",
    keyPoints: [
      "Mon: 500 CPSO-sourced FPs imported to Attio, scored against the rubric you can see in /pipeline. Segmented by city, EMR cohort, years in practice.",
      "Tue: outbound sequencer running with the Day 1/4/9/16 cadence drafted in /lead/[id]. Templates written, merge tokens defined, EMR-aware variants for OSCAR and Telus PSS in branch.",
      "Wed: first 50 sends, hand-reviewed by me before they leave. Reply webhook on a Postmark inbound parser, advancing leads to 'replied' or 'demo_booked' automatically.",
      "Thu: Slack posts to #gtm on every demo booked, so Adeel sees momentum without opening a dashboard. First subject-line A/B (price vs hours-back anchor) staged for Friday send.",
      "Fri: 200 total sends out the door, 5 demos in calendar, baseline reply rate captured. End of week: the engine runs without me restarting it on Monday.",
    ],
    evidenceFromDemo: "/day1 timeline, /lead/[id] sequence pane, /experiments",
    potentialFollowUp: "What goes wrong in week 1, and what do you do about it?",
    redFlagToAvoid:
      "A vague 'set up tooling and start sending.' Day-by-day with named artifacts is what separates an operator from a candidate.",
  },
  {
    id: "q06-why-family-medicine",
    category: "strategy",
    asker: "either",
    question: "Why family medicine and not specialty groups?",
    framework:
      "Four lenses: market size, pain intensity, procurement path, buying behaviour. Each one points at FPs.",
    keyPoints: [
      "Market size: 14,200 Ontario FPs is the largest single physician segment in the province, and 6.5M Ontarians without a family doctor (OCFP 2026) is making this a top-3 political issue.",
      "Pain intensity: FPs do 25 to 35 short visits a day, which is the workflow scribes save the most time on. A specialist doing 8 long consults gets less ROI per dollar.",
      "Procurement path: solo and 2-to-3-person FP clinics can buy on a credit card. Hospital specialty groups need 6 to 12 months of procurement. We will sell to both, but the FP funnel pays for the enterprise lane.",
      "Buying behaviour: FPs are the segment most active on the Canadian forums and OCFP groups where word-of-mouth compounds. One delighted FP in Hamilton refers two more by month three.",
      "Strategic: every specialty Vero adds (cardiology, pediatrics) is a content surface and a feature investment. FPs are the wedge. Specialty groups are the expansion.",
    ],
    evidenceFromDemo: "/strategy market sizing, /pipeline ICP rubric",
    potentialFollowUp:
      "Which specialty would you expand to first after FP is at $1M ARR?",
    redFlagToAvoid:
      "Treating it as a binary. The right answer is 'FPs first, specialty groups as expansion,' not 'FPs only forever.'",
  },
  {
    id: "q07-concerns-gtm-today",
    category: "concerns",
    asker: "adeel",
    question: "What concerns you about Vero's GTM today?",
    framework:
      "Honest, specific, with the fix attached. Critique without disrespecting the work that got the company to 5,000 customers.",
    keyPoints: [
      "Outbound is under-built relative to the inbound brand. ~80/20 inbound/outbound is the right mix for Series A but leaves the next 10,000 reachable Ontario FPs untouched. That is the work I would do.",
      "No closed-loop attribution per touch. We probably do not know which sequence step is doing the work. That makes spend allocation a guess and the next $1M of GTM money harder to justify.",
      "Comparison-page SEO is open ground. Tali wins 'tali ai review' today. We can take it back in a quarter for under $5k of content investment.",
      "Reply triage is likely manual. A regex stub on inbound replies will leak warm leads under volume. A small classifier model pays for itself in a week.",
      "Enterprise lane is unscoped. The VoR badge is a moat the company is not pricing in yet. One named-account motion against Trillium / Hamilton Health Sciences could add an $80k contract by Day 90.",
    ],
    evidenceFromDemo: "/strategy day 30 / 60 / 90 plans, /automations reply classifier",
    potentialFollowUp:
      "What would you NOT change, even if you had the budget?",
    redFlagToAvoid:
      "Performative criticism. Every concern needs the fix attached or it reads as a candidate posturing instead of an operator helping.",
  },
  {
    id: "q08-build-differently",
    category: "concerns",
    asker: "bill",
    question: "What would you build differently from how we're building today?",
    framework:
      "Three specific changes ranked by ROI. Frame them as additive, not corrective.",
    keyPoints: [
      "Lead-state service as a first-class internal product. Today (I'm guessing) the scoring rubric lives in Attio formulas or a spreadsheet. A small Postgres table + a recalc job means rubric changes ship in 10 minutes without a redeploy.",
      "Reply-classifier model replacing the regex stub. Three labels: positive, negative, out-of-office. Routes positives to a human in under 4 minutes business-hours. Pays for itself in a week of recovered warm leads.",
      "EMR-aware template variants as a build pattern, not a one-off. The Telus PSS clinician's email references PSS by name. The OSCAR clinician's email references OSCAR. Doubles the 'this person understands my workflow' signal at zero ongoing cost once the pattern is in place.",
      "Closed-loop attribution baked into every send. Every demo tagged with first-touch source, sequence touch number, EMR cohort. So the next quarter's spend allocation is a number, not a meeting.",
      "RFP-response generator pre-filled from Vero's security docs. Cuts the standard Ontario Health questionnaire from 8 hours to 45 minutes. Unlocks the enterprise lane.",
    ],
    evidenceFromDemo: "/automations all 6 surfaces, /enterprise RFP generator",
    potentialFollowUp:
      "Of those 5, which one ships in week 1 and which one ships in month 2?",
    redFlagToAvoid:
      "Listing things without ROI ranking. Founders want to know what you would do FIRST and why.",
  },
  {
    id: "q09-time-split",
    category: "execution",
    asker: "either",
    question: "How would you split your time week 1 vs week 12?",
    framework:
      "Honest percentages, with the explicit shift from doing the work to building the engine that does the work.",
    keyPoints: [
      "Week 1: 60% sending and replying personally (the only way to learn the buyer), 25% tooling (Attio + sequencer + reply parser), 10% data (CPSO list, scoring rubric), 5% reporting to Adeel.",
      "Week 4: 40% on quality (template iteration, EMR-aware variants, A/B tests), 30% tooling (reply classifier, attribution), 20% enterprise lane scoping, 10% reporting.",
      "Week 12: 20% personally selling (only the highest-value enterprise convos), 30% building the next layer (hire #2 ramp, dashboard, partner motion), 30% experiments and content (comparison pages, OCFP webinar), 20% reporting and forecasting.",
      "The shift is deliberate: at week 1 I am the engine, by week 12 I am the architect of the engine. If I am still personally sending 60% of cold emails at week 12, the system did not get built.",
      "Hire #2 (a BDR or content lead, my read is BDR first) gets scoped at week 8 and starts at week 14.",
    ],
    evidenceFromDemo: "/day1, /strategy 30/60/90 plans",
    potentialFollowUp:
      "What would have to be true at week 12 for you to hire BDR vs content first?",
    redFlagToAvoid:
      "'I work however hard you need.' Founders want a thinking model, not a hustle line.",
  },
  {
    id: "q10-90-day-target",
    category: "strategy",
    asker: "adeel",
    question: "What's your first-90-day funnel target?",
    framework:
      "A specific number, the math behind it, and the assumption you would defend.",
    keyPoints: [
      "Target: $200k+ new MRR through the GTM engine by Day 90.",
      "Math: 1,000 sequenced FPs/week × 12 weeks = 12,000 contacts × 1.5% trial × 40% trial-to-paid × $75 ACV = $54k MRR from FP outbound, plus 1 closed Trillium-class enterprise deal at $80k ARR, plus content uplift.",
      "Assumption I would defend: 1.5% trial rate from cold outbound. Conservative against the 4% reply / 25% demo / 40% trial chain in the model. If we hit 2%, the number doubles.",
      "Floor scenario: 0.8% trial rate, no enterprise deal closed in 90 days. That still books $30k MRR plus 2 enterprise deals in late-stage negotiation, which is a $1M ARR run-rate by Day 180.",
      "I would post the funnel target publicly to #gtm on Day 1 and update it every Friday. Forecasting accuracy is the metric Adeel and I would calibrate together.",
    ],
    evidenceFromDemo: "/strategy 90-day funnel math, /metrics dashboard",
    potentialFollowUp:
      "What happens if you are at 40% of target by Day 45?",
    redFlagToAvoid:
      "A round number with no math. $200k MRR has to fall out of an actual model or it is a wish.",
  },
  {
    id: "q11-where-this-goes-wrong",
    category: "concerns",
    asker: "either",
    question: "Where does this go wrong?",
    framework:
      "Three real failure modes, each with the early warning sign and the mitigation.",
    keyPoints: [
      "Failure 1: outbound reply rate stalls under 2%. Likely cause is a saturated buyer or a deliverability issue. Early sign: open rates fine, replies dropping week over week. Mitigation: switch primary channel to LinkedIn DM for touch 1, hold email for touch 2.",
      "Failure 2: enterprise lane stalls in procurement. Likely cause is a security questionnaire we cannot answer in 45 minutes. Early sign: 30+ days between intro and SOC2 follow-up. Mitigation: the RFP-response generator on /enterprise, plus an outside privacy lead on retainer for novel questions.",
      "Failure 3: Tali drops price to $99 to defend share. Early sign: a Tali blog post or LinkedIn announcement. Mitigation: we do not move on price (it is a feature war, not a price war), we double down on doc-upload and 150-template differentiation in content.",
      "Failure 4 (the honest one): Khush is great at building the engine but a worse closer than the founders themselves. Early sign: my close rate on enterprise demos at week 8 is below 30%. Mitigation: Adeel takes founder-led closes for enterprise, I run the top of the funnel.",
      "I would write all four of these into a #gtm-risks Notion page on Day 1 so we are arguing from the same page.",
    ],
    evidenceFromDemo: "/strategy what-could-break section, /enterprise RFP",
    potentialFollowUp:
      "What is your read on the chance Tali is acquired by Microsoft in 2026?",
    redFlagToAvoid:
      "'Nothing is going to go wrong.' Founders trust candidates who name failure modes out loud.",
  },
  {
    id: "q12-comp",
    category: "compensation",
    asker: "either",
    question: "What does fair comp look like?",
    framework:
      "Anchor on the role, not on a number. Lead with what you optimize for. Numbers come second and are bands, not points.",
    keyPoints: [
      "I optimize for two things in this role: cash that lets me focus without side income, and equity that compensates me for the asymmetric upside if Vero is a $500M outcome.",
      "Cash: market band for a Series A GTM hire #1 in Toronto is $130k to $170k base. I am comfortable in the middle of that.",
      "Equity: 0.4% to 0.8% for a GTM lead joining at this stage seems like the published-comparable band (Pave / OptionImpact data). Open to lower base for the high end of the equity band.",
      "Variable: a sensible OTE structure tied to the funnel target we set together is fine. I would rather have OTE tied to ARR shipped than to leads sourced, because leads are gameable and ARR is not.",
      "I want to do this work. I am not going to red-line the offer over $10k. If we are aligned on the role and the equity feels right, we will close the cash piece in 20 minutes.",
    ],
    evidenceFromDemo: "(no demo surface; this is conversation craft)",
    potentialFollowUp:
      "What's the lowest base you'd take for the highest equity?",
    redFlagToAvoid:
      "Anchoring on a single number, or being evasive ('whatever you think is fair'). Founders want a candidate who can have this conversation directly without it getting weird.",
  },
  {
    id: "q13-what-i-dont-know",
    category: "fit",
    asker: "bill",
    question:
      "What's something you don't know about healthcare GTM that you'd need to learn fast?",
    framework:
      "Honest, specific gaps, with the named source you would learn from. Show you have already started.",
    keyPoints: [
      "Procurement vocabulary inside Ontario Health and the LHINs / Ontario Health Teams. I know what VoR is and why it matters; I do not yet know the named buyer titles in a typical OHT and the order of operations from intro to signed MSA.",
      "EMR-specific quirks beyond OSCAR and Telus PSS. I have read the public docs; I have not yet talked to a clinician about Accuro vs PS Suite migration friction, which matters for template positioning.",
      "Healthcare-specific objection patterns beyond what is on /objections. The 8 there are calibrated, but the 9th and 10th will surface in week 2 and I will need to write them fast.",
      "Clinical credibility cues. I am not a clinician. The way an FP reads a cold email differs from the way a SaaS PM reads one. I would shadow 3 demos in week 1 to calibrate my ear.",
      "Named sources I would learn from on Day 1: OntarioMD partnership lead (procurement), 2 Vero customers willing to do a 30-min call (buyer voice), and Adeel's recordings of the last 5 closed-won discovery calls (objection patterns).",
    ],
    evidenceFromDemo: "/objections shows what I do know; the gaps above are what I'd add",
    potentialFollowUp:
      "How would you measure that you've closed those gaps?",
    redFlagToAvoid:
      "'I know everything I need to.' Or the opposite, 'I'd need to learn the whole industry.' Both read as poorly calibrated.",
  },
  {
    id: "q14-deal-im-proud-of",
    category: "fit",
    asker: "adeel",
    question: "Tell me about a deal you closed that you're proud of.",
    framework:
      "STAR format: situation, task, action, result. Anchor on a number and a specific action that would not have happened without you.",
    keyPoints: [
      "Situation: prospect was 80% qualified, mid-tier ACV, but stalled at procurement for 6 weeks because the security questionnaire was sitting in legal limbo.",
      "Task: get the deal closed in the quarter without dropping price or escalating to the founder.",
      "Action: rewrote our SOC2 doc as a 1-page plain-language summary mapped 1:1 to the buyer's questionnaire, then walked their privacy lead through it in a 25-minute call instead of routing through their legal team.",
      "Result: signed MSA in 9 days, full ACV, no discount. The 1-pager is now the asset every deal in their segment uses.",
      "Why I am proud of it: the mechanism (artifact + buyer-side advocacy) is reusable. One deal closed faster is fine, but the asset closed the next 6 deals in that segment with no extra effort. That is what 'building the engine' looks like in practice.",
    ],
    evidenceFromDemo: "/enterprise RFP generator is the same pattern, applied at Vero",
    potentialFollowUp:
      "Walk me through a deal you lost and what you'd do differently.",
    redFlagToAvoid:
      "A heroics story without a transferable mechanism. Founders care about whether the win is repeatable.",
  },
  {
    id: "q15-why-leaving",
    category: "fit",
    asker: "either",
    question: "Why are you leaving your current role?",
    framework:
      "Forward-looking, not backward. Two reasons (one push, one pull) and a clean answer that does not disparage anyone.",
    keyPoints: [
      "Pull: Vero is the rare combination of a product I would buy myself, a thesis I believe in (Canada-first wins this category), and a stage where one operator can move the needle. That comes around once every few years.",
      "Push: my current role is at a stage where the next 18 months look more like managing than building. I want to be back in the seat where I am writing the first cold email and watching the reply rate move.",
      "I am leaving on good terms. My current team knows I am looking; I would give a clean transition runway of 2 to 4 weeks before starting at Vero.",
      "What I am not optimizing for: a bigger title, a bigger team, or a logo upgrade. I am optimizing for the work I want to do for the next 3 years.",
      "Honest: I would not be in this conversation if Vero were not the specific company. There are 5 other Series A startups I could have applied to. I applied to one.",
    ],
    evidenceFromDemo: "(no demo surface; conversation craft)",
    potentialFollowUp: "What would make you leave Vero in 2 years?",
    redFlagToAvoid:
      "Disparaging the current employer, or a vague 'looking for the next challenge.' Both signal a candidate who does not know what they want.",
  },
];
