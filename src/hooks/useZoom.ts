import { useState, useCallback, useRef } from "react";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from "@/constants";

interface UseZoomOptions {
  initialZoom?: number;
  smoothZoom?: boolean;
  zoomStep?: number;
}

export function useZoom(options: UseZoomOptions = {}) {
  const {
    initialZoom = 1.0,
    smoothZoom = true,
    zoomStep = ZOOM_STEP,
  } = options;
  const [zoom, setZoomState] = useState(initialZoom);
  const animationRef = useRef<number | null>(null);

  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    setZoomState(clampedZoom);
  }, []);

  const zoomIn = useCallback(
    (step: number = zoomStep) => {
      setZoom(zoom + step);
    },
    [zoom, zoomStep, setZoom]
  );

  const zoomOut = useCallback(
    (step: number = zoomStep) => {
      setZoom(zoom - step);
    },
    [zoom, zoomStep, setZoom]
  );

  const zoomTo = useCallback(
    (targetZoom: number, duration: number = 300) => {
      if (!smoothZoom) {
        setZoom(targetZoom);
        return;
      }

      const startZoom = zoom;
      const startTime = performance.now();
      const clampedTargetZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, targetZoom)
      );

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        const currentZoom =
          startZoom + (clampedTargetZoom - startZoom) * easedProgress;
        setZoomState(currentZoom);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [zoom, smoothZoom, setZoom]
  );

  const resetZoom = useCallback(() => {
    zoomTo(1.0);
  }, [zoomTo]);

  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    zoomTo,
    resetZoom,
  };
}
