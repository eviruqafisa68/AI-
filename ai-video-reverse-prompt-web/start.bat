@echo off
setlocal
if "%PORT%"=="" set PORT=8080
cd /d "%~dp0"
echo FlowMind is running at http://localhost:%PORT%
echo Press Ctrl+C to stop the server.
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server %PORT% --bind 0.0.0.0
) else (
  python -m http.server %PORT% --bind 0.0.0.0
)
