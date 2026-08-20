import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

import { AppError } from "../errors/app-error.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateEmbedding(text) {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text
    });

    return response.embeddings[0].values;
  } catch (error) {
    throw new AppError(
      "Embedding service is currently unavailable",
      502,
      "EMBEDDING_SERVICE_FAILED"
    );
  }
}