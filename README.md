# Vero GTM demo

A working interview demo for the Founding GTM Engineer role at [Vero](https://veroscribe.com), built by Khush Agarwala over a series of nine waves of focused work.

**Live demo:** `<pending Vercel URL>` · **Source:** [github.com/Khush279/vero-gtm-demo](https://github.com/Khush279/vero-gtm-demo) · **Loom:** see `LOOM_SCRIPT.md`

## What this is

35+ user-facing surfaces, 108 vitest tests, 11 OG image variants, and a 33-entry sitemap, all wired to one in-memory data model. The point is to show I can own the GTM engine end-to-end the day I start, with the receipts to back every claim.

## For Adeel

I built this instead of writing a cover letter because the role is to ship, and a cover letter felt like the wrong artifact to send a physician-founder hiring for execution. Every lead in `/pipeline` is a real Ontario family physician from the CPSO public register, scored against an ICP I derived from Vero's own positioning. Every email draft is calibrated to what a clinician feels at 6:47pm with twelve charts left to close. None of it is sent. The 90-day plan in `/strategy` opens with the metric I would be fired for missing, because that is the conversation I want to have on the call. The demo is the cover letter.

## For Bill

Stack is Next.js 14 App Router, TypeScript strict, Tailwind 3, OpenAI `gpt-4o-mini` with cached fallback, vitest, Vercel. Engineering surfaces a CTO will want to poke first: `/chat` is a RAG agent grounded in this repo's data with citations inline, `/prompt-debugger` exposes the sequence-drafter prompt with token counts and a side-by-side run, `/sql` is a read-only console over the in-memory leads, `/automations` shows five running cron jobs with their actual TypeScript source visible inline. Server components by default, client only where interaction demands it, deterministic synthetic data via Mulberry32 PRNG so CI never flakes. Day 2: stream OpenAI drafts instead of buffering, move CPSO output behind Postgres with a daily cron, generate the automation source viewer from the repo so it never drifts.

## What's in the box

33 routes across 5 grouped sections. Source of truth is `data/site-map.ts`.

### The product (7)

| Route | One-line description |
| --- | --- |
| `/pipeline` | 500 real Ontario family physicians scraped from CPSO, ICP-scored, five-stage Attio-style board with native HTML5 drag-and-drop. |
| `/lead/[id]` | Enriched FP profile with inferred EMR and a four-touch sequence drafted live by `gpt-4o-mini`. |
| `/case-study` | Halton Family Health Team narrative from cold outreach to signed pilot, with the artifacts that moved each stage. |
| `/automations` | Five running cron jobs with their actual TypeScript source visible inline. |
| `/chat` | RAG agent answering questions about Vero's GTM grounded in this repo's data, citations inline. |
| `/prompt-debugger` | Sequence-drafter prompt with token counts, model dial, side-by-side A/B run. |
| `/calculator` | ROI math any clinic admin can run in two minutes, with assumptions exposed. |

### The plan (6)

| Route | One-line description |
| --- | --- |
| `/strategy` | The 90-day plan and where the wedge is, rendered from markdown via react-markdown. |
| `/day1` | What I ship in the first 24 hours, hour by hour, with Slack-thread announcements. |
| `/timeline` | Quarter-by-quarter Gantt view across hiring, channel, content, partnership tracks. |
| `/experiments` | Ten bets ranked by leverage and time to signal, each with kill criteria. |
| `/playbooks` | The plays I would hand a future GTM hire on day 30. |
| `/onboarding-plan` | Customer onboarding from signed contract to first scribe note. |

### The competition (4)

| Route | One-line description |
| --- | --- |
| `/vs-tali` | Where Vero wins on EMR coverage and Canadian residency, where Tali still wins on installed base. |
| `/vs-dax` | Vero versus Nuance DAX in the community-clinic wedge, with per-seat math. |
| `/vs-suki` | Suki's specialty-first US motion and the family-medicine ground it cedes. |
| `/vs-summary` | All three competitors on one page across nine dimensions, dimensions Vero loses called out in red. |

### The receipts (8)

| Route | One-line description |
| --- | --- |
| `/sources` | Every claim across the demo mapped to its public citation, synthetic data labeled. |
| `/resources` | Five downloadable artifacts (CSV, markdown, JSON) you can hand the second hire on day one. |
| `/metrics` | Week 1 versus week 4 of the GTM engine side by side, deltas annotated. |
| `/channel-mix` | Spend allocation across outbound, content, partnership, paid for the first two quarters. |
| `/analytics` | Top-10 organic pages, three keyword bets, funnel attribution, one A/B test for week one. |
| `/weekly-digest` | The Friday operator email a founder reads in two minutes, charts inline. |
| `/objections` | Fifteen hardest questions a Canadian primary-care buyer asks, with answers and proof. |
| `/enterprise` | Hospital-system pipeline plus a pre-filled Ontario Health VoR response template. |

### For the founders (8)

| Route | One-line description |
| --- | --- |
| `/` | Cover-letter landing scannable in 30 seconds, with a grid linking out to every surface. |
| `/docs` | Guided tour for first-time visitors, ordered by 5 minutes, 15 minutes, or a full sit-down. |
| `/qa-summary` | Eight questions I expect Adeel and Bill to ask, with the one-paragraph answer rehearsed. |
| `/interview-prep` | My homework on Vero before the call: founders' backgrounds, YC batch, my questions. |
| `/press-release` | Amazon-style working-backwards announcement for Vero's Series A, eighteen months out. |
| `/contracts` | Two redlined pilot agreements: single-clinic MSA and Ontario Health Team master. |
| `/board-deck` | Eight-slide GTM update for the first board meeting after joining, keyboard-navigable. |
| `/demo-script` | The cockpit I would use to demo Vero on a Zoom call, talk track scripted, next click highlighted. |

## Architecture decisions

- **No database.** State is in-memory JSON at build time. Day-1 work is Postgres plus a daily CPSO refresh cron.
- **Static JSON for leads.** 500-lead corpus committed at `data/leads.json`. Reproducible on every clone, deterministic in CI.
- **Mocked OpenAI fallback.** If `OPENAI_API_KEY` is unset, the draft endpoint returns a cached payload with the same shape as a live response. Demo never breaks on a missing key.
- **Tailwind plus shadcn primitives copied, not imported.** UI components in `components/ui/` so I can edit them directly when the brand demands it.
- **No auth.** Production would gate `/api/draft` behind a session and rate-limit by IP.
- **Mulberry32 PRNG for synthetic data.** Anywhere the demo invents a number, the seed is fixed so CI does not flake.
- **next/og for social previews.** 11 OG variants generated at the edge, one per major surface.
- **react-markdown for memo pages.** `/strategy`, `/case-study`, and the rest render from markdown so copy edits do not touch JSX.
- **Native HTML5 drag-and-drop on `/pipeline`.** No react-dnd, no dnd-kit. The browser ships this.
- **@media print stylesheet.** Every memo page prints to a clean PDF when forwarded over email.
- **Vercel.** Zero-config Next.js deploy, preview URLs per branch.

## Stack

- **Next.js** 14 App Router, TypeScript strict
- **Tailwind** 3.4, copied shadcn primitives, Inter and Newsreader fonts
- **react-markdown** plus `remark-gfm` for memo pages
- **OpenAI SDK** with `gpt-4o-mini` for drafts, cached fallback when key absent
- **vitest** with `vite-tsconfig-paths`, 108 tests across 7 files
- **lucide-react** for icons
- **next/og** for 11 OG image variants
- **cheerio** for the CPSO scrape, throttled at 1 req/sec
- **Vercel** for deploy

## Tests

108 tests across 7 vitest files:

- `scoring.test.ts`: ICP scoring, missing-field edges, ceiling and floor behavior.
- `prompts.test.ts`: snapshot tests on the four sequence prompts so copy edits cannot silently change LLM output.
- `site-map.test.ts`: every route in `data/site-map.ts` resolves to a real page file.
- `attio.test.ts`: mocked Attio client, push-to-CRM happy path plus three failure modes.
- `markdown.test.ts`: memo renderer, custom components, print stylesheet.
- `synthetic.test.ts`: Mulberry32 seed lock so analytics numbers stay stable across builds.
- `og-image.test.ts`: all 11 OG variants rendered headless, dimensions and font loading asserted.

## The honest gaps

- **No real CRM persistence.** "Push to Attio" hits the live API one-way if a key is set, nothing written back. Day-1 fix: webhook listener, custom objects for `clinic` and `emr_cohort`, sync bookings back to pipeline.
- **No real email send.** "Mark replied" is a button, not an inbox watcher; drafts never leave the browser. Day-1 fix: Postmark inbound parser, LLM intent classifier, human review queue with a 4-minute SLA.
- **No real OpenAI usage at scale.** The 500 leads were drafted once and cached. A live refresh across Ontario would be a meaningful bill. Day-1 fix: OpenAI Batch API at half cost, cache by `(lead_id, prompt_version)`, only redraft on prompt change.

## What I would ship in week 1

See `/day1` for the hour-by-hour plan. The five biggest pieces:

1. Postgres behind the lead corpus, daily CPSO refresh cron, drift alerts.
2. Postmark inbound parser plus LLM reply classifier, with a human review queue.
3. LinkedIn as touch 2 in the standard sequence, measured against email-only control.
4. Attio webhook listener plus custom objects for `clinic` and `emr_cohort`.
5. Streaming OpenAI drafts on `/lead/[id]` so the founder sees tokens land in real time.

## Run locally

```bash
git clone https://github.com/Khush279/vero-gtm-demo
cd vero-gtm-demo
npm install
cp .env.example .env.local   # OPENAI_API_KEY optional; mocked draft path works without it
npm run dev
```

Open `http://localhost:3000`.

## Deploy

Push to GitHub, import in Vercel, set:

- `OPENAI_API_KEY`: live email drafting on `/lead/[id]`. Without it, the demo falls back to cached drafts.
- `ATTIO_API_KEY`: optional. Enables the "Push to Attio" button on lead cards.

The demo is designed to work end-to-end without either key set; both unlock additional surfaces.

## Data sources

See `/sources` for every claim mapped to its public citation. Lead data is scraped from the [CPSO public register](https://www.cpso.on.ca/Public-Register) at one request per second, attribution preserved, only fields the register itself displays. Enterprise orgs in `/enterprise` are mocked and labeled. Numbers in `/analytics` are illustrative; day-1 work is to wire Search Console and GA4 exports.

## Contact

Khush Agarwala
- Email: khush@khushagarwala.com
- GitHub: [@Khush279](https://github.com/Khush279)
- LinkedIn: `<pending>`
