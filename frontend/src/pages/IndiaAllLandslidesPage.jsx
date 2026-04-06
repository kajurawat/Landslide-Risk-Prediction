import HeaderSection from "./IndiaAllLandslidesPage/HeaderSection";
import PaginationSection from "./IndiaAllLandslidesPage/PaginationSection";
import RecordsTableSection from "./IndiaAllLandslidesPage/RecordsTableSection";
import { useIndiaAllLandslides } from "./IndiaAllLandslidesPage/useIndiaAllLandslides";

export default function IndiaAllLandslidesPage() {
  const {
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
  } = useIndiaAllLandslides();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
      <HeaderSection
        searchInput={searchInput}
        page={page}
        pageSize={pageSize}
        result={result}
        onSearchChange={setSearchInput}
        onPageSizeChange={updatePageSize}
        onDownload={triggerDownload}
      />

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <RecordsTableSection result={result} loading={loading} />

      <PaginationSection
        page={page}
        totalPages={result.total_pages}
        loading={loading}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrev={() => setPage((prev) => Math.max(1, prev - 1))}
        onNext={() => setPage((prev) => prev + 1)}
      />
    </main>
  );
}
