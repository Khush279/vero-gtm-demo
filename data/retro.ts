/**
 * Day-90 retrospective. The longer-form, brutally-honest companion to
 * data/board-deck.ts. Where the deck is diplomatic, the retro is the
 * unfiltered version of the same quarter.
 *
 * Mirrors the 30/60/90 promises in data/strategy.md (the plan to retro
 * against) and projects week-4 numbers in data/metrics-dashboard.ts to
 * week 13. Hits are the things that landed; misses are the things that
 * didn't earn the next dollar; surprises are the things that weren't on
 * the prediction map at all.
 */

export type Verdict = "shipped" | "shipped-late" | "missed" | "killed";

export type RetroItem = {
  id: string;
  /** The thing committed in /strategy. */
  promise: string;
  verdict: Verdict;
  /** Two or three sentences on what actually happened. */
  whatHappened: string;
  /** One or two sentences on the do-over. */
  whatIdDoDifferent: string;
};

export type Surprise = {
  observation: string;
  meaning: string;
};

export type Retro = {
  /** Two-sentence frame for an outsider opening the page cold. */
  intro: string;
  /** The TL;DR an outsider should remember. One line. */
  oneLineSummary: string;
  hits: RetroItem[];
  misses: RetroItem[];
  surprises: Surprise[];
  /** Five concrete shifts in approach for Q4. */
  whatChangesNextQuarter: string[];
};

