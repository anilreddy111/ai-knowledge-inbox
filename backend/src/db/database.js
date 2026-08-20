import Database from "better-sqlite3";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath =
  process.env.DATABASE_PATH || "./data/knowledge.db";

const absoluteDatabasePath = path.resolve(
  __dirname,
  "../../",
  databasePath
);

fs.mkdirSync(path.dirname(absoluteDatabasePath), {
  recursive: true
});

const db = new Database(absoluteDatabasePath);

db.pragma("foreign_keys = ON");

export default db;