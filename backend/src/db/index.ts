import * as sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "db", "portfolio.sqlite");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ SQLite connection error", err);
  } else {
    console.log("✅ SQLite connected at", dbPath);
  }
});
