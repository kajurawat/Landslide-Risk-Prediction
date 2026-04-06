# Directory Structure

## Overview

This document explains what each folder in the Landslide Prediction Platform does.

---

## Frontend Structure (**frontend/**)

**frontend/public/** - Static images and assets

**frontend/src/components/** - Reusable UI components

- Navbar, Footer

**frontend/src/pages/** - Page components for each route

- **HomePage/** - Landing page with hero slides, stats, analytics, and maps
- **PredictPage/** - Prediction form and result display with model output
- **IndiaAllLandslidesPage/** - Report list, search, pagination, and analytics
- **DatasetPage/** - Dataset viewer and download options
- **WorkflowPage/** - Interactive system architecture diagram with draggable nodes

**frontend/src/** - App shell, routing, global styles, and config

- App.jsx, main.jsx, index.css, config.js

**frontend/** - Build config

- package.json, vite.config.js, eslint.config.js

---

## Backend Structure (**backend/**)

**backend/app/api/routes/** - HTTP endpoints

- hello.py, data.py, predict.py, retrain.py, india_landslides.py

**backend/app/api/handlers/** - Business logic for routes

- data_handler.py, predict_handler.py, retrain_handler.py, india_landslides_handler.py

**backend/app/api/schemas/** - Pydantic request/response models

- data_schema.py (contracts for API inputs/outputs)

**backend/data/raw/** - Training and prediction datasets

- landslide_dataset.csv (base training data)
- request_landslide_dataset.csv (incremental prediction logs for retraining)

**backend/data/reports/** - Report artifacts

- india_landslides_records.csv, india_landslides_records.json (report data)

**backend/model/config/** - ML settings

- settings.py (feature constants and config)

**backend/model/data/** - Data loading utilities

- loader.py (dataset loader)

**backend/model/preprocessing/** - Data preprocessing

- split_scale.py (train/test split and feature scaling)

**backend/model/models/** - Model definitions

- classical.py (logistic regression, random forest, gradient boosting)
- neural_net.py (neural network helpers)

**backend/model/pipelines/** - Training workflows

- train_pipeline.py (initial training)
- retrain_pipeline.py (retrain using base + prediction logs)

**backend/model/evaluation/** - Evaluation metrics

- metrics.py (model scoring and comparison)

**backend/model/artifacts/** - Saved models

- best_model.pkl (selected trained model)
- scaler.pkl (feature scaler for inference)
- serializer.py (load/save utilities)

**backend/Iot/** - IoT sensor integration

- **api/routes.py** - IoT endpoints
- **gateways/serial_gateway.py** - Serial data ingestion
- **services/prediction_service.py** - IoT payload to prediction mapping

**backend/notebooks/** - Experiment notebooks

- Jupyter notebooks for model exploration and testing

**backend/app/main.py** - FastAPI app setup

- Router registration, middleware, CORS config

---

## Documentation (**Documentation/**)

- DIRECTORY.md (this file)
- BACKEND_SETUP.md (backend environment setup)
- BACKEND_API_LIST.md (API endpoints reference)
