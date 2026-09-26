#!/usr/bin/env bash
# TicketRush — one-click start.
# This single script builds every service, waits until the whole stack is
# actually ready to use, seeds sample data automatically, and opens your
# browser. You never need to run docker/npm commands by hand.

set -euo pipefail
cd "$(dirname "$0")"

BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
say()  { echo -e "${BLUE}▸${NC} $1"; }
ok()   { echo -e "${GREEN}✔${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
fail() { echo -e "${RED}✘${NC} $1"; exit 1; }

echo ""
echo "  🎟️  TicketRush — one-click start"
echo "  ─────────────────────────────────"
echo ""

# 1. Make sure Docker is installed and running
if ! command -v docker >/dev/null 2>&1; then
  fail "Docker isn't installed. Install Docker Desktop from https://www.docker.com/products/docker-desktop/ and try again."
fi
if ! docker info >/dev/null 2>&1; then
  fail "Docker is installed but not running. Start Docker Desktop, wait for it to say 'Running', then re-run this script."
fi
ok "Docker is running"

# Support both 'docker compose' (v2, current) and legacy 'docker-compose'
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

# 2. Build and start everything in the background
say "Building images and starting Postgres, Redis, and all services…"
say "(first run takes a few minutes — it's downloading and building everything)"
$COMPOSE up --build -d

# 3. Wait until the frontend is actually reachable, not just "started"
say "Waiting for the app to become ready…"
ATTEMPTS=0
MAX_ATTEMPTS=60
until curl -sf http://localhost:3000 >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo ""
    warn "Still not ready after 2 minutes. Check what's happening with:"
    echo "    $COMPOSE logs -f"
    exit 1
  fi
  sleep 2
  printf "."
done
echo ""
ok "TicketRush is up!"

# 4. Open the browser automatically — no copy-pasting a URL
URL="http://localhost:3000"
if command -v open >/dev/null 2>&1; then
  open "$URL"                       # macOS
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 & # Linux
else
  warn "Couldn't auto-open a browser — visit $URL manually"
fi

echo ""
echo "  🎉 TicketRush is running at: $URL"
echo ""
echo "  Useful commands:"
echo "    ./stop.sh              stop everything"
echo "    $COMPOSE logs -f        watch live logs"
echo "    $COMPOSE ps             see service status"
echo ""
