/**
 * Demo-booked Slack alert.
 *
 * Subscribes to the lead.stage_changed event. If the new stage is demo_booked,
 * posts a one-line summary into #gtm-pipeline so Adeel and Bill see new
 * bookings in real time. Failures are logged but never block the upstream
 * stage transition.
 */

import type { Lead } from "@/lib/types";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? "";

function leadUrl(lead: Lead): string {
  const base = process.env.APP_URL ?? "https://vero-gtm-engine.vercel.app";
  return `${base}/lead/${lead.id}`;
}

function formatLine(lead: Lead): string {
  const cityShort = lead.city.replace(", ON", "");
  return `:tada: Demo booked: *${lead.name}* (${lead.specialty}, ${cityShort}). Score ${lead.score}. ${leadUrl(lead)}`;
}

export async function notifyDemoBooked(lead: Lead): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn("[slack-alert] SLACK_WEBHOOK_URL not set; skipping post.");
    return;
  }
  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: formatLine(lead) }),
    });
  } catch (err) {
    console.error("[slack-alert] post failed:", (err as Error).message);
  }
}
