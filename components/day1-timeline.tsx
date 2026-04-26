"use client";

/**
 * /day1 timeline (client). The page itself is a server component that just
 * renders this. All the interactivity lives here:
 *  - Category filter pills (All / Audit / Build / Ship / Talk / Decide)
 *  - Click-to-expand on each block
 *  - "On the clock" simulator that advances 1 sim-hour every 5 real seconds
 *    starting at 8:30am, highlights the active block, and can be paused.
 *
 * The shape is deliberately a left rail of mono time labels and a right
 * column of editorial cards — same visual grammar as a designer's day plan
 * pinned above the desk, not a SaaS dashboard.
 */

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { TimeBlock } from "@/data/day1";

type Category = TimeBlock["category"];
type FilterValue = "all" | Category;

const CATEGORY_LABEL: Record<Category, string> = {
  audit: "Audit",
  build: "Build",
  ship: "Ship",
  talk: "Talk",
  decide: "Decide",
};

/**
 * Chip color per category. Maps roughly to the rest of the demo:
 * audit = neutral muted, build = forest (the build palette), ship = ochre
 * (something going out the door), talk = secondary (human time), decide =
 * primary (a written commitment).
 */
const CATEGORY_CHIP: Record<Category, string> = {
  audit: "bg-muted text-muted-foreground border border-border/60",
  build: "bg-forest-200 text-forest-800 border border-forest-300/60",
  ship: "bg-ochre-100 text-ochre-700 border border-ochre-300/60",
  talk: "bg-secondary text-secondary-foreground border border-border/60",
  decide: "bg-primary text-primary-foreground border border-primary/40",
};

const CATEGORY_DOT: Record<Category, string> = {
  audit: "bg-muted-foreground/60",
  build: "bg-forest-500",
  ship: "bg-ochre-500",
  talk: "bg-secondary-foreground/60",
  decide: "bg-primary",
};

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "audit", label: "Audit" },
  { value: "build", label: "Build" },
  { value: "ship", label: "Ship" },
  { value: "talk", label: "Talk" },
  { value: "decide", label: "Decide" },
];

/** Day starts at 8:30am, ends at 6:00pm. */
const DAY_START = 8.5;
const DAY_END = 18;

/**
 * One real second of wall time = (1 / 5) sim-hours. So a full 9.5h day
 * runs in ~47.5 real seconds when the clock is on. Snappy enough to feel
 * playful without being a flicker.
 */
const SIM_HOURS_PER_REAL_TICK = 0.1; // ticks every 500ms → 1 sim-hour per 5 real seconds

export type Day1TimelineProps = {
  blocks: TimeBlock[];
};

