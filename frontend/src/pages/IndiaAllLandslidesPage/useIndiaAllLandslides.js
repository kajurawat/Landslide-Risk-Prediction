import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config";
import {
  DEFAULT_PAGE_SIZE,
  IMPORTANT_COLUMNS,
  INITIAL_RESULT,
} from "./constants";

export function useIndiaAllLandslides() {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(INITIAL_RESULT);

  useEffect(() => {
    const handle = setTimeout(() => {
      setQuery(searchInput.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    async function fetchRows() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          q: query,
          page: String(page),
          page_size: String(pageSize),
        });

        const response = await fetch(
          `${API_BASE_URL}/api/v1/india-landslides?${params.toString()}`,
        );

        const isJson = (response.headers.get("content-type") || "").includes(
          "application/json",
        );
        const body = isJson ? await response.json() : null;

        if (!response.ok) {
          throw new Error(
            body?.detail || `Request failed with status ${response.status}`,
          );
        }

        if (!cancelled) {
          setResult({
            query: body?.query ?? "",
            page: body?.page ?? page,
            page_size: body?.page_size ?? pageSize,
            total_matches: body?.total_matches ?? 0,
            total_pages: body?.total_pages ?? 0,
            columns:
              Array.isArray(body?.columns) && body.columns.length
                ? body.columns
                : IMPORTANT_COLUMNS,
            rows: Array.isArray(body?.rows) ? body.rows : [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load report data");
          setResult((prev) => ({ ...prev, rows: [] }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRows();
    return () => {
      cancelled = true;
    };
  }, [query, page, pageSize]);

  const canGoPrev = useMemo(() => page > 1, [page]);
  const canGoNext = useMemo(
    () => result.total_pages > 0 && page < result.total_pages,
    [page, result.total_pages],
  );

  const triggerDownload = (format) => {
    const params = new URLSearchParams({
      format,
      q: result.query || query,
    });
    const url = `${API_BASE_URL}/api/v1/india-landslides/download?${params.toString()}`;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const updatePageSize = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return {
    searchInput,
    page,
    pageSize,
    loading,
    error,
    result,
    canGoPrev,
    canGoNext,
    setSearchInput,
    setPage,
    updatePageSize,
    triggerDownload,
  };
}
