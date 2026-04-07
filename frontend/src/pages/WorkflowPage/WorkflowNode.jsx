export default function WorkflowNode({
  node,
  activeId,
  setActiveId,
  onPointerDown,
}) {
  const isActive = activeId === node.id;
  const className = [
    "workflow-node",
    `workflow-node-${node.kind}`,
    `workflow-layer-${node.layer}`,
    isActive ? "workflow-node-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      data-workflow-node={node.id}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.w}px`,
        height: `${node.h}px`,
      }}
      onPointerDown={onPointerDown}
      onMouseEnter={() => setActiveId(node.id)}
      onFocus={() => setActiveId(node.id)}
      onClick={() => setActiveId(node.id)}
    >
      <span className="workflow-node-label">{node.label}</span>
      {node.sublabel ? (
        <span className="workflow-node-sublabel">{node.sublabel}</span>
      ) : null}
    </button>
  );
}
