import { generateEmbedding } from "./src/services/embedding.service.js";
import { findRelevantChunks } from "./src/services/retrieval.service.js";

// const text = "Redis is commonly used for caching.";

// const embedding = await generateEmbedding(text);

// console.log("Dimensions:", embedding.length);
// console.log("First 5 values:", embedding.slice(0, 5));


const question = "Why is Redis useful for caching?";

const queryEmbedding =
  await generateEmbedding(question);

const results =
  findRelevantChunks(queryEmbedding, 5);

console.log("\nRelevant chunks:\n");

for (const result of results) {
  console.log("Score:", result.score);
  console.log("Content:", result.content);
  console.log("-------------------------");
}