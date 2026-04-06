export default function PaginationSection({
  page,
  totalPages,
  loading,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}) {
  return (
    <footer className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev || loading}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-slate-700">
        {totalPages ? `Page ${page} of ${totalPages}` : "No pages"}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || loading}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </footer>
  );
}
