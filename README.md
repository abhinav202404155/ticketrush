# 🎟️ TicketRush

A stylish, autoscaling-ready ticket booking platform — built as a microservices project.
This is **Week 1**: Auth + Catalog services, PostgreSQL, Redis caching, and a fully
styled React frontend, wired together and startable with **one command**.

## Quick start (one click, seriously)

**Requirement:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running. That's the only thing you need on your machine — no Node, no Postgres, no Redis to install yourself.

| Your OS | What to do |
|---|---|
| **Mac** | Double-click `start.command` (or run `./start.sh` in Terminal) |
| **Windows** | Double-click `start.bat` |
| **Linux** | Run `./start.sh` in a terminal |

That single command will:
1. Build all three services (auth, catalog, frontend) as Docker images
2. Start PostgreSQL and Redis
3. Wait until the whole app is actually reachable (not just "started")
4. Seed 19 sample events automatically (idempotent — safe to restart anytime)
5. Open your browser to **http://localhost:3000**

To stop everything: run `./stop.sh` (or `stop.bat` on Windows). Your database is preserved in a Docker volume, so starting again is fast and your data is still there.

First run takes a few minutes (downloading base images + building). Every run after that is seconds.

## What you'll see

- A dark, gradient hero section with a live search bar (search by keyword or city)
- 19 seeded events across Concerts, Sports, Movies, Comedy and Theatre, each with a category-colored gradient card
- Category filter chips that instantly re-query the catalog
- A working Sign up / Log in flow — real JWT auth, real password hashing, persisted in Postgres

## Architecture (Week 1 slice)

```
Browser  →  nginx (frontend container, port 3000)
              ├── /api/auth/*     →  auth-service (Express + JWT + bcrypt)
              └── /api/catalog/*  →  catalog-service (Express + Redis cache)
                                           │
                            PostgreSQL ────┴──── Redis
```

The frontend never talks to the backend services directly — nginx proxies both
`/api/auth` and `/api/catalog`, so there's no CORS to configure, and only one
port (3000) is ever exposed to your machine. This mirrors the Ingress pattern
you'll build for real in Week 4 with Kubernetes.

## Project structure

```
ticketrush/
├── start.sh / start.bat / start.command   ← one-click start
├── stop.sh / stop.bat                     ← one-click stop
├── docker-compose.yml                     ← wires everything together
├── deploy/init-db.sql                     ← creates the 2nd database on first boot
├── services/
│   ├── auth-service/     (Node + Express + TypeScript + PostgreSQL)
│   └── catalog-service/  (Node + Express + TypeScript + PostgreSQL + Redis)
└── frontend/              (React + TypeScript + Tailwind + Vite → nginx)
```

## Manual / local development (optional)

You don't need this to run the app — `start.sh` handles everything through Docker.
This is only if you want to edit a service with hot-reload while it's running:

```bash
# Terminal 1 — auth service
cd services/auth-service && npm install && npm run dev

# Terminal 2 — catalog service
cd services/catalog-service && npm install && npm run dev

# Terminal 3 — frontend (proxies to the two services above)
cd frontend && npm install && npm run dev
```

For this local mode you'll need your own Postgres and Redis running, with
`DATABASE_URL` / `REDIS_URL` environment variables set — see `.env.example`
in each service folder.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Docker isn't installed` | Install Docker Desktop and make sure it's running (the whale icon in your system tray/menu bar should say "running") |
| Stuck on "Waiting for the app to become ready" | Run `docker compose logs -f` in another terminal to see which service is failing |
| Port 3000 already in use | Stop whatever else is using it, or edit the `ports` line for `frontend` in `docker-compose.yml` |
| Want a completely clean slate | `docker compose down -v` — this also deletes the database volume |

## What's next (Week 2 preview)

Week 2 adds the Inventory and Booking services — this is where seat locking,
the Redis-based concurrency control, and the "1,000 requests for one seat"
correctness test come in. See `docs/` for the full 8-week build guide.
