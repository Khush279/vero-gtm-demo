"use client";

/**
 * Compact lead card used inside the pipeline Kanban columns. Tuned to be
 * scannable at a glance: name + score chip on the first row, a quiet
 * specialty/city sub-line, and a tabular days-in-stage with a coloured dot
 * for next-touch urgency. The whole card is draggable.
 */

import Link from "next/link";
import type { DragEvent } from "react";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/types";

/** Truncate a free-form CPSO specialty string to something card-sized. */
function shortSpecialty(specialty: string): string {
  const s = specialty.trim();
  if (s.length <= 28) return s;
  // Common compactions for the noisier CPSO labels.
  const compact = s
    .replace(/General Practice/i, "GP")
    .replace(/Family Medicine/i, "Family Med")
    .replace(/Internal Medicine/i, "Internal Med")
    .replace(/Obstetrics and Gynaecology/i, "OB/GYN")
    .replace(/Paediatrics|Pediatrics/i, "Paeds");
  return compact.length > 28 ? compact.slice(0, 27).trimEnd() + "…" : compact;
}

/** Tier the score chip into forest / ochre / muted. */
function scoreChipClasses(score: number): string {
  if (score >= 80) return "bg-forest-100 text-forest-700";
  if (score >= 60) return "bg-ochre-100 text-ochre-700";
  return "bg-muted text-muted-foreground/80";
}

/**
 * Returns a urgency dot tone for the next-touch indicator.
 *  red    → overdue (nextTouchAt in the past)
 *  amber  → due within 2 days
 *  none   → either no scheduled touch or > 2 days out
 */
function nextTouchTone(nextTouchAt: string | null, now = new Date()): "red" | "amber" | null {
  if (!nextTouchAt) return null;
  const due = new Date(nextTouchAt).getTime();
  const diffMs = due - now.getTime();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  if (diffMs < 0) return "red";
  if (diffMs <= twoDaysMs) return "amber";
  return null;
}

export type LeadCardProps = {
  lead: Lead;
  /** Called when the user starts dragging this card. */
  onDragStart?: (e: DragEvent<HTMLDivElement>, leadId: string) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  /** Visual grab cursor while dragging. */
  isDragging?: boolean;
};

export function LeadCard({ lead, onDragStart, onDragEnd, isDragging }: LeadCardProps) {
  const tone = nextTouchTone(lead.nextTouchAt);
  const dotClass =
    tone === "red"
      ? "bg-destructive"
      : tone === "amber"
        ? "bg-ochre-400"
        : "bg-border";
  const toneLabel =
    tone === "red"
      ? "overdue"
      : tone === "amber"
        ? "due ≤2d"
        : lead.nextTouchAt
          ? "scheduled"
          : "no touch";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, lead.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab active:cursor-grabbing select-none",
        isDragging && "opacity-40",
      )}
    >
      <Link
        href={`/lead/${lead.id}`}
        className={cn(
          "block rounded-md border border-border/60 bg-card p-3 transition-all",
          "hover:ring-1 hover:ring-primary/20 hover:border-border",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 truncate text-[13px] font-medium leading-tight text-foreground">
            {lead.name}
          </div>
          <span
            className={cn(
              "shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
              scoreChipClasses(lead.score),
            )}
            title={`ICP score ${lead.score}`}
          >
            {lead.score}
          </span>
        </div>

        <div className="mt-1 truncate text-[11.5px] text-muted-foreground">
          {shortSpecialty(lead.specialty)} <span className="text-muted-foreground/50">·</span>{" "}
          {lead.city.replace(", ON", "")}
        </div>

        <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground/80">
          <span className="font-mono tabular-nums">
            {lead.daysInStage}d in stage
          </span>
          <span className="flex items-center gap-1.5" title={`Next touch: ${toneLabel}`}>
            <span className={cn("inline-block h-1.5 w-1.5 rounded-full", dotClass)} />
            <span className="font-mono uppercase tracking-[0.12em]">{toneLabel}</span>
          </span>
        </div>
      </Link>
    </div>
  );
}

export default LeadCard;
