import { FORM_FIELDS, SOIL_TYPE_OPTIONS } from "./constants";

export default function PredictFormSection({
  form,
  submitting,
  onSubmit,
  onReset,
  onChange,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2"
    >
      {FORM_FIELDS.map((field) => (
        <label key={field.name} className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700">
            {field.label}
          </span>
          <span className="text-xs text-slate-500">{field.minHint}</span>
          <input
            type="number"
            step="any"
            min={field.min}
            max={field.max}
            name={field.name}
            value={form[field.name]}
            onChange={onChange}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>
      ))}

      <fieldset className="sm:col-span-2">
        <legend className="mb-2 text-sm font-medium text-slate-700">
          Soil Type
        </legend>
        <div className="flex flex-wrap gap-4">
          {SOIL_TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="inline-flex items-center gap-2 text-sm text-slate-700"
            >
              <input
                type="radio"
                name="soil_type"
                value={option.value}
                checked={form.soil_type === option.value}
                onChange={onChange}
              />
              {option.label}
            </label>
          ))}
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
          onClick={onReset}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
