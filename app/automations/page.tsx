/**
 * /automations — the differentiator. Most GTM hires can't write code; this
 * page proves I can. Five jobs, each with a "View source" expander that pulls
 * the actual file off disk at request time so the snippet can never drift
 * from what runs in production.
 *
 * Server component on purpose: file reads happen here, then the source is
 * passed as a prop to the client AutomationCard which owns the expand state.
 */

import { AUTOMATIONS } from "@/data/automations";
import { AutomationCard } from "@/components/automation-card";
import { PageHeader } from "@/components/page-header";
import { readAutomationSource } from "@/lib/read-source";

export const dynamic = "force-dynamic";

type LoadedAutomation = {
  id: string;
  source: string;
  lineCount: number;
};

export default async function AutomationsPage() {
  // Read every source file in parallel. Failures fall back to a placeholder
  // inside readAutomationSource — never lets the page itself error.
  const loaded: LoadedAutomation[] = await Promise.all(
    AUTOMATIONS.map(async (a) => {
      const { source, lineCount } = await readAutomationSource(a.sourcePath);
      return { id: a.id, source, lineCount };
    }),
  );
  const sourceById = new Map(loaded.map((l) => [l.id, l]));

  // Mono-tabular header row stats.
  const total = AUTOMATIONS.length;
  const last24Successes = countLast24h(AUTOMATIONS, "success");
  const last24Total = countLast24h(AUTOMATIONS);
  const successRate =
    last24Total === 0 ? 100 : Math.round((last24Successes / last24Total) * 100);
  const leadsTouchedToday = estimateLeadsTouchedToday(AUTOMATIONS);

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Scripts · integrations · automations · APIs"
        title={<>The engine.</>}
        subtitle="Five jobs that quietly turn outbound from a person-job into a system-job. Every card opens to its actual source code."
      />

      <StatsRow
        items={[
          { label: "automations", value: total.toString() },
          {
            label: "24h success rate",
            value: `${successRate}%`,
            sub: `${last24Successes}/${last24Total} runs`,
          },
          {
            label: "leads touched today",
            value: leadsTouchedToday.toLocaleString("en-US"),
          },
        ]}
      />

      {AUTOMATIONS.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {AUTOMATIONS.map((automation) => {
            const loadedSource = sourceById.get(automation.id);
            return (
              <AutomationCard
                key={automation.id}
                automation={automation}
                source={loadedSource?.source ?? "// Source not yet committed.\n"}
                lineCount={loadedSource?.lineCount ?? 1}
              />
            );
          })}
        </div>
      )}
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

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-card/60 p-10 text-center">
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
        No automations registered yet
      </p>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Populate{" "}
        <code className="font-mono text-[12px] text-foreground/80">
          data/automations.ts
        </code>{" "}
        to see the engine come online.
      </p>
    </div>
  );
}

function countLast24h(
  list: typeof AUTOMATIONS,
  status?: "success" | "running" | "error",
): number {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return list.filter((a) => {
    const at = new Date(a.lastRun.at).getTime();
    if (Number.isNaN(at) || at < cutoff) return false;
    if (status && a.lastRun.status !== status) return false;
    return true;
  }).length;
}

/**
 * Best-effort: pull a "N leads" / "N records" number out of each automation's
 * lastRun.note and sum it. If notes don't carry numbers, fall back to a
 * conservative count of successful runs in the last 24h. Keeps the stat row
 * honest without fabricating metrics.
 */
function estimateLeadsTouchedToday(list: typeof AUTOMATIONS): number {
  let total = 0;
  let foundAny = false;
  for (const a of list) {
    const note = a.lastRun.note;
    if (!note) continue;
    const match = note.match(/(\d[\d,]*)/);
    if (match) {
      const n = Number.parseInt(match[1].replace(/,/g, ""), 10);
      if (!Number.isNaN(n)) {
        total += n;
        foundAny = true;
      }
    }
  }
  if (foundAny) return total;
  return countLast24h(list, "success");
}
