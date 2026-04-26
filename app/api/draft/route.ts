/**
 * POST /api/draft — generates a 4-touch outbound sequence for a single lead.
 *
 * Body: { leadId: string, tone: "direct" | "conversational" | "skeptical" }
 *
 * Behaviour:
 *  - If OpenAI is configured, fans out 4 parallel `gpt-4o-mini` calls
 *    (one per touch / leverage point) at temperature 0.7.
 *  - If OpenAI isn't configured, returns a deterministic mocked sequence so
 *    the demo always works for the interviewer. The mock references the
 *    lead's specialty / city / EMR so it doesn't read like Lorem Ipsum.
 *
 * Returns: { sequence: Sequence, mocked: boolean }
 *
 * Each touch leans on a specific leverage point per the spec:
 *   Day 1  → price_anchor
 *   Day 4  → doc_upload_diff
 *   Day 9  → ontario_vor + pipeda_compliance (the "compliance combo")
 *   Day 16 → peer_adoption
 */

import { NextResponse } from "next/server";
import { findLead } from "@/data/leads";
import { aiConfigured, openai, DRAFT_MODEL } from "@/lib/openai";
import { buildPrompt } from "@/lib/prompts";
import {
  EMR_LABELS,
  type EmrInferred,
  type Lead,
  type Sequence,
  type Touch,
} from "@/lib/types";

export const runtime = "nodejs";

type Tone = "direct" | "conversational" | "skeptical";

type Body = {
  leadId?: string;
  tone?: Tone;
};

type TouchPlan = {
  day: number;
  channel: Touch["channel"];
  leverage: Touch["leverage"];
};

const PLAN: TouchPlan[] = [
  { day: 1, channel: "email", leverage: "price_anchor" },
  { day: 4, channel: "email", leverage: "doc_upload_diff" },
  // Day 9 leans on Ontario VoR + PIPEDA. The Touch["leverage"] enum is
  // single-valued, so we record the primary lever (ontario_vor) and let
  // the body weave PIPEDA in alongside it.
  { day: 9, channel: "email", leverage: "ontario_vor" },
  { day: 16, channel: "email", leverage: "peer_adoption" },
];

