# version 1
from fastapi import APIRouter, Query
from fastapi.responses import FileResponse, StreamingResponse
from io import BytesIO          #handling input and output
import json

# import handlers
from app.api.handlers.data_handler import(
    load_data_service,
    export_to_csv,
    export_to_json,
    export_to_xlsx
)

router = APIRouter(prefix="/api/v1/data", tags=["data"])



@router.get("")
def get_all_data():
    df = load_data_service()
    return {
        "rows" : len(df),
        "columns" : list(df.columns),
        "data" : export_to_json(df),
    }



@router.get("/download")
def download_data(
    format: str = Query("csv", pattern="^(csv|json|xlsx)$")):
    df = load_data_service()

    if format == "csv":
        path = export_to_csv(df)
        return FileResponse(
            path=path,
            media_type="text/csv",
            filename="landslide_dataset.csv",
        )
    
    if format == "json":
        payload = json.dumps(export_to_json(df), indent=2).encode("utf-8")
        return StreamingResponse(
            BytesIO(payload),
            media_type="application/json",
            headers={"Content-Disposition" : "attachment; filename=landslide_dataset.json"},
        )
    
    # xlsx
    xlsx_bytes = export_to_xlsx(df)
    return StreamingResponse(
        BytesIO(xlsx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=landslide_dataset.xlsx"},
    )