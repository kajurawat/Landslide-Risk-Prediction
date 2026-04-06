import pandas as pd
from config.settings import DATASET_PATH, DATASET_COLS


def load_dataset() -> pd.DataFrame:
    """Load raw dataset with enforced schema."""
    df = pd.read_csv(
        DATASET_PATH,
        header=0,
        names=DATASET_COLS,
        usecols=range(10)
    )

    numeric_cols = [
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
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=numeric_cols)

    # Keep only valid one-hot soil rows to avoid training on inconsistent labels.
    soil_sum = df["Soil_Type_Gravel"] + df["Soil_Type_Sand"] + df["Soil_Type_Silt"]
    df = df[soil_sum == 1].copy()

    df["Landslide"] = df["Landslide"].astype(int)
    return df