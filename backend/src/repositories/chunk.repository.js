import db from "../db/database.js";

const insertChunkStatement = db.prepare(`
  INSERT INTO chunks (
    item_id,
    chunk_index,
    content,
    embedding
  )
  VALUES (?, ?, ?, ?)
`);

const insertChunksTransaction = db.transaction((chunks) => {
  for (const chunk of chunks) {
    insertChunkStatement.run(
      chunk.itemId,
      chunk.chunkIndex,
      chunk.content,
      JSON.stringify(chunk.embedding)
    );
  }
});

const findChunksByItemIdStatement = db.prepare(`
  SELECT
    id,
    item_id AS itemId,
    chunk_index AS chunkIndex,
    content,
    embedding,
    created_at AS createdAt
  FROM chunks
  WHERE item_id = ?
  ORDER BY chunk_index ASC
`);

const findAllChunksStatement = db.prepare(`
  SELECT
    id,
    item_id AS itemId,
    chunk_index AS chunkIndex,
    content,
    embedding,
    created_at AS createdAt
  FROM chunks
`);

export function createChunks(chunks) {
  insertChunksTransaction(chunks);
}

export function findChunksByItemId(itemId) {
  return findChunksByItemIdStatement.all(itemId);
}

export function findAllChunks() {
  return findAllChunksStatement.all();
}