"use client";

/**
 * Horizontal 30/60/90 gantt with four swimlanes. Pure inline SVG inside a
 * horizontally scrolling container. Hover (or focus) on a bar shows a small
 * tooltip with the full description and metric.
 *
 * No chart library. No layout shift. The SVG has a fixed viewBox so the bar
 * positions are stable across reflows; the wrapper handles overflow on
 * narrow viewports.
 */

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LANE_LABEL,
  LANE_ORDER,
  PHASE_MARKERS,
  TOTAL_DAYS,
  type Lane,
  type Milestone,
  type Status,
} from "@/data/timeline";

/* --------------------------------- Geometry -------------------------------- */

/** SVG coordinate system. Tuned for ~1080px wide on desktop. */
const VB_WIDTH = 1080;
const LANE_HEIGHT = 64;
const LANE_LABEL_W = 132;
const TOP_PAD = 36;
const BOTTOM_PAD = 28;
const BAR_HEIGHT = 26;
const PLOT_WIDTH = VB_WIDTH - LANE_LABEL_W - 16;

const VB_HEIGHT = TOP_PAD + LANE_ORDER.length * LANE_HEIGHT + BOTTOM_PAD;

/** Convert a 1..90 day number into an x coordinate inside the plot area. */
function dayToX(day: number): number {
  const clamped = Math.max(1, Math.min(TOTAL_DAYS, day));
  // 0..89 across the plot width (Day 1 starts at 0, Day 90 ends at width).
  const ratio = (clamped - 1) / (TOTAL_DAYS - 1);
  return LANE_LABEL_W + ratio * PLOT_WIDTH;
}

/** Bar width given start and end day, inclusive. Minimum 6px so 1-day bars
 * stay clickable. */
function barWidth(startDay: number, endDay: number): number {
  const w = dayToX(endDay) - dayToX(startDay);
  return Math.max(w, 6);
}

/* ------------------------------- Style maps -------------------------------- */

/** Lane colors. Tailwind tokens for fill/stroke can't go in SVG attrs, so we
 * use raw CSS variable references and hex from tailwind.config palette. */
const LANE_FILL: Record<Lane, string> = {
  outbound: "#609476", // forest-400
  content: "#d49b34", // ochre-400
  enterprise: "hsl(var(--primary))",
  hire: "hsl(var(--secondary))",
};

const LANE_STROKE: Record<Lane, string> = {
  outbound: "#3d7457", // forest-500
  content: "#bf801f", // ochre-500
  enterprise: "hsl(var(--primary))",
  hire: "hsl(var(--border))",
};

const LANE_TEXT: Record<Lane, string> = {
  outbound: "#ffffff",
  content: "#3f2810", // ochre-900
  enterprise: "hsl(var(--primary-foreground))",
  hire: "hsl(var(--secondary-foreground))",
};

/** Lane row tint (alternating, lane-tinted background). */
const LANE_ROW_BG: Record<Lane, string> = {
  outbound: "#f3f7f4", // forest-50
  content: "#fbf6ed", // ochre-50
  enterprise: "hsl(var(--muted) / 0.4)",
  hire: "hsl(var(--muted) / 0.25)",
};

/* ---------------------------------- Props ---------------------------------- */

export type TimelineGanttProps = {
  milestones: Milestone[];
};

