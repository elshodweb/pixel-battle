"use client";

import { useCallback, useEffect, useState } from "react";
import usePixelStore from "./hooks/usePixelStore";
import ToolsPanel from "./components/ToolsPanel";
import CanvasArea from "./components/CanvasArea";
import InstructionsPanel from "./components/InstructionsPanel";
import { GRID_SIZE, PIXEL_SIZE } from "./constants";
const PixelEditor: React.FC = () => {
  const { pixels, currentColor, setPixel, setCurrentColor, clearAll } =
    usePixelStore();
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [gridPosition, setGridPosition] = useState<{ x: number; y: number }>({
    x: 400,
    y: 200,
  });

  // Set initial position after component mounts (client-side only)
  useEffect(() => {
    const centerX = window.innerWidth / 2 - (GRID_SIZE * PIXEL_SIZE) / 2;
    const centerY = window.innerHeight / 2 - (GRID_SIZE * PIXEL_SIZE) / 2;
    setGridPosition({ x: centerX, y: centerY });
  }, []);

  const handlePixelClick = useCallback(
    (x: number, y: number) => {
      setPixel(x, y, currentColor);
    },
    [setPixel, currentColor]
  );

  const handleMouseMove = useCallback((x: number, y: number) => {
    setMousePosition({ x, y });
  }, []);

  const handleGridPositionChange = useCallback(
    (position: { x: number; y: number }) => {
      setGridPosition(position);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
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
      </div>

      {/* Status */}
      <div className="fixed top-6 right-6 z-40">
        <div className="bg-gray-900 border border-yellow-500 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="fixed top-6 right-6 mt-16 z-30">
        <InstructionsPanel />
      </div>

      {/* Tools Panel - Left Bottom */}
      <ToolsPanel
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        onClearAll={clearAll}
      />

      {/* Canvas Area - Draggable Grid */}
      <CanvasArea
        pixels={pixels}
        currentColor={currentColor}
        mousePosition={mousePosition}
        onPixelClick={handlePixelClick}
        onMouseMove={handleMouseMove}
        gridPosition={gridPosition}
        onGridPositionChange={handleGridPositionChange}
      />

      {/* Drag Hint */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-gray-900/80 border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-300">
          Right-click + drag to move canvas
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-10 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse z-0"></div>
      <div className="fixed bottom-10 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping z-0"></div>
      <div className="fixed top-1/2 left-5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse z-0"></div>
    </div>
  );
};

export default PixelEditor;
