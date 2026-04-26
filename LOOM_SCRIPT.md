# Loom walkthrough script

Target: 6 to 7 minutes spoken, conversational pace. ~700 words.
Audience: Adeel and Bill, watching once, on their phones, between meetings.
Demo state: 44 user-facing surfaces, 13 build waves, 108 tests. The Loom covers the 12 ranked surfaces from /tour. Everything else is one click away from /map.

---

## 00:00 - 00:30 · Open

**Show:** Camera on. No screen share yet. Look into the lens.

**Say:** Hi Adeel, hi Bill. I'm Khush. I built this demo in 48 hours instead of writing a cover letter, and what you're about to see is 44 working surfaces. I'm going to walk the 12 that matter most to you, ranked in the order I'd click them if I were on the buying side. Source is on GitHub, no auth, no login wall. Let's go.

## 00:30 - 01:15 · /case-study

**Show:** Open `/case-study`. Land on the Dr. Yasmin Raza header. Scroll once, slowly, through the 28-day timeline so the reply, the demo booked, and the signed pilot are all visible.

**Say:** I'm starting with one named lead, all the way through. Dr. Yasmin Raza, family physician in Mississauga, 1,800 patient panel, on Telus PSS. 28 days from cold outreach to signed pilot. Every artifact is the actual asset that moved each stage. The first email, her reply, the demo notes, the contract. I want you to see what closed-won looks like against one human before we talk about volume, because volume without one named win is just a list.

## 01:15 - 02:00 · /pipeline

**Show:** Switch to `/pipeline`. Drag one card from Discovered to Qualified so the live state is obvious. Filter by Toronto. Hover the score column for a second.

**Say:** Adeel, this is the volume answer. 500 real Ontario family physicians, scraped from the CPSO public register at one request per second, scored against an ICP I derived from your own positioning. Eight Kanban stages, draggable, filter by city or specialty. Pipeline state is in-memory because at 48 hours a database is debt I'm not willing to take on. The Push to Attio button hits the real Attio API if a key is set.

## 02:00 - 03:00 · /lead/lead_0042

**Show:** Click into `lead_0042`. Walk the left pane, pause two seconds on the inferred EMR field. Hit Regenerate on the touch-1 email and let it stream.

**Say:** One click in, full enrichment. Specialty, city, panel size, inferred EMR with the confidence score on the field. Right pane is a four-touch sequence drafted live by gpt-4o-mini, Day 1, 4, 9, 16, with a leverage point annotated per email. If you want the engine behind this, /prompt-debugger shows the exact system prompt and the diff when I tune it.

## 03:00 - 03:45 · /automations

**Show:** Open `/automations`. Click View Source on the CPSO scraper. Scroll one screen of real TypeScript.

**Say:** Bill, this is the page that separates a GTM engineer from a RevOps hire. Five running cron jobs. CPSO scraper, ICP recalculator, reply-detection webhook, demo-booked Slack alert, touch-due nightly cron. View source on any of them shows the actual TypeScript pulled from the repo at build time, so it never drifts from what's running.

## 03:45 - 04:30 · /strategy

**Show:** Open `/strategy`. Pause on the metrics strip at the top. Scroll to the wedge thesis header. Hover one footnote so the citation pops.

**Say:** 90-day plan with 16 footnotes. Wedge thesis is family practice in Ontario for the next 5,000 customers. Names Tali as the real competitive read and ends with a $200k MRR target by Day 90 with bottoms-up math. Every number has a source on it. Nothing asserted, everything cited.

## 04:30 - 05:00 · /vs-tali

**Show:** Open `/vs-tali`. Land on row 7 where Tali wins. Don't skip it.

**Say:** 15-row honest comparison Vero would publish tomorrow. Tali wins three rows, Vero wins the rest. The rows where Tali wins were the harder section to write, and they're the reason a clinician who's already demoed both will trust the rest of the page. SEO target is "tali ai vs vero" and that has buyer intent.

## 05:00 - 05:30 · /calculator

