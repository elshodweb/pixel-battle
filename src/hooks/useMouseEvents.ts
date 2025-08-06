import { useCallback, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface UseMouseEventsOptions {
  throttleMs?: number;
  enableThrottling?: boolean;
}

export function useMouseEvents(options: UseMouseEventsOptions = {}) {
  const { throttleMs = 16, enableThrottling = true } = options;
  const lastCallRef = useRef<number>(0);
  const lastPositionRef = useRef<MousePosition | null>(null);

  const throttledCallback = useCallback(
    (callback: (position: MousePosition) => void, position: MousePosition) => {
      if (!enableThrottling) {
        callback(position);
        return;
      }

      const now = Date.now();
      if (now - lastCallRef.current >= throttleMs) {
        lastCallRef.current = now;
        lastPositionRef.current = position;
        callback(position);
      }
    },
    [throttleMs, enableThrottling]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, callback: (position: MousePosition) => void) => {
      const position = { x: e.clientX, y: e.clientY };
      throttledCallback(callback, position);
    },
    [throttledCallback]
  );

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      callback: (position: MousePosition, button: number) => void
    ) => {
      const position = { x: e.clientX, y: e.clientY };
      callback(position, e.button);
    },
    []
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent, callback: (position: MousePosition) => void) => {
      const position = { x: e.clientX, y: e.clientY };
      callback(position);
    },
    []
  );

  return {
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    lastPosition: lastPositionRef.current,
  };
}
