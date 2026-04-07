#!/usr/bin/env bash
set -euo pipefail

HOST="127.0.0.1"
PORT="8000"
RELOAD="true"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      HOST="${2:-}"
      shift 2
      ;;
    --port)
      PORT="${2:-}"
      shift 2
      ;;
    --no-reload)
      RELOAD="false"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: ./run_backend.sh [--host <host>] [--port <port>] [--no-reload]"
      exit 1
      ;;
  esac
done

if ! [[ "${PORT}" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  echo "Invalid --port value: ${PORT}. Expected 1-65535."
  exit 1
fi

find_free_port() {
  local host="$1"
  local start_port="$2"
  local max_attempts=20

  for ((i=0; i<max_attempts; i++)); do
    local candidate=$((start_port + i))

    if python - "$host" "$candidate" <<'PY'
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])
bind_host = "0.0.0.0" if host in ("", "0.0.0.0") else host

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind((bind_host, port))
except OSError:
    sys.exit(1)
finally:
    s.close()

sys.exit(0)
PY
    then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

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

SELECTED_PORT="$(find_free_port "${HOST}" "${PORT}")" || {
  echo "No free port found from ${PORT} to $((PORT + 19))."
  exit 1
}

if [[ "${SELECTED_PORT}" != "${PORT}" ]]; then
  echo "Port ${PORT} is busy. Using free port ${SELECTED_PORT} instead."
fi

echo "Starting backend on http://${HOST}:${SELECTED_PORT} ..."
if [[ "${RELOAD}" == "true" ]]; then
  python -m uvicorn app.main:app --host "${HOST}" --port "${SELECTED_PORT}" --reload
else
  python -m uvicorn app.main:app --host "${HOST}" --port "${SELECTED_PORT}"
fi
