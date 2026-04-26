/**
 * Reply detection webhook.
 *
 * Receives Postmark inbound email webhooks. Classifies the reply intent with a
 * cheap heuristic (good enough for v1; the strategy memo proposes upgrading
 * this to a small classifier model in month 1), then advances the lead's
 * stage and pauses any in-flight sequence touches.
 */

import type { Lead, PipelineStage } from "@/lib/types";

type PostmarkInbound = {
  From: string;
  Subject: string;
  TextBody: string;
  Headers: { Name: string; Value: string }[];
};

type ReplyIntent = "positive" | "negative" | "ooo" | "unsubscribe" | "unclear";

const POSITIVE = [/sounds good/i, /happy to chat/i, /book.*demo/i, /grab.*time/i, /interested/i];
const NEGATIVE = [/not interested/i, /no thanks/i, /please stop/i, /already use/i];
const OOO = [/out of office/i, /vacation/i, /on leave/i, /maternity/i];
const UNSUB = [/unsubscribe/i, /remove me/i, /opt out/i];

function classify(body: string): ReplyIntent {
  if (UNSUB.some((r) => r.test(body))) return "unsubscribe";
  if (OOO.some((r) => r.test(body))) return "ooo";
  if (NEGATIVE.some((r) => r.test(body))) return "negative";
  if (POSITIVE.some((r) => r.test(body))) return "positive";
  return "unclear";
}

function nextStage(current: PipelineStage, intent: ReplyIntent): PipelineStage {
  if (intent === "positive") return "demo_booked";
  if (intent === "negative" || intent === "unsubscribe") return "closed_lost";
  if (intent === "ooo") return current; // hold the existing stage
  return "replied";
}

async function findLeadByEmail(_email: string): Promise<Lead | null> {
  // In production this hits the leads warehouse keyed on outbound mailbox + recipient.
  return null;
}

async function pauseInFlightTouches(_leadId: string): Promise<void> {
  // Removes any queued touches for this lead from the touch dispatcher.
}

async function persistLead(_lead: Lead): Promise<void> {
  // Upsert back into the leads store + emit a lead.stage_changed event.
}

export async function handleInbound(payload: PostmarkInbound): Promise<{ ok: boolean; intent: ReplyIntent }> {
  const intent = classify(payload.TextBody ?? "");
  const lead = await findLeadByEmail(payload.From);
  if (!lead) return { ok: false, intent };
  const next = nextStage(lead.stage, intent);
  if (next !== lead.stage) {
    lead.stage = next;
    lead.daysInStage = 0;
    lead.lastContactedAt = new Date().toISOString();
    await persistLead(lead);
  }
  if (intent !== "ooo") {
    await pauseInFlightTouches(lead.id);
  }
  return { ok: true, intent };
}

// Express-style adapter; the actual route is mounted in app/api.
export default async function postmarkHandler(req: { body: PostmarkInbound }, res: { status: (n: number) => { json: (b: unknown) => void } }) {
  const result = await handleInbound(req.body);
  res.status(result.ok ? 200 : 422).json(result);
}
