import { PixelData } from "@/types";
import CoordinatesDisplay from "./CoordinatesDisplay";
import PixelGrid from "./PixelGrid";
interface CanvasAreaProps {
  pixels: PixelData;
  currentColor: string;
  mousePosition: { x: number; y: number } | null;
  onPixelClick: (x: number, y: number) => void;
  onMouseMove: (x: number, y: number) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  pixels,
  currentColor,
  mousePosition,
  onPixelClick,
  onMouseMove,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <PixelGrid
        pixels={pixels}
        currentColor={currentColor}
        onPixelClick={onPixelClick}
        onMouseMove={onMouseMove}
      />

      <CoordinatesDisplay mousePosition={mousePosition} />
    </div>
  );
};
export default CanvasArea;