export const RETRO: Retro = {
  intro:
    "Ninety days is long enough to know what worked and short enough that the failures are still embarrassing. This is the version I would not have shown the board, written for the people who actually have to run the next quarter with me.",
  oneLineSummary:
    "The engine runs at floor numbers, two channels got killed before they compounded, and the most useful thing I learned is that the doc-upload story sells to administrators, not clinicians.",

  hits: [
    {
      id: "hit_outbound_engine",
      promise:
        "Stand up the outbound engine: 1,000 sequenced FPs/week by Day 30, baseline reply rate captured, EMR-aware variants live.",
      verdict: "shipped",
      whatHappened:
        "Hit 1,040 sequenced FPs/week by Day 27. Reply rate climbed from 4.7% week 1 to 5.9% by week 13, above the Tali public benchmark of 2.1%. Postmark inbound parser, Attio scoring, and the Slack hook on demo bookings are all running without me touching them daily.",
      whatIdDoDifferent:
        "Cut the first two weeks of hand-reviewed sends in half. The first 50 sends were valuable; the next 100 taught me nothing new and slowed the volume ramp by a week.",
    },
    {
      id: "hit_vs_tali",
      promise:
        "Ship the Vero-vs-Tali comparison page and own the comparison query Tali currently wins.",
      verdict: "shipped",
      whatHappened:
        "Page-1 of Google for the comparison query in 41 days. Drives 18% of demo bookings on zero paid spend. The 40-second doc-upload video at the top of the page is now the single most-clicked element on the site after the pricing card.",
      whatIdDoDifferent:
        "Should have shipped four comparison pages in parallel, not one. Tali, Suki, DAX, and a generic Canadian-scribe page would have taken one extra week of writing and captured roughly four times the long-tail intent.",
    },
    {
      id: "hit_maple",
      promise:
        "Close one named virtual-care logo in the quarter to seed the enterprise reference list.",
      verdict: "shipped",
      whatHappened:
        "Maple closed at $720k ARR on a 12-month contract. Doc-upload was the deciding factor over Tali. Pilot ran 40 clinicians for 21 days with kill-switch criteria written before launch; 1,412 of 1,800 weekly active by Day 90. Dr. Hassan Siddiqui is now a reference for Felix and KixCare.",
      whatIdDoDifferent:
        "I leaned on Adeel for the technical close. He should have shadowed me on the second half, not the other way around. Q4 has me running Niagara solo to fix that.",
    },
    {
      id: "hit_partner_motion",
      promise:
        "Seed the partner motion with OntarioMD and OCFP. Goal of one paid pilot or one co-branded webinar by Day 90.",
      verdict: "shipped-late",
      whatHappened:
        "OntarioMD seeded. Co-branded webinar booked for Day 102, not Day 90. The asset slipped because I rebuilt the OCFP outreach deck twice after the first version sounded like a vendor pitch instead of a peer offer.",
      whatIdDoDifferent:
        "Skip the second rewrite. The first deck was 80% of the way there and the partner team was going to red-line it anyway.",
    },
    {
      id: "hit_hire_two",
      promise:
        "Onboard hire #2, BDR-equivalent, sequencing solo by Day 90.",
      verdict: "shipped",
      whatHappened:
        "Onboarded Day 78. Solo at 600 FPs/week by Day 90. The onboarding doc is now four pages long and the second hire ramped in 11 days against my plan of 18. Reply-classifier ship date moved up because the BDR seat freed me to write it.",
      whatIdDoDifferent:
        "Write the onboarding doc the week before the hire starts, not in real time during their first week. I lost two days context-switching.",
    },
  ],

  misses: [
    {
      id: "miss_linkedin_dm",
      promise:
        "Run the email-vs-LinkedIn-DM first-touch experiment and roll out the winner.",
      verdict: "killed",
      whatHappened:
        "Killed Day 52. The 2x reply-rate held but demo-book rate was 0.5x of email and Sales Navigator seat costs did not pencil at our send volume. Net wash on funnel, real cost on tooling. Reallocated the budget to the OntarioMD partnership, which now produces warmer leads at lower CAC.",
      whatIdDoDifferent:
        "Set the kill-switch on cost-per-demo, not reply rate. I almost ran it another two weeks because the reply number looked good in the dashboard and I had to argue myself out of it.",
    },
    {
      id: "miss_paid_google",
      promise:
        "Paid Google search was off the table per memo, but I ran a $4k test anyway because three demos came in unattributed and I wanted to know.",
      verdict: "killed",
      whatHappened:
        "Killed Day 67. $4,200 burn, 11 trials, 3 paid, blended CAC of $1,400 against $720 ACV. Content covers the same intent at one-fifth the cost. The original memo was right and I cost the team six weeks of focus to confirm it.",
      whatIdDoDifferent:
        "Trust the memo. If I want to run a contradicting test, the threshold should be a written hypothesis I can defend to Adeel before spending, not a hunch dressed up as curiosity.",
    },
    {
      id: "miss_trillium",
      promise:
        "Trillium RFP submitted on time inside the Day-60 enterprise-lane window.",
      verdict: "shipped-late",
      whatHappened:
        "Submitted Day 64, four days past their stated deadline. They accepted the late submission because the security questionnaire response was the cleanest one in the round, but the lateness cost us the pole-position advantage in the shortlist call. Now ranked #2, not #1, going into final negotiation.",
      whatIdDoDifferent:
        "Kick off the security questionnaire the day the RFP drops, not after the technical narrative is written. Those two workstreams are independent and I sequenced them like they weren't.",
    },
    {
      id: "miss_weekly_digest",
      promise:
        "Ship the Monday digest to Adeel and Bill every week so momentum is visible without anyone opening a dashboard.",
      verdict: "missed",
      whatHappened:
        "Shipped weeks 1 through 7 on time. Skipped week 8 because Maple was closing. Skipped week 10 because the partner deck was due. Sent week 11 on a Wednesday with a half-apology in the preamble. By week 13 the digest had become a thing I felt guilty about instead of a thing the team relied on.",
      whatIdDoDifferent:
        "Automate the digest from the dashboard data, not from my writing time. The narrative line at the top is the only piece that needs me; the numbers should render themselves.",
    },
  ],

  surprises: [
    {
      observation:
        "Telus PSS clinics replied at 2x the rate of OSCAR clinics.",
      meaning:
        "I had assumed OSCAR's open-source community would be the warmer cohort because the user base is more technical and more vocal online. The opposite was true. PSS clinics are larger on average, have an office manager who reads the inbox, and respond to a price-anchor subject line because they already have a budget line for software. The targeting weights were wrong out of the gate, and the reply data corrected them by week 3.",
    },
    {
      observation:
        "The doc-upload differentiator landed harder with administrators than clinicians.",
      meaning:
        "Clinicians treat doc-upload as a nice-to-have because the daily pain point is dictation, not document ingestion. Administrators treat it as the feature because they are the ones reconciling referral letters, prior-auth PDFs, and legacy InputHealth notes. Every Maple-style enterprise conversation now opens with the doc-upload demo aimed at the operations lead, not the clinical lead.",
    },
    {
      observation:
        "The price anchor stops working the moment a clinic has already used another scribe.",
      meaning:
        "For a greenfield clinic, $74/month versus $300/month is the entire conversation. For a clinic already paying Tali, the price gap is invisible because the question becomes switching cost: re-training, re-templating, re-integrating with the EMR. The reply-rate delta between greenfield and previously-scribed cohorts is over 4 percentage points. Q4 needs a separate sequence for the second cohort built around switching cost, not price.",
    },
  ],

  whatChangesNextQuarter: [
    "Lead with switching-cost narrative for previously-scribed clinics. New sequence, new comparison page, new demo open. Price stops being the headline.",
    "Double down on the Telus PSS cohort. Two EMR-aware variants ship in week 1 of Q4 and the next 1,500 sequenced contacts skew PSS-heavy.",
    "Formalize the partner motion. OntarioMD co-branded webinar by Day 30, one paid OCFP pilot scoped by Day 60, partner-sourced pipeline tracked as its own funnel in the digest.",
    "Hire content lead before BDR #2. Content velocity is now the constraint, not send volume. The order in the original memo was wrong.",
    "Ship a Vero for groups pricing tier. Five+ seat clinics keep asking for it and the current single-seat motion leaves money on the table on every multi-clinician call.",
  ],
};
