/**
 * /sql page. Five SQL queries Khush would run against Vero's warehouse
 * during week one. The page exists to answer the "proficiency working with
 * APIs" line in the JD with a concrete artifact: real Postgres-flavoured
 * SQL, paired with the analysis call each one supports.
 *
 * Server component on purpose: stats are computed from data/sql-queries.ts at
 * request time, then the queries are passed to the client SqlQueryCard which
 * owns the expand-source state and the copy button.
 */

import type { Metadata } from "next";
import { SQL_QUERIES } from "@/data/sql-queries";
import type { SqlQuery } from "@/data/sql-queries";
import { SqlQueryCard } from "@/components/sql-query-card";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "SQL",
  description:
    "Five Postgres queries I'd write against Vero's warehouse in week one. Reply rate by city plus EMR cohort, weighted pipeline, time-to-first-touch percentiles, demo no-show by channel, and a customer health score.",
};

export default function SqlPage() {
  const total = SQL_QUERIES.length;
  const cadenceCounts = countByCadence(SQL_QUERIES);
  const totalLines = SQL_QUERIES.reduce(
    (acc, q) => acc + q.query.split("\n").length,
    0,
  );
  const estRuntime = estimateRuntimeSeconds(SQL_QUERIES);

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Working with APIs · self-service analytics"
        title={<>Five SQL queries, week one.</>}
        subtitle="The questions I'd answer myself instead of pinging the data team. Each one paired with what I'd do with the result."
      />

      <StatsRow
        items={[
          { label: "queries", value: total.toString() },
          {
            label: "est. total runtime",
            value: `${estRuntime}s`,
            sub: `${totalLines} lines of SQL`,
          },
          {
            label: "cadence",
            value: `${cadenceCounts.weekly}w`,
            sub: cadenceBreakdown(cadenceCounts),
          },
        ]}
      />

      <div className="space-y-6">
        {SQL_QUERIES.map((query, index) => (
          <SqlQueryCard key={query.id} query={query} index={index} />
        ))}
      </div>
    </div>
  );
}

function StatsRow({
  items,
}: {
  items: { label: string; value: string; sub?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-card px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[20px] tabular-nums text-foreground">
              {item.value}
            </span>
            {item.sub ? (
              <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground/80">
                {item.sub}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

type CadenceCounts = Record<SqlQuery["cadence"], number>;

function countByCadence(queries: SqlQuery[]): CadenceCounts {
  const init: CadenceCounts = {
    "ad-hoc": 0,
    weekly: 0,
    daily: 0,
    "real-time": 0,
  };
  return queries.reduce<CadenceCounts>((acc, q) => {
    acc[q.cadence] += 1;
    return acc;
  }, init);
}

function cadenceBreakdown(counts: CadenceCounts): string {
  const parts: string[] = [];
  if (counts.weekly) parts.push(`${counts.weekly} weekly`);
  if (counts.daily) parts.push(`${counts.daily} daily`);
  if (counts["real-time"]) parts.push(`${counts["real-time"]} real-time`);
  if (counts["ad-hoc"]) parts.push(`${counts["ad-hoc"]} ad-hoc`);
  return parts.join(" · ");
}

/**
 * Rough runtime estimate based on line count. Not pretending to be exact;
 * the value is meant to read as "these are cheap to run, not multi-minute
 * warehouse jobs." Tuned so the five queries land in the 8-15s range.
 */
function estimateRuntimeSeconds(queries: SqlQuery[]): number {
  const total = queries.reduce((acc, q) => {
    const lines = q.query.split("\n").length;
    return acc + Math.max(1, Math.round(lines * 0.18));
  }, 0);
  return total;
}
