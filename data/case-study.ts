/**
 * One named Ontario family physician, end-to-end.
 *
 * The lead below is a real seeded entry from /data/leads.json (lead_0042,
 * Dr. Yasmin Raza). Score 90, Mississauga, Telus PSS. Picked because she's
 * young in practice (registered 2019), solo clinic, and the Telus PSS angle
 * gives the EMR-specific opening that the rest of the demo uses elsewhere.
 *
 * Day 0 is the day the research note was written. Day 1 is first contact.
 * Reference start date is 2026-03-01 so close lands on 2026-03-29 (28 days).
 */

export type CaseStudyArtifact = {
  type:
    | "research-note"
    | "email"
    | "reply"
    | "calendar"
    | "transcript-excerpt"
    | "trial-metric"
    | "close-note";
  /** Short label shown next to the timestamp pill. */
  label: string;
  /** ISO timestamp. */
  occurredAt: string;
  /** Markdown-friendly body. Renderers handle bullets, lists, etc. */
  body: string;
  /** Optional structured meta (email headers, durations, attendees). */
  meta?: Record<string, string>;
};

export type CaseStudy = {
  /** Real lead id from /data/leads.json. */
  leadId: string;
  protagonist: { name: string; specialty: string; city: string; emr: string };
  outcome: "closed_won" | "trialing";
  closedAt: string;
  /** First-contact to close in days. */
  cycleDays: number;
  /** CAD ARR. */
  arr: number;
  /** 9-12 chronological artifacts. */
  artifacts: CaseStudyArtifact[];
};

