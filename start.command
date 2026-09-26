#!/usr/bin/env bash
# Double-click this file in Finder to start TicketRush on macOS.
cd "$(dirname "$0")"
./start.sh
echo ""
read -n 1 -s -r -p "Press any key to close this window..."
