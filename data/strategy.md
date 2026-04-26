# Strategy memo: where Vero is, and what I'd run in the first 90 days

For Adeel and Bill. Drafted as if I'm already on the team because it's the only way work gets specific.

## Where Vero is

5,000+ paying providers across North America. Ontario Health VoR badge (a 6-to-9-month head-start on every US competitor). Site ranks page-1 on 14 of 20 highest-intent Canadian queries. Pricing at $59.99 to $89/month sits 70% under Suki, DAX, Abridge. Wedge customer found.

Constraint is no longer "do clinicians want this." It's "how fast can the next 5,000 find out it exists, without burning brand or unit economics."

Growth motion today is ~80% inbound + content, 20% outbound. Right mix for Series A. But 14,200 family physicians in Ontario alone (CIHI 2024) have mostly never typed "ai medical scribe" into Google because the category is invisible to them. Reaching them needs an outbound engine built like software, not like a sales floor.

That's the work I want to do.

## Why family practice in Ontario is the wedge

**6.5M.** Ontarians without a family doctor (OCFP, 2026). The province has made this a top-3 political issue. Every FP is being pushed by CPSO, the OMA, and their own roster to take on more patients. That's the population most desperate to claw back the 2 hours of after-clinic charting AI scribes give them. Pain meets willingness-to-pay meets policy tailwind.

**6 to 9 months.** Procurement bypass the Ontario Health VoR badge gives any FHT, OHT, or hospital-affiliated clinic. No US competitor has it. Tali doesn't trade on it the way Vero can. The moat compounds the more we use it.

**14,200.** Family physicians in Ontario (CIHI 2024), of whom ~10,500 are reachable via the CPSO public register. Finite, knowable, segmentable. A TAM you can finish.

Where the next $1M of GTM spend goes is sitting in /pipeline.

## The real competitive read

Benchmarking against DAX is the wrong frame. DAX is owned by Microsoft, sells via Nuance reps into US hospitals, and is not the reason a Toronto FP doesn't sign up for Vero next Tuesday.

