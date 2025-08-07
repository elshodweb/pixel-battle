import { memo } from "react";
import SimpleCanvas from "./SimpleCanvas";
import CoordinatesDisplay from "./CoordinatesDisplay";

interface CanvasAreaProps {
  pixels: Map<string, string>;
  updateCounter: number;
  currentColor: string;
  zoom: number;
  position: { x: number; y: number };
  mousePosition: { x: number; y: number } | null;
  pixelCoordinates: { x: number; y: number } | null;
  onPixelClick: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onMouseMove: (x: number, y: number, pixelX?: number, pixelY?: number) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = memo(
  ({
    pixels,
    updateCounter,
    currentColor,
    zoom,
    position,
    mousePosition,
    pixelCoordinates,
    onPixelClick,
    onZoomChange,
    onPositionChange,
    onMouseMove,
  }) => {
    return (
      <>
        <SimpleCanvas
          pixels={pixels}
          updateCounter={updateCounter}
          currentColor={currentColor}
          zoom={zoom}
          position={position}
          onPixelClick={onPixelClick}
          onZoomChange={onZoomChange}
          onPositionChange={onPositionChange}
          onMouseMove={onMouseMove}
        />

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <CoordinatesDisplay
            mousePosition={mousePosition}
            pixelCoordinates={pixelCoordinates}
            gridPosition={position}
            zoom={zoom}
          />
        </div>
      </>
    );
  }
);

export default CanvasArea;
