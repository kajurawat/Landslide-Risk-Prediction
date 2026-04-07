import WorkflowNode from "./WorkflowNode";
import { center, routePath } from "./workflowMath";

export default function WorkflowCanvas({
  nodes,
  edges,
  activeId,
  setActiveId,
  onNodePointerDown,
  zoom = 1,
}) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const boardWidth = 3840;
  const boardHeight = 1600;
  const boardStyle = {
    width: `${boardWidth * zoom}px`,
    height: `${boardHeight * zoom}px`,
  };
  const edgeRenderData = edges
    .map((edge) => {
      const fromNode = nodeMap[edge.from];
      const toNode = nodeMap[edge.to];

      if (!fromNode || !toNode) {
        return null;
      }

      const isRelated = edge.from === activeId || edge.to === activeId;
      const fromCenter = center(fromNode);
      const toCenter = center(toNode);

      return {
        edge,
        isRelated,
        fromCenter,
        toCenter,
        path: routePath(fromNode, toNode),
      };
    })
    .filter(Boolean);

  return (
    <div className="workflow-canvas-wrap h-full w-full overflow-auto">
      <div className="relative" style={boardStyle}>
        <div
          className="workflow-canvas relative"
          style={{
            width: `${boardWidth}px`,
            height: `${boardHeight}px`,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <svg
            className="workflow-connectors"
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="workflow-arrow"
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="6"
                orient="auto"
              >
                <path d="M 0 0 L 12 6 L 0 12 z" fill="context-stroke" />
              </marker>
            </defs>

            {edgeRenderData.map(({ edge, isRelated, path }) => {
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={path}
                    className={[
                      "workflow-edge",
                      edge.dashed ? "workflow-edge-dashed" : "",
                      isRelated
                        ? "workflow-edge-active"
                        : "workflow-edge-muted",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    markerEnd="url(#workflow-arrow)"
                  />
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <WorkflowNode
              key={node.id}
              node={node}
              activeId={activeId}
              setActiveId={setActiveId}
              onPointerDown={onNodePointerDown}
            />
          ))}

          <svg
            className="workflow-connector-labels"
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
            aria-hidden="true"
          >
            {edgeRenderData.map(({ edge, isRelated, fromCenter, toCenter }) =>
              edge.label ? (
                <text
                  key={`label-${edge.from}-${edge.to}`}
                  className={[
                    "workflow-edge-label",
                    isRelated
                      ? "workflow-edge-label-active"
                      : "workflow-edge-label-muted",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  x={(fromCenter.x + toCenter.x) / 2}
                  y={(fromCenter.y + toCenter.y) / 2 - 8}
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              ) : null,
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
