export const INITIAL_FORM = {
  rainfall_mm: "",
  slope_angle: "",
  soil_saturation: "",
  vegetation_cover: "",
  earthquake_activity: "",
  proximity_to_water: "",
  soil_type: "gravel",
};

export const FORM_FIELDS = [
  {
    name: "rainfall_mm",
    label: "Rainfall (mm)",
    minHint: "Min: 50, Max: 300",
    min: "50",
    max: "300",
  },
  {
    name: "slope_angle",
    label: "Slope Angle",
    minHint: "Min: 5, Max: 60",
    min: "5",
    max: "60",
  },
  {
    name: "soil_saturation",
    label: "Soil Saturation",
    minHint: "Min: 0, Max: 1",
    min: "0",
    max: "1",
  },
  {
    name: "vegetation_cover",
    label: "Vegetation Cover",
    minHint: "Min: 0, Max: 1",
    min: "0",
    max: "1",
  },
  {
    name: "earthquake_activity",
    label: "Earthquake Activity",
    minHint: "Min: 0, Max: 6.5",
    min: "0",
    max: "6.5",
  },
  {
    name: "proximity_to_water",
    label: "Proximity to Water",
    minHint: "Min: 0, Max: 2",
    min: "0",
    max: "2",
  },
];

export const SOIL_TYPE_OPTIONS = [
  { value: "gravel", label: "Gravel" },
  { value: "sand", label: "Sand" },
  { value: "silt", label: "Silt" },
];
