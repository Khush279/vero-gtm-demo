/**
 * /objections - standalone objection-handler surface. Same component as the
 * one mounted at the bottom of /lead/[id], but full-width and unfiltered so
 * a sales hire can drill straight into the talk track.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ObjectionHandler } from "@/components/objection-handler";

export const metadata: Metadata = {
  title: "Objection handling",
  description:
    "Eight scripted responses to the objections every Canadian family physician raises in the first call. Calibrated to Vero's actual positioning, not a generic SaaS playbook.",
};

export default function ObjectionsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Sales · objection handling"
        title={<>The 8 objections.</>}
        subtitle="Every Canadian family physician asks at least 3 of these in the first call. Answers are calibrated to Vero's actual positioning, not a generic SaaS playbook."
      />
      <ObjectionHandler />
    </div>
  );
}
