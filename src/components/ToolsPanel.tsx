import { memo, useCallback, useState } from "react";
import ColorPicker from "./ColorPicker";

interface ToolsPanelProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  credits: number;
  onCreditsChange?: (credits: number) => void;
}

const ToolsPanel: React.FC<ToolsPanelProps> = memo(
  ({ currentColor, onColorChange, credits, onCreditsChange }) => {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const handleAddCredits = useCallback(() => {
      if (onCreditsChange) {
        onCreditsChange(credits + 1);
      }
    }, [onCreditsChange, credits]);

    const handleColorPickerToggle = useCallback(() => {
      setIsColorPickerOpen((prev) => !prev);
    }, []);

    const handleColorPickerClose = useCallback(() => {
      setIsColorPickerOpen(false);
    }, []);

    return (
      <div className="fixed bottom-6 left-6 z-30">
        <div className="relative">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-orange-400 rounded-lg px-6 py-3 shadow-2xl relative">
            <div className="flex items-center">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-12 h-12 rounded-full border-2 border-orange-400 cursor-pointer relative overflow-hidden hover:border-orange-300 transition-colors"
                  style={{ backgroundColor: currentColor }}
                  onClick={handleColorPickerToggle}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>

                <div className="text-white">
                  <div className="text-lg font-bold">Color</div>
                  <div className="text-lg font-bold">selection</div>
                </div>
              </div>

              <div className="w-px bg-orange-400 mx-6 self-stretch"></div>

              <div className="flex flex-col items-center gap-1">
                <div className="text-orange-400 text-3xl font-bold">
                  ({credits})
                </div>
                <div className="text-white text-xs font-bold">CREDIT'S</div>
              </div>
            </div>

            <button
              onClick={handleAddCredits}
              className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg border-2 border-gray-800"
            >
              <span className="text-white text-sm font-bold">+</span>
            </button>
          </div>

          {isColorPickerOpen && (
            <div className="absolute bottom-full left-0 mb-4 z-40">
              <ColorPicker
                currentColor={currentColor}
                onColorChange={onColorChange}
                isOpen={isColorPickerOpen}
                onClose={handleColorPickerClose}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ToolsPanel;
