# IoT Integration Module

This directory contains all IoT-specific backend code in one place.

## What This Module Provides

- Wi-Fi hardware ingestion endpoint: `/api/v1/iot/ingest`
- Serial gateway ingestion endpoint: `/api/v1/iot/ingest/serial`
- IoT health endpoint: `/api/v1/iot/health`
- Serial gateway script to bridge Arduino serial output to backend API

## Directory Contents

- `api/routes.py`: FastAPI IoT routes
- `models/schemas.py`: Pydantic schemas for IoT request/response
- `services/prediction_service.py`: IoT-to-model mapping and prediction orchestration
- `gateways/serial_gateway.py`: CLI script for direct serial Arduino mode

## How It Works

1. Device sends sensor payload with all model features.
2. IoT route validates payload in `IoTIngestRequest`.
3. Service converts IoT payload into `PredictRequest`.
4. Existing prediction service runs inference and writes request CSV.
5. IoT route returns `landslide` and `probability` to hardware/client.

## Supported Connection Modes

### 1) Direct Wi-Fi Device -> Backend

Use `POST /api/v1/iot/ingest`.

- Start backend on LAN host:

```powershell
cd C:\Users\acer\Music\landslide_prediction\backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- Call from ESP32/ESP8266 to:

`http://<YOUR_PC_LOCAL_IP>:8000/api/v1/iot/ingest`

### 2) Direct Serial Arduino -> Python Gateway -> Backend

Use `gateways/serial_gateway.py` to read serial JSON lines and forward them to backend.

- Install dependency (if not installed):

```powershell
pip install pyserial requests
```

- Run gateway:

```powershell
python Iot/gateways/serial_gateway.py --port COM5 --baud 115200 --url http://127.0.0.1:8000/api/v1/iot/ingest/serial
```

- Arduino should print one JSON object per line, for example:

```json
{
  "device_id": "arduino-uno-01",
  "rainfall_mm": 206.18,
  "slope_angle": 58.28,
  "soil_saturation": 0.89,
  "vegetation_cover": 0.34,
  "earthquake_activity": 4.39,
  "proximity_to_water": 0.1,
  "soil_type_gravel": 0,
  "soil_type_sand": 0,
  "soil_type_silt": 1
}
```

## Request JSON Format

```json
{
  "device_id": "esp32-node-01",
  "rainfall_mm": 206.18,
  "slope_angle": 58.28,
  "soil_saturation": 0.89,
  "vegetation_cover": 0.34,
  "earthquake_activity": 4.39,
  "proximity_to_water": 0.1,
  "soil_type_gravel": 0,
  "soil_type_sand": 0,
  "soil_type_silt": 1
}
```

## Response JSON Format

```json
{
  "device_id": "esp32-node-01",
  "landslide": true,
  "probability": 0.83,
  "source": "wifi",
  "received_at_utc": "2026-03-27T10:00:00+00:00"
}
```

## Error Handling

- `422`: validation errors in sensor payload
- `503`: model artifacts missing/unavailable
- `500`: unexpected server-side error

## Notes

- The prediction service appends accepted requests to `data/raw/request_landslide_dataset.csv`.
- Keep device and backend on same network for Wi-Fi mode.
- Use firewall rule to allow inbound traffic on backend port.
