# Strategy memo: where Vero is, and what I'd run in the first 90 days

Written for Adeel and Bill. Drafted as if I'm already on the team because that's the only way the work gets specific.

## Where Vero actually is

Vero is past the part of the company most founders never finish. Thousands of providers across North America are using the product, the Ontario Health Vendor of Record badge is in hand, the public site is ranking on the Canadian comparison queries, and the price point ($59.99 to $89 a month) is structurally lower than the venture-funded American incumbents charging $300 and up. The hard parts of company building, finding a wedge customer who pays and refers, are done.

The next chapter is different. The constraint is not "do clinicians want this." The constraint is "how fast can the next 5,000 of them find out it exists, in a way that doesn't burn the brand or the unit economics."

Today, Vero's growth motion looks heavy on inbound and content, light on outbound and lifecycle. That's the right shape for a Series A medical product because content compounds and outbound under-resourced is wasted. But the gap is now visible: there are tens of thousands of Ontario family physicians who have never typed "ai medical scribe" into Google because they don't know the category exists. Reaching them requires an outbound engine, and the engine has to be built like software, not like a sales floor.

That's the work I want to do.

## Why family practice in Ontario is the wedge for the next 5,000

Three numbers, in order of importance.

First, 6.5 million Ontarians do not have a regular family doctor. The provincial government has made this a top-three political issue. Every family doctor in the province is being pushed by their CPSO, their patients, and the Ontario Medical Association to take on more rosters and run more visits. That is the population most desperate to claw back the two hours of after-clinic charting that AI scribes give them. Pain meets willingness-to-pay meets policy tailwind.

Second, Ontario is the only province where Vero already has the procurement bypass switch. Being on the Ontario Health VoR list removes 6 to 9 months of sole-source justification work for any FHT, OHT, or hospital-affiliated clinic. No US competitor has it. Tali doesn't trade on it the way Vero can. That's a moat that compounds the more we use it.

Third, the addressable market is concentrated. Roughly 17,000 family physicians in Ontario, of whom maybe 12,000 are reachable via the CPSO public register with current practice addresses. That's a finite, knowable, segmentable list. It's the kind of TAM you can actually finish, not estimate.

The answer to "where do we put the next $1M of GTM spend" is sitting in /pipeline.

## The real competitive read

The instinct is to benchmark Vero against DAX. That's the wrong frame. DAX is owned by Microsoft, sells through Nuance reps into US enterprise hospital deals, and is not the reason a Toronto FP doesn't sign up for Vero next Tuesday.

