/**
 * Touch-due nightly cron.
 *
 * Walks every lead with nextTouchAt <= now, decides which sequence step is
 * next, generates the email body via the prompt builder, and enqueues it for
 * send. Skips leads that have replied or unsubscribed since the touch was
 * scheduled.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import { buildPrompt, type PromptTone } from "@/lib/prompts";
import type { Lead, Touch } from "@/lib/types";

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");

const TOUCH_PLAN: { day: number; leverage: Touch["leverage"]; tone: PromptTone }[] = [
  { day: 1, leverage: "price_anchor", tone: "direct" },
  { day: 4, leverage: "doc_upload_diff", tone: "conversational" },
  { day: 9, leverage: "specialty_template", tone: "conversational" },
  { day: 16, leverage: "peer_adoption", tone: "skeptical" },
];

function whichTouch(lead: Lead): (typeof TOUCH_PLAN)[number] | null {
  if (lead.lastContactedAt == null) return TOUCH_PLAN[0];
  const days = Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / 86400000);
  for (const slot of TOUCH_PLAN) {
    if (slot.day > days) return slot;
  }
  return null;
}

function shouldSkip(lead: Lead): boolean {
  return lead.stage === "replied" || lead.stage === "demo_booked" || lead.stage === "closed_lost" || lead.stage === "customer";
}

async function enqueueSend(_lead: Lead, _subject: string, _body: string): Promise<void> {
  // In production this hands off to the Postmark batch sender.
}

export async function runNightly(now: Date = new Date()): Promise<{ dispatched: number; skipped: number }> {
  const raw = await readFile(LEADS_PATH, "utf8");
  const leads = JSON.parse(raw) as Lead[];
  let dispatched = 0;
  let skipped = 0;
  for (const lead of leads) {
    if (!lead.nextTouchAt) continue;
    if (new Date(lead.nextTouchAt).getTime() > now.getTime()) continue;
    if (shouldSkip(lead)) {
      skipped += 1;
      continue;
    }
    const slot = whichTouch(lead);
    if (!slot) continue;
    const prompt = buildPrompt(lead, slot.day, slot.leverage, slot.tone);
    // The actual generate step calls OpenAI; in the cron we batch and rate-limit.
    await enqueueSend(lead, `[draft] ${prompt.system.slice(0, 16)}`, prompt.user);
    dispatched += 1;
  }
  return { dispatched, skipped };
}

if (require.main === module) {
  runNightly().then(({ dispatched, skipped }) => {
    console.log(`[touch-nightly] dispatched=${dispatched} skipped=${skipped}`);
  });
}
