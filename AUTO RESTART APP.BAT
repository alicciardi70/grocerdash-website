@echo off
cd /d C:\Users\antho\grocerdash_old

:: Clean .next to avoid permission issues
rd /s /q .next >nul 2>&1

:loop
echo Starting dev server...
npm run dev

echo.
echo [!] Dev server stopped or crashed. Restarting in 3 seconds...
timeout /t 3
goto loop
