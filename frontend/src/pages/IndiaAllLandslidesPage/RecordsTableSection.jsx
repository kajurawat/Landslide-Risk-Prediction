export default function RecordsTableSection({ result, loading }) {
  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              {result.columns.map((column) => (
                <th
                  key={column}
                  className="px-3 py-2 text-left font-semibold text-slate-800"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={result.columns.length}
                  className="px-3 py-6 text-center text-slate-500"
                >
                  Loading records...
                </td>
              </tr>
            ) : result.rows.length === 0 ? (
              <tr>
                <td
                  colSpan={result.columns.length}
                  className="px-3 py-6 text-center text-slate-500"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              result.rows.map((item, index) => (
                <tr
                  key={`${item["S.No"] || "row"}-${index}`}
                  className="border-t border-slate-200"
                >
                  {result.columns.map((column) => (
                    <td key={column} className="px-3 py-2 text-slate-700">
                      {item[column]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
