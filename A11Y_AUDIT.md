# Accessibility + performance audit

Pass against the 44 surfaces. Surgical fixes only — no design or behaviour changes.

## What I checked

- Every `<svg>` in `components/` and `app/` for `aria-hidden` (decorative) or `role="img"` + `aria-label` (informational). Result: every chart SVG (`sparkline`, `delta-table`, `digest-charts`, `timeline-gantt`) already labels itself; every icon SVG sat inside an aria-hidden parent or had `aria-hidden`, with three exceptions noted below.
- Every `<input>`, `<select>`, `<textarea>` for an associated `<label htmlFor>` or `aria-label`. Six form fields total: faq search, pipeline filter, prompt-debugger select, two pricing-calculator ranges, chat-panel input. Three were already labeled, two needed `aria-label`.
- Every `<button>` for an accessible name (text content or `aria-label`). All 50 buttons had readable text or an explicit `aria-label` (the demo-script-cockpit Prev/Next pair already had it; the modal close buttons already had it).
- Modal-style overlays (`KeyboardShortcuts`, `MobileNav`) for `role="dialog"`, `aria-modal="true"`, Esc-to-close. Both already correct per the W3.2 sweep.
- No raw `<img>` tags exist anywhere in the tree — every visual is a serif glyph, an inline SVG, or a Next-rendered `ImageResponse` for OG/icons. `next/image` migration not required.

## What I fixed

1. `/Users/khushagarwala/vero-gtm-demo/components/keyboard-shortcuts.tsx` — added `aria-hidden` to the close-button SVG so screen readers announce only the parent button's `aria-label="Close"` (no double-announce of decorative path data).
2. `/Users/khushagarwala/vero-gtm-demo/components/pipeline-board.tsx` — added `aria-label="Search leads by name, city, or specialty"` to the pipeline search input. It only had a `placeholder` before, which screen readers do not treat as a label.
3. `/Users/khushagarwala/vero-gtm-demo/components/chat-panel.tsx` — added `aria-label="Ask a question"` to the `/chat` input for the same reason.

`npx tsc --noEmit` and `npx next build` both clean after the changes.

## What I flagged for later

- **Focus management on `KeyboardShortcuts` overlay.** When the dialog opens, focus stays on whatever the user pressed `?` on. Best practice is to move focus into the dialog and trap Tab inside it until close. Out-of-scope for a single-line change — needs a `useEffect` + a focusable sentinel pattern. Esc-to-close and outside-click-to-close already work, so screen readers can dismiss it.
- **`muted-foreground/70` contrast.** The `--muted-foreground` token at `154 12% 36%` over `--background` at `41 35% 96%` clears WCAG AA at full opacity, but every page uses `text-muted-foreground/70` for tertiary metadata (line counts, "to 6 PM", etc.) which drops below 4.5:1. Fixing means refactoring the design token, not editing pages, so flagged not fixed per scope.
- **Visible focus ring outside browser default.** No global `focus-visible:ring` style in `globals.css`; the demo relies on the browser's native focus ring. Most surfaces are fine; a few surfaces using forest-on-card backgrounds could lose the ring against the card. A global `*:focus-visible { outline: 2px solid hsl(var(--ring)) }` would harden this — design-system change, not a surgical fix.
- **`href="#"` placeholders on `vs-*` and `app/page.tsx` walkthrough button.** They are non-functional links. Constraints say no behaviour changes, so left alone — but a screen-reader user tabbing the page lands on dead links. For prod, swap to `<button type="button">` or remove.
- **`'use client'` audit.** `components/lead-card.tsx` is the only client-marked component without React hooks. It still legitimately needs `'use client'` because it attaches `onDragStart`/`onDragEnd` handlers, which are event handlers and can't run on the server. No optimisation available.

## Manual test checklist for the demo

- [ ] Tab from the top of `/` to the bottom; every interactive element receives a visible focus ring (browser default is acceptable on light surfaces, may be invisible on the green hero CTA).
- [ ] VoiceOver (Cmd+F5 on macOS) on `/pipeline`: the search input announces "Search leads by name, city, or specialty, search field"; the kanban columns are reachable.
- [ ] Mobile (375px iPhone SE viewport): hamburger opens, Esc closes (keyboard), tap-outside closes, body doesn't scroll behind the sheet.
- [ ] Color contrast: spot-check `/weekly-digest` and `/analytics` for any `text-muted-foreground/70` text that becomes hard to read at 90% display brightness.
- [ ] Keyboard shortcuts: press `?` from `/`, the dialog opens; press Esc, it closes; press `g` then `p`, navigates to `/pipeline`.
