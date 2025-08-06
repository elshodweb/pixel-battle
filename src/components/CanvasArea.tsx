import { memo } from "react";
import { PixelData } from "@/types";
import CoordinatesDisplay from "./CoordinatesDisplay";
import PixelGrid from "./PixelGrid";

interface CanvasAreaProps {
  pixels: PixelData;
  currentColor: string;
  zoom: number;
  mousePosition: { x: number; y: number } | null;
  pixelCoordinates: { x: number; y: number } | null;
  onPixelClick: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number, pixelX?: number, pixelY?: number) => void;
  onZoomChange: (zoom: number) => void;
  gridPosition: { x: number; y: number };
  onGridPositionChange: (position: { x: number; y: number }) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = memo(
  ({
    pixels,
    currentColor,
    zoom,
    mousePosition,
    pixelCoordinates,
    onPixelClick,
    onMouseMove,
    onZoomChange,
    gridPosition,
    onGridPositionChange,
  }) => {
    return (
      <>
        <PixelGrid
          pixels={pixels}
          currentColor={currentColor}
          zoom={zoom}
          onPixelClick={onPixelClick}
          onMouseMove={onMouseMove}
          onZoomChange={onZoomChange}
          position={gridPosition}
          onPositionChange={onGridPositionChange}
        />

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <CoordinatesDisplay
            mousePosition={mousePosition}
            pixelCoordinates={pixelCoordinates}
            gridPosition={gridPosition}
            zoom={zoom}
          />
        </div>
      </>
    );
  }
);

export default CanvasArea;
