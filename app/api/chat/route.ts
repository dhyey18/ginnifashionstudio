import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "@/lib/data";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ?? "AIzaSyBP6smfaLDh218gCYhW-raQN3mP278VReY";

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
- Gently redirect off-topic questions back to fashion`;

// Fallback order — all confirmed available on this key; lite has more capacity headroom
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

const ERROR_PHRASE = "Sorry, I'm having trouble connecting";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: { role: "user" | "assistant"; content: string }[] =
      body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Strip error fallback messages — they break Gemini's strict alternating-turn requirement
    const cleanMessages = messages.filter(
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

    const lastUserMsg = [...cleanMessages].reverse().find((m) => m.role === "user");
    const lastMessage = lastUserMsg ?? cleanMessages[cleanMessages.length - 1];

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
          const result = await chat.sendMessage(lastMessage.content);
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
    return Response.json({ error: "Failed to get response" }, { status: 500 });
  }
}
