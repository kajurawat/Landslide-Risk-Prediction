from io import BytesIO

from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from app.api.handlers.india_landslides_handler import (
    build_download_payload,
    get_india_landslides_analytics,
    get_india_landslides_page,
)


router = APIRouter(prefix="/api/v1/india-landslides", tags=["india-landslides"])


@router.get("")
def get_india_landslides(
    q: str = Query("", max_length=200),
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
):
    return get_india_landslides_page(q, page, page_size)


@router.get("/analytics")
def get_india_landslides_analytics_data(
    top_n: int = Query(10, ge=3, le=25),
):
    return get_india_landslides_analytics(top_n)


@router.get("/download")
def download_india_landslides(
    format: str = Query("csv", pattern="^(csv|json|xlsx)$"),
    q: str = Query("", max_length=200),
):
    payload, media_type, filename = build_download_payload(q, format)
    return StreamingResponse(
        BytesIO(payload),
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
