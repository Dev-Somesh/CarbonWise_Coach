import express from "express";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  parseCoachInsights,
  parseCoachChat,
  extractLatestUserMessage,
  validateCoachInsightResponse,
  validateCoachChatResponse,
  sanitizePromptText,
  truncateChatMessages,
  type CoachInsightsInput,
} from "./src/utils/apiValidation";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.NODE_ENV === "production" ? "127.0.0.1" : "0.0.0.0";

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production"
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
              fontSrc: ["'self'", "https://fonts.gstatic.com"],
              imgSrc: ["'self'", "data:"],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
            },
          }
        : false,
    hsts: process.env.NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true } : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
app.use(express.json({ limit: "32kb" }));

app.use("/api", (req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method) && !req.is("application/json")) {
    res.status(415).json({ error: "Content-Type must be application/json" });
    return;
  }
  next();
});

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many AI requests. Please try again later." },
});

// Initialize Google GenAI client lazily or safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully loaded Gemini AI Service client.");
  } catch (error) {
    console.error("Failed to initialize Google GenAI SDK:", error);
  }
} else {
  console.log("No GEMINI_API_KEY found or it has placeholder values. Operating in local rules fallback.");
}

/**
 * API Route: /api/coach-insights
 * Uses Gemini or falling back to deterministic advice to generate sustainable coaching feedback.
 */
