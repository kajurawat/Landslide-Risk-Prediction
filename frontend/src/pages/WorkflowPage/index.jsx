import { useEffect, useRef, useState } from "react";
import WorkflowCanvas from "./WorkflowCanvas";
import { edges, nodes } from "./workflowData";

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1;
const ZOOM_STEP = 0.02;
const DEFAULT_ZOOM = 0.4;
const NODE_GAP = 18;
const MAX_LAYOUT_PASSES = 50;

function isOverlapping(a, b) {
  return (
    a.x < b.x + b.w + NODE_GAP &&
    a.x + a.w + NODE_GAP > b.x &&
    a.y < b.y + b.h + NODE_GAP &&
    a.y + a.h + NODE_GAP > b.y
  );
}

function normalizeInitialLayout(rawNodes) {
  const arranged = rawNodes.map((node) => ({ ...node }));

  for (let pass = 0; pass < MAX_LAYOUT_PASSES; pass += 1) {
    let moved = false;

    for (let i = 0; i < arranged.length; i += 1) {
      for (let j = i + 1; j < arranged.length; j += 1) {
        const a = arranged[i];
        const b = arranged[j];

        if (!isOverlapping(a, b)) {
          continue;
        }

        const pushX = a.x + a.w + NODE_GAP - b.x;
        const pushY = a.y + a.h + NODE_GAP - b.y;

        if (pushX > 0 && pushX <= pushY) {
          b.x += pushX;
        } else if (pushY > 0) {
          b.y += pushY;
        }

        moved = true;
      }
    }

    if (!moved) {
      break;
    }
  }

  return arranged;
}

export default function WorkflowPage() {
  const [layoutNodes, setLayoutNodes] = useState(() =>
    normalizeInitialLayout(nodes),
  );
  const [activeId, setActiveId] = useState("app");
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 16, y: 16 });
  const dragRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) {
      return;
    }

    const rect = toolbar.getBoundingClientRect();
    setToolbarPosition({
      x: 16,
      y: Math.max(16, window.innerHeight - rect.height - 16),
    });
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const dragState = dragRef.current;
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      if (dragState.type === "toolbar") {
        const nextX = dragState.originX + (event.clientX - dragState.startX);
        const nextY = dragState.originY + (event.clientY - dragState.startY);
        const maxX = Math.max(16, window.innerWidth - dragState.width - 16);
        const maxY = Math.max(16, window.innerHeight - dragState.height - 16);

        setToolbarPosition({
          x: Math.min(Math.max(0, nextX), maxX),
          y: Math.min(Math.max(0, nextY), maxY),
        });
        return;
      }

      const deltaX = (event.clientX - dragState.startX) / zoom;
      const deltaY = (event.clientY - dragState.startY) / zoom;

      setLayoutNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === dragState.nodeId
            ? {
                ...node,
                x: Math.max(0, dragState.originX + deltaX),
                y: Math.max(0, dragState.originY + deltaY),
              }
            : node,
        ),
      );
    };

    const endDrag = (event) => {
      const dragState = dragRef.current;
      if (!dragState || event.pointerId !== dragState.pointerId) {
        return;
      }

      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [zoom]);

  const handleNodePointerDown = (event) => {
    const nodeId = event.currentTarget.dataset.workflowNode;
    const node = layoutNodes.find((item) => item.id === nodeId);

    if (!node) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      nodeId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: node.x,
      originY: node.y,
    };
    setActiveId(nodeId);
  };

  const handleToolbarPointerDown = (event) => {
    if (event.target.closest("button, input, label")) {
      return;
    }

    const toolbar = toolbarRef.current;
    if (!toolbar) {
      return;
    }

    event.preventDefault();
    toolbar.setPointerCapture(event.pointerId);

    const rect = toolbar.getBoundingClientRect();
    dragRef.current = {
      type: "toolbar",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: toolbarPosition.x,
      originY: toolbarPosition.y,
      width: rect.width,
      height: rect.height,
    };
  };

  return (
    <main className="workflow-page h-screen overflow-hidden">
      <div
        ref={toolbarRef}
        className="absolute z-20 flex items-center gap-3 rounded-full border border-slate-300 bg-white/90 px-4 py-3 shadow-lg backdrop-blur"
        style={{
          left: `${toolbarPosition.x}px`,
          top: `${toolbarPosition.y}px`,
        }}
        onPointerDown={handleToolbarPointerDown}
      >
        <div className="cursor-move rounded-full border border-dashed border-slate-300 px-3 py-1 text-sm font-semibold text-slate-500 select-none">
          Drag
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-900 hover:text-white"
          onClick={() =>
            setZoom((current) => Math.max(ZOOM_MIN, current - ZOOM_STEP))
          }
        >
          Zoom out
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-900 hover:text-white"
          onClick={() =>
            setZoom((current) => Math.min(ZOOM_MAX, current + ZOOM_STEP))
          }
        >
          Zoom in
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-900 hover:text-white"
          onClick={() => setZoom(DEFAULT_ZOOM)}
        >
          Reset
        </button>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
          <input
            aria-label="Workflow zoom"
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={ZOOM_STEP}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <span className="min-w-14 text-right text-sm font-semibold text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
      <WorkflowCanvas
        nodes={layoutNodes}
        edges={edges}
        activeId={activeId}
        setActiveId={setActiveId}
        onNodePointerDown={handleNodePointerDown}
        zoom={zoom}
      />
    </main>
  );
}
