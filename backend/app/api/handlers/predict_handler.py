from pathlib import Path
import pickle
import csv

import numpy as np
import pandas as pd

from app.api.schemas.data_schema import PredictRequest

BASE_DIR = Path(__file__).resolve().parents[3] #backend/
MODEL_PATH = BASE_DIR / "model" / "artifacts" / "best_model.pkl"
SCALER_PATH = BASE_DIR / "model" / "artifacts" / "scaler.pkl"
RAW_DATA_DIR = BASE_DIR / "data" / "raw"
REQUEST_DATASET_PATH = RAW_DATA_DIR / "request_landslide_dataset.csv"

FEATURE_COLS = [
    "Rainfall_mm",
    "Slope_Angle",
    "Soil_Saturation",
    "Vegetation_Cover",
    "Earthquake_Activity",
    "Proximity_to_Water",
    "Soil_Type_Gravel",
    "Soil_Type_Sand",
    "Soil_Type_Silt",
]

REQUEST_DATASET_COLS = [
    "Rainfall_mm",
    "Slope_Angle",
    "Soil_Saturation",
    "Vegetation_Cover",
    "Earthquake_Activity",
    "Proximity_to_Water",
    "Landslide",
    "Soil_Type_Gravel",
    "Soil_Type_Sand",
    "Soil_Type_Silt",
]

def _load_artifacts():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
    if not SCALER_PATH.exists():
        raise FileNotFoundError(f"Scaler file not found: {SCALER_PATH}")
    
    with open(MODEL_PATH, "rb") as f:
        model_payload = pickle.load(f)

    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)

    if isinstance(model_payload, dict):
        model = model_payload.get("model")
        model_name = model_payload.get("model_name", "Best Model")
        all_models = model_payload.get("all_models")
        if not all_models and model is not None:
            all_models = {model_name: model}
    else:
        model = model_payload
        model_name = "Best Model"
        all_models = {model_name: model}

    return model_name, model, all_models, scaler


def _predict_with_model(model, X_scaled) -> dict:
    if hasattr(model, "predict_proba"):
        proba_raw = model.predict_proba(X_scaled)
        if np.ndim(proba_raw) > 1 and proba_raw.shape[1] >= 2:
            probability = float(proba_raw[0, 1])
        else:
            probability = float(np.ravel(proba_raw)[0])
    else:
        pred = int(np.ravel(model.predict(X_scaled))[0])
        probability = float(pred)

    probability = max(0.0, min(1.0, probability))
    landslide = probability >= 0.5

    return {
        "landslide": bool(landslide),
        "probability": round(probability, 2),
    }

def _build_feature_frame(payload: PredictRequest) -> pd.DataFrame:
    row = {
        "Rainfall_mm": payload.rainfall_mm,
        "Slope_Angle": payload.slope_angle,
        "Soil_Saturation": payload.soil_saturation,
        "Vegetation_Cover": payload.vegetation_cover,
        "Earthquake_Activity": payload.earthquake_activity,
        "Proximity_to_Water": payload.proximity_to_water,
        "Soil_Type_Gravel": payload.soil_type_gravel,
        "Soil_Type_Sand": payload.soil_type_sand,
        "Soil_Type_Silt": payload.soil_type_silt,
    }
    return pd.DataFrame([row], columns=FEATURE_COLS)

# code to add requested data into a saperate file
def _append_request_csv(payload: PredictRequest, result: dict) -> None:
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    file_exists = REQUEST_DATASET_PATH.exists()

    row = {
        "Rainfall_mm": payload.rainfall_mm,
        "Slope_Angle": payload.slope_angle,
        "Soil_Saturation": payload.soil_saturation,
        "Vegetation_Cover": payload.vegetation_cover,
        "Earthquake_Activity": payload.earthquake_activity,
        "Proximity_to_Water": payload.proximity_to_water,
        "Landslide": int(result["landslide"]),
        "Soil_Type_Gravel": payload.soil_type_gravel,
        "Soil_Type_Sand": payload.soil_type_sand,
        "Soil_Type_Silt": payload.soil_type_silt,
    }

    with open(REQUEST_DATASET_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=REQUEST_DATASET_COLS)
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)

def predict_landslide_service(payload: PredictRequest) -> dict:
    best_model_name, best_model, all_models, scaler = _load_artifacts()
    X = _build_feature_frame(payload)

    X_scaled = scaler.transform(X)

    model_predictions: dict[str, dict[str, float | bool]] = {}
    for name, model_obj in all_models.items():
        try:
            model_predictions[name] = _predict_with_model(model_obj, X_scaled)
        except Exception:
            continue

    if best_model_name in model_predictions:
        best_result = model_predictions[best_model_name]
    elif model_predictions:
        first_name = next(iter(model_predictions))
        best_model_name = first_name
        best_result = model_predictions[first_name]
    else:
        best_result = _predict_with_model(best_model, X_scaled)
        model_predictions[best_model_name] = best_result

    result = {
        "landslide": bool(best_result["landslide"]),
        "probability": float(best_result["probability"]),
        "best_model": best_model_name,
        "model_predictions": model_predictions,
    }

    _append_request_csv(payload, result)
    return result