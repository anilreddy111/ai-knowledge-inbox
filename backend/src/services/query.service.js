import { generateEmbedding } from "./embedding.service.js";
import { findRelevantChunks } from "./retrieval.service.js";
import { generateAnswer } from "./llm.service.js";
import { findItemById } from "../repositories/item.repository.js";
import logger from "../config/logger.js";

export async function queryKnowledgeBase(question) {
  const queryEmbedding = await generateEmbedding(question);

  const relevantChunks = findRelevantChunks(
    queryEmbedding,
    5
  );

  if (relevantChunks.length === 0) {
    return {
      answer: "I couldn't find any relevant information in your saved knowledge.",
      sources: []
    };
  }

  const answer = await generateAnswer(
    question,
    relevantChunks
  );

  const sources = relevantChunks.map((chunk) => {
    const item = findItemById(chunk.itemId);

    return {
      itemId: item.id,
      title: item.title,
      sourceType: item.sourceType,
      sourceUrl: item.sourceUrl,
      snippet: chunk.content,
      score: chunk.score
    };
  });

  logger.info(
  {
    question,
    retrievedChunks: relevantChunks.length
  },
  "Knowledge query completed"
);
  return {
    answer,
    sources
  };
}