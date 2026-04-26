/**
 * One objective block on /scorecard. Renders the category chip, the objective
 * title, the why-this-quarter line, and the KR grid. Pure presentational,
 * server-safe.
 *
 * Category palette:
 *   growth           -> forest
 *   enterprise       -> primary (deep ink)
 *   team             -> secondary
 *   product-feedback -> ochre
 */

import { cn } from "@/lib/utils";
import type { Objective, ObjectiveCategory } from "@/data/scorecard";
import { ScorecardKrCard } from "@/components/scorecard-kr-card";

const CATEGORY_LABEL: Record<ObjectiveCategory, string> = {
  growth: "growth",
  enterprise: "enterprise",
  team: "team",
  "product-feedback": "product feedback",
};

const CATEGORY_CHIP: Record<ObjectiveCategory, string> = {
  growth: "border-forest-300/60 bg-forest-100 text-forest-800",
  enterprise: "border-primary/30 bg-primary/8 text-primary",
  team: "border-border/70 bg-secondary text-secondary-foreground",
  "product-feedback": "border-ochre-200/80 bg-ochre-50 text-ochre-800",
};

export function ObjectiveSection({
  objective,
  index,
}: {
  objective: Objective;
  index: number;
}) {
  return (
    <section
      className="space-y-5 rounded-lg border border-border/60 bg-card/60 p-6"
      aria-label={`Objective ${index + 1}: ${objective.title}`}
    >
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            objective {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
              CATEGORY_CHIP[objective.category],
            )}
          >
            {CATEGORY_LABEL[objective.category]}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {objective.keyResults.length} KRs
          </span>
        </div>
        <h2 className="font-display text-[24px] font-light leading-tight tracking-tight text-foreground md:text-[26px]">
          {objective.title}
        </h2>
        <p className="max-w-2xl font-serif text-[14.5px] italic leading-relaxed text-muted-foreground">
          {objective.why}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {objective.keyResults.map((kr) => (
          <ScorecardKrCard key={kr.id} kr={kr} />
        ))}
      </div>
    </section>
  );
}

export default ObjectiveSection;
