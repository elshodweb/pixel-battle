import { GRID_SIZE, PIXEL_SIZE } from "@/constants";
import { PixelData } from "@/types";
import { useState } from "react";
interface PixelGridProps {
    pixels: PixelData;
    currentColor: string;
    onPixelClick: (x: number, y: number) => void;
    onMouseMove: (x: number, y: number) => void;
  }
  
  const PixelGrid: React.FC<PixelGridProps> = ({ 
    pixels, 
    currentColor, 
    onPixelClick, 
    onMouseMove 
  }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState<{x: number, y: number} | null>(null);
  
    // Bresenham's line algorithm to fill pixels between two points
    const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;
  
      let currentX = x0;
      let currentY = y0;
  
      while (true) {
        // Paint current pixel
        onPixelClick(currentX, currentY);
  
        // Check if we've reached the end point
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
    };
  
    const handleMouseDown = (x: number, y: number) => {
      setIsDrawing(true);
      setLastPosition({ x, y });
      onPixelClick(x, y);
    };
  
    const handleMouseEnter = (x: number, y: number) => {
      onMouseMove(x, y);
      
      if (isDrawing) {
        if (lastPosition) {
          // Draw line from last position to current position
          drawLine(lastPosition.x, lastPosition.y, x, y);
        } else {
          // If no last position, just paint current pixel
          onPixelClick(x, y);
        }
        setLastPosition({ x, y });
      }
    };
  
    const handleMouseUp = () => {
      setIsDrawing(false);
      setLastPosition(null);
    };
  
    const handleMouseLeave = () => {
      setIsDrawing(false);
      setLastPosition(null);
    };
  
    return (
      <div className="flex justify-center">
        <div 
          className="inline-block bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-2xl"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="grid border border-gray-600 rounded"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIXEL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${PIXEL_SIZE}px)`
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const key = `${x}-${y}`;
              const pixelColor = pixels[key] || '#1f2937';
  
              return (
                <div
                  key={key}
                  className="cursor-crosshair hover:brightness-125 transition-all duration-75"
                  style={{
                    backgroundColor: pixelColor,
                    width: `${PIXEL_SIZE}px`,
                    height: `${PIXEL_SIZE}px`,
                    borderRight: x < GRID_SIZE - 1 ? '1px solid #374151' : 'none',
                    borderBottom: y < GRID_SIZE - 1 ? '1px solid #374151' : 'none'
                  }}
                  onMouseDown={() => handleMouseDown(x, y)}
                  onMouseEnter={() => handleMouseEnter(x, y)}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
export default PixelGrid;
