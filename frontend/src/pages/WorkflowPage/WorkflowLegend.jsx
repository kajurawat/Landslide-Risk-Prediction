export default function WorkflowLegend() {
  return (
    <div className="workflow-legend hidden items-center gap-3 md:flex">
      <LegendTag tone="terminal" label="entry" />
      <LegendTag tone="page" label="page" />
      <LegendTag tone="hook" label="hook" />
      <LegendTag tone="route" label="route" />
      <LegendTag tone="handler" label="handler" />
      <LegendTag tone="file" label="file" />
    </div>
  );
}

function LegendTag({ tone, label }) {
  return (
    <span className={`workflow-legend-tag workflow-legend-${tone}`}>
      {label}
    </span>
  );
}
