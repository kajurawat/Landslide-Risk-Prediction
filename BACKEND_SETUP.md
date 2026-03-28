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
- activate environment
- upgrade pip tooling
- install dependencies from `backend/requirements.txt`
- ensure required runtime folders exist
- start FastAPI backend

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

6. Ensure runtime directories:

```powershell
New-Item -ItemType Directory -Force -Path .\data\raw | Out-Null
New-Item -ItemType Directory -Force -Path .\data\processed | Out-Null
New-Item -ItemType Directory -Force -Path .\model\artifacts | Out-Null
```

7. Run backend:

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

6. Ensure runtime directories:

```bash
mkdir -p data/raw data/processed model/artifacts
```

7. Run backend:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## Verify Backend Is Running

Open these URLs in browser:

- API root docs: `http://127.0.0.1:8000/docs`
- IoT health: `http://127.0.0.1:8000/api/v1/iot/health`

---

## Common Issues

### Port 8000 already in use

Use a different port manually:

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
