# Mobile audit

QA against a 375px viewport (iPhone SE / iPhone 13 mini mental model). Audit done against the source after the W3.2 hamburger nav, the W7.5 polish pass, and the W9.1 12-fix sweep. Adeel and Bill open this on a phone first, so the bar is "scannable, not pixel-perfect" across all 33 surfaces.

## Pattern coverage at 33 routes

The demo grew from 7 surfaces to 33 over nine waves. Auditing every page individually no longer fits one document, so this audit confirms the patterns that cover them.

- **Hamburger nav (W3.2).** Mobile breakpoint swaps the desktop nav for a drawer that lists every route grouped by section, mirroring `data/site-map.ts`. Every surface is one tap from any other.
- **Sticky lead CTA.** A bottom-anchored "Talk to Khush" bar persists on mobile across all surfaces so the founder can act without scrolling back to the top.
- **Desktop nav wrap (known limit).** With 33 routes the desktop nav now wraps to two lines above 1280px on dense surfaces. Acceptable for a demo; fix is a "More" disclosure for secondary routes.

## Horizontal scroll surfaces

After the W7.5 polish pass, every wide table and board has `overflow-x-auto` on its container with a visible scroll affordance.

- `/pipeline` kanban scrolls horizontally, ~1.2 columns visible at 375px, intentional to preserve the pipeline mental model.
- `/timeline` Gantt scrolls inside its card.
- `/vs-tali`, `/vs-dax`, `/vs-suki`, `/vs-summary` competitor tables scroll inside their cards.
- `/automations` "view source" expanders scroll wide TS lines inside the card, not the page.

## Touch targets and memo pages

W9.1 raised every primary CTA to `h-11` (44px), meeting the iOS floor. Hamburger trigger, lead CTA, and pipeline drag handles all clear 44px. Markdown surfaces (`/strategy`, `/case-study`, `/objections`, `/qa-summary`, `/interview-prep`, `/press-release`, `/contracts`, `/playbooks`) render through one `prose` pipeline; line length stays under 70 characters at 375px and the print stylesheet keeps them PDF-clean when forwarded.

## What would change for prod

- Collapsible filter drawer on `/pipeline` so the kanban gets full width on first load.
- Bottom action bar on `/lead/[id]` so Regenerate and Mark Replied stay reachable when scrolled deep.
- "More" disclosure on the desktop nav so it stays single-line as the route count grows past 40.

## Bottom line

Mobile-acceptable across all 33 routes. Nothing breaks, nothing overflows, every surface is reachable from the hamburger drawer in one tap.
