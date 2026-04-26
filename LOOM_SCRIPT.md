# Loom walkthrough script

Target: 5-6 minutes spoken, conversational pace. ~450 words.
Audience: Adeel and Bill, watching once, on their phones, between meetings.

---

## 00:00 - 00:30 · Why this exists

Hey Adeel, hey Bill. I'm Khush. Instead of sending a cover letter for the Founding GTM Engineer role, I spent the last 48 hours building the GTM engine I'd run for you in week one. Live URL is in the description, source is on GitHub, no auth, no login wall. Let me show you the parts that matter.

## 00:30 - 01:30 · /pipeline

This is `/pipeline`. Five hundred real Ontario family physicians, scraped from the CPSO public register at one request per second, scored against an ICP I derived from your own positioning. Toronto, Mississauga, Hamilton, Ottawa - the cities where Vero already has the Ontario Health VoR advantage that Tali doesn't. You can drag a lead between stages, filter by specialty or city, sort by score. Pipeline state is in-memory because at 48 hours a database is debt I'm not willing to take on for you. The "Push to Attio" button hits the real Attio API if a key is set.

## 01:30 - 03:00 · /lead/lead_0001

Click into any lead. Here's Dr. Sarah Chen, family medicine, Toronto, inferred to be on Telus PSS. Right pane is a four-touch sequence drafted by `gpt-4o-mini` - Day 1, Day 4, Day 9, Day 16. Each email has a leverage point annotated: price anchor, doc-upload differentiator, PIPEDA, Ontario VoR. The whole thing is calibrated to what a clinician feels at 6:47pm with twelve charts left to close. None of it is sent. Hit Regenerate and you'll see it stream live. Adeel, if you want to plug in your own OpenAI key in Vercel, you'll get fully live drafts - otherwise it falls back to cached output so the demo never breaks.

## 03:00 - 04:00 · /automations

Bill, this is the page that separates a GTM engineer from a RevOps hire. Five running scripts: the CPSO scraper, the ICP recalculator, a reply-detection webhook, the demo-booked Slack alert, and the touch-due nightly cron. Click "view source" on any of them and you're reading the actual TypeScript that runs the job, pulled from the repo at build time so it never drifts.

## 04:00 - 05:00 · /enterprise + /strategy

`/enterprise` is the hospital-system lane. Trillium, Hamilton Health Sciences, Niagara Health - the systems already on Vero's VoR list. Below it, a pre-filled response to the standard Ontario Health questionnaire that takes most vendors eight hours and takes us forty-five minutes. `/strategy` is the 30/60/90 plan. It opens with why family practice in Ontario is the wedge for the next 5,000 customers, names Tali as the real competitive read, and ends with a $200k MRR target by Day 90 with bottoms-up math.

## 05:00 - 05:45 · /analytics

`/analytics` is where I'd live in week two: Top-10 organic pages, the three keyword bets I'd brief next - including "tali ai vs vero" - funnel by source, and one A/B test proposal you could ship Monday.

## 05:45 - 06:15 · Close

That's the demo. Code is on GitHub, every choice is documented in the README. Happy to make this real for you next week if it lands.

---

## Recording notes

**Before hitting record:**
- Open Chrome incognito (no extensions, no bookmarks bar visible).
- Screen resolution: 1920x1080. Quit Slack, Discord, mail apps.
- Tabs to pre-load, in this order, so cmd-1 through cmd-6 hits each section:
  1. `localhost:3000/` (or the Vercel URL)
  2. `localhost:3000/pipeline`
  3. `localhost:3000/lead/lead_0001`
  4. `localhost:3000/automations` (with one source viewer pre-expanded)
  5. `localhost:3000/enterprise`
  6. `localhost:3000/strategy`
  7. `localhost:3000/analytics`
- Loom set to "screen + camera," camera bottom-right, 240p face cam.
- Glass of water within reach.

**During record:**
- Talk, don't read. Glance at the script, then look at the screen.
- Mouse movements slow. No frantic scrolling.
- If `/lead` regeneration takes more than 6 seconds on camera, cut and re-record that segment - cached drafts return instantly.

**If something breaks mid-Loom:**
- Don't restart the whole take. Loom lets you trim and stitch.
- If a page errors, switch to the cached tab, narrate "this is the cached state - live state is on the deployed URL," and keep moving.
- If OpenAI rate-limits or 500s, the fallback path returns a saved draft. Acknowledge it on camera once: "that's the mocked fallback kicking in - same payload shape, no network call."

**After record:**
- Watch back at 1.5x. If you ramble in any 30-second window, cut it.
- Final length goal: under 6 min 30 sec. Drop the title screen on the front.
- Loom URL goes in the email to Adeel before midnight Sunday.
