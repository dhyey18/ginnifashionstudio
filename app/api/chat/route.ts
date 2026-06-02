import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRODUCTS } from "@/lib/data";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// CSS hex → closest named colour for human-readable catalog entries
const HEX_COLOR_NAMES: Record<string, string> = {
  "#C0392B": "red", "#922B21": "dark red", "#A93226": "crimson", "#E74C3C": "coral red",
  "#8E44AD": "purple", "#9B59B6": "violet", "#6C3483": "deep purple",
  "#2980B9": "blue", "#1A5276": "navy", "#1F618D": "steel blue", "#85C1E9": "light blue",
  "#1E8449": "green", "#117A65": "teal green", "#82E0AA": "mint",
  "#D4AC0D": "gold", "#F39C12": "amber", "#7D6608": "dark gold", "#F1C40F": "yellow",
  "#F0E6D3": "cream", "#FDEBD0": "peach", "#E8D5C4": "blush", "#F9E79F": "pale yellow",
  "#D5F5E3": "pale green", "#76D7C4": "aqua", "#F1948A": "salmon", "#F0B27A": "apricot",
  "#5D6D7E": "slate", "#2C3E50": "charcoal", "#ECF0F1": "white", "#BDC3C7": "silver",
};

function hexToColorName(hex: string): string {
  return HEX_COLOR_NAMES[hex] ?? hex;
}

// Rich catalog — enough detail for Gemini to answer colour, occasion, budget, and style questions accurately
const CATALOG = PRODUCTS
  .filter((p) => p.id.startsWith("gf-")) // only sellable products, no collections
  .map((p) => {
    const tags: string[] = [];
    if (p.isBestseller) tags.push("bestseller");
    if (p.isNew) tags.push("new arrival");
    if (p.isFeatured) tags.push("featured");
    const colorNames = p.colors.map(hexToColorName).join(", ");
    const tagStr = tags.length ? ` [${tags.join(", ")}]` : "";
    // One sentence description trimmed to first sentence only to keep token cost low
    const shortDesc = p.description.split(".")[0].trim();
    return `• ${p.name}${tagStr}
  Category: ${p.category} | Price: ₹${p.price}${p.originalPrice ? ` (was ₹${p.originalPrice})` : ""} | Rating: ${p.rating}/5
  Fabric: ${p.fabric} | Pattern: ${p.pattern} | Sizes: ${p.sizes.join(", ")}
  Colors: ${colorNames}
  Occasions: ${p.occasion.join(", ")}
  About: ${shortDesc}.`;
  })
  .join("\n\n");

const SYSTEM_PROMPT = `You are Ginni, the warm and knowledgeable style assistant for Ginni's Fashion Studio — an Indian ethnic wear boutique.

Personality: Friendly, enthusiastic, like a trusted fashion-savvy friend. Use occasional Hindi words naturally (bilkul, bahut sundar, ekdum perfect). Keep replies concise — 2-4 sentences max.

PRODUCT CATALOG:
${CATALOG}

RULES:
- Only recommend products that exist in the catalog above — never invent names or prices
- Always use the product's exact name as it appears in the catalog
- When recommending, always mention the price in ₹
- Filter by occasion, budget, fabric, color, or category based on what the customer asks
- For budget queries, only suggest products within the stated price range
- For color queries, match against the Colors field
- For bestsellers/popular, prefer products tagged [bestseller]
- For new arrivals, prefer products tagged [new arrival]
- Max 2-3 recommendations per reply
- Treat Eid, Diwali, Navratri, Raksha Bandhan, Holi, Karwa Chauth as festival occasions
- Stay focused on fashion and this store's products; gently redirect off-topic questions`;

