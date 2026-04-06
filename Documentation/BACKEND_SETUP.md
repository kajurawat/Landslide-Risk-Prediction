# Backend Setup Guide

This guide explains two complete ways to set up and run the backend:

1. Auto setup (one command) using project automation scripts.
2. Manual setup step by step.

It includes commands for both Windows and Linux/macOS.

---

## Prerequisites

- Python 3.11+ installed
- `pip` available
- Git clone/fork of this repository

Verify Python:

### Windows (PowerShell)

```powershell
python --version
```

### Linux/macOS (bash)

```bash
python3 --version
```

---

## Method 1: Auto Setup (Recommended)

This method runs everything automatically:

- create virtual environment
- upgrade pip tooling
- install dependencies from `backend/requirements.txt`
- ensure required runtime folders exist
- start FastAPI backend (`app.main:app`)

Notes:

- `run_backend.ps1` supports `-BindHost`, `-Port`, and `-NoReload`.
- On Windows, if the requested port is busy, `run_backend.ps1` auto-selects the next free port.
- `run_backend.sh` supports `--host`, `--port`, and `--no-reload`.
- On Linux/macOS, if the requested port is busy, `run_backend.sh` auto-selects the next free port.

### Windows (PowerShell)

Run from repository root:

```powershell
cd C:\Users\acer\Music\landslide_prediction
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_backend.ps1
```

Optional (disable auto-reload):

```powershell
cd C:\Users\acer\Music\landslide_prediction
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_backend.ps1 -NoReload
```

Optional (custom host/port):

```powershell
cd C:\Users\acer\Music\landslide_prediction
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_backend.ps1 -BindHost 0.0.0.0 -Port 8001
```

### Linux/macOS (bash)

Run from repository root:

```bash
cd /path/to/landslide_prediction
chmod +x run_backend.sh
./run_backend.sh
```

Optional (disable auto-reload):

```bash
cd /path/to/landslide_prediction
chmod +x run_backend.sh
./run_backend.sh --no-reload
```

Optional (custom host/port):

```bash
cd /path/to/landslide_prediction
chmod +x run_backend.sh
./run_backend.sh --host 0.0.0.0 --port 8001
```

---

## Method 2: Manual Setup (Step by Step)

### Windows (PowerShell)

1. Go to backend folder:

```powershell
cd C:\Users\acer\Music\landslide_prediction\backend
```

2. Create virtual environment:

```powershell
python -m venv .venv
```

3. Activate virtual environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

4. Upgrade pip tooling:

```powershell
python -m pip install --upgrade pip setuptools wheel
```

5. Install dependencies:

```powershell
python -m pip install -r requirements.txt
```

6. Optional: configure CORS in `.env` (loaded by backend on startup):

```powershell
@'
CORS_ALLOW_ORIGINS=*
CORS_ALLOW_METHODS=*
CORS_ALLOW_HEADERS=*
CORS_ALLOW_CREDENTIALS=false
'@ | Set-Content -Path .env
```

7. Ensure runtime directories:

```powershell
New-Item -ItemType Directory -Force -Path .\data\raw | Out-Null
New-Item -ItemType Directory -Force -Path .\data\processed | Out-Null
New-Item -ItemType Directory -Force -Path .\model\artifacts | Out-Null
```

8. Run backend:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Linux/macOS (bash)

1. Go to backend folder:

```bash
cd /path/to/landslide_prediction/backend
```

2. Create virtual environment:

```bash
python3 -m venv .venv
```

3. Activate virtual environment:

```bash
source .venv/bin/activate
```

4. Upgrade pip tooling:

```bash
python -m pip install --upgrade pip setuptools wheel
```

5. Install dependencies:

```bash
python -m pip install -r requirements.txt
```

6. Optional: configure CORS in `.env` (loaded by backend on startup):

```bash
cat > .env <<EOF
CORS_ALLOW_ORIGINS=*
CORS_ALLOW_METHODS=*
CORS_ALLOW_HEADERS=*
CORS_ALLOW_CREDENTIALS=false
EOF
```

7. Ensure runtime directories:

```bash
mkdir -p data/raw data/processed model/artifacts
```

8. Run backend:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## Verify Backend Is Running

Open these URLs in browser:

- Swagger docs: `http://127.0.0.1:8000/docs`
- Hello route: `http://127.0.0.1:8000/hello`
- Dataset route: `http://127.0.0.1:8000/api/v1/data`
- India landslides route: `http://127.0.0.1:8000/api/v1/india-landslides`
- IoT health: `http://127.0.0.1:8000/api/v1/iot/health`

If PowerShell auto-selected a different port, replace `8000` with the printed port.

---

## Common Issues

### Port 8000 already in use

Use a different port manually.

Auto setup note (Windows): `run_backend.ps1` automatically searches for a free port starting from the requested one.

#### Windows

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

#### Linux/macOS

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### PowerShell script blocked

Run with execution policy for current session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Wrong script path

- If you are in repo root, use: `./run_backend.ps1`
- If you are in `backend`, use: `../run_backend.ps1`
