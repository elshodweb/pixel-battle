import { useState, useCallback, useRef, useEffect } from "react";

interface UseOptimizedStateOptions<T> {
  debounceMs?: number;
  equalityFn?: (prev: T, next: T) => boolean;
}

export function useOptimizedState<T>(
  initialState: T,
  options: UseOptimizedStateOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { debounceMs = 0, equalityFn } = options;
  const [state, setState] = useState<T>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<T>(initialState);

  const setOptimizedState = useCallback(
    (value: T | ((prev: T) => T)) => {
      const newValue =
        typeof value === "function" ? (value as (prev: T) => T)(state) : value;

      // Check equality if equalityFn is provided
      if (equalityFn && equalityFn(lastValueRef.current, newValue)) {
        return;
      }

      if (debounceMs > 0) {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setState(newValue);
          lastValueRef.current = newValue;
        }, debounceMs);
      } else {
        setState(newValue);
        lastValueRef.current = newValue;
      }
    },
    [state, debounceMs, equalityFn]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, setOptimizedState];
}
