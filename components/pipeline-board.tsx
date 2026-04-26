"use client";

/**
 * Attio-style 8-column Kanban for the Vero outbound pipeline.
 *
 * Why this is a single client component (not one per column): drag state and
 * the active filter set both span columns, so co-locating them avoids a tiny
 * context just to thread one Set through.
 *
 * State is in-memory and resets on reload — that's an explicit demo choice in
 * the plan. No API call on drop.
 */

import { useMemo, useState, type DragEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PIPELINE_STAGES,
  SEGMENT_LABELS,
  type Lead,
  type PipelineStage,
  type Segment,
} from "@/lib/types";
import { LeadCard } from "@/components/lead-card";

type ScoreBand = "all" | "high" | "mid" | "low";

const SCORE_BANDS: { id: ScoreBand; label: string }[] = [
  { id: "all", label: "All scores" },
  { id: "high", label: "80+" },
  { id: "mid", label: "60–79" },
  { id: "low", label: "<60" },
];

const SEGMENT_PILLS: { id: "all" | Segment; label: string }[] = [
  { id: "all", label: "All segments" },
  { id: "clinic_solo", label: SEGMENT_LABELS.clinic_solo },
  { id: "clinic_group", label: SEGMENT_LABELS.clinic_group },
  { id: "specialty", label: SEGMENT_LABELS.specialty },
  { id: "enterprise", label: SEGMENT_LABELS.enterprise },
];

function inScoreBand(score: number, band: ScoreBand): boolean {
  switch (band) {
    case "high":
      return score >= 80;
    case "mid":
      return score >= 60 && score < 80;
    case "low":
      return score < 60;
    default:
      return true;
  }
}

