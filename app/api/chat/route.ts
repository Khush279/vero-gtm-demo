import { NextResponse } from "next/server";
import { aiConfigured, openai } from "@/lib/openai";
import {
  buildKnowledgeBase,
  searchKb,
  buildRagPrompt,
  type KbDoc,
} from "@/lib/rag";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOP_K = 5;
const MODEL = "gpt-4o-mini";

type ChatBody = { query?: unknown };

function mockedAnswer(hits: KbDoc[]): string {
  if (hits.length === 0) {
    return "I couldn't find anything in the demo's data files that matches that. Try a question about the 90-day plan, the Tali competitive read, or the 4-touch sequence.";
  }
  const lead = hits[0];
  const firstSentence = lead.body.split(/(?<=[.?!])\s+/).slice(0, 2).join(" ").trim();
  const tail = hits
    .slice(1, 3)
    .map((h) => h.title)
    .filter(Boolean);
  const tailLine = tail.length ? ` Related: ${tail.join(", ")}.` : "";
  return `${firstSentence} (${lead.surface}).${tailLine} Mocked retrieval is in use; set OPENAI_API_KEY to swap to gpt-4o-mini.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as ChatBody;
    const query =
      typeof body.query === "string" ? body.query.trim().slice(0, 500) : "";
    if (!query) {
      return NextResponse.json(
        { error: "Missing query." },
        { status: 400 },
      );
    }

    const kb = await buildKnowledgeBase();
    const hits = searchKb(query, kb, TOP_K);
    const citations = hits.map((h) => ({ surface: h.surface, title: h.title }));

    if (!aiConfigured() || !openai) {
      return NextResponse.json({
        answer: mockedAnswer(hits),
        citations,
        mocked: true,
      });
    }

    const { system, user } = buildRagPrompt(query, hits);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const answer =
      completion.choices[0]?.message?.content?.trim() ?? mockedAnswer(hits);

    return NextResponse.json({ answer, citations, mocked: false });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error generating answer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
