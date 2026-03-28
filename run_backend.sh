#!/usr/bin/env bash
set -euo pipefail

HOST="127.0.0.1"
PORT="8000"
RELOAD="true"

if [[ "${1:-}" == "--no-reload" ]]; then
  RELOAD="false"
fi

# Resolve repository and backend paths.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/backend"
VENV_DIR="${BACKEND_DIR}/.venv"
REQ_FILE="${BACKEND_DIR}/requirements.txt"

if [[ ! -f "${REQ_FILE}" ]]; then
  echo "requirements.txt not found: ${REQ_FILE}"
  exit 1
fi

echo "[1/5] Checking Python..."
if command -v python3 >/dev/null 2>&1; then
  PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_CMD="python"
else
  echo "Python is not installed. Please install Python 3.11+ and re-run this script."
  exit 1
fi

cd "${BACKEND_DIR}"

echo "[2/5] Creating virtual environment at ${VENV_DIR}"
"${PYTHON_CMD}" -m venv "${VENV_DIR}"

# shellcheck disable=SC1091
source .venv/bin/activate

echo "[3/5] Upgrading pip/setuptools/wheel"
python -m pip install --upgrade pip setuptools wheel

echo "[4/5] Installing backend dependencies"
python -m pip install -r "${REQ_FILE}"

echo "[5/5] Ensuring runtime folders exist"
mkdir -p "${BACKEND_DIR}/data/raw" "${BACKEND_DIR}/data/processed" "${BACKEND_DIR}/model/artifacts"

echo "Starting backend on http://${HOST}:${PORT} ..."
if [[ "${RELOAD}" == "true" ]]; then
  python -m uvicorn app.main:app --host "${HOST}" --port "${PORT}" --reload
else
  python -m uvicorn app.main:app --host "${HOST}" --port "${PORT}"
fi
