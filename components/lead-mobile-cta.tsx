"use client";

/**
 * Mobile-only sticky bottom action bar for /lead/[id]. Two buttons:
 * "Generate sequence" (primary) and "Push to Attio" (secondary).
 *
 * Coupling is intentionally loose: the buttons just dispatch DOM
 * CustomEvents on window. SequencePane listens for `lead:generate`
 * and triggers its existing generate handler. `lead:attio-push`
 * is also dispatched so any future Attio button on the lead page
 * can hook in without prop-drilling through this component.
 *
 * Hidden at md+ — desktop already has the inline buttons in
 * SequencePane, so the floating bar would just clutter that layout.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";

type AttioState = "idle" | "pending" | "ok" | "error";

export function LeadMobileCta({ leadId }: { leadId: string }) {
  const [attio, setAttio] = useState<AttioState>("idle");

  function onGenerate() {
    window.dispatchEvent(new CustomEvent("lead:generate"));
  }

  async function onAttio() {
    // Fire the loose-coupled event for any listener that wants it.
    window.dispatchEvent(new CustomEvent("lead:attio-push", { detail: { leadId } }));
    // Also do the network call here so the mobile bar gives instant feedback
    // — there is no desktop Attio button on /lead today, so we own the UX.
    setAttio("pending");
    try {
      const res = await fetch("/api/attio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      setAttio(res.ok ? "ok" : "error");
    } catch {
      setAttio("error");
    } finally {
      // Reset back to idle after a beat so the button is reusable.
      window.setTimeout(() => setAttio("idle"), 2200);
    }
  }

  const attioLabel =
    attio === "pending"
      ? "Pushing…"
      : attio === "ok"
        ? "Pushed ✓"
        : attio === "error"
          ? "Retry"
          : "Push to Attio";

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={onGenerate}
          className={cn(
            "inline-flex h-11 flex-1 items-center justify-center rounded-md bg-forest-700 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-forest-50 transition-colors",
            "hover:bg-forest-800",
          )}
        >
          Generate sequence
        </button>
        <button
          type="button"
          onClick={onAttio}
          disabled={attio === "pending"}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-md border border-border bg-secondary px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-secondary-foreground transition-colors",
            "hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {attioLabel}
        </button>
      </div>
    </div>
  );
}

export default LeadMobileCta;
