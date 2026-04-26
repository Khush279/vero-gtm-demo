"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Citation = { surface: string; title: string };
type ChatTurn = {
  id: string;
  role: "user" | "agent";
  text: string;
  citations?: Citation[];
  mocked?: boolean;
};

const STORAGE_KEY = "vero-gtm-chat-history";

const EXAMPLES = [
  "What's your 90-day target?",
  "Why family medicine first?",
  "How do you compete with Tali?",
  "What would you ship in week 1?",
];

export function ChatPanel() {
  const [history, setHistory] = React.useState<ChatTurn[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [mockedNotice, setMockedNotice] = React.useState<boolean | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Load on mount
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as ChatTurn[]);
    } catch {
      /* corrupt store, start fresh */
    }
  }, []);

  // Persist on every change
  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* quota — ignore */
    }
  }, [history]);

  // Auto-scroll
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userTurn: ChatTurn = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setHistory((h) => [...h, userTurn]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = (await res.json()) as {
        answer?: string;
        citations?: Citation[];
        mocked?: boolean;
        error?: string;
      };
      if (data.mocked != null) setMockedNotice(data.mocked);
      const agentTurn: ChatTurn = {
        id: `a-${Date.now()}`,
        role: "agent",
        text: data.answer ?? data.error ?? "No answer returned.",
        citations: data.citations ?? [],
        mocked: data.mocked,
      };
      setHistory((h) => [...h, agentTurn]);
    } catch (err) {
      setHistory((h) => [
        ...h,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          text: err instanceof Error ? err.message : "Network error.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {mockedNotice ? (
        <div className="rounded-md border border-ochre-200 bg-ochre-50 px-4 py-2.5 text-[12.5px] text-ochre-700">
          Running on mocked retrieval. Set OPENAI_API_KEY to enable live gpt-4o-mini answers.
        </div>
      ) : null}

      {history.length === 0 ? (
        <div className="space-y-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Try one of these
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => void send(ex)}
                className="rounded-md border border-border/60 bg-card px-4 py-3 text-left text-[13.5px] transition-colors hover:border-primary/30"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="max-h-[60vh] space-y-4 overflow-y-auto rounded-lg border border-border/60 bg-card p-4"
        >
          {history.map((t) => (
            <div
              key={t.id}
              className={cn("flex", t.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] space-y-2 rounded-lg px-4 py-3 text-[13.5px] leading-relaxed",
                  t.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-foreground",
                )}
              >
                <div>{t.text}</div>
                {t.citations && t.citations.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.citations.map((c) => (
                      <Link
                        key={`${t.id}-${c.surface}`}
                        href={c.surface}
                        className="inline-flex items-center rounded-full border border-forest-200 bg-forest-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-forest-700 hover:bg-forest-100"
                      >
                        {c.surface}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-lg bg-muted/40 px-4 py-3 text-[12.5px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching the demo&apos;s data…
              </div>
            </div>
          ) : null}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the strategy, the funnel math, or any surface…"
          className="flex-1 rounded-md border border-border/70 bg-card px-3 py-2.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUp className="h-3.5 w-3.5" />}
          Send
        </button>
        {history.length > 0 ? (
          <button
            type="button"
            onClick={() => setHistory([])}
            className="rounded-md border border-border/60 bg-card px-3 py-2 text-[12px] text-muted-foreground hover:border-primary/30 hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </form>
    </div>
  );
}

export default ChatPanel;
