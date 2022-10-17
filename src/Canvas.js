import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawing,
    resetDrawing,
    draw,
  } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <canvas
      onClick={startDrawing}
      onContextMenu={resetDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
  );
}