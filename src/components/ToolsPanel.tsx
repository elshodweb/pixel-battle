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
    <div className="fixed bottom-6 left-6 space-y-4 z-30 max-w-xs">
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
