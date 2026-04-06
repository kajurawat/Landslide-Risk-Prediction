from typing import Any

from pydantic import BaseModel, Field, field_validator, model_validator

class DataResponse(BaseModel):
    rows: int
    columns: list[str]
    data: list[dict[str, Any]]


class PredictRequest(BaseModel):
    rainfall_mm: float = Field(..., ge=50.0, le=300.0)
    slope_angle: float = Field(..., ge=5.0, le=60.0)
    soil_saturation: float = Field(..., ge=0.0, le=1.0)
    vegetation_cover: float = Field(..., ge=0.0, le=1.0)
    earthquake_activity: float = Field(..., ge=0.0, le=6.5)
    proximity_to_water: float = Field(..., ge=0.0, le=2.0)
    soil_type_gravel: int = Field(..., ge=0, le=1)
    soil_type_sand: int = Field(..., ge=0, le=1)
    soil_type_silt: int = Field(..., ge=0, le=1)

    @field_validator(
        "rainfall_mm",
        "slope_angle",
        "soil_saturation",
        "vegetation_cover",
        "earthquake_activity",
        "proximity_to_water",
        "soil_type_gravel",
        "soil_type_sand",
        "soil_type_silt",
        mode="before",
    )
    @classmethod
    def require_non_empty(cls, value: Any, info):
        if value is None:
            raise ValueError(f"{info.field_name} field is required")
        if isinstance(value, str) and value.strip() == "":
            raise ValueError(f"{info.field_name} field is required")
        return value

    @model_validator(mode="after")
    def validate_soil_type_one_hot(self):
        one_hot_sum = self.soil_type_gravel + self.soil_type_sand + self.soil_type_silt
        if one_hot_sum != 1:
            raise ValueError(
                "soil_type_gravel, soil_type_sand, and soil_type_silt must be one-hot encoded (sum must be 1)"
            )
        return self


class PredictResponse(BaseModel):
    landslide: bool
    probability: float = Field(..., ge=0.0, le=1.0)
    best_model: str | None = None
    model_predictions: dict[str, dict[str, float | bool]] = Field(default_factory=dict)


class ErrorDetail(BaseModel):
    field: str
    message: str


class ErrorResponse(BaseModel):
    status: int
    code: str
    message: str
    details: list[ErrorDetail] = Field(default_factory=list)


class RetrainResponse(BaseModel):
    status: str
    message: str
    rows_original: int = Field(..., ge=0)
    rows_requests: int = Field(..., ge=0)
    rows_combined: int = Field(..., ge=1)
    best_model: str
    best_auc: float = Field(..., ge=0.0, le=1.0)
    best_accuracy: float = Field(..., ge=0.0, le=1.0)

