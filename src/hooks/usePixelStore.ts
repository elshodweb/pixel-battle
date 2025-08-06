import { PixelData, PixelStore } from "@/types";
import { useCallback, useState } from "react";

const usePixelStore = (): PixelStore => {
  const [pixels, setPixels] = useState<PixelData>({});
  const [currentColor, setCurrentColorState] = useState<string>("#ff0066");

  const setPixel = useCallback((x: number, y: number, color: string) => {
    const key = `${x}-${y}`;
    setPixels((prev) => ({ ...prev, [key]: color }));
  }, []);

  const setCurrentColor = useCallback((color: string) => {
    setCurrentColorState(color);
  }, []);

  const clearAll = useCallback(() => {
    setPixels({});
  }, []);

  return {
    pixels,
    currentColor,
    setPixel,
    setCurrentColor,
    clearAll,
  };
};
export default usePixelStore;
