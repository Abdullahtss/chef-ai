@echo off
echo ========================================
echo ChefAI Companion - Quick Start Guide
echo ========================================
echo.
echo STEP 1: Add Your OpenAI API Key
echo --------------------------------
echo.
echo 1. Get your API key from: https://platform.openai.com/api-keys
echo 2. Open the file: api\.env
echo 3. Replace 'your_openai_api_key_here' with your actual API key
echo.
echo Example:
echo   OPENAI_API_KEY=sk-proj-abc123xyz...
echo.
echo ========================================
echo.
echo Press any key when you've added your API key...
pause > nul
echo.
echo STEP 2: Starting Backend Server...
echo --------------------------------
cd api
start cmd /k "echo Backend Server && npm run dev"
echo Backend server starting on http://localhost:5000
echo.
timeout /t 3 > nul
echo.
echo STEP 3: Starting Frontend...
echo --------------------------------
cd ..\client
start cmd /k "echo Frontend Server && npm run dev"
echo Frontend starting on http://localhost:5173
echo.
echo ========================================
echo.
echo Your browser should open automatically.
echo If not, visit: http://localhost:5173
echo.
echo Press any key to exit this window...
pause > nul