export function TimelineGantt({ milestones }: TimelineGanttProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Group milestones into their lane row index.
  const laneIndex = useMemo(() => {
    const map: Record<Lane, number> = {
      outbound: 0,
      content: 1,
      enterprise: 2,
      hire: 3,
    };
    LANE_ORDER.forEach((l, i) => (map[l] = i));
    return map;
  }, []);

  const hovered = useMemo(
    () => milestones.find((m) => m.id === hoverId) ?? null,
    [hoverId, milestones],
  );

  return (
    <div className="rounded-lg border border-border/60 bg-card">
      {/* Top bar: title + phase legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Plan · Day 1 to Day 90
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-forest-400" />
            Outbound
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-ochre-400" />
            Content
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-primary" />
            Enterprise
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-secondary border border-border/60" />
            Hire #2
          </span>
        </div>
      </div>

      {/* Horizontally-scrolling SVG. min-width keeps the chart legible on
          mobile; the container is the scroll viewport. */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[820px] px-2 py-3">
          <svg
            role="img"
            aria-label="90-day GTM plan, four swimlanes"
            viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
            className="block w-full"
          >
            {/* Lane row tints */}
            {LANE_ORDER.map((lane, i) => (
              <rect
                key={`row-${lane}`}
                x={LANE_LABEL_W}
                y={TOP_PAD + i * LANE_HEIGHT}
                width={PLOT_WIDTH}
                height={LANE_HEIGHT}
                fill={LANE_ROW_BG[lane]}
              />
            ))}

            {/* Lane labels */}
            {LANE_ORDER.map((lane, i) => (
              <g key={`label-${lane}`}>
                <text
                  x={12}
                  y={TOP_PAD + i * LANE_HEIGHT + LANE_HEIGHT / 2 - 4}
                  fontFamily="var(--font-sans)"
                  fontSize={13}
                  fontWeight={500}
                  fill="hsl(var(--foreground))"
                >
                  {LANE_LABEL[lane]}
                </text>
                <text
                  x={12}
                  y={TOP_PAD + i * LANE_HEIGHT + LANE_HEIGHT / 2 + 12}
                  fontFamily="var(--font-mono, ui-monospace)"
                  fontSize={9.5}
                  letterSpacing="0.16em"
                  fill="hsl(var(--muted-foreground))"
                >
                  {milestones.filter((m) => m.lane === lane).length} ITEMS
                </text>
              </g>
            ))}

            {/* Weekly tick marks (every 7 days) along the top */}
            {Array.from({ length: Math.floor(TOTAL_DAYS / 7) + 1 }, (_, i) => {
              const day = i * 7 + 1;
              if (day > TOTAL_DAYS) return null;
              const x = dayToX(day);
              return (
                <g key={`tick-${day}`}>
                  <line
                    x1={x}
                    y1={TOP_PAD - 6}
                    x2={x}
                    y2={TOP_PAD + LANE_ORDER.length * LANE_HEIGHT}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    strokeDasharray="2 3"
                    opacity={0.55}
                  />
                  <text
                    x={x}
                    y={TOP_PAD - 12}
                    textAnchor="middle"
                    fontFamily="var(--font-mono, ui-monospace)"
                    fontSize={9.5}
                    fill="hsl(var(--muted-foreground))"
                  >
                    {`D${day}`}
                  </text>
                </g>
              );
            })}

            {/* Phase guide lines (Day 30 / Day 60) */}
            {PHASE_MARKERS.map((m) => {
              const x = dayToX(m.day);
              return (
                <g key={`phase-${m.day}`}>
                  <line
                    x1={x}
                    y1={TOP_PAD - 4}
                    x2={x}
                    y2={TOP_PAD + LANE_ORDER.length * LANE_HEIGHT + 4}
                    stroke="hsl(var(--primary))"
                    strokeWidth={1.25}
                    opacity={0.6}
                  />
                  <rect
                    x={x - 26}
                    y={TOP_PAD + LANE_ORDER.length * LANE_HEIGHT + 8}
                    width={52}
                    height={14}
                    rx={3}
                    fill="hsl(var(--primary))"
                    opacity={0.92}
                  />
                  <text
                    x={x}
                    y={TOP_PAD + LANE_ORDER.length * LANE_HEIGHT + 18}
                    textAnchor="middle"
                    fontFamily="var(--font-mono, ui-monospace)"
                    fontSize={9.5}
                    letterSpacing="0.18em"
                    fill="hsl(var(--primary-foreground))"
                  >
                    {m.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Pattern defs for the "blocked" diagonal stripe */}
            <defs>
              <pattern
                id="blocked-stripe"
                width={6}
                height={6}
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width={6} height={6} fill="hsl(var(--destructive) / 0.15)" />
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={6}
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                />
              </pattern>
            </defs>

            {/* Bars */}
            {milestones.map((m) => {
              const row = laneIndex[m.lane];
              const x = dayToX(m.startDay);
              const w = barWidth(m.startDay, m.endDay);
              const y = TOP_PAD + row * LANE_HEIGHT + (LANE_HEIGHT - BAR_HEIGHT) / 2;
              const isHover = hoverId === m.id;
              const fill =
                m.status === "blocked"
                  ? "url(#blocked-stripe)"
                  : LANE_FILL[m.lane];
              const stroke = LANE_STROKE[m.lane];
              const strokeDash =
                m.status === "in-progress" ? "5 3" : undefined;
              const opacity =
                m.status === "planned" ? 0.78 : m.status === "shipped" ? 1 : 0.92;

              const labelText = m.title;
              // Show the inline label only if the bar is wide enough.
              const showInlineLabel = w >= 110;

              return (
                <g
                  key={m.id}
                  onMouseEnter={() => setHoverId(m.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onFocus={() => setHoverId(m.id)}
                  onBlur={() => setHoverId(null)}
                  tabIndex={0}
                  className="cursor-pointer outline-none"
                >
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={BAR_HEIGHT}
                    rx={4}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isHover ? 2 : 1}
                    strokeDasharray={strokeDash}
                    opacity={opacity}
                  />
                  {/* Status pip on the left edge */}
                  <StatusPip status={m.status} x={x + 4} y={y + BAR_HEIGHT / 2} />

                  {showInlineLabel ? (
                    <text
                      x={x + 16}
                      y={y + BAR_HEIGHT / 2 + 4}
                      fontFamily="var(--font-sans)"
                      fontSize={11.5}
                      fontWeight={500}
                      fill={LANE_TEXT[m.lane]}
                      style={{ pointerEvents: "none" }}
                    >
                      {truncateForBar(labelText, w)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tooltip pinned to the top-right of the scroll container so it
            doesn't get cut off by overflow:hidden on narrow rows. */}
        {hovered ? (
          <div className="pointer-events-none absolute right-3 top-3 max-w-[300px] rounded-md border border-border/60 bg-popover/95 p-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <LaneChip lane={hovered.lane} />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Day {hovered.startDay}–{hovered.endDay}
              </span>
            </div>
            <div className="mt-1.5 font-display text-[15px] leading-tight tracking-tight text-foreground">
              {hovered.title}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/80">
              {hovered.description}
            </p>
            {hovered.metric ? (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  Target
                </span>
                <span className="font-mono text-[11px] text-foreground">
                  {hovered.metric}
                </span>
              </div>
            ) : null}
            <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
              Status · {hovered.status.replace("-", " ")}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TimelineGantt;

/* -------------------------------- Helpers -------------------------------- */

function StatusPip({
  status,
  x,
  y,
}: {
  status: Status;
  x: number;
  y: number;
}) {
  if (status === "shipped") {
    return <circle cx={x + 4} cy={y} r={3} fill="#ffffff" opacity={0.95} />;
  }
  if (status === "in-progress") {
    return (
      <circle
        cx={x + 4}
        cy={y}
        r={3}
        fill="#ffffff"
        stroke="hsl(var(--primary))"
        strokeWidth={1}
        opacity={0.9}
      />
    );
  }
  if (status === "blocked") {
    return (
      <circle cx={x + 4} cy={y} r={3} fill="hsl(var(--destructive))" />
    );
  }
  return (
    <circle
      cx={x + 4}
      cy={y}
      r={2.5}
      fill="#ffffff"
      opacity={0.6}
    />
  );
}

function LaneChip({ lane }: { lane: Lane }) {
  const cls = cn(
    "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
    lane === "outbound" &&
      "bg-forest-200 text-forest-800 border-forest-300/60",
    lane === "content" && "bg-ochre-100 text-ochre-700 border-ochre-300/60",
    lane === "enterprise" && "bg-primary text-primary-foreground border-primary/40",
    lane === "hire" && "bg-secondary text-secondary-foreground border-border/60",
  );
  return <span className={cls}>{LANE_LABEL[lane]}</span>;
}

/** Rough character-fit truncation. ~6.5px per char at 11.5px font. */
function truncateForBar(text: string, barWidthPx: number): string {
  // Reserve 18px for left padding + pip.
  const usable = Math.max(barWidthPx - 22, 0);
  const chars = Math.floor(usable / 6.5);
  if (text.length <= chars) return text;
  if (chars <= 1) return "";
  return text.slice(0, Math.max(chars - 1, 1)).trimEnd() + "…";
}
