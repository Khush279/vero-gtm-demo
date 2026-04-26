import type { FaqEntry } from "@/data/vs-tali";

/**
 * FAQ accordion for /vs-tali. Server component using native <details> and
 * <summary> so it works without JS, ranks for FAQ schema, and stays
 * accessible by default. The matching JSON-LD FAQPage block is injected
 * on the page itself, not here, so this component stays presentation-only.
 */

export function VsFaqAccordion({ items }: { items: FaqEntry[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
      {items.map((item, i) => (
        <details
          key={item.q}
          className="group border-b border-border/50 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[14px] font-medium leading-snug text-foreground">
                {item.q}
              </span>
            </div>
            <span
              aria-hidden
              className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-transform group-open:rotate-180"
            >
              <svg
                viewBox="0 0 12 12"
                width={12}
                height={12}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 4.5 6 7.5 9 4.5" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-5 pl-[3.25rem] pr-10">
            <p className="text-pretty text-[13.5px] leading-relaxed text-foreground/85">
              {item.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

export default VsFaqAccordion;
