import db from "./database.js";

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      source_type TEXT NOT NULL CHECK (source_type IN ('note', 'url')),
      source_url TEXT,
      raw_content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (item_id)
        REFERENCES items(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_chunks_item_id
      ON chunks(item_id);
  `);
}