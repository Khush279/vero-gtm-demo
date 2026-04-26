import type { Automation } from "@/lib/types";

/**
 * The five automations the demo claims to run. Each `sourcePath` points at a
 * real, readable file in this repo so the /automations page can load and
 * syntax-highlight the source at build time.
 */
export const AUTOMATIONS: Automation[] = [
  {
    id: "auto_cpso_scrape",
    name: "Daily CPSO scrape",
    description:
      "Fetches the College of Physicians and Surgeons of Ontario public register, throttled to 1 req/sec, parses each profile, and upserts into the leads table.",
    trigger: "Cron: every day at 03:15 ET",
    lastRun: {
      at: "2026-04-26T07:16:42.000Z",
      status: "success",
      note: "417 profiles refreshed, 12 new leads created.",
    },
    sourcePath: "automations/cpso-scrape.ts",
    sourceSummary:
      "Throttled fetch + cheerio HTML parser; idempotent upsert keyed on CPSO number; respects robots.txt and a 1 req/sec floor.",
  },
  {
    id: "auto_score_recalc",
    name: "ICP score recalculator",
    description:
      "Re-runs the lead scoring function against every lead. Fast, pure, deterministic. Emits a diff to the audit log if any lead's score moves more than 5 points.",
    trigger: "Webhook: triggered on lead create/update + nightly safety net",
    lastRun: {
      at: "2026-04-26T08:02:11.000Z",
      status: "success",
      note: "500 leads scored in 84ms; 7 score deltas > 5pt.",
    },
    sourcePath: "automations/score-recalc.ts",
    sourceSummary:
      "Reads data/leads.json, maps each lead through scoreLead(), writes back if anything changed. Pure function; safe to run on every save.",
  },
  {
    id: "auto_reply_webhook",
    name: "Reply detection webhook",
    description:
      "Receives Postmark inbound webhooks. Classifies the reply as positive, negative, OOO, or unsubscribe, then advances the lead's stage and pauses any in-flight sequence touches.",
    trigger: "Webhook: POST /webhooks/postmark/inbound",
    lastRun: {
      at: "2026-04-26T06:48:09.000Z",
      status: "success",
      note: "3 replies processed; 1 demo_booked, 1 OOO, 1 unsubscribe.",
    },
    sourcePath: "automations/reply-webhook.ts",
    sourceSummary:
      "Express-style handler. Parses Postmark payload, runs a lightweight intent classifier, mutates the lead stage, queues the next-action.",
  },
  {
    id: "auto_slack_alert",
    name: "Demo-booked → Slack alert",
    description:
      "When any lead transitions to demo_booked, posts a one-line summary into the #gtm-pipeline Slack channel so Adeel and Bill see new bookings in real time.",
    trigger: "Event: lead.stage_changed = demo_booked",
    lastRun: {
      at: "2026-04-26T05:34:00.000Z",
      status: "success",
      note: "1 message posted (Dr. Aisha Khan, Brampton FP).",
    },
    sourcePath: "automations/slack-alert.ts",
    sourceSummary:
      "Single fetch() call to a Slack incoming webhook URL; formats the lead with city, score, and a deep-link back to the lead profile.",
  },
  {
    id: "auto_touch_nightly",
    name: "Touch-due nightly cron",
    description:
      "Walks every lead with nextTouchAt <= now and dispatches the next sequence step. Skips leads that have replied or unsubscribed since the touch was scheduled.",
    trigger: "Cron: every day at 06:00 ET",
    lastRun: {
      at: "2026-04-26T10:00:14.000Z",
      status: "success",
      note: "62 touches dispatched, 4 skipped due to recent replies.",
    },
    sourcePath: "automations/touch-nightly.ts",
    sourceSummary:
      "Loads leads.json, filters by nextTouchAt window, generates the next email via the prompt builder, and enqueues it for send.",
  },
];
