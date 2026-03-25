import pandas as pd
from pathlib import Path
from fastapi import  HTTPException


# data.py is in backend/app/api/routes, so parents[3] is backend/
BASE_DIR = Path(__file__).resolve().parents[3]
DATASET_PATH = BASE_DIR / "data" / "raw" / "landslide_dataset.csv"


# to send data to frontend 
def load_data_service() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        raise HTTPException(status_code=400, detail=f"Dataset not found: {DATASET_PATH}")
    try:
        return pd.read_csv(DATASET_PATH)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"failed to read dataset: {exc}") from exc
    


# to download in csv file format
def export_to_csv(df: pd.DataFrame) -> str:
    return str(DATASET_PATH)


# to download in json format file
def export_to_json(df: pd.DataFrame) -> dict:
    return df.to_dict(orient="records")


# to download in xml file
def export_to_xlsx(df: pd.DataFrame) -> bytes:
    from io import BytesIO
    output = BytesIO()
    df.to_excel(output, index=False, engine="openpyxl")
    output.seek(0)
    return output.getvalue()