export function PipelineBoard({ leads }: { leads: Lead[] }) {
  // Per-lead stage override map. We don't mutate the seed array so resetting
  // is just clearing this map (and reload, which the plan accepts).
  const [stageOverrides, setStageOverrides] = useState<Record<string, PipelineStage>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  // Filters
  const [query, setQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [specialtyMenuOpen, setSpecialtyMenuOpen] = useState(false);
  const [segment, setSegment] = useState<"all" | Segment>("all");
  const [scoreBand, setScoreBand] = useState<ScoreBand>("all");

  // Effective leads: apply overrides for stage so they move between columns.
  const effective: Lead[] = useMemo(
    () =>
      leads.map((l) =>
        stageOverrides[l.id] ? { ...l, stage: stageOverrides[l.id] } : l,
      ),
    [leads, stageOverrides],
  );

  // Build the specialty option list once from the dataset.
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) set.add(l.specialty);
    return Array.from(set).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return effective.filter((l) => {
      if (segment !== "all" && l.segment !== segment) return false;
      if (selectedSpecialties.size > 0 && !selectedSpecialties.has(l.specialty)) return false;
      if (!inScoreBand(l.score, scoreBand)) return false;
      if (q) {
        const hay = `${l.name} ${l.city} ${l.specialty}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [effective, query, selectedSpecialties, segment, scoreBand]);

  // Group + sort (highest score first within each column).
  const byStage = useMemo(() => {
    const groups: Record<PipelineStage, Lead[]> = {
      new: [],
      researching: [],
      contacted: [],
      replied: [],
      demo_booked: [],
      trialing: [],
      customer: [],
      closed_lost: [],
    };
    for (const l of filtered) groups[l.stage].push(l);
    for (const stage of Object.keys(groups) as PipelineStage[]) {
      groups[stage].sort((a, b) => b.score - a.score);
    }
    return groups;
  }, [filtered]);

  // ---- Drag handlers ------------------------------------------------------

  function handleDragStart(e: DragEvent<HTMLDivElement>, leadId: string) {
    setDraggingId(leadId);
    // dataTransfer is required for Firefox to actually fire dragover events.
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", leadId);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverStage(null);
  }

  function handleColumnDragOver(e: DragEvent<HTMLDivElement>, stage: PipelineStage) {
    if (!draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) setDragOverStage(stage);
  }

  function handleColumnDrop(e: DragEvent<HTMLDivElement>, stage: PipelineStage) {
    e.preventDefault();
    const id = draggingId ?? e.dataTransfer.getData("text/plain");
    if (!id) return;
    setStageOverrides((prev) => ({ ...prev, [id]: stage }));
    setDraggingId(null);
    setDragOverStage(null);
  }

  // ---- Empty state --------------------------------------------------------

  if (leads.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-10 text-center">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Pipeline
        </div>
        <p className="mt-3 text-[14px] text-muted-foreground">
          No leads yet. Ingest pipeline running…
        </p>
      </div>
    );
  }

  // ---- Render -------------------------------------------------------------

  const totalShown = filtered.length;
  const hasActiveFilter =
    query.length > 0 ||
    selectedSpecialties.size > 0 ||
    segment !== "all" ||
    scoreBand !== "all";

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, city, specialty"
            className={cn(
              "h-8 w-[260px] rounded-md border border-border/60 bg-card pl-8 pr-3",
              "text-[13px] placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-1 focus:ring-primary/30",
            )}
          />
        </div>

        {/* Specialty multi-select */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSpecialtyMenuOpen((v) => !v)}
            className={cn(
              "h-8 rounded-md border border-border/60 bg-card px-3 text-[12.5px]",
              "hover:bg-muted/40",
              selectedSpecialties.size > 0 && "border-primary/30 text-foreground",
            )}
          >
            Specialty
            {selectedSpecialties.size > 0 ? (
              <span className="ml-1.5 rounded bg-secondary px-1 font-mono text-[10px] text-secondary-foreground">
                {selectedSpecialties.size}
              </span>
            ) : null}
          </button>
          {specialtyMenuOpen ? (
            <div
              className={cn(
                "absolute left-0 top-9 z-30 max-h-72 w-64 overflow-auto rounded-md border border-border/60",
                "bg-popover p-1 shadow-lg",
              )}
            >
              {allSpecialties.length === 0 ? (
                <div className="px-2 py-1.5 text-[12px] text-muted-foreground">
                  No specialties yet
                </div>
              ) : (
                allSpecialties.map((s) => {
                  const checked = selectedSpecialties.has(s);
                  return (
                    <label
                      key={s}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-[12.5px]",
                        "hover:bg-muted/60",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedSpecialties((prev) => {
                            const next = new Set(prev);
                            if (next.has(s)) next.delete(s);
                            else next.add(s);
                            return next;
                          })
                        }
                        className="h-3 w-3 accent-primary"
                      />
                      <span className="truncate">{s}</span>
                    </label>
                  );
                })
              )}
              {selectedSpecialties.size > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelectedSpecialties(new Set())}
                  className="mt-1 w-full rounded px-2 py-1 text-left text-[11.5px] text-muted-foreground hover:bg-muted/60"
                >
                  Clear specialties
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Segment pills */}
        <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card p-0.5">
          {SEGMENT_PILLS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSegment(p.id)}
              className={cn(
                "rounded px-2 py-1 text-[11.5px] transition-colors",
                segment === p.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted/40",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Score band */}
        <div className="flex items-center gap-1 rounded-md border border-border/60 bg-card p-0.5">
          {SCORE_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setScoreBand(b.id)}
              className={cn(
                "rounded px-2 py-1 text-[11.5px] transition-colors",
                scoreBand === b.id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted/40",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 text-[11.5px] text-muted-foreground">
          <span className="font-mono tabular-nums">
            {totalShown.toLocaleString()} shown / {leads.length.toLocaleString()} total
          </span>
          {hasActiveFilter ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedSpecialties(new Set());
                setSegment("all");
                setScoreBand("all");
              }}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <X className="h-3 w-3" /> reset
            </button>
          ) : null}
          {Object.keys(stageOverrides).length > 0 ? (
            <button
              type="button"
              onClick={() => setStageOverrides({})}
              className="rounded px-1.5 py-0.5 hover:bg-muted/50 hover:text-foreground"
              title="Reset drag overrides (in-memory only)"
            >
              undo moves
            </button>
          ) : null}
        </div>
      </div>

      {/* Board */}
      <div className="-mx-6 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10">
        <div className="flex min-w-max gap-3">
          {PIPELINE_STAGES.map(({ id, label }) => {
            const items = byStage[id];
            const isDropTarget = dragOverStage === id;
            return (
              <div
                key={id}
                onDragOver={(e) => handleColumnDragOver(e, id)}
                onDragLeave={() =>
                  setDragOverStage((cur) => (cur === id ? null : cur))
                }
                onDrop={(e) => handleColumnDrop(e, id)}
                className={cn(
                  "flex w-[260px] shrink-0 flex-col rounded-lg border bg-muted/20 transition-colors",
                  isDropTarget
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/50",
                )}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-lg border-b border-border/40 bg-muted/40 px-3 py-2 backdrop-blur">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </div>
                  <div className="font-mono text-[11px] tabular-nums text-muted-foreground/80">
                    {items.length}
                  </div>
                </div>
                <div className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto p-2">
                  {items.length === 0 ? (
                    <div className="rounded border border-dashed border-border/40 p-3 text-center text-[11px] text-muted-foreground/60">
                      empty
                    </div>
                  ) : (
                    items.map((l) => (
                      <LeadCard
                        key={l.id}
                        lead={l}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggingId === l.id}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PipelineBoard;
