"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { GRID_WIDTH, GRID_HEIGHT, DEFAULT_ZOOM } from "@/constants";

export interface SimpleCanvasStore {
  currentColor: string;
  zoom: number;
  position: { x: number; y: number };
  pixels: Map<string, string>;
  updateCounter: number;
  setPixel: (x: number, y: number, color: string) => void;
  setCurrentColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  clearAll: () => void;
}

const useSimpleCanvas = (): SimpleCanvasStore => {
  const [currentColor, setCurrentColorState] = useState<string>("#ff0000");
  const [zoom, setZoomState] = useState<number>(DEFAULT_ZOOM);
  const [position, setPositionState] = useState({ x: 200, y: 200 });
  const [pixels, setPixels] = useState<Map<string, string>>(new Map());
  const [updateCounter, setUpdateCounter] = useState(0);

  // Инициализация с пустым канвасом
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newPixels = new Map<string, string>();
      setPixels(newPixels);
      console.log("Simple Canvas initialized with empty canvas");
    }
  }, []);

  const setPixel = useCallback((x: number, y: number, color: string) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return;

    const key = `${x}-${y}`;
    setPixels((prev) => {
      const newPixels = new Map(prev);
      newPixels.set(key, color);
      return newPixels;
    });
    setUpdateCounter((prev) => prev + 1);
    console.log(`Set pixel at ${x},${y} to ${color}`);
  }, []);

  const setCurrentColor = useCallback((color: string) => {
    setCurrentColorState(color);
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    setZoomState(Math.max(0.1, Math.min(5.0, newZoom)));
  }, []);

  const setPosition = useCallback((newPosition: { x: number; y: number }) => {
    setPositionState(newPosition);
  }, []);

  const clearAll = useCallback(() => {
    setPixels(new Map());
    setUpdateCounter((prev) => prev + 1); // Force re-render
    console.log("Canvas cleared");
  }, []);

  return {
    currentColor,
    zoom,
    position,
    pixels,
    updateCounter, // For forcing re-renders
    setPixel,
    setCurrentColor,
    setZoom,
    setPosition,
    clearAll,
  };
};

export default useSimpleCanvas;
