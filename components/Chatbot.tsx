"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatCircleDots, X, PaperPlaneRight } from "@phosphor-icons/react";
import { PRODUCTS } from "@/lib/data";
import type { Product } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const QUICK_PROMPTS = [
  "Help me find a saree for a wedding",
  "What's good for Diwali?",
  "Show me your bestsellers",
  "I need something under ₹2000",
];

// Map from product name -> Product for quick lookup
const PRODUCT_BY_NAME = new Map(PRODUCTS.map((p) => [p.name, p]));

// Pattern source built once; a NEW RegExp is created per call so lastIndex never bleeds between renders
const PRODUCT_PATTERN = PRODUCTS
  .slice()
  .sort((a, b) => b.name.length - a.name.length)
  .map((p) => `\\*{0,2}(${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\*{0,2}`)
  .join("|");

function renderWithProductLinks(
  text: string,
  onViewProduct: (p: Product) => void,
  onClose: () => void
) {
  const regex = new RegExp(PRODUCT_PATTERN, "g");
  const parts: React.ReactNode[] = [];
  let key = 0;
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const matchStart = match.index!;
    const productName = match.slice(1).find((g) => g !== undefined);
    if (!productName) continue;

    const product = PRODUCT_BY_NAME.get(productName);
    if (!product) continue;

    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    parts.push(
      <button
        key={key++}
        className="g-chat-product-link"
        onClick={() => { onViewProduct(product); onClose(); }}
      >
        {productName}
      </button>
    );

    lastIndex = matchStart + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function Chatbot({ onViewProduct }: { onViewProduct: (p: Product) => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm Ginni, your personal style assistant. Looking for something special? I'm here to help you find the perfect ethnic wear for any occasion!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) { const t = setTimeout(() => inputRef.current?.focus(), 100); return () => clearTimeout(t); }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      // Send only real (non-error) messages to the API
      const apiMessages = updated
        .filter((m) => !m.isError)
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment!", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  return (
    <>
      <button
        className="g-chat-fab"
        data-open={open}
        aria-label={open ? "Close style assistant" : "Open style assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <span className="g-chat-fab-icon"><X size={20} /></span>
        ) : (
          <>
            <span className="g-chat-fab-icon"><ChatCircleDots size={20} weight="fill" /></span>
            <span className="g-chat-fab-label">Style Help</span>
          </>
        )}
      </button>

      <div className="g-chat-panel" data-open={open} role="dialog" aria-modal aria-label="Ginni style assistant">
        <div className="g-chat-head">
          <div className="g-chat-head-l">
            <div className="g-chat-avatar">
              G
              <span className="g-chat-online" aria-hidden />
            </div>
            <div>
              <p className="g-chat-name">Ginni</p>
              <p className="g-chat-status">Style Assistant · Online</p>
            </div>
          </div>
          <button className="g-chat-hd-btn" onClick={() => setOpen(false)} aria-label="Close chat">
            <X size={16} />
          </button>
        </div>

        <div className="g-chat-body" aria-live="polite" aria-label="Conversation">
          {messages.map((msg, i) => (
            <div key={i} className={`g-chat-msg ${msg.role === "user" ? "is-user" : "is-bot"}`}>
              {msg.role === "assistant" && (
                <div className="g-chat-bot-avt" aria-hidden>G</div>
              )}
              <div className="g-chat-bubble">
                <div className="g-chat-text">
                  {msg.role === "assistant" && !msg.isError
                    ? renderWithProductLinks(msg.content, onViewProduct, () => setOpen(false))
                    : msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="g-chat-msg is-bot">
              <div className="g-chat-bot-avt" aria-hidden>G</div>
              <div className="g-chat-typing" aria-label="Ginni is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="g-chat-body" style={{ paddingTop: 0 }}>
            <div className="g-chat-quick-prompts">
              <p className="g-chat-quick-label">Quick questions</p>
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt} className="g-chat-quick-btn" onClick={() => sendMessage(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="g-chat-foot">
          <form className="g-chat-input-row" onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}>
            <input
              ref={inputRef}
              type="text"
              className="g-chat-input"
              placeholder="Ask about styles, occasions…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              aria-label="Message Ginni"
            />
            <button
              type="submit"
              className="g-chat-send"
              data-ready={!!(input.trim() && !loading)}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <PaperPlaneRight size={17} weight="fill" />
            </button>
          </form>
          <p className="g-chat-note">Powered by Claude AI</p>
        </div>
      </div>
    </>
  );
}
