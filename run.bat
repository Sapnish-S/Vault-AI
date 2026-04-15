@echo off
echo ==============================================
echo Installing requirements and starting Vault AI
echo ==============================================

echo.
echo [1/2] Setting up Backend...
cd "%~dp0backend"
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing backend dependencies...
pip install -r requirements.txt
echo Running pre-start checks (this pre-downloads AI models if missing)...
python pre_download_models.py
echo Starting backend server in a new window...
start "Vault AI Backend" cmd /k "call venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo.
echo [2/2] Setting up Frontend...
cd "%~dp0frontend"
echo Installing frontend dependencies...
call npm install
echo Starting frontend server in a new window...
start "Vault AI Frontend" cmd /k "npm run dev"

echo.
echo ==============================================
echo Both servers are starting in new windows!
echo Backend API will be available at http://127.0.0.1:8000
echo Frontend UI will usually be available at http://localhost:5173
echo ==============================================
pause
