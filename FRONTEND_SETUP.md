# Frontend Setup Guide

This guide explains two complete ways to set up and run the frontend:

1. Auto setup (one command) using project automation scripts.
2. Manual setup step by step.

It includes commands for both Windows and Linux/macOS.

---

## Prerequisites

- Node.js 18+ installed
- `npm` available
- Git clone/fork of this repository

Verify Node/npm:

### Windows (PowerShell)

```powershell
node --version
npm --version
```

### Linux/macOS (bash)

```bash
node --version
npm --version
```

---

## Method 1: Auto Setup (Recommended)

This method runs everything automatically:

- check Node.js and npm
- install dependencies from `frontend/package.json`
- ensure frontend `.env` exists
- start Vite dev server

Notes:

- `run_frontend.ps1` supports `-BindHost` and `-Port`.
- `run_frontend.sh` supports `--host` and `--port`.
- Both scripts auto-select the next free port if the requested one is busy.

### Windows (PowerShell)

Run from repository root:

```powershell
cd C:\Users\acer\Music\landslide_prediction
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_frontend.ps1
```

Optional (custom host/port):

```powershell
cd C:\Users\acer\Music\landslide_prediction
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_frontend.ps1 -BindHost 0.0.0.0 -Port 5174
```

### Linux/macOS (bash)

Run from repository root:

```bash
cd /path/to/landslide_prediction
chmod +x run_frontend.sh
./run_frontend.sh
```

Optional (custom host/port):

```bash
cd /path/to/landslide_prediction
chmod +x run_frontend.sh
./run_frontend.sh --host 0.0.0.0 --port 5174
```

---

## Method 2: Manual Setup (Step by Step)

### Windows (PowerShell)

1. Go to frontend folder:

```powershell
cd C:\Users\acer\Music\landslide_prediction\frontend
```

2. Install dependencies:

```powershell
npm ci
```

If lockfile is missing, use:

```powershell
npm install
```

3. Ensure `.env` exists:

```powershell
@'
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_BASE_URL_FOR_DATASET=http://127.0.0.1:8000/api/v1/data
'@ | Set-Content -Path .env
```

4. Run frontend:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

### Linux/macOS (bash)

1. Go to frontend folder:

```bash
cd /path/to/landslide_prediction/frontend
```

2. Install dependencies:

```bash
npm ci
```

If lockfile is missing, use:

```bash
npm install
```

3. Ensure `.env` exists:

```bash
cat > .env <<EOF
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_BASE_URL_FOR_DATASET=http://127.0.0.1:8000/api/v1/data
EOF
```

4. Run frontend:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

---

## Verify Frontend Is Running

Open this URL in browser:

- Frontend app: `http://127.0.0.1:5173`

If the script auto-selected a different port, use the printed port.

---

## Common Issues

### Port 5173 already in use

Use a different port manually:

#### Windows

```powershell
npm run dev -- --host 127.0.0.1 --port 5174
```

#### Linux/macOS

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

### PowerShell script blocked

Run with execution policy for current session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Wrong script path

- If you are in repo root, use: `./run_frontend.ps1` or `./run_frontend.sh`
- If you are in `frontend`, use: `../run_frontend.ps1` or `../run_frontend.sh`