export const CASE_STUDY: CaseStudy = {
  leadId: "lead_0042",
  protagonist: {
    name: "Dr. Yasmin Raza",
    specialty: "Family Medicine",
    city: "Mississauga, ON",
    emr: "Telus PSS",
  },
  outcome: "closed_won",
  closedAt: "2026-03-29T15:20:00.000Z",
  cycleDays: 28,
  arr: 720,
  artifacts: [
    {
      type: "research-note",
      label: "Research note",
      occurredAt: "2026-02-28T18:30:00.000Z",
      body: `**Why this lead.** CPSO 2019 registration → 6 yrs in practice, still in the cohort that builds workflows from scratch rather than defending sunk-cost templates. Solo at Mississauga Medical Group, Telus PSS shop, Hindi-speaking patient base.

**Lead with.** Doc-upload to PSS encounter. Heidi and Tali don't ship that path on PSS today. This is the wedge.

**Avoid.** Don't lead with price. Solo Mississauga GPs are price-sensitive but reading "$59.99" first frames Vero as a tool, not an outcome.

**Predicted EMR angle.** PSS users complain about the encounter-template lock-in. Pitch: dictate once, drop into PSS encounter as a doc upload, no template surgery.

**Predicted reply.** 14% open, 6% reply on Touch 1. Bump to 18% / 9% if Touch 2 names the doc-upload flow specifically.`,
      meta: {
        author: "Khush",
        score: "90 / 100",
        emr: "Telus PSS",
      },
    },
    {
      type: "email",
      label: "Touch 1 sent",
      occurredAt: "2026-03-01T13:42:00.000Z",
      body: `Dr. Raza,

Saw you registered with CPSO in 2019 and are running solo at Mississauga Medical Group on PSS. A few PSS users I've spoken with this month said the same thing: dictation tools work fine until the encounter template fights back.

Vero records the visit, drafts the note, and drops it into PSS as a doc upload, so your template stays intact and the chart still gets the SOAP it needs.

Worth 15 minutes next week to see it on a real PSS encounter?

Khush`,
      meta: {
        from: "khush@veroscribe.com",
        to: "y.raza@mississaugamedical.ca",
        subject: "PSS encounter, no template surgery",
        wordCount: "78",
        leverage: "doc-upload differentiator",
        predictedReplyRate: "9%",
      },
    },
    {
      type: "email",
      label: "Touch 2 sent",
      occurredAt: "2026-03-04T13:10:00.000Z",
      body: `Dr. Raza,

Quick follow-up. I know solo days run long and inbox triage isn't where you want to spend the evening.

One concrete number from a Mississauga GP on PSS who started two weeks ago: 38 minutes saved per clinic day, mostly on post-clinic charting. She kept her existing intake template; Vero just feeds the encounter.

Happy to send a 90-second Loom of the doc-upload step if useful, or grab 15 minutes Thursday or Friday.

Khush`,
      meta: {
        from: "khush@veroscribe.com",
        to: "y.raza@mississaugamedical.ca",
        subject: "Re: PSS encounter, no template surgery",
        wordCount: "84",
        leverage: "peer adoption",
        predictedReplyRate: "12%",
      },
    },
    {
      type: "reply",
      label: "Reply received",
      occurredAt: "2026-03-06T11:42:00.000Z",
      body: `Bus, but interested. What's the doc-upload thing about? My templates are the only reason I'm still on PSS.

Y`,
      meta: {
        from: "y.raza@mississaugamedical.ca",
        to: "khush@veroscribe.com",
        subject: "Re: PSS encounter, no template surgery",
      },
    },
    {
      type: "email",
      label: "Khush response",
      occurredAt: "2026-03-06T12:14:00.000Z",
      body: `Dr. Raza,

Short version: Vero records the visit, transcribes locally, drafts a SOAP note, and drops the finished note into the PSS encounter as a PDF doc upload tied to the patient. Your templates never get touched. The visit ends, the note is already there.

15 minutes on Monday at 4pm or Tuesday at 12:15pm? Calendar link below, pick whichever is less painful:

cal.com/khush/vero-15

Khush`,
      meta: {
        from: "khush@veroscribe.com",
        to: "y.raza@mississaugamedical.ca",
        subject: "Re: PSS encounter, no template surgery",
        wordCount: "73",
        leverage: "EMR-specific",
      },
    },
    {
      type: "calendar",
      label: "Demo booked",
      occurredAt: "2026-03-07T09:05:00.000Z",
      body: `**Vero · 15-min demo · Dr. Yasmin Raza**

- 15 minutes, Google Meet
- Tuesday Mar 9, 4:00pm – 4:15pm ET
- Booked via cal.com/khush/vero-15
- Calendar hold also placed for Wed Mar 10 in case Tuesday spills

**Agenda preview**

1. 60 seconds: what Vero does, plain words.
2. Live: PSS encounter open, 90-second mock visit, doc-upload lands.
3. Trial logistics: provisioning, Hindi handling, what week 1 looks like.`,
      meta: {
        attendees: "Dr. Yasmin Raza · Khush Agarwala",
        duration: "15 min",
        link: "meet.google.com/vfr-pkqa-xnz",
      },
    },
    {
      type: "transcript-excerpt",
      label: "Demo transcript",
      occurredAt: "2026-03-09T20:00:00.000Z",
      body: `K: Open PSS like you would on a Tuesday. I'll start the recording and we'll do the prenatal one we talked about.

Y: Okay. So this is the third-trimester check, 32 weeks, gestational diabetes flag.

K: Go ahead and run the visit like normal. I'll stay quiet.

Y: ...alright that was about 90 seconds, what now?

K: Look at the encounter. The PDF is already there. SOAP, vitals, plan, the GD flag carried into the assessment.

Y: Okay but what about my prenatal templates? I have a 14-field intake I built myself, I am not redoing that.

K: You don't. Vero never opens your template. The note lands as a doc upload next to it. Your template is the spine of the chart, Vero is a layer on top.

Y: ...fine. Send me the trial. Two weeks, real patients, and if it touches my templates I am out by Friday.

K: Deal. Provisioning email tomorrow morning, you'll be live by Wednesday.`,
      meta: {
        duration: "14 min 32 sec",
        attendees: "Khush · Dr. Yasmin Raza",
        objection: "prenatal templates",
      },
    },
    {
      type: "email",
      label: "Trial activation",
      occurredAt: "2026-03-10T14:22:00.000Z",
      body: `Dr. Raza,

You're provisioned. Login at app.veroscribe.com with the magic link below.

**EMR mapping decided.**
- PSS encounter type: Office Visit / Prenatal Visit
- Doc-upload destination: encounter attachments (not chart-level)
- Hindi handling: auto-detect, transcribe in source language, draft note in English

**First steps.**
1. 4-min training Loom: loom.com/share/vero-pss-onboard
2. Run one test visit on yourself or a colleague before a real patient
3. Reply to this thread with anything weird; I'll fix it that day

First real encounter is whenever you're ready. I'll be watching the activation feed for it.

Khush`,
      meta: {
        from: "khush@veroscribe.com",
        to: "y.raza@mississaugamedical.ca",
        subject: "You're live · Vero trial · 14 days",
        wordCount: "118",
        firstEncounterCaptured: "2026-03-10T18:47:00.000Z",
      },
    },
    {
      type: "trial-metric",
      label: "Trial · week 1",
      occurredAt: "2026-03-17T22:00:00.000Z",
      body: `Week 1 of the 14-day trial. Solo clinic days, prenatal-heavy book, no template touches.`,
      meta: {
        encountersCaptured: "6",
        timeSavedTotal: "38 min",
        chartingTimeDelta: "-42%",
        templateEditsRequired: "0",
        hindiAutoDetected: "2 / 6",
        weeklyNps: "n/a",
      },
    },
    {
      type: "trial-metric",
      label: "Trial · week 2",
      occurredAt: "2026-03-24T22:00:00.000Z",
      body: `Week 2. Volume up, one open ask: a "well-baby 2 month" template hint so the assessment lands in her preferred order. Logged for week-3 product backlog.`,
      meta: {
        encountersCaptured: "14",
        timeSavedTotal: "1h 27 min",
        chartingTimeDelta: "-46%",
        templateEditsRequired: "0",
        nps: "9 / 10",
        openAsk: "well-baby 2 mo template hint",
      },
    },
    {
      type: "close-note",
      label: "Close call",
      occurredAt: "2026-03-28T19:30:00.000Z",
      body: `**Close call · 22 minutes · Dr. Raza + Khush**

- Confirmed she would not go back to pre-trial state. Direct quote: "I am not charting on Saturdays again."
- Pricing: $59.99 / month, 12-month annual, $720 CAD ARR. Auto-renew on, opt-out anytime in app.
- Template ask logged: well-baby 2-month hint by end of Q2, no commitment on date.
- Reference customer at the 90-day mark: agreed in principle, will confirm by phone once.
- Billing handed to Stripe checkout link, payment cleared the same evening.`,
      meta: {
        duration: "22 min",
        plan: "$59.99/mo · annual · auto-renew",
        arr: "$720 CAD",
      },
    },
    {
      type: "close-note",
      label: "Close-won note",
      occurredAt: "2026-03-29T15:20:00.000Z",
      body: `**Closed-won · Dr. Yasmin Raza**

- Cycle: 28 days, first contact to signed.
- Touches to reply: 2 emails.
- Demo to trial: same call.
- Trial to close: 19 days.
- ARR: $720 CAD.
- NPS at close: 9 / 10.
- Reference customer: pencilled for 90-day check-in (Jun 27).
- Filed under: PSS · solo · Mississauga playbook. Two near-identical leads (lead_0218, lead_0331) sequenced for Touch 1 with the same opener.`,
      meta: {
        cycleDays: "28",
        arr: "$720 CAD",
        nps: "9 / 10",
        referenceAt90d: "yes (verbal)",
      },
    },
  ],
};
