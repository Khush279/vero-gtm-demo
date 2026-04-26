/**
 * SlideCard · pure presentational, layout-aware. One mocked board slide,
 * rendered at 16:9 inside the page so the full deck reads top-to-bottom.
 *
 * Layouts ladder up from data/board-deck.ts:
 *   title     · centered, big display title, slide number bottom-left
 *   split     · title top, body bullets in two columns
 *   metrics   · title top, body bullets in a 4-cell metric grid
 *   narrative · title top, body as long-form paragraph
 *   ask       · title top, body as numbered list inside a forest-50 callout
 *
 * Speaker notes render as a small mono block below every layout. Print
 * styles in the page route hide chrome, but the slides themselves stay
 * legible in both screen and print.
 */

import type { Slide } from "@/data/board-deck";

type SlideCardProps = {
  slide: Slide;
  total: number;
};

/**
 * Splits the body string into bullet items if it leads with the
 * "•"-prefixed convention used in data/board-deck.ts. Otherwise returns
 * null so the layout falls back to paragraph rendering.
 */
function parseBullets(body: string): string[] | null {
  const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
  const allBullets = lines.every((l) => l.startsWith("•") || l.startsWith("1.") || /^\d+\./.test(l));
  if (!allBullets || lines.length === 0) return null;
  return lines.map((l) => l.replace(/^•\s*/, "").replace(/^\d+\.\s*/, ""));
}

function SlideShell({
  children,
  slideNumber,
  total,
  id,
}: {
  children: React.ReactNode;
  slideNumber: number;
  total: number;
  id: string;
}) {
  return (
    <article
      id={id}
      className="slide-card relative flex aspect-[16/9] w-full flex-col rounded-2xl border border-border/70 bg-card p-10 shadow-sm md:p-14"
    >
      {children}
      <div className="pointer-events-none absolute bottom-4 right-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground/70 tabular-nums">
        {slideNumber}/{total}
      </div>
    </article>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </div>
  );
}

function SpeakerNotes({ notes }: { notes?: string }) {
  if (!notes) return null;
  return (
    <div className="mt-4 rounded-md border border-dashed border-border/60 bg-muted/30 px-4 py-3">
      <div className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground/80">
        Speaker notes
      </div>
      <p className="font-mono text-[11.5px] leading-[1.65] text-foreground/80">
        {notes}
      </p>
    </div>
  );
}

function TitleLayout({ slide, total }: SlideCardProps) {
  const lines = slide.body.split("\n").filter(Boolean);
  return (
    <SlideShell id={slide.id} slideNumber={slide.number} total={total}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Kicker>{slide.kicker}</Kicker>
        <h2 className="mt-4 font-display text-[44px] font-light leading-[1.05] tracking-tightest text-foreground md:text-[56px]">
          {slide.title}
        </h2>
        {lines.length > 0 ? (
          <div className="mt-6 max-w-2xl space-y-1.5 font-serif text-[15px] leading-relaxed text-foreground/75 md:text-[16px]">
            {lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : null}
      </div>
      <div className="absolute bottom-6 left-10 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground/70 md:left-14">
        {String(slide.number).padStart(2, "0")}
      </div>
    </SlideShell>
  );
}

function SplitLayout({ slide, total }: SlideCardProps) {
  const bullets = parseBullets(slide.body);
  return (
    <SlideShell id={slide.id} slideNumber={slide.number} total={total}>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-foreground md:text-[34px]">
        {slide.title}
      </h2>
      <div className="mt-6 flex-1">
        {bullets ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            {bullets.map((b, i) => (
              <div
                key={i}
                className="flex gap-3 border-l-2 border-forest-300/70 pl-4"
              >
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-forest-600 pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-serif text-[14px] leading-relaxed text-foreground/85 md:text-[15px]">
                  {b}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            {slide.body}
          </p>
        )}
      </div>
      <SpeakerNotes notes={slide.notes} />
    </SlideShell>
  );
}

function MetricsLayout({ slide, total }: SlideCardProps) {
  const bullets = parseBullets(slide.body) ?? [];
  return (
    <SlideShell id={slide.id} slideNumber={slide.number} total={total}>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-foreground md:text-[34px]">
        {slide.title}
      </h2>
      <div className="mt-6 grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {bullets.map((b, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 rounded-md border border-border/70 bg-background/40 px-4 py-3"
          >
            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground/80 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-mono text-[11.5px] leading-[1.55] text-foreground/85 tabular-nums">
              {b}
            </p>
          </div>
        ))}
      </div>
      <SpeakerNotes notes={slide.notes} />
    </SlideShell>
  );
}

function NarrativeLayout({ slide, total }: SlideCardProps) {
  const bullets = parseBullets(slide.body);
  return (
    <SlideShell id={slide.id} slideNumber={slide.number} total={total}>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-foreground md:text-[34px]">
        {slide.title}
      </h2>
      <div className="mt-6 flex-1">
        {bullets ? (
          <ul className="space-y-3 font-serif text-[15px] leading-relaxed text-foreground/85 md:text-[16px]">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-forest-600 pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-3xl font-serif text-[16px] leading-relaxed text-foreground/85 md:text-[17px]">
            {slide.body}
          </p>
        )}
      </div>
      <SpeakerNotes notes={slide.notes} />
    </SlideShell>
  );
}

function AskLayout({ slide, total }: SlideCardProps) {
  const bullets = parseBullets(slide.body) ?? [slide.body];
  return (
    <SlideShell id={slide.id} slideNumber={slide.number} total={total}>
      <Kicker>{slide.kicker}</Kicker>
      <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-foreground md:text-[34px]">
        {slide.title}
      </h2>
      <div className="mt-6 flex-1">
        <ol className="space-y-4 rounded-lg border border-forest-300/60 bg-forest-50 p-6">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 font-display text-[28px] leading-none text-forest-700 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-serif text-[15px] leading-relaxed text-forest-900 md:text-[16px]">
                {b}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <SpeakerNotes notes={slide.notes} />
    </SlideShell>
  );
}

export function SlideCard({ slide, total }: SlideCardProps) {
  const layout = slide.layout ?? "narrative";
  switch (layout) {
    case "title":
      return <TitleLayout slide={slide} total={total} />;
    case "split":
      return <SplitLayout slide={slide} total={total} />;
    case "metrics":
      return <MetricsLayout slide={slide} total={total} />;
    case "ask":
      return <AskLayout slide={slide} total={total} />;
    case "narrative":
    default:
      return <NarrativeLayout slide={slide} total={total} />;
  }
}

export default SlideCard;
