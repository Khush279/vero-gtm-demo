"use client";

/**
 * One day card on /onboarding-plan. Pure presentational, expand-collapse on
 * click. The collapsed state shows day number, theme chip, and the morning +
 * afternoon block titles. The expanded state opens up the descriptions, the
 * outputs, and the EOD brief in a forest-tinted callout at the bottom.
 *
 * No data fetching, no state beyond the open/closed toggle. The page passes
 * the day in. Same visual grammar as the day-1 timeline rows so the demo
 * reads as one product.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OnboardingDay } from "@/data/onboarding-plan";

export type OnboardingDayCardProps = {
  day: OnboardingDay;
};

export function OnboardingDayCard({ day }: OnboardingDayCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={cn(
        "rounded-md border border-border/60 bg-card transition-all",
        "hover:border-primary/30",
        open && "border-primary/30",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="block w-full px-5 py-4 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {day.date}
              </span>
              <span className="rounded-sm border border-forest-300/60 bg-forest-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-forest-800">
                {day.theme}
              </span>
            </div>
            <h3 className="font-display text-[19px] leading-tight text-foreground">
              <span className="text-muted-foreground/60">Day {day.day}.</span>{" "}
              {day.morning.title}
            </h3>
            {!open ? (
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Afternoon: {day.afternoon.title}.
              </p>
            ) : null}
          </div>
          <div className="shrink-0 pt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
            {open ? "−" : "+"}
          </div>
        </div>
      </button>

      {open ? (
        <div className="space-y-5 border-t border-border/60 px-5 py-5 animate-fade-in">
          <Block label="Morning" block={day.morning} />
          <Block label="Afternoon" block={day.afternoon} />

          <div className="rounded-md border border-forest-300/50 bg-forest-100/60 px-4 py-3.5">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest-700">
              EOD brief
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-forest-900/90">
              {day.endOfDayBrief}
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default OnboardingDayCard;

function Block({
  label,
  block,
}: {
  label: string;
  block: OnboardingDay["morning"];
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {label}
        </div>
        <div className="font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
          {block.time}
        </div>
      </div>
      <h4 className="font-display text-[15.5px] leading-tight text-foreground">
        {block.title}
      </h4>
      <p className="text-[13.5px] leading-relaxed text-foreground/90">
        {block.description}
      </p>
      <div className="space-y-1 pt-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Output
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          {block.output}
        </p>
      </div>
    </div>
  );
}
