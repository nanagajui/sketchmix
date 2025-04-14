import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const creations = pgTable("creations", {
  id: serial("id").primaryKey(),
  drawingData: text("drawing_data").notNull(), // base64 encoded canvas data
  generatedImage: text("generated_image").notNull(), // url or base64 of generated image
  emotionalAnalysis: jsonb("emotional_analysis").notNull(), // analysis object
  musicUrl: text("music_url").notNull(), // url to generated music
  createdAt: integer("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCreationSchema = createInsertSchema(creations).pick({
  drawingData: true,
  generatedImage: true,
  emotionalAnalysis: true,
  musicUrl: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCreation = z.infer<typeof insertCreationSchema>;
export type Creation = typeof creations.$inferSelect;

// API types
export type GenerateImageRequest = {
  drawingData: string; // base64 encoded image
};

export type GenerateImageResponse = {
  imageUrl: string;
};

export type AnalyzeImageRequest = {
  imageUrl: string;
};

export type EmotionData = {
  description: string;
  dominantEmotions: {
    name: string;
    percentage: number;
  }[];
};

export type AnalyzeImageResponse = {
  analysis: EmotionData;
};

export type GenerateMusicRequest = {
  emotionalDescription: string;
};

export type GenerateMusicResponse = {
  musicUrl: string;
  attributes: {
    name: string;
    value: string;
    percentage: number;
  }[];
};
