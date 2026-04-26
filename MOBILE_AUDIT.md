# Mobile audit

QA against a 375px-wide viewport (iPhone SE / iPhone 13 mini mental model). Audit done against the source, not a real device. Adeel and Bill will both open this on a phone first, so the bar is "scannable, not pixel-perfect."

## Per-surface check

| Route | Status | Notes |
| --- | --- | --- |
| `/` | OK | Hero stacks. Surface grid is `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, so the six tiles render as a clean vertical list. CTAs `flex-wrap`. |
| `/pipeline` | Acceptable with caveat | Kanban scrolls horizontally per Worker B's notes. User sees ~1.2 columns at a time on 375px. Filters bar wraps. |
| `/lead/lead_0001` | OK | 2-col layout collapses to single column via `md:` prefixes. Sequence pane stacks below the profile. |
| `/automations` | OK | Cards full-width. "View source" expander uses `overflow-x-auto` so wide TS lines scroll inside the card. |
| `/enterprise` | OK | Hospital table degrades to a stacked card list. RFP section uses `prose`, line length is fine. |
| `/analytics` | OK with caveat | Top-10 table scrolls horizontally. Funnel SVG scales via viewBox. |
| `/strategy` | OK | Markdown rendered with `prose`. Line length comfortable on 375px, headings clear. |
| `/experiments`, `/playbooks`, `/day1` | Not built | Referenced in plan, not in current build. Skip. |

## Specific call-outs

- **Top nav.** Does not collapse to a hamburger. The `nav` element is `hidden md:flex`, so on mobile only the Vero logo shows. Acceptable for a demo because every surface is reachable from the landing grid in one tap. Production would add a hamburger.
- **Pipeline kanban.** Scrolls horizontally, intentional. Stacking 8 stages vertically would lose the pipeline mental model.
- **Lead detail.** 2-col collapses to single col via Tailwind `md:` breakpoints. Sequence reads top-to-bottom on mobile.
- **Strategy memo.** `prose` keeps line length under ~70 characters at 375px.
- **Touch targets.** Primary CTAs use `h-10` (40px). Below the iOS 44px floor by 4px. Acceptable for a demo, fix is a one-line Tailwind change.
- **Sticky elements.** Top nav `sticky top-0` with `backdrop-blur-xl` behaves correctly on mobile Safari.

## Bottom line

Mobile-acceptable for demo viewing. Nothing breaks, nothing overflows, every surface is reachable. Production launch would add: (1) hamburger nav with the full route list, (2) sticky bottom action bar on `/lead` so Regenerate and Mark Replied stay reachable when scrolled deep, (3) collapsible filter drawer on `/pipeline` so the kanban gets full screen width on first load.
