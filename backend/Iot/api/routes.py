from fastapi import APIRouter, HTTPException

from Iot.models.schemas import IoTIngestRequest, IoTIngestResponse
from Iot.services.prediction_service import run_iot_prediction


router = APIRouter(prefix="/api/v1/iot", tags=["iot"])


@router.post("/ingest", response_model=IoTIngestResponse)
def ingest_wifi_data(payload: IoTIngestRequest):
    try:
        result = run_iot_prediction(payload, source="wifi")
        return IoTIngestResponse(**result)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "status": 503,
                "code": "MODEL_UNAVAILABLE",
                "message": "Model artifacts are not available",
                "details": [{"field": "model", "message": str(exc)}],
            },
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "status": 422,
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": [{"field": "request", "message": str(exc)}],
            },
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "status": 500,
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected server error",
                "details": [{"field": "server", "message": str(exc)}],
            },
        ) from exc


@router.post("/ingest/serial", response_model=IoTIngestResponse)
def ingest_serial_data(payload: IoTIngestRequest):
    try:
        result = run_iot_prediction(payload, source="serial")
        return IoTIngestResponse(**result)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "status": 503,
                "code": "MODEL_UNAVAILABLE",
                "message": "Model artifacts are not available",
                "details": [{"field": "model", "message": str(exc)}],
            },
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail={
                "status": 422,
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": [{"field": "request", "message": str(exc)}],
            },
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "status": 500,
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Unexpected server error",
                "details": [{"field": "server", "message": str(exc)}],
            },
        ) from exc


@router.get("/health")
def iot_health():
    return {"status": "ok", "module": "iot", "routes": ["/ingest", "/ingest/serial", "/health"]}