**Show:** Open `/calculator`. Slide the panel-size input from 1500 to 2400. Pause on the monthly hours saved figure.

**Say:** ROI math any clinic admin can run in 30 seconds. Panel size, notes per day, after-hours minutes. Outputs hours back per month and a per-physician dollar figure. Conservative assumptions, all visible. A rep sends the screenshot in a follow-up.

## 05:30 - 06:00 · /board-deck and /retro

**Show:** Open `/board-deck`. Tap the right arrow twice. Then open `/retro` in a new tab and scroll to the misses section.

**Say:** Two surfaces paired here. Board deck is the eight-slide GTM update I'd present at the first board meeting. Retro is the day-90 post-mortem, written before day one, with the misses called out by name. Anyone can plan. Pre-writing the retro is how I signal I'll tell the team the truth when the plan slips.

## 06:00 - 06:30 · /qa-summary and /sources

**Show:** Open `/qa-summary`. Five takeaways on one page. Open `/sources`. Scroll through the citation list.

**Say:** Q&A summary is the leave-behind a founder forwards to a partner who missed the call. Sources is every claim in the demo mapped to its public citation, with the synthetic data labeled honestly. The whole thing is auditable.

## 06:30 - 07:00 · Close

**Show:** Camera back on. Stop sharing.

**Say:** Adeel, Bill, that's the 12. There are 32 more surfaces at /map when you want to keep going, including /enterprise, /timeline, and the comparison set against Dax and Suki. I'd like to keep talking next week. Source is at github.com/Khush279/vero-gtm-demo. Thanks for watching.

---

## Recording notes

**Tabs to pre-load, in order, so cmd-1 through cmd-9 hits each section:**

1. `localhost:3000/case-study`
2. `localhost:3000/pipeline`
3. `localhost:3000/lead/lead_0042`
4. `localhost:3000/automations` (with the CPSO source viewer pre-expanded)
5. `localhost:3000/strategy`
6. `localhost:3000/vs-tali`
7. `localhost:3000/calculator`
8. `localhost:3000/board-deck`
9. `localhost:3000/qa-summary`

**Browser:** Chrome incognito, no extensions, no bookmarks bar visible. 1920x1080. Quit Slack, Discord, mail.

**Loom config:** Screen + camera, camera bottom-right, 240p face cam. Glass of water within reach.

**During record:** Talk, don't read. Glance, then look at the screen. Slow mouse, no frantic scrolling. If `/lead` regeneration takes more than 6 seconds on camera, cut and re-record that segment because cached drafts return instantly.

**If something breaks mid-Loom:** Don't restart the take. Loom lets you trim and stitch. If a page errors, switch to the cached tab, narrate "this is the cached state, live state is on the deployed URL," and keep moving. If OpenAI rate-limits, the fallback path returns a saved draft and the demo never breaks.

**After record:** Watch back at 1.5x. If you ramble in any 30-second window, cut it. Final length goal under 7 minutes. Loom URL goes in the email to Adeel before midnight Sunday.

---

## Anti-patterns to avoid

1. Don't say "as you can see." If they can see it, they don't need it narrated.
2. Don't apologize for any surface. No "this is rough" or "if I had more time." 48 hours is the point.
3. Don't read text on screen verbatim. The viewer can read faster than you can talk.
4. Don't say "basically" or "essentially." Both are filler that signal hedging.
5. Don't mouse-hover everything. One deliberate click beats five exploratory ones.

---

## One-line voicemail

For when the call gets cut to 90 seconds. Pure copy, no screen share required:

> Hi Adeel, hi Bill. I'm Khush. I built a 44-surface demo in 48 hours instead of writing a cover letter. The shortest version is this: 500 real Ontario family physicians scored against an ICP I derived from your positioning, one named lead taken from cold to signed pilot in 28 days, four-touch sequences drafted live by gpt-4o-mini with a leverage point per email, five running cron jobs with view-source, and a 90-day plan with 16 footnotes that names Tali as the real competitive read. Source is on GitHub at Khush279/vero-gtm-demo, no auth. I'd like 20 minutes next week to walk it with you.
