export default function WorkflowInspector({ activeNode }) {
  return (
    <aside className="workflow-inspector rounded-[28px] border border-slate-200/70 bg-slate-950 px-5 py-6 text-slate-100 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <p className="workflow-stage-kicker text-slate-300">Focused node</p>
      <h2 className="mt-2 text-2xl font-bold text-white">{activeNode.label}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {activeNode.details}
      </p>

      <div className="mt-6 space-y-3">
        <InfoRow label="File or API" value={activeNode.sublabel} />
        <InfoRow label="Layer" value={activeNode.layer} />
        <InfoRow label="Type" value={activeNode.kind} />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Project trace
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          Frontend pages call the backend through{" "}
          <span className="font-semibold text-white">API_BASE_URL</span>.
          FastAPI routes validate requests, handlers read or write the CSV and
          model files, and the response is rendered back in React.
        </p>
      </div>
    </aside>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
