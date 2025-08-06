import { memo, useCallback } from "react";
import ColorPicker from "./ColorPicker";
import ClearButton from "./ClearButton";

interface ToolsPanelProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClearAll: () => void;
  credits: number;
  onCreditsChange?: (credits: number) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = memo(
  ({ currentColor, onColorChange, onClearAll, credits, onCreditsChange }) => {
    const handleAddCredits = useCallback(() => {
      if (onCreditsChange) {
        onCreditsChange(credits + 1);
      }
    }, [onCreditsChange, credits]);

    return (
      <div className="fixed bottom-6 left-6 z-30">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-2xl">
          <div className="space-y-4">
            {/* Color Picker */}
            <ColorPicker
              currentColor={currentColor}
              onColorChange={onColorChange}
            />

            {/* Credits */}
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{credits}</span>
              </div>
              <span className="text-sm text-gray-300">
                ({credits}) CREDIT'S
              </span>
              <button
                onClick={handleAddCredits}
                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <span className="text-white text-xs font-bold">+</span>
              </button>
            </div>

            {/* Clear Button */}
            <ClearButton onClear={onClearAll} />
          </div>
        </div>
      </div>
    );
  }
);

export default ToolsPanel;
