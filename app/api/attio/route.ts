/**
 * POST /api/attio — pushes a Lead into Attio's People object.
 *
 * Body: { leadId: string }
 *
 * Demo always succeeds: if ATTIO_API_KEY is unset (the common case for the
 * interview viewer), we return a mocked record id so the UI stays green.
 * If the key is set, we hit Attio for real and surface the real record id.
 *
 * Errors are sanitized — the interviewer should never see a stack trace.
 */

import { NextResponse } from "next/server";
import { findLead } from "@/data/leads";
import { pushPerson } from "@/lib/attio";

export const runtime = "nodejs";

type Body = { leadId?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const leadId = typeof body.leadId === "string" ? body.leadId : "";
  if (!leadId) {
    return NextResponse.json({ ok: false, error: "Missing leadId" }, { status: 400 });
  }

  const lead = findLead(leadId);
  if (!lead) {
    return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  }

  // No key set → mocked path so the demo always works.
  if (!process.env.ATTIO_API_KEY) {
    return NextResponse.json({
      ok: true,
      mocked: true,
      attioId: `prs_${lead.id}`,
    });
  }

  try {
    const { id } = await pushPerson(lead);
    return NextResponse.json({ ok: true, mocked: false, attioId: id });
  } catch {
    // Don't expose raw upstream errors — the interviewer doesn't need a stack.
    return NextResponse.json(
      { ok: false, error: "Failed to push to Attio" },
      { status: 502 },
    );
  }
}
