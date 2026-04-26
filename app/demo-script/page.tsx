import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { DemoScriptCockpit } from "@/components/demo-script-cockpit";
import { DEMO_BEATS, DEMO_TOTAL_SEC } from "@/data/demo-script";

export const metadata: Metadata = {
  title: "Demo script",
  description:
    "Live in-call cockpit for the Vero interview demo. Sticky timer, current beat, what to say, what to show, and one-click jumps to every surface.",
};

/**
 * /demo-script — second-monitor operator view used during the live interview.
 * Server component renders the chrome; the cockpit handles timer state.
 */
export default function DemoScriptPage() {
  const totalLabel = formatMs(DEMO_TOTAL_SEC);
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Live call · operator screen"
        title={
          <>
            Demo <span className="font-display-italic text-primary">cockpit.</span>
          </>
        }
        subtitle={
          <>
            Open this on a second monitor during the interview. Timer auto-advances
            beats. Space to pause, arrows to step. Total runtime {totalLabel} across{" "}
            {DEMO_BEATS.length} beats.
          </>
        }
        rightSlot={
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Different from /loom · live, not recorded
          </div>
        }
      />

      <DemoScriptCockpit beats={DEMO_BEATS} totalSec={DEMO_TOTAL_SEC} />
    </div>
  );
}

function formatMs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
