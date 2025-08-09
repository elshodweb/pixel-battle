"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { GRID_WIDTH, GRID_HEIGHT } from "@/constants";

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
  const [lastPixel, setLastPixel] = useState<{ x: number; y: number } | null>(
    null
  );

  const pixelSize = 4 * zoom;

  // Функция для рисования линии между двумя пикселями (алгоритм Bresenham)
  const drawLine = useCallback(
    (x0: number, y0: number, x1: number, y1: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      let x = x0;
      let y = y0;

      while (true) {
        // Рисуем текущий пиксель
        if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
          onPixelClick(x, y);
        }

        // Проверяем, достигли ли конечной точки
        if (x === x1 && y === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
    },
    [onPixelClick]
  );

  // Отрисовка канваса
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#100D20";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = GRID_WIDTH * pixelSize;
    const canvasHeight = GRID_HEIGHT * pixelSize;

    // Тень для области рисования
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;

    ctx.fillStyle = "#1A1528";
    ctx.fillRect(position.x, position.y, canvasWidth, canvasHeight);

    // Убираем тень для бордера
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Бордер вокруг области рисования
    ctx.strokeStyle = "#2A2535";
    ctx.lineWidth = 2;
    ctx.strokeRect(position.x, position.y, canvasWidth, canvasHeight);

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
  }, [pixels, position, pixelSize, zoom, updateCounter]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

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
        setLastPixel({ x: pixelX, y: pixelY });
        if (
          pixelX >= 0 &&
          pixelX < GRID_WIDTH &&
          pixelY >= 0 &&
          pixelY < GRID_HEIGHT
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
        pixelX < GRID_WIDTH &&
        pixelY >= 0 &&
        pixelY < GRID_HEIGHT
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
          pixelX < GRID_WIDTH &&
          pixelY >= 0 &&
          pixelY < GRID_HEIGHT
        ) {
          // Если есть предыдущая позиция, рисуем линию между точками
          if (lastPixel && (lastPixel.x !== pixelX || lastPixel.y !== pixelY)) {
            drawLine(lastPixel.x, lastPixel.y, pixelX, pixelY);
          } else {
            onPixelClick(pixelX, pixelY);
          }
          setLastPixel({ x: pixelX, y: pixelY });
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
      lastPixel,
      drawLine,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setIsPanning(false);
    setPanStart(null);
    setLastPixel(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.altKey) {
        // Используем stopPropagation вместо preventDefault для пассивных событий
        e.stopPropagation();

        // Получаем текущую позицию мыши относительно канваса
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Применяем зум
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5.0, zoom * zoomFactor));

        // Вычисляем позицию мыши в координатах канваса (до зума)
        const currentPixelSize = 4 * zoom;
        const newPixelSize = 4 * newZoom;

        const canvasMouseX = (mouseX - position.x) / currentPixelSize;
        const canvasMouseY = (mouseY - position.y) / currentPixelSize;

        // Вычисляем новую позицию канваса, чтобы сохранить точку под мышью
       

        const newPosition = {
          x: mouseX - canvasMouseX * newPixelSize,
          y: mouseY - canvasMouseY * newPixelSize,
        };

        // Применяем изменения
        onZoomChange(newZoom);
        onPositionChange(newPosition);
      }
    },
    [zoom, position, onZoomChange, onPositionChange]
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