export function Day1Timeline({ blocks }: Day1TimelineProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [clockOn, setClockOn] = useState(false);
  const [simHour, setSimHour] = useState<number>(DAY_START);

  // Tick the simulated clock when it's running.
  useEffect(() => {
    if (!clockOn) return;
    const id = window.setInterval(() => {
      setSimHour((h) => {
        const next = h + SIM_HOURS_PER_REAL_TICK;
        if (next >= DAY_END) {
          // Stop at end of day — don't loop.
          window.setTimeout(() => setClockOn(false), 0);
          return DAY_END;
        }
        return next;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [clockOn]);

  const visibleBlocks = useMemo(() => {
    if (filter === "all") return blocks;
    return blocks.filter((b) => b.category === filter);
  }, [blocks, filter]);

  const activeBlockId = useMemo(() => {
    if (!clockOn && simHour === DAY_START) return null;
    const active = blocks.find(
      (b) => simHour >= b.startHour24 && simHour < b.endHour24,
    );
    return active?.id ?? null;
  }, [blocks, simHour, clockOn]);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleStart = () => {
    if (clockOn) {
      setClockOn(false);
      return;
    }
    if (simHour >= DAY_END) {
      // Reset if we hit end-of-day already.
      setSimHour(DAY_START);
    }
    setClockOn(true);
  };

  const handleReset = () => {
    setClockOn(false);
    setSimHour(DAY_START);
  };

  return (
    <div className="space-y-8">
      {/* Filter row + clock widget */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => {
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-all",
                  isActive
                    ? "border border-primary/40 bg-primary text-primary-foreground"
                    : "border border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  filter !== "all" && !isActive && "opacity-60",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <ClockWidget
          simHour={simHour}
          on={clockOn}
          onToggle={handleStart}
          onReset={handleReset}
        />
      </div>

      {/* Timeline */}
      <ol className="relative space-y-3">
        {visibleBlocks.map((block) => (
          <TimelineRow
            key={block.id}
            block={block}
            expanded={!!expanded[block.id]}
            onToggle={() => toggle(block.id)}
            isActive={activeBlockId === block.id}
            isDimmed={
              filter !== "all" && block.category !== filter
            }
          />
        ))}
      </ol>

      {/* Output of day 1 summary */}
      <DayOneOutputs blocks={blocks} />
    </div>
  );
}

export default Day1Timeline;

/* ----------------------------- Sub-components ----------------------------- */

function TimelineRow({
  block,
  expanded,
  onToggle,
  isActive,
  isDimmed,
}: {
  block: TimeBlock;
  expanded: boolean;
  onToggle: () => void;
  isActive: boolean;
  isDimmed: boolean;
}) {
  return (
    <li
      className={cn(
        "grid grid-cols-[88px_1fr] gap-4 transition-opacity sm:grid-cols-[120px_1fr]",
        isDimmed && "opacity-30",
      )}
    >
      {/* Sticky time label */}
      <div className="pt-3">
        <div className="font-mono text-[11.5px] tabular-nums text-foreground">
          {block.startTime}
        </div>
        <div className="font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
          to {block.endTime}
        </div>
      </div>

      {/* Card */}
      <article
        className={cn(
          "rounded-md border border-border/60 bg-card transition-all",
          "hover:border-primary/30",
          expanded && "border-primary/30",
          isActive &&
            "ring-2 ring-primary/40 border-primary/50 shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="block w-full px-4 py-3.5 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <h3 className="font-display text-[18px] leading-tight text-foreground">
                {block.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                    CATEGORY_CHIP[block.category],
                  )}
                >
                  {CATEGORY_LABEL[block.category]}
                </span>
                {isActive ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    on the clock now
                  </span>
                ) : null}
              </div>
            </div>
            <div className="shrink-0 pt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
              {expanded ? "−" : "+"}
            </div>
          </div>
        </button>

        {expanded ? (
          <div className="space-y-4 border-t border-border/60 px-4 py-4 animate-fade-in">
            <ExpandedBlock label="What" body={block.what} />
            <ExpandedBlock label="Why" body={block.why} />
            <ExpandedBlock label="Output" body={block.output} />
            <div className="space-y-1.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Tools
              </div>
              <div className="flex flex-wrap gap-1.5">
                {block.toolsUsed.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10.5px] text-foreground/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </li>
  );
}

function ExpandedBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="space-y-1">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
        {label}
      </div>
      <p className="text-[13.5px] leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

function ClockWidget({
  simHour,
  on,
  onToggle,
  onReset,
}: {
  simHour: number;
  on: boolean;
  onToggle: () => void;
  onReset: () => void;
}) {
  const showReset = !on && simHour > DAY_START;
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 bg-card px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            on ? "bg-primary animate-pulse" : "bg-muted-foreground/40",
          )}
        />
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
            on the clock
          </span>
          <span className="font-mono text-[13px] tabular-nums text-foreground">
            {formatSimHour(simHour)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "rounded-sm px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors",
          on
            ? "border border-border/60 bg-background text-foreground/80 hover:border-primary/30"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {on ? "Pause" : simHour >= DAY_END ? "Replay" : "Start the day"}
      </button>
      {showReset ? (
        <button
          type="button"
          onClick={onReset}
          className="rounded-sm border border-border/60 bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-primary/30 hover:text-foreground"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

function DayOneOutputs({ blocks }: { blocks: TimeBlock[] }) {
  // Pull every output into a tidy list. Categorize by category so the
  // summary reads as artifact-by-artifact, not block-by-block.
  const byCategory = blocks.reduce<Record<Category, string[]>>(
    (acc, b) => {
      acc[b.category] = acc[b.category] ?? [];
      acc[b.category].push(b.output);
      return acc;
    },
    { audit: [], build: [], ship: [], talk: [], decide: [] },
  );

  const order: Category[] = ["build", "ship", "audit", "talk", "decide"];

  return (
    <section className="rounded-lg border border-border/60 bg-card p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[20px] tracking-tight text-foreground">
          What ships by 6 PM.
        </h2>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          output of day 1
        </span>
      </div>
      <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">
        Every block produces one artifact. The day reads as a stack of small
        concrete moves, not a list of meetings.
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {order.map((cat) => {
          const items = byCategory[cat];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat} className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    CATEGORY_DOT[cat],
                  )}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {CATEGORY_LABEL[cat]} · {items.length}
                </span>
              </div>
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[13px] leading-relaxed text-foreground/90"
                  >
                    <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-muted-foreground/60 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------------- helpers -------------------------------- */

/** "8:30 AM", "1:00 PM" from a fractional hour-of-day. */
function formatSimHour(h: number): string {
  // Clamp inside the day window for display.
  const clamped = Math.min(Math.max(h, DAY_START), DAY_END);
  const totalMinutes = Math.round(clamped * 60);
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const meridiem = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
}
