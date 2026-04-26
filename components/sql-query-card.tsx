"use client";

/**
 * One SQL query on /sql. Header shows what the query is and which question it
 * answers. The body is a tabbed source viewer modeled on /automations: dark
 * mono <pre>, paper text, light hand-rolled token coloring for SQL keywords,
 * comments, and string literals so it doesn't read as a wall of grey.
 *
 * Below the SQL: expected columns, a small sample-output table, and the
 * analysis callout in a forest-tinted panel.
 */

import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SqlQuery } from "@/data/sql-queries";

const CADENCE_LABEL: Record<SqlQuery["cadence"], string> = {
  "ad-hoc": "ad-hoc",
  weekly: "weekly",
  daily: "daily",
  "real-time": "real-time",
};

const CADENCE_DOT: Record<SqlQuery["cadence"], string> = {
  "ad-hoc": "bg-muted-foreground/60",
  weekly: "bg-forest-500",
  daily: "bg-ochre-400",
  "real-time": "bg-forest-300 animate-pulse",
};

export function SqlQueryCard({ query, index }: { query: SqlQuery; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const [copied, setCopied] = useState(false);

  const lineCount = query.query.split("\n").length;

  async function copySql() {
    try {
      await navigator.clipboard.writeText(query.query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      className={cn(
        "rounded-lg border border-border/60 bg-card p-5 transition-colors",
        "hover:border-primary/30",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              query {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="font-display text-[19px] leading-tight text-foreground">
            {query.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {query.question}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Chip>
            <span
              className={cn(
                "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                CADENCE_DOT[query.cadence],
              )}
              style={{ height: 6, width: 6 }}
            />
            {CADENCE_LABEL[query.cadence]}
          </Chip>
          <Chip>{query.warehouse}</Chip>
        </div>
      </header>

      <div className="mt-5 border-t border-border/60 pt-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={cn(
            "rounded-md border border-border/70 bg-background px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]",
            "text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground",
          )}
        >
          {open ? "Hide SQL" : "View SQL"}
        </button>
        <span className="ml-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {lineCount} lines
        </span>
      </div>

      {open ? (
        <SourceBlock
          source={query.query}
          lineCount={lineCount}
          copied={copied}
          onCopy={copySql}
        />
      ) : null}

      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <ExpectedColumns columns={query.expectedColumns} />
        <SampleOutputTable
          columns={query.expectedColumns}
          rows={query.sampleOutput}
        />
      </div>

      <Callout text={query.analysisCallout} />
    </article>
  );
}

export default SqlQueryCard;

function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2 py-0.5",
        "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function SourceBlock({
  source,
  lineCount,
  copied,
  onCopy,
}: {
  source: string;
  lineCount: number;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-md border border-ink/50 bg-ink/95 text-paper shadow-sm">
      <div className="flex items-center justify-between border-b border-paper/10 px-4 py-2">
        <span className="font-mono text-[11px] tracking-[0.05em] text-paper/80">
          query.sql
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper/50">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className={cn(
              "rounded-sm border border-paper/20 bg-paper/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
              "text-paper/80 transition-colors hover:border-paper/40 hover:text-paper",
            )}
          >
            {copied ? "copied" : "copy SQL"}
          </button>
        </div>
      </div>
      <pre
        className="max-h-[420px] overflow-auto px-4 py-3 text-paper"
        style={{ lineHeight: 1.6 }}
      >
        <code className="font-mono text-[12px]">{highlightSql(source)}</code>
      </pre>
    </div>
  );
}

function ExpectedColumns({ columns }: { columns: string[] }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/20 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        expected columns
      </div>
      <ul className="mt-2 space-y-1.5">
        {columns.map((col) => (
          <li
            key={col}
            className="font-mono text-[12px] tabular-nums text-foreground/85"
          >
            {col}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SampleOutputTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border/60">
      <div className="border-b border-border/60 bg-muted/20 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          sample output (5 rows)
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[11.5px] tabular-nums">
          <thead>
            <tr className="border-b border-border/50 bg-card/80">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-1.5 text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={cn(
                  "border-b border-border/40 last:border-b-0",
                  ri % 2 === 1 ? "bg-muted/10" : "bg-transparent",
                )}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-1.5 text-foreground/85"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <div
      className={cn(
        "mt-5 rounded-md border border-forest-300/50 bg-forest-50/80 p-4",
        "text-[13px] leading-relaxed text-forest-900",
      )}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
        what I&apos;d do with this
      </div>
      <p className="mt-1.5">{text}</p>
    </div>
  );
}

/**
 * Hand-rolled SQL token highlighter. Walks the source once, emitting spans
 * for line comments, single-quoted strings, numbers, and uppercase keywords.
 * No deps; tuned for the Postgres dialect used in data/sql-queries.ts.
 */
function highlightSql(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const len = src.length;

  const KEYWORDS = new Set([
    "SELECT",
    "FROM",
    "WHERE",
    "AND",
    "OR",
    "NOT",
    "AS",
    "ON",
    "JOIN",
    "LEFT",
    "RIGHT",
    "INNER",
    "OUTER",
    "FULL",
    "GROUP",
    "BY",
    "ORDER",
    "HAVING",
    "LIMIT",
    "WITH",
    "DISTINCT",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "IN",
    "IS",
    "NULL",
    "TRUE",
    "FALSE",
    "ASC",
    "DESC",
    "NULLS",
    "FIRST",
    "LAST",
    "INTERVAL",
    "FILTER",
    "OVER",
    "PARTITION",
    "ROW_NUMBER",
    "PERCENTILE_CONT",
    "WITHIN",
    "GROUP",
    "EXTRACT",
    "EPOCH",
    "DAY",
    "COALESCE",
    "NULLIF",
    "GREATEST",
    "LEAST",
    "AVG",
    "SUM",
    "COUNT",
    "MIN",
    "MAX",
    "ROUND",
    "CAST",
    "NUMERIC",
    "INTEGER",
    "DATE",
    "CURRENT_DATE",
    "NOW",
    "BETWEEN",
    "EXISTS",
    "UNION",
    "ALL",
  ]);

  const FUNCTIONS = new Set([
    "ROW_NUMBER",
    "PERCENTILE_CONT",
    "EXTRACT",
    "COALESCE",
    "NULLIF",
    "GREATEST",
    "LEAST",
    "AVG",
    "SUM",
    "COUNT",
    "MIN",
    "MAX",
    "ROUND",
    "NOW",
    "CAST",
  ]);

  while (i < len) {
    const ch = src[i];
    const next = src[i + 1];

    // Line comment: -- ... \n
    if (ch === "-" && next === "-") {
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

    // Single-quoted string literal.
    if (ch === "'") {
      let j = i + 1;
      while (j < len) {
        if (src[j] === "'" && src[j + 1] === "'") {
          j += 2;
          continue;
        }
        if (src[j] === "'") {
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

    // Identifier / keyword. SQL is case-insensitive, but we render the
    // uppercase form as a keyword so the visual rhythm matches the source.
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < len && /[A-Za-z0-9_]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      const upper = word.toUpperCase();
      if (KEYWORDS.has(upper) && word === upper) {
        out.push(
          <span key={key++} className="text-forest-200">
            {word}
          </span>,
        );
      } else if (FUNCTIONS.has(upper) && word === upper) {
        out.push(
          <span key={key++} className="text-ochre-100">
            {word}
          </span>,
        );
      } else {
        out.push(<span key={key++}>{word}</span>);
      }
      i = j;
      continue;
    }

    // Punctuation / whitespace run.
    let j = i;
    while (
      j < len &&
      !/[A-Za-z_0-9']/.test(src[j]!) &&
      !(src[j] === "-" && src[j + 1] === "-")
    ) {
      j++;
    }
    out.push(<span key={key++}>{src.slice(i, j)}</span>);
    i = j;
  }

  return out;
}