app.post("/api/coach-insights", aiRateLimiter, async (req, res) => {
  try {
    const parsedBody = parseCoachInsights(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: "Invalid request payload." });
    }

    const { name, transport, diet, energy, shopping, totalEmissions, profileRaw } =
      parsedBody.data as CoachInsightsInput;

    // --- Elegant dynamic rules-based fallback engine ---
    const user_name = sanitizePromptText(name, 100) || "Eco Friend";
    const total_emissions_num = Number(totalEmissions) || 5000;
    
    // Choose dynamic headline
    let headline = `Welcome on your sustainability journey, ${user_name}!`;
    if (total_emissions_num < 3500) {
      headline = `Spectacular path, ${user_name}! You are a leading CarbonWise exemplar.`;
    } else if (total_emissions_num < 7000) {
      headline = `Great foundation, ${user_name}! Let's optimize your remaining habits.`;
    } else {
      headline = `Empowered action, ${user_name}! Small adjustments will yield massive offsets.`;
    }

    // Determine primary carbon driver category
    const categories = [
      { name: "transportation", value: Number(transport) || 0 },
      { name: "nutrition", value: Number(diet) || 0 },
      { name: "housing energy", value: Number(energy) || 0 },
      { name: "shopping & products", value: Number(shopping) || 0 }
    ];
    categories.sort((a, b) => b.value - a.value);
    const topCategoryKey = categories[0].name;

    // Build custom analysis
    let analysis = "";
    if (topCategoryKey === "transportation") {
      const travelMethod = profileRaw?.transport?.method || "fossil-fuel based";
      analysis = `Your most significant carbon contributor is transportation, totaling ${transport} kg CO2e/yr. Relying on a ${travelMethod} vehicle for weekly travel over ${profileRaw?.transport?.distance || 100} km represents a major offset opportunity. Implementing shared transit, hybrid options, or reducing flight frequencies is our key target here.`;
    } else if (topCategoryKey === "nutrition") {
      const dietType = profileRaw?.diet?.type || "meat-inclusive";
      analysis = `Your dietary patterns represent your largest emissions sector, contributing ${diet} kg CO2e/yr. Opting for a ${dietType} diet with ${profileRaw?.diet?.foodWaste || 'standard'} food waste triggers high agricultural and cold-chain transport outputs. Adjusting meat consumption frequencies can save greenhouse gases immediately.`;
    } else if (topCategoryKey === "housing energy") {
      const size = profileRaw?.energy?.homeSize || "domestic space";
      const cleanType = profileRaw?.energy?.cleanEnergy || "standard electric grid";
      analysis = `Household utility usage represents your main carbon driver, requiring ${energy} kg CO2e/yr. Powersourcing a ${size} via a ${cleanType} creates steady demand on the regional grid, especially with appliances in active use. Selecting heat pumps and clean tariffs will erase this burden.`;
    } else {
      analysis = `Manufacturing, trade, and fast-consuming trends are your chief emissions drivers at ${shopping} kg CO2e/yr. Continuous clothes purchases or rapid tech cycles require significant international logistics and high carbon-load industrial processes. Recycling and buying for durability are high-impact remedies.`;
    }

    // Generate tailored recommendations
    const recommendationsPool: string[] = [];

    // Transport specific
    if (profileRaw?.transport?.method === "petrol") {
      recommendationsPool.push("Switch high-fuel fossil vehicle commutes to active cycling, rail, or electric carpooling to save ~850 kg CO2e.");
    }
    if (Number(profileRaw?.transport?.shortFlights) > 0) {
      recommendationsPool.push(`Replace short domestic flight legs (${profileRaw?.transport?.shortFlights ?? 0} per year) with train journeys or virtual video conferencing to save ~300 kg CO2e.`);
    }

    // Diet specific
    if (profileRaw?.diet?.type === "heavy-meat" || profileRaw?.diet?.type === "medium-meat") {
      recommendationsPool.push("Substitute three meals a week featuring beef or lamb with organic legumes or seasonal plant ingredients to save ~550 kg CO2e.");
    }
    if (profileRaw?.diet?.foodWaste === "high") {
      recommendationsPool.push("Implement strict meal prepping and frozen storage to prevent leftover food spoilage, targeting zero food waste to save ~200 kg CO2e.");
    }

    // Energy specific
    if (profileRaw?.energy?.cleanEnergy === "standard") {
      recommendationsPool.push("Switch your utility billing plan to a 100% certified local solar or wind renewable energy tariff to save up to 1,100 kg CO2e.");
    }
    if (profileRaw?.energy?.highEnergyAppliances?.includes("electric-heating") || profileRaw?.energy?.highEnergyAppliances?.includes("air-conditioning")) {
      recommendationsPool.push("Install reflective insulation materials behind radiators and schedule AC thermostats (+/- 2°C) to save ~350 kg CO2e.");
    }

    // Shopping specific
    if (profileRaw?.shopping?.clothing === "frequent" || profileRaw?.shopping?.clothing === "moderate") {
      recommendationsPool.push("Prioritize high-durability apparel, vintage swaps, and repair libraries over buy-and-discard clothes purchases to save ~280 kg CO2e.");
    }

    // General fallback items to make sure we always have 3 elements
    recommendationsPool.push("Wash laundry loads at a cold 30°C setting and hang-dry outdoors to decrease appliance footprint by ~120 kg CO2e.");
    recommendationsPool.push("Equip tap faucets with aerators to limit heated water consumption during daily routines to save ~80 kg CO2e.");
    recommendationsPool.push("Engage local neighborhood associations for compost drop-offs or cooperative rooftop solar options.");

    // Take top 3 recommendations
    const selectedRecommendations = recommendationsPool.slice(0, 3);

    const fallbackResponse = {
      headline: headline,
      analysis: analysis,
      recommendations: selectedRecommendations,
      isAiGenerated: false
    };

    if (!ai) {
      return res.json({
        ...fallbackResponse,
        isFallbackActive: true,
        fallbackReason: "Google GenAI Client is not initialized."
      });
    }

    const prompt = `
      You are a world-class supportive climate scientist and sustainability developer assisting a user named "${user_name}".
      They have provided questionnaire responses for their carbon footprint of ${totalEmissions || 5000} kg CO2e/year.
      Here are their detailed statistics (in kg CO2e/year):
      - Transport sector: ${transport || 1200}
      - Diet sector: ${diet || 1500}
      - Energy sector: ${energy || 1800}
      - Shopping sector: ${shopping || 500}
      
      User habits detail:
      - Transport Commuting: ${sanitizePromptText(profileRaw?.transport?.method, 30) || 'unknown'} car/transit, ${profileRaw?.transport?.distance || 0} km/week. Short Flights: ${profileRaw?.transport?.shortFlights || 0}/yr, Long Flights: ${profileRaw?.transport?.longFlights || 0}/yr.
      - Diet choice: ${sanitizePromptText(profileRaw?.diet?.type, 30) || 'unknown'}, Sourcing: ${sanitizePromptText(profileRaw?.diet?.sourcing, 30) || 'unknown'}, Food Waste tendency: ${sanitizePromptText(profileRaw?.diet?.foodWaste, 30) || 'unknown'}.
      - Energy environment: ${sanitizePromptText(profileRaw?.energy?.homeSize, 30) || 'unknown'}, High energy devices: ${profileRaw?.energy?.highEnergyAppliances?.join(', ') || 'none'}, Clean energy source: ${sanitizePromptText(profileRaw?.energy?.cleanEnergy, 30) || 'unknown'}.
      - Shopping and waste criteria: Clothes shopping: ${sanitizePromptText(profileRaw?.shopping?.clothing, 30) || 'unknown'}, Tech purchase cycle: ${sanitizePromptText(profileRaw?.shopping?.electronics, 30) || 'unknown'}, Recycling rigor: ${sanitizePromptText(profileRaw?.shopping?.recycling, 30) || 'unknown'}.

      Provide a JSON object response tailored specifically to their stats with the following fields:
      - headline: A single, cheerful, and encouraging sentence (max 15 words) noting their eco level.
      - analysis: A structured analysis (2-3 sentences) detailing the exact areas where they produce the highest emissions and explaining the real-world climate trade-offs of their local lifestyle in plain human terms.
      - recommendations: A list of exactly 3 highly specific, highly actionable recommendations they can do (incorporating details from their real answers, e.g., using their specific commute method or heating appliances if applicable) detailing exactly how much carbon they can save.
    `;

    let parsed: { headline: string; analysis: string; recommendations: string[] } | null = null;
    let isAiGenerated = false;
    let fallbackReason = "";
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (ai) {
      const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.5-flash"];
      let success = false;
      let lastError: unknown = null;

      for (const modelName of modelsToTry) {
        if (success) break;

        const maxAttempts = modelName === "gemini-3.1-flash-lite" ? 2 : 1;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            console.log(`Contacting Gemini service (model: ${modelName}, attempt: ${attempt})`);
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    analysis: { type: Type.STRING },
                    recommendations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["headline", "analysis", "recommendations"]
                },
                systemInstruction: "You are CarbonWise Coach, a friendly, professional AI climate scientist. You support custom actions over generic instructions. Always format your output exactly to the JSON schema provided."
              }
            });

            const responseText = response.text;
            if (responseText) {
              const rawParsed = JSON.parse(responseText.trim());
              const validated = validateCoachInsightResponse(rawParsed);
              if (validated.success) {
                parsed = validated.data;
                isAiGenerated = true;
                success = true;
                console.log(`Successfully generated advice using ${modelName} on attempt ${attempt}`);
                break;
              }
            }
          } catch (apiError: unknown) {
            const errorMessage =
              apiError instanceof Error ? apiError.message.toLowerCase() : String(apiError).toLowerCase();
            console.log(`[Status] Gemini request to ${modelName} transitioned to fallback status:`, errorMessage);
            lastError = apiError;
            const isTemporary = errorMessage.includes("503") || 
                                errorMessage.includes("demand") || 
                                errorMessage.includes("unavailable") || 
                                errorMessage.includes("resourceexhausted") || 
                                errorMessage.includes("rate") || 
                                errorMessage.includes("busy");

            if (isTemporary && attempt < maxAttempts) {
              const backoffMs = 400;
              console.log(`Retrying ${modelName} with basic backoff of ${backoffMs}ms...`);
              await delay(backoffMs);
            } else {
              break; 
            }
          }
        }
      }

      if (!success) {
        fallbackReason =
          lastError instanceof Error
            ? lastError.message
            : "All models returned temporary errors or reached quota capacity.";
      }
    } else {
      fallbackReason = "Google GenAI Client is not initialized due to missing GEMINI_API_KEY.";
    }

    if (isAiGenerated && parsed) {
      return res.json({
        ...parsed,
        isAiGenerated: true,
        isFallbackActive: false
      });
    } else {
      return res.json({
        ...fallbackResponse,
        isAiGenerated: false,
        isFallbackActive: true,
        fallbackReason: fallbackReason
      });
    }
  } catch (error) {
    console.error("Server-side handler encountered an error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * API Route: /api/coach-chat
 * Supports dynamic conversation with CarbonWise Coach, falling back safely when no API Key is enabled.
 */
app.post("/api/coach-chat", aiRateLimiter, async (req, res) => {
  try {
    const parsedBody = parseCoachChat(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: "Invalid request payload." });
    }

    const { messages, profileRaw } = parsedBody.data;
    const truncatedMessages = truncateChatMessages(messages);
    const latestUserMessage = extractLatestUserMessage(truncatedMessages);

    if (!latestUserMessage) {
      return res.status(400).json({ error: "No valid user message found." });
    }

    // Default dynamic rule-based responses for local fallback mode
    if (!ai) {
      const lowerQuery = latestUserMessage.toLowerCase();
      let responseText = `I am currently operating in resilient local mode. To enable my fully-conversational AI capabilities, please configure a valid GEMINI_API_KEY in Settings > Secrets. \n\nBased on your query and standard climate advisory guidelines, here is what I recommend: \n\n`;

      if (lowerQuery.includes("diet") || lowerQuery.includes("meat") || lowerQuery.includes("food") || lowerQuery.includes("vegan") || lowerQuery.includes("eat")) {
        responseText += `🌱 **Dietary Footprints Advice:** Meat and dairy account for up to 60% of agricultural emissions. Even a modest shift (e.g., Meatless Mondays) can limit your personal score by 400 - 800 kg CO2e annually. Focus on seasonal, locally sourced produce to minimize logistics overhead.`;
      } else if (lowerQuery.includes("car") || lowerQuery.includes("drive") || lowerQuery.includes("commute") || lowerQuery.includes("transport") || lowerQuery.includes("vehicle") || lowerQuery.includes("travel")) {
        responseText += `🚗 **Mobility Footprints Advice:** Travel is generally the fastest growing sector of emissions. Switching daily petrol commutes of ~20km to public transit or an EV reduces emissions by 75-90%. Walking or cycling has zero carbon impact and delivers clear wellness benefits.`;
      } else if (lowerQuery.includes("house") || lowerQuery.includes("energy") || lowerQuery.includes("solar") || lowerQuery.includes("insulation") || lowerQuery.includes("heating") || lowerQuery.includes("appliance")) {
        responseText += `⚡ **Domestic Utilities Advice:** Grid electricity holds a high emissions factor in regions with fossil generation. Transitioning to certified renewable energy contracts reduces utility footprint to near zero. Improving draft protection or radiator insulation also retains heat with zero fuel burns.`;
      } else if (lowerQuery.includes("flight") || lowerQuery.includes("plane") || lowerQuery.includes("flying") || lowerQuery.includes("fly")) {
        responseText += `✈️ **Aviation Footprints Advice:** A single long-haul intercontinental flight produces more emissions than an average individual in some developing countries produces in a year (~1.5 to 3 tons CO2e). Limit discretionary flying and buy voluntary offsets matching VCS standards where travel is essential.`;
      } else if (lowerQuery.includes("shopping") || lowerQuery.includes("buy") || lowerQuery.includes("clothes") || lowerQuery.includes("technology") || lowerQuery.includes("waste")) {
        responseText += `🛍️ **Consumer Purchases Advice:** Heavy manufacturing and global courier freight load individual footprints. Extending your cell phone replacement cycle to 4 years instead of 2 cuts resource pressures significantly. Prioritizing vintage wear and local repairs is also a high-impact choice.`;
      } else {
        responseText += `💡 **General Sustainability Tip:** The primary route to sustainability is systemic, starting with personal measurement and incremental habits. Your current profile has a total calculated rating of ${(profileRaw?.transport?.distance ?? 0) * 5 || "moderate"} units. Start tracking small daily task actions to drive steady improvements.`;
      }

      return res.json({
        text: responseText,
        isAiGenerated: false,
        isFallbackActive: true
      });
    }

    // Prepare message history formatted according to Google GenAI expectations
    // Schema: [{ role: "user" | "model", parts: [{ text: "..." }] }]
    const formattedContents = truncatedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: m.parts.map((p) => ({ text: p.text })),
    }));

    const systemInstruction = `
      You are CarbonWise Coach, an ultra-supportive, professional, and knowledgeable climate scientist.
      The user is interacting with you to lower their carbon emissions and learn about sustainable lifestyle practices.
      The user's profile details are:
      - Commute: ${sanitizePromptText(profileRaw?.transport?.method, 30) || 'unknown'} car/transit
      - Weekly travel: ${profileRaw?.transport?.distance || 0} km
      - Diet style: ${sanitizePromptText(profileRaw?.diet?.type, 30) || 'unknown'}
      - House size: ${sanitizePromptText(profileRaw?.energy?.homeSize, 30) || 'unknown'}
      - High Energy Devices: ${profileRaw?.energy?.highEnergyAppliances?.join(', ') || 'none'}
      - Clean energy tariff: ${sanitizePromptText(profileRaw?.energy?.cleanEnergy, 30) || 'unknown'}
      - Clothing purchase: ${sanitizePromptText(profileRaw?.shopping?.clothing, 30) || 'unknown'}
      
      Keep your answers highly conversational, objective, and accurate, using clean Markdown formatting. Focus on helpful, encouraging, and highly contextual tips. Do not cite long tables of raw data unless asked.
    `;

    console.log("Routing chat message request to Gemini flash engine.");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    if (response && response.text) {
      const validated = validateCoachChatResponse(response.text);
      if (!validated.success) {
        return res.status(502).json({ error: "Invalid AI response format." });
      }
      return res.json({
        text: validated.data.text,
        isAiGenerated: true,
        isFallbackActive: false
      });
    } else {
      throw new Error("Gemini returned an empty reply.");
    }

  } catch (error: unknown) {
    console.error("Coach chat controller failed:", error);
    return res.status(500).json({ error: "Internal server error occurred processing conversation." });
  }
});

/**
 * Vite Dev Server or Production Static Serving setup
 */
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`CarbonWise Coach Full-Stack Engine booted on http://${HOST}:${PORT}`);
  });
}

startServer();
