const Database = require("better-sqlite3");

const db = new Database("clipboard.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS clips(
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  );
  `);

module.exports = db;