import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";

const rowsPerPage = 20;

function getDownloadUrl(format) {
  return `${API_BASE_URL}/api/v1/data/download?format=${format}`;
}

export default function DatasetPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadFormat, setDownloadFormat] = useState("csv");

  useEffect(() => {
    let mounted = true;

    async function fetchDataset() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/data`);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const body = await response.text();
          throw new Error(`Expected JSON but received: ${body.slice(0, 80)}`);
        }

        const result = await response.json();
        if (mounted) {
          setPayload(result);
          setError("");
          setCurrentPage(1);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to fetch dataset");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDataset();
    return () => {
      mounted = false;
    };
  }, []);

  const totalRows = payload?.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  const previewRows = useMemo(() => {
    if (!payload?.data) return [];
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return payload.data.slice(start, end);
  }, [payload, currentPage]);

  const handleDownload = () => {
    window.open(getDownloadUrl(downloadFormat), "_blank");
  };

  if (loading) {
    return <div className="p-6 text-slate-700">Loading dataset...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Dataset</h1>
          <p className="text-sm text-slate-600">
            Total rows: <strong>{payload?.rows ?? 0}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="xlsx">XLSX</option>
          </select>

          <button
            type="button"
            onClick={handleDownload}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Download
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-max min-w-full table-auto text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              {payload?.columns?.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-4 py-2 font-semibold text-slate-800"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-200">
                {payload.columns.map((col) => (
                  <td
                    key={col}
                    className="whitespace-nowrap px-4 py-2 text-slate-700"
                  >
                    {String(row[col] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Showing rows {startRow} to {endRow} of {totalRows}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage >= totalPages}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
