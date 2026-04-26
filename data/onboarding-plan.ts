/**
 * Week-1 onboarding plan for hire #2. The strategy memo (data/strategy.md, day
 * 90) names hire #2 as "BDR or content lead, read is BDR first because content
 * is already healthy". This file picks BDR and lays out Mon-Fri ramp in the
 * same shape /day1 uses: morning + afternoon block per day, EOD brief.
 *
 * The point of the surface is to show the founder reading /onboarding-plan
 * that the candidate is not trying to be a one-person GTM team. The first
 * hire is being scoped before they exist, with success criteria, a failure
 * mode, and a real day-by-day ramp that ends with the new BDR shipping a
 * customer-facing artifact under their byline by Friday.
 */

export type OnboardingDay = {
  day: number;
  date: string;
  theme: string;
  morning: { time: string; title: string; description: string; output: string };
  afternoon: { time: string; title: string; description: string; output: string };
  endOfDayBrief: string;
};

export type Hire2Profile = {
  role: "BDR" | "Content lead" | "Either";
  whyThisHire: string;
  successCriteria: string[];
  failureMode: string;
};

export const ONBOARDING_PLAN: { profile: Hire2Profile; days: OnboardingDay[] } = {
  profile: {
    role: "BDR",
    whyThisHire:
      "By day 90 the outbound queue is sustaining 1,000 sequenced FPs a week and the human reply lane is the bottleneck. Content is already healthy: the comparison-page playbook ships on a 90-day refresh cadence and SEO is doing its job. A BDR at this stage owns the human-shaped work the engine cannot do yet, which is reading positive replies inside 15 minutes, running discovery on lukewarm interest, and feeding qualitative signal back into copy.",
    successCriteria: [
      "Day 30: 200 hand-reviewed sends out under their name, baseline reply rate within 0.5pt of the team average",
      "Day 30: average positive-reply response time under 18 minutes during business hours",
      "Day 60: 6 demos booked from sequences they own end-to-end, 2 trials started",
      "Day 60: one weekly digest shipped under their byline every Friday with no edits from Khush",
      "Day 90: 4 paying clinicians attributable to leads they ran, plus 3 documented copy variants they proposed and A/B tested",
    ],
    failureMode:
      "They become a faster send button instead of a reader, treating outbound as a volume game and missing the qualitative signal in the replies that actually moves the next experiment.",
  },
  days: [
    {
      day: 1,
      date: "Monday Day 1",
      theme: "Land in the system",
      morning: {
        time: "9:00 AM to 12:30 PM",
        title: "EMR map, ICP overview, and 5 customer interviews",
        description:
          "Walk the strategy memo top to bottom with Khush, then the ICP scoring rubric in lib/scoring.ts. The first reading is not the playbooks. It is the five most recent customer interview transcripts pinned in Granola. The new BDR pulls 15 to 20 verbatim phrases clinicians used to describe the charting pain, in their own words, and drops them in the shared copy file. This is the same exercise Khush ran on day 1 and it pays back the most on every email they touch this quarter.",
        output:
          "A pinned doc of 15 to 20 customer phrases tagged by theme, plus a one-page summary of the ICP and the 4 EMR cohorts.",
      },
      afternoon: {
        time: "1:30 PM to 6:00 PM",
        title: "Shadow 2 demos and stand up Attio plus email",
        description:
          "Sit in on two of Adeel's discovery or demo calls, microphone muted. Take notes only on the questions the clinician asks, not the answers. Then provision Attio with read-write on the FP pipeline, the shared from-identity at vero.com (DKIM, SPF, DMARC pre-aligned), and the shared inbox for replies. The day ends with the BDR's email signature, calendar link, and Slack handle live and tested.",
        output:
          "Notes from 2 shadowed calls (clinician-question lens), Attio access live, working from-identity sending a test thread to Khush.",
      },
      endOfDayBrief:
        "First Slack post in #gtm. Three things they noticed in the customer transcripts that Khush did not flag, one question for Adeel about clinical positioning to answer overnight.",
    },
    {
      day: 2,
      date: "Tuesday Day 2",
      theme: "Walk the playbook",
      morning: {
        time: "9:00 AM to 12:30 PM",
        title: "Walk the 4-touch sequence and watch one real send",
        description:
          "Read data/playbooks.ts entry-by-entry with Khush, focus on the solo-FP cold sequence. Specifically the pre-flight checks, the EMR-aware first-line logic, and the reply-handling routing rules. Then watch Khush hand-review and release a real batch of 25 sends in real time. The point is to see the small moments where a human catches a bad city inference or a wrong EMR token before it leaves the queue.",
        output:
          "A one-page personal cheat sheet on the 5 pre-flight checks and the 4 reply-classification routes.",
      },
      afternoon: {
        time: "1:30 PM to 6:00 PM",
        title: "Draft 5 first-touch emails for review",
        description:
          "Pull 5 high-fit leads from the 'ready to sequence' view in Attio. Each one has a different EMR cohort and a different city tier. Write a personalized first-touch email for each, using the verbatim customer phrases from yesterday and the merge-token logic from the playbook. Submit to Khush for line-by-line review, expect a redline on at least 3 of them.",
        output:
          "5 drafted first-touch emails with Khush's redlines visible, ready to use as references for tomorrow's first solo sends.",
      },
      endOfDayBrief:
        "What they got wrong on the drafts and what they will do differently on the first 25 tomorrow. One sentence on the redline that surprised them most.",
    },
    {
      day: 3,
      date: "Wednesday Day 3",
      theme: "First sends ship",
      morning: {
        time: "9:00 AM to 12:30 PM",
        title: "First 25 cold sends under hand-review",
        description:
          "Build the queue of 25 in Attio with ICP score over 75 and verified EMR. Khush sits next to them and reviews each one before release, same protocol as the first 50 of any new variant. Sends go out 7:45a to 9:15a Eastern in two waves so they can watch the first wave open and reply before the second wave fires.",
        output:
          "25 sends shipped, every one logged with subject variant, EMR token, and city tier in the reporting schema.",
      },
      afternoon: {
        time: "1:30 PM to 6:00 PM",
        title: "Adeel 1:1 on clinical positioning, then observe a demo",
        description:
          "Forty-five minutes with Adeel on the three questions a clinician will ask in the first 90 seconds of a demo: PIPEDA and data residency, EMR install friction, and what happens when the AI mishears a drug name. Then sit in on a third demo, this time with the lens of 'where would I have lost the clinician'. Debrief with Khush right after.",
        output:
          "A written one-pager on the 3 clinician objections and the answer pattern Adeel uses for each, in the BDR's own words.",
      },
      endOfDayBrief:
        "First-wave open and reply numbers from the morning batch, one positive reply they want to handle themselves tomorrow, one thing they would change about touch 1 already.",
    },
    {
      day: 4,
      date: "Thursday Day 4",
      theme: "Volume meets reply lane",
      morning: {
        time: "9:00 AM to 12:30 PM",
        title: "50 sends and reply triage starts",
        description:
          "Queue and ship 50 sends, Khush spot-reviews 10 randomly instead of all 50. The new constraint: the BDR is now also watching the shared reply inbox. Every inbound reply gets classified (positive, OOO, negative, unsubscribe) inside 4 minutes during business hours and routed per the playbook. Positive replies are theirs to respond to, with Khush in CC for the first week.",
        output:
          "50 sends out, every reply that came in by 12:30p classified and routed, first positive-reply response sent under their name.",
      },
      afternoon: {
        time: "1:30 PM to 6:00 PM",
        title: "Role-play 3 objections with Khush",
        description:
          "Three back-to-back role-plays, 20 minutes each plus 10 minutes of feedback. The objections: 'we already use Tali', 'I do not trust AI with PHI', and 'the clinic owner has to approve this'. Khush plays the FP, the BDR runs the conversation, then they swap. The point is to make the patterns from this morning's Adeel sit-down land in their own voice, not Adeel's.",
        output:
          "A short written reflection: which of the 3 objections felt hardest, and the exact phrase they want to try in their next live reply.",
      },
      endOfDayBrief:
        "End-of-day reply numbers from the 50 batch, the one reply that did not fit any of the 4 classifier buckets, and the question they want to bring to Friday's digest.",
    },
    {
      day: 5,
      date: "Friday Day 5",
      theme: "Solo morning, public artifact",
      morning: {
        time: "9:00 AM to 12:30 PM",
        title: "Solo sends, no hand-review",
        description:
          "First morning without Khush in the queue. The BDR runs the pre-flight, builds the 50-lead queue, and ships. Khush is available on Slack but does not pre-approve a single send. The reply lane stays staffed all morning. This is the first measurable test of whether the engine survives without the founder-in-the-loop.",
        output:
          "50 sends out solo, reply triage current within 4 business minutes, zero suppression-list adds traceable to a copy mistake.",
      },
      afternoon: {
        time: "1:30 PM to 6:00 PM",
        title: "Co-author and ship the weekly digest",
        description:
          "Sit with Khush and co-author the Monday-morning digest for #gtm: sends, opens, replies, demos by EMR cohort and city tier, top 5 positive-reply texts pasted in full, suppression-list quality alarm if any. The BDR drafts, Khush edits live, then the BDR ships it under their byline before 6pm. From next week the digest is theirs.",
        output:
          "The first weekly digest shipped to #gtm under the new BDR's byline, with the qualitative reply-text section as the centerpiece.",
      },
      endOfDayBrief:
        "What they want to change about the sequence next week, and the one variant they want to A/B test in the Tuesday batch. Closes the loop on week 1 and pre-loads Monday standup.",
    },
  ],
};
