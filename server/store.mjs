import { DatabaseSync } from "node:sqlite";
import { chmodSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const defaultDatabase = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../.data/matronaguia.sqlite",
);

export function openStore(
  filename = process.env.MATRONAGUIA_DB || defaultDatabase,
) {
  if (filename !== ":memory:")
    mkdirSync(dirname(resolve(filename)), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(filename);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      consent INTEGER NOT NULL CHECK(consent = 1),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      consent INTEGER NOT NULL CHECK(consent = 1),
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS testimonials_public ON testimonials(status, created_at DESC);
  `);
  if (filename !== ":memory:") chmodSync(filename, 0o600);
  return db;
}
