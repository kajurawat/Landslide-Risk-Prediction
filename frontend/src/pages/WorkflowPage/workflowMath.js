export function center(node) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

export function routePath(fromNode, toNode) {
  const a = center(fromNode);
  const b = center(toNode);
  const midX = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
}

export function buildWorkflowStats(nodes, edges) {
  return {
    totalEdges: edges.length,
    frontendNodes: nodes.filter((node) => node.layer === "frontend").length,
    backendNodes: nodes.filter((node) => node.layer === "backend").length,
    storageNodes: nodes.filter((node) => node.layer === "storage").length,
    routeNodes: nodes.filter((node) => node.kind === "route").length,
  };
}
