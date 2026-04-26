# Solo FP cold sequence. 4 touch / 16 day playbook

**Audience.** Solo Family Physician, T1 Ontario city, ICP score >= 75, no current AI scribe usage.
**Channel.** Email. Same thread for every follow-up; never a new subject line.
**Goal.** Book a 15-minute demo within 16 days of the first send.

**Expected outcomes.** Open rate >= 35%. Reply rate >= 6%. Demo book rate >= 1.5%. Demo to trial >= 40%.

**Ship time.** 1 day to template the first cohort. ~2 hrs/week to operate at 1,000 sends/week.

---

## Pre-flight checklist

Before any send leaves the queue, the operator confirms five things. If any one fails, the lead drops back to the enrichment pile, not the send pile.

1. **CASL consent basis is recorded.** Every Ontario FP we mail is reachable under the implied-consent provision for business communications relevant to their professional role. Basis logged on the lead record (CPSO public register + clinic website listing the address as a place of business).
2. **Suppression list checked.** Anyone who has ever clicked unsubscribe, replied "remove", or churned a Vero trial is filtered before the queue is built. Suppression is global, not per-sequence.
3. **From identity is valid.** Sends go from a real human at vero.com (DKIM, SPF, DMARC aligned). Never a no-reply address. Reply-to threads back to the same inbox.
4. **First 50 are hand-reviewed.** Every new sequence variant gets 50 sends shipped under a human's eyes before the queue auto-drains. Catch tone misses, broken merge tokens, and bad city inferences before the next 950.
5. **EMR inference is set or null.** If we cannot infer the EMR from the clinic website or a public OSCAR / Telus PSS provider directory, the merge token defaults to a generic line. We never guess.

---

## Touch 1. Day 1. Pricing anchor + EMR-aware open

Sent Tuesday or Wednesday morning, 7:45a to 9:15a Eastern. Subject lines stay under 50 characters so the iPhone preview shows the whole line.

```
Subject: {{firstName}}, $74/mo for {{city}} family practice

Hi Dr. {{lastName}},

I run growth at Vero, the AI medical scribe built in Toronto.
Most {{city}} family physicians I talk to are spending 90 to
120 minutes a day on charting after the last patient leaves.
Vero takes that to under 15.

We're $59.99 to $89 a month, not $300, and we're already
running inside {{inferredEmr}} workflows in Ontario. The
setup is a 4-minute install. No IT ticket, no new login on
exam-room screens.

Worth a 15-minute demo this week? I have Wednesday 4:30p or
Thursday 12:15p open.

Khush
```

**Operator notes.**
- `{{inferredEmr}}` falls back to "your EMR" if null. Never write "OSCAR or Telus". Pick one or skip the line.
- Subject avoids "introducing", "quick question", and "AI". All three depress open rate by 4 to 7 points.
- The two demo times must be real on the calendar. If they're not, the open-to-reply ratio collapses.

---

## Touch 2. Day 4. Doc upload differentiator

Sent Saturday morning so it sits at the top of Monday's inbox. Same thread, "Re:" the original subject. Never a new thread.

```
Subject: Re: {{firstName}}, $74/mo for {{city}} family practice

Quick follow-up, Dr. {{lastName}}.

One thing Vero does that the bigger names don't: you can drop
a referral letter, a consult note, or a patient-uploaded PDF
straight into the encounter and the note picks up the context.
Tali doesn't. DAX doesn't. It's the difference between dictating
"patient brings a 6-page cardiology consult" and the scribe
actually reading it.

If you want to see it in 4 minutes, here's the demo link:
{{bookingUrl}}

Or just reply with a time.

Khush
```

**Operator notes.** Competitor names stay in the email. Procurement-aware FPs have already searched "vero vs tali"; naming the comparison is honesty. If the lead opened touch 1 twice or more, swap the close to "Saw you opened the first note. Happy to answer in writing if email is easier."

---

## Touch 3. Day 9. PIPEDA + Ontario VoR moat

Different angle, same thread. Lands with FPs who got nervous about US-hosted scribes after the 2024 OIPC bulletin.

```
Subject: Re: {{firstName}}, $74/mo for {{city}} family practice

Dr. {{lastName}}, one more, then I'll stop.

The reason most {{city}} FPs end up on Vero instead of the
American options: every byte of PHI stays in Canadian data
centres (Montreal primary, Toronto secondary), the LLM
inference runs on Canadian-hosted endpoints, and we're on
the Ontario Health Vendor of Record list. If your clinic
ever joins an FHT or OHT, you don't restart the procurement
clock.

If PIPEDA, data residency, or college-audit-readiness has
been the blocker, that's the 5-minute conversation I'd want
to have. Reply "send the one-pager" and I'll forward our
privacy summary instead of pushing for a call.

Khush
```

**Operator notes.** "Reply send the one-pager" CTA converts at 3 to 4x the calendar-link CTA for FPs over 50. Asset is `/assets/vero-privacy-onepager-2026Q1.pdf`, attached automatically by the reply handler.

---

## Touch 4. Day 16. Soft break-up + peer adoption

Final touch. Built to either close the loop or surface a real reason to stop. Anything past day 16 stops compounding and starts annoying.

```
Subject: Re: {{firstName}}, $74/mo for {{city}} family practice

Dr. {{lastName}},

I'll stop after this one.

Vero has crossed 4,200 active providers across Canada and the
US, including a growing cluster in {{city}} and the surrounding
GTA. Some switched from Tali, some from manual dictation, some
came off the wait-list at their FHT. The common thread is they
got the after-clinic charting block back.

If now is not the time, no problem. Reply "later" and I'll
check back in the fall. If it never is, reply "no" and I'll
take the file off my list permanently.

Either way, thanks for the work you do.

Khush
```

---

## Reply handling

Replies are classified inside 4 minutes by the reply-classifier model (production after Day 60; regex stub before that). Routing rules:

- **Positive intent** ("yes", "send a time", question about pricing or EMR fit). Posts to #gtm in Slack with the lead card. Human responds inside 15 minutes during business hours, by 9a next business day otherwise.
- **Out of office.** Held in a delay queue and resumed exactly one day after the OOO end date the parser extracts. If no end date is parseable, default 7-day delay.
- **Negative but engaged** ("not now", "use Tali", specific objection). Routes to the human queue with a "no calendar push" flag. Response is a one-line acknowledgement plus an asset matched to the objection.
- **Unsubscribe** ("remove", "stop", "unsubscribe"). Suppression added inside 60 seconds. Confirmation email under the From identity. Locked out of every future sequence permanently.
- **Auto-reply / bounce.** Routed to the bounce-handling automation, not the human queue. Three soft bounces or one hard bounce removes the address.

---

## Weekly rollup

Per touch, log: send timestamp, subject variant, body variant, EMR token, city, opens (count + last), clicks (URL + count), reply (raw text + classifier label), demo booking (yes/no + slot).

Shipped to #gtm every Monday 8a Eastern:

- Sends, opens, replies, demos by **EMR cohort** (OSCAR, Telus PSS, Accuro, Practice Solutions, unknown). Variance across cohorts is the most actionable signal.
- Sends, opens, replies, demos by **city tier** (T1 / T2 / rest).
- Top 5 reply texts marked positive intent, copy-pasted in full. Sales reads these out loud in Tuesday review. This is the qualitative signal the dashboard does not surface.
- Suppression-list adds for the week with trigger reason. Anything above 2% of sends in a week is a quality alarm and the queue pauses for review.

The point of the report is not to admire the numbers. It is to find the one variant we should kill and the one we should double next week.
