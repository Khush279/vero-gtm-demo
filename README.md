# Vero GTM demo

A working interview demo for the Founding GTM Engineer role at [Vero](https://veroscribe.com), built in 48 hours by Khush Agarwala. Live URL, public source, no auth.

## What this is

Seven surfaces, each mapped one-to-one against a JD bullet, all wired to the same in-memory data model. The point isn't to reproduce a CRM. The point is to show I can own the GTM engine end-to-end the moment I'm hired.

## For Adeel

I built this instead of writing a cover letter because the role is to ship, and writing a cover letter felt like the wrong artifact to send a physician-founder hiring for execution. Every lead in `/pipeline` is a real Ontario family physician from the CPSO public register, scored against an ICP I derived from Vero's own positioning. Every email draft is calibrated to what a clinician actually feels at 6:47pm with twelve charts left to close. None of it is sent. The demo is the cover letter.

## For Bill

Stack: Next.js 14 App Router, Tailwind, TypeScript strict, OpenAI `gpt-4o-mini` for drafts, Attio API for the optional CRM push, deployed on Vercel. State is in-memory and resets on reload. There's no DB because at 48 hours a DB is technical debt I'm not willing to underwrite. Code conventions: server components by default, client components only where interaction demands it, shared types in `lib/types.ts`, one source-of-truth scoring function in `lib/scoring.ts`. On day 2 I'd refactor the lead drafting path to stream from OpenAI instead of buffering, move the CPSO scrape output behind Postgres + a daily cron, and pull the hardcoded automation source viewer into a generated MDX index so the page never drifts from reality.

## What's in the box

- `/`: landing page, framed as a cover letter to both of you.
- `/pipeline`: Attio-style CRM board with 500 CPSO-sourced leads, ICP scoring, drag-between-stages.
- `/lead/[id]`: enriched lead profile with inferred EMR and a 4-touch sequence drafted by `gpt-4o-mini`.
- `/automations`: five running scripts with the actual TypeScript source visible inline.
- `/enterprise`: hospital-system pipeline plus a pre-filled Ontario Health VoR response template.
- `/analytics`: top-10 organic pages, three keyword bets, funnel by source, and one A/B test proposal.
- `/strategy`: the 30/60/90 plan as a markdown memo.

## The honest gaps

- **No real CRM parity.** This is not Attio. Pipeline state is in-memory and resets on reload. The "Push to Attio" button hits the real API if you set the key, but I haven't built two-way sync, custom objects, or webhook handling. Month-1 deliverable.
- **No real reply parsing.** "Mark replied" is a button that pauses the sequence and routes to a queue. Production needs Gmail/Outlook OAuth, an inbox watcher, an LLM classifier for intent (interested / unsubscribe / OOO / wrong-person), and a fallback to a human review queue. Month-1 deliverable.
- **Single-channel.** Email only. LinkedIn outreach, SMS to clinic admins, and partner-led intros through OntarioMD are referenced in the strategy memo but not built. Month-1 deliverable, prioritized in that order.

## What I'd ship in week 1

1. Stand up the outbound engine in this app against real Attio, with the CPSO data piped through a nightly cron and ICP recalculated on schedule.
2. Send the first 250 sequenced FPs in Ontario, A/B testing two subject-line variants, with a strict no-reply-no-resequence rule.
3. Write and publish the `tali-ai-vs-vero` comparison page (highest-intent gap in the current SEO map).
4. Wire the GA4 + Search Console + Attio data into a single warehouse view so I can answer "what does CAC look like by source by week" without a spreadsheet.
5. Identify three Ontario hospital systems already on the VoR list, draft a one-page outreach for each named procurement contact, and book one discovery call.

## Run locally

```bash
git clone https://github.com/khushagarwala/vero-gtm-demo
cd vero-gtm-demo
npm install
cp .env.example .env.local   # OPENAI_API_KEY optional; mocked draft path works without it
npm run dev
```

Open `http://localhost:3000`.

## Deploy

Push to GitHub, import in Vercel, and set:

- `OPENAI_API_KEY`: live email drafting on `/lead/[id]`. Without it, the demo falls back to cached drafts.
- `ATTIO_API_KEY`: optional. Enables the "Push to Attio" button on lead cards.

The demo is designed to work end-to-end without either key set; both unlock additional surfaces.

## Data sources

- Lead data is scraped from the [CPSO public register](https://www.cpso.on.ca/Public-Register), throttled to 1 req/sec, attribution preserved, only fields the register itself displays.
- Enterprise / hospital-system orgs in `/enterprise` are mocked and clearly labeled as such.
- All numbers in `/analytics` are illustrative. Day-1 work is to wire Search Console and GA4 exports.

## Contact

Khush Agarwala · khush@khushagarwala.com · [LinkedIn](https://www.linkedin.com/in/khush-agarwala/) · [github.com/khushagarwala](https://github.com/khushagarwala)
