export default function StatsSection({ derivedStats }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-8 lg:px-12">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="portal-stat-card rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Training Models
          </p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {derivedStats.modelCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {derivedStats.modelNames.join(" | ")}
          </p>
        </article>

        <article className="portal-stat-card rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Training Data Rows
          </p>
          <p className="mt-1 text-3xl font-bold text-sky-700">
            {derivedStats.trainingRows}
          </p>
        </article>

        <article className="portal-stat-card rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            India Landslide Records
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">
            {derivedStats.indiaLandslideRecords}
          </p>
        </article>

        <article className="portal-stat-card rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Landslide Rows (Training)
          </p>
          <p className="mt-1 text-3xl font-bold text-orange-700">
            {derivedStats.trainingLandslideRows}
          </p>
        </article>
      </div>
    </section>
  );
}
