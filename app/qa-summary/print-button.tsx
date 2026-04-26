"use client";

/**
 * Tiny client island so the rest of /qa-summary can stay a server component.
 * Triggers the browser print dialog. No custom print stylesheet for v1.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-full border border-forest-700/30 bg-forest-50 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-700 transition-colors hover:bg-forest-100"
    >
      Print this
    </button>
  );
}
