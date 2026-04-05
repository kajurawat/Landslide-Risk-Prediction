import { useMemo, useState } from "react";
import { API_BASE_URL } from "../config";

const initialForm = {
  rainfall_mm: "",
  slope_angle: "",
  soil_saturation: "",
  vegetation_cover: "",
  earthquake_activity: "",
  proximity_to_water: "",
  soil_type: "gravel",
};

function toRequestPayload(form) {
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

function parseErrorMessage(body, fallback) {
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

export default function PredictPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const isFormComplete = useMemo(() => {
    return (
      form.rainfall_mm !== "" &&
      form.slope_angle !== "" &&
      form.soil_saturation !== "" &&
      form.vegetation_cover !== "" &&
      form.earthquake_activity !== "" &&
      form.proximity_to_water !== "" &&
      form.soil_type !== ""
    );
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!isFormComplete) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = toRequestPayload(form);
      const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json",
      );
      const responseBody = isJson ? await response.json() : null;

      if (!response.ok) {
        throw new Error(
          parseErrorMessage(
            responseBody,
            `Request failed with status ${response.status}`,
          ),
        );
      }

      setResult(responseBody);
    } catch (err) {
      setError(err.message || "Prediction failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        Predict Landslide Risk
      </h1>
      <p className="mt-2 text-slate-600">
        Enter all required environmental values and run prediction.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Rainfall (mm)
          </span>
          <span className="text-xs text-slate-500">Min: 0, Max: 1000</span>
          <input
            type="number"
            step="any"
            min="0"
            max="1000"
            name="rainfall_mm"
            value={form.rainfall_mm}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Slope Angle
          </span>
          <span className="text-xs text-slate-500">Min: 0, Max: 90</span>
          <input
            type="number"
            step="any"
            min="0"
            max="90"
            name="slope_angle"
            value={form.slope_angle}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Soil Saturation
          </span>
          <span className="text-xs text-slate-500">Min: 0, Max: 1</span>
          <input
            type="number"
            step="any"
            min="0"
            max="1"
            name="soil_saturation"
            value={form.soil_saturation}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Vegetation Cover
          </span>
          <span className="text-xs text-slate-500">Min: 0, Max: 1</span>
          <input
            type="number"
            step="any"
            min="0"
            max="1"
            name="vegetation_cover"
            value={form.vegetation_cover}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Earthquake Activity
          </span>
          <span className="text-xs text-slate-500">Min: 0, Max: 10</span>
          <input
            type="number"
            step="any"
            min="0"
            max="10"
            name="earthquake_activity"
            value={form.earthquake_activity}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            Proximity to Water
          </span>
          <span className="text-xs text-slate-500">Min: 0, Max: 50</span>
          <input
            type="number"
            step="any"
            min="0"
            max="50"
            name="proximity_to_water"
            value={form.proximity_to_water}
            onChange={handleChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium text-slate-700">
            Soil Type
          </legend>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="soil_type"
                value="gravel"
                checked={form.soil_type === "gravel"}
                onChange={handleChange}
              />
              Gravel
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="soil_type"
                value="sand"
                checked={form.soil_type === "sand"}
                onChange={handleChange}
              />
              Sand
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                name="soil_type"
                value="silt"
                checked={form.soil_type === "silt"}
                onChange={handleChange}
              />
              Silt
            </label>
          </div>
        </fieldset>

        <div className="sm:col-span-2 flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Predicting..." : "Run Prediction"}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setError("");
              setResult(null);
            }}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </form>

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Prediction Result
          </h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-700">
            <p>
              <span className="font-medium">Landslide Risk:</span>{" "}
              <span
                className={
                  result.landslide
                    ? "text-red-600 font-semibold"
                    : "text-emerald-600 font-semibold"
                }
              >
                {result.landslide
                  ? "High (Landslide likely)"
                  : "Low (No landslide)"}
              </span>
            </p>
            <p>
              <span className="font-medium">Probability:</span>{" "}
              {(result.probability * 100).toFixed(2)}%
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
