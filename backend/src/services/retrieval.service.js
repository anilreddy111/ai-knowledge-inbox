import { findAllChunks } from "../repositories/chunk.repository.js";
import { cosineSimilarity } from "../utils/cosine-similarity.js";

const MIN_RELEVANCE_SCORE = 0.65;
export function findRelevantChunks(
  queryEmbedding,
  topK = 5
) {
  const chunks = findAllChunks();

  const scoredChunks = chunks.map((chunk) => {
    const embedding = JSON.parse(chunk.embedding);

    const score = cosineSimilarity(
      queryEmbedding,
      embedding
    );

    return {
      ...chunk,
      score
    };
  });
  return scoredChunks
  .filter((chunk) => chunk.score >= MIN_RELEVANCE_SCORE)
  .sort((a, b) => b.score - a.score)
  .slice(0, topK);
}