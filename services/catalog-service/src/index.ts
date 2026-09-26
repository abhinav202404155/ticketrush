import "dotenv/config";
import cors from "cors";
import express from "express";
import { pool, redis, runMigrations } from "./db";
import seed from "./seed";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4002;
const CACHE_TTL_SECONDS = 30;

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "catalog-service" });
  } catch (err) {
    res.status(503).json({ status: "down", error: (err as Error).message });
  }
});

/** Distinct cities + categories, used to power the search filter chips on the frontend. */
app.get("/filters", async (_req, res) => {
  const cities = await pool.query("SELECT DISTINCT city FROM events ORDER BY city");
  const categories = await pool.query("SELECT DISTINCT category FROM events ORDER BY category");
  res.json({
    cities: cities.rows.map((r) => r.city),
    categories: categories.rows.map((r) => r.category),
  });
});

app.get("/events", async (req, res) => {
  const { city, category, q, limit = "24" } = req.query as Record<string, string>;
  const cacheKey = `catalog:search:${city || ""}:${category || ""}:${(q || "").toLowerCase()}:${limit}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }
  } catch {
    // Redis being briefly unavailable should never take the search API down —
    // we just fall through and hit Postgres directly.
  }

  const clauses: string[] = [];
  const values: unknown[] = [];

  if (city) {
    values.push(city);
    clauses.push(`city = $${values.length}`);
  }
  if (category) {
    values.push(category);
    clauses.push(`category = $${values.length}`);
  }
  if (q) {
    values.push(`%${q.toLowerCase()}%`);
    clauses.push(`(LOWER(title) LIKE $${values.length} OR LOWER(venue) LIKE $${values.length})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  values.push(Number(limit));

  const result = await pool.query(
    `SELECT id, title, category, city, venue, event_date, price_from, total_seats, tag, gradient, icon, description
     FROM events
     ${where}
     ORDER BY event_date ASC
     LIMIT $${values.length}`,
    values
  );

  const payload = { events: result.rows, count: result.rowCount };

  try {
    await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL_SECONDS);
  } catch {
    // Cache write failures are non-fatal.
  }

  res.set("X-Cache", "MISS");
  res.json(payload);
});

app.get("/events/:id", async (req, res) => {
  const result = await pool.query(
    `SELECT id, title, category, city, venue, event_date, price_from, total_seats, tag, gradient, icon, description
     FROM events WHERE id = $1`,
    [req.params.id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json({ event: result.rows[0] });
});

async function start() {
  await runMigrations();
  await seed();
  app.listen(PORT, () => {
    console.log(`[catalog-service] listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("[catalog-service] failed to start:", err);
  process.exit(1);
});
