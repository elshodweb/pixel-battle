"use client";

import { useCallback, useState } from "react";
import usePixelStore from "./hooks/usePixelStore";
import ToolsPanel from "./components/ToolsPanel";
import CanvasArea from "./components/CanvasArea";
import InstructionsPanel from "./components/InstructionsPanel";

const PixelEditor: React.FC = () => {
  const { pixels, currentColor, setPixel, setCurrentColor, clearAll } =
    usePixelStore();
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handlePixelClick = useCallback(
    (x: number, y: number) => {
      setPixel(x, y, currentColor);
    },
    [setPixel, currentColor]
  );

  const handleMouseMove = useCallback((x: number, y: number) => {
    setMousePosition({ x, y });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-4xl font-bold">
          <span className="text-green-400">P</span>
          <span className="text-blue-400">I</span>
          <span className="text-red-400">X</span>
          <span className="text-yellow-400">E</span>
          <span className="text-purple-400">L</span>
          <span className="text-cyan-400"> </span>
          <span className="text-pink-400">E</span>
          <span className="text-orange-400">D</span>
          <span className="text-green-400">I</span>
          <span className="text-blue-400">T</span>
          <span className="text-red-400">O</span>
          <span className="text-yellow-400">R</span>
        </div>

        <div className="bg-gray-900 border border-yellow-500 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Tools */}
          <div className="lg:col-span-2">
            <ToolsPanel
              currentColor={currentColor}
              onColorChange={setCurrentColor}
              onClearAll={clearAll}
            />
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-8">
            <CanvasArea
              pixels={pixels}
              currentColor={currentColor}
              mousePosition={mousePosition}
              onPixelClick={handlePixelClick}
              onMouseMove={handleMouseMove}
            />
          </div>

          {/* Right Panel - Instructions */}
          <div className="lg:col-span-2">
            <InstructionsPanel />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="fixed bottom-10 left-10 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
      <div className="fixed top-1/2 left-5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default PixelEditor;
