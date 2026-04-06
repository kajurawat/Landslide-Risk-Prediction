import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "./constants";

export default function AnalyticsSection({
  loadingStats,
  statsError,
  analytics,
  movementChartData,
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-8 lg:px-12">
      <article className="rounded-xl border border-slate-300 bg-white p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              India Landslide Analytics
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Data Science Based Distribution View
            </h3>
          </div>
          {loadingStats ? (
            <span className="text-xs text-slate-500">Loading...</span>
          ) : null}
        </div>

        {statsError ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {statsError}
          </p>
        ) : null}

        {!statsError ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-[2.2fr_1fr]">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Core Trends (Bar Charts)
              </p>
              <div className="grid gap-3">
                <div className="rounded-md border border-slate-200 p-2">
                  <p className="mb-1 text-xs font-semibold text-slate-600">
                    Top States
                  </p>
                  <div className="h-56 w-full">
                    <ResponsiveContainer>
                      <BarChart
                        data={analytics.top_states}
                        margin={{ top: 8, right: 8, left: 4, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-25}
                          textAnchor="end"
                          interval={0}
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-2">
                  <p className="mb-1 text-xs font-semibold text-slate-600">
                    Material Involved
                  </p>
                  <div className="h-56 w-full">
                    <ResponsiveContainer>
                      <BarChart
                        data={analytics.top_materials}
                        margin={{ top: 8, right: 8, left: 4, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-25}
                          textAnchor="end"
                          interval={0}
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#14b8a6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-2">
                  <p className="mb-1 text-xs font-semibold text-slate-600">
                    Initiation Year Trend
                  </p>
                  <div className="h-56 w-full">
                    <ResponsiveContainer>
                      <BarChart
                        data={analytics.year_distribution}
                        margin={{ top: 8, right: 8, left: 4, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Movement Type Distribution
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={movementChartData}
                      dataKey="count"
                      nameKey="displayName"
                      outerRadius={105}
                      label={({ name, percent }) =>
                        `${name} ${(Number(percent) * 100).toFixed(0)}%`
                      }
                    >
                      {movementChartData.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _key, payload) => [
                        `${value} records`,
                        payload?.payload?.displayName || payload?.name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-2">
                {movementChartData.map((item, index) => (
                  <div
                    key={`legend-${item.name}-${index}`}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <span className="font-semibold text-slate-800">
                        {item.displayName}
                      </span>
                      <span className="text-slate-500">
                        ({item.share.toFixed(1)}%)
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
