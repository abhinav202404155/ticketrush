import "dotenv/config";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool, runMigrations } from "./db";
import { signToken, requireAuth, AuthedRequest } from "./auth";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "auth-service" });
  } catch (err) {
    res.status(503).json({ status: "down", error: (err as Error).message });
  }
});

app.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }
  const { name, email, password } = parsed.data;

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount && existing.rowCount > 0) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );
  const user = result.rows[0];
  const token = signToken({ sub: user.id, email: user.email, name: user.name });
  res.status(201).json({ token, user });
});

app.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }
  const { email, password } = parsed.data;

  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken({ sub: user.id, email: user.email, name: user.name });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

async function start() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`[auth-service] listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("[auth-service] failed to start:", err);
  process.exit(1);
});
