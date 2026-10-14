import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/use-soon-suggestions", async (req, res) => {
    const { items } = req.body as {
      items?: Array<{ name: string; quantity: number; unit: string; daysLeft: number; location: string }>;
    };

    if (!items || items.length === 0) {
      res.json({ recipes: [], storageTips: [] });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      res.status(503).json({
        error: "Gemini API key not configured",
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const itemsSummary = items
        .map((i) => `${i.name} (${i.quantity} ${i.unit}, ${i.daysLeft} day(s) left, stored in ${i.location})`)
        .join("; ");

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `You are a zero-waste kitchen chef and food preservation expert for FreshTrack.
Based on these household items expiring within 3 days: ${itemsSummary}

Generate:
1. 2 simple, delicious zero-waste recipes that use one or more of these expiring items.
2. 2-3 practical fresh-keeping storage tips tailored to these exact items to extend their shelf life.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Recipe title" },
                    description: { type: Type.STRING, description: "1-2 sentence appetizing description" },
                    prepTime: { type: Type.STRING, description: "e.g., 5 mins or 15 mins" },
                    savesLabel: { type: Type.STRING, description: "e.g., Saves 3 items or Saves Spinach" },
                    ingredientsUsed: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Short ingredient tags with emoji, e.g. '🍓 Strawberries', '🥑 Avocados'",
                    },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "3-4 simple cooking steps",
                    },
                  },
                  required: ["title", "description", "prepTime", "savesLabel", "ingredientsUsed", "steps"],
                },
              },
              storageTips: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    emoji: { type: Type.STRING, description: "Single food emoji matching the item" },
                    title: { type: Type.STRING, description: "Short tip title, e.g., Keep Greens Crisp & Dry" },
                    description: { type: Type.STRING, description: "1-2 sentence practical storage instruction" },
                    benefit: { type: Type.STRING, description: "e.g., Adds 4-5 crisp days or Extends shelf life by 3 months" },
                  },
                  required: ["emoji", "title", "description", "benefit"],
                },
              },
            },
            required: ["recipes", "storageTips"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = JSON.parse(text.trim());
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: error?.message || "Failed to generate suggestions with Gemini.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FreshTrack server running on http://localhost:${PORT}`);
  });
}

startServer();
