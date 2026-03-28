from datetime import datetime

from pydantic import BaseModel, Field


class IoTIngestRequest(BaseModel):
    # Device identifier from Arduino/ESP board.
    device_id: str = Field(..., min_length=1, max_length=100)
    # Sensor and engineered features for the model.
    rainfall_mm: float = Field(..., ge=0.0, le=1000.0)
    slope_angle: float = Field(..., ge=0.0, le=90.0)
    soil_saturation: float = Field(..., ge=0.0, le=1.0)
    vegetation_cover: float = Field(..., ge=0.0, le=1.0)
    earthquake_activity: float = Field(..., ge=0.0, le=10.0)
    proximity_to_water: float = Field(..., ge=0.0, le=50.0)
    soil_type_gravel: int = Field(..., ge=0, le=1)
    soil_type_sand: int = Field(..., ge=0, le=1)
    soil_type_silt: int = Field(..., ge=0, le=1)


class IoTIngestResponse(BaseModel):
    # Echo input metadata and prediction output.
    device_id: str
    landslide: bool
    probability: float = Field(..., ge=0.0, le=1.0)
    source: str
    received_at_utc: datetime
