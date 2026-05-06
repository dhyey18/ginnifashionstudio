import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "@/lib/data";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ?? "");

// Compact catalog — one line per product to minimise token cost
const CATALOG = PRODUCTS.map(
  (p) =>
    `${p.name} | ${p.category} | ₹${p.price} | fabric: ${p.fabric} | occasions: ${p.occasion.join(",")} | rating: ${p.rating}`
).join("\n");

const SYSTEM_PROMPT = `You are Ginni, the warm and knowledgeable style assistant for Ginni's Fashion Studio — an Indian ethnic wear boutique.

Personality: Friendly, enthusiastic, like a trusted fashion-savvy friend. Use occasional Hindi words naturally (bilkul, bahut sundar, ekdum perfect). Keep replies to 2-4 sentences — concise and conversational.

Product catalog (name | category | price | fabric | occasions | rating):
${CATALOG}

Rules:
- Recommend products by exact name from the catalog, mention price in ₹
- Max 2-3 recommendations per message
- Stay focused on fashion, styling, and this store's products
- Treat Eid, Diwali, Navratri, Raksha Bandhan, and similar celebrations as festival occasions
- Gently redirect off-topic questions back to fashion`;

// Fallback order — all confirmed available on this key; lite has more capacity headroom
const MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-8b"];

const ERROR_PHRASE = "Sorry, I'm having trouble connecting";

type ChatMessage = { role: "user" | "assistant"; content: string };

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as { role?: unknown; content?: unknown };
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

function compactMessages(messages: ChatMessage[]) {
  return messages.reduce<ChatMessage[]>((acc, msg) => {
    const content = msg.content.trim();
    const last = acc[acc.length - 1];

    if (last?.role === msg.role && last.content.toLowerCase() === content.toLowerCase()) {
      return acc;
    }

    acc.push({ role: msg.role, content });
    return acc;
  }, []);
}

function getCatalogFallback(userText: string) {
  const query = userText.toLowerCase();

  if (/\b(eid|diwali|navratri|raksha|festival|festive)\b/.test(query)) {
    return "For Eid, a graceful festive look would be bilkul perfect. Try the Rashmika Floral Anarkali for ₹3499 or the Meena Zari Silk Saree for ₹6299; both feel polished, celebratory, and elegant for family gatherings.";
  }

  if (/\b(night|evening|dinner|party|reception)\b/.test(query)) {
    return "For a night event, go for something dressy but comfortable. The Ishita Bandhani Gown at ₹4299 is ekdum perfect for an evening party, or choose the Kavya Palazzo Set at ₹1599 if you want a lighter relaxed look.";
  }

  if (/\b(wedding|shaadi|bride|bridal)\b/.test(query)) {
    return "For a wedding, choose a richer fabric and statement detailing. The Divya Mirror Work Lehenga for ₹8999 is a standout pick, while the Meena Zari Silk Saree for ₹6299 gives a classic bahut sundar look.";
  }

  if (/\b(office|work|formal)\b/.test(query)) {
    return "For office wear, keep it elegant and easy to move in. The Sunaina Chanderi Suit for ₹2799 or Priya Block Print Kurta Set for ₹1899 would look neat, comfortable, and polished.";
  }

  if (/\b(under|budget|cheap|affordable|price)\b/.test(query)) {
    return "For a budget-friendly pick, the Ananya Embroidered Dupatta at ₹899 can elevate a simple kurta beautifully. The Kavya Palazzo Set for ₹1599 and Priya Block Print Kurta Set for ₹1899 are also great affordable outfits.";
  }

  return "I can help you choose the right ethnic look by occasion, budget, or style. For a versatile pick, try the Priya Block Print Kurta Set for ₹1899 for everyday wear or Rashmika Floral Anarkali for ₹3499 for festive plans.";
}

export async function POST(request: Request) {
  let fallbackUserText = "";

  try {
    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages) || !messages.every(isChatMessage)) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    const normalizedMessages = compactMessages(messages);
    const lastUserMsg = [...normalizedMessages].reverse().find((m) => m.role === "user");

    if (!lastUserMsg) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    fallbackUserText = lastUserMsg.content;

    if (!GEMINI_API_KEY) {
      return Response.json({ message: getCatalogFallback(lastUserMsg.content), fallback: true });
    }

    // Strip error fallback messages — they break Gemini's strict alternating-turn requirement
    const cleanMessages = normalizedMessages.filter(
      (m) => !m.content.startsWith(ERROR_PHRASE)
    );

    // Gemini requires history to start with a user turn and strictly alternate.
    // Drop leading assistant messages (e.g. the welcome greeting).
    const historySource = cleanMessages.slice(0, -1);
    const firstUserIdx = historySource.findIndex((m) => m.role === "user");
    const trimmed = firstUserIdx >= 0 ? historySource.slice(firstUserIdx) : [];

    // Enforce strict alternation — merge consecutive same-role turns
    const alternating: typeof trimmed = [];
    for (const msg of trimmed) {
      const last = alternating[alternating.length - 1];
      if (last && last.role === msg.role) {
        alternating[alternating.length - 1] = msg;
      } else {
        alternating.push(msg);
      }
    }

    // History must end with a model turn; the new user message becomes sendMessage
    const history = alternating
      .filter((_, i, arr) => !(i === arr.length - 1 && arr[i].role === "user"))
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    let lastError: unknown;

    for (const modelName of MODELS) {
      // Up to 2 attempts per model (handles brief 503 spikes)
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: { maxOutputTokens: 512 },
          });

          const chat = model.startChat({ history });
          const result = await chat.sendMessage(lastUserMsg.content);
          const text = result.response.text();

          return Response.json({ message: text });
        } catch (err) {
          lastError = err;
          const msg = err instanceof Error ? err.message : String(err);
          const isTransient =
            msg.includes("503") ||
            msg.includes("429") ||
            msg.includes("overloaded") ||
            msg.includes("high demand") ||
            msg.includes("temporarily");

          if (!isTransient) throw err;

          // Wait 1.5s before retry, then move to next model
          if (attempt === 0) {
            await sleep(1500);
          }
        }
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Chat API error:", error);
    if (fallbackUserText) {
      return Response.json({ message: getCatalogFallback(fallbackUserText), fallback: true });
    }

    return Response.json({ error: "Failed to get response" }, { status: 500 });
  }

}
