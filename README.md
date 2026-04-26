# Vero GTM demo

A working interview demo for the Founding GTM Engineer role at [Vero](https://veroscribe.com), built in 48 hours by Khush Agarwala.

**Live demo:** `<pending Vercel URL>` · **Source:** [github.com/Khush279/vero-gtm-demo](https://github.com/Khush279/vero-gtm-demo) · **Loom:** see `LOOM_SCRIPT.md`

## What this is

Seven surfaces, each mapped one-to-one against a JD bullet, all wired to the same in-memory data model. Not a CRM clone. The point is to show I can own the GTM engine end-to-end the moment I'm hired.

## For Adeel

I built this instead of writing a cover letter because the role is to ship, and a cover letter felt like the wrong artifact to send a physician-founder hiring for execution. Every lead in `/pipeline` is a real Ontario family physician from the CPSO public register, scored against an ICP I derived from Vero's own positioning. Every email draft is calibrated to what a clinician actually feels at 6:47pm with twelve charts left to close. None of it is sent. The demo is the cover letter.

## For Bill

Stack is Next.js 14 App Router, Tailwind, TypeScript strict, OpenAI `gpt-4o-mini` for drafts, Attio API for the optional CRM push, Vercel for deploy. State is in-memory. There's no DB because at 48 hours a DB is debt I'm not willing to underwrite. Server components by default, client components only where interaction demands it, shared types in `lib/types.ts`, one scoring function in `lib/scoring.ts`. On day 2 I'd stream the OpenAI drafts instead of buffering, move CPSO output behind Postgres with a daily cron, and generate the automation source viewer from the repo so it never drifts.

## Architecture decisions

- **No database.** State is in-memory JSON loaded at build time. A real DB at 48 hours is debt I'm not willing to take on for a demo. Day-1 work is Postgres plus a daily CPSO refresh cron.
- **Static JSON for leads.** The 500-lead corpus is committed at `data/leads.json`. Reproducible on every clone, deterministic in CI, no scrape required to run the app.
- **Mocked OpenAI fallback.** If `OPENAI_API_KEY` is not set, the draft endpoint returns a cached payload with the same shape as a live response. The demo never breaks because of a missing key, and reviewers can read the prompts in `lib/prompts.ts`.
- **Tailwind plus shadcn-style primitives copied, not imported.** UI components live in `components/ui/`. Copying the shadcn primitives instead of pulling a package keeps the dependency surface small and lets me edit the primitives directly when the brand demands it.
- **No auth.** It's a demo. Adding auth would gate the thing the founders need to see. Production would gate `/api/draft` behind a session and rate-limit by IP.
- **Vercel.** Zero-config Next.js deploy, instant preview URLs per branch, env vars in the dashboard. Bill will recognize the conventions on first look.

## What you'll see on each surface

| Route | One-line description |
| --- | --- |
| `/` | Cover-letter landing addressed to Adeel and Bill, with a six-tile surface grid. |
| `/pipeline` | Attio-style kanban with 500 CPSO leads, ICP scoring, drag-between-stages, filters by city and specialty. |
| `/lead/[id]` | Enriched lead profile with inferred EMR and a 4-touch sequence drafted live by `gpt-4o-mini`. |
| `/automations` | Five running jobs, each with a "view source" expander reading the actual TypeScript at build time. |
| `/enterprise` | Hospital-system pipeline plus a pre-filled Ontario Health VoR questionnaire response. |
| `/analytics` | Top-10 organic pages, three keyword bets, funnel attribution by source, one A/B test proposal. |
| `/strategy` | The 30/60/90 plan rendered from `data/strategy.md` as a long-form memo. |

## The honest gaps

- **No two-way Attio sync.** "Push to Attio" hits the real API one-way if a key is set. Week 1: build the webhook listener, add custom objects for `clinic` and `emr_cohort`, sync demo bookings back to the pipeline view.
- **No real reply parsing.** "Mark replied" is a button, not an inbox watcher. Week 1: Postmark inbound parser, LLM intent classifier, fallback to a human review queue with a 4-minute SLA.
- **Email-only.** LinkedIn DMs, SMS to clinic admins, OntarioMD partner intros are in the strategy memo but not built. Week 1: ship LinkedIn as touch 2 in the standard sequence, measure DM-to-reply lift against the email-only control.

## Stack

- **Framework:** Next.js 14 App Router, TypeScript strict
- **Styling:** Tailwind 3.4, copied shadcn primitives, Inter + Newsreader fonts
- **LLM:** OpenAI `gpt-4o-mini` for drafts, with a cached-payload fallback
- **CRM:** Attio API client in `lib/attio.ts`, optional via env var
- **Markdown:** `react-markdown` plus `remark-gfm` for the strategy memo
- **Tests:** Vitest with `vite-tsconfig-paths`
- **Scrape:** `cheerio` over the CPSO public register at one request per second
- **Deploy:** Vercel free tier

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

Push to GitHub, import in Vercel, and set:

- `OPENAI_API_KEY`: live email drafting on `/lead/[id]`. Without it, the demo falls back to cached drafts.
- `ATTIO_API_KEY`: optional. Enables the "Push to Attio" button on lead cards.

The demo is designed to work end-to-end without either key set; both unlock additional surfaces.

## Data sources

- Lead data is scraped from the [CPSO public register](https://www.cpso.on.ca/Public-Register), throttled to 1 req/sec, attribution preserved, only fields the register itself displays.
- Enterprise and hospital-system orgs in `/enterprise` are mocked and clearly labeled as such.
- All numbers in `/analytics` are illustrative. Day-1 work is to wire Search Console and GA4 exports.

## Contact

Khush Agarwala
- Email: khush@khushagarwala.com
- GitHub: [@Khush279](https://github.com/Khush279)
- LinkedIn: `<pending>`
