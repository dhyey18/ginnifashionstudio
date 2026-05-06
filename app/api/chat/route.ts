import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "@/lib/data";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite"];

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
    return "For festive celebrations, a graceful look would be bilkul perfect. Try the Shraddha Velvet Anarkali for ₹5999, the Tara Organza Festive Suit for ₹5499, or the Bindiya Crop Top Sharara for ₹3199 — they feel polished and elegant for family gatherings.";
  }

  if (/\b(night|evening|dinner|party|reception)\b/.test(query)) {
    return "For a night event, go for something dressy. The Nandini Mirror Kaftan at ₹1899 is ekdum perfect for an evening party, or choose the Supriya Embroidered Jacket Set at ₹4599 for a stunning ethnic power look.";
  }

  if (/\b(wedding|shaadi|bride|bridal)\b/.test(query)) {
    return "For a wedding, choose a richer fabric and statement detailing. The Rukmini Heavy Bridal Lehenga for ₹18999 is the ultimate bahut sundar choice, or the Zara Banarasi Silk Saree for ₹7499 gives a classic bridal look.";
  }

  if (/\b(office|work|formal)\b/.test(query)) {
    return "For office wear, keep it elegant and easy to move in. The Mythili Silk Coord Set for ₹3599, the Vasudha Linen Kurta for ₹1199, or the Rohini Chanderi Saree for ₹3299 would look neat, comfortable, and polished.";
  }

  if (/\b(beach|holiday|vacation)\b/.test(query)) {
    return "For a beach holiday or casual outing, the Kajal Printed Kaftan at ₹1299 is breezy and perfect. You can also try the Kamini Printed Maxi Dress for ₹1699 for a boho holiday vibe.";
  }

  if (/\b(under|budget|cheap|affordable|price)\b/.test(query)) {
    return "For a budget-friendly pick, the Jhanvi Cotton Patiala Set at ₹1099 is a daily favourite. The Vasudha Linen Kurta for ₹1199 and Harini Bandhani Dupatta for ₹999 are also great affordable options.";
  }

  if (/\b(saree|sari)\b/.test(query)) {
    return "We have a beautiful saree range! The Rukmini Heavy Bridal Lehenga aside, for sarees try the Zara Banarasi Silk Saree for ₹7499, the Lakshmi Kanjivaram Saree for ₹9999, or the breezy Geetanjali Kota Doria Saree for ₹2799.";
  }

  if (/\b(lehenga)\b/.test(query)) {
    return "Our lehenga collection is stunning! The Rukmini Heavy Bridal Lehenga at ₹18999 is the showstopper, while the Neha Bandhej Lehenga for ₹6799 and Pallavi Peplum Lehenga Set for ₹5299 are gorgeous festive options.";
  }

  return "I can help you choose the right ethnic look by occasion, budget, or style. For a versatile pick, try the Deepa Linen Coord Set for ₹1799 for everyday wear, or the Tara Organza Festive Suit for ₹5499 for festive plans.";
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
