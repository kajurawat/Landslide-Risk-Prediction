import PredictFormSection from "./PredictPage/PredictFormSection";
import PredictionResultSection from "./PredictPage/PredictionResultSection";
import { usePredictForm } from "./PredictPage/usePredictForm";

export default function PredictPage() {
  const {
    form,
    submitting,
    error,
    result,
    handleChange,
    handleReset,
    handleSubmit,
  } = usePredictForm();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        Predict Landslide Risk
      </h1>
      <p className="mt-2 text-slate-600">
        Enter all required environmental values and run prediction.
      </p>

      <PredictFormSection
        form={form}
        submitting={submitting}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onChange={handleChange}
      />

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <PredictionResultSection result={result} />
    </main>
  );
}
