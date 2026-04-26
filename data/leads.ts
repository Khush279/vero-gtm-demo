import type { Lead } from "@/lib/types";
import raw from "./leads.json";

export const LEADS: Lead[] = raw as Lead[];

export function findLead(id: string): Lead | undefined {
  return LEADS.find((l) => l.id === id);
}
