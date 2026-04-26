/**
 * Pure presentational artifact card. Type-aware: each `type` gets its own
 * treatment so the timeline reads as a sequence of real objects (an email,
 * a calendar invite, a transcript) rather than a wall of cards.
 *
 * Outbound vs. inbound coloring is decided by the page (forest for outbound,
 * ochre for inbound) and passed in via `tone`. This component handles only
 * the inside of the card; positioning is the timeline's job.
 */

import { cn } from "@/lib/utils";
import type { CaseStudyArtifact } from "@/data/case-study";

type Tone = "outbound" | "inbound";

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "America/Toronto",
};

function formatStamp(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleString("en-US", TIME_OPTS)
    .replace(" AM", "a")
    .replace(" PM", "p");
}

/**
 * Renders very lightweight markdown: **bold**, bullet lists, numbered lists,
 * blank-line paragraph breaks. We deliberately keep this in-house instead of
 * pulling react-markdown for a 12-artifact page.
 */
function ProseBody({ body, italic = false }: { body: string; italic?: boolean }) {
  const blocks = body.split(/\n{2,}/);
  return (
    <div
      className={cn(
        "space-y-3 font-serif text-[15px] leading-relaxed text-foreground",
        italic && "font-display-italic",
      )}
    >
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isBulletBlock = lines.every((l) => /^[-*]\s+/.test(l.trim()));
        const isNumberedBlock = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
        if (isBulletBlock) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-muted-foreground">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (isNumberedBlock) {
          return (
            <ol key={i} className="list-decimal space-y-1.5 pl-5 marker:text-muted-foreground">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line text-pretty">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

/** Inline **bold** parser, no external dep. */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function Stamp({ iso }: { iso: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
      {formatStamp(iso)}
    </span>
  );
}

function Kicker({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  return (
    <div
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.22em]",
        tone === "outbound" ? "text-forest-700" : "text-ochre-700",
      )}
    >
      {children}
    </div>
  );
}

function MetaRow({ entries }: { entries: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
      {entries.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted-foreground/70">{k}</dt>
          <dd className="break-words text-foreground/80 normal-case tracking-normal">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function EmailEnvelope({
  artifact,
  tone,
}: {
  artifact: CaseStudyArtifact;
  tone: Tone;
}) {
  const m = artifact.meta ?? {};
  const headerEntries: [string, string][] = [];
  if (m.from) headerEntries.push(["From", m.from]);
  if (m.to) headerEntries.push(["To", m.to]);
  if (m.subject) headerEntries.push(["Subject", m.subject]);
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        tone === "outbound" ? "border-forest-200" : "border-ochre-200",
      )}
    >
      <div
        className={cn(
          "border-b px-4 py-3",
          tone === "outbound"
            ? "border-forest-100 bg-forest-50/60"
            : "border-ochre-100 bg-ochre-50/70",
        )}
      >
        <MetaRow entries={headerEntries} />
      </div>
      <div className="px-5 py-5">
        <ProseBody body={artifact.body} />
      </div>
      {(m.wordCount || m.leverage || m.predictedReplyRate) ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/50 bg-background/50 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {m.wordCount ? <span>{m.wordCount} words</span> : null}
          {m.leverage ? (
            <span>
              <span className="text-muted-foreground/60">leverage · </span>
              {m.leverage}
            </span>
          ) : null}
          {m.predictedReplyRate ? (
            <span className="ml-auto">
              <span className="text-muted-foreground/60">predicted reply · </span>
              {m.predictedReplyRate}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ResearchNote({ artifact }: { artifact: CaseStudyArtifact }) {
  const m = artifact.meta ?? {};
  const entries: [string, string][] = Object.entries(m).map(([k, v]) => [k, v]);
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/30 shadow-sm">
      {entries.length ? (
        <div className="border-b border-border/50 bg-background/50 px-5 py-2.5">
          <MetaRow entries={entries} />
        </div>
      ) : null}
      <div className="px-5 py-5">
        <ProseBody body={artifact.body} />
      </div>
    </div>
  );
}

function CalendarCard({ artifact }: { artifact: CaseStudyArtifact }) {
  const m = artifact.meta ?? {};
  const entries: [string, string][] = Object.entries(m).map(([k, v]) => [k, v]);
  return (
    <div className="overflow-hidden rounded-xl border border-forest-200 bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-forest-100 bg-forest-50/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
        <CalendarGlyph />
        Calendar invite
      </div>
      <div className="space-y-4 px-5 py-5">
        <ProseBody body={artifact.body} />
        {entries.length ? (
          <div className="rounded-md border border-border/50 bg-background/60 px-4 py-3">
            <MetaRow entries={entries} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TranscriptCard({
  artifact,
  protagonistFirstName,
}: {
  artifact: CaseStudyArtifact;
  protagonistFirstName: string;
}) {
  const m = artifact.meta ?? {};
  const headerEntries: [string, string][] = [];
  if (m.duration) headerEntries.push(["Duration", m.duration]);
  if (m.attendees) headerEntries.push(["Attendees", m.attendees]);
  if (m.objection) headerEntries.push(["Objection", m.objection]);
  const lines = artifact.body.split("\n").filter((l) => l.trim());
  return (
    <div className="overflow-hidden rounded-xl border border-ochre-200 bg-card shadow-sm">
      <div className="border-b border-ochre-100 bg-ochre-50/60 px-4 py-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre-700">
          Demo transcript · excerpt
        </div>
        {headerEntries.length ? (
          <div className="mt-2">
            <MetaRow entries={headerEntries} />
          </div>
        ) : null}
      </div>
      <div className="space-y-3 px-5 py-5">
        {lines.map((line, i) => {
          const match = line.match(/^([A-Z]):\s+(.+)$/);
          if (!match) {
            return (
              <p key={i} className="font-display-italic text-[15px] leading-relaxed text-foreground/80">
                {line}
              </p>
            );
          }
          const [, prefix, rest] = match;
          const isProtagonist = prefix === "Y";
          const speaker = isProtagonist ? protagonistFirstName : "Khush";
          return (
            <div key={i} className="grid grid-cols-[3rem_1fr] gap-3">
              <div
                className={cn(
                  "pt-1 font-mono text-[10px] uppercase tracking-[0.18em]",
                  isProtagonist ? "text-ochre-700" : "text-forest-700",
                )}
              >
                {speaker}
              </div>
              <p className="font-display-italic text-[15.5px] leading-relaxed text-foreground/85">
                {rest}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrialMetricCard({ artifact }: { artifact: CaseStudyArtifact }) {
  const m = artifact.meta ?? {};
  const entries: [string, string][] = Object.entries(m).map(([k, v]) => [
    humanizeKey(k),
    v,
  ]);
  return (
    <div className="overflow-hidden rounded-xl border border-forest-200 bg-card shadow-sm">
      <div className="border-b border-forest-100 bg-forest-50/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
        Trial telemetry
      </div>
      <div className="space-y-4 px-5 py-5">
        <ProseBody body={artifact.body} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="rounded-md border border-border/50 bg-background/50 px-3 py-2.5"
            >
              <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {k}
              </div>
              <div className="mt-1 font-mono text-[14px] tabular-nums text-foreground">
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CloseNoteCard({ artifact }: { artifact: CaseStudyArtifact }) {
  const m = artifact.meta ?? {};
  const entries: [string, string][] = Object.entries(m).map(([k, v]) => [k, v]);
  return (
    <div className="overflow-hidden rounded-xl border border-forest-300 bg-forest-50/40 shadow-sm">
      <div className="px-5 py-5">
        <ProseBody body={artifact.body} />
      </div>
      {entries.length ? (
        <div className="border-t border-forest-200/60 bg-background/40 px-5 py-3">
          <MetaRow entries={entries} />
        </div>
      ) : null}
    </div>
  );
}

function humanizeKey(k: string): string {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function CalendarGlyph() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

export function CaseStudyArtifactCard({
  artifact,
  tone,
  protagonistFirstName,
}: {
  artifact: CaseStudyArtifact;
  tone: Tone;
  protagonistFirstName: string;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <Stamp iso={artifact.occurredAt} />
        <Kicker tone={tone}>{artifact.label}</Kicker>
      </div>
      {(() => {
        switch (artifact.type) {
          case "research-note":
            return <ResearchNote artifact={artifact} />;
          case "email":
          case "reply":
            return <EmailEnvelope artifact={artifact} tone={tone} />;
          case "calendar":
            return <CalendarCard artifact={artifact} />;
          case "transcript-excerpt":
            return (
              <TranscriptCard
                artifact={artifact}
                protagonistFirstName={protagonistFirstName}
              />
            );
          case "trial-metric":
            return <TrialMetricCard artifact={artifact} />;
          case "close-note":
            return <CloseNoteCard artifact={artifact} />;
        }
      })()}
    </div>
  );
}

export default CaseStudyArtifactCard;
