import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.post("/api/coach-insights", async (req, res) => {
  try {
    const { name, transport, diet, energy, shopping, totalEmissions, profileRaw } = req.body;

    // --- Elegant dynamic rules-based fallback engine ---
    const user_name = name || "Eco Friend";
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
      recommendationsPool.push(`Replace short domestic flight legs (${profileRaw.transport.shortFlights} per year) with train journeys or virtual video conferencing to save ~300 kg CO2e.`);
    }

    // Diet specific
    if (profileRaw?.diet?.type === "heavy-meat" || profileRaw?.diet?.type === "mixed") {
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
      You are a world-class supportive climate scientist and sustainability developer assisting a user named "${name || 'Eco Advocate'}".
      They have provided questionnaire responses for their carbon footprint of ${totalEmissions || 5000} kg CO2e/year.
      Here are their detailed statistics (in kg CO2e/year):
      - Transport sector: ${transport || 1200}
      - Diet sector: ${diet || 1500}
      - Energy sector: ${energy || 1800}
      - Shopping sector: ${shopping || 500}
      
      User habits detail:
      - Transport Commuting: ${profileRaw?.transport?.method || 'unknown'} car/transit, ${profileRaw?.transport?.distance || 0} km/week. Short Flights: ${profileRaw?.transport?.shortFlights || 0}/yr, Long Flights: ${profileRaw?.transport?.longFlights || 0}/yr.
      - Diet choice: ${profileRaw?.diet?.type || 'unknown'}, Sourcing: ${profileRaw?.diet?.sourcing || 'unknown'}, Food Waste tendency: ${profileRaw?.diet?.foodWaste || 'unknown'}.
      - Energy environment: ${profileRaw?.energy?.homeSize || 'unknown'}, High energy devices: ${profileRaw?.energy?.highEnergyAppliances?.join(', ') || 'none'}, Clean energy source: ${profileRaw?.energy?.cleanEnergy || 'unknown'}.
      - Shopping and waste criteria: Clothes shopping: ${profileRaw?.shopping?.clothing || 'unknown'}, Tech purchase cycle: ${profileRaw?.shopping?.electronics || 'unknown'}, Recycling rigor: ${profileRaw?.shopping?.recycling || 'unknown'}.

      Provide a JSON object response tailored specifically to their stats with the following fields:
      - headline: A single, cheerful, and encouraging sentence (max 15 words) noting their eco level.
      - analysis: A structured analysis (2-3 sentences) detailing the exact areas where they produce the highest emissions and explaining the real-world climate trade-offs of their local lifestyle in plain human terms.
      - recommendations: A list of exactly 3 highly specific, highly actionable recommendations they can do (incorporating details from their real answers, e.g., using their specific commute method or heating appliances if applicable) detailing exactly how much carbon they can save.
    `;

    let parsed: any = null;
    let isAiGenerated = false;
    let isFallbackActive = false;
    let fallbackReason = "";
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    if (ai) {
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
      let success = false;
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        if (success) break;

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`Contacting Gemini - model: ${modelName}, attempt: ${attempt}`);
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
              parsed = JSON.parse(responseText.trim());
              isAiGenerated = true;
              success = true;
              console.log(`Successfully generated advice using ${modelName} on attempt ${attempt}`);
              break;
            }
          } catch (apiError: any) {
            console.error(`Gemini call to ${modelName} on attempt ${attempt} failed:`, apiError?.message || apiError);
            lastError = apiError;

            const errorMessage = (apiError?.message || "").toLowerCase();
            const isTemporary = errorMessage.includes("503") || 
                                errorMessage.includes("demand") || 
                                errorMessage.includes("unavailable") || 
                                errorMessage.includes("resourceexhausted") || 
                                errorMessage.includes("rate") || 
                                errorMessage.includes("busy");

            if (isTemporary && attempt < 3) {
              const backoffMs = attempt * 1500;
              console.log(`Temporary model error or high demand detected. Retrying ${modelName} in ${backoffMs}ms...`);
              await delay(backoffMs);
            } else {
              break; // Try next model or fallback
            }
          }
        }
      }

      if (!success) {
        isFallbackActive = true;
        fallbackReason = lastError?.message || "All models returned temporary errors or high demand.";
      }
    } else {
      isFallbackActive = true;
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
    res.status(500).json({ error: "Internal Server Error" });
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CarbonWise Coach Full-Stack Engine booted on http://0.0.0.0:${PORT}`);
  });
}

startServer();
