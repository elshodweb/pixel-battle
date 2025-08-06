export interface PixelData {
  [key: string]: string;
}

export interface PixelStore {
  pixels: PixelData;
  currentColor: string;
  setPixel: (x: number, y: number, color: string) => void;
  setCurrentColor: (color: string) => void;
  clearAll: () => void;
}
