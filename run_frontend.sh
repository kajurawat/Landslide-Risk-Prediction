#!/usr/bin/env bash
set -euo pipefail

HOST="127.0.0.1"
PORT="5173"

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
    *)
      echo "Unknown argument: $1"
      echo "Usage: ./run_frontend.sh [--host <host>] [--port <port>]"
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

    if node - "$host" "$candidate" <<'NODE'
const net = require('net');

const host = process.argv[2] || '127.0.0.1';
const port = Number(process.argv[3]);
const bindHost = (host === '' || host === '0.0.0.0') ? '0.0.0.0' : host;

const server = net.createServer();
server.once('error', () => process.exit(1));
server.listen(port, bindHost, () => {
  server.close(() => process.exit(0));
});
NODE
    then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"
PACKAGE_JSON="${FRONTEND_DIR}/package.json"
LOCK_FILE="${FRONTEND_DIR}/package-lock.json"
ENV_FILE="${FRONTEND_DIR}/.env"

if [[ ! -f "${PACKAGE_JSON}" ]]; then
  echo "frontend/package.json not found: ${PACKAGE_JSON}"
  exit 1
fi

echo "[1/4] Checking Node.js and npm..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Please install Node.js 18+ and re-run this script."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed or not on PATH. Please install Node.js/npm and re-run this script."
  exit 1
fi

cd "${FRONTEND_DIR}"

echo "[2/4] Installing frontend dependencies..."
if [[ -f "${LOCK_FILE}" ]]; then
  npm ci
else
  npm install
fi

echo "[3/4] Ensuring frontend .env exists..."
if [[ ! -f "${ENV_FILE}" ]]; then
  cat > "${ENV_FILE}" <<EOF
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_BASE_URL_FOR_DATASET=http://127.0.0.1:8000/api/v1/data
EOF
fi

SELECTED_PORT="$(find_free_port "${HOST}" "${PORT}")" || {
  echo "No free port found from ${PORT} to $((PORT + 19))."
  exit 1
}

if [[ "${SELECTED_PORT}" != "${PORT}" ]]; then
  echo "Port ${PORT} is busy. Using free port ${SELECTED_PORT} instead."
fi

echo "[4/4] Starting frontend on http://${HOST}:${SELECTED_PORT} ..."
npm run dev -- --host "${HOST}" --port "${SELECTED_PORT}"
