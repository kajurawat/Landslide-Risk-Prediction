export default function PredictionResultSection({ result }) {
  if (!result) return null;

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-slate-900">
        Prediction Result
      </h2>
      <div className="mt-3 grid gap-2 text-sm text-slate-700">
        <p>
          <span className="font-medium">Best Model:</span>{" "}
          {result.best_model || "N/A"}
        </p>
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

      {result.model_predictions &&
      Object.keys(result.model_predictions).length > 0 ? (
        <div className="mt-5 overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-800">
                  Model
                </th>
                <th className="px-3 py-2 font-semibold text-slate-800">
                  Prediction
                </th>
                <th className="px-3 py-2 font-semibold text-slate-800">
                  Probability
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.model_predictions).map(
                ([modelName, prediction]) => (
                  <tr key={modelName} className="border-t border-slate-200">
                    <td className="px-3 py-2 text-slate-700">{modelName}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {prediction.landslide ? "Landslide" : "No Landslide"}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {(Number(prediction.probability) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
