import {
  PIXEL_SIZE,
  VIEWPORT_BUFFER,
  GRID_SIZE,
  SHOW_PIXEL_BORDERS,
  SHOW_GRID_BORDER,
} from "@/constants";
import { PixelData, Viewport, VisibleRange } from "@/types";
import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactElement,
  memo,
} from "react";

interface PixelGridProps {
  pixels: PixelData;
  currentColor: string;
  zoom: number;
  onPixelClick: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number, pixelX?: number, pixelY?: number) => void;
  onZoomChange: (zoom: number) => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

const PixelGrid: React.FC<PixelGridProps> = memo(
  ({
    pixels,
    currentColor,
    zoom,
    onPixelClick,
    onMouseMove,
    onZoomChange,
    position,
    onPositionChange,
  }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
      null
    );
    const [lastPosition, setLastPosition] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [viewport, setViewport] = useState<Viewport>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate effective pixel size based on zoom
    const effectivePixelSize = PIXEL_SIZE * zoom;

    // Calculate visible area based on viewport with buffer
    const visibleRange = useMemo((): VisibleRange => {
      const startX = Math.max(
        0,
        Math.floor(viewport.x / effectivePixelSize) - VIEWPORT_BUFFER
      );
      const endX = Math.min(
        GRID_SIZE,
        Math.ceil((viewport.x + viewport.width) / effectivePixelSize) +
          VIEWPORT_BUFFER
      );
      const startY = Math.max(
        0,
        Math.floor(viewport.y / effectivePixelSize) - VIEWPORT_BUFFER
      );
      const endY = Math.min(
        GRID_SIZE,
        Math.ceil((viewport.y + viewport.height) / effectivePixelSize) +
          VIEWPORT_BUFFER
      );

      return { startX, endX, startY, endY };
    }, [viewport, effectivePixelSize]);

    // Update viewport when position changes
    useEffect(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewport({
          x: -position.x,
          y: -position.y,
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    }, [position]);

    // Handle Alt+Scroll for zoom
    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        if (e.altKey) {
          e.preventDefault();

          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          const newZoom = Math.max(0.1, Math.min(5.0, zoom + delta));

          if (newZoom !== zoom) {
            // Calculate mouse position relative to grid
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate zoom center point
            const zoomCenterX = (mouseX - position.x) / zoom;
            const zoomCenterY = (mouseY - position.y) / zoom;

            // Calculate new position to keep zoom center
            const newPositionX = mouseX - zoomCenterX * newZoom;
            const newPositionY = mouseY - zoomCenterY * newZoom;

            onZoomChange(newZoom);
            onPositionChange({ x: newPositionX, y: newPositionY });
          }
        }
      },
      [zoom, position, onZoomChange, onPositionChange]
    );

    // Optimized Bresenham's line algorithm for instant drawing
    const drawLine = useCallback(
      (x0: number, y0: number, x1: number, y1: number) => {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        let currentX = x0;
        let currentY = y0;

        // Batch pixel updates for better performance
        const pixelsToUpdate: [number, number][] = [];

        while (true) {
          pixelsToUpdate.push([currentX, currentY]);
          if (currentX === x1 && currentY === y1) break;

          const e2 = 2 * err;

          if (e2 > -dy) {
            err -= dy;
            currentX += sx;
          }

          if (e2 < dx) {
            err += dx;
            currentY += sy;
          }
        }

        // Update all pixels at once
        pixelsToUpdate.forEach(([x, y]) => onPixelClick(x, y));
      },
      [onPixelClick]
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent, x: number, y: number) => {
        e.preventDefault();

        if (e.button === 2) {
          // Right click
          setIsDragging(true);
          setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          });
        } else if (e.button === 0) {
          // Left click
          setIsDrawing(true);
          setLastPosition({ x, y });
          onPixelClick(x, y);
        }
      },
      [position, onPixelClick]
    );

    const handleMouseEnter = useCallback(
      (x: number, y: number) => {
        // Calculate pixel coordinates
        const pixelX = Math.floor(
          (x * effectivePixelSize) / effectivePixelSize
        );
        const pixelY = Math.floor(
          (y * effectivePixelSize) / effectivePixelSize
        );

        onMouseMove(x, y, pixelX, pixelY);

        if (isDrawing && !isDragging) {
          if (lastPosition) {
            drawLine(lastPosition.x, lastPosition.y, x, y);
          } else {
            onPixelClick(x, y);
          }
          setLastPosition({ x, y });
        }
      },
      [
        isDrawing,
        isDragging,
        lastPosition,
        onMouseMove,
        onPixelClick,
        drawLine,
        effectivePixelSize,
      ]
    );

    const handleContainerMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (isDragging && dragStart) {
          onPositionChange({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          });
        }
      },
      [isDragging, dragStart, onPositionChange]
    );

    const handleMouseUp = useCallback(() => {
      setIsDrawing(false);
      setIsDragging(false);
      setLastPosition(null);
      setDragStart(null);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsDrawing(false);
      setLastPosition(null);
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault(); // Prevent right-click menu
    }, []);

    // Create visible pixels only - optimized for instant rendering
    const visiblePixels = useMemo(() => {
      const pixelElements: ReactElement[] = [];
      const pixelStyle = {
        width: `${effectivePixelSize}px`,
        height: `${effectivePixelSize}px`,
        borderRight: SHOW_PIXEL_BORDERS ? "1px solid #374151" : "none",
        borderBottom: SHOW_PIXEL_BORDERS ? "1px solid #374151" : "none",
        cursor: isDragging ? "grabbing" : "crosshair",
        position: "absolute" as const,
      };

      for (let y = visibleRange.startY; y < visibleRange.endY; y++) {
        for (let x = visibleRange.startX; x < visibleRange.endX; x++) {
          const key = `${x}-${y}`;
          const pixelColor = pixels[key] || "#1f2937";

          pixelElements.push(
            <div
              key={key}
              className="hover:brightness-125 pixel-element"
              style={{
                ...pixelStyle,
                backgroundColor: pixelColor,
                left: `${x * effectivePixelSize}px`,
                top: `${y * effectivePixelSize}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, x, y)}
              onMouseEnter={() => handleMouseEnter(x, y)}
            />
          );
        }
      }

      return pixelElements;
    }, [
      visibleRange,
      pixels,
      effectivePixelSize,
      isDragging,
      handleMouseDown,
      handleMouseEnter,
    ]);

    return (
      <div
        className="fixed inset-0 pointer-events-none z-10"
        ref={containerRef}
      >
        <div
          className="absolute pointer-events-auto bg-gray-800 rounded-lg border border-gray-700 shadow-2xl"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? "grabbing" : "default",
            width: `${GRID_SIZE * effectivePixelSize}px`,
            height: `${GRID_SIZE * effectivePixelSize}px`,
            overflow: "hidden",
          }}
          onMouseMove={handleContainerMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onContextMenu={handleContextMenu}
          onWheel={handleWheel}
        >
          <div
            className={`relative pixel-grid ${
              SHOW_GRID_BORDER ? "border border-gray-600 rounded" : ""
            }`}
            style={{
              width: `${GRID_SIZE * effectivePixelSize}px`,
              height: `${GRID_SIZE * effectivePixelSize}px`,
            }}
          >
            {visiblePixels}
          </div>
        </div>
      </div>
    );
  }
);

export default PixelGrid;
