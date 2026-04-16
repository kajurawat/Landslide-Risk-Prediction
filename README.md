# Landslide Prediction Platform

End-to-end landslide risk prediction system with:

- FastAPI backend for data, prediction, retraining, and IoT ingestion APIs
- React + Vite frontend dashboard for visualization and interaction
- ML pipeline for training/retraining classical and neural-network-based models
- Dataset explorer and India landslide analytics/download endpoints

## What This Project Does

This platform estimates landslide risk from environmental features such as rainfall, slope, soil saturation, vegetation cover, seismic activity, and proximity to water.

It supports two main workflows:

- Interactive web usage through dashboard pages (home, dataset, prediction, analytics, workflow)
- Programmatic usage through REST APIs and IoT ingestion routes

## Key Features

- Prediction API with validated request schema and probability output
- Multi-model comparison and best-model artifact saving
- Retraining endpoint that combines original + request datasets
- Dataset fetch and download in CSV/JSON/XLSX formats
- India landslide records with pagination, search, analytics, and downloads
- IoT ingestion endpoints for Wi-Fi and serial input sources
- Frontend theme toggle and route-based dashboard UI

## Project Structure

```text
landslide_prediction/
|- backend/
|  |- app/                    # FastAPI app, routes, handlers, schemas
|  |- model/                  # Training, retraining, inference, artifacts
|  |- data/                   # Raw datasets + generated reports
|  |- Iot/                    # IoT API, gateways, and services
|  `- notebooks/              # Model experimentation notebooks
|- frontend/
|  |- src/                    # React app (pages, components, config)
|  `- public/                 # Static assets
|- Documentation/             # Setup, API list, directory workflow docs
|- run_backend.ps1 / .sh      # Automated backend bootstrap + run scripts
`- run_frontend.ps1 / .sh     # Automated frontend bootstrap + run scripts
```

## Tech Stack

Backend:

- Python 3.11+
- FastAPI + Uvicorn
- Pydantic
- pandas, NumPy, scikit-learn
- openpyxl (Excel export)
- python-dotenv

Frontend:

- React 19
- Vite
- React Router
- Tailwind CSS
- Recharts

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### 1) Start Backend

Windows (PowerShell):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_backend.ps1
```

Linux/macOS:

```bash
chmod +x run_backend.sh
./run_backend.sh
```

Backend default URL: `http://127.0.0.1:8000`

### 2) Start Frontend

Windows (PowerShell):

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; .\run_frontend.ps1
```

Linux/macOS:

```bash
chmod +x run_frontend.sh
./run_frontend.sh
```

Frontend default URL: `http://127.0.0.1:5173`

### 3) Open the App

- Frontend: `http://127.0.0.1:5173`
- Swagger docs: `http://127.0.0.1:8000/docs`

## Environment Configuration

Frontend `.env` (auto-created by run script if missing):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_BASE_URL_FOR_DATASET=http://127.0.0.1:8000/api/v1/data
```

Backend `.env` (optional, for CORS):

```env
CORS_ALLOW_ORIGINS=*
CORS_ALLOW_METHODS=*
CORS_ALLOW_HEADERS=*
CORS_ALLOW_CREDENTIALS=false
```

## API Overview

Base URL: `http://127.0.0.1:8000`

- `GET /hello`
- `GET /api/v1/data`
- `GET /api/v1/data/download?format=csv|json|xlsx`
- `GET /api/v1/india-landslides`
- `GET /api/v1/india-landslides/analytics`
- `GET /api/v1/india-landslides/download?format=csv|json|xlsx`
- `POST /api/v1/predict`
- `POST /api/v1/model/retrain`
- `POST /api/v1/iot/ingest`
- `POST /api/v1/iot/ingest/serial`
- `GET /api/v1/iot/health`

### Prediction Request Example

```json
{
  "rainfall_mm": 180.5,
  "slope_angle": 34.2,
  "soil_saturation": 0.72,
  "vegetation_cover": 0.36,
  "earthquake_activity": 2.1,
  "proximity_to_water": 0.8,
  "soil_type_gravel": 0,
  "soil_type_sand": 1,
  "soil_type_silt": 0
}
```

### Prediction Response Example

```json
{
  "landslide": true,
  "probability": 0.84,
  "best_model": "Random Forest",
  "model_predictions": {
    "Logistic Regression": {
      "landslide": true,
      "probability": 0.79
    },
    "Random Forest": {
      "landslide": true,
      "probability": 0.84
    }
  }
}
```

## Model Training and Retraining

Training pipeline behavior:

- Loads dataset and applies realistic noise augmentation
- Splits/scales data
- Trains classical models + neural network
- Selects best model by metrics
- Saves artifacts for inference

Retraining endpoint behavior:

- Merges base dataset and accumulated request dataset
- Cleans and validates rows
- Retrains classical models
- Updates saved model artifacts

## Data and Artifacts

- Main dataset: `backend/data/raw/landslide_dataset.csv`
- Request log dataset: `backend/data/raw/request_landslide_dataset.csv`
- India report data: `backend/data/reports/india_landslides_records.csv`
- Saved model artifacts: `backend/model/artifacts/`

## Useful Docs

- Backend setup: [Documentation/BACKEND_SETUP.md](Documentation/BACKEND_SETUP.md)
- Frontend setup: [Documentation/FRONTEND_SETUP.md](Documentation/FRONTEND_SETUP.md)
- API reference: [Documentation/BACKEND_API_LIST.md](Documentation/BACKEND_API_LIST.md)
- Project directories: [Documentation/DIRECTORY.md](Documentation/DIRECTORY.md)
- Workflow notes: [Documentation/WORKFLOW.md](Documentation/WORKFLOW.md)

## Troubleshooting

- If a port is occupied, run scripts auto-select the next free port.
- If PowerShell blocks scripts, run with `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.
- If model files are missing, prediction endpoints can return `MODEL_UNAVAILABLE` until training/retraining artifacts are created.

## License

See [LICENCE](LICENCE).
