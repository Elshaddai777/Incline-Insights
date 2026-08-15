import { useEffect, useRef, useState } from "react";
import "./DrawingModal.css";

const DRAW_COLORS = ["#241f19", "#b0402f", "#c9760b", "#1f8a4c", "#2f6fb0", "#6a3fb0"];
const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 440;

interface DrawingModalProps {
  open: boolean;
  onClose: () => void;
  onInsert: (dataUrl: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export function DrawingModal({ open, onClose, onInsert }: DrawingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const [color, setColor] = useState(DRAW_COLORS[0]);
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setTool("pen");
  }, [open]);

  if (!open) return null;

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const point = getPoint(e);
    lastPointRef.current = point;
    e.currentTarget.setPointerCapture(e.pointerId);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.arc(point.x, point.y, (tool === "eraser" ? size * 3 : size) / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getPoint(e);
    const last = lastPointRef.current ?? point;

    ctx.lineWidth = tool === "eraser" ? size * 3 : size;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPointRef.current = point;
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleInsert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onInsert(canvas.toDataURL("image/png"));
    onClose();
  };

  return (
    <div className="drawing-backdrop" onClick={onClose}>
      <div
        className="drawing-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Drawing canvas"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawing-header">
          <h2>Draw something</h2>
          <button type="button" className="drawing-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="drawing-toolbar">
          <div className="drawing-swatches">
            {DRAW_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`drawing-swatch${tool === "pen" && color === c ? " is-active" : ""}`}
                style={{ background: c }}
                aria-label={`Color ${c}`}
                onClick={() => {
                  setColor(c);
                  setTool("pen");
                }}
              />
            ))}
            <input
              type="color"
              className="drawing-color-picker"
              value={color}
              aria-label="Custom color"
              onChange={(e) => {
                setColor(e.target.value);
                setTool("pen");
              }}
            />
          </div>

          <label className="drawing-size">
            Size
            <input
              type="range"
              min={1}
              max={24}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </label>

          <button
            type="button"
            className={`drawing-tool-btn${tool === "eraser" ? " is-active" : ""}`}
            onClick={() => setTool("eraser")}
          >
            Eraser
          </button>
          <button type="button" className="drawing-tool-btn" onClick={handleClear}>
            Clear
          </button>
        </div>

        <div className="drawing-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="drawing-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>

        <div className="drawing-actions">
          <button type="button" className="drawing-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="drawing-btn-primary" onClick={handleInsert}>
            Insert drawing
          </button>
        </div>
      </div>
    </div>
  );
}
