import { cn } from "@/lib/utils";
import {
  BUDGET_CURRENCY_FMT,
  CATEGORY_LABEL,
  CATEGORY_TONE,
  STATUS_TONE,
  type LineItem,
} from "@/data/budget";

/**
 * Pure presentational table for /budget. Groups lines by category in a fixed
 * editorial order so the eye sees People first (the biggest spend), then Tools,
 * Content, Partnerships, Experiments, and Events last (intentional zero).
 *
 * Numbers are tabular-nums and monospaced so the column reads as one block.
 * Status chips reuse the forest/ochre palette from /channel-mix and the metrics
 * dashboard so the demo feels like one product.
 */

const CATEGORY_ORDER: LineItem["category"][] = [
  "people",
  "tools",
  "content",
  "partnerships",
  "experiments",
  "events",
];

function formatMoney(n: number): string {
  if (n === 0) return "$0";
  return BUDGET_CURRENCY_FMT.format(n);
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-2 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function BudgetTable({ lines }: { lines: LineItem[] }) {
  // Group by category, preserving the editorial order above.
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: lines.filter((l) => l.category === cat),
    subtotal: lines
      .filter((l) => l.category === cat)
      .reduce((s, l) => s + l.quarterlyAmount, 0),
  })).filter((g) => g.items.length > 0);

  const total = lines.reduce((s, l) => s + l.quarterlyAmount, 0);

  return (
    <div className="overflow-hidden rounded-md border border-border/60 bg-card">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            <Th className="w-[12%]">Category</Th>
            <Th className="w-[22%]">Line item</Th>
            <Th className="w-[9%] text-right">Monthly</Th>
            <Th className="w-[9%] text-right">Quarterly</Th>
            <Th className="w-[24%]">Rationale</Th>
            <Th className="w-[16%]">Expected return</Th>
            <Th className="w-[8%]">Owner</Th>
          </tr>
        </thead>
        <tbody>
          {grouped.map((group) => (
            <BudgetGroup key={group.category} group={group} />
          ))}
          <tr className="border-t-2 border-border/80 bg-muted/40">
            <td
              colSpan={3}
              className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground"
            >
              Total proposed · Q4
            </td>
            <td className="px-4 py-3 text-right font-display text-[18px] font-light tabular-nums text-foreground">
              {formatMoney(total)}
            </td>
            <td colSpan={3} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BudgetGroup({
  group,
}: {
  group: {
    category: LineItem["category"];
    items: LineItem[];
    subtotal: number;
  };
}) {
  return (
    <>
      <tr className="bg-muted/15">
        <td
          colSpan={7}
          className="border-b border-border/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span>{CATEGORY_LABEL[group.category]}</span>
            <span className="tabular-nums text-foreground/70">
              {formatMoney(group.subtotal)}
            </span>
          </div>
        </td>
      </tr>
      {group.items.map((line) => (
        <BudgetRow key={line.id} line={line} />
      ))}
    </>
  );
}

function BudgetRow({ line }: { line: LineItem }) {
  const isZero = line.quarterlyAmount === 0;
  return (
    <tr
      className={cn(
        "border-b border-border/40 align-top last:border-b-0",
        isZero && "bg-muted/10",
      )}
    >
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
            CATEGORY_TONE[line.category],
          )}
        >
          {CATEGORY_LABEL[line.category]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="text-[13px] text-foreground">{line.label}</div>
        <div className="mt-1">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em]",
              STATUS_TONE[line.status],
            )}
          >
            {line.status}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-mono text-[13px] tabular-nums text-foreground/85">
        {formatMoney(line.monthlyAmount)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-[13px] tabular-nums text-foreground">
        {formatMoney(line.quarterlyAmount)}
      </td>
      <td className="px-4 py-3 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
        {line.rationale}
      </td>
      <td className="px-4 py-3 text-pretty text-[12.5px] leading-relaxed text-foreground/80">
        {line.expectedReturn}
      </td>
      <td className="px-4 py-3 font-mono text-[11.5px] text-foreground/80">
        {line.owner}
      </td>
    </tr>
  );
}

export default BudgetTable;
