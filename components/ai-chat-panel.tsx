"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ title: string; slug: string; type: string }>;
  warnings?: string[];
}

interface AiChatPanelProps {
  contextId?: string;
  contextType?: string;
}

export function AiChatPanel({ contextId, contextType }: AiChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context_id: contextId,
          context_type: contextType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "Sorry, something went wrong." },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer_markdown,
          citations: data.citations,
          warnings: data.safety_warnings,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Unable to reach the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
        aria-label="Open AI assistant"
      >
        Ask AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[380px] flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
        <h3 className="text-sm font-semibold">AI Assistant</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[var(--muted)] hover:text-[var(--ink)]"
          aria-label="Close AI assistant"
        >
          &#10005;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[var(--muted)]">
            Ask a question about this content or any guide/project.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 text-sm leading-6 ${
              msg.role === "user"
                ? "ml-8 bg-[var(--accent)] text-white"
                : "mr-8 bg-[var(--surface)]"
            }`}
          >
            <p>{msg.content}</p>
            {msg.warnings && msg.warnings.length > 0 && (
              <div className="mt-2 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-2 py-1 text-xs text-[var(--warning-strong)]">
                {msg.warnings.map((w, wi) => (
                  <p key={wi}>{w}</p>
                ))}
              </div>
            )}
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 space-y-1">
                {msg.citations.map((cite, ci) => (
                  <a
                    key={ci}
                    href={`/${cite.type}s/${cite.slug}`}
                    className="block text-xs text-[var(--accent)] underline underline-offset-2"
                  >
                    {cite.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-8 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)]">
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--line)] px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 text-sm placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
