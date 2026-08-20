import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.5-flash";

export async function generateAnswer(question, chunks) {
    const context = chunks
        .map(
            (chunk, index) =>
                `[Source ${index + 1}]
${chunk.content}`
        )
        .join("\n\n");

    const prompt = `
You are an AI assistant answering questions over a user's saved knowledge.

Answer the question using ONLY the provided context.

If the context does not contain enough information to answer the question,
say that the information is not available in the saved knowledge.

Do not invent facts.

Context:
${context}

Question:
${question}

Provide a concise and useful answer.
`;
    try {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt
        });

        return response.text;
    }
    catch (error) {
        throw new AppError(
            "LLM service is currently unavailable",
            502,
            "LLM_SERVICE_FAILED"
        );
    }
}