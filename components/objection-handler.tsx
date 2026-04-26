"use client";

/**
 * Sales-side objection handler. Two-column layout: list of objections on the
 * left, the active objection's full script on the right. Category filter
 * pills on top, copy-to-clipboard at the bottom of the right column.
 *
 * Mounted in two places:
 *   - /objections (full set, all 8)
 *   - /lead/[id] (compactMode: 4-5 most relevant for the discovery call)
 *
 * Pure client component; reads from data/objections.ts. No network.
 */

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  COMPACT_OBJECTION_IDS,
  OBJECTIONS,
  type Objection,
} from "@/data/objections";

type Category = Objection["category"];

const CATEGORY_LABELS: Record<Category, string> = {
  privacy: "Privacy",
  cost: "Cost",
  workflow: "Workflow",
  accuracy: "Accuracy",
  trust: "Trust",
  switching: "Switching",
};

const CATEGORY_ORDER: Category[] = [
  "privacy",
  "cost",
  "workflow",
  "accuracy",
  "trust",
  "switching",
];

type Filter = "all" | Category;

export function ObjectionHandler({
  compactMode = false,
}: {
  compactMode?: boolean;
}) {
  const objections = useMemo(() => {
    if (!compactMode) return OBJECTIONS;
    const set = new Set(COMPACT_OBJECTION_IDS);
    return OBJECTIONS.filter((o) => set.has(o.id));
  }, [compactMode]);

  const availableCategories = useMemo(() => {
    const present = new Set(objections.map((o) => o.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [objections]);

  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string>(objections[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  const visible = useMemo(() => {
    if (filter === "all") return objections;
    return objections.filter((o) => o.category === filter);
  }, [filter, objections]);

  const active =
    objections.find((o) => o.id === activeId) ?? visible[0] ?? objections[0];

  async function copyResponse() {
    if (!active) return;
    try {
      await navigator.clipboard.writeText(active.response);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail in older Safari / insecure contexts. Silent
      // fail is fine here; the text is on screen.
      setCopied(false);
    }
  }

  if (!active) return null;

  return (
    <section className="space-y-5">
      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Filter
        </span>
        <FilterPill
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
          count={objections.length}
        />
        {availableCategories.map((c) => {
          const count = objections.filter((o) => o.category === c).length;
          return (
            <FilterPill
              key={c}
              label={CATEGORY_LABELS[c]}
              active={filter === c}
              onClick={() => setFilter(c)}
              count={count}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
        {/* Left column: objection list */}
        <div className="space-y-2">
          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-background/40 px-4 py-6 text-center text-[12.5px] text-muted-foreground">
              No objections in this category.
            </div>
          ) : (
            visible.map((o) => {
              const isActive = o.id === active.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setActiveId(o.id)}
                  className={cn(
                    "group block w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    isActive
                      ? "border-forest-700 bg-forest-700 text-forest-50 shadow-sm"
                      : "border-border/70 bg-card hover:border-border hover:bg-muted/40",
                  )}
                  aria-pressed={isActive}
                >
                  <div
                    className={cn(
                      "font-mono text-[9.5px] uppercase tracking-[0.2em]",
                      isActive
                        ? "text-forest-200"
                        : "text-muted-foreground",
                    )}
                  >
                    {CATEGORY_LABELS[o.category]}
                  </div>
                  <div
                    className={cn(
                      "mt-1 text-[13.5px] leading-snug",
                      isActive ? "text-forest-50" : "text-foreground",
                    )}
                  >
                    {o.prompt}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right column: active objection script */}
        <article className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {CATEGORY_LABELS[active.category]} objection
          </div>
          <p className="mt-3 font-display-italic text-[22px] leading-snug text-foreground md:text-[26px]">
            &ldquo;{active.prompt}&rdquo;
          </p>

          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Response
          </div>
          <p className="mt-2 text-pretty font-serif text-[15.5px] leading-relaxed text-foreground">
            {active.response}
          </p>

          {active.proofPoint ? (
            <div className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="text-muted-foreground/70">Proof &middot;</span>{" "}
              <span className="text-foreground/80 normal-case tracking-normal">
                {active.proofPoint}
              </span>
            </div>
          ) : null}

          <div className="mt-6 border-l-2 border-forest-700 bg-forest-50/60 px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
              Follow-up ask
            </div>
            <p className="mt-1.5 font-serif text-[14.5px] leading-relaxed text-forest-900">
              {active.followUpAsk}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <button
              type="button"
              onClick={copyResponse}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
                copied
                  ? "bg-forest-700 text-forest-50"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
              aria-live="polite"
            >
              {copied ? "Copied" : "Copy response"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors",
        active
          ? "bg-forest-700 text-forest-50"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
      aria-pressed={active}
    >
      <span>{label}</span>
      <span
        className={cn(
          "tabular-nums font-mono text-[10px]",
          active ? "text-forest-200" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

export default ObjectionHandler;
