import { useMemo, useState } from "react";
import { API_BASE_URL } from "../../config";
import { INITIAL_FORM } from "./constants";
import { parseErrorMessage, toRequestPayload } from "./utils";

export function usePredictForm() {
  const [form, setForm] = useState(INITIAL_FORM);
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

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setError("");
    setResult(null);
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

  return {
    form,
    submitting,
    error,
    result,
    handleChange,
    handleReset,
    handleSubmit,
  };
}
