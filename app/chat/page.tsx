import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ChatPanel } from "@/components/chat-panel";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "RAG-style agent that answers founder questions by retrieving from the demo's own data files. Mocked retrieval works without an OpenAI key; live answers swap in when one is set.",
};

export default function ChatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Ask the demo"
        title={<>Talk to the GTM engine.</>}
        subtitle="A small RAG agent that retrieves from the demo's own data files (strategy memo, experiments, playbooks, sources, interview prep). Mocked retrieval works without an OpenAI key. Set one to swap in gpt-4o-mini."
      />
      <ChatPanel />
    </div>
  );
}
