/**
 * The hour-by-hour plan for day 1 at Vero. Eight blocks, each one a real
 * artifact that ships by 6pm. Designed so a founder reading /day1 sees the
 * exact shape of the engine I'd start building before lunch — not a doc,
 * a sequence of small concrete moves that compound.
 *
 * Categories are deliberately narrow:
 *  - audit  : looking at what already exists, no new artifacts
 *  - build  : standing up infrastructure (Attio, sequences, dashboards)
 *  - ship   : sending something into the world (an experiment, an email)
 *  - talk   : human time with founders or customer voices
 *  - decide : a written call on direction (priorities, decision rules)
 */

export type TimeBlock = {
  id: string;
  startTime: string;
  endTime: string;
  /** Hour-of-day in 24h, used by the "On the clock" widget to pick the active block. */
  startHour24: number;
  endHour24: number;
  title: string;
  category: "audit" | "build" | "ship" | "talk" | "decide";
  /** 2-3 sentences: what I'm doing this block. */
  what: string;
  /** 2-3 sentences: why this is the highest-leverage thing right now. */
  why: string;
  /** 1 sentence: the artifact this block produces. */
  output: string;
  toolsUsed: string[];
};

export const DAY_ONE_BLOCKS: TimeBlock[] = [
  {
    id: "d1_standup",
    startTime: "8:30 AM",
    endTime: "9:00 AM",
    startHour24: 8.5,
    endHour24: 9,
    title: "Standup + day plan share",
    category: "decide",
    what: "Slack thread to Adeel and Bill before they open laptops. Three priorities for the day, two questions I need answered, one decision I'm asking them to make. Same shape every morning, so they can scan in 30 seconds.",
    why: "Founders hate surprise. The cheapest way to get autonomy on day 1 is to publish the plan publicly so they can course-correct in writing instead of in a meeting. It also forces me to pick three things instead of trying to do everything.",
    output: "One Slack thread in #gtm with priorities, questions, and a decision ask.",
    toolsUsed: ["Slack"],
  },
  {
    id: "d1_audit_outbound",
    startTime: "9:00 AM",
    endTime: "10:30 AM",
    startHour24: 9,
    endHour24: 10.5,
    title: "Audit the existing outbound funnel",
    category: "audit",
    what: "Pull every send from the last 90 days out of whatever tool Vero is using today. Classify by sequence, segment, and result. Build a one-screen funnel: sends, opens, replies, demos, paid. Find the leakiest stage.",
    why: "I cannot recommend new sequences without knowing what's already failing and why. The leakiest stage tells me where the next dollar of effort returns the most. Showing this back to Adeel by lunch also proves I read the data before opening my mouth.",
    output: "A one-page funnel diagnostic with the single biggest leak circled.",
    toolsUsed: ["Postmark", "Attio", "Sheets"],
  },
  {
    id: "d1_search_console",
    startTime: "10:30 AM",
    endTime: "11:00 AM",
    startHour24: 10.5,
    endHour24: 11,
    title: "Read Search Console + GA, last 14 days",
    category: "audit",
    what: "Pull the top 20 high-intent queries Vero is ranking on, find the three pages where impressions are high but click-through is below 3%. Write a one-line hypothesis for each: title tag, meta description, position drift, or competitor SERP feature.",
    why: "Inbound is already the strongest channel. The cheapest growth on day 1 is fixing pages that are already ranking but not converting clicks. Three small title tag rewrites can move more revenue than a week of cold outreach.",
    output: "A list of three underperforming pages with a one-line fix hypothesis each.",
    toolsUsed: ["Search Console", "GA4"],
  },
  {
    id: "d1_founder_sync",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    startHour24: 11,
    endHour24: 12,
    title: "Founder sync with Adeel and Bill",
    category: "talk",
    what: "60 minutes blocked. 15 with Adeel on physician segmentation gut-check (does my CPSO-derived ICP match what he hears from real users), 15 with Bill on the existing automation surface, 30 minutes together on what the next $1M ARR looks like and where it comes from.",
    why: "Every assumption in my 90-day plan is testable against what the founders already know in their bones. This conversation collapses two weeks of guessing into one hour. It also locks in shared language for the metrics we'll review every Friday.",
    output: "A written one-pager: shared ICP definition, one-line answer on each of the next $1M's components, three open questions logged.",
    toolsUsed: ["Notion", "Linear"],
  },
  {
    id: "d1_lunch_interviews",
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    startHour24: 12,
    endHour24: 13,
    title: "Lunch + read 5 customer interviews",
    category: "audit",
    what: "Use the lunch hour to read the five most recent customer onboarding transcripts. Highlight every phrase a clinician used to describe the pain Vero solves. Pull a list of 15-20 verbatim words and short phrases for the outbound copy file.",
    why: "Founders write copy in their own language. Customers buy in theirs. The cheapest way to get a 2x lift on cold email reply rates is to mirror the exact words clinicians use about charting hours, family time, after-clinic burnout. This is a 60-minute investment that compounds across every email this quarter.",
    output: "A pinned doc of 15-20 verbatim customer phrases tagged by theme (time-back, burnout, EMR friction, billing).",
    toolsUsed: ["Granola", "Notion"],
  },
  {
    id: "d1_attio_v0",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    startHour24: 13,
    endHour24: 15,
    title: "Stand up Attio pipeline v0",
    category: "build",
    what: "Import the existing leads into Attio. Define the eight stages from the strategy memo. Wire scoring rubric weights into a custom field with a recalc trigger. Build a 'ready to sequence' view filtered to ICP score over 70 and push the first 50 high-fit leads into it.",
    why: "Without one source of truth, every later experiment is unmeasurable. Attio gets stood up first because it's the system every other automation will write into and read from. The 50-lead 'ready to sequence' view is the queue tomorrow's outbound runs against.",
    output: "A live Attio workspace with leads imported, stages defined, ICP scoring active, and a 50-lead 'ready to sequence' view.",
    toolsUsed: ["Attio", "CSV", "CPSO register"],
  },
  {
    id: "d1_drafts",
    startTime: "3:00 PM",
    endTime: "4:30 PM",
    startHour24: 15,
    endHour24: 16.5,
    title: "Draft 3 personalized first-touch emails",
    category: "build",
    what: "Write three first-touch email variants for the three ICP slices: solo family physician, group practice owner, hospital-affiliated FHT lead. Each one mirrors the customer phrases from the lunch read. Send drafts to Adeel for clinical accuracy review before any send goes out.",
    why: "Three is the right number on day 1. Less than three doesn't cover the segments. More than three is over-engineering before I know what works. Getting Adeel's clinical sign-off this afternoon is the unblock that lets me ship the first 50 sends tomorrow morning.",
    output: "Three reviewed first-touch email drafts, ready to load into the day-2 sequencer.",
    toolsUsed: ["Notion", "Slack", "Adeel's eyeballs"],
  },
  {
    id: "d1_ship_experiment",
    startTime: "4:30 PM",
    endTime: "5:30 PM",
    startHour24: 16.5,
    endHour24: 17.5,
    title: "Ship the cheapest experiment",
    category: "ship",
    what: "Take the cheapest experiment from /experiments (subject-line A/B: price anchor vs hours-back framing). Set up the tracking, write the decision rule in plain English, schedule the first batch of 200 sends to go out tomorrow at 7am ET in two cohorts of 100.",
    why: "Day 1 has to ship something measurable, even if it's small. A subject-line A/B is the cheapest possible experiment with a real decision attached. Doing it on day 1 sets the cadence: every week, one experiment goes out, one decision gets made.",
    output: "One experiment in flight with cohort assignment, tracking, and a written decision rule.",
    toolsUsed: ["Postmark", "Attio", "Linear"],
  },
  {
    id: "d1_eod_brief",
    startTime: "5:30 PM",
    endTime: "6:00 PM",
    startHour24: 17.5,
    endHour24: 18,
    title: "End-of-day brief",
    category: "decide",
    what: "Slack post to founders. What shipped today, what is queued for tomorrow morning, one open question I want their take on overnight. Same shape every evening, so the morning standup picks up cleanly.",
    why: "Async closure beats a meeting. By the time Adeel reads this with his evening coffee, he knows exactly where the engine sits and what is moving without him. That trust is what unlocks the autonomy to keep moving fast in week 2.",
    output: "One Slack post in #gtm closing the loop on day 1 and pre-loading day 2.",
    toolsUsed: ["Slack"],
  },
];
