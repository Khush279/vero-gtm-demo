"use client";

/**
 * Client wrapper for /interview-prep. Owns the two filter dimensions
 * (category and asker) and renders the resulting list of QuestionCards.
 *
 * Filters are independent: choosing "Strategy" + "Adeel" shows strategy
 * questions where Adeel is the most likely asker. "Either" passes through
 * regardless of asker filter so questions tagged "either" stay visible
 * across both Adeel and Bill views.
 */

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { QuestionCard } from "@/components/question-card";
import type { InterviewQuestion } from "@/data/interview-prep";

type CategoryFilter = "all" | InterviewQuestion["category"];
type AskerFilter = "all" | InterviewQuestion["asker"];

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fit", label: "Fit" },
  { value: "strategy", label: "Strategy" },
  { value: "execution", label: "Execution" },
  { value: "concerns", label: "Concerns" },
  { value: "compensation", label: "Compensation" },
];

const ASKER_OPTIONS: { value: AskerFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "adeel", label: "Adeel" },
  { value: "bill", label: "Bill" },
  { value: "either", label: "Either" },
];

export function InterviewPrepBoard({
  questions,
}: {
  questions: InterviewQuestion[];
}) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [asker, setAsker] = useState<AskerFilter>("all");

  const visible = useMemo(() => {
    return questions.filter((q) => {
      const categoryMatch = category === "all" || q.category === category;
      // "either" questions stay visible when filtering by adeel or bill, since
      // either of them might ask. "either" filter shows only the questions
      // tagged "either".
      const askerMatch =
        asker === "all" ||
        q.asker === asker ||
        (asker !== "either" && q.asker === "either");
      return categoryMatch && askerMatch;
    });
  }, [questions, category, asker]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <FilterRow
          label="Category"
          options={CATEGORY_OPTIONS.map((o) => ({
            ...o,
            count:
              o.value === "all"
                ? questions.length
                : questions.filter((q) => q.category === o.value).length,
          }))}
          active={category}
          onChange={(v) => setCategory(v as CategoryFilter)}
        />
        <FilterRow
          label="Asker"
          options={ASKER_OPTIONS.map((o) => ({
            ...o,
            count:
              o.value === "all"
                ? questions.length
                : questions.filter((q) => q.asker === o.value).length,
          }))}
          active={asker}
          onChange={(v) => setAsker(v as AskerFilter)}
        />
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-background/40 px-4 py-10 text-center text-[12.5px] text-muted-foreground">
          No questions match this filter. Reset to see all 15.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: { value: string; label: string; count: number }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] transition-colors",
            active === o.value
              ? "bg-forest-700 text-forest-50"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
          aria-pressed={active === o.value}
        >
          <span>{o.label}</span>
          <span
            className={cn(
              "tabular-nums font-mono text-[10px]",
              active === o.value
                ? "text-forest-200"
                : "text-muted-foreground",
            )}
          >
            {o.count}
          </span>
        </button>
      ))}
    </div>
  );
}
