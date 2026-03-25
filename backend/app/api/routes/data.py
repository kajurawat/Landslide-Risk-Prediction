# version 1

from pathlib import Path        #used for working with File system paths
from io import BytesIO          #handling input and output
import json

import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, StreamingResponse


router = APIRouter(prefix="/api/v1/data", tags=["data"])

# data.py is in backend/app/api/routes, so parents[3] is backend/
BASE_DIR = Path(__file__).resolve().parents[3]
DATASET_PATH = BASE_DIR / "data" / "raw" / "landslide_dataset.csv"


def load_dataset() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        raise HTTPException(status_code=400, detail=f"Dataset not found: {DATASET_PATH}")
    try:
        return pd.read_csv(DATASET_PATH)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"failed to read dataset: {exc}") from exc
    

@router.get("")
def get_all_data():
    df = load_dataset()
    return {
        "rows" : len(df),
        "columns" : list(df.columns),
        "data" : df.to_dict(orient="records"),
    }

@router.get("/download")
def download_data(
    format: str = Query("csv", pattern="^(csv|json|xlsx)$")
):
    df = load_dataset()

    if format == "csv":
        return FileResponse(
            path=str(DATASET_PATH),
            media_type="text/csv",
            filename="landslide_dataset.csv",
        )
    
    if format == "json":
        payload = json.dumps(df.to_dict(orient="records"), indent=2).encode("utf-8")
        return StreamingResponse(
            BytesIO(payload),
            media_type="application/json",
            headers={"Content-Disposition" : "attachment; filename=landslide_dataset.json"},
        )
    
    # xlsx
    output = BytesIO()
    df.to_excel(output, index=False, engine="openpyxl")
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=landslide_dataset.xlsx"},
    )