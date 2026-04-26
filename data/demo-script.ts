/**
 * /demo-script — operator beats for the LIVE Vero interview call.
 *
 * Different artifact from LOOM_SCRIPT.md (which is a recorded walkthrough).
 * This is the second-monitor cockpit during the actual call with Adeel and
 * Bill: timer, next sentence, surface to switch to, fallback callouts.
 *
 * Each beat is at most 45 seconds. Cumulative runtime targets 6:30.
 */

export type DemoBeat = {
  id: string;
  startSec: number;
  endSec: number;
  surface: string;
  beatLabel: string;
  whatToShow: string;
  whatToSay: string;
  callout?: string;
  bringBackTo?: string;
};

export const DEMO_BEATS: DemoBeat[] = [
  {
    id: "open",
    startSec: 0,
    endSec: 30,
    surface: "/",
    beatLabel: "Open with the cover letter",
    whatToShow:
      "Adeel, Bill on Zoom. Share the landing page tab. Don't read it aloud. Sit on the headline 'Hello, Adeel and Bill' for one beat, then click Pipeline.",
    whatToSay:
      "Hey Adeel, hey Bill. Instead of writing a cover letter, I built the GTM engine I'd run for you in week one. Everything you'll see is real data, no auth, source on GitHub. Let me skip the chrome and go straight to the pipeline.",
    callout:
      "If they ask 'why this format', answer in one sentence: 'Cover letters tell, demos show.' Then move.",
  },
  {
    id: "pipeline",
    startSec: 30,
    endSec: 75,
    surface: "/pipeline",
    beatLabel: "Pipeline overview",
    whatToShow:
      "Show the full board. Drag one lead from Discovered to Qualified so they see live state. Filter by Toronto. Hover the score column.",
    whatToSay:
      "Five hundred real Ontario family physicians, scraped from the CPSO public register at one request per second, scored against an ICP I derived from your own positioning. Toronto, Mississauga, Hamilton, Ottawa. The cities where Vero already has the Ontario Health VoR advantage that Tali doesn't.",
    callout: "If asked about Attio: 'Push to Attio button hits the real API if a key is set.'",
  },
  {
    id: "lead",
    startSec: 75,
    endSec: 120,
    surface: "/lead/lead_0042",
    beatLabel: "Lead detail · enrichment",
    whatToShow:
      "Click into lead_0042. Walk the left pane: name, city, inferred EMR, score breakdown. Pause on the inferred EMR field for 2 seconds.",
    whatToSay:
      "One click in, full enrichment. Specialty, city, panel size, inferred EMR. Inferred because no public source confirms it, but the heuristic is documented and the confidence is on the field. This is the unit a clinician-facing rep would work from.",
  },
  {
    id: "sequence",
    startSec: 120,
    endSec: 165,
    surface: "/lead/lead_0042",
    beatLabel: "Sequence drafted live",
    whatToShow:
      "Right pane on lead_0042. Click Regenerate on touch 1. Let it stream. While streaming, mention prompt-debugger.",
    whatToSay:
      "Right pane is a four-touch sequence drafted by gpt-4o-mini. Day 1, 4, 9, 16. Each email has a leverage point: price anchor, doc-upload differentiator, PIPEDA, Ontario VoR. Bill, if you want the engine behind this, /prompt-debugger shows the exact system prompt and the diff when I tune it.",
    callout:
      "If OpenAI 500s on stream, say 'that's the cached fallback, same payload shape' and keep going.",
    bringBackTo: "/lead/lead_0042",
  },
  {
    id: "automations",
    startSec: 165,
    endSec: 195,
    surface: "/automations",
    beatLabel: "Automations · what GTM engineer means",
    whatToShow:
      "Show the five running scripts. Click View Source on the CPSO scraper so they see real TypeScript. Scroll one screen of the source.",
    whatToSay:
      "Bill, this is the page that separates a GTM engineer from a RevOps hire. Five running jobs. CPSO scraper, ICP recalculator, reply-detection webhook, demo-booked Slack alert, touch-due nightly cron. View source on any of them shows the actual TypeScript pulled from the repo at build time.",
  },
  {
    id: "enterprise",
    startSec: 195,
    endSec: 225,
    surface: "/enterprise",
    beatLabel: "Enterprise lane · one named champion",
    whatToShow:
      "Scroll to the reference customer card for Trillium. Pause on the named clinician. Show the RFP block below.",
    whatToSay:
      "The hospital-system lane. Trillium, Hamilton Health Sciences, Niagara Health. Already on Vero's VoR list. Below the systems is a pre-filled response to the standard Ontario Health questionnaire that takes most vendors eight hours and takes us forty-five minutes.",
  },
  {
    id: "strategy",
    startSec: 225,
    endSec: 255,
    surface: "/strategy",
    beatLabel: "Strategy memo · week-1 metrics",
    whatToShow:
      "Top of /strategy. Pause on the metrics strip. Scroll to the 'why family practice is the wedge' header and stop.",
    whatToSay:
      "Strategy memo opens with a metrics strip for week one. Below that, the wedge thesis: family practice in Ontario for the next 5,000 customers. Names Tali as the real competitive read. Ends with a $200k MRR target by Day 90 with bottoms-up math.",
  },
  {
    id: "case-study",
    startSec: 255,
    endSec: 285,
    surface: "/case-study",
    beatLabel: "Case study · one lead all the way through",
    whatToShow:
      "Top of /case-study. Show the timeline of touches and replies for the named clinician. Scroll once.",
    whatToSay:
      "Case study takes one named lead and walks the whole motion. First touch, reply, demo booked, contract signed. Every artifact along the way is the actual asset, not a placeholder. So you can see what 'closed-won' looks like end to end in this system.",
  },
  {
    id: "vs-tali",
    startSec: 285,
    endSec: 315,
    surface: "/vs-tali",
    beatLabel: "Vs Tali · the page Vero would publish",
    whatToShow:
      "Open /vs-tali. Land on the feature comparison row. Mention this is honest, not stacked.",
    whatToSay:
      "Honest comparison page Vero would publish tomorrow. Tali wins on a few things, Vero wins on more. Includes the things Tali does better so the page reads as credible to a clinician who's already demoed both. SEO target is 'tali ai vs vero', which has buyer intent.",
  },
  {
    id: "calculator",
    startSec: 315,
    endSec: 345,
    surface: "/calculator",
    beatLabel: "ROI calculator · any clinic size",
    whatToShow:
      "Open /calculator. Slide the panel-size input from 1500 to 2400. Let the numbers reflow. Pause on monthly hours saved.",
    whatToSay:
      "ROI math for any clinic size. Panel size, average notes per day, current after-hours minutes. Outputs hours back per month and dollar value. A rep can send the screenshot in a follow-up. The math is conservative, sourced, and the assumptions are visible.",
  },
  {
    id: "timeline",
    startSec: 345,
    endSec: 375,
    surface: "/timeline",
    beatLabel: "30/60/90 gantt",
    whatToShow:
      "Open /timeline. Show the gantt view of the 90-day plan. Hover one swimlane.",
    whatToSay:
      "30/60/90 as a gantt. Pipeline build, content engine, enterprise lane, hiring. So you can see what's parallel and what's sequenced. The first 14 days are ICP refinement and the second 14 are content. Nothing in week one assumes a tool we don't already have.",
    callout: "If they prefer prose, swap to /strategy here. Same content, different surface.",
  },
  {
    id: "close",
    startSec: 375,
    endSec: 390,
    surface: "/",
    beatLabel: "Close · the ask",
    whatToShow:
      "Back to home. Don't share the screen for the close, look at the camera.",
    whatToSay:
      "That's the demo. I want to keep talking next week. If this lands, I'll have it deployed against your real Attio in 48 hours and you'll see new pipeline by end of week two.",
  },
];

export const DEMO_TOTAL_SEC = DEMO_BEATS[DEMO_BEATS.length - 1]?.endSec ?? 0;
