from datetime import datetime, timezone

from app.api.handlers.predict_handler import predict_landslide_service
from app.api.schemas.data_schema import PredictRequest
from Iot.models.schemas import IoTIngestRequest


def build_predict_request(payload: IoTIngestRequest) -> PredictRequest:
    """Map IoT payload to existing model request schema."""
    return PredictRequest(
        rainfall_mm=payload.rainfall_mm,
        slope_angle=payload.slope_angle,
        soil_saturation=payload.soil_saturation,
        vegetation_cover=payload.vegetation_cover,
        earthquake_activity=payload.earthquake_activity,
        proximity_to_water=payload.proximity_to_water,
        soil_type_gravel=payload.soil_type_gravel,
        soil_type_sand=payload.soil_type_sand,
        soil_type_silt=payload.soil_type_silt,
    )


def run_iot_prediction(payload: IoTIngestRequest, source: str) -> dict:
    """Execute shared prediction path and return IoT response payload."""
    model_payload = build_predict_request(payload)
    prediction = predict_landslide_service(model_payload)

    return {
        "device_id": payload.device_id,
        "landslide": bool(prediction["landslide"]),
        "probability": float(prediction["probability"]),
        "source": source,
        "received_at_utc": datetime.now(timezone.utc),
    }
