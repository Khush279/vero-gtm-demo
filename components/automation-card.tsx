"use client";

/**
 * One automation card on /automations. Top half is editorial summary (name,
 * description, trigger pill, last-run timestamp + status dot). Bottom is a
 * "View source" toggle that expands a dark mono <pre> showing the actual file
 * contents the server read off disk. Light hand-rolled token coloring — no
 * highlighter dep, just a few regex passes so it doesn't read as a wall of
 * grey.
 */

import { useState } from "react";
import type { ReactNode } from "react";
import { cn, smartDate } from "@/lib/utils";
import type { Automation } from "@/lib/types";

type Status = Automation["lastRun"]["status"];

const STATUS_DOT: Record<Status, string> = {
  success: "bg-forest-500",
  running: "bg-ochre-400 animate-pulse",
  error: "bg-destructive",
};

const STATUS_LABEL: Record<Status, string> = {
  success: "success",
  running: "running",
  error: "error",
};

export type AutomationCardProps = {
  automation: Automation;
  source: string;
  lineCount: number;
};

export function AutomationCard({ automation, source, lineCount }: AutomationCardProps) {
  const [open, setOpen] = useState(false);
  const { lastRun } = automation;

  return (
    <article
      className={cn(
        "group rounded-lg border border-border/60 bg-card p-5 transition-colors",
        "hover:border-primary/30",
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="font-display text-[19px] leading-tight text-foreground">
            {automation.name}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {automation.description}
          </p>
        </div>
        <div
          className="flex shrink-0 items-center"
          title={`Last run ${STATUS_LABEL[lastRun.status]}`}
        >
          <span
            className={cn(
              "mr-2 inline-block h-1.5 w-1.5 rounded-full",
              STATUS_DOT[lastRun.status],
            )}
            style={{ height: 6, width: 6 }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {STATUS_LABEL[lastRun.status]}
          </span>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
        <span
          className={cn(
            "inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2 py-0.5",
            "font-mono uppercase tracking-[0.14em] text-muted-foreground",
          )}
          title="Trigger or schedule"
        >
          {automation.trigger}
        </span>
        <span className="font-mono tabular-nums text-muted-foreground/80">
          last run {smartDate(lastRun.at)}
        </span>
        {lastRun.note ? (
          <span className="text-muted-foreground/70">· {lastRun.note}</span>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {automation.sourceSummary}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={cn(
            "rounded-md border border-border/70 bg-background px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]",
            "text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground",
          )}
        >
          {open ? "Hide source" : "View source"}
        </button>
      </div>

      {open ? (
        <SourceBlock
          path={automation.sourcePath}
          source={source}
          lineCount={lineCount}
        />
      ) : null}
    </article>
  );
}

export default AutomationCard;

function SourceBlock({
  path,
  source,
  lineCount,
}: {
  path: string;
  source: string;
  lineCount: number;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-md border border-ink/50 bg-ink/95 text-paper shadow-sm">
      <div className="flex items-center justify-between border-b border-paper/10 px-4 py-2">
        <span className="font-mono text-[11px] tracking-[0.05em] text-paper/80">
          {path}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper/50">
          {lineCount} {lineCount === 1 ? "line" : "lines"}
        </span>
      </div>
      <pre
        className="max-h-96 overflow-auto px-4 py-3 text-paper"
        style={{ lineHeight: 1.6 }}
      >
        <code className="font-mono text-[12px]">
          {highlight(source)}
        </code>
      </pre>
    </div>
  );
}

/**
 * Tiny token highlighter. Splits comments / strings / keywords / numbers into
 * spans with subtle paper-tinted colors. No deps — handles common TypeScript
 * shapes well enough for a demo. Multi-line block comments are walked first
 * so we don't accidentally tokenize keywords inside them.
 */
function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const len = src.length;

  const KEYWORDS = new Set([
    "import",
    "from",
    "export",
    "default",
    "const",
    "let",
    "var",
    "function",
    "return",
    "async",
    "await",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "break",
    "continue",
    "new",
    "type",
    "interface",
    "enum",
    "class",
    "extends",
    "implements",
    "public",
    "private",
    "protected",
    "readonly",
    "static",
    "true",
    "false",
    "null",
    "undefined",
    "void",
    "as",
    "in",
    "of",
    "throw",
    "try",
    "catch",
    "finally",
    "typeof",
    "instanceof",
  ]);

  const push = (node: ReactNode) => {
    out.push(<span key={key++}>{node}</span>);
  };

  while (i < len) {
    const ch = src[i];
    const next = src[i + 1];

    // Block comment.
    if (ch === "/" && next === "*") {
      let j = i + 2;
      while (j < len && !(src[j] === "*" && src[j + 1] === "/")) j++;
      j = Math.min(j + 2, len);
      out.push(
        <span key={key++} className="text-paper/45 italic">
          {src.slice(i, j)}
        </span>,
      );
      i = j;
      continue;
    }

    // Line comment.
    if (ch === "/" && next === "/") {
      let j = i;
      while (j < len && src[j] !== "\n") j++;
      out.push(
        <span key={key++} className="text-paper/45 italic">
          {src.slice(i, j)}
        </span>,
      );
      i = j;
      continue;
    }

    // String literal (single, double, backtick — no nested template parsing).
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < len) {
        if (src[j] === "\\") {
          j += 2;
          continue;
        }
        if (src[j] === quote) {
          j++;
          break;
        }
        j++;
      }
      out.push(
        <span key={key++} className="text-ochre-200">
          {src.slice(i, j)}
        </span>,
      );
      i = j;
      continue;
    }

    // Number.
    if (/[0-9]/.test(ch) && (i === 0 || !/[A-Za-z_]/.test(src[i - 1]!))) {
      let j = i;
      while (j < len && /[0-9._]/.test(src[j]!)) j++;
      out.push(
        <span key={key++} className="text-ochre-300">
          {src.slice(i, j)}
        </span>,
      );
      i = j;
      continue;
    }

    // Identifier / keyword.
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < len && /[A-Za-z0-9_$]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      if (KEYWORDS.has(word)) {
        out.push(
          <span key={key++} className="text-forest-200">
            {word}
          </span>,
        );
      } else {
        push(word);
      }
      i = j;
      continue;
    }

    // Everything else (punctuation, whitespace).
    let j = i;
    while (
      j < len &&
      !/[A-Za-z_$0-9"'`]/.test(src[j]!) &&
      !(src[j] === "/" && (src[j + 1] === "/" || src[j + 1] === "*"))
    ) {
      j++;
    }
    push(src.slice(i, j));
    i = j;
  }

  return out;
}
