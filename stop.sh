#!/usr/bin/env bash
# Stops all TicketRush containers. Your data (Postgres) is preserved —
# run start.sh again any time to pick up right where you left off.
cd "$(dirname "$0")"
if docker compose version >/dev/null 2>&1; then
  docker compose down
else
  docker-compose down
fi
echo "TicketRush stopped. Your data is preserved — run ./start.sh to resume."
