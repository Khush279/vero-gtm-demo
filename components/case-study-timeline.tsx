"use client";

/**
 * Vertical, alternating timeline for the case-study page.
 *
 * Outbound artifacts (research, Khush's emails, calendar holds, telemetry,
 * close notes) sit on the left rail with a forest dot. Inbound artifacts
 * (replies from the prospect) sit on the right rail with an ochre dot. A
 * muted vertical line connects them.
 *
 * The only client-side behavior here is the collapse/expand toggle for long
 * artifact bodies. Defaults: expanded for emails, collapsed for transcripts.
 * Anything under ~280 chars is always expanded and renders without a toggle.
 *
 * On mobile the alternating layout collapses to a single left-aligned rail.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CaseStudyArtifactCard } from "@/components/case-study-artifact";
import type { CaseStudyArtifact } from "@/data/case-study";

type Side = "left" | "right";

const COLLAPSE_THRESHOLD = 280;

/** Artifact types that should default to collapsed when over the threshold. */
const DEFAULT_COLLAPSED_TYPES: ReadonlySet<CaseStudyArtifact["type"]> = new Set<
  CaseStudyArtifact["type"]
>(["transcript-excerpt"]);

function sideForArtifact(a: CaseStudyArtifact): Side {
  // Prospect-originated artifacts sit on the right.
  return a.type === "reply" ? "right" : "left";
}

function previewBody(body: string, max = 220): string {
  if (body.length <= max) return body;
  return body.slice(0, max).trimEnd() + "…";
}

export function CaseStudyTimeline({
  artifacts,
  protagonistFirstName,
}: {
  artifacts: CaseStudyArtifact[];
  protagonistFirstName: string;
}) {
  return (
    <ol className="relative space-y-10">
      {/* Vertical connecting line. Hidden on mobile, where each card stacks
          plainly on the left rail. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-[14px] top-2 w-px bg-border/60 md:left-1/2"
      />
      {artifacts.map((a, i) => {
        const side = sideForArtifact(a);
        return (
          <TimelineRow
            key={i}
            artifact={a}
            side={side}
            protagonistFirstName={protagonistFirstName}
            isFirst={i === 0}
            isLast={i === artifacts.length - 1}
          />
        );
      })}
    </ol>
  );
}

function TimelineRow({
  artifact,
  side,
  protagonistFirstName,
  isFirst,
  isLast,
}: {
  artifact: CaseStudyArtifact;
  side: Side;
  protagonistFirstName: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const tone = side === "right" ? "inbound" : "outbound";
  const isLongBody = artifact.body.length > COLLAPSE_THRESHOLD;
  const defaultCollapsed = isLongBody && DEFAULT_COLLAPSED_TYPES.has(artifact.type);
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

  // Build a partial artifact for the collapsed render so the meta still shows.
  const renderedArtifact: CaseStudyArtifact = collapsed
    ? { ...artifact, body: previewBody(artifact.body) }
    : artifact;

  return (
    <li className="relative grid grid-cols-1 md:grid-cols-2 md:gap-10">
      {/* Marker dot. Mobile: left rail at 14px. Desktop: centered. */}
      <span
        aria-hidden
        className={cn(
          "absolute z-10 h-3 w-3 rounded-full ring-2 ring-background",
          side === "right"
            ? "bg-ochre-500"
            : "bg-forest-600",
          // mobile: at the left rail, top of card
          "left-[8px] top-1.5",
          // desktop: at the center line, top of card
          "md:left-1/2 md:-translate-x-1/2",
        )}
      />
      {/* Bookends so first/last dots feel intentional, slightly larger ring. */}
      {(isFirst || isLast) ? (
        <span
          aria-hidden
          className={cn(
            "absolute z-0 h-5 w-5 rounded-full opacity-30",
            side === "right" ? "bg-ochre-300" : "bg-forest-300",
            "left-[2px] top-[-2px]",
            "md:left-1/2 md:-translate-x-1/2",
          )}
        />
      ) : null}

      {/* Left column. On mobile we always render here. */}
      <div
        className={cn(
          "pl-7 md:pl-0",
          side === "right" ? "md:invisible md:order-1" : "md:order-1 md:pr-6",
        )}
      >
        {side === "left" ? (
          <ArtifactSlot
            artifact={renderedArtifact}
            tone={tone}
            protagonistFirstName={protagonistFirstName}
            isLongBody={isLongBody}
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        ) : null}
      </div>

      {/* Right column. Only used on desktop for inbound artifacts. */}
      <div
        className={cn(
          "hidden md:order-2 md:block",
          side === "left" ? "md:invisible" : "md:pl-6",
        )}
      >
        {side === "right" ? (
          <ArtifactSlot
            artifact={renderedArtifact}
            tone={tone}
            protagonistFirstName={protagonistFirstName}
            isLongBody={isLongBody}
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        ) : null}
      </div>

      {/* Mobile rendering for inbound: drop into the single left-aligned rail. */}
      {side === "right" ? (
        <div className="pl-7 md:hidden">
          <ArtifactSlot
            artifact={renderedArtifact}
            tone={tone}
            protagonistFirstName={protagonistFirstName}
            isLongBody={isLongBody}
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        </div>
      ) : null}
    </li>
  );
}

function ArtifactSlot({
  artifact,
  tone,
  protagonistFirstName,
  isLongBody,
  collapsed,
  onToggle,
}: {
  artifact: CaseStudyArtifact;
  tone: "outbound" | "inbound";
  protagonistFirstName: string;
  isLongBody: boolean;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <CaseStudyArtifactCard
        artifact={artifact}
        tone={tone}
        protagonistFirstName={protagonistFirstName}
      />
      {isLongBody ? (
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "ml-1 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
            "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      ) : null}
    </div>
  );
}

export default CaseStudyTimeline;
