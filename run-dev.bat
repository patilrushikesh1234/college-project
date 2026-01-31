@echo off
cd /d "%~dp0"
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Run: npm install
    pause
    exit /b 1
  )
)
echo Starting Next.js dev server at http://localhost:3000
call npm run dev
pause
