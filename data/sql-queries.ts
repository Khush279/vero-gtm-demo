/**
 * Five SQL queries Khush would run against Vero's warehouse during week one.
 * Postgres-flavoured because Attio + HubSpot + Stripe data most often lands in
 * a Postgres or Snowflake mirror via Fivetran. Each query is paired with the
 * business question it answers and the analysis call it supports, so the page
 * reads as "self-service analytics" rather than "look how I formatted SQL."
 *
 * Schema assumed (sensible defaults; no real DB exists for the demo):
 *   lead(id, created_at, city, province, source_channel, inferred_emr,
 *        practice_size, owner_email)
 *   outreach_touch(id, lead_id, sent_at, replied_at, channel, sequence_step)
 *   demo_call(id, lead_id, scheduled_for, status, source_channel, no_show)
 *   pipeline_opportunity(id, lead_id, stage, arr_cents, owner, updated_at)
 *   customer_account(id, lead_id, plan, mrr_cents, signed_at)
 *   customer_usage_daily(account_id, day, encounters, last_login_at)
 *   nps_response(account_id, score, submitted_at, comment)
 */

export type SqlQuery = {
  id: string;
  title: string;
  question: string;
  warehouse: "Postgres" | "Snowflake" | "BigQuery";
  query: string;
  expectedColumns: string[];
  sampleOutput: string[][];
  analysisCallout: string;
  cadence: "ad-hoc" | "weekly" | "daily" | "real-time";
};

