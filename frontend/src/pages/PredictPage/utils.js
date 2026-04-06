export function toRequestPayload(form) {
  return {
    rainfall_mm: Number(form.rainfall_mm),
    slope_angle: Number(form.slope_angle),
    soil_saturation: Number(form.soil_saturation),
    vegetation_cover: Number(form.vegetation_cover),
    earthquake_activity: Number(form.earthquake_activity),
    proximity_to_water: Number(form.proximity_to_water),
    soil_type_gravel: form.soil_type === "gravel" ? 1 : 0,
    soil_type_sand: form.soil_type === "sand" ? 1 : 0,
    soil_type_silt: form.soil_type === "silt" ? 1 : 0,
  };
}

export function parseErrorMessage(body, fallback) {
  if (!body) return fallback;

  if (typeof body.detail === "string") return body.detail;

  if (body.detail && typeof body.detail === "object") {
    if (Array.isArray(body.detail.details) && body.detail.details.length > 0) {
      return body.detail.details.map((item) => item.message).join(" | ");
    }
    if (body.detail.message) return body.detail.message;
  }

  if (body.message) return body.message;
  return fallback;
}
