@echo off
title FixGuide Lab
echo.
echo  FixGuide Lab - Starting dev server...
echo  ======================================
echo.
cd /d "%~dp0"

:: Kill any existing Next.js dev server on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING" 2^>nul') do (
    echo  Stopping existing server (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Clean stale lock file
if exist ".next\dev\lock" del /f ".next\dev\lock" >nul 2>&1

echo  Opening http://localhost:3000 ...
start http://localhost:3000
call pnpm dev
echo.
echo  Server stopped. Press any key to close.
pause >nul
