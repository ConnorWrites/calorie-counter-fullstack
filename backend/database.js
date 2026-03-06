import Database from "better-sqlite3";

const db = new Database("calorie_counter.db");

// Create users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`).run();

// Create foods table
db.prepare(`
  CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT,
    calories INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id)
  )
`).run();

export default db;