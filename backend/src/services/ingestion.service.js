import { createItem } from "../repositories/item.repository.js";
import { createChunks } from "../repositories/chunk.repository.js";
import { chunkText } from "../utils/chunking.js";
import { generateEmbedding } from "./embedding.service.js";
import { fetchUrlContent } from "./url.service.js";
import logger from "../config/logger.js";

async function processContent({
  title,
  sourceType,
  sourceUrl = null,
  content
}) {
  const item = createItem({
    title,
    sourceType,
    sourceUrl,
    rawContent: content
  });

  logger.info(
    {
      itemId: item.id,
      sourceType,
      sourceUrl
    },
    "Content ingestion started"
  );

  const chunks = chunkText(content);

  const chunksWithEmbeddings = [];

  for (let index = 0; index < chunks.length; index++) {
    const embedding = await generateEmbedding(chunks[index]);

    chunksWithEmbeddings.push({
      itemId: item.id,
      chunkIndex: index,
      content: chunks[index],
      embedding
    });
  }

  createChunks(chunksWithEmbeddings);
  logger.info(
    {
      itemId: item.id,
      chunkCount: chunks.length
    },
    "Content ingestion completed"
  );
  return item;
}

export async function ingestNote({ title, content }) {
  return processContent({
    title,
    sourceType: "note",
    content
  });
}

export async function ingestUrl({ url }) {
  const { title, content } = await fetchUrlContent(url);



  return processContent({
    title: title || url,
    sourceType: "url",
    sourceUrl: url,
    content
  });
}