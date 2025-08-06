// Fixed grid size - optimized for performance
export const GRID_SIZE = 256; // Reduced from 300 for better performance
export const PIXEL_SIZE = 8; // Reduced from 10 for better performance

// Performance optimization constants - optimized for instant drawing like Paint
export const BATCH_UPDATE_DELAY = 0; // Instant updates - no batching delay
export const VIEWPORT_BUFFER = 0; // No buffer for maximum performance

// Zoom constants for Alt+Scroll
export const MIN_ZOOM = 0.1; // 10% zoom
export const MAX_ZOOM = 5.0; // 500% zoom
export const ZOOM_STEP = 0.1; // Zoom increment
export const DEFAULT_ZOOM = 1.0; // 100% zoom

// UI constants
export const DEFAULT_ETH_BALANCE = "0.0105";
export const DEFAULT_WALLET_ADDRESS = "0x73..4e49";
export const DEFAULT_CREDITS = 0;

// Rendering optimization constants
export const SHOW_PIXEL_BORDERS = false; // Set to true to show pixel borders (slower rendering)
export const SHOW_GRID_BORDER = false; // Set to true to show grid border (slower rendering)
