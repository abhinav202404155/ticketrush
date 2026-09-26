@echo off
cd /d "%~dp0"
docker compose down
echo TicketRush stopped. Your data is preserved - run start.bat to resume.
pause
