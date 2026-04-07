# Backend API Route List

This document is generated from the current backend route modules in `backend/app/api/routes` and `backend/Iot/api/routes.py`.

## Base Information

- App title: `Landslide Prediction API`
- Default local base URL: `http://127.0.0.1:8000`
- Swagger UI: `GET /docs`
- OpenAPI JSON: `GET /openapi.json`

## Route Summary

| Method | Path                                 | Router Tag         | Purpose                                       |
| ------ | ------------------------------------ | ------------------ | --------------------------------------------- |
| GET    | `/hello`                             | (none)             | Simple hello/health-style backend check       |
| GET    | `/api/v1/data`                       | `data`             | Return full dataset summary and rows          |
| GET    | `/api/v1/data/download`              | `data`             | Download dataset as csv/json/xlsx             |
| GET    | `/api/v1/india-landslides`           | `india-landslides` | Paginated/filterable India landslide records  |
| GET    | `/api/v1/india-landslides/analytics` | `india-landslides` | Aggregated analytics for India landslide data |
| GET    | `/api/v1/india-landslides/download`  | `india-landslides` | Download India landslide filtered data        |
| POST   | `/api/v1/predict`                    | `predict`          | Run landslide prediction for one input sample |
| POST   | `/api/v1/model/retrain`              | `model`            | Retrain model pipeline and return metrics     |
| POST   | `/api/v1/iot/ingest`                 | `iot`              | Ingest Wi-Fi IoT payload and predict          |
| POST   | `/api/v1/iot/ingest/serial`          | `iot`              | Ingest serial IoT payload and predict         |
| GET    | `/api/v1/iot/health`                 | `iot`              | IoT module health endpoint                    |

---

## Detailed Endpoint Reference

## 1) Hello

### `GET /hello`

- Description: Basic backend connectivity check.
- Request body: None
- Query/path params: None
- Success response example:

```json
{
  "message": "Hello World from FastAPI backend"
}
```

---

## 2) Dataset APIs

### `GET /api/v1/data`

- Description: Returns dataset metadata and full data rows.
- Request body: None
- Query/path params: None
- Success response shape:

```json
{
  "rows": 2000,
  "columns": ["Rainfall_mm", "Slope_Angle", "..."],
  "data": [
    {
      "Rainfall_mm": 206.18,
      "Slope_Angle": 58.27
    }
  ]
}
```

### `GET /api/v1/data/download`

- Description: Downloads dataset file.
- Query params:
  - `format` (string, optional, default `csv`, allowed: `csv`, `json`, `xlsx`)
- Response:
  - `csv` -> file `landslide_dataset.csv`
  - `json` -> attachment `landslide_dataset.json`
  - `xlsx` -> attachment `landslide_dataset.xlsx`

---

## 3) India Landslide APIs

### `GET /api/v1/india-landslides`

- Description: Returns India landslide records with search + pagination.
- Query params:
  - `q` (string, optional, default `""`, max length `200`)
  - `page` (integer, optional, default `1`, min `1`)
  - `page_size` (integer, optional, default `25`, min `1`, max `200`)
- Response: JSON page payload from handler (items and pagination metadata).

### `GET /api/v1/india-landslides/analytics`

- Description: Returns analytics summary for India landslide records.
- Query params:
  - `top_n` (integer, optional, default `10`, min `3`, max `25`)
- Response: JSON analytics object (keys depend on analytics handler output).

### `GET /api/v1/india-landslides/download`

- Description: Downloads India landslide data, optionally filtered by search term.
- Query params:
  - `format` (string, optional, default `csv`, allowed: `csv`, `json`, `xlsx`)
  - `q` (string, optional, default `""`, max length `200`)
- Response: File stream with `Content-Disposition` filename from handler.

---

## 4) Prediction API

### `POST /api/v1/predict`

- Description: Returns ensemble/classifier prediction result for one sample.
- Request body schema (`PredictRequest`):
  - `rainfall_mm` (float, `50.0` to `300.0`)
  - `slope_angle` (float, `5.0` to `60.0`)
  - `soil_saturation` (float, `0.0` to `1.0`)
  - `vegetation_cover` (float, `0.0` to `1.0`)
  - `earthquake_activity` (float, `0.0` to `6.5`)
  - `proximity_to_water` (float, `0.0` to `2.0`)
  - `soil_type_gravel` (int, `0` or `1`)
  - `soil_type_sand` (int, `0` or `1`)
  - `soil_type_silt` (int, `0` or `1`)
- Validation rule:
  - Soil one-hot fields must sum to exactly `1`.
- Success response schema (`PredictResponse`):
  - `landslide` (bool)
  - `probability` (float, `0.0` to `1.0`)
  - `best_model` (string or null)
  - `model_predictions` (object)
- Error responses:
  - `503 MODEL_UNAVAILABLE`
  - `422 VALIDATION_ERROR`
  - `500 INTERNAL_SERVER_ERROR`

---

## 5) Model Retraining API

### `POST /api/v1/model/retrain`

- Description: Retrains model using current dataset/request data and returns training outcome.
- Request body: None
- Success response schema (`RetrainResponse`):
  - `status` (string)
  - `message` (string)
  - `rows_original` (int)
  - `rows_requests` (int)
  - `rows_combined` (int)
  - `best_model` (string)
  - `best_auc` (float)
  - `best_accuracy` (float)
- Error responses:
  - `404 DATASET_NOT_FOUND`
  - `422 RETRAIN_VALIDATION_ERROR`
  - `500 RETRAIN_FAILED`

---

## 6) IoT APIs

### `POST /api/v1/iot/ingest`

- Description: Accepts IoT payload from Wi-Fi source and returns prediction.
- Request body schema (`IoTIngestRequest`):
  - `device_id` (string, min length `1`, max length `100`)
  - `rainfall_mm` (float, `0.0` to `1000.0`)
  - `slope_angle` (float, `0.0` to `90.0`)
  - `soil_saturation` (float, `0.0` to `1.0`)
  - `vegetation_cover` (float, `0.0` to `1.0`)
  - `earthquake_activity` (float, `0.0` to `10.0`)
  - `proximity_to_water` (float, `0.0` to `50.0`)
  - `soil_type_gravel` (int, `0` or `1`)
  - `soil_type_sand` (int, `0` or `1`)
  - `soil_type_silt` (int, `0` or `1`)
- Success response schema (`IoTIngestResponse`):
  - `device_id` (string)
  - `landslide` (bool)
  - `probability` (float)
  - `source` (string)
  - `received_at_utc` (datetime)
- Error responses:
  - `503 MODEL_UNAVAILABLE`
  - `422 VALIDATION_ERROR`
  - `500 INTERNAL_SERVER_ERROR`

### `POST /api/v1/iot/ingest/serial`

- Description: Same as `/ingest`, but source is serial input.
- Request body: same as `POST /api/v1/iot/ingest`
- Success response: same as `POST /api/v1/iot/ingest`
- Error responses: same as `POST /api/v1/iot/ingest`

### `GET /api/v1/iot/health`

- Description: IoT module health endpoint.
- Request body: None
- Query/path params: None
- Success response example:

```json
{
  "status": "ok",
  "module": "iot",
  "routes": ["/ingest", "/ingest/serial", "/health"]
}
```

---

## Notes

- CORS behavior is configured via environment variables loaded from `.env`:
  - `CORS_ALLOW_ORIGINS`
  - `CORS_ALLOW_METHODS`
  - `CORS_ALLOW_HEADERS`
  - `CORS_ALLOW_CREDENTIALS`
- For live contract/testing, use `GET /docs`.
