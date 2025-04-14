import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeImage, generateImage, generateMusic } from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Generate image from drawing
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { drawingData } = req.body;
      
      if (!drawingData) {
        return res.status(400).json({ message: "Drawing data is required" });
      }

      const result = await generateImage(drawingData);
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating image:", error);
      return res.status(500).json({ message: error.message || "Failed to generate image" });
    }
  });

  // Analyze image to extract emotions
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      const analysis = await analyzeImage(imageUrl);
      
      return res.json({ analysis });
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      return res.status(500).json({ message: error.message || "Failed to analyze image" });
    }
  });

  // Generate music based on emotional analysis
  app.post("/api/generate-music", async (req, res) => {
    try {
      const { emotionalDescription } = req.body;
      
      if (!emotionalDescription) {
        return res.status(400).json({ message: "Emotional description is required" });
      }

      const result = await generateMusic(emotionalDescription);
      
      return res.json(result);
    } catch (error: any) {
      console.error("Error generating music:", error);
      return res.status(500).json({ message: error.message || "Failed to generate music" });
    }
  });

  // Save creation
  app.post("/api/save-creation", async (req, res) => {
    try {
      const { drawingData, generatedImage, emotionalAnalysis, musicUrl } = req.body;
      
      if (!drawingData || !generatedImage || !emotionalAnalysis || !musicUrl) {
        return res.status(400).json({ message: "All creation fields are required" });
      }

      const creation = await storage.createCreation({
        drawingData,
        generatedImage,
        emotionalAnalysis,
        musicUrl,
        createdAt: Math.floor(Date.now() / 1000)
      });
      
      return res.json(creation);
    } catch (error: any) {
      console.error("Error saving creation:", error);
      return res.status(500).json({ message: error.message || "Failed to save creation" });
    }
  });
  
  // Get all creations
  app.get("/api/creations", async (req, res) => {
    try {
      const creations = await storage.getAllCreations();
      return res.json(creations);
    } catch (error: any) {
      console.error("Error fetching creations:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch creations" });
    }
  });
  
  // Get creation by ID
  app.get("/api/creations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid creation ID" });
      }
      
      const creation = await storage.getCreation(id);
      
      if (!creation) {
        return res.status(404).json({ message: "Creation not found" });
      }
      
      return res.json(creation);
    } catch (error: any) {
      console.error("Error fetching creation:", error);
      return res.status(500).json({ message: error.message || "Failed to fetch creation" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
