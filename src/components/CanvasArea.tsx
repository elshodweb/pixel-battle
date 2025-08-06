import { PixelData } from "@/types";
import CoordinatesDisplay from "./CoordinatesDisplay";
import PixelGrid from "./PixelGrid";
interface CanvasAreaProps {
  pixels: PixelData;
  currentColor: string;
  mousePosition: { x: number; y: number } | null;
  onPixelClick: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
  gridPosition: { x: number; y: number };
  onGridPositionChange: (position: { x: number; y: number }) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  pixels,
  currentColor,
  mousePosition,
  onPixelClick,
  onMouseMove,
  gridPosition,
  onGridPositionChange,
}) => {
  return (
    <>
      <PixelGrid
        pixels={pixels}
        currentColor={currentColor}
        onPixelClick={onPixelClick}
        onMouseMove={onMouseMove}
        position={gridPosition}
        onPositionChange={onGridPositionChange}
      />

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <CoordinatesDisplay mousePosition={mousePosition} />
      </div>
    </>
  );
};

export default CanvasArea;
