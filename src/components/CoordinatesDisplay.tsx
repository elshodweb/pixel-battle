import { memo, useMemo } from "react";
import { PIXEL_SIZE, GRID_SIZE } from "@/constants";

interface CoordinatesDisplayProps {
  mousePosition: { x: number; y: number } | null;
  pixelCoordinates: { x: number; y: number } | null;
  gridPosition: { x: number; y: number };
  zoom: number;
}

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = memo(
  ({ mousePosition, pixelCoordinates, gridPosition, zoom }) => {
    // Use pixel coordinates if available, otherwise calculate from mouse position
    const coordinates = useMemo(() => {
      let x = 0;
      let y = 0;

      if (pixelCoordinates) {
        x = pixelCoordinates.x;
        y = pixelCoordinates.y;
      } else if (mousePosition) {
        // Fallback calculation - no padding needed now
        const effectivePixelSize = PIXEL_SIZE * zoom;

        x = Math.floor((mousePosition.x - gridPosition.x) / effectivePixelSize);
        y = Math.floor((mousePosition.y - gridPosition.y) / effectivePixelSize);
      }

      // Clamp coordinates to grid bounds
      const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, x));
      const clampedY = Math.max(0, Math.min(GRID_SIZE - 1, y));

      return { x: clampedX, y: clampedY };
    }, [pixelCoordinates, mousePosition, gridPosition, zoom]);

    return (
      <div className="bg-gray-900/80 border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-300">
        {coordinates.x}, {coordinates.y}
      </div>
    );
  }
);

export default CoordinatesDisplay;
