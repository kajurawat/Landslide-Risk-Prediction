export default function MapsSection({ mapItems }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-8 lg:px-12">
      <div className="grid gap-4 lg:grid-cols-3">
        {mapItems.map((map) => (
          <article
            key={map.title}
            className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm"
          >
            <h4 className="text-base font-semibold text-slate-900">
              {map.title}
            </h4>
            <p className="mt-1 text-sm text-slate-600">{map.note}</p>
            {map.link ? (
              <a href={map.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={map.image}
                  alt={map.title}
                  className="mt-3 h-72 w-full rounded-md border border-slate-200 bg-white object-contain p-1 transition hover:opacity-90 sm:h-80 lg:h-96"
                />
              </a>
            ) : (
              <img
                src={map.image}
                alt={map.title}
                className="mt-3 h-72 w-full rounded-md border border-slate-200 bg-white object-contain p-1 sm:h-80 lg:h-96"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
