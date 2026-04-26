import { cn } from "@/lib/utils";
import type { FeatureCell, FeatureRow } from "@/data/vs-tali";

/**
 * One row of the /vs-tali feature matrix. Renders the feature label, the
 * Vero cell, the Tali cell, and a winner pill. Forest pill for Vero wins,
 * ochre pill for Tali wins, muted pill for ties. Pure server component,
 * no state, no effects.
 *
 * Cell values can be a string or a {value, note} object. The note renders
 * underneath in muted mono so the row reads as one block.
 */

function Cell({ cell, dim }: { cell: FeatureCell; dim?: boolean }) {
  const value = typeof cell === "string" ? cell : cell.value;
  const note = typeof cell === "string" ? null : cell.note;
  return (
    <div className="space-y-0.5">
      <div
        className={cn(
          "text-[13.5px] leading-snug text-foreground/90",
          dim && "text-foreground/60",
        )}
      >
        {value}
      </div>
      {note ? (
        <div className="font-mono text-[10.5px] leading-snug text-muted-foreground/80">
          {note}
        </div>
      ) : null}
    </div>
  );
}

function WinnerPill({
  who,
  competitorLabel,
}: {
  who: FeatureRow["whoWins"];
  competitorLabel: string;
}) {
  if (who === "vero") {
    return (
      <span className="inline-flex items-center rounded-full border border-forest-200 bg-forest-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-forest-700">
        Vero
      </span>
    );
  }
  if (who === "tali") {
    return (
      <span className="inline-flex items-center rounded-full border border-ochre-200 bg-ochre-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ochre-700">
        {competitorLabel}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      Tie
    </span>
  );
}

export function VsFeatureRow({
  row,
  zebra,
  competitorLabel = "Tali",
}: {
  row: FeatureRow;
  zebra?: boolean;
  /** Display name to show in the winner pill when whoWins === "tali". */
  competitorLabel?: string;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/40 last:border-b-0 align-top",
        zebra && "bg-muted/20",
      )}
    >
      <td className="px-4 py-3.5">
        <div className="text-[13px] font-medium text-foreground">
          {row.feature}
        </div>
        <div className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          {row.why}
        </div>
      </td>
      <td className="px-4 py-3.5 align-top">
        <Cell cell={row.vero} dim={row.whoWins === "tali"} />
      </td>
      <td className="px-4 py-3.5 align-top">
        <Cell cell={row.tali} dim={row.whoWins === "vero"} />
      </td>
      <td className="px-4 py-3.5 text-right align-top">
        <WinnerPill who={row.whoWins} competitorLabel={competitorLabel} />
      </td>
    </tr>
  );
}

export default VsFeatureRow;
