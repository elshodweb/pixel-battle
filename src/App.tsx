"use client";

import { useCallback, useEffect, useState, memo } from "react";

import useSimpleCanvas from "./hooks/useSimpleCanvas";
import ToolsPanel from "./components/ToolsPanel";
import CanvasArea from "./components/CanvasArea";
import Header from "./components/Header";
import CenterText from "./components/CenterText";
import { GRID_WIDTH, GRID_HEIGHT, DEFAULT_ZOOM } from "./constants";

const PixelEditor: React.FC = memo(() => {
  const {
    currentColor,
    zoom,
    position,
    pixels,
    updateCounter,
    setPixel,
    setCurrentColor,
    setZoom,
    setPosition,
  } = useSimpleCanvas();

  const ethBalance = "0.0105";
  const walletAddress = "0x73..4e49";

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pixelCoordinates, setPixelCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // Центрирование канваса при загрузке с отступами для видимости тени
  useEffect(() => {
    if (typeof window !== "undefined") {
      const shadowMargin = 40; // Отступ для полной видимости тени (shadowBlur: 20 + shadowOffset: 8 + запас)
      const canvasWidth = GRID_WIDTH * zoom;
      const canvasHeight = GRID_HEIGHT * zoom;

      const centerX = Math.max(
        shadowMargin,
        (window.innerWidth - canvasWidth) / 2
      );
      const centerY = Math.max(
        shadowMargin + 64, // +64 для header
        (window.innerHeight - canvasHeight) / 2
      );

      setPosition({ x: centerX, y: centerY });
    }
  }, [setPosition, zoom]);

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

  const handlePositionChange = useCallback(
    (newPosition: { x: number; y: number }) => {
      setPosition(newPosition);
    },
    [setPosition]
  );

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      setZoom(newZoom);
    },
    [setZoom]
  );

  const [credits, setCredits] = useState(0);

  const handleCreditsChange = useCallback((newCredits: number) => {
    setCredits(newCredits);
  }, []);

  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      style={{ backgroundColor: "#100D20" }}
    >
      <Header ethBalance={ethBalance} walletAddress={walletAddress} />

      <CenterText />

      <CanvasArea
        pixels={pixels}
        updateCounter={updateCounter}
        currentColor={currentColor}
        zoom={zoom}
        position={position}
        mousePosition={mousePosition}
        pixelCoordinates={pixelCoordinates}
        onPixelClick={handlePixelClick}
        onZoomChange={handleZoomChange}
        onPositionChange={handlePositionChange}
        onMouseMove={handleMouseMove}
      />

      <ToolsPanel
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        credits={credits}
        onCreditsChange={handleCreditsChange}
      />

      <div className="fixed bottom-6 right-6 z-20">
        <div className="bg-gray-900/80 border border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-300">
          Alt + Scroll to zoom | Right-click + drag to move
        </div>
      </div>

      <div className="fixed top-10 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse z-0"></div>
      <div className="fixed bottom-10 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping z-0"></div>
      <div className="fixed top-1/2 left-5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse z-0"></div>
    </div>
  );
});

export default PixelEditor;
