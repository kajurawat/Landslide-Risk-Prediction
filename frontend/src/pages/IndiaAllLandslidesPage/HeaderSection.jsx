import { DOWNLOAD_FORMATS, PAGE_SIZE_OPTIONS } from "./constants";

export default function HeaderSection({
  searchInput,
  page,
  pageSize,
  result,
  onSearchChange,
  onPageSizeChange,
  onDownload,
}) {
  return (
    <header className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        India All Landslides
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Search and browse extracted landslide records using key India landslide
        columns without loading the full dataset into the browser.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search text in report values (e.g. Uttarakhand, susceptibility, sector)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring"
        />
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} / page
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
        <span>Total Matches: {result.total_matches}</span>
        <span>
          Page:{" "}
          {result.total_pages ? `${page} / ${result.total_pages}` : "0 / 0"}
        </span>
        <span>Active Query: {result.query || "(none)"}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Download:
        </span>
        {DOWNLOAD_FORMATS.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => onDownload(format)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium uppercase text-slate-700 hover:bg-slate-50"
          >
            {format}
          </button>
        ))}
        <span className="text-xs text-slate-500">
          Exports current search filter ({result.query || "all records"})
        </span>
      </div>
    </header>
  );
}