const MODELS = ["gemini-2.5-flash"];

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
  const q = userText.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("hello", "hi ", "hey", "namaste", " hi\n")) {
    return "Namaste! 🌸 I'm Ginni, your style assistant at Ginni's Fashion Studio. I'd love to help you find the perfect ethnic look! Tell me about the occasion, your budget, or the style you have in mind.";
  }

  if (has("bestseller", "popular", "top pick", "best sell", "most loved", "crowd favourite", "crowd favorite")) {
    return "Our bestsellers are absolute stunners! The Zara Banarasi Silk Saree (₹7499), Rukmini Heavy Bridal Lehenga (₹18999), Shraddha Velvet Anarkali (₹5999), and Sonal Chikankari Kurti (₹1499) are loved by customers. Ekdum perfect choices!";
  }

  if (has("new arrival", "new arrivals", "latest", "new in", "fresh", "just arrived", "trending")) {
    return "Our latest arrivals are ekdum gorgeous! Check out the Bindiya Crop Top Sharara (₹3199), Shraddha Velvet Anarkali (₹5999), Nandini Mirror Kaftan (₹1899), and the stunning Rukmini Heavy Bridal Lehenga (₹18999).";
  }

  if (has("wedding", "shaadi", "bridal", "bride", "nikah", "haldi")) {
    return "For a wedding, choose a richer fabric and statement detailing. The Rukmini Heavy Bridal Lehenga (₹18999) is the ultimate bahut sundar choice, or the Zara Banarasi Silk Saree (₹7499) gives a classic bridal look.";
  }

  if (has("diwali", "navratri", "eid", "raksha", "festival", "festive", "celebration", "puja", "garba")) {
    return "For festive celebrations, a graceful look would be bilkul perfect! Try the Shraddha Velvet Anarkali (₹5999), the Tara Organza Festive Suit (₹5499), or the Bindiya Crop Top Sharara (₹3199) — they feel polished and elegant for family gatherings.";
  }

  if (has("sangeet", "mehndi", "night", "evening", "dinner", "party", "reception", "cocktail")) {
    return "For a night event, go for something dressy! The Nandini Mirror Kaftan (₹1899) is ekdum perfect for an evening party, or choose the Supriya Embroidered Jacket Set (₹4599) for a stunning ethnic power look.";
  }

  if (has("office", "work", "formal", "meeting", "corporate", "professional")) {
    return "For office wear, keep it elegant and easy to move in. The Mythili Silk Coord Set (₹3599), the Vasudha Linen Kurta (₹1199), or the Rohini Chanderi Saree (₹3299) would look neat, comfortable, and polished.";
  }

  if (has("beach", "holiday", "vacation", "travel", "resort", "casual", "everyday", "daily")) {
    return "For a relaxed casual look, the Kajal Printed Kaftan (₹1299) is breezy and perfect. The Kamini Printed Maxi Dress (₹1699) and Kavya Palazzo Set (₹1599) are also great easy-going options — ekdum comfortable!";
  }

  if (has("under ", "budget", "cheap", "affordable", "inexpensive", "₹1", "₹2", "less than")) {
    return "For budget-friendly picks, the Harini Bandhani Dupatta (₹999) and Jhanvi Cotton Patiala Set (₹1099) are wonderful value. The Vasudha Linen Kurta (₹1199) is also a crowd-favourite at a great price!";
  }

  if (has("lehenga", "lehnga", "ghaghra", "skirt")) {
    return "Our lehenga collection is stunning! The Rukmini Heavy Bridal Lehenga (₹18999) is the showstopper, while the Neha Bandhej Lehenga (₹6799), Divya Mirror Work Lehenga (₹8999), and Pallavi Peplum Lehenga Set (₹5299) are gorgeous festive options.";
  }

  if (has("saree", "sari", "drape")) {
    return "Our saree collection is bahut sundar! Try the Zara Banarasi Silk Saree (₹7499), the heritage Lakshmi Kanjivaram Saree (₹9999), or the lightweight Geetanjali Kota Doria Saree (₹2799) for everyday elegance.";
  }

  if (has("anarkali")) {
    return "Anarkalis are so graceful! The Shraddha Velvet Anarkali (₹5999) is perfect for weddings, the Rashmika Floral Anarkali (₹3499) for festivals, and the Swara Cotton Anarkali (₹1699) for casual days.";
  }

  if (has("kurti", "kurta", "top")) {
    return "For a smart ethnic top, try the Sonal Chikankari Kurti (₹1499) for a classic look, the Vasudha Linen Kurta (₹1199) for breathable comfort, or the Tanvi Tussar Silk Kurti (₹2199) for a formal touch.";
  }

  if (has("dupatta", "stole", "scarf")) {
    return "A beautiful dupatta can transform any outfit! The Ananya Embroidered Dupatta (₹899) is a great pick, the Rekha Silk Dupatta (₹1599) is perfect for weddings, and the Heena Phulkari Dupatta (₹1199) adds a festive pop of colour.";
  }

  if (has("suit", "salwar", "churidar")) {
    return "Our suits are bilkul elegant! Try the Tara Organza Festive Suit (₹5499) for celebrations, the Sunaina Chanderi Suit (₹2899) for a refined look, or the Aisha Phulkari Salwar Suit (₹3299) for a vibrant Punjabi touch.";
  }

  if (has("coord", "set", "palazzo", "sharara")) {
    return "Coord sets are so stylish and easy to wear! The Mythili Silk Coord Set (₹3599), Kavya Palazzo Set (₹1599), Deepa Linen Coord Set (₹1799), and Bindiya Crop Top Sharara (₹3199) are our top picks.";
  }

  if (has("silk", "cotton", "georgette", "linen", "velvet", "chiffon", "fabric", "material")) {
    return "We have a wonderful range of fabrics! Silk options include the Zara Banarasi Silk Saree (₹7499) and Mythili Silk Coord Set (₹3599). For breathable cotton, try the Vasudha Linen Kurta (₹1199) or Jhanvi Cotton Patiala Set (₹1099).";
  }

  if (has("gift", "gifting", "present", "surprise")) {
    return "For gifting, a beautiful dupatta is always a safe and thoughtful choice! The Rekha Silk Dupatta (₹1599) or Heena Phulkari Dupatta (₹1199) are lovely. For a grander gift, the Zara Banarasi Silk Saree (₹7499) is bahut sundar!";
  }

  if (has("colour", "color", "red", "blue", "green", "yellow", "pink", "purple", "orange", "white", "black", "gold")) {
    return "We have rich jewel tones across our collection! Deep reds and golds in the Zara Banarasi Silk Saree (₹7499), vibrant pinks and purples in the Bindiya Crop Top Sharara (₹3199), and earthy neutrals in the Deepa Linen Coord Set (₹1799).";
  }

  return "I'm here to help you find your perfect ethnic look! Tell me about the occasion (wedding, festival, office, casual?), your budget, or the style you love — and I'll suggest something bahut sundar just for you. ✨";
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
            generationConfig: { maxOutputTokens: 1024 },
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
