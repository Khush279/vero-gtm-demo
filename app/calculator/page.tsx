import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { PricingCalculator } from "@/components/pricing-calculator";

export const metadata: Metadata = {
  title: "ROI calculator",
  description:
    "Drop in your practice size, hours-per-week of charting, and current scribe cost. See Vero's annual ROI vs DAX, Suki, and Tali.",
};

/**
 * /calculator — interactive ROI calculator widget. Server component shell;
 * the calculator itself is a client component in components/pricing-calculator.tsx.
 *
 * This page doubles as a sales artifact (clinic owners can self-serve the
 * math) and a content asset for "AI scribe ROI calculator" search intent.
 */
export default function CalculatorPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Sales tool · ROI math"
        title={<>What does Vero save your clinic?</>}
        subtitle="Drop in your practice size, hours-per-week of charting, and current scribe cost. We'll show you the annual delta against the four scribes you're probably comparing."
      />
      <PricingCalculator />
    </div>
  );
}
