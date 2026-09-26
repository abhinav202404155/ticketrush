import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Creates the users table if it doesn't already exist, and enables the
 * pgcrypto extension so we can generate UUIDs on the database side.
 * Running this on every boot is safe (idempotent) — it's what lets the
 * whole stack come up with a single command, no separate migration step.
 */
export async function runMigrations(): Promise<void> {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