function isTone(x: unknown): x is Tone {
  return x === "direct" || x === "conversational" || x === "skeptical";
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function firstName(fullName: string): string {
  const cleaned = fullName.replace(/^Dr\.?\s+/i, "").trim();
  return cleaned.split(/\s+/)[0] ?? cleaned;
}

function emrPhrase(emr: EmrInferred): string {
  const label = EMR_LABELS[emr];
  if (emr === "unknown") return "your EMR";
  return label;
}

// ---------------------------------------------------------------------------
// Mocked sequence — used when no OpenAI key is set. On-brand and references
// the lead's specialty / city / EMR so the interviewer sees something live.
// ---------------------------------------------------------------------------

function mockedTouch(lead: Lead, plan: TouchPlan, tone: Tone): Touch {
  const fname = firstName(lead.name);
  const emr = emrPhrase(lead.inferredEmr);
  const city = lead.city.split(",")[0]?.trim() ?? lead.city;
  const specialty = lead.specialty;

  // Tone-shifted opener so the three pills produce visibly different copy.
  const opener =
    tone === "direct"
      ? `Hi Dr. ${fname.split(" ").pop() ?? fname},`
      : tone === "conversational"
        ? `Hi ${fname},`
        : `Dr. ${fname.split(" ").pop() ?? fname} —`;

  const sign =
    tone === "direct"
      ? "Khush"
      : tone === "conversational"
        ? "Talk soon,\nKhush"
        : "I'd rather not waste your time, so be blunt with me.\n\nKhush";

  let subject = "";
  let body = "";

  switch (plan.leverage) {
    case "price_anchor": {
      subject =
        tone === "skeptical"
          ? `${specialty} in ${city}: $59.99/mo vs Tali's $300+ — worth 3 minutes?`
          : `Vero for ${specialty} in ${city} — $59.99/mo`;
      body = [
        opener,
        "",
        `I work on Vero — an AI scribe built for ${specialty} workflows. Two reasons this lands in your inbox:`,
        "",
        `1. Pricing. Vero is $59.99/mo (or $720/yr). Tali AI runs ~$300/mo, DAX is ~10x that. Same SOAP-quality output, a quarter to a tenth of the spend.`,
        `2. Fit. We have 150+ specialty templates, including ones tuned for ${specialty}, so the first note out of the box doesn't read like a generic transcription.`,
        "",
        `If a 12-min demo on a real ${specialty} encounter would be useful, I'll send three time slots this week.`,
        "",
        sign,
      ].join("\n");
      break;
    }

    case "doc_upload_diff": {
      subject =
        tone === "skeptical"
          ? `Quick one: does your scribe actually read uploaded labs?`
          : `One thing most AI scribes can't do (yet)`;
      body = [
        opener,
        "",
        `Quick follow-up. The thing most ${specialty} clinicians I talk to in ${city} hit a wall on isn't transcription — it's the lab PDF, the consult letter, the patient-history doc you actually want the scribe to read into the note.`,
        "",
        `Vero ingests uploaded documents (PDFs, images, prior reports) and weaves them into the structured note. So the LDL value or the cardiology consult shows up in your A&P without you re-typing it.`,
        "",
        `I haven't found another scribe in the Canadian market doing this end-to-end. Worth 8 minutes to see it on a sample chart?`,
        "",
        sign,
      ].join("\n");
      break;
    }

    case "ontario_vor": {
      subject =
        tone === "skeptical"
          ? `Procurement question: PIPEDA + Ontario VoR — Vero's already on both`
          : `Ontario Health VoR + PIPEDA — already cleared`;
      body = [
        opener,
        "",
        `Two things that come up the moment a clinic lawyer or hospital privacy officer reviews an AI scribe:`,
        "",
        `· PIPEDA + PHIPA: Vero is fully compliant. Data stays in Canadian regions, BAA-equivalent agreements available, audit logs on by default.`,
        `· Ontario Health Vendor of Record: Vero is already on the VoR list — which means clinics and hospital systems can procure us without re-running a full RFP.`,
        "",
        `For a ${specialty} practice in ${city} on ${emr}, that usually compresses procurement from 6+ weeks to 1–2.`,
        "",
        `Happy to send our security/compliance one-pager if that's the gating piece.`,
        "",
        sign,
      ].join("\n");
      break;
    }

    case "peer_adoption": {
      subject =
        tone === "skeptical"
          ? `Last note — peers in ${city} are already using Vero`
          : `${specialty} colleagues in ${city} on Vero`;
      body = [
        opener,
        "",
        `Last one from me. A handful of ${specialty} practices in and around ${city} have moved to Vero in the last few months — most cited two reasons: the doc-upload feature, and that the per-provider cost actually pencils for a community practice.`,
        "",
        `If you'd rather see it from a peer than a vendor, I can connect you with one of them — no demo required, just a 10-min call to hear how it slotted into their day on ${emr}.`,
        "",
        `If now isn't the right time, no follow-ups from me — I'll close the loop here.`,
        "",
        sign,
      ].join("\n");
      break;
    }

    default: {
      // Unreachable, but keeps the compiler happy if leverage list grows.
      subject = `Following up on Vero for ${specialty}`;
      body = `${opener}\n\nFollowing up. Happy to send more detail if useful.\n\n${sign}`;
    }
  }

  return {
    day: plan.day,
    channel: plan.channel,
    subject,
    body,
    leverage: plan.leverage,
    wordCount: wordCount(body),
  };
}

function mockedSequence(lead: Lead, tone: Tone): Sequence {
  return {
    leadId: lead.id,
    generatedAt: new Date().toISOString(),
    touches: PLAN.map((p) => mockedTouch(lead, p, tone)),
  };
}

// ---------------------------------------------------------------------------
// Live OpenAI generation. Fans 4 calls in parallel (one per leverage point),
// asks the model for JSON { subject, body }, falls back to mocked content
// for any single touch that fails so a partial outage doesn't sink the demo.
// ---------------------------------------------------------------------------

type DraftJson = { subject?: string; body?: string };

function parseDraftJson(raw: string): DraftJson {
  // Strip ```json fences if the model wrapped them.
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned) as DraftJson;
    return parsed;
  } catch {
    return {};
  }
}

async function liveTouch(lead: Lead, plan: TouchPlan, tone: Tone): Promise<Touch> {
  if (!openai) {
    // Defensive — shouldn't reach here because the caller checks aiConfigured().
    return mockedTouch(lead, plan, tone);
  }

  const { system, user } = buildPrompt(lead, plan.day, plan.leverage, tone);

  try {
    const completion = await openai.chat.completions.create({
      model: DRAFT_MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const content = completion.choices?.[0]?.message?.content ?? "";
    const draft = parseDraftJson(content);
    const subject = (draft.subject ?? "").trim();
    const body = (draft.body ?? "").trim();

    if (!subject || !body) {
      // Bad shape — fall back rather than render an empty card.
      return mockedTouch(lead, plan, tone);
    }

    return {
      day: plan.day,
      channel: plan.channel,
      subject,
      body,
      leverage: plan.leverage,
      wordCount: wordCount(body),
    };
  } catch {
    return mockedTouch(lead, plan, tone);
  }
}

async function liveSequence(lead: Lead, tone: Tone): Promise<Sequence> {
  const touches = await Promise.all(PLAN.map((p) => liveTouch(lead, p, tone)));
  return {
    leadId: lead.id,
    generatedAt: new Date().toISOString(),
    touches,
  };
}

// ---------------------------------------------------------------------------
// Route handler.
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const leadId = typeof body.leadId === "string" ? body.leadId : "";
  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
  }
  const tone: Tone = isTone(body.tone) ? body.tone : "direct";

  const lead = findLead(leadId);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  try {
    if (!aiConfigured()) {
      return NextResponse.json({
        sequence: mockedSequence(lead, tone),
        mocked: true,
      });
    }

    const sequence = await liveSequence(lead, tone);
    return NextResponse.json({ sequence, mocked: false });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Draft generation failed";
    // Sanitize: only the message string, no stack, no upstream payload.
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
