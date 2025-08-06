"use client";

import { useCallback, useEffect, useState, memo } from "react";
import usePixelStore from "./hooks/usePixelStore";
import ToolsPanel from "./components/ToolsPanel";
import CanvasArea from "./components/CanvasArea";
import Header from "./components/Header";
import CenterText from "./components/CenterText";
import { PIXEL_SIZE, DEFAULT_ZOOM } from "./constants";

const PixelEditor: React.FC = memo(() => {
  const {
    pixels,
    currentColor,
    zoom,
    credits,
    ethBalance,
    walletAddress,
    setPixel,
    setCurrentColor,
    setZoom,
    setCredits,
    clearAll,
  } = usePixelStore();

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pixelCoordinates, setPixelCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [gridPosition, setGridPosition] = useState<{ x: number; y: number }>({
    x: 400,
    y: 200,
  });

  // Set initial position after component mounts (client-side only)
  useEffect(() => {
    const centerX = window.innerWidth / 2 - (64 * PIXEL_SIZE * zoom) / 2;
    const centerY = window.innerHeight / 2 - (64 * PIXEL_SIZE * zoom) / 2;
    setGridPosition({ x: centerX, y: centerY });
  }, [zoom]);

  const handlePixelClick = useCallback(
    (x: number, y: number) => {
      setPixel(x, y, currentColor);
    },
    [setPixel, currentColor]
  );

  const handleMouseMove = useCallback(
    (x: number, y: number, pixelX?: number, pixelY?: number) => {
      setMousePosition({ x, y });
      if (pixelX !== undefined && pixelY !== undefined) {
        setPixelCoordinates({ x: pixelX, y: pixelY });
      }
    },
    []
  );

  const handleGridPositionChange = useCallback(
    (position: { x: number; y: number }) => {
      setGridPosition(position);
    },
    []
  );

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      setZoom(newZoom);
    },
    [setZoom]
  );

  const handleCreditsChange = useCallback(
    (newCredits: number) => {
      setCredits(newCredits);
    },
    [setCredits]
  );

  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: "#1a0a2e" }}
    >
      {/* Header */}
      <Header ethBalance={ethBalance} walletAddress={walletAddress} />

      {/* Center Text */}
      <CenterText />

      {/* Main Canvas Area */}
      <CanvasArea
        pixels={pixels}
        currentColor={currentColor}
        zoom={zoom}
        mousePosition={mousePosition}
        pixelCoordinates={pixelCoordinates}
        onPixelClick={handlePixelClick}
        onMouseMove={handleMouseMove}
        onZoomChange={handleZoomChange}
        gridPosition={gridPosition}
        onGridPositionChange={handleGridPositionChange}
      />

      {/* Tools Panel - Left Bottom */}
      <ToolsPanel
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        onClearAll={clearAll}
        credits={credits}
        onCreditsChange={handleCreditsChange}
      />

      {/* Instructions */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-gray-900/80 border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-300">
          Alt + Scroll to zoom | Right-click + drag to move
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-10 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse z-0"></div>
      <div className="fixed bottom-10 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping z-0"></div>
      <div className="fixed top-1/2 left-5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse z-0"></div>
    </div>
  );
});

export default PixelEditor;