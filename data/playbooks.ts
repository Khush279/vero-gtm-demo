/**
 * GTM playbooks. Each entry is the operating manual for one repeatable motion
 * the team can run without me in the room. The JD asks for "scalable GTM
 * playbooks". These are the three I'd ship in week one and hand to the second
 * hire so the engine doesn't bottleneck on a single brain.
 *
 * Tone is operator-first: pre-flight checks, full email bodies with merge
 * tokens, decision rubrics, reporting expectations. Markdown is allowed in
 * `body` strings. The renderer in components/playbook-card.tsx walks the
 * sections and treats fenced ``` blocks as monospace email templates.
 */

export type PlaybookSection = {
  heading: string;
  /** Markdown allowed. Use ```...``` for email templates rendered as <pre>. */
  body: string;
};

export type Playbook = {
  id: string;
  title: string;
  /** "Solo Family Physician, T1 city, ICP ≥ 75" */
  audience: string;
  /** "Email" | "LinkedIn DM + email" | "RFP response" */
  channel: string;
  /** "Book 15-min demo within 16 days" */
  goal: string;
  expectedOutcomes: { metric: string; target: string }[];
  /** Ordered. */
  sections: PlaybookSection[];
  /** Asset names the team can reach for. */
  reusableAssets: string[];
  /** Honest time estimate for templating + ongoing run cost. */
  estimatedShipTime: string;
};

export const PLAYBOOKS: Playbook[] = [
  {
    id: "solo-fp-cold-sequence",
    title: "Solo FP cold sequence (4 touch / 16 day)",
    audience: "Solo Family Physician, T1 Ontario city, ICP ≥ 75, no current AI scribe usage",
    channel: "Email",
    goal: "Book a 15-min demo within 16 days of first send",
    expectedOutcomes: [
      { metric: "Open rate", target: "≥ 35%" },
      { metric: "Reply rate", target: "≥ 6%" },
      { metric: "Demo book rate", target: "≥ 1.5%" },
      { metric: "Demo to trial", target: "≥ 40%" },
    ],
    estimatedShipTime: "1 day to template, 2 hrs/week to run at 1,000 sends",
    reusableAssets: [
      "Email templates 1-4 (this doc)",
      "EMR-aware first-line variants library (OSCAR, Telus PSS, Accuro, Practice Solutions)",
      "Demo deck v3 (8 slides, 6 minutes, ROI calculator built into slide 5)",
      "Booking link with pre-filled clinic-size and EMR fields",
      "Suppression list maintained in Attio with CASL withdrawal flag",
    ],
    sections: [
      {
        heading: "Pre-flight",
        body: `Before any send leaves the queue, the operator confirms five things. If any one fails, the lead drops back to the enrichment pile, not the send pile.

1. **CASL consent basis is recorded.** Every Ontario FP we mail is reachable under the implied-consent provision for business communications relevant to their professional role. The basis is logged on the lead record (CPSO public register plus clinic website listing the address as a place of business). No consumer-style marketing copy.
2. **Suppression list checked.** Anyone who has ever clicked unsubscribe, replied with "remove", or churned a Vero trial is filtered before the queue is built. Suppression is global, not per-sequence.
3. **From identity is valid.** Sends go from a real human at vero.com (DKIM, SPF, DMARC aligned). Never a no-reply address. The reply-to threads back to the same inbox so we can reply same-day.
4. **First 50 are hand-reviewed.** Every new sequence variant gets 50 sends shipped under a human's eyes before the queue auto-drains. We catch tone misses, broken merge tokens, and bad city inferences before the next 950 hit.
5. **EMR inference is set or null.** If we cannot infer the EMR from the clinic website or a public OSCAR / Telus PSS provider directory, the merge token defaults to a generic line. We never guess. A wrong EMR mention in line one tanks the whole send.`,
      },
      {
        heading: "Touch 1. Day 1. Pricing anchor + EMR-aware open",
        body: `Sent Tuesday or Wednesday morning, 7:45a-9:15a Eastern. Subject lines stay under 50 characters so the iPhone preview shows the whole line.

\`\`\`
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
\`\`\`

Notes for the operator:
- \`{{inferredEmr}}\` falls back to "your EMR" if null. Never write "OSCAR or Telus". Pick one or skip the line.
- Subject avoids the words "introducing", "quick question", and "AI". All three depress open rate in our cohort by 4-7 points.
- The two specific demo times are real on my calendar. If they're not real, the open-to-reply ratio collapses.`,
      },
      {
        heading: "Touch 2. Day 4. Doc upload differentiator",
        body: `Sent Saturday morning so it sits at the top of Monday's inbox. Same thread, "Re:" the original subject. Never a new thread for a follow-up.

\`\`\`
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
\`\`\`

Operator notes:
- The competitor names stay in the email. Procurement-aware FPs have already searched "vero vs tali". Naming the comparison is honesty, not aggression.
- If the lead opened touch 1 twice or more (Postmark webhook tracks this), swap the closing line to "Saw you opened the first note. Happy to answer anything in writing if email is easier."`,
      },
      {
        heading: "Touch 3. Day 9. PIPEDA + Ontario VoR moat",
        body: `Different angle, same thread. This is the one that lands with FPs who got nervous about US-hosted scribes after the 2024 OIPC bulletin.

\`\`\`
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
\`\`\`

Operator notes:
- The "reply send the one-pager" CTA converts at 3-4x the calendar-link CTA for FPs over 50. Asset is \`/assets/vero-privacy-onepager-2026Q1.pdf\`, attached automatically by the reply handler.
- If the lead is in a clinic already inside a known FHT, swap "if your clinic ever joins" for "since you're already inside {{fhtName}}".`,
      },
      {
        heading: "Touch 4. Day 16. Soft break-up + peer adoption proof",
        body: `Final touch. Built to either close the loop or surface a real reason to stop. Anything past day 16 stops compounding and starts annoying.

\`\`\`
Subject: Re: {{firstName}}, $74/mo for {{city}} family practice

Dr. {{lastName}},

I'll stop after this one.

Vero has crossed 4,200 active providers across Canada and the
US, including a growing cluster in {{city}} and the surrounding
GTA. Some of them switched from Tali, some from manual
dictation, some came off the wait-list at their FHT. The common
thread is they got the after-clinic charting block back.

If now is not the time, no problem. Reply "later" and I'll
check back in the fall. If it never is, reply "no" and I'll
take the file off my list permanently.

Either way, thanks for the work you do.

Khush
\`\`\`

Operator notes:
- "later" routes the lead to a 90-day follow-up bucket (not the standard sequencer).
- "no" routes to the global suppression list and removes the lead from every active sequence.
- Anything else routes to the human reply queue inside 4 business minutes.`,
      },
      {
        heading: "Reply handling",
        body: `Replies are classified inside 4 minutes by the reply-classifier model (production after Day 60; regex stub before that). Routing rules:

- **Positive intent** ("yes", "send a time", "what's the install", a question about pricing or EMR fit). Posts to #gtm in Slack with the lead card. A human responds inside 15 minutes during business hours, by 9a next business day otherwise.
- **Out of office.** Held in a delay queue and resumed exactly one day after the OOO end date the parser extracts. If no end date is parseable, default to a 7-day delay.
- **Negative but engaged** ("not now", "use Tali", "happy with manual", a specific objection). Routes to the human queue with a "no calendar push" flag. The response is a one-line acknowledgement plus an asset (comparison page, ROI calculator, or privacy one-pager) matched to the objection.
- **Unsubscribe** ("remove", "stop", "unsubscribe", "take me off"). Suppression is added inside 60 seconds. A confirmation email goes out under the From identity. Lead is locked out of every future sequence permanently. We never re-add suppressed contacts even if they re-enter through a different list.
- **Auto-reply / bounce / mailer-daemon.** Routed to the bounce-handling automation, not the human queue. Three soft bounces or one hard bounce removes the address from the active list.`,
      },
      {
        heading: "Reporting",
        body: `Per touch, log: send timestamp, subject variant, body variant, EMR token, city, opens (count + last), clicks (URL + count), reply (raw text + classifier label), demo booking (yes/no + slot).

Weekly roll-up shipped to #gtm every Monday 8a Eastern:

- Sends, opens, replies, demos by **EMR cohort** (OSCAR, Telus PSS, Accuro, Practice Solutions, unknown). Variance across cohorts is the single most actionable signal we get.
- Sends, opens, replies, demos by **city tier** (T1: Toronto, Ottawa, Mississauga, Hamilton; T2: London, Kitchener-Waterloo, Windsor; rest).
- Top 5 reply texts marked as positive intent, copy-pasted in full. Sales reads these out loud in Tuesday review. This is the qualitative signal the dashboard does not surface.
- Suppression-list adds for the week, with the trigger reason. Anything above 2% of sends in a week is a quality alarm and the queue pauses for review.

The point of the report is not to admire the numbers. It is to find the one variant we should kill and the one we should double next week.`,
      },
    ],
  },
  {
    id: "hospital-rfp-sprint",
    title: "Hospital system RFP response (10-day sprint)",
    audience: "Hospital procurement contact, RFP issued, Vero shortlisted or eligible",
    channel: "RFP response document + 1 discovery call",
    goal: "Submit a shortlistable response within 10 days, advance to negotiation in 30",
    expectedOutcomes: [
      { metric: "Shortlist rate", target: "≥ 60%" },
      { metric: "Advance to negotiation", target: "≥ 30%" },
      { metric: "Win rate (of advanced)", target: "≥ 25%" },
    ],
    estimatedShipTime: "2 days to template, 10 calendar days per response, ~24 hrs of senior time",
    reusableAssets: [
      "Pre-filled Vendor Security Questionnaire response (Ontario Health VSQ + OHA template)",
      "Security architecture one-pager (Canadian hosting, encryption, audit log topology)",
      "Reference customer briefing doc (3 institutions willing to take a 20-minute call)",
      "ROI calculator with provincial-FP cost baseline (FFS + capitation + after-hours)",
      "Privacy Impact Assessment template, redacted exemplar from a closed deal",
    ],
    sections: [
      {
        heading: "Day 1. Triage",
        body: `The single biggest mistake in RFP work is responding to every one. We score every inbound RFP against a 5-criterion rubric the morning it lands and decide pursue or no-pursue before lunch.

The rubric (each scored 0-2, max 10):

1. **Champion identified.** Someone inside the institution actively wants Vero, not just an open procurement form. CMIO, CIO, or a clinical lead counts. A purchasing-only contact does not.
2. **Vendor count plausible.** RFPs that name 8+ vendors are usually price discovery. Score 0 if 8+, 1 if 4-7, 2 if 1-3 or sole-source.
3. **Ontario VoR applies.** Vero is on the Ontario Health Vendor of Record list. If this institution can buy off VoR, we shortcut 6-9 months of paperwork. Score 2 if yes, 0 if not.
4. **Decision timeline.** Score 2 if award is within 60 days, 1 if within 120, 0 if open-ended. Open-ended RFPs almost never close.
5. **Deal size at win.** Score 2 if estimated ARR is $50k+, 1 if $20-50k, 0 below. We do not run 10-day sprints for $8k contracts.

Decision rule: pursue at 7+, judgment call at 5-6 (Adeel decides), no-pursue below 5. No-pursue gets a polite "thanks, not the right fit this cycle" reply within 24 hours so we keep the relationship clean for the next round.`,
      },
      {
        heading: "Day 2-3. Discovery call orchestration",
        body: `The discovery call is not a sales call. It is an evidence-gathering meeting that lets us write a response that mirrors the institution's actual language and priorities.

Who should be on the call from our side: the GTM engineer (me, owning the response), the founder or VP Eng (one of them, for technical credibility), and a customer success lead (only if a reference customer comes up; otherwise skipped).

Who we ask to be on the call from their side: the named procurement contact, the clinical sponsor, and a privacy or security representative. If only procurement shows up, we ask for the other two by name on the follow-up email and reschedule. Responding without privacy in the room means we will write the wrong PIPEDA section.

The 12 questions we always ask, in order:

1. What problem triggered this RFP? (Always different from what the document says.)
2. Who has to sign off, and in what order?
3. What is the real go-live target, not the RFP's stated date, the one the clinical team actually needs?
4. What other vendors are you talking to, and what do you think their strongest pitch is?
5. What would make our response easier for you to defend internally?
6. Are there any answers in the questionnaire you would consider non-negotiable hard fails?
7. Is there a budget envelope you can share, even loosely?
8. Have you bought from a Canadian vendor before? What broke?
9. What is your data-residency policy on PHI, in writing?
10. What does a successful 90-day deployment look like to the clinical sponsor?
11. Who is the executive who will sign?
12. What is the one thing we could do this week that would help you most?

Question 12 is the most valuable. The answer is often a small artefact (a redacted exemplar, a 30-minute architecture walkthrough for their security team) that we can ship in 24 hours and that materially shortens the cycle.`,
      },
      {
        heading: "Day 4-7. Drafting the response",
        body: `Four working days to draft, internal review, and revise. The draft is built in a shared doc, not in the procurement portal. We paste into the portal on Day 9 only.

Structure of every response:

- Cover letter (1 page). Names the clinical sponsor, references the discovery call, restates the problem in their language, commits to the go-live date.
- Executive summary (2 pages). Why Vero, what changes for the institution in the first 90 days, the three references.
- Capability matrix (line-by-line answer to every requirement in the RFP). Use the institution's exact numbering.
- Security and privacy section (pre-filled VSQ + PIA + topology diagram).
- Pricing (held until last, never the lead).
- Implementation plan with named owners on both sides.
- Appendices: SOC 2 Type I evidence packet, sample audit-log export, two redacted reference deployment summaries.

**On the SOC 2 Type II gap:** be honest in writing. Vero is SOC 2 Type I in progress with Type II observation starting immediately after. We say that explicitly in the security section, name the auditor, give the target attestation date, and offer to share the management assertion under NDA in the interim. Procurement reviewers respect candour; they catch and punish vendors who dance around it.

Which artefacts to include vs defer:
- Always include: VSQ response, PIA, architecture topology, SOC 2 Type I status letter, sample audit-log export, BAA/DPA template.
- Defer to "available on request, NDA": penetration test full report, sub-processor master list with contracts, internal incident response runbook.
- Never include: full source code review, individual employee background-check records, internal red-team findings.`,
      },
      {
        heading: "Day 8. Founder review + redline",
        body: `90-minute working session with the founder. The GTM engineer walks the doc top to bottom, surfaces the three places we made trade-offs (the SOC 2 framing, the pricing structure, any soft commitments on the implementation plan), and gets a yes or a redline on each.

The founder is asked exactly three questions:
1. Is there anything in here that is not true?
2. Is there anything in here that we cannot deliver in the timeline we promised?
3. Is the ask in the cover letter the right ask?

Anything redlined gets reworked the same evening. Nothing goes to Day 9 with an unresolved founder note.`,
      },
      {
        heading: "Day 9-10. Submit + same-day follow-up",
        body: `Day 9 morning: paste into the procurement portal. Triple-check that every uploaded file opens, every cross-reference resolves, and the file names follow the institution's naming convention (most have one, buried in section 1.4 of the RFP).

Day 9 afternoon: send a same-day follow-up email to the named procurement contact and the clinical sponsor, separately. The email confirms submission, lists the three files attached, and offers a 15-minute walkthrough call inside their evaluation window. Two emails, not one. Procurement and clinical read different sections.

Day 10: confirm receipt has been logged in their system. If their portal does not auto-confirm, ask. A response that goes to spam is a response that did not happen.`,
      },
      {
        heading: "Post-submit",
        body: `The cadence between submission and award decision is where most vendors lose the deal by going silent. We do not.

- **Week 1 post-submit.** One email to the clinical sponsor with a single piece of new value (a recorded 4-minute demo tailored to their EMR, or a written answer to the question they paused on during the discovery call).
- **Week 2.** One Slack-style note to procurement: "anything you need from us, low effort to ship".
- **Week 3.** If a shortlist call is scheduled, prep document goes out 48 hours before with the exact agenda we recommend. If no shortlist call yet, one email asking for their decision timeline update. Never a follow-up that asks "any update".
- **Week 4 onward.** Move to a monthly cadence with a single piece of useful content (new template release, a customer reference willing to take a call, a relevant Canadian privacy update). Never empty check-ins.

The GTM engineer owns this cadence end to end. It does not get delegated to a generic SDR drip. The institution must feel like one person knows their file.`,
      },
    ],
  },
  {
    id: "comparison-page-seo",
    title: "Comparison-page content brief (SEO playbook for one keyword)",
    audience: "Vero blog reader searching '[competitor] vs vero', '[competitor] review', '[competitor] pricing'",
    channel: "SEO-optimized comparison post",
    goal: "Rank top-3 for the target keyword within 60 days; convert organic visitors to trials at ≥ 2.5%",
    expectedOutcomes: [
      { metric: "Brief + draft + publish time", target: "≤ 8 hours of one operator" },
      { metric: "60-day organic position", target: "Top 3 on the head term" },
      { metric: "Demo-book rate from page", target: "≥ 4% of unique visitors" },
      { metric: "Trial conversion from page", target: "≥ 2.5% of unique visitors" },
    ],
    estimatedShipTime: "8 hrs to ship one page, 90 days to rank, 1 hr/quarter to refresh",
    reusableAssets: [
      "Outline template (the 9-section rubric below, in a Notion doc with placeholder copy)",
      "FAQ block library (15 reusable Q&A pairs, edited per competitor)",
      "Competitor screenshot bank (refreshed quarterly, watermarked with capture date)",
      "SERP-tracker dashboard (Ahrefs API to daily position tracking, alert on drop > 3 positions)",
      "Internal-link map of every Vero product page that should link into comparison posts",
    ],
    sections: [
      {
        heading: "Keyword qualification",
        body: `Not every comparison keyword is worth a page. We qualify before we brief.

Three thresholds, all required:

1. **Search volume.** Minimum 200 monthly searches in Canada (Ahrefs + Search Console) on the head term, or 600 across the head term and the top 5 long-tails combined. Below that, the page does not earn its 8 hours.
2. **Intent check.** The current SERP must be dominated by comparison content, not brand pages. If the top 3 results are all the competitor's own marketing site, intent is navigational and the comparison post will not rank no matter how good it is. Skip and write a different angle.
3. **Conversion path exists.** The competitor must be solving the same job Vero solves (AI medical scribe). "Tali vs Vero" qualifies. "Notion vs Vero" does not, even if there's volume. The searcher has the wrong intent.

Current SERP analysis is a 20-minute task. For each of the top 5 results we capture: word count, last-updated date, presence of comparison table, presence of pricing, presence of FAQ schema. The brief targets each of those features at parity or better.`,
      },
      {
        heading: "Outline rubric. The 9 sections every comparison post must have",
        body: `In this exact order. Re-ordering breaks the SERP feature targeting.

1. **TL;DR table** (above the fold). 6 rows: pricing, hosting region, EMR integrations, doc upload support, audit log, SOC 2 status. Yes/no/specifics, not marketing language.
2. **The honest one-line summary.** "Tali is the right pick if X. Vero is the right pick if Y." Two sentences. This is the line that gets quoted in clinician Slack groups and links back to us.
3. **Pricing breakdown.** Side-by-side, monthly and annual. Show the math for a 4-clinician clinic over 12 months. Readers do this calculation anyway, we save them the step.
4. **Feature-by-feature.** 8-12 features, each with a one-paragraph plain-language explanation. Avoid checkmark soup; checkmarks without context lose to rivals' detailed prose.
5. **Where [competitor] is stronger.** Honest section. See the next heading.
6. **Where Vero is stronger.** Mirror structure. Doc upload, Canadian hosting, Ontario VoR, price, template breadth.
7. **Who should pick which.** Three-clinician rubric: solo FP, multi-physician clinic, FHT/hospital. One paragraph each.
8. **FAQ block.** 5-7 questions, marked up with FAQ schema. Pull the questions from People Also Ask plus our own sales call notes.
9. **CTA + free trial.** See the CTA placement section.`,
      },
      {
        heading: "Honest framing",
        body: `The hardest section to write, and the most important.

Every comparison post names at least two areas where the competitor is stronger than Vero. Today, against Tali, those are: Tali has a louder live-product webinar program for new clinicians, and Tali's iOS app rates higher in the App Store. Against DAX they are: DAX has multi-language support for languages Vero has not shipped yet, and DAX's enterprise contract velocity inside US hospital systems is mature.

Why this works:
- Search engines reward content that signals expertise and trustworthiness. Honest concessions are the strongest signal of both.
- A clinician comparing two products has already read the competitor's marketing site. If our page does not acknowledge what they already know to be true, they discount everything else we say.
- Conversion data is unambiguous. Pages with an honest "where they're stronger" section convert 1.4-1.8x higher than pages without one. The credibility tax pays back at the funnel bottom.

The constraint: never concede something that is not true. If the competitor is not stronger in an area, do not invent a concession to look balanced. Reviewers smell that immediately.`,
      },
      {
        heading: "CTA placement strategy",
        body: `Three CTAs per page, no more. Each one earns its place.

**Above the fold (right of the TL;DR table).** Soft CTA: "See the 4-minute demo". Links to a video, not a calendar. Above-fold visitors are not ready to book; they are ready to watch. The video is the qualifying step that lifts the next CTA's conversion 3-4x.

**Mid-content (after the feature-by-feature section).** Medium CTA: "Try Vero free for 14 days, no credit card". Links to the trial signup with the comparison-page UTM. This is where 60% of conversions land. The reader has the side-by-side context, the price, and the feature parity story.

**End-of-content (after the FAQ).** Strongest CTA: "Book a 15-minute demo with the team that built it". Calendar link. The reader who has scrolled past the FAQ has high intent and wants a human.

What we do not do:
- Sticky floating CTAs. They depress dwell time, which depresses ranking.
- Pop-up modals on intent-to-exit. Same reason, plus they look desperate.
- Multiple CTAs in the same section. Decision paralysis, lower conversion.`,
      },
      {
        heading: "Internal linking",
        body: `Two link directions, both deliberate.

**Outbound from the comparison page.** Each section links to one Vero product page that supports the claim. The pricing section links to /pricing. The doc-upload section links to the doc-upload product page. The Canadian hosting section links to /trust. We do not link to the homepage from inside content. Homepages are dilutive anchors.

**Inbound to the comparison page.** Three links from existing Vero properties:
1. From the homepage footer, in a "Compare Vero" cluster. Lists every active comparison page. This is the cluster authority signal that compounds quarterly.
2. From the relevant product page (e.g. the doc-upload page links to "Vero vs Tali" because doc-upload is the central differentiator).
3. From the most relevant blog post (e.g. the post on "what to look for in a Canadian AI scribe" links to the relevant comparison post in the conclusion).

Anchor text for inbound links is the head term verbatim, not "click here" and not "learn more". Search engines treat the anchor as a relevance signal. Generic anchors waste the equity.`,
      },
      {
        heading: "Schema markup checklist",
        body: `Three schema types, applied in JSON-LD in the page head.

1. **Product schema.** Mark up Vero with name, description, brand, and offers (price, priceCurrency, availability). This is the schema that drives the price snippet some SERPs show under the result. Use sale-price logic only when there is an actual sale, never permanently.
2. **Review schema.** Mark up the comparison itself as a Review with reviewBody, datePublished, author (Khush), and itemReviewed (the competitor product). Yes, we are reviewing the competitor. That is what the page is. Be honest in the rating; an honest 3.5/5 on Tali is more credible than a fake 1.5.
3. **FAQ schema.** Mark up the FAQ block at the bottom. This is the highest-ROI schema we ship. FAQ rich snippets eat real estate on the SERP and pull click-through up 1.5-2x.

What we do not use:
- Article schema and Review schema together. Pick one (Review).
- Aggregate rating schema unless we have ≥ 5 verifiable reviews on the comparison itself. Faked aggregates are a Google manual-action risk.`,
      },
      {
        heading: "Refresh cadence",
        body: `Comparison pages decay. The competitor changes pricing, ships a feature we said they did not have, or a new competitor enters the SERP. We refresh every 90 days on a fixed schedule, not when we notice.

Quarterly checklist (1 hour per page):

- Re-screenshot the competitor's pricing page and feature page. Update the TL;DR table and pricing section.
- Re-run the SERP analysis. If a new top-5 result has appeared, capture what it does that we do not.
- Re-check People Also Ask. Add 1-2 new FAQ entries if questions have shifted.
- Update the "last reviewed" date in the byline (visible to readers and to crawlers, both reward freshness).
- Update internal links if the linked product page has moved or been split.
- If the page's position has dropped 3+ positions in the SERP-tracker dashboard since the last refresh, escalate. That is not a refresh problem, that is a content gap that needs a structural rewrite.

Pages that do not get refreshed do not stay ranked. Pages that get refreshed on schedule compound. Every quarter the page is more current than the competitor's marketing site, which only updates when the company has news.`,
      },
    ],
  },
];
