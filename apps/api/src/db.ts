import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "reservenroam.db");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create users table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Users table initialized");
          resolve();
        }
      }
    );
  });
}

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export function getUser(email: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else resolve((row as User) || null);
    });
  });
}

export function getUserById(id: number): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve((row as User) || null);
    });
  });
}

export function createUser(
  email: string,
  hashedPassword: string,
  firstName?: string,
  lastName?: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, firstName || null, lastName || null],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID as number);
      }
    );
  });
}

export function updateUser(
  id: number,
  firstName?: string,
  lastName?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET firstName = ?, lastName = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [firstName || null, lastName || null, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}
