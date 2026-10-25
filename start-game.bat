@echo off
cd /d "%~dp0"
start "Ravan Dahan local server" /min cmd /c "node server.js"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:4173/
