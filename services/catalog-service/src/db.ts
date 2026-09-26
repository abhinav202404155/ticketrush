import { Pool } from "pg";
import Redis from "ioredis";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 2,
  lazyConnect: false,
});

redis.on("error", (err) => {
  console.error("[catalog-service] redis error:", err.message);
});

export async function runMigrations(): Promise<void> {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      city TEXT NOT NULL,
      venue TEXT NOT NULL,
      event_date DATE NOT NULL,
      price_from NUMERIC NOT NULL,
      total_seats INT NOT NULL DEFAULT 120,
      tag TEXT,
      gradient TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_city ON events (city);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);`);
}
