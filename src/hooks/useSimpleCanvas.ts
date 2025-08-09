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
  recalculatePosition: () => void;
}

const useSimpleCanvas = (): SimpleCanvasStore => {
  const [currentColor, setCurrentColorState] = useState<string>("#ff0000");
  const [zoom, setZoomState] = useState<number>(DEFAULT_ZOOM);
  const [position, setPositionState] = useState({ x: 0, y: 0 });
  const [pixels, setPixels] = useState<Map<string, string>>(() => new Map());
  const [updateCounter, setUpdateCounter] = useState(0);

  const setPixel = useCallback((x: number, y: number, color: string) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return;

    const key = `${x}-${y}`;
    setPixels((prev) => {
      const newPixels = new Map(prev);
      newPixels.set(key, color);
      return newPixels;
    });
    setUpdateCounter((prev) => prev + 1);
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

  // Функция для пересчета позиции при изменении размеров сетки
  const recalculatePosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const shadowMargin = 40;
    const canvasWidth = GRID_WIDTH * zoom;
    const canvasHeight = GRID_HEIGHT * zoom;

    const centerX = Math.max(
      shadowMargin,
      (window.innerWidth - canvasWidth) / 2
    );
    const centerY = Math.max(
      shadowMargin + 64,
      (window.innerHeight - canvasHeight) / 2
    );

    // setPositionState({ x: centerX, y: centerY });
  }, [zoom]);

  const clearAll = useCallback(() => {
    setPixels(new Map());
    setUpdateCounter((prev) => prev + 1);
  }, []);

  return {
    currentColor,
    zoom,
    position,
    pixels,
    updateCounter,
    setPixel,
    setCurrentColor,
    setZoom,
    setPosition,
    clearAll,
    recalculatePosition,
  };
};

export default useSimpleCanvas;
