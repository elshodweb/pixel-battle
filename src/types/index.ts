export interface PixelData {
  [key: string]: string;
}

export interface PixelStore {
  pixels: PixelData;
  currentColor: string;
  zoom: number;
  credits: number;
  ethBalance: string;
  walletAddress: string;
  setPixel: (x: number, y: number, color: string) => void;
  setCurrentColor: (color: string) => void;
  setZoom: (zoom: number) => void;
  setCredits: (credits: number) => void;
  clearAll: () => void;
}

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface VisibleRange {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
}

export interface ZoomControls {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomToFit: () => void;
}