The threat is Tali. Toronto-based, Canadian-built, running the playbook Vero needs to win. Their weakness is price ($300/month vs Vero's $74 average), specialty coverage (Vero ships 150+ templates, Tali markets ~12), and lack of doc-upload (Vero ingests referral letters and PDFs, Tali does not). Those three deltas are the entire content brief for the next quarter.

By August, every Toronto clinician searching "tali ai review" should land on a Vero comparison page that opens with the price delta and a 40-second doc-upload demo.

## The 90-day funnel math

Bottoms-up, conservative on every conversion:

- **TAM:** 14,200 Ontario FPs (CIHI 2024)
- **90-day reachable cohort:** 4,000 (28% of TAM, scoped to verified CPSO addresses + EMR cohort tags)
- **Touch volume:** 4 sequenced touches × 4,000 = **16,000 sends**
- **Reply rate:** 4% = **640 replies** (Tali's public benchmark sits at 2.1%, ours should beat it on price-anchor framing)
- **Demo book rate from reply:** 25% = **160 demos**
- **Trial start rate from demo:** 40% = **64 trials**
- **Paid conversion:** 50% = **32 paying clinicians**
- **ARR from outbound alone:** 32 × $720 = **$23,040** in 90 days, on top of inbound

That's the floor. A 6% reply rate (achievable with EMR-aware first lines) doubles the funnel to ~$46k ARR. The system is built to be measured at every step, which is the only way the next $1M of spend gets allocated rationally.

## Day 1 (week 1)

Stand up the engine you can already see in this app:

- 500 CPSO-sourced FPs imported to Attio, scored, segmented. Score weights on a recalc job so rubric changes ship without redeploying.
- Outbound sequencer running with the Day 1/4/9/16 cadence drafted in /lead/[id]. First 50 sends hand-reviewed.
- Reply webhook on a Postmark inbound parser, advancing leads to "replied" or "demo_booked" automatically.
- Slack posts to #gtm on every demo booked, so Adeel sees momentum without opening a dashboard.

Goal: 200 sends, 5 demos, baseline reply rate captured.

## Day 30

- 1,000 sequenced FPs/week, sustainable. ~50/business-day per BDR-equivalent, achievable when AI drafts and a human approves.
- Reply-rate baseline by city, specialty, EMR cohort. First A/B on subject lines (price-anchor vs hours-back).
- 5 SEO comparison pages shipped: "Vero vs Tali," "Vero pricing for Ontario family doctors," "PIPEDA-compliant AI scribe," "AI scribe for OSCAR users," "AI scribe for FHTs."
- EMR-aware template variants live: the Telus PSS clinician's email references PSS by name.

Target: $25k new MRR closed-won from outbound + comparison pages.

## Day 60

- Enterprise lane stood up. 3 hospital systems in active procurement (Trillium, Hamilton Health Sciences, Niagara Health, by VoR overlap).
- 1-page RFP-response generator pre-filled from Vero's security docs. Cuts the standard Ontario Health questionnaire from 8 hours to 45 minutes.
- Partner motion with OntarioMD and OCFP. Goal: 1 paid pilot or 1 co-branded webinar by Day 90.
- Reply-classifier model in production replacing the regex stub. Routes positive replies to a human within 4 minutes business-hours.

Target: $80k new MRR run-rate, 2 enterprise contracts in late-stage negotiation.

## Day 90

- $200k+ new MRR through the GTM engine. Bottoms-up: 1,000 sequenced FPs/week × 12 weeks = 12,000 contacts × 1.5% trial × 40% trial-to-paid × $75 ACV = $54k MRR from FP outbound, plus 1 closed Trillium-style enterprise deal at $80k ARR, plus content uplift.
- Hire #2 scoped: BDR or content lead. Read is BDR first because content is already healthy.
- v2 CRM with closed-loop attribution: every demo tagged with first-touch source, sequence touch number, and EMR cohort. Stop guessing which channel works.

## Three week-1 experiments

1. **Subject-line A/B: price vs time anchor.** "Get 8 hours of charting back this week" beats "Charting at $74/month" by 30%+ on open rate for FPs <20 yrs in practice. 400 sends, 200/arm, Toronto solo-clinic cohort. Roll out the winner if lift is significant at p<0.1 and 5+ absolute points.
2. **First-touch channel: email vs LinkedIn DM.** DM produces 2x reply rate but 0.5x demo-book rate (a wash). 100 leads/arm. If DM wins on reply *and* demos, move LinkedIn into touch 2.
3. **Pricing page: $59.99/mo vs $720/yr.** Annual framing increases trial signups from clinic owners by 20% without hurting solo conversion. 50/50 split on /pricing for 2 weeks, segment by clinic size from the signup form.

## What I'd build month 1

Ranked by ROI:

1. Reply-classifier model replacing the regex stub. Pays for itself in a week by routing positive replies in minutes instead of hours.
2. EMR-aware template variants. Doubles the "this person understands my workflow" signal.
3. Partner outreach to OntarioMD and OCFP. They have the email lists for the long-tail solo FPs not on LinkedIn.
4. Vero-vs-Tali comparison page. Honest, side-by-side, owns the comparison query Tali currently wins.

## What I'm intentionally not doing in the first 90 days

- **No paid Google search spend.** Content + outbound covers the same intent at 1/5 the CAC. Revisit Day 120 if ARR needs lift.
- **No US expansion push.** The Ontario VoR moat doesn't travel. 32 paying Ontario FPs beats 100 cold Texas demos.
- **No event/conference sponsorships.** OFPC and OMA AGM cost $15k a booth and produce sub-3% lead conversion. A co-branded OCFP webinar costs $0 and lands the same audience.
- **No second-product exploration.** Doc-upload, ambient-summary, template-marketplace all qualify. None ship before core outbound is at $200k MRR run-rate.

## Sources

- [OntarioMD physician registry](https://www.ontariomd.ca/) (Ontario family physician baseline)
- [CIHI Physicians in Canada 2024](https://www.cihi.ca/en/physicians) (14,200 Ontario FP figure)
- [OCFP Practice Profile Survey 2026](https://www.ontariofamilyphysicians.ca/) (6.5M Ontarians without a family doctor)
- [CMA National Physician Health Survey](https://www.cma.ca/physician-wellness-hub) (after-hours charting burden)
- [Vero Scribe](https://veroscribe.com/) (current pricing, template count, EMR coverage)

Khush · April 26, 2026
