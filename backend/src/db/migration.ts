import { db } from "./index";

export function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS cv (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      uploaded_at TEXT NOT NULL
    )
  `);
}
