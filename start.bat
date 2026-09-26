@echo off
REM TicketRush — one-click start for Windows.
REM Double-click this file (or run it) to build and launch everything.

echo.
echo   TicketRush - one-click start
echo   -----------------------------
echo.

docker info >nul 2>&1
if errorlevel 1 (
  echo [X] Docker Desktop isn't running.
  echo     Install it from https://www.docker.com/products/docker-desktop/
  echo     then start it and re-run this script.
  pause
  exit /b 1
)
echo [OK] Docker is running

echo [..] Building images and starting Postgres, Redis, and all services...
echo      (first run takes a few minutes)
docker compose up --build -d
if errorlevel 1 (
  echo [X] docker compose failed - see the errors above.
  pause
  exit /b 1
)

echo [..] Waiting for the app to become ready...
set ATTEMPTS=0
:waitloop
curl -sf http://localhost:3000 >nul 2>&1
if not errorlevel 1 goto ready
set /a ATTEMPTS+=1
if %ATTEMPTS% GEQ 60 (
  echo [!] Still not ready after 2 minutes. Run "docker compose logs -f" to see what's happening.
  pause
  exit /b 1
)
timeout /t 2 /nobreak >nul
goto waitloop

:ready
echo [OK] TicketRush is up!
start http://localhost:3000

echo.
echo   TicketRush is running at: http://localhost:3000
echo.
echo   Useful commands:
echo     stop.bat                 stop everything
echo     docker compose logs -f   watch live logs
echo     docker compose ps        see service status
echo.
pause
