"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { GRID_SIZE } from "@/constants";

interface SimpleCanvasProps {
  pixels: Map<string, string>;
  updateCounter: number;
  currentColor: string;
  zoom: number;
  position: { x: number; y: number };
  onPixelClick: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onMouseMove?: (
    x: number,
    y: number,
    pixelX?: number,
    pixelY?: number
  ) => void;
}

const SimpleCanvas: React.FC<SimpleCanvasProps> = ({
  pixels,
  updateCounter,
  currentColor,
  zoom,
  position,
  onPixelClick,
  onZoomChange,
  onPositionChange,
  onMouseMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
    null
  );

  // Pixel size in screen pixels
  const pixelSize = 4 * zoom;

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1f2937"; // Dark gray background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    const gridSize = GRID_SIZE * pixelSize;
    ctx.fillStyle = "#374151"; // Slightly lighter gray for grid
    ctx.fillRect(position.x, position.y, gridSize, gridSize);

    // Draw pixels
    pixels.forEach((color, key) => {
      const [x, y] = key.split("-").map(Number);
      ctx.fillStyle = color;
      ctx.fillRect(
        position.x + x * pixelSize,
        position.y + y * pixelSize,
        pixelSize,
        pixelSize
      );
    });

    // Draw grid lines if zoomed in
    if (zoom > 0.5) {
      ctx.strokeStyle = "#4b5563";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= GRID_SIZE; x++) {
        const screenX = position.x + x * pixelSize;
        ctx.beginPath();
        ctx.moveTo(screenX, position.y);
        ctx.lineTo(screenX, position.y + gridSize);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= GRID_SIZE; y++) {
        const screenY = position.y + y * pixelSize;
        ctx.beginPath();
        ctx.moveTo(position.x, screenY);
        ctx.lineTo(position.x + gridSize, screenY);
        ctx.stroke();
      }
    }

    console.log(`Canvas drawn: ${pixels.size} pixels, zoom: ${zoom}`);
  }, [pixels, position, pixelSize, zoom, updateCounter]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [draw]);

  // Convert screen coordinates to pixel coordinates
  const screenToPixel = useCallback(
    (screenX: number, screenY: number) => {
      const pixelX = Math.floor((screenX - position.x) / pixelSize);
      const pixelY = Math.floor((screenY - position.y) / pixelSize);
      return { x: pixelX, y: pixelY };
    },
    [position, pixelSize]
  );

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      if (e.button === 0) {
        // Left click - draw
        setIsDrawing(true);
        const { x: pixelX, y: pixelY } = screenToPixel(screenX, screenY);
        if (
          pixelX >= 0 &&
          pixelX < GRID_SIZE &&
          pixelY >= 0 &&
          pixelY < GRID_SIZE
        ) {
          onPixelClick(pixelX, pixelY);
        }
      } else if (e.button === 2) {
        // Right click - pan
        setIsPanning(true);
        setPanStart({ x: screenX - position.x, y: screenY - position.y });
      }
    },
    [screenToPixel, onPixelClick, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const { x: pixelX, y: pixelY } = screenToPixel(screenX, screenY);

      // Call onMouseMove callback
      if (
        onMouseMove &&
        pixelX >= 0 &&
        pixelX < GRID_SIZE &&
        pixelY >= 0 &&
        pixelY < GRID_SIZE
      ) {
        onMouseMove(screenX, screenY, pixelX, pixelY);
      }

      if (isPanning && panStart) {
        onPositionChange({
          x: screenX - panStart.x,
          y: screenY - panStart.y,
        });
      } else if (isDrawing) {
        if (
          pixelX >= 0 &&
          pixelX < GRID_SIZE &&
          pixelY >= 0 &&
          pixelY < GRID_SIZE
        ) {
          onPixelClick(pixelX, pixelY);
        }
      }
    },
    [
      screenToPixel,
      onMouseMove,
      isPanning,
      panStart,
      onPositionChange,
      isDrawing,
      onPixelClick,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setIsPanning(false);
    setPanStart(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.altKey) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5.0, zoom * zoomFactor));
        onZoomChange(newZoom);
      }
    },
    [zoom, onZoomChange]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-crosshair"
      style={{
        zIndex: 10,
        cursor: isPanning ? "grabbing" : isDrawing ? "crosshair" : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
    />
  );
};

export default SimpleCanvas;
