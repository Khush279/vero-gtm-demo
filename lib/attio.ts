/**
 * Tiny Attio client. Pushes a Lead into the People object. Designed to be
 * single-purpose so the API route stays trivial and so the demo can swap to
 * HubSpot/Salesforce later by replacing this one file.
 *
 * Attio's REST API (v2) accepts records of shape:
 *   { data: { values: { <slug>: [{ value: ... }] } } }
 *
 * Required attributes on People are `name` (composite first/last). Everything
 * else (specialty, city, source) is sent as a `note` payload + custom slugs;
 * if a workspace doesn't have those custom attributes, Attio quietly ignores
 * unknown slugs, so the request still succeeds.
 */

import type { Lead } from "@/lib/types";

const ATTIO_BASE = "https://api.attio.com/v2";

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  const first = parts.slice(0, -1).join(" ");
  const last = parts[parts.length - 1];
  return { first, last };
}

function buildPersonRecord(lead: Lead) {
  const { first, last } = splitName(lead.name);
  return {
    data: {
      values: {
        name: [
          {
            first_name: first,
            last_name: last,
            full_name: lead.name,
          },
        ],
        // Custom attribute slugs — Attio ignores unknowns, so workspaces
        // without these still get a clean record with just the name.
        job_title: [{ value: lead.specialty }],
        city: [{ value: lead.city }],
        description: [
          {
            value: `${lead.specialty} · ${lead.city} · ICP ${lead.score}/100 · pushed from vero-gtm-demo`,
          },
        ],
        source: [{ value: "vero-gtm-demo" }],
      },
    },
  };
}

export async function pushPerson(lead: Lead): Promise<{ id: string }> {
  const apiKey = process.env.ATTIO_API_KEY;
  if (!apiKey) {
    throw new Error("ATTIO_API_KEY not set");
  }

  const res = await fetch(`${ATTIO_BASE}/objects/people/records`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildPersonRecord(lead)),
    // Don't keep this open forever — Attio is normally <500ms.
    cache: "no-store",
  });

  if (!res.ok) {
    // Caller decides what to expose; we surface only the status for safety.
    throw new Error(`Attio responded ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: { id?: { record_id?: string } };
  };

  const id = json?.data?.id?.record_id;
  if (!id) {
    throw new Error("Attio response missing record_id");
  }
  return { id };
}