export const SQL_QUERIES: SqlQuery[] = [
  {
    id: "sql_reply_rate_by_city_emr",
    title: "Reply rate by city + EMR cohort",
    question:
      "Which city plus EMR combinations are punching above the average reply rate so we know where to double down on send volume?",
    warehouse: "Postgres",
    cadence: "weekly",
    query: `-- Reply rate by city + inferred EMR, last 28 days of outbound.
-- Grouped tight enough to act on, loose enough to have N >= 20 per cell.
WITH touches AS (
  -- Only first-touch sends so we are measuring outbound, not nurture.
  SELECT
    t.lead_id,
    t.sent_at,
    t.replied_at
  FROM outreach_touch AS t
  WHERE t.sequence_step = 1
    AND t.sent_at >= NOW() - INTERVAL '28 days'
)
SELECT
  l.city,
  COALESCE(l.inferred_emr, 'unknown')           AS inferred_emr,
  COUNT(*)                                       AS sent,
  COUNT(t.replied_at)                            AS replied,
  ROUND(
    100.0 * COUNT(t.replied_at) / NULLIF(COUNT(*), 0),
    2
  )                                              AS reply_rate_pct
FROM touches AS t
JOIN lead AS l
  ON l.id = t.lead_id
GROUP BY l.city, COALESCE(l.inferred_emr, 'unknown')
HAVING COUNT(*) >= 20                            -- statistical floor
ORDER BY reply_rate_pct DESC NULLS LAST
LIMIT 25;`,
    expectedColumns: ["city", "inferred_emr", "sent", "replied", "reply_rate_pct"],
    sampleOutput: [
      ["Toronto", "Telus PSS", "84", "9", "10.71"],
      ["Mississauga", "OSCAR", "62", "5", "8.06"],
      ["Brampton", "Telus PSS", "47", "3", "6.38"],
      ["Toronto", "Accuro", "108", "5", "4.63"],
      ["Hamilton", "unknown", "39", "1", "2.56"],
    ],
    analysisCallout:
      "If Toronto plus Telus PSS is replying at more than 2x the floor, I shift 30 percent of next week's send budget into that cohort and brief Adeel before the Monday standup. The OSCAR variant gets a subject-line A/B because the volume is there but the lift is half.",
  },
  {
    id: "sql_pipeline_weighted_arr",
    title: "Pipeline weighted ARR by stage",
    question:
      "What's the bottoms-up forecast if every open opportunity converts at its historical stage rate, and where is the weighted ARR concentrated?",
    warehouse: "Postgres",
    cadence: "weekly",
    query: `-- Bottoms-up pipeline math. Stage weights are the trailing 90-day
-- conversion rates from each stage to closed_won, computed inline so the
-- forecast self-corrects as the pipeline ages.
WITH stage_weights AS (
  -- Rolling close rate per stage. Coalesce so empty stages don't drop rows.
  SELECT
    stage,
    COALESCE(
      AVG(CASE WHEN final_stage = 'closed_won' THEN 1.0 ELSE 0.0 END),
      0
    ) AS win_rate
  FROM pipeline_opportunity_history
  WHERE entered_stage_at >= NOW() - INTERVAL '90 days'
  GROUP BY stage
)
SELECT
  o.stage,
  COUNT(*)                                       AS open_opps,
  SUM(o.arr_cents) / 100.0                       AS raw_arr_usd,
  ROUND(sw.win_rate, 3)                          AS stage_win_rate,
  ROUND(SUM(o.arr_cents) * sw.win_rate / 100.0, 2) AS weighted_arr_usd
FROM pipeline_opportunity AS o
LEFT JOIN stage_weights AS sw
  ON sw.stage = o.stage
WHERE o.stage NOT IN ('closed_won', 'closed_lost')  -- open pipe only
GROUP BY o.stage, sw.win_rate
ORDER BY weighted_arr_usd DESC NULLS LAST;`,
    expectedColumns: [
      "stage",
      "open_opps",
      "raw_arr_usd",
      "stage_win_rate",
      "weighted_arr_usd",
    ],
    sampleOutput: [
      ["demo_booked", "14", "33600.00", "0.420", "14112.00"],
      ["trial_started", "9", "21600.00", "0.610", "13176.00"],
      ["replied", "31", "74400.00", "0.110", "8184.00"],
      ["proposal_sent", "4", "9600.00", "0.580", "5568.00"],
      ["sequenced", "212", "508800.00", "0.008", "4070.40"],
    ],
    analysisCallout:
      "Sequenced has the largest raw ARR but converts at 0.8 percent, so the real leverage is moving more leads from replied into demo_booked. I take that read into the Friday pipeline review and propose pulling one engineer-hour into a faster meeting-link automation.",
  },
  {
    id: "sql_time_to_first_touch",
    title: "Time-to-first-touch p50 / p90",
    question:
      "How fast are we actually reaching new leads, measured at the median and the long tail, so we know if the SLA holds under volume?",
    warehouse: "Postgres",
    cadence: "daily",
    query: `-- Latency from lead created to touch-1 sent. Window function picks the
-- earliest send per lead so re-sequenced leads don't double count.
WITH first_touch AS (
  SELECT
    t.lead_id,
    t.sent_at,
    ROW_NUMBER() OVER (
      PARTITION BY t.lead_id
      ORDER BY t.sent_at ASC
    ) AS touch_rank
  FROM outreach_touch AS t
  WHERE t.sequence_step = 1
),
latencies AS (
  -- One row per lead. Latency in seconds; convert at the percentile step.
  SELECT
    l.id                                                      AS lead_id,
    l.source_channel,
    EXTRACT(EPOCH FROM (ft.sent_at - l.created_at))            AS latency_sec
  FROM lead AS l
  JOIN first_touch AS ft
    ON ft.lead_id = l.id AND ft.touch_rank = 1
  WHERE l.created_at >= NOW() - INTERVAL '14 days'
)
SELECT
  source_channel,
  COUNT(*)                                                     AS leads,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY latency_sec) / 60.0, 1) AS p50_minutes,
  ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY latency_sec) / 60.0, 1) AS p90_minutes
FROM latencies
GROUP BY source_channel
ORDER BY p90_minutes ASC NULLS LAST;`,
    expectedColumns: ["source_channel", "leads", "p50_minutes", "p90_minutes"],
    sampleOutput: [
      ["cpso_scrape", "417", "6.2", "11.4"],
      ["referral", "23", "8.8", "14.0"],
      ["website_form", "31", "9.1", "47.6"],
      ["linkedin_inbound", "12", "22.4", "94.1"],
      ["partner_intro", "7", "61.0", "180.0"],
    ],
    analysisCallout:
      "CPSO scrape is well inside the 15-minute SLA, but website_form has a p90 of 47 minutes which means a quarter of those leads are aging past the warm window. I write a one-line cron alert that pages me when website_form p90 crosses 30 and ship it the same day.",
  },
  {
    id: "sql_demo_no_show_by_channel",
    title: "Demo no-show rate by source channel",
    question:
      "Which source channels are filling the calendar with people who don't actually show up, so we can stop counting bookings as a vanity metric?",
    warehouse: "Postgres",
    cadence: "weekly",
    query: `-- No-show rate by source channel for demos scheduled in the last 30 days.
-- Filters to demos that have already had their scheduled time pass so the
-- denominator only includes calls that had a chance to be a no-show.
SELECT
  l.source_channel,
  COUNT(*)                                       AS demos_scheduled,
  COUNT(*) FILTER (WHERE d.no_show = TRUE)       AS no_shows,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE d.no_show = TRUE)
      / NULLIF(COUNT(*), 0),
    2
  )                                              AS no_show_rate_pct,
  ROUND(AVG(EXTRACT(EPOCH FROM (d.scheduled_for - d.booked_at)) / 3600.0), 1)
                                                 AS avg_lead_time_hours
FROM demo_call AS d
JOIN lead AS l
  ON l.id = d.lead_id
WHERE d.scheduled_for >= NOW() - INTERVAL '30 days'
  AND d.scheduled_for < NOW()                    -- only past demos
  AND d.status IN ('completed', 'no_show')       -- exclude reschedules
GROUP BY l.source_channel
HAVING COUNT(*) >= 5
ORDER BY no_show_rate_pct DESC NULLS LAST;`,
    expectedColumns: [
      "source_channel",
      "demos_scheduled",
      "no_shows",
      "no_show_rate_pct",
      "avg_lead_time_hours",
    ],
    sampleOutput: [
      ["linkedin_inbound", "11", "5", "45.45", "18.4"],
      ["partner_intro", "8", "3", "37.50", "9.1"],
      ["website_form", "17", "5", "29.41", "26.2"],
      ["cpso_scrape", "62", "9", "14.52", "44.0"],
      ["referral", "14", "1", "7.14", "32.8"],
    ],
    analysisCallout:
      "LinkedIn inbound books at 45 percent no-show, which is a vanity-booking problem, not a demand problem. I add a 24-hour SMS confirm step for that channel only and revisit the number in two weeks before deciding whether to deprioritize the channel.",
  },
  {
    id: "sql_customer_health_score",
    title: "Customer health score (combined NPS + usage)",
    question:
      "Which paying accounts are at risk this week based on usage decay, login recency, and last NPS so we can call them before they churn?",
    warehouse: "Postgres",
    cadence: "weekly",
    query: `-- Composite at-risk score per paying account. Each input is normalized to
-- 0-1 and combined with a weighting that reflects what actually predicts
-- churn in this segment: usage drop matters most, then NPS, then login gap.
WITH encounters_this_week AS (
  -- Sum encounters in the trailing 7 days.
  SELECT
    account_id,
    SUM(encounters) AS encounters_7d
  FROM customer_usage_daily
  WHERE day >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY account_id
),
encounters_prior_week AS (
  SELECT
    account_id,
    SUM(encounters) AS encounters_prior_7d
  FROM customer_usage_daily
  WHERE day >= CURRENT_DATE - INTERVAL '14 days'
    AND day <  CURRENT_DATE - INTERVAL '7 days'
  GROUP BY account_id
),
last_login AS (
  SELECT
    account_id,
    MAX(last_login_at) AS last_login_at
  FROM customer_usage_daily
  GROUP BY account_id
),
last_nps AS (
  -- Most recent NPS per account, if any.
  SELECT DISTINCT ON (account_id)
    account_id,
    score,
    submitted_at
  FROM nps_response
  ORDER BY account_id, submitted_at DESC
)
SELECT
  ca.id                                          AS account_id,
  ca.plan,
  COALESCE(et.encounters_7d, 0)                  AS encounters_7d,
  COALESCE(ep.encounters_prior_7d, 0)            AS encounters_prior_7d,
  COALESCE(ln.score, 0)                          AS last_nps_score,
  EXTRACT(DAY FROM (NOW() - ll.last_login_at))   AS days_since_login,
  ROUND(
    -- Weighted at-risk score: 0 healthy, 1 at risk.
    0.5 * GREATEST(
            0,
            1 - (COALESCE(et.encounters_7d, 0)::NUMERIC
                 / NULLIF(ep.encounters_prior_7d, 0))
          )
    + 0.3 * (1 - COALESCE(ln.score, 5) / 10.0)
    + 0.2 * LEAST(EXTRACT(DAY FROM (NOW() - ll.last_login_at)) / 14.0, 1.0),
    3
  )                                              AS at_risk_score
FROM customer_account AS ca
LEFT JOIN encounters_this_week  AS et ON et.account_id = ca.id
LEFT JOIN encounters_prior_week AS ep ON ep.account_id = ca.id
LEFT JOIN last_login            AS ll ON ll.account_id = ca.id
LEFT JOIN last_nps              AS ln ON ln.account_id = ca.id
WHERE ca.plan IN ('paid_solo', 'paid_clinic')
ORDER BY at_risk_score DESC NULLS LAST
LIMIT 20;`,
    expectedColumns: [
      "account_id",
      "plan",
      "encounters_7d",
      "encounters_prior_7d",
      "last_nps_score",
      "days_since_login",
      "at_risk_score",
    ],
    sampleOutput: [
      ["acct_0142", "paid_clinic", "12", "78", "4", "9", "0.812"],
      ["acct_0091", "paid_solo", "0", "31", "7", "12", "0.731"],
      ["acct_0207", "paid_clinic", "44", "62", "5", "3", "0.402"],
      ["acct_0058", "paid_solo", "61", "59", "9", "1", "0.082"],
      ["acct_0188", "paid_clinic", "104", "98", "10", "0", "0.014"],
    ],
    analysisCallout:
      "acct_0142 dropped from 78 encounters to 12 in a week with an NPS of 4. That is the call I am making on Tuesday, before the renewal conversation gets harder. The score is meant to surface the top three to call, not replace the human read on why usage moved.",
  },
];
