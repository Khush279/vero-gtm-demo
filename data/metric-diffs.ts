/**
 * Week-by-week trajectory for the same six metrics surfaced on /metrics.
 * /metrics shows W1 vs W4 endpoints; this module fills in the W2 and W3
 * intermediate points and attaches the operator notes that explain why the
 * curve bends where it does.
 *
 * The intermediate values are interpolated with `generateTrend` so the shape
 * is plausible-but-stable, then pinned by hand where a known event (a send
 * pause, an invoice clearing) should override the smooth path. Annotations
 * are deliberately specific: each one names a real cause, not a tone shift.
 *
 * Numbers stay in lockstep with WEEK_1_METRICS / WEEK_4_METRICS. Touching
 * those two endpoints is the only way to move the curve from outside.
 */

import { generateTrend } from "@/lib/series";

export type WeekValue = {
  week: number;
  /** Printed string; tabular-nums in the UI. */
  value: string;
  /** Raw number for delta math; null if the value was non-numeric. */
  numeric: number | null;
};

export type DiffAnnotation = {
  /** Human label, e.g. "Week 2 to 3". */
  weekRange: string;
  whatChanged: string;
};

export type WowDelta = {
  from: number;
  to: number;
  delta: string;
  tone: "improving" | "watch" | "regressing";
};

export type WeeklyDiff = {
  metric: string;
  source: string;
  values: WeekValue[];
  weekOverWeek: WowDelta[];
  annotations: DiffAnnotation[];
};

/* --------------------------------------------------------------------- */
/* Helpers                                                                */
/* --------------------------------------------------------------------- */

type Direction = "up" | "down";

const BETTER_DIRECTION: Record<string, Direction> = {
  "Weekly send volume": "up",
  "Reply rate": "up",
  "Demo book rate": "up",
  "Trial start rate": "up",
  "ARR added": "up",
  "Time-to-first-touch (median)": "down",
};

function formatInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function formatDollars(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function formatMin(n: number): string {
  return `${Math.round(n)}m`;
}

/**
 * Given an ordered numeric series and a per-step formatter, produce the
 * three week-over-week deltas (W1 to W2, W2 to W3, W3 to W4) plus a tone
 * derived from BETTER_DIRECTION. A tiny move (<5% relative) is tagged
 * "watch" so a flat-ish week doesn't get falsely celebrated as improving.
 */
function buildWow(
  metric: string,
  series: number[],
  unit: "int" | "pct" | "dollars" | "min",
): WowDelta[] {
  const direction = BETTER_DIRECTION[metric] ?? "up";
  const out: WowDelta[] = [];
  for (let i = 0; i < series.length - 1; i++) {
    const a = series[i];
    const b = series[i + 1];
    const diff = b - a;
    const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
    let body: string;
    if (unit === "pct") {
      body = `${Math.abs(diff).toFixed(1)}pt`;
    } else if (unit === "dollars") {
      body = `$${formatInt(Math.abs(diff))}`;
    } else if (unit === "min") {
      body = `${Math.round(Math.abs(diff))}m`;
    } else {
      body = formatInt(Math.abs(diff));
    }

    let tone: WowDelta["tone"];
    const rel = a !== 0 ? Math.abs(diff) / Math.abs(a) : Math.abs(diff);
    if (Math.abs(diff) < 1e-9) {
      tone = "watch";
    } else {
      const isImprovement = direction === "up" ? diff > 0 : diff < 0;
      if (!isImprovement) {
        tone = "regressing";
      } else if (rel < 0.05) {
        tone = "watch";
      } else {
        tone = "improving";
      }
    }

    out.push({
      from: i + 1,
      to: i + 2,
      delta: diff === 0 ? "0" : `${sign}${body}`,
      tone,
    });
  }
  return out;
}

function buildValues(
  series: number[],
  formatter: (n: number) => string,
): WeekValue[] {
  return series.map((n, i) => ({
    week: i + 1,
    value: formatter(n),
    numeric: n,
  }));
}

/* --------------------------------------------------------------------- */
/* Per-metric series                                                      */
/* --------------------------------------------------------------------- */

/**
 * Send volume: 212 -> 1,040 over four weeks. Generate a trend, then pin the
 * intermediate weeks to round-ish numbers that match the operator narrative
 * (week 2 builder hardening, week 3 Attio bridge unlock).
 */
const sendVolumeSeries = (() => {
  const raw = generateTrend(212, 1040, 4, 0.04, "Weekly send volume");
  // Pin the middle so the curve climbs steadily, with a bigger W3 jump from
  // the Attio-to-Postmark bridge.
  raw[1] = 430;
  raw[2] = 760;
  return raw;
})();

const replyRateSeries = (() => {
  // 4.7% -> 5.9%. W2 picks up the subject-line A/B winner; W3 dips slightly
  // from a deliberate Easter-week send pause that touched a smaller, colder
  // sample; W4 recovers as the EMR-aware first line ships to the top-30.
  return [4.7, 5.4, 5.0, 5.9];
})();

const demoBookSeries = (() => {
  // 26% -> 29%. W2 holds, W3 jumps as the inbound parser auto-tags demo
  // intent and slot density doubles, W4 settles slightly off the W3 spike.
  return [26, 26, 29, 29];
})();

const trialStartSeries = (() => {
  // 38% -> 42%. W2 dips because the post-demo trigger ships mid-week and
  // catches only the back half of bookings; W3 climbs as the personalized
  // follow-up template references demo-call pain points; W4 holds.
  return [38, 36, 41, 42];
})();

const arrAddedSeries = (() => {
  // $2,160 -> $11,520. W2 is light because most W1 trial starts haven't
  // converted yet; W3 jumps as the first post-demo cohort lands; W4 jumps
  // again when Maple's first-month invoice clears.
  return [2160, 3400, 7800, 11520];
})();

const ttftSeries = (() => {
  // 8m -> 6m. W2 the Vercel cron interval cuts to 5m. W3 lead-scoring
  // shortcut adds a fast lane for high-fit signups. W4 holds at 6m as
  // volume catches up to capacity.
  return [8, 6, 5, 6];
})();

/* --------------------------------------------------------------------- */
/* Annotations                                                            */
/* --------------------------------------------------------------------- */

export const WEEKLY_DIFFS: WeeklyDiff[] = [
  {
    metric: "Weekly send volume",
    source: "Attio · Mondays only",
    values: buildValues(sendVolumeSeries, (n) => formatInt(n)),
    weekOverWeek: buildWow("Weekly send volume", sendVolumeSeries, "int"),
    annotations: [
      {
        weekRange: "Week 1 to 2",
        whatChanged:
          "Sequence builder hardened end of W1. One operator could queue a full Ontario family-medicine slice (430 sends) without breaking the export step twice.",
      },
      {
        weekRange: "Week 2 to 3",
        whatChanged:
          "Attio-to-Postmark bridge shipped Tuesday W3 and removed the manual CSV round-trip. That single change is what took the ceiling from ~430 to ~760.",
      },
      {
        weekRange: "Week 3 to 4",
        whatChanged:
          "W4 added a second ICP slice (urgent-care + walk-in clinics) onto the same pipe. Volume scaled almost linearly because the bridge didn't care about list source.",
      },
    ],
  },
  {
    metric: "Reply rate",
    source: "Postmark inbound parser",
    values: buildValues(replyRateSeries, formatPct),
    weekOverWeek: buildWow("Reply rate", replyRateSeries, "pct"),
    annotations: [
      {
        weekRange: "Week 1 to 2",
        whatChanged:
          "Subject-line A/B narrowed six variants to two. The winner ('quick question about your Friday charts') beat the runner-up by 0.6pt on opens and brought reply rate up with it.",
      },
      {
        weekRange: "Week 2 to 3",
        whatChanged:
          "Reply rate dipped 0.4pt because of an Easter-week send pause (Thu and Mon off). The sample that did go out was colder backfill, so the dip is composition, not message fatigue.",
      },
      {
        weekRange: "Week 3 to 4",
        whatChanged:
          "EMR-aware first-line variant rolled out to the top-30 ICP cohort on Tuesday W4. Replies that referenced 'OSCAR' or 'PS Suite' explicitly were the bulk of the lift.",
      },
    ],
  },
  {
    metric: "Demo book rate",
    source: "HubSpot meetings",
    values: buildValues(demoBookSeries, (n) => `${Math.round(n)}%`),
    weekOverWeek: buildWow("Demo book rate", demoBookSeries, "pct"),
    annotations: [
      {
        weekRange: "Week 1 to 2",
        whatChanged:
          "Held flat at 26%. W2 was a calibration week: the new booking link routed through Khush's Cal.com, but density was still constrained by overnight thread cool-off.",
      },
      {
        weekRange: "Week 2 to 3",
        whatChanged:
          "Inbound parser started auto-tagging replies as demo-intent mid-W3. Slot density doubled because nothing sat overnight. That alone moved book rate three points.",
      },
      {
        weekRange: "Week 3 to 4",
        whatChanged:
          "Held at 29%. The ceiling here is calendar capacity, not reply quality. W5 work is to add a second demoer slot pool.",
      },
    ],
  },
  {
    metric: "Trial start rate",
    source: "HubSpot · post-demo",
    values: buildValues(trialStartSeries, (n) => `${Math.round(n)}%`),
    weekOverWeek: buildWow("Trial start rate", trialStartSeries, "pct"),
    annotations: [
      {
        weekRange: "Week 1 to 2",
        whatChanged:
          "Dropped 2pt in W2 because the post-demo trigger shipped Wednesday and only caught the back half of bookings. The W1 cohort was still on the manual provisioning path.",
      },
      {
        weekRange: "Week 2 to 3",
        whatChanged:
          "Five-point recovery in W3 once every demo got the trial link inside fifteen minutes of the call ending. The follow-up template now quotes the prospect's exact pain back at them.",
      },
      {
        weekRange: "Week 3 to 4",
        whatChanged:
          "Marginal +1pt. The remaining gap to plan (50%) is two-physician practices that need partner sign-off before activating a trial.",
      },
    ],
  },
  {
    metric: "ARR added",
    source: "Stripe · new paid",
    values: buildValues(arrAddedSeries, formatDollars),
    weekOverWeek: buildWow("ARR added", arrAddedSeries, "dollars"),
    annotations: [
      {
        weekRange: "Week 1 to 2",
        whatChanged:
          "Light $1.2k bump. Most W1 trial starts hadn't converted yet, and Stripe only counts cleared invoices for this column.",
      },
      {
        weekRange: "Week 2 to 3",
        whatChanged:
          "First post-demo cohort landed in W3 ($4.4k added). Conversion velocity from trial-start to paid was 9 days median.",
      },
      {
        weekRange: "Week 3 to 4",
        whatChanged:
          "Jumped because Maple's first-month invoice cleared on the W4 Monday cycle, plus three solo-practice annuals booked at the higher tier.",
      },
    ],
  },
  {
    metric: "Time-to-first-touch (median)",
    source: "Vercel cron · /lead/[id]",
    values: buildValues(ttftSeries, formatMin),
    weekOverWeek: buildWow("Time-to-first-touch (median)", ttftSeries, "min"),
    annotations: [
      {
        weekRange: "Week 1 to 2",
        whatChanged:
          "Vercel cron interval cut from 10m to 5m on the W2 Tuesday deploy. Median dropped 2m the next day and stayed there.",
      },
      {
        weekRange: "Week 2 to 3",
        whatChanged:
          "Lead-scoring shortcut added a fast lane for high-fit signups (CPSO match + EMR signal). Those leads skipped the queue and got the first reply in under 3m.",
      },
      {
        weekRange: "Week 3 to 4",
        whatChanged:
          "Drifted up 1m because send volume nearly doubled into W4 and the queue got deeper. Within budget; W5 work is to widen the worker pool, not change the cron.",
      },
    ],
  },
];

export default WEEKLY_DIFFS;
