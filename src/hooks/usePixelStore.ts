import { PixelData, PixelStore } from "@/types";
import { useCallback, useState, useRef, useEffect } from "react";
import {
  BATCH_UPDATE_DELAY,
  MIN_ZOOM,
  MAX_ZOOM,
  DEFAULT_ZOOM,
  GRID_SIZE,
  DEFAULT_ETH_BALANCE,
  DEFAULT_WALLET_ADDRESS,
  DEFAULT_CREDITS,
} from "@/constants";

const usePixelStore = (): PixelStore => {
  const [pixels, setPixels] = useState<PixelData>({});
  const [currentColor, setCurrentColorState] = useState<string>("#ff0000"); // Red as default
  const [zoom, setZoomState] = useState<number>(DEFAULT_ZOOM);
  const [credits, setCreditsState] = useState<number>(DEFAULT_CREDITS);
  const [ethBalance, setEthBalanceState] =
    useState<string>(DEFAULT_ETH_BALANCE);
  const [walletAddress, setWalletAddressState] = useState<string>(
    DEFAULT_WALLET_ADDRESS
  );
  const batchUpdatesRef = useRef<Map<string, string>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize Web Worker for large grids
  useEffect(() => {
    if (
      GRID_SIZE > 256 &&
      typeof Window !== "undefined" &&
      "Worker" in window
    ) {
      try {
        workerRef.current = new Worker(
          new URL("../workers/pixelWorker.ts", import.meta.url)
        );

        workerRef.current.onmessage = (event) => {
          const { type, data } = event.data;
          if (type === "BATCH_UPDATE") {
            setPixels((prev) => ({ ...prev, ...data }));
          }
        };
      } catch (error) {
        console.warn("Web Worker not available, falling back to main thread");
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const flushBatchUpdates = useCallback(() => {
    if (batchUpdatesRef.current.size > 0) {
      const updates = Object.fromEntries(batchUpdatesRef.current);

      // Always use main thread for instant Paint-like performance
      setPixels((prev) => ({ ...prev, ...updates }));
      batchUpdatesRef.current.clear();
    }
  }, []);

  const setPixel = useCallback((x: number, y: number, color: string) => {
    // Validate coordinates
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      return;
    }

    const key = `${x}-${y}`;

    // Instant update for Paint-like performance
    setPixels((prev) => ({ ...prev, [key]: color }));
  }, []);

  const setCurrentColor = useCallback((color: string) => {
    setCurrentColorState(color);
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    // Validate zoom level
    const validZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    setZoomState(validZoom);
  }, []);

  const setCredits = useCallback((newCredits: number) => {
    setCreditsState(Math.max(0, newCredits));
  }, []);

  const clearAll = useCallback(() => {
    // Clear any pending batch updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    batchUpdatesRef.current.clear();
    setPixels({});
  }, []);

  return {
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
  };
};

export default usePixelStore;
