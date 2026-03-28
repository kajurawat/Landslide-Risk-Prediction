import argparse
import json
import time

import requests
import serial


def parse_args():
    parser = argparse.ArgumentParser(
        description="Read Arduino serial JSON and forward to FastAPI IoT route."
    )
    parser.add_argument("--port", required=True, help="Serial port name, e.g. COM5")
    parser.add_argument("--baud", type=int, default=115200, help="Serial baud rate")
    parser.add_argument(
        "--url",
        default="http://127.0.0.1:8000/api/v1/iot/ingest/serial",
        help="Backend IoT serial ingest URL",
    )
    return parser.parse_args()


def forward_payload(url: str, payload: dict):
    response = requests.post(url, json=payload, timeout=10)
    print(f"HTTP {response.status_code}: {response.text}")


def run_gateway(port: str, baud: int, url: str):
    with serial.Serial(port=port, baudrate=baud, timeout=1) as ser:
        print(f"Serial gateway started on {port} @ {baud}. Forwarding to {url}")
        while True:
            try:
                line = ser.readline().decode("utf-8", errors="ignore").strip()
                if not line:
                    continue

                print(f"SERIAL: {line}")
                payload = json.loads(line)
                forward_payload(url, payload)
            except json.JSONDecodeError as exc:
                print(f"JSON decode error: {exc}")
            except requests.RequestException as exc:
                print(f"HTTP request error: {exc}")
            except KeyboardInterrupt:
                print("Stopping serial gateway.")
                break
            except Exception as exc:
                print(f"Unexpected error: {exc}")
                time.sleep(1)


if __name__ == "__main__":
    args = parse_args()
    run_gateway(port=args.port, baud=args.baud, url=args.url)
