import { GRID_SIZE, PIXEL_SIZE } from "@/constants";
import ClearButton from "./ClearButton";
import ColorPicker from "./ColorPicker";
import InfoPanel from "./InfoPanel";

interface ToolsPanelProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClearAll: () => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = ({
  currentColor,
  onColorChange,
  onClearAll,
}) => {
  return (
    <div className="space-y-4">
      <ColorPicker currentColor={currentColor} onColorChange={onColorChange} />

      <InfoPanel
        gridSize={GRID_SIZE}
        pixelSize={PIXEL_SIZE}
        currentColor={currentColor}
      />

      <ClearButton onClear={onClearAll} />
    </div>
  );
};
export default ToolsPanel;
