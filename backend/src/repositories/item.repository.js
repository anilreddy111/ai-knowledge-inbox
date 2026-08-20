import db from "../db/database.js";

const insertItemStatement = db.prepare(`
  INSERT INTO items (
    title,
    source_type,
    source_url,
    raw_content
  )
  VALUES (?, ?, ?, ?)
`);

const findItemByIdStatement = db.prepare(`
  SELECT
    id,
    title,
    source_type AS sourceType,
    source_url AS sourceUrl,
    raw_content AS rawContent,
    created_at AS createdAt
  FROM items
  WHERE id = ?
`);

const findAllItemsStatement = db.prepare(`
  SELECT
    id,
    title,
    source_type AS sourceType,
    source_url AS sourceUrl,
    created_at AS createdAt
  FROM items
  ORDER BY created_at DESC
`);

export function createItem({
  title,
  sourceType,
  sourceUrl = null,
  rawContent
}) {
  const result = insertItemStatement.run(
    title,
    sourceType,
    sourceUrl,
    rawContent
  );

  return findItemById(result.lastInsertRowid);
}

export function findItemById(id) {
  return findItemByIdStatement.get(id);
}

export function findAllItems() {
  return findAllItemsStatement.all();
}