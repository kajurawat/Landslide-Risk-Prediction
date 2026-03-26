from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BASE_DIR.parent

DATASET_PATH = PROJECT_ROOT / "data" / "raw" / "landslide_dataset.csv"
ARTIFACTS_DIR = BASE_DIR / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "best_model.pkl"
SCALER_PATH = ARTIFACTS_DIR / "scaler.pkl"

DATASET_COLS = [
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


NOISE = {
    "Rainfall_mm" : 40,
    "Slope_Angle" : 8,
    "Soil_Saturation" : 0.35,
    "Vegetation_Cover" : 0.35,
    "Earthquake_Activity" : 1.5,
    "Proximity_to_Water" : 0.5
}
