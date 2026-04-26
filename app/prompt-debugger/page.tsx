import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";

import { PageHeader } from "@/components/page-header";
import { PromptDebugger } from "@/components/prompt-debugger";
import type { Lead } from "@/lib/types";

export const metadata: Metadata = {
  title: "Prompt debugger",
  description:
    "Inspect the exact OpenAI system + user messages every sequence touch is built from. Tweak inputs, watch the prompt change before the model sees it.",
};

/**
 * /prompt-debugger. Server component. Loads a curated subset of leads from
 * data/leads.json (varying specialties, cities, EMRs) and hands them to the
 * client component, which calls buildPrompt() on every change.
 *
 * The client never mutates the prompt text; it only re-renders. The page
 * exists because Vero's stack revolves around prompt engineering and the
 * candidate wants to show that surface, not just consume it.
 */

const PICKED_IDS = [
  "lead_0002", // Toronto, Family Medicine, OSCAR (high score)
  "lead_0004", // Mississauga, Family Medicine, Accuro
  "lead_0007", // Ottawa, Family Medicine, InputHealth (long tenure)
  "lead_0008", // Toronto, Family Medicine, Telus Med Access
  "lead_0001", // Kitchener-Waterloo, Family Medicine, Epic
  "lead_0006", // Toronto, General Practice, Telus PSS
  "lead_0009", // Hamilton, Family Medicine, OSCAR (specialty segment)
  "lead_0005", // Brampton, Family Medicine, Telus PSS
];

type DebuggerLead = Pick<
  Lead,
  | "id"
  | "name"
  | "specialty"
  | "city"
  | "yearRegistered"
  | "practiceAddress"
  | "inferredEmr"
>;

async function loadLeads(): Promise<DebuggerLead[]> {
  const filePath = path.join(process.cwd(), "data", "leads.json");
  const raw = await fs.readFile(filePath, "utf8");
  const all = JSON.parse(raw) as Lead[];

  const byId = new Map(all.map((l) => [l.id, l]));
  const picked: DebuggerLead[] = [];
  for (const id of PICKED_IDS) {
    const lead = byId.get(id);
    if (lead) picked.push(toDebuggerLead(lead));
  }

  // Top up to 12 by walking the rest of the dataset and pulling distinct
  // (specialty, EMR) pairs. This guarantees the dropdown shows variety even
  // if the curated PICKED_IDS list ever drifts.
  const seen = new Set(picked.map((l) => `${l.specialty}|${l.inferredEmr}`));
  for (const lead of all) {
    if (picked.length >= 12) break;
    if (PICKED_IDS.includes(lead.id)) continue;
    const key = `${lead.specialty}|${lead.inferredEmr}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(toDebuggerLead(lead));
  }

  return picked.slice(0, 12);
}

function toDebuggerLead(l: Lead): DebuggerLead {
  return {
    id: l.id,
    name: l.name,
    specialty: l.specialty,
    city: l.city,
    yearRegistered: l.yearRegistered,
    practiceAddress: l.practiceAddress,
    inferredEmr: l.inferredEmr,
  };
}

export default async function PromptDebuggerPage() {
  const leads = await loadLeads();

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Scripts · integrations · APIs"
        title={<>The prompt under the hood.</>}
        subtitle="Every email on /lead/[id] is built from these inputs. Tweak the controls to see how the system + user messages change before the model sees them."
      />

      <PromptDebugger leads={leads} />
    </div>
  );
}