The threat is Tali. Tali is Toronto-based, Canadian-built, and runs the same brand-positioning playbook Vero needs to win. They are the first product a clinician comparing Vero will land on, because they spend on Google for "tali ai vs" queries and because they have a louder content and webinar motion. Their weakness is price ($300 a month is hard to justify when the same clinician's CFI clinic budget is $0), specialty coverage (Vero ships 150-plus templates, Tali markets a handful), and the lack of doc-upload (Vero accepts referral letters and PDFs into the encounter; Tali does not). Those three differences are the entire content brief for the next quarter.

If the founding GTM engineer hire is doing their job, by August every Toronto clinician searching "tali ai review" lands on a Vero comparison page that opens with the price-per-clinic delta and a doc-upload demo video.

## Day 1 (week 1)

I stand up the engine you can already see in this app, scoped real:

- Pipeline live in Attio with the 500 CPSO-sourced FPs imported, scored, and segmented. Score weights wired to a recalc job so we can ship changes to the rubric without redeploying.
- Outbound sequencer running with the Day 1 / 4 / 9 / 16 cadence already drafted in /lead/[id]. First 50 sends go out hand-reviewed.
- Reply webhook on a Postmark inbound parser, advancing leads to "replied" or "demo_booked" automatically.
- Slack posts to #gtm whenever a demo books, so Adeel sees momentum without opening the dashboard.

Goal for week 1: 200 outbound sends, 5 demo bookings, baseline reply rate captured.

## Day 30

- 1,000 sequenced FPs per week, sustainable. That's roughly 50 per business day per BDR-equivalent of work, achievable when the AI does the drafting and a human approves.
- Reply-rate baseline established by city, specialty, and EMR cohort. First A/B on subject lines (price-anchor vs hours-back framing).
- Five SEO comparison pages briefed and shipped: "Vero vs Tali," "Vero pricing for Ontario family doctors," "AI scribe with PIPEDA-compliant data residency," "AI scribe for OSCAR users," "AI scribe for FHTs."
- First version of the EMR-aware template variants live, so the email a Telus PSS clinician gets references PSS by name.

Target: $25k of new MRR closed-won attributable to outbound + the new comparison pages.

## Day 60

- Enterprise lane stood up. Three named hospital systems in active procurement (Trillium, Hamilton Health Sciences, Niagara Health are the highest-probability starting set based on current VoR overlap).
- One-page RFP-response generator built, pre-filled from Vero's existing security docs. Cuts response time on the standard Ontario Health questionnaire from 8 hours to 45 minutes.
- Partner motion opened with OntarioMD and the Ontario College of Family Physicians. Goal is one paid pilot or one co-branded webinar by Day 90.
- Reply-classifier model in production replacing the regex stub. Routes positive replies to a human within 4 minutes business hours.

Target: $80k of new MRR run-rate, 2 enterprise contracts in late-stage negotiation.

## Day 90

- $200k+ of new MRR sourced through the GTM engine since Day 1. Bottoms-up math: 1,000 sequenced FPs per week × 12 weeks = 12,000 contacts × 1.5% conversion to trial × 40% trial-to-paid × $75 ACV = $54k MRR from FP outbound, plus enterprise (1 closed Trillium-style deal at $80k ARR), plus content uplift from comparison pages.
- Hire #2 scoped: either a BDR who runs the sequenced-then-personalized outbound at higher volume, or a content lead who owns the comparison-page program. My read is BDR first because content is already healthy.
- v2 of the CRM with closed-loop attribution: every demo booked tagged with first-touch source, sequence touch number, and EMR cohort. We stop guessing which channel works.

## Three week-1 experiments with measurement

1. **Subject-line A/B: price anchor vs time anchor.** Hypothesis: "Get 8 hours of charting back this week" outperforms "Charting at $74/month" on open rate by 30 percent or more for FPs under 20 years in practice. Measure on 400 sends, 200 per arm, single-cohort (Toronto FP, solo clinic, 5-15 years experience). Decision rule: roll out the winner if the lift is significant at p<0.1 and at least 5 absolute points.

2. **First-touch channel test: cold email vs LinkedIn DM.** Hypothesis: LinkedIn DM produces 2x the reply rate but 0.5x the demo-booking rate, for a wash. Measure on 100 leads per arm. If the DM cohort wins on reply *and* on demos, move LinkedIn into the standard sequence at touch 2.

3. **Landing page test: $59.99/mo vs $720/yr framing.** Hypothesis: the annual framing increases trial signups from clinic owners (multi-clinician buyers) by 20 percent without hurting solo-clinician conversion. Run via a 50/50 split on /pricing for two weeks, segment by clinic size from the signup form.

## What I'd build month 1

Four things, ranked by ROI:

1. The reply-classifier model replacing the regex stub. It pays for itself within a week by routing positive replies to a human in minutes instead of hours.
2. EMR-aware template variants. The Telus PSS clinician gets a different first sentence than the OSCAR clinician. Doubles the "this person actually understands my workflow" signal.
3. Partner outreach to OntarioMD and OCFP. They have the email lists Vero needs to reach the long tail of solo FPs who aren't on LinkedIn.
4. The Vero-vs-Tali comparison page, written by me and reviewed by Adeel. Honest, side-by-side, owns the comparison query our biggest competitor is currently winning.

That's the first 90 days. None of it is speculative. All of it is reachable with the systems already in this demo.

Khush